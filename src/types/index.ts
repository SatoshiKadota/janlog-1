export type GameMode = '4ma' | '3ma';

export interface GameSettings {
    mode: GameMode;
    uma: number[]; // e.g., [20, 10, -10, -20]
    rate: number;
    basePoint: number; // e.g., 25000
    returnPoint: number; // e.g., 30000
    gameFee: number; // e.g., 500

    // 3-Player specific
    useConditional3maUma?: boolean;
    uma3maBelow30k?: number[];
    uma3maAbove30k?: number[];
}

export interface Player {
    id: string;
    name: string;
}

export interface ScoreResult {
    id: string;
    date: string;
    players: string[]; // Player IDs
    scores: number[]; // Raw scores (e.g. 35000)
    points: number[]; // Calculated points (e.g. +45)
    chips?: number[]; // Optional chips
    gameFee: number;
    feePoints?: number;
}
