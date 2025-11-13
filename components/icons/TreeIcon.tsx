import React from 'react';

export const TreeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.42 2 5.5 4.03 5.5 7.51c0 2.21 1.25 4.25 3.1 5.42L7 22h10l-1.6-9.07c1.85-1.17 3.1-3.21 3.1-5.42C18.5 4.03 15.58 2 12 2z"/>
    </svg>
);
