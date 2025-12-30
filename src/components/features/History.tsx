import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { GameResultTable } from './GameResultTable';
import { ConfirmationModal } from '../ui/ConfirmationModal';

export function History() {
    const { players, results, setResults } = useApp();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Calculate Aggregates
    const playerStats = players.map(player => {
        const games = results.filter(r => r.players.includes(player.id));
        const totalPoints = games.reduce((acc, game) => {
            const idx = game.players.indexOf(player.id);
            return acc + (idx >= 0 ? game.points[idx] : 0);
        }, 0);

        return {
            id: player.id,
            name: player.name,
            games: games.length,
            totalPoints: totalPoints
        };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    // Group Results by Date (YYYY-MM-DD)
    const groupedResults = results.reduce<Record<string, typeof results>>((acc, result) => {
        // Use ISO string for consistent sorting and grouping
        const date = result.date.split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(result);
        return acc;
    }, {});


    const promptDelete = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = () => {
        if (deletingId) {
            setResults(results.filter(r => r.id !== deletingId));
            setDeletingId(null);
        }
    };

    // Sort dates Descending (Newest First)
    const dates = Object.keys(groupedResults).sort((a, b) => b.localeCompare(a));

    // Also sort the results within each date Ascending (Oldest First)
    dates.forEach(date => {
        groupedResults[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold font-outfit text-emerald-400">戦績履歴</h2>

            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle>通算成績</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-sm text-center border-collapse">
                            <thead className="bg-emerald-950/80 text-emerald-500/80 text-[10px] font-bold uppercase tracking-wider border-b border-emerald-900/40">
                                <tr>
                                    <th className="px-4 py-3">順位</th>
                                    <th className="px-4 py-3">名前</th>
                                    <th className="px-4 py-3">対局数</th>
                                    <th className="px-4 py-3">合計</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-900/20">
                                {playerStats.map((stat, i) => (
                                    <tr key={stat.id} className="hover:bg-emerald-500/5 transition-colors">
                                        <td className="px-4 py-3 text-emerald-900/60 font-outfit">{i + 1}</td>
                                        <td className="px-4 py-3 font-bold text-emerald-100">{stat.name}</td>
                                        <td className="px-4 py-3 text-emerald-400/60 font-outfit">{stat.games}</td>
                                        <td className={`px-4 py-3 font-bold font-outfit text-base ${stat.totalPoints > 0 ? 'text-emerald-400' : stat.totalPoints < 0 ? 'text-rose-400' : 'text-emerald-900/40'}`}>
                                            {stat.totalPoints > 0 ? '+' : ''}{stat.totalPoints.toFixed(1)}
                                        </td>
                                    </tr>
                                ))}
                                {playerStats.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-12 text-center text-emerald-900/40">データがありません</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Tables */}
            <h3 className="text-lg font-bold font-outfit text-emerald-400/80 ml-1">対局ログ</h3>
            {dates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">履歴はありません</p>
            ) : (
                dates.map(date => (
                    <GameResultTable
                        key={date}
                        title={date}
                        results={groupedResults[date]}
                        players={players}
                        showDate={true}
                        onDelete={promptDelete}
                    />
                ))
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
