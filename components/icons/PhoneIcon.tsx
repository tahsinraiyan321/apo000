import React from 'react';

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.211-.998-.552-1.348l-1.956-1.956a2.25 2.25 0 00-3.182 0l-1.172 1.172a.75.75 0 01-1.061 0l-4.243-4.243a.75.75 0 010-1.06l1.172-1.172a2.25 2.25 0 000-3.182L6.848 4.602a2.25 2.25 0 00-1.348-.552H3.75A2.25 2.25 0 001.5 6.75v.75" />
    </svg>
);