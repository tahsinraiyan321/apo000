import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-4 px-4 bg-slate-100 dark:bg-brand-dark">
      <p className="text-sm text-brand-secondary-text dark:text-slate-400">
        Built by <a href="https://github.com/tahsinraiyan330/" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-green hover:underline">Tahsin Raiyan</a>
      </p>
       <p className="text-sm text-brand-secondary-text dark:text-slate-400 mt-1">
        Contact: <a href="mailto:tahsinraiyan321@gmail.com" className="font-semibold text-brand-green hover:underline">tahsinraiyan321@gmail.com</a>
      </p>
      <p className="text-xs text-brand-secondary-text/80 dark:text-slate-500 mt-2 font-bengali">
        অপরূপা ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করে নিন।
      </p>
      <p className="text-xs text-brand-secondary-text/80 dark:text-slate-500 mt-1">
        © 2025 অপরূপা. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;