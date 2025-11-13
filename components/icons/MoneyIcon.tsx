import React from 'react';

export const MoneyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3v10.5a3 3 0 01-3 3H5.25a3 3 0 01-3-3V5.25zm1.5 0v10.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z" clipRule="evenodd" />
        <path d="M3.75 19.5a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
    </svg>
);