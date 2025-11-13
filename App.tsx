
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import { Message } from './types';

const CHAT_HISTORY_KEY = 'aoporupa-chat-history';
const THEME_KEY = 'aoporupa-theme';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
      return [];
    }
  });

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [messages]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="bg-slate-100 dark:bg-brand-dark font-sans text-brand-dark dark:text-brand-light min-h-screen flex flex-col">
      <Header onNewChat={handleNewChat} theme={theme} setTheme={setTheme} />
      <main className="flex-grow flex flex-col items-center p-2 md:p-4">
        <div className="w-full max-w-6xl h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 flex flex-col border border-brand-border dark:border-slate-700">
          <ChatInterface messages={messages} setMessages={setMessages} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;