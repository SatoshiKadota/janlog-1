import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { calculatePoints } from '../../utils/calculation';
import { Save, X } from 'lucide-react';
import { GameResultTable } from './GameResultTable';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import type { ScoreResult } from '../../types';

export function ScoreInput() {
    const { settings, players, results, setResults } = useApp();
    const playerCount = settings.mode === '4ma' ? 4 : 3;

    // State
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>(Array(playerCount).fill(''));
    const [inputScores, setInputScores] = useState<string[]>(Array(playerCount).fill(String(settings.basePoint)));
    const [previewPoints, setPreviewPoints] = useState<number[] | null>(null);
    const [previewFeePoints, setPreviewFeePoints] = useState<number | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    // Deleting State
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter Today's Results
    const todayResults = results.filter(r => {
        const d = new Date(r.date);
        const now = new Date();
        return d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    useEffect(() => {
        if (players.length >= playerCount && selectedPlayers[0] === '' && !editingId) {
            setSelectedPlayers(players.slice(0, playerCount).map(p => p.id));
        }
    }, [players, playerCount, editingId]);

    // Reset inputs when mode changes, IF not editing
    useEffect(() => {
        if (!editingId) {
            setInputScores(Array(playerCount).fill(String(settings.basePoint)));
            setSelectedPlayers(prev => {
                const newSize = Array(playerCount).fill('');
                prev.slice(0, playerCount).forEach((id, i) => newSize[i] = id);
                return newSize;
            });
        }
    }, [playerCount, settings.basePoint, editingId]);

    const handleScoreChange = (index: number, value: string) => {
        const newScores = [...inputScores];
        newScores[index] = value;
        setInputScores(newScores);
    };

    useEffect(() => {
        const scores = inputScores.map(s => Number(s));
        const res = calculatePoints(scores, settings);

        if (res.errors.length > 0) {
            setError(res.errors[0]);
            setPreviewPoints(null);
            setPreviewFeePoints(undefined);
        } else {
            setError(null);
            setPreviewPoints(res.points);
            setPreviewFeePoints(res.feePoints);
        }
    }, [inputScores, settings]);

    const handlePlayerSelect = (index: number, playerId: string) => {
        const newSelected = [...selectedPlayers];
        newSelected[index] = playerId;
        setSelectedPlayers(newSelected);
    };

    const handleEdit = (result: ScoreResult) => {
        setEditingId(result.id);

        const newSelected = Array(playerCount).fill('');
        const newScores = Array(playerCount).fill('0');

        result.players.forEach((pid, i) => {
            if (i < playerCount) newSelected[i] = pid;
        });
        result.scores.forEach((score, i) => {
            if (i < playerCount) newScores[i] = String(score);
        });

        setSelectedPlayers(newSelected);
        setInputScores(newScores);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setInputScores(Array(playerCount).fill(String(settings.basePoint)));
    };

    const promptDelete = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = () => {
        if (deletingId) {
            setResults(results.filter(r => r.id !== deletingId));
            if (editingId === deletingId) {
                cancelEdit();
            }
            setDeletingId(null);
        }
    };

    const handleSubmit = () => {
        if (!previewPoints) return;
        if (selectedPlayers.some(id => !id)) {
            alert('プレイヤーを選択してください');
            return;
        }
        if (new Set(selectedPlayers).size !== selectedPlayers.length) {
            alert('同一プレイヤーが選択されています');
            return;
        }

        if (editingId) {
            // Update existing
            const updatedResults = results.map(r => {
                if (r.id === editingId) {
                    return {
                        ...r,
                        players: selectedPlayers,
                        scores: inputScores.map(Number),
                        points: previewPoints,
                        gameFee: settings.gameFee
                    };
                }
                return r;
            });
            setResults(updatedResults);
            alert('修正しました');
            cancelEdit();
        } else {
            // Create New
            const newResult = {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                players: selectedPlayers,
                scores: inputScores.map(Number),
                points: previewPoints,
                gameFee: settings.gameFee,
                feePoints: previewFeePoints
            };

            setResults([newResult, ...results]);

            // Reset scores
            setInputScores(Array(playerCount).fill(String(settings.basePoint)));
            alert('保存しました');
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h2 className="text-xl font-bold">{editingId ? 'スコア修正' : 'スコア入力'}</h2>
                <Card className={editingId ? 'border-blue-500 border-2' : ''}>
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle>{editingId ? '修正中の対局' : '対局結果'}</CardTitle>
                            <div className="text-sm font-normal text-gray-500">
                                合計: {inputScores.reduce((a, b) => a + Number(b), 0)} / {settings.basePoint * playerCount}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                                {error}
                            </div>
                        )}

                        {Array.from({ length: playerCount }).map((_, i) => (
                            <div key={i} className="flex gap-2 items-end">
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-gray-500">{i + 1}着 (仮)</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                                        value={selectedPlayers[i]}
                                        onChange={(e) => handlePlayerSelect(i, e.target.value)}
                                    >
                                        <option value="">選択...</option>
                                        {players.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24 space-y-1">
                                    <label className="text-xs text-gray-500">点数</label>
                                    <input
                                        type="number"
                                        step="100"
                                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                                        value={inputScores[i]}
                                        onChange={(e) => handleScoreChange(i, e.target.value)}
                                        onFocus={(e) => e.target.select()}
                                    />
                                </div>
                                <div className={`w-14 h-10 flex items-center justify-end font-bold text-lg ${previewPoints ? (previewPoints[i] > 0 ? 'text-blue-600' : previewPoints[i] < 0 ? 'text-red-500' : 'text-gray-500') : 'text-gray-300'
                                    }`}>
                                    {previewPoints ? (previewPoints[i] > 0 ? '+' : '') + previewPoints[i] : '-'}
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 flex gap-3">
                            {editingId && (
                                <Button
                                    className="flex-1 h-12 text-lg bg-gray-500 hover:bg-gray-600"
                                    onClick={cancelEdit}
                                >
                                    <X className="mr-2 h-5 w-5" />
                                    キャンセル
                                </Button>
                            )}
                            <Button
                                className="flex-1 h-12 text-lg"
                                disabled={!!error || !previewPoints}
                                onClick={handleSubmit}
                            >
                                <Save className="mr-2 h-5 w-5" />
                                {editingId ? '修正を保存' : '結果を保存'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Results Table */}
            {todayResults.length > 0 && (
                <GameResultTable
                    title="本日の結果"
                    results={todayResults}
                    players={players}
                    showDate={true}
                    onEdit={handleEdit}
                    onDelete={promptDelete}
                />
            )}

            <ConfirmationModal
                isOpen={!!deletingId}
                title="対局結果の削除"
                message="この対局結果を削除しますか？"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingId(null)}
            />
        </div>
    );
}
