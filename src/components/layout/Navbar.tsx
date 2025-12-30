import React from 'react';
import { Calculator, History, Settings, Users } from 'lucide-react';
import { cn } from '../../utils/cn';

export type Tab = 'input' | 'history' | 'settings' | 'players';

interface NavbarProps {
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function Navbar({ currentTab, onTabChange }: NavbarProps) {
    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: 'input', label: '入力', icon: Calculator },
        { id: 'history', label: '履歴', icon: History },
        { id: 'players', label: '対局者', icon: Users },
        { id: 'settings', label: '設定', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-6 left-4 right-4 z-50 glass-panel rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-slide-up">
            <div className="flex justify-around items-center px-2">
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                'flex flex-1 flex-col items-center py-3 text-[10px] font-semibold transition-all duration-300 interactive-button relative',
                                isActive
                                    ? 'text-brand'
                                    : 'text-slate-400 hover:text-slate-100'
                            )}
                            type="button"
                        >
                            {isActive && (
                                <div className="absolute top-0 w-8 h-1 bg-brand rounded-full blur-[2px]" />
                            )}
                            <tab.icon className={cn(
                                "h-6 w-6 mb-1 transition-transform duration-300",
                                isActive && "scale-110"
                            )} />
                            <span className="leading-none uppercase tracking-wider">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
