import type { ScoreResult, Player } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Pencil, Trash2 } from 'lucide-react';

interface GameResultTableProps {
    title: string;
    results: ScoreResult[];
    players: Player[];
    showDate?: boolean;
    onEdit?: (result: ScoreResult) => void;
    onDelete?: (resultId: string) => void;
}

export function GameResultTable({ title, results, players, showDate = false, onEdit, onDelete }: GameResultTableProps) {
    // Sort results by date descending (should be passed in sorted, but safe to ensure)
    // Assuming results are already filtered for the context (e.g. today's games)

    const feeHeader = "場代";

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="p-2 border-b border-r min-w-[3rem]">回</th>
                                {showDate && <th className="p-2 border-b border-r min-w-[4rem]">時刻</th>}
                                {players.map(player => (
                                    <th key={player.id} className="p-2 border-b min-w-[5rem] font-medium whitespace-nowrap">
                                        {player.name}
                                    </th>
                                ))}
                                <th className="p-2 border-b border-l min-w-[4rem] text-gray-500">{feeHeader}</th>
                                {(onEdit || onDelete) && <th className="p-2 border-b border-l min-w-[4rem]">操作</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={players.length + (showDate ? 3 : 2) + ((onEdit || onDelete) ? 1 : 0)} className="p-4 text-gray-400">
                                        データがありません
                                    </td>
                                </tr>
                            ) : (
                                results.map((result, index) => {
                                    // Results are now Oldest first (Ascending)
                                    // Display game number in order: 1, 2, 3...
                                    const gameNumber = index + 1;
                                    const dateStr = new Date(result.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="p-2 border-r text-gray-500 text-xs">{gameNumber}</td>
                                            {showDate && <td className="p-2 border-r text-gray-500 text-xs">{dateStr}</td>}

                                            {players.map(player => {
                                                // Find index of this player in the result's player list
                                                const playerIndex = result.players.indexOf(player.id);
                                                const point = playerIndex >= 0 ? result.points[playerIndex] : null;

                                                return (
                                                    <td key={player.id} className="p-2">
                                                        {point !== null ? (
                                                            <span className={`font-bold ${point > 0 ? 'text-blue-600' : point < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                                {point > 0 ? '+' : ''}{point}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-200 dark:text-gray-700">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            <td className="p-2 border-l text-gray-400 text-xs">
                                                {result.feePoints !== undefined ? result.feePoints.toFixed(1) : (result.gameFee > 0 ? (result.gameFee / 100).toFixed(1) : '-')}
                                            </td>

                                            {(onEdit || onDelete) && (
                                                <td className="p-2 border-l">
                                                    <div className="flex justify-center gap-2">
                                                        {onEdit && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onEdit(result);
                                                                }}
                                                                className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                                                title="修正"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                        )}
                                                        {onDelete && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onDelete(result.id);
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                                title="削除"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}

                            {/* Total Row */}
                            {results.length > 0 && (
                                <tr className="bg-gray-50 dark:bg-gray-800 font-bold border-t border-gray-200 dark:border-gray-700">
                                    <td className="p-2 border-r" colSpan={showDate ? 2 : 1}>合計</td>
                                    {players.map(player => {
                                        const total = results.reduce((acc, r) => {
                                            const idx = r.players.indexOf(player.id);
                                            return acc + (idx >= 0 ? r.points[idx] : 0);
                                        }, 0);
                                        return (
                                            <td key={player.id} className="p-2">
                                                <span className={`${total > 0 ? 'text-blue-600' : total < 0 ? 'text-red-500' : ''}`}>
                                                    {total > 0 ? '+' : ''}{total.toFixed(1)}
                                                </span>
                                            </td>
                                        );
                                    })}
                                    <td className="p-2 border-l text-gray-500">
                                        {(() => {
                                            const totalFee = results.reduce((acc, r) => {
                                                if (r.feePoints !== undefined) return acc + r.feePoints;
                                                return acc + (r.gameFee || 0) / 100;
                                            }, 0);
                                            return totalFee > 0 ? totalFee.toFixed(1) : '-';
                                        })()}
                                    </td>
                                    {(onEdit || onDelete) && <td className="p-2 border-l"></td>}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
