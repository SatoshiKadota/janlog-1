import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import type { Player } from '../../types';

export function PlayerList() {
    const { players, setPlayers } = useApp();
    const [newPlayerName, setNewPlayerName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlayerName.trim()) return;

        // Check for duplicate names (optional but good UX)
        if (players.some(p => p.name === newPlayerName.trim())) {
            alert('同じ名前のプレイヤーが既に存在します');
            return;
        }

        const newPlayer: Player = {
            id: crypto.randomUUID(),
            name: newPlayerName.trim(),
        };

        setPlayers([...players, newPlayer]);
        setNewPlayerName('');
    };

    const handleDeletePlayer = (id: string) => {
        if (confirm('このプレイヤーを削除しますか？\n(過去の対局履歴の表示名には影響しません)')) {
            setPlayers(players.filter(p => p.id !== id));
        }
    };

    const startEditing = (player: Player) => {
        setEditingId(player.id);
        setEditingName(player.name);
    };

    const saveEditing = () => {
        if (!editingName.trim()) return;
        setPlayers(players.map(p => p.id === editingId ? { ...p, name: editingName.trim() } : p));
        setEditingId(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName('');
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold font-outfit text-emerald-400">プレイヤー管理</h2>

            <Card>
                <CardHeader>
                    <CardTitle>新規登録</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddPlayer} className="flex gap-2">
                        <Input
                            placeholder="名前を入力"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" disabled={!newPlayerName.trim()}>
                            追加
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>登録済みプレイヤー ({players.length}名)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {players.length === 0 ? (
                        <p className="text-emerald-800/60 text-center py-4">登録プレイヤーはいません</p>
                    ) : (
                        players.map(player => (
                            <div key={player.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-500/10 border-b border-emerald-900/30 last:border-0">
                                {editingId === player.id ? (
                                    <div className="flex gap-2 w-full">
                                        <Input
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="flex-1 h-8"
                                            autoFocus
                                        />
                                        <Button size="sm" variant="ghost" onClick={saveEditing}><Save size={16} /></Button>
                                        <Button size="sm" variant="ghost" onClick={cancelEditing}><X size={16} /></Button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium">{player.name}</span>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="ghost" onClick={() => startEditing(player)}><Edit2 size={16} className="text-gray-500" /></Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDeletePlayer(player.id)}><Trash2 size={16} className="text-red-400" /></Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
