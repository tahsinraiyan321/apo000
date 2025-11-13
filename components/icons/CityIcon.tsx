import React from 'react';

export const CityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.026.026.05.054.07.084a2.25 2.25 0 01-2.26 3.326H5.032a2.25 2.25 0 01-2.26-3.326c.02-.03.044-.058.07-.084L12 5.432zM10.5 16.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
    </svg>
);