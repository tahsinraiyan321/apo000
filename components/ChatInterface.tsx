import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Part } from '@google/genai';
import { Message } from '../types';
import { sendMessageStream } from '../services/geminiService';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import { SendIcon } from './icons/SendIcon';
import { SearchIcon } from './icons/SearchIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { v4 as uuidv4 } from 'uuid';
import { ImageIcon } from './icons/ImageIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { FilePdfIcon } from './icons/FilePdfIcon';

interface ChatInterfaceProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const attachmentButtonRef = useRef<HTMLButtonElement>(null);
    const attachmentMenuRef = useRef<HTMLDivElement>(null);

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        hasRecognitionSupport,
        clearTranscript,
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setInput(prev => (prev ? prev.trim() + ' ' : '') + transcript);
            clearTranscript(); // Consume the transcript
        }
    }, [transcript, clearTranscript]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!searchQuery) {
            scrollToBottom();
        }
    }, [messages, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isAttachmentMenuOpen &&
                attachmentMenuRef.current &&
                !attachmentMenuRef.current.contains(event.target as Node) &&
                attachmentButtonRef.current &&
                !attachmentButtonRef.current.contains(event.target as Node)
            ) {
                setIsAttachmentMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAttachmentMenuOpen]);

    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) {
            return messages;
        }
        return messages.filter(msg =>
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            if (event.target.files[0].size > 10 * 1024 * 1024) { // 10MB limit
                setError("File is too large. Please upload a file smaller than 10MB.");
                return;
            }
            setFile(event.target.files[0]);
            // Automatically trigger send if a file is selected from the welcome screen
            // We can't directly call handleSend here because the state update is async.
            // A useEffect watching `file` could work.
        }
        event.target.value = ''; // Allow re-selecting the same file
    };

    // Auto-send when a file is selected and there's no input
    useEffect(() => {
        if (file && !input.trim() && messages.length === 0) {
            handleSend();
        }
    }, [file]);

    const handleUploadOptionClick = (acceptType: string) => {
        if (fileInputRef.current) {
            setFile(null); // Reset previously selected file
            fileInputRef.current.accept = acceptType;
            fileInputRef.current.click();
        }
        setIsAttachmentMenuOpen(false);
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleSend = useCallback(async (prompt?: string) => {
        const messageContent = prompt || input;
        if ((!messageContent.trim() && !file) || isLoading) return;

        setSearchQuery('');
        setError(null);
        setIsLoading(true);

        const userMessageContent = file
            ? `${messageContent}\n\n[File Attached: ${file.name}]`.trim()
            : messageContent;

        const userMessage: Message = { id: uuidv4(), role: 'user', content: userMessageContent };
        
        const modelMessageId = uuidv4();
        const placeholderMessage: Message = { id: modelMessageId, role: 'model', content: '...', sources: [], suggestions: [] };

        setMessages(prev => [...prev, userMessage, placeholderMessage]);
        setInput('');
        setFile(null);

        try {
            const parts: Part[] = [];

            if (file) {
                const base64Data = await fileToBase64(file);
                parts.push({
                    inlineData: {
                        mimeType: file.type,
                        data: base64Data,
                    }
                });
            }
            
            let textPrompt = messageContent;
            if (file) {
                 if (messageContent.trim()) {
                    // User provided specific instructions with the file
                    textPrompt = messageContent;
                } else {
                    // User just uploaded a file without instructions, give a generic prompt.
                    textPrompt = `Please analyze the attached document. Follow your document analysis protocol to identify the document type, perform OCR on all text (including handwriting), extract all key information, and provide a summary.`;
                }
            }
            parts.push({ text: textPrompt });

            const stream = await sendMessageStream(parts);
            
            let fullResponseText = '';
            const collectedSources: { uri: string; title: string }[] = [];
            const seenUris = new Set<string>();
            
            for await (const chunk of stream) {
                fullResponseText += chunk.text;

                const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (newSources) {
                    newSources.forEach((source: any) => { 
                        if (source.web?.uri && !seenUris.has(source.web.uri)) {
                            seenUris.add(source.web.uri);
                            collectedSources.push({
                                uri: source.web.uri,
                                title: source.web.title || source.web.uri,
                            });
                        }
                    });
                }

                const suggestionsMatch = fullResponseText.match(/<suggestions>([\s\S]*)<\/suggestions>/);
                let contentToDisplay = fullResponseText;
                const extractedSuggestions: string[] = [];
    
                if (suggestionsMatch) {
                    contentToDisplay = fullResponseText.replace(suggestionsMatch[0], '').trim();
                    const suggestionText = suggestionsMatch[1];
                    const suggestionMatches = [...suggestionText.matchAll(/<suggestion>(.*?)<\/suggestion>/g)];
                    suggestionMatches.forEach(match => {
                        if (match[1]) extractedSuggestions.push(match[1].trim());
                    });
                }

                setMessages(prev => prev.map(msg => 
                    msg.id === modelMessageId ? { 
                        ...msg, 
                        content: contentToDisplay, 
                        sources: [...collectedSources], 
                        suggestions: extractedSuggestions
                    } : msg
                ));
            }

        } catch (err) {
            let userFriendlyMessage: string;
            let detailedError: string;

            const getErrorMessage = (e: unknown): string => {
                if (e instanceof Error) return e.message;
                try {
                    if (typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string') {
                        return e.message;
                    }
                    return JSON.stringify(e);
                } catch {
                    return String(e);
                }
            };
            
            const errorMessage = getErrorMessage(err);

            if (errorMessage.includes('429') || /RESOURCE_EXHAUSTED/i.test(errorMessage) || /quota exceeded/i.test(errorMessage)) {
                let userFriendlyRetry = " অনুগ্রহ করে আগামীকাল আবার চেষ্টা করুন।"; // "Please try again tomorrow."
                let detailedRetry = " Please try again tomorrow.";

                const retryMatch = errorMessage.match(/Please retry in ([\d.hms]+)/);
                if (retryMatch && retryMatch[1]) {
                    const duration = retryMatch[1];
                    userFriendlyRetry = ` অনুগ্রহ করে প্রায় ${duration.replace(/h/g, ' ঘণ্টা ').replace(/m/g, ' মিনিট ').replace(/s/g, ' সেকেন্ড ')} পরে আবার চেষ্টা করুন।`;
                    detailedRetry = ` Please retry in about ${duration.replace(/h/g, ' hours ').replace(/m/g, ' minutes ').replace(/s/g, ' seconds ')}.`;
                }

                userFriendlyMessage = `দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না কারণ আমার দৈনিক ব্যবহারের সীমা পূর্ণ হয়েছে।${userFriendlyRetry}`;
                detailedError = `Daily API quota exceeded.${detailedRetry} You can monitor your usage at https://ai.dev/usage.`;
            } else {
                userFriendlyMessage = "দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে।";
                detailedError = `An unexpected error occurred. Details: ${errorMessage}`;
            }

            setError(detailedError);
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, content: userFriendlyMessage } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, setMessages, file, messages.length]);

    const handlePromptClick = (prompt: string) => {
        setSearchQuery('');
        handleSend(prompt);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <WelcomeScreen onPromptClick={handlePromptClick} onUploadClick={handleUploadOptionClick} />
                ) : (
                    <>
                        <div className="sticky top-0 z-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg mb-4 -mx-4 -mt-4 px-4 pt-4 pb-2 border-b border-brand-border dark:border-slate-700">
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search conversation..."
                                    className="w-full p-2 pl-10 border border-brand-border dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                                    aria-label="Search conversation history"
                                />
                             </div>
                        </div>
                        <div className="space-y-4 pt-4">
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((msg) => (
                                    <ChatMessage 
                                        key={msg.id} 
                                        message={msg} 
                                        onSuggestionClick={handlePromptClick}
                                        showSuggestions={msg.role === 'model' && msg.id === messages[messages.length - 1]?.id}
                                    />
                                ))
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                                    <p>No messages found for your search.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
                <div ref={chatEndRef} />
            </div>
            {error && <div className="p-4 text-brand-red bg-rose-100 border-t border-rose-200 text-sm">{error}</div>}
            <div className="border-t border-brand-border/80 dark:border-slate-700/80 p-3 sm:p-4 bg-brand-light/70 dark:bg-slate-900/70 backdrop-blur-xl">
                 {file && (
                    <div className="mb-2 flex items-center justify-between bg-brand-green/10 p-2 rounded-lg text-sm text-brand-dark dark:text-brand-light border border-brand-green/20">
                        <span className="truncate" title={file.name}>
                            File: <strong>{file.name}</strong>
                        </span>
                        <button
                            onClick={removeFile}
                            className="text-gray-500 dark:text-gray-400 hover:text-brand-red p-1 rounded-full flex-shrink-0"
                            aria-label="Remove file"
                        >
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-green p-0.5 shadow-lg">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-[15px] p-1"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            aria-hidden="true"
                        />
                         <div className="relative">
                            <button
                                ref={attachmentButtonRef}
                                type="button"
                                onClick={() => setIsAttachmentMenuOpen(prev => !prev)}
                                disabled={isLoading}
                                className="p-3 text-gray-500 hover:text-brand-green disabled:text-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-0 rounded-full hover:bg-brand-green/10 dark:text-gray-400 dark:hover:text-brand-accent dark:hover:bg-slate-700"
                                aria-label="Attach file"
                                aria-haspopup="true"
                                aria-expanded={isAttachmentMenuOpen}
                            >
                                <PaperclipIcon />
                            </button>
                            {isAttachmentMenuOpen && (
                                <div
                                    ref={attachmentMenuRef}
                                    className="absolute bottom-full mb-2 w-52 origin-bottom-left rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700 dark:ring-slate-600 z-20"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="menu-button"
                                >
                                    <ul className="space-y-1" role="none">
                                        <li>
                                            <button
                                                onClick={() => handleUploadOptionClick('image/*')}
                                                className="flex w-full items-center space-x-3 rounded-lg p-2 text-left text-sm text-brand-dark transition-colors hover:bg-slate-100 dark:text-brand-light dark:hover:bg-slate-600"
                                                role="menuitem"
                                            >
                                                <ImageIcon />
                                                <span>Upload Image</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleUploadOptionClick('.txt,.md,.rtf')}
                                                className="flex w-full items-center space-x-3 rounded-lg p-2 text-left text-sm text-brand-dark transition-colors hover:bg-slate-100 dark:text-brand-light dark:hover:bg-slate-600"
                                                role="menuitem"
                                            >
                                                <FileTextIcon />
                                                <span>Upload text file</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => handleUploadOptionClick('.pdf')}
                                                className="flex w-full items-center space-x-3 rounded-lg p-2 text-left text-sm text-brand-dark transition-colors hover:bg-slate-100 dark:text-brand-light dark:hover:bg-slate-600"
                                                role="menuitem"
                                            >
                                                <FilePdfIcon />
                                                <span>Upload PDF</span>
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="mt-2 border-t border-brand-border pt-2 text-center dark:border-slate-600">
                                        <p className="text-xs text-brand-secondary-text dark:text-slate-400">Max file size: 10MB</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "আপনার প্রশ্ন জিজ্ঞাসা করুন (Ask your question)..."}
                            className="flex-grow p-3 border-none rounded-xl focus:outline-none focus:ring-0 transition-all w-full bg-transparent dark:text-brand-light placeholder-slate-500 dark:placeholder-slate-400"
                            disabled={isLoading}
                        />
                        {hasRecognitionSupport && (
                            <button
                                type="button"
                                onClick={isListening ? stopListening : startListening}
                                disabled={isLoading}
                                className={`p-3 rounded-full transition-colors focus:outline-none focus:ring-0 ${
                                    isListening 
                                    ? 'bg-brand-red text-white animate-pulse' 
                                    : 'text-gray-500 hover:text-brand-green hover:bg-brand-green/10 dark:text-gray-400 dark:hover:text-brand-accent dark:hover:bg-slate-700'
                                }`}
                                aria-label={isListening ? "Stop listening" : "Start voice input"}
                            >
                                <MicrophoneIcon />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading || (!input.trim() && !file)}
                            className="bg-brand-green text-white rounded-full p-3 hover:opacity-90 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transform hover:scale-110 active:scale-100 disabled:scale-100"
                            aria-label="Send Message"
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;