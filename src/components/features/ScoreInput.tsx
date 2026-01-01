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
                        <div className="flex justify-between items-end">
                            <CardTitle className="text-2xl">{editingId ? '修正中の対局' : '対局結果'}</CardTitle>
                            <div className="text-xs font-bold font-outfit text-white uppercase tracking-widest">
                                TOTAL: <span className="text-white text-sm">{inputScores.reduce((a, b) => a + Number(b), 0)}</span> / {settings.basePoint * playerCount}
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
                            <div key={i} className="grid grid-cols-[1fr_130px_90px] gap-4 items-end p-5 rounded-2xl bg-emerald-950/30 border border-emerald-900/20 hover:border-brand/40 hover:bg-emerald-950/50 transition-all group shadow-sm">
                                <div className="space-y-1.5 min-w-0">
                                    <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest ml-1">{i + 1}着 (仮)</label>
                                    <select
                                        className="w-full h-11 rounded-xl border border-emerald-900/50 bg-emerald-950/60 px-3 text-sm font-semibold text-emerald-50 focus:outline-none focus:ring-2 focus:ring-brand focus:shadow-neon transition-all appearance-none cursor-pointer"
                                        value={selectedPlayers[i]}
                                        onChange={(e) => handlePlayerSelect(i, e.target.value)}
                                    >
                                        <option value="" className="bg-emerald-950">選択...</option>
                                        {players.map(p => (
                                            <option key={p.id} value={p.id} className="bg-emerald-950">{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest ml-1">点数</label>
                                    <input
                                        type="number"
                                        step="100"
                                        className="w-full h-11 rounded-xl border border-emerald-900/50 bg-emerald-950/60 px-3 text-right font-outfit text-xl font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-brand focus:shadow-neon transition-all placeholder:text-emerald-950/20"
                                        value={inputScores[i]}
                                        onChange={(e) => handleScoreChange(i, e.target.value)}
                                        onFocus={(e) => (e.target as HTMLInputElement).select()}
                                    />
                                </div>
                                <div className={`h-11 flex items-center justify-end font-bold font-outfit text-xl ${previewPoints ? (previewPoints[i] > 0 ? 'text-emerald-400 glow-text' : previewPoints[i] < 0 ? 'text-rose-400' : 'text-emerald-900/40') : 'text-emerald-900/20'
                                    }`}>
                                    <div className="bg-emerald-950/30 px-2 py-0.5 rounded-lg border border-emerald-900/20 min-w-[3.5rem] text-right">
                                        {previewPoints ? (previewPoints[i] > 0 ? '+' : '') + previewPoints[i] : '-'}
                                    </div>
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
