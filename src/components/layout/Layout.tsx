import React from 'react';
import { Navbar, type Tab } from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
    return (
        <div className="min-h-screen bg-mesh text-slate-200">
            <main className="mx-auto max-w-md p-4 pb-28 min-h-screen box-border animate-fade-in">
                {children}
            </main>
            <Navbar currentTab={currentTab} onTabChange={onTabChange} />
        </div>
    );
}
