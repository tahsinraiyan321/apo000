import React from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { FilePdfIcon } from './icons/FilePdfIcon';
import { ScanIcon } from './icons/ScanIcon';

interface DocumentScannerProps {
    onUploadClick: (acceptType: string) => void;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ onUploadClick }) => {
    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <div className="mb-6 flex flex-col items-center">
                <div className="p-3 bg-brand-green/10 rounded-full mb-4">
                    <ScanIcon className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-brand-dark dark:text-brand-light">যেকোনো ডকুমেন্ট স্ক্যান করুন</h3>
                <p className="text-brand-secondary-text dark:text-slate-400 mt-1 max-w-md">
                    যেকোনো ধরণের ডকুমেন্ট (অফিসিয়াল, আইনি, বা সাধারণ) আপলোড করে তথ্য বের করুন বা ব্যাখ্যা জানুন। এখানে কোনো প্রশ্ন করতে বাধা নেই।
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                    onClick={() => onUploadClick('image/*')}
                    className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-brand-border dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-green/50 dark:hover:border-brand-accent/50"
                >
                    <ImageIcon />
                    <span className="mt-2 text-sm font-semibold text-brand-dark dark:text-brand-light">Upload Image</span>
                </button>
                <button
                    onClick={() => onUploadClick('.txt,.md,.rtf')}
                    className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-brand-border dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-green/50 dark:hover:border-brand-accent/50"
                >
                    <FileTextIcon />
                    <span className="mt-2 text-sm font-semibold text-brand-dark dark:text-brand-light">Upload Text File</span>
                </button>
                <button
                    onClick={() => onUploadClick('.pdf')}
                    className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-brand-border dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-green/50 dark:hover:border-brand-accent/50"
                >
                    <FilePdfIcon />
                    <span className="mt-2 text-sm font-semibold text-brand-dark dark:text-brand-light">Upload PDF</span>
                </button>
            </div>
        </div>
    );
};

export default DocumentScanner;