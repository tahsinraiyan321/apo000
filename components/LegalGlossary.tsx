import React, { useState, useMemo } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const glossaryTerms = [
    { term: "আমমোক্তারনামা (Power of Attorney)", definition: "একটি আইনি দলিল যার মাধ্যমে কোনো ব্যক্তি তার পক্ষে অন্য কোনো ব্যক্তিকে কোনো নির্দিষ্ট কাজ (যেমন: সম্পত্তি বিক্রি, মামলা পরিচালনা) করার ক্ষমতা অর্পণ করেন।" },
    { term: "আরজি (Plaint)", definition: "আদালতে মামলা দায়ের করার জন্য প্রথম যে লিখিত অভিযোগ বা আবেদনপত্র জমা দেওয়া হয়, তাকে আরজি বলে। এতে মামলার কারণ, বাদী-বিবাদীর বিবরণ এবং প্রার্থিত প্রতিকার উল্লেখ থাকে।" },
    { term: "ইনজাংশন (Injunction)", definition: "আদালতের একটি আদেশ, যার মাধ্যমে কোনো পক্ষকে কোনো নির্দিষ্ট কাজ করা থেকে বিরত থাকতে বা কোনো কাজ করতে বাধ্য করা হয়। একে নিষেধাজ্ঞাও বলা হয়।" },
    { term: "এজমালি সম্পত্তি (Joint Property)", definition: "একাধিক ব্যক্তির যৌথ মালিকানাধীন সম্পত্তি, যেখানে অংশীদারদের অংশ নির্দিষ্টভাবে ভাগ করা থাকে না। এই ধরনের সম্পত্তিকে এজমালি বা যৌথ সম্পত্তি বলা হয়।" },
    { term: "খতিয়ান (Record of Rights)", definition: "ভূমি জরিপ শেষে প্রত্যেক মালিকের জমির বিবরণ, অংশ এবং প্রদেয় খাজনার পরিমাণ উল্লেখ করে যে রেকর্ড বা স্বত্বলিপি প্রস্তুত করা হয়, তাকে খতিয়ান বলে। যেমন: সি.এস, এস.এ, আর.এস খতিয়ান।" },
    { term: "চৌহদ্দি (Boundaries)", definition: "কোনো জমির চারপাশের সীমানা, অর্থাৎ এর উত্তর, দক্ষিণ, পূর্ব এবং পশ্চিমে কী অবস্থিত তার বিবরণ। দলিলের জন্য এটি একটি অত্যন্ত গুরুত্বপূর্ণ অংশ।" },
    { term: "জামিন (Bail)", definition: "আদালতের নির্দেশে নির্দিষ্ট শর্তসাপেক্ষে বিচারাধীন কোনো অভিযুক্ত ব্যক্তিকে সাময়িকভাবে মুক্তি দেওয়াকে জামিন বলে। আদালত নির্ধারণ করেন জামিনযোগ্য কি না।" },
    { term: "জাবেদা নকল (Certified Copy)", definition: "আদালত বা সরকারি দপ্তর থেকে কোনো দলিলের অনুলিপি যখন ಅಧಿಕೃತভাবে সত্যায়িত করে প্রদান করা হয়, তখন তাকে জাবেদা নকল বলে। এটি মূল দলিলের মতোই আইনিভাবে গ্রহণযোগ্য।" },
    { term: "তফসিল (Schedule of Property)", definition: "কোনো দলিলে বর্ণিত সম্পত্তির বিস্তারিত বিবরণ, যেখানে জমির অবস্থান, চৌহদ্দি (সীমানা), পরিমাণ, দাগ নম্বর এবং খতিয়ান নম্বর উল্লেখ থাকে।" },
    { term: "ডিক্রি (Decree)", definition: "দেওয়ানী মামলায় আদালত চূড়ান্তভাবে উভয় পক্ষের অধিকার ও দায় নির্ধারণ করে যে সিদ্ধান্ত প্রদান করেন, তাকে ডিক্রি বলে।" },
    { term: "দাগ নং (Plot Number)", definition: "জরিপের সময় প্রতিটি জমিকে আলাদাভাবে শনাক্ত করার জন্য যে নম্বর দেওয়া হয়, তাকে দাগ নম্বর বা প্লট নম্বর বলে। এটি মৌজা নকশার একটি অপরিহার্য অংশ।" },
    { term: "দলিল (Deed)", definition: "যেকোনো প্রকারের আইনি চুক্তিপত্র, যা কোনো সম্পত্তির মালিকানা, অধিকার বা দায়বদ্ধতা প্রতিষ্ঠা করে। যেমন: বিক্রয় দলিল, দানপত্র দলিল ইত্যাদি।" },
    { term: "দেওয়ানী কার্যবিধি (Code of Civil Procedure)", definition: "দেওয়ানী বা ব্যক্তিগত অধিকার (যেমন: সম্পত্তি, চুক্তি) সংক্রান্ত মামলা কীভাবে দায়ের ও পরিচালিত হবে, সেই সম্পর্কিত আইন। (The Code of Civil Procedure, 1908)" },
    { term: "নামজারি মামলা (Mutation Case)", definition: "জমির মালিকানা পরিবর্তনের পর সরকারি রেকর্ড বা খতিয়ানে নতুন মালিকের নাম অন্তর্ভুক্ত করার জন্য সহকারী কমিশনার (ভূমি) অফিসে যে আনুষ্ঠানিক প্রক্রিয়া শুরু করা হয়, তাকে নামজারি মামলা বলে।" },
    { term: "পর্চা (Draft Record of Rights)", definition: "ভূমি জরিপের পর খতিয়ানের চূড়ান্ত কপি প্রকাশের আগে জমির মালিকদের যাচাই করার জন্য যে খসড়া কপি বা প্রতিলিপি দেওয়া হয়, তাকে পর্চা বলে।" },
    { term: "ফৌজদারি কার্যবিধি (Code of Criminal Procedure)", definition: "ফৌজদারি বা অপরাধমূলক মামলা কীভাবে পরিচালিত হবে, যেমন: গ্রেফতার, তদন্ত, জামিন, বিচার প্রক্রিয়া ইত্যাদি বিষয়ক আইন। (The Code of Criminal Procedure, 1898)" },
    { term: "বায়নাপত্র (Agreement for Sale)", definition: "সম্পত্তি কেনা-বেচার জন্য ক্রেতা ও বিক্রেতার মধ্যে যে প্রাথমিক চুক্তিপত্র সম্পাদন করা হয়, যেখানে বিক্রয়ের শর্তাবলি, মূল্য এবং সময়সীমা উল্লেখ থাকে, তাকে বায়নাপত্র বলে।" },
    { term: "বায়া দলিল (Via Deed / Previous Deed)", definition: "কোনো সম্পত্তির পূর্ববর্তী মালিকানার দলিল। বিক্রেতা কীভাবে সম্পত্তির মালিক হয়েছেন, তা প্রমাণের জন্য বায়া দলিল প্রয়োজন হয় এবং এটি মালিকানার ধারাবাহিকতা রক্ষা করে।" },
    { term: "মৌজা (Mouza)", definition: "ভূমি জরিপের ক্ষুদ্রতম একক। একটি মৌজা কয়েকটি গ্রাম বা পাড়া নিয়ে গঠিত হতে পারে এবং এর একটি স্বতন্ত্র নাম ও নম্বর (জে.এল. নম্বর) থাকে।" },
    { term: "মিউটেশন / নামজারি (Mutation)", definition: "কোনো জমির মালিকানা পরিবর্তিত হলে, সরকারি রেকর্ডে পুরনো মালিকের নাম কেটে নতুন মালিকের নাম অন্তর্ভুক্ত করার প্রক্রিয়াকে নামজারি বা মিউটেশন বলে।" },
    { term: "ওয়ারিশ (Heir)", definition: "আইন অনুযায়ী, কোনো ব্যক্তির মৃত্যুর পর তার রেখে যাওয়া সম্পত্তির উত্তরাধিকারী বা অংশীদারকে ওয়ারিশ বলা হয়।" },
    { term: "ওয়ারিশ সনদ (Warisan Certificate)", definition: "কোনো ব্যক্তির মৃত্যুর পর তার বৈধ উত্তরাধিকারীদের শনাক্ত করে স্থানীয় সরকার (যেমন: ইউনিয়ন পরিষদ, পৌরসভা) কর্তৃক প্রদত্ত একটি প্রত্যয়নপত্র। সম্পত্তি হস্তান্তর ও নামজারির জন্য এটি অপরিহার্য।" },
    { term: "সাক্ষী (Witness)", definition: "যে ব্যক্তি কোনো ঘটনা সম্পর্কে জানেন এবং আদালতে সেই বিষয়ে সাক্ষ্য বা জবানবন্দি দেন, তাকে সাক্ষী বলা হয়।" },
    { term: "হেবা (Gift)", definition: "মুসলিম আইন অনুযায়ী, কোনো প্রকার বিনিময় ছাড়া স্বেচ্ছায় কোনো সম্পত্তি অন্য কাউকে দান করাকে হেবা বলে। হেবা সম্পন্ন হওয়ার জন্য দখল হস্তান্তর আবশ্যক।" }
];

const LegalGlossary: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTerm, setActiveTerm] = useState<string | null>(null);

    const filteredTerms = useMemo(() => {
        if (!searchTerm.trim()) return glossaryTerms;
        return glossaryTerms.filter(item =>
            item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const toggleTerm = (term: string) => {
        setActiveTerm(activeTerm === term ? null : term);
    };

    return (
        <div className="w-full max-w-3xl mx-auto text-center">
            <div className="mb-6 flex flex-col items-center">
                <div className="p-3 bg-brand-green/10 rounded-full mb-4">
                    <BookOpenIcon className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-brand-dark dark:text-brand-light">আইনি পরিভাষার শব্দকোষ</h3>
                <p className="text-brand-secondary-text dark:text-slate-400 mt-1 max-w-md">
                    সাধারণত ব্যবহৃত বিভিন্ন আইনি শব্দের সহজ সংজ্ঞা খুঁজুন।
                </p>
            </div>

            <div className="relative mb-6">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="পরিভাষা খুঁজুন (e.g., দলিল, খতিয়ান)..."
                    className="w-full p-4 pl-12 border border-brand-border dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all font-bengali"
                    aria-label="Search legal terms"
                />
            </div>

            <div className="space-y-2 text-left">
                {filteredTerms.length > 0 ? (
                    filteredTerms.map((item) => (
                        <div key={item.term} className="border border-brand-border dark:border-slate-700 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleTerm(item.term)}
                                className="w-full flex justify-between items-center p-4 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none"
                                aria-expanded={activeTerm === item.term}
                            >
                                <span className="font-semibold text-brand-dark dark:text-brand-light font-bengali">{item.term}</span>
                                <ChevronDownIcon className={`w-5 h-5 text-brand-secondary-text transform transition-transform ${activeTerm === item.term ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeTerm === item.term ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="p-4 border-t border-brand-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <p className="text-brand-secondary-text dark:text-slate-300 font-bengali">{item.definition}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <p>আপনার অনুসন্ধানের সাথে মেলে এমন কোনো পরিভাষা পাওয়া যায়নি।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegalGlossary;