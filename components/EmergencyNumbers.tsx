import React, { useState } from 'react';
import { PhoneIcon } from './icons/PhoneIcon';
import { SearchIcon } from './icons/SearchIcon';

interface EmergencyNumbersProps {
    onPromptClick: (prompt: string) => void;
}

const EmergencyNumbers: React.FC<EmergencyNumbersProps> = ({ onPromptClick }) => {
    const [district, setDistrict] = useState('');
    const [upazila, setUpazila] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!district.trim()) {
            return;
        }

        const locationQuery = upazila.trim() 
            ? `District: ${district.trim()}, Upazila/Thana: ${upazila.trim()}`
            : `District: ${district.trim()}`;

        const taskInstruction = `Your task is to compile a directory of official emergency service numbers for a specific location in Bangladesh. Use Google Search to find the latest, working phone numbers for the Local Police Station (Thana), Fire Service Station, and major Ambulance Services. Present the results in a Markdown table with columns: "Service", "Phone Number", and "Source / Notes". You MUST include the national emergency number 999 and end with a disclaimer about verifying numbers.`;
        
        const finalPrompt = `${taskInstruction}\n\nLocation for lookup: **${locationQuery}**.`;

        onPromptClick(finalPrompt);
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <div className="mb-6 flex flex-col items-center">
                <div className="p-3 bg-rose-500/10 rounded-full mb-4">
                    <PhoneIcon className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-brand-dark dark:text-brand-light">জরুরি পরিষেবার নম্বর খুঁজুন</h3>
                <p className="text-brand-secondary-text dark:text-slate-400 mt-1 max-w-md">
                    আপনার জেলা এবং উপজেলা/থানার নাম লিখুন। আমরা পুলিশ, ফায়ার সার্ভিস ও হাসপাতালের মতো জরুরি পরিষেবাগুলির জন্য ফোন নম্বর খুঁজে দেব।
                </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4">
                <div className="relative">
                     <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="জেলা (e.g., ঢাকা)"
                        className="w-full p-4 border border-brand-border dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all font-bengali"
                        aria-label="District Name"
                        required
                    />
                </div>
                 <div className="relative">
                     <input
                        type="text"
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        placeholder="উপজেলা/থানা (e.g., মোহাম্মদপুর)"
                        className="w-full p-4 border border-brand-border dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all font-bengali"
                        aria-label="Upazila or Thana Name"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 text-base font-medium text-white bg-brand-green rounded-xl hover:bg-opacity-90 transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transform disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!district.trim()}
                >
                    <SearchIcon className="h-5 w-5" />
                    <span className="font-bengali">অনুসন্ধান করুন</span>
                </button>
            </form>
        </div>
    );
};

export default EmergencyNumbers;