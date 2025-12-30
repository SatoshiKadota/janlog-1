import { useApp } from '../../contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function Settings() {
    const { settings, setSettings } = useApp();

    const handleModeChange = (mode: '4ma' | '3ma') => {
        setSettings({ ...settings, mode });
    };

    const handleChange = (key: keyof typeof settings, value: number) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleUmaChange = (index: number, value: number) => {
        const newUma = [...settings.uma];
        newUma[index] = value;
        setSettings({ ...settings, uma: newUma });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold font-outfit text-emerald-400">設定</h2>

            <Card>
                <CardHeader>
                    <CardTitle>ゲームモード</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            variant={settings.mode === '4ma' ? 'primary' : 'outline'}
                            onClick={() => handleModeChange('4ma')}
                        >
                            4人麻雀
                        </Button>
                        <Button
                            className="flex-1"
                            variant={settings.mode === '3ma' ? 'primary' : 'outline'}
                            onClick={() => handleModeChange('3ma')}
                        >
                            3人麻雀
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>基本ルール</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        label="持ち点"
                        type="number"
                        value={settings.basePoint}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            // 万が一文字列結合されて100万を超えた場合などはバリバリに制限をかける
                            if (val > 1000000) return;
                            handleChange('basePoint', val);
                        }}
                    />
                    <Input
                        label="返し点"
                        type="number"
                        value={settings.returnPoint}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > 1000000) return;
                            handleChange('returnPoint', val);
                        }}
                    />
                    <Input
                        label="レート (1000点あたりの円)"
                        type="number"
                        value={settings.rate}
                        step="10"
                        onChange={(e) => handleChange('rate', Number(e.target.value))}
                    />
                    <Input
                        label="ゲーム代 (円)"
                        type="number"
                        value={settings.gameFee}
                        step="100"
                        onChange={(e) => handleChange('gameFee', Number(e.target.value))}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>ウマ設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {settings.mode === '3ma' && (
                        <div className="flex items-center space-x-2 pb-4 border-b border-emerald-900/30">
                            <input
                                type="checkbox"
                                id="conditionalUma"
                                checked={!!settings.useConditional3maUma}
                                onChange={(e) => setSettings({ ...settings, useConditional3maUma: e.target.checked })}
                                className="h-4 w-4 rounded border-emerald-800 bg-emerald-950/60 text-emerald-500 focus:ring-brand accent-emerald-500"
                            />
                            <label htmlFor="conditionalUma" className="text-sm font-medium text-emerald-50/80">
                                2位が30000点未満で変動させる
                            </label>
                        </div>
                    )}

                    {!settings.useConditional3maUma || settings.mode === '4ma' ? (
                        <div className="grid grid-cols-2 gap-4">
                            {settings.uma.map((value, index) => (
                                <Input
                                    key={index}
                                    label={`${index + 1}位`}
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleUmaChange(index, Number(e.target.value))}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-wider ml-1 block mb-1">2位 &lt; 30000点 (Aパターン)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(settings.uma3maBelow30k || [30, -10, -20]).map((value, index) => (
                                        <Input
                                            key={`below-${index}`}
                                            label={`${index + 1}位`}
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                                const newUma = [...(settings.uma3maBelow30k || [30, -10, -20])];
                                                newUma[index] = Number(e.target.value);
                                                setSettings({ ...settings, uma3maBelow30k: newUma });
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-wider ml-1 block mb-1">2位 &gt;= 30000点 (Bパターン)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(settings.uma3maAbove30k || [20, 10, -30]).map((value, index) => (
                                        <Input
                                            key={`above-${index}`}
                                            label={`${index + 1}位`}
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                                const newUma = [...(settings.uma3maAbove30k || [20, 10, -30])];
                                                newUma[index] = Number(e.target.value);
                                                setSettings({ ...settings, uma3maAbove30k: newUma });
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-900/40 text-center py-8 font-bold">
                JanLog v0.1.0
            </div>
        </div>
    );
}
