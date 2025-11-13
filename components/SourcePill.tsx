import React from 'react';
import { LinkIcon } from './icons/LinkIcon';

interface SourcePillProps {
    uri: string;
    title: string;
}

const SourcePill: React.FC<SourcePillProps> = ({ uri, title }) => {
    const displayTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;

    return (
        <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl px-3 py-1 text-xs text-brand-secondary-text dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title={title}
        >
            <LinkIcon />
            <span className="truncate">{displayTitle}</span>
        </a>
    );
};

export default SourcePill;