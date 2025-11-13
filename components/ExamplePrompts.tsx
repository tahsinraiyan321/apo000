import React from 'react';
import { UsersIcon } from './icons/UsersIcon';
import { PoliceCapIcon } from './icons/PoliceCapIcon';
import { GavelIcon } from './icons/GavelIcon';
import { ScrollIcon } from './icons/ScrollIcon';

interface ExamplePromptsProps {
    onPromptClick: (prompt: string) => void;
}

const prompts = [
    {
        title: "সম্পত্তির উত্তরাধিকার",
        prompt: "মুসলিম উত্তরাধিকার আইন অনুযায়ী বাবা-মায়ের সম্পত্তিতে ছেলে ও মেয়ের অংশ কতটুকু? বিস্তারিত ব্যাখ্যা করুন।",
        icon: <UsersIcon />
    },
    {
        title: "অনলাইন জিডি করা",
        prompt: "অনলাইনে জেনারেল ডায়েরি (জিডি) করার সম্পূর্ণ প্রক্রিয়াটি কী? এর জন্য কোন ওয়েবসাইটে যেতে হবে?",
        icon: <PoliceCapIcon />
    },
    {
        title: "এজাহার বা মামলা দায়ের",
        prompt: "থানায় প্রথম তথ্য বিবরণী বা এজাহার (FIR) দায়ের করার সঠিক পদ্ধতি কী এবং এর জন্য কী কী তথ্য প্রয়োজন?",
        icon: <GavelIcon />
    },
    {
        title: "দলিলের ভাষা বোঝা",
        prompt: "আমার দলিলের একটি বাক্য হলো: 'উক্ত বিক্রয় কবলা দলিলে বর্ণিত তপসিলভুক্ত ও চৌহদ্দিযুক্ত নিম্নবর্ণিত সম্পত্তি'। এর সহজ অর্থ কী?",
        icon: <ScrollIcon />
    }
];


const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onPromptClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
            {prompts.map((p) => (
                <button
                    key={p.title}
                    onClick={() => onPromptClick(p.prompt)}
                    className="bg-white dark:bg-slate-800/50 text-left p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-700/50 border border-brand-border dark:border-slate-700 transition-all duration-300 flex items-start space-x-4 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-green/50 dark:hover:border-brand-accent/50"
                >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-brand-secondary-text dark:text-slate-300">
                        {React.cloneElement(p.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                        <p className="font-semibold text-brand-dark dark:text-brand-light font-bengali">{p.title}</p>
                        <p className="text-sm text-brand-secondary-text dark:text-slate-400 font-bengali mt-1">{p.prompt}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ExamplePrompts;