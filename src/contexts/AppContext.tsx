import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { GameSettings, Player, ScoreResult } from '../types';

interface AppState {
    settings: GameSettings;
    setSettings: (settings: GameSettings) => void;
    players: Player[];
    setPlayers: (players: Player[]) => void;
    results: ScoreResult[];
    setResults: (results: ScoreResult[]) => void;
}

const defaultSettings: GameSettings = {
    mode: '4ma',
    uma: [20, 10, -10, -20],
    rate: 50,
    basePoint: 25000,
    returnPoint: 30000,
    gameFee: 0,
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useLocalStorage<GameSettings>('janlog_settings', defaultSettings);
    const [players, setPlayers] = useLocalStorage<Player[]>('janlog_players', []);
    const [results, setResults] = useLocalStorage<ScoreResult[]>('janlog_results', []);

    // 異常値の自動クレンジング (2500030000問題など)
    useEffect(() => {
        if (settings.basePoint > 1000000 || settings.returnPoint > 1000000 || typeof settings.basePoint === 'string') {
            setSettings({
                ...settings,
                basePoint: Number(settings.basePoint) > 1000000 ? 25000 : Number(settings.basePoint),
                returnPoint: Number(settings.returnPoint) > 1000000 ? 30000 : Number(settings.returnPoint),
            });
        }
    }, [settings, setSettings]);

    return (
        <AppContext.Provider value={{ settings, setSettings, players, setPlayers, results, setResults }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
