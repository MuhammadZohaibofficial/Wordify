"use client";

import { useState, useEffect } from 'react';
// Yahan hum 'motion' aur 'AnimatePresence' ko abhi istemal nahi kar rahe to hata dete hain
// import { motion, AnimatePresence } from 'framer-motion'; 
import { Sun, Moon, Copy, Check, Wand2 } from 'lucide-react';

const TONES = [
  { name: 'Funny', emoji: '✨' }, { name: 'Poetic', emoji: '❤️' },
  { name: 'Sassy', emoji: '🔥' }, { name: 'Motivational', emoji: '🚀' },
  { name: 'Simple', emoji: '😊' },
];

export default function WordifyHome() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setError('Please enter a keyword.');
      return;
    }
    
    setIsLoading(true);
    setCaptions([]);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, tone: selectedTone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate captions.');
      }
      const data = await response.json();
      setCaptions(data.captions);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (caption: string, index: number) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gray-50 dark:bg-[#1A202C] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="w-full max-w-4xl flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Wand2 className="h-7 w-7 text-blue-500" />
           <h1 className="text-2xl font-bold tracking-tighter">Wordify</h1>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="flex flex-col items-center w-full max-w-2xl flex-1 px-4 text-center mt-16 sm:mt-24">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent pb-2">
          Instantly Create Viral Captions.
        </h1>
        <form onSubmit={handleSubmit} className="w-full mt-10">
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Describe your photo..." className="w-full p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"/>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {TONES.map(tone => (<button key={tone.name} type="button" onClick={() => setSelectedTone(tone.name === selectedTone ? '' : tone.name)} className={`px-4 py-2 text-sm rounded-full transition-all border ${selectedTone === tone.name ? 'text-white border-transparent bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>{tone.emoji} {tone.name}</button>))}
          </div>
          <button type="submit" disabled={isLoading} className="mt-8 w-full sm:w-auto px-12 py-4 text-lg font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-50 transition-all transform hover:scale-105">{isLoading ? 'Generating...' : 'Generate Captions'}</button>
        </form>

        <div className="w-full mt-12 space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            {captions.map((caption, index) => (<div key={index} className="relative text-left p-4 bg-white dark:bg-gray-800 border rounded-lg"><p className="pr-10">{caption}</p><button onClick={() => handleCopy(caption, index)} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">{copiedIndex === index ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}</button></div>))}
        </div>
      </main>
    </div>
  );
      }
