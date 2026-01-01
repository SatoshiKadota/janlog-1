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
            <CardContent className="p-0 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-sm text-center border-collapse">
                        <thead>
                            <tr className="bg-emerald-950/80 border-b border-emerald-900/40 text-white uppercase tracking-wider text-[10px] font-bold">
                                <th className="p-3 min-w-[3rem]">回</th>
                                {showDate && <th className="p-3 min-w-[4rem]">時刻</th>}
                                {players.map(player => (
                                    <th key={player.id} className="p-3 min-w-[5rem] font-bold whitespace-nowrap text-emerald-100">
                                        {player.name}
                                    </th>
                                ))}
                                <th className="p-3 min-w-[4rem] text-white font-bold">{feeHeader}</th>
                                {(onEdit || onDelete) && <th className="p-3 min-w-[4rem]">操作</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-900/10">
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={players.length + (showDate ? 3 : 2) + ((onEdit || onDelete) ? 1 : 0)} className="p-8 text-emerald-900/40">
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
                                        <tr key={result.id} className="hover:bg-emerald-500/5 transition-colors group">
                                            <td className="p-3 text-white text-[10px] font-outfit">{gameNumber}</td>
                                            {showDate && <td className="p-3 text-white text-[10px] font-outfit uppercase">{dateStr}</td>}

                                            {players.map(player => {
                                                const playerIndex = result.players.indexOf(player.id);
                                                const point = playerIndex >= 0 ? result.points[playerIndex] : null;

                                                return (
                                                    <td key={player.id} className="p-3">
                                                        {point !== null ? (
                                                            <span className={`font-bold font-outfit text-base ${point > 0 ? 'text-emerald-400' : point < 0 ? 'text-rose-400' : 'text-emerald-900/40'}`}>
                                                                {point > 0 ? '+' : ''}{point}
                                                            </span>
                                                        ) : (
                                                            <span className="text-emerald-950/20">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            <td className="p-3 text-white text-[10px] font-outfit">
                                                {result.feePoints !== undefined ? result.feePoints.toFixed(1) : (result.gameFee > 0 ? (result.gameFee / 100).toFixed(1) : '-')}
                                            </td>

                                            {(onEdit || onDelete) && (
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                                        {onEdit && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onEdit(result);
                                                                }}
                                                                className="text-emerald-500/40 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-emerald-500/10 transition-all"
                                                                title="修正"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                        )}
                                                        {onDelete && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onDelete(result.id);
                                                                }}
                                                                className="text-emerald-500/40 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                                                                title="削除"
                                                            >
                                                                <Trash2 size={14} />
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
                                <tr className="bg-emerald-950/40 font-bold border-t border-emerald-900/40">
                                    <td className="p-3 text-white text-[10px] uppercase tracking-wider" colSpan={showDate ? 2 : 1}>合計</td>
                                    {players.map(player => {
                                        const total = results.reduce((acc, r) => {
                                            const idx = r.players.indexOf(player.id);
                                            return acc + (idx >= 0 ? r.points[idx] : 0);
                                        }, 0);
                                        return (
                                            <td key={player.id} className="p-3">
                                                <span className={`font-outfit text-base ${total > 0 ? 'text-emerald-400' : total < 0 ? 'text-rose-400' : 'text-emerald-900/40'}`}>
                                                    {total > 0 ? '+' : ''}{total.toFixed(1)}
                                                </span>
                                            </td>
                                        );
                                    })}
                                    <td className="p-3 text-white font-outfit text-[10px]">
                                        {(() => {
                                            const totalFee = results.reduce((acc, r) => {
                                                if (r.feePoints !== undefined) return acc + r.feePoints;
                                                return acc + (r.gameFee || 0) / 100;
                                            }, 0);
                                            return totalFee > 0 ? totalFee.toFixed(1) : '-';
                                        })()}
                                    </td>
                                    {(onEdit || onDelete) && <td className="p-3"></td>}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
