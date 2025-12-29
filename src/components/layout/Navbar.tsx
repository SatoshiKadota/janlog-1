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
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-safe dark:border-gray-800 dark:bg-gray-950">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            'flex flex-1 flex-col items-center py-3 text-xs font-medium transition-colors touch-manipulation',
                            currentTab === tab.id
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                        )}
                        type="button"
                    >
                        <tab.icon className="h-6 w-6 mb-1" />
                        <span className="leading-none">{tab.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
