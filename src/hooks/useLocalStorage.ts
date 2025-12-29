import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>(() => {
        try {
            const saved = localStorage.getItem(key);
            if (saved !== null) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error parsing local storage key “' + key + '”:', e);
        }
        return defaultValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error setting local storage key “' + key + '”:', e);
        }
    }, [key, value]);

    return [value, setValue] as const;
};
