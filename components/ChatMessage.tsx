import React, { useState } from 'react';
import { Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import SourcePill from './SourcePill';

interface ChatMessageProps {
    message: Message;
    onSuggestionClick: (prompt: string) => void;
    showSuggestions: boolean;
}

const BENGALI_DISCLAIMER_TEXT = "⚠️ দাবিত্যাগ: এটি শুধুমাত্র তথ্যগত উদ্দেশ্যে এবং আইনি পরামর্শ নয়। আইনি বিষয়ে অনুগ্রহ করে একজন যোগ্য আইনজীবীর সাথে পরামর্শ করুন।";
const ENGLISH_DISCLAIMER_TEXT = "⚠️ Disclaimer: This is for informational purposes only and is not legal advice. Please consult with a qualified lawyer for legal matters.";
const NO_SOURCE_WARNING_BENGALI = "⚠️ এই তথ্যটির কোনো উৎস প্রদান করা হয়নি। অনুগ্রহ করে স্বাধীনভাবে যাচাই করুন।";

const parseMarkdown = (text: string) => {
    // PRE-PROCESSING STEP: Aggressively remove any line that is just an empty list item.
    let processedText = text.replace(/^(?:\s*\*|\s*\d+\.)\s*$/gm, '');

    // Utility to parse basic inline markdown.
    const parseInline = (str: string) => {
        return str
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded px-1 py-0.5 font-mono">$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
    };

    // NEW: A dedicated parser for rich content within table cells.
    // It handles nested lists and ensures they are cleaned and formatted correctly.
    const parseCellContent = (cellText: string): string => {
        let content = cellText;

        // Unordered List parsing for cell content
        const ulRegex = /(?:^|\n)((?:\s*\*.*\n?)+)/g;
        content = content.replace(ulRegex, (match) => {
            const items = match.trim().split('\n')
                .map(item => item.replace(/^\s*\* ?/, '').trim())
                .filter(c => c !== '' && c !== '*') // Filter empty/placeholder items
                .map(c => parseInline(c));
            if (items.length === 0) return '';
            return `<ul class="list-disc list-inside my-1">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        });

        // Ordered List parsing for cell content
        const olRegex = /(?:^|\n)((?:\s*\d+\..*\n?)+)/g;
        content = content.replace(olRegex, (match) => {
            const items = match.trim().split('\n')
                .map(item => item.replace(/^\s*\d+\. ?/, '').trim())
                .filter(c => c !== '' && c !== '*') // Filter empty/placeholder items
                .map(c => parseInline(c));
            if (items.length === 0) return '';
            return `<ol class="list-decimal list-inside my-1">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        });

        // Split by generated HTML to avoid adding <br> inside them or re-parsing them.
        const parts = content.split(/(<(?:ul|ol) class=.*?>.*?<\/(?:ul|ol)>)/s);
        return parts.map(part => {
            if (part.startsWith('<ul') || part.startsWith('<ol')) {
                return part; // Return list HTML as is
            }
            // For remaining plain text, parse inline elements and convert newlines to <br>
            return parseInline(part).replace(/\n/g, '<br />');
        }).join('');
    };

    // Block: Standard Markdown Tables
    const tableRegex = /^\|(.+)\r?\n\|( *[-:]+[-| :]*)\r?\n((?:\|.*(?:\r?\n|$))+)/gm;
    processedText = processedText.replace(tableRegex, (match, header, separator, body) => {
        const splitRaw = (rowStr: string): string[] => {
            let cleaned = rowStr.trim();
            if (cleaned.startsWith('|')) cleaned = cleaned.substring(1);
            if (cleaned.endsWith('|')) cleaned = cleaned.slice(0, -1);
            return cleaned.split('|').map(cell => cell.trim());
        };
        
        const headerCellsRaw = splitRaw(`|${header}`);
        const numColumns = headerCellsRaw.length;
        if (numColumns === 0) return match;

        const bodyRowsRaw = body.trim().split('\n').map(rowStr => {
            const cells = splitRaw(rowStr);
            while (cells.length < numColumns) cells.push('');
            return cells.slice(0, numColumns);
        });

        const validBodyRowsRaw = bodyRowsRaw.filter(row => row.some(cell => cell !== '' && cell !== '*'));
        
        // THE FIX: Use the new cell parser for body cells
        const validBodyRows = validBodyRowsRaw.map(row => row.map(cell => parseCellContent(cell)));
        
        if (validBodyRows.length === 0) return '';

        const headerCells = headerCellsRaw.map(cell => parseInline(cell));
        const headerHtml = `<thead><tr>${headerCells.map(cell => `<th class="bg-slate-50 dark:bg-slate-700 p-2 border border-brand-border dark:border-slate-600 text-left font-semibold text-sm text-brand-dark dark:text-brand-light">${cell}</th>`).join('')}</tr></thead>`;
        const bodyHtml = `<tbody>${validBodyRows.map(row => `<tr class="odd:bg-white even:bg-slate-50/50 dark:odd:bg-slate-800 dark:even:bg-slate-700/50">${row.map(cell => `<td class="p-2 border border-brand-border dark:border-slate-600 text-sm text-brand-dark dark:text-brand-light">${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
        return `<div class="overflow-x-auto my-4 rounded-lg border border-brand-border dark:border-slate-600 shadow-sm"><table class="w-full border-collapse">${headerHtml}${bodyHtml}</table></div>`;
    });

    // Block: Unordered Lists (for top-level lists outside tables)
    const ulRegex = /(?:^|\n)((?:\s*\*.*\n?)+)/g;
    processedText = processedText.replace(ulRegex, (match) => {
        const items = match.trim().split('\n')
            .map(item => item.replace(/^\s*\* ?/, '').trim())
            .filter(content => content !== '' && content !== '*');

        if (items.length === 0) return '';
        const listItemsHtml = items.map(itemContent => `<li>${parseInline(itemContent)}</li>`).join('');
        return `<ul class="list-disc list-inside my-2 pl-4 space-y-1">${listItemsHtml}</ul>`;
    });

    // Block: Ordered Lists (for top-level lists outside tables)
    const olRegex = /(?:^|\n)((?:\s*\d+\..*\n?)+)/g;
    processedText = processedText.replace(olRegex, (match) => {
        const items = match.trim().split('\n')
            .map(item => item.replace(/^\s*\d+\. ?/, '').trim())
            .filter(content => content !== '' && content !== '*');

        if (items.length === 0) return '';
        const listItemsHtml = items.map(itemContent => `<li>${parseInline(itemContent)}</li>`).join('');
        return `<ol class="list-decimal list-inside my-2 pl-4 space-y-1">${listItemsHtml}</ol>`;
    });

    // Process remaining text into paragraphs
    const remainingHtml = processedText.split(/\n\s*\n/).map(paragraph => {
        if (paragraph.startsWith('<ul') || paragraph.startsWith('<ol') || paragraph.startsWith('<div')) {
            return paragraph;
        }
        if (paragraph.trim() === '') {
            return '';
        }
        return `<p>${parseInline(paragraph).replace(/\n/g, '<br />')}</p>`;
    }).join('');

    return remainingHtml;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestionClick, showSuggestions }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const isModel = message.role === 'model';
    const isCompleteModelMessage = isModel && message.content !== '...';
    const hasSources = message.sources && message.sources.length > 0;
    const hasSuggestions = showSuggestions && message.suggestions && message.suggestions.length > 0;
    const showNoSourceWarning = isCompleteModelMessage && !hasSources;

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content.trim()).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    };

    const formattedContent = parseMarkdown(message.content);
    const hasBengali = /[\u0980-\u09FF]/.test(message.content);
    const disclaimer = hasBengali ? BENGALI_DISCLAIMER_TEXT : ENGLISH_DISCLAIMER_TEXT;

    if (isModel && message.content === '...') {
        return (
            <div className="flex items-start space-x-4">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-brand-green rounded-full text-white">
                    <BotIcon />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-3 max-w-xl animate-pulse">
                    <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-start space-x-4 ${isModel ? '' : 'justify-end'}`}>
            {isModel && (
                 <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-brand-green rounded-full text-white">
                    <BotIcon />
                </div>
            )}
            <div
                className={`rounded-2xl p-3 max-w-xl break-words ${isModel ? 'bg-white dark:bg-slate-700 border border-brand-border dark:border-slate-600 shadow-sm text-brand-dark dark:text-brand-light' : 'bg-brand-green text-white'}`}
            >
                <div 
                    className={`prose prose-sm max-w-none font-bengali space-y-4 ${!isModel ? 'prose-invert prose-a:text-white prose-strong:text-white' : 'dark:prose-invert dark:prose-a:text-blue-400 dark:prose-strong:text-white'}`}
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                />

                {isCompleteModelMessage && (
                    <div className="mt-4 pt-4 border-t border-brand-border/80 dark:border-slate-600/80">
                         <div className="flex justify-end mb-4">
                             <button
                                onClick={handleCopy}
                                className="p-1.5 rounded-full text-gray-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-600 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
                                aria-label="Copy to clipboard"
                            >
                                {isCopied ? <CheckIcon /> : <CopyIcon />}
                            </button>
                        </div>
                        <div className="space-y-4">
                            {showNoSourceWarning && (
                                 <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-md border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-500/30">
                                    {NO_SOURCE_WARNING_BENGALI}
                                </div>
                            )}
                            
                            {hasSources && (
                                <div>
                                    <h4 className="text-xs font-semibold text-brand-secondary-text dark:text-slate-400 mb-2">Sources:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {message.sources.map((source, index) => (
                                            <SourcePill key={index} uri={source.uri} title={source.title} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hasSuggestions && (
                                <div>
                                    <div className="flex flex-wrap gap-2">
                                        {message.suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => onSuggestionClick(suggestion)}
                                                className="bg-white dark:bg-slate-800 text-brand-dark dark:text-brand-light border border-brand-border dark:border-slate-600 text-sm px-3 py-1.5 rounded-xl hover:bg-brand-green/10 hover:border-brand-accent/50 dark:hover:bg-brand-green/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-1 font-medium"
                                                aria-label={`Ask: ${suggestion}`}
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-md border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-500/30 !mt-4">
                                {disclaimer}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {!isModel && (
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-200 dark:bg-slate-600 rounded-full text-slate-600 dark:text-slate-200">
                    <UserIcon />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;