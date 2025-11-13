import React from 'react';

const features = [
    { title: "জমির পরিমাণ যাচাই", icon: "📏", description: "জরিপ রিপোর্ট বা ম্যাপ থেকে জমির পরিমাণ গণনা করে।", prompt: "Calculate the land volume from the attached survey report." },
    { title: "দাগ নম্বর যাচাই", icon: "🗺️", description: "দাগ নম্বর বের করে এবং সামঞ্জস্যের জন্য যাচাই করে।", prompt: "Verify the Plot Number (Dag No.) from the attached document." },
    { title: "খতিয়ান নম্বর যাচাই", icon: "🧾", description: "খতিয়ান নম্বর শনাক্ত ও যাচাই করে।", prompt: "Verify the Khatiyan Number from the attached document." },
    { title: "মৌজার তথ্য যাচাই", icon: "📍", description: "মৌজার নাম ও কোড নিশ্চিত করে, অমিল থাকলে চিহ্নিত করে।", prompt: "Verify the Mouza information from the attached document." },
    { title: "জমির নকশা যাচাই", icon: "🧭", description: "জমির নকশার বিবরণ অন্যান্য রেকর্ডের সাথে মিলে কিনা তা পরীক্ষা করে।", prompt: "Verify the land map details from the attached file and check for inconsistencies." },
    { title: "RS/CS/SA রেকর্ড যাচাই", icon: "📚", description: "রেকর্ডের ধরন শনাক্ত করে এবং সংস্করণ ইতিহাস পরীক্ষা করে।", prompt: "Identify the record type and check the revision history from the attached RS/CS/SA records." },
    { title: "জমির শ্রেণি যাচাই", icon: "🌾", description: "জমির ধরন সংক্রান্ত সাংঘর্ষিক তথ্যের বিষয়ে সতর্ক করে।", prompt: "Check the land type classification in the attached document and alert me about any conflicting information." },
    { title: "দলিল যাচাইকরণ", icon: "✍️", description: "দলিলের বিবরণ সামঞ্জস্য এবং সম্পূর্ণতার জন্য পরীক্ষা করে।", prompt: "Verify the attached deed for consistency and completeness." },
    { title: "নামজারি যাচাই", icon: "🔄", description: "নামজারির বিবরণ এবং মালিকানা হালনাগাদ যাচাই করে।", prompt: "Verify the Namjari details and any ownership updates from the attached mutation document." },
    { title: "দলিলের সত্যতা যাচাই", icon: "🔐", description: "ডিজিটাল স্বাক্ষর, সম্পাদনা বা জালিয়াতির জন্য বিশ্লেষণ করে।", prompt: "Analyze the attached document for authenticity. Check for digital signatures, edits, or signs of forgery." },
];

interface DocumentAnalysisFeaturesProps {
    onPromptClick: (prompt: string) => void;
}

const DocumentAnalysisFeatures: React.FC<DocumentAnalysisFeaturesProps> = ({ onPromptClick }) => {
    return (
        <div className="w-full max-w-3xl mx-auto text-center">
            <div className="mb-6">
                <h3 className="text-lg font-bold font-bengali text-brand-dark dark:text-brand-light">দলিল বিশ্লেষণ করুন</h3>
                <p className="text-brand-secondary-text dark:text-slate-400 mt-1">
                    আপনার জমি বা আইনি দলিল আপলোড করে স্বয়ংক্রিয়ভাবে বিশ্লেষণ করুন। নিচের আইকনটি ব্যবহার করে ফাইল যুক্ত করুন।
                </p>
                 <div className="inline-flex items-center space-x-2 mt-3 text-sm bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                    <span>চ্যাট বক্সে এই আইকনটি খুঁজুন:</span>
                    <span className="p-2 text-gray-600 bg-white dark:bg-slate-800 dark:text-gray-200 rounded-full shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </span>
                 </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {features.map((feature) => (
                    <button
                        key={feature.title}
                        onClick={() => onPromptClick(feature.prompt)}
                        className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-brand-border dark:border-slate-700 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-green/50 dark:hover:border-brand-accent/50"
                    >
                        <span className="text-2xl">{feature.icon}</span>
                        <p className="font-semibold text-brand-dark dark:text-brand-light font-bengali mt-2 text-sm">{feature.title}</p>
                        <p className="text-xs text-brand-secondary-text dark:text-slate-400 mt-1 font-bengali">{feature.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DocumentAnalysisFeatures;