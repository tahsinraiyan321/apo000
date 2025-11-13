import React from 'react';

export const GavelIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21H12V19H1V21M13.25 3L12.25 4L18.25 10L17.25 11L23.25 5L13.25 3M3 10L11 18L13 16L5 8L3 10Z" />
    </svg>
);