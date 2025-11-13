import React from 'react';

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.5M4 6.253V18.5c0 .414.336.75.75.75h14.5a.75.75 0 00.75-.75V6.253m-16 0h16M4 6.253c0-1.5 1.5-2.75 3.25-2.75h9.5c1.75 0 3.25 1.25 3.25 2.75M4 6.253L2.5 5.5" />
    </svg>
);