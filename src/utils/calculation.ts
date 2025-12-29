import type { GameSettings } from '../types';

/**
 * Perform "Go-sha Ruku-nyuu" rounding (5捨6入)
 * x500 -> down to x000
 * x600 -> up to (x+1)000
 */
export const roundScore = (score: number): number => {
    const mod = score % 1000;
    if (mod <= 500) {
        return score - mod;
    } else {
        return score - mod + 1000;
    }
};

interface CalculationResult {
    points: number[];
    errors: string[];
    feePoints?: number;
}

export const calculatePoints = (
    scores: number[],
    settings: GameSettings
): CalculationResult => {
    const playerCount = settings.mode === '4ma' ? 4 : 3;

    // Basic Validation
    if (scores.length !== playerCount) {
        return { points: [], errors: ['プレイヤー人数が正しくありません'] };
    }

    // Check total score matches expected total
    const expectedTotal = settings.basePoint * playerCount;
    const currentTotal = scores.reduce((a, b) => a + b, 0);

    if (currentTotal !== expectedTotal) {
        return {
            points: [],
            errors: [`点数合計が一致しません (現在: ${currentTotal}, 想定: ${expectedTotal}, 差分: ${currentTotal - expectedTotal})`]
        };
    }

    // Check if Top Score >= 40000
    if (Math.max(...scores) < 40000) {
        return {
            points: [],
            errors: ['トップの点数が40,000点未満です。']
        };
    }

    // Create an array of indices to sort
    const indices = Array.from({ length: playerCount }, (_, i) => i);
    // Sort indices based on scores
    indices.sort((a, b) => {
        if (scores[b] !== scores[a]) {
            return scores[b] - scores[a];
        }
        // Kamicha priority (Tie-breaker)
        return a - b;
    });

    // Calculate Points
    const roundedScores = scores.map(roundScore);
    const rawPoints = roundedScores.map(s => (s - settings.returnPoint) / 1000);

    // Apply Uma
    let uma = settings.uma;

    if (settings.mode === '3ma' && settings.useConditional3maUma) {
        const secondPlaceIndex = indices[1];
        const secondPlaceScore = scores[secondPlaceIndex];

        if (secondPlaceScore < 30000) {
            uma = settings.uma3maBelow30k || [30, -10, -20];
        } else {
            uma = settings.uma3maAbove30k || [20, 10, -30];
        }
    }

    const finalPoints = new Array(playerCount).fill(0);
    let totalPointsExcludingTop = 0;

    for (let i = 1; i < playerCount; i++) {
        const playerIndex = indices[i];
        const rankUma = uma[i] || 0;
        const p = rawPoints[playerIndex] + rankUma;
        finalPoints[playerIndex] = p;
        totalPointsExcludingTop += p;
    }

    const topPlayerIndex = indices[0];
    let topPoints = 0 - totalPointsExcludingTop;

    // Deduct Game Fee from Top
    // 1000 Pts (Score) = Rate (Yen)
    // 1 Point (Result, 1000 score) = Rate (Yen)
    // FeePoints = FeeYen / Rate
    let feePoints = 0;
    if (settings.gameFee > 0 && settings.rate > 0) {
        feePoints = settings.gameFee / settings.rate;
        topPoints -= feePoints;
    }

    finalPoints[topPlayerIndex] = topPoints;

    return { points: finalPoints, errors: [], feePoints };
};
