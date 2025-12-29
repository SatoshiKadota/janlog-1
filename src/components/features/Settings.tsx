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
            <h2 className="text-xl font-bold">設定</h2>

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
                        onChange={(e) => handleChange('basePoint', Number(e.target.value))}
                    />
                    <Input
                        label="返し点"
                        type="number"
                        value={settings.returnPoint}
                        onChange={(e) => handleChange('returnPoint', Number(e.target.value))}
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
                        <div className="flex items-center space-x-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <input
                                type="checkbox"
                                id="conditionalUma"
                                checked={!!settings.useConditional3maUma}
                                onChange={(e) => setSettings({ ...settings, useConditional3maUma: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label htmlFor="conditionalUma" className="text-sm font-medium">
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
                                <label className="text-xs font-bold text-gray-500 block mb-2">2位 &lt; 30000点 (Aパターン)</label>
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
                                <label className="text-xs font-bold text-gray-500 block mb-2">2位 &gt;= 30000点 (Bパターン)</label>
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

            <div className="text-sm text-gray-500 text-center pb-4">
                JanLog v0.1.0
            </div>
        </div>
    );
}
