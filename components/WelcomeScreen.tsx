import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import ExamplePrompts from './ExamplePrompts';
import LegalLiteracy from './LegalLiteracy';
import DocumentAnalysisFeatures from './DocumentAnalysisFeatures';
import DocumentScanner from './DocumentScanner';
import EmergencyNumbers from './EmergencyNumbers';
import LegalGlossary from './LegalGlossary';
import SmsInfo from './SmsInfo';
import RumorScanner from './RumorScanner';

interface WelcomeScreenProps {
    onPromptClick: (prompt: string) => void;
    onUploadClick: (acceptType: string) => void;
}

type ActiveTab = 'examples' | 'literacy' | 'analysis' | 'scanning' | 'emergency' | 'glossary' | 'sms' | 'rumor';

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick, onUploadClick }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('literacy');

    const TabButton: React.FC<{ tabName: ActiveTab; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent/80 focus:ring-offset-2 font-bengali ${
                activeTab === tabName
                    ? 'bg-brand-green text-white shadow-md'
                    : 'text-brand-secondary-text hover:bg-brand-green/10 dark:hover:bg-slate-700'
            }`}
            aria-pressed={activeTab === tabName}
            role="tab"
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 border-4 border-brand-green/20">
                <LogoIcon className="h-16 w-16 object-contain rounded-full text-brand-dark dark:text-brand-light" />
            </div>
            <h2 className="text-2xl font-bold font-bengali text-brand-dark dark:text-brand-light">অপরূপা আপনাকে কিভাবে সাহায্য করতে পারে?</h2>
            <p className="text-brand-secondary-text dark:text-slate-400 mt-2 mb-8 max-w-lg">
                আমি বাংলাদেশের আইন, সরকারি প্রক্রিয়া এবং আইনি নথি অনুবাদে আপনাকে সহায়তা করতে পারি। স্বচ্ছতা বৃদ্ধি এবং দুর্নীতি প্রতিরোধই আমার লক্ষ্য।
            </p>

            <div className="flex items-center justify-center flex-wrap gap-1 border border-brand-border dark:border-slate-700 p-1.5 rounded-2xl mb-8" role="tablist" aria-label="Welcome screen tabs">
                <TabButton tabName="examples" label="উদাহরণ" />
                <TabButton tabName="literacy" label="আইনি স্বাক্ষরতা" />
                <TabButton tabName="rumor" label="গুজব যাচাই" />
                <TabButton tabName="analysis" label="দলিল বিশ্লেষণ" />
                <TabButton tabName="glossary" label="শব্দকোষ" />
                <TabButton tabName="scanning" label="দলিল স্ক্যান" />
                <TabButton tabName="emergency" label="জরুরি নম্বর" />
                <TabButton tabName="sms" label="SMS পরিষেবা" />
            </div>

            <div className="w-full">
                {activeTab === 'examples' && <ExamplePrompts onPromptClick={onPromptClick} />}
                {activeTab === 'literacy' && <LegalLiteracy onPromptClick={onPromptClick} />}
                {activeTab === 'rumor' && <RumorScanner onPromptClick={onPromptClick} />}
                {activeTab === 'analysis' && <DocumentAnalysisFeatures onPromptClick={onPromptClick} />}
                {activeTab === 'glossary' && <LegalGlossary />}
                {activeTab === 'scanning' && <DocumentScanner onUploadClick={onUploadClick} />}
                {activeTab === 'emergency' && <EmergencyNumbers onPromptClick={onPromptClick} />}
                {activeTab === 'sms' && <SmsInfo />}
            </div>
        </div>
    );
};

export default WelcomeScreen;