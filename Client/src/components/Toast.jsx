import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    let bgClass = 'bg-primary text-background-dark shadow-[0_4px_15px_rgba(13,227,242,0.3)]';
    let icon = 'info';

    if (type === 'success') {
        bgClass = 'bg-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]';
        icon = 'check_circle';
    } else if (type === 'error') {
        bgClass = 'bg-rose-500 text-white shadow-[0_4px_15px_rgba(244,63,94,0.3)]';
        icon = 'error';
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm ${bgClass}`}>
                <span className="material-symbols-outlined text-lg">{icon}</span>
                {message}
            </div>
        </div>
    );
}
