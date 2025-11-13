import React from 'react';

export const ScanIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 21V3a2 2 0 012-2h8a2 2 0 012 2v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
    </svg>
);