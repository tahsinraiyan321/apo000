import React from 'react';
import { MessageIcon } from './icons/MessageIcon';

const SmsInfo: React.FC = () => {
    const phoneNumber = "+18573080372"; // User's actual Twilio number

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <div className="mb-6 flex flex-col items-center">
                <div className="p-3 bg-blue-500/10 rounded-full mb-4">
                    <MessageIcon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold font-bengali text-brand-dark dark:text-brand-light">SMS এর মাধ্যমে অপরূপার সাথে কথা বলুন</h3>
                <p className="text-brand-secondary-text dark:text-slate-400 mt-1 max-w-md">
                    এখন আপনি ইন্টারনেট ছাড়াই সাধারণ SMS ব্যবহার করে অপরূপার সাহায্য নিতে পারেন। আপনার আইনি বা সরকারি পরিষেবা সংক্রান্ত প্রশ্নগুলো নিচের নম্বরে পাঠিয়ে দিন।
                </p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-brand-border dark:border-slate-700">
                <h4 className="font-semibold font-bengali text-brand-dark dark:text-brand-light">যেভাবে ব্যবহার করবেন:</h4>
                <ol className="text-left mt-4 space-y-3 list-decimal list-inside text-brand-secondary-text dark:text-slate-300 font-bengali">
                    <li>আপনার ফোনের মেসেজ অপশনে যান।</li>
                    <li>
                        এই নম্বরে আপনার প্রশ্নটি লিখে পাঠান:
                        <div className="my-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-center font-mono text-lg font-bold text-brand-green tracking-widest">
                            {phoneNumber}
                        </div>
                    </li>
                    <li>অপরূপা আপনার প্রশ্নের উত্তর SMS এর মাধ্যমে পাঠিয়ে দেবে।</li>
                </ol>
                <p className="text-xs text-brand-secondary-text/80 dark:text-slate-500 mt-6 font-bengali">
                    দয়া করে মনে রাখবেন: এই পরিষেবাটি ব্যবহারের জন্য আপনার মোবাইল অপারেটরের standard SMS চার্জ প্রযোজ্য হবে। এটি একটি পরীক্ষামূলক ফিচার।
                </p>
            </div>
        </div>
    );
};

export default SmsInfo;