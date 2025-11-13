import React from 'react';
import { PassportIcon } from './icons/PassportIcon';
import { OfficeBuildingIcon } from './icons/OfficeBuildingIcon';
import { WorkerIcon } from './icons/WorkerIcon';
import { TreeIcon } from './icons/TreeIcon';
import { MoneyIcon } from './icons/MoneyIcon';
import { CityIcon } from './icons/CityIcon';

interface LegalLiteracyProps {
    onPromptClick: (prompt: string) => void;
}

const literacyTopics = [
    {
        title: "পাসপোর্ট আবেদন",
        prompt: "ই-পাসপোর্টের জন্য অনলাইনে আবেদন করার ধাপগুলো কী কী এবং পুলিশ ভেরিফিকেশনের জন্য কী করতে হবে?",
        icon: <PassportIcon />,
        description: "নতুন ই-পাসপোর্ট প্রাপ্তি এবং নবায়নের সম্পূর্ণ নির্দেশিকা।"
    },
    {
        title: "কোম্পানি নিবন্ধন",
        prompt: "বাংলাদেশে একটি প্রাইভেট লিমিটেড কোম্পানি নিবন্ধন করার জন্য কী কী কাগজপত্র প্রয়োজন এবং RJSC-তে প্রক্রিয়াটি কী?",
        icon: <OfficeBuildingIcon />,
        description: "যৌথ মূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তরে (RJSC) কোম্পানি খোলার নিয়ম।"
    },
    {
        title: "শ্রমিকদের অধিকার",
        prompt: "বাংলাদেশ শ্রম আইন অনুযায়ী একজন শ্রমিকের ন্যূনতম মজুরি, দৈনিক কর্মঘণ্টা এবং ছুটির নিয়মগুলো কী কী?",
        icon: <WorkerIcon />,
        description: "কর্মক্ষেত্রে আপনার আইনগত অধিকার ও সুরক্ষা সম্পর্কে জানুন।"
    },
    {
        title: "পরিবেশগত আইন",
        prompt: "ইটভাটা স্থাপনের জন্য পরিবেশগত ছাড়পত্র পাওয়ার নিয়ম কী? পরিবেশ সংরক্ষণ আইন, ১৯৯৫ এই বিষয়ে কী বলে?",
        icon: <TreeIcon />,
        description: "পরিবেশ দূষণ রোধ এবং সুরক্ষায় বিদ্যমান আইনসমূহ।"
    },
    {
        title: "চেক ডিজঅনার মামলা",
        prompt: "ব্যাংকে চেক ডিজঅনার হলে Negotiable Instruments Act, 1881 অনুযায়ী আইনি পদক্ষেপ নেওয়ার প্রক্রিয়া কী?",
        icon: <MoneyIcon />,
        description: "চেক প্রত্যাখ্যানের শিকার হলে আপনার করণীয় ও আইনি সুরক্ষা।"
    },
    {
        title: "ফ্ল্যাট নিবন্ধন",
        prompt: "নতুন ফ্ল্যাট কেনার পর রেজিস্ট্রেশন এবং নামজারি করার সম্পূর্ণ খরচ ও প্রক্রিয়া বিস্তারিতভাবে জানান।",
        icon: <CityIcon />,
        description: "ফ্ল্যাট বা অ্যাপার্টমেন্ট কেনা-বেচার আইনি প্রক্রিয়া ও খরচ।"
    }
];

const LegalLiteracy: React.FC<LegalLiteracyProps> = ({ onPromptClick }) => {
    return (
        <div className="w-full max-w-3xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {literacyTopics.map((topic) => (
                    <button
                        key={topic.title}
                        onClick={() => onPromptClick(topic.prompt)}
                        className="bg-white dark:bg-slate-800/50 text-left p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-700/50 border border-brand-border dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full hover:border-brand-green/50 dark:hover:border-brand-accent/50"
                    >
                        <div className="flex-grow">
                             <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-brand-secondary-text dark:text-slate-300">
                                {React.cloneElement(topic.icon, { className: 'w-6 h-6' })}
                            </div>
                            <p className="font-semibold text-brand-dark dark:text-brand-light font-bengali mt-3">{topic.title}</p>
                            <p className="text-sm text-brand-secondary-text dark:text-slate-400 font-bengali mt-1">{topic.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LegalLiteracy;