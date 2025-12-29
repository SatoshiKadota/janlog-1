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
        const date = new Date(result.date).toLocaleDateString('ja-JP');
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

    // Sort dates Ascending (Oldest First)
    const dates = Object.keys(groupedResults).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Also sort the results within each date Ascending (Oldest First)
    dates.forEach(date => {
        groupedResults[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold">戦績履歴</h2>

            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle>通算成績</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500">
                                <tr>
                                    <th className="px-4 py-2 font-medium">順位</th>
                                    <th className="px-4 py-2 font-medium">名前</th>
                                    <th className="px-4 py-2 font-medium">対局数</th>
                                    <th className="px-4 py-2 font-medium">合計</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {playerStats.map((stat, i) => (
                                    <tr key={stat.id}>
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2 font-medium">{stat.name}</td>
                                        <td className="px-4 py-2 text-gray-500">{stat.games}</td>
                                        <td className={`px-4 py-2 font-bold ${stat.totalPoints > 0 ? 'text-blue-600' : stat.totalPoints < 0 ? 'text-red-500' : ''}`}>
                                            {stat.totalPoints > 0 ? '+' : ''}{stat.totalPoints.toFixed(1)}
                                        </td>
                                    </tr>
                                ))}
                                {playerStats.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">データがありません</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Tables */}
            <h3 className="text-lg font-bold">対局ログ</h3>
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
