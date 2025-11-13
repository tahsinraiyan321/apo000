
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import ThemeToggle from './ThemeToggle';

type Theme = 'light' | 'dark';

interface HeaderProps {
  onNewChat: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat, theme, setTheme }) => {
  return (
    <header className="sticky top-0 z-10 bg-brand-light/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-brand-border/80 dark:border-slate-700/80">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md shadow-slate-900/5">
             <LogoIcon className="h-10 w-10 object-contain rounded-full text-brand-dark dark:text-brand-light" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-brand-green font-bengali">অপরূপা 2.0</h1>
            <p className="text-xs md:text-sm text-brand-secondary-text -mt-1">AI Legal & Governance Agent</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            onClick={onNewChat}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-xl hover:bg-opacity-90 transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transform"
            aria-label="Start new chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;