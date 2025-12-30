import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("glass-card rounded-2xl overflow-hidden", className)}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("p-6 pb-0", className)}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <h3 className={cn("text-lg font-bold font-outfit tracking-tight text-white", className)}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    );
}
