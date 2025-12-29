import React from 'react';
import { Navbar, type Tab } from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <main className="mx-auto max-w-md p-4 pb-24 min-h-screen box-border">
                {children}
            </main>
            <Navbar currentTab={currentTab} onTabChange={onTabChange} />
        </div>
    );
}
