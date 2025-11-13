import React, { useState } from 'react';
import { FactCheckIcon } from './icons/FactCheckIcon';
import { SearchIcon } from './icons/SearchIcon';

interface RumorScannerProps {
    onPromptClick: (prompt: string) => void;
}

const RumorScanner: React.FC<RumorScannerProps> = ({ onPromptClick }) => {
    const [rumorText, setRumorText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rumorText.trim()) return;

        const factCheckPrompt = `
CRITICAL TASK: FACT-CHECKING.
You are a neutral, unbiased fact-checker for Bangladesh. Your sole purpose is to verify the following user-submitted text.
1. **Analyze the Claim:** Identify the primary claim(s) in the text.
2. **Search for Evidence:** You MUST use the \`googleSearch\` tool extensively. Prioritize credible sources: major news outlets (e.g., Prothom Alo, The Daily Star, BBC Bangla), government websites (.gov.bd), international news agencies (Reuters, AP, AFP), and recognized fact-checking organizations.
3. **Provide a Verdict:** Based on your research, give a clear, one-word verdict in Bengali: "সত্য" (True), "মিথ্যা" (False), "বিভ্রান্তিকর" (Misleading), "অপ্রমাণিত" (Unproven), or "সঠিক প্রেক্ষাপট নেই" (Missing Context).
4. **Explain Your Reasoning:** Provide a concise summary of the evidence you found that supports your verdict. Explain why the claim is true, false, or misleading.
5. **Cite All Sources:** List every source you used to make your determination.
6. **Maintain Neutrality:** Do not offer opinions or moral judgments. Stick to the facts.

User's text to verify: "${rumorText}"
`;

        onPromptClick(factCheckPrompt);
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <div className="mb-6 flex flex-col items-center">
                <div className="p-3 bg-indigo-500/10 rounded-full mb-4">
                    <FactCheckIcon className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-brand-dark dark:text-brand-light">গুজব যাচাই করুন</h3>
                <p className="text-brand-secondary-text dark:text-slate-400 mt-1 max-w-md">
                    ভিত্তিহীন খবর এবং অপপ্রচারের বিরুদ্ধে সত্য জানুন। এখানে সন্দেহজনক খবর বা তথ্য পেস্ট করে তার সত্যতা যাচাই করুন।
                </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4">
                <textarea
                    value={rumorText}
                    onChange={(e) => setRumorText(e.target.value)}
                    placeholder="এখানে সন্দেহজনক খবর বা গুজবটি লিখুন বা পেস্ট করুন..."
                    className="w-full p-4 border border-brand-border dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all font-bengali min-h-[120px] resize-y"
                    aria-label="Rumor or news to verify"
                    required
                />
                <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 text-base font-medium text-white bg-brand-green rounded-xl hover:bg-opacity-90 transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transform disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    disabled={!rumorText.trim()}
                >
                    <SearchIcon className="h-5 w-5" />
                    <span className="font-bengali">সত্যতা যাচাই করুন</span>
                </button>
            </form>
        </div>
    );
};

export default RumorScanner;