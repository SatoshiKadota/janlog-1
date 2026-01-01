import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-xs font-bold text-emerald-500/90 uppercase tracking-wider ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-11 w-full rounded-xl border border-emerald-900/50 bg-emerald-950/40 px-4 py-2 text-sm font-medium text-emerald-50 placeholder:text-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand/50 focus:shadow-neon transition-all disabled:opacity-50 interactive-button',
                        error && 'border-rose-500 focus:ring-rose-500',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';
