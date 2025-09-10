// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Content from './components/Content';

// Define a type for a single theme
type Theme = {
  bgGradient: string;
  bgImage: string;
  borderColor: string;
  textColor: string;
};

// Define your list of themes with new backgrounds
const themes: Theme[] = [
  {
    bgGradient: "bg-gradient-to-br from-[#0a472c] via-[#2d224b] to-[#0a472c]",
    bgImage: "/islamic-pattern.jpg",
    borderColor: "border-yellow-300/40",
    textColor: "text-yellow-300",
  },
  {
    bgGradient: "bg-gradient-to-br from-[#2b2b2b] via-[#4d4d4d] to-[#2b2b2b]",
    bgImage: "/white-pattern.jpg",
    borderColor: "border-teal-300/40",
    textColor: "text-teal-300",
  },
  {
    bgGradient: "bg-gradient-to-br from-[#5e2b2b] via-[#7d4d4d] to-[#5e2b2b]",
    bgImage: "/black-pattern.jpg",
    borderColor: "border-pink-300/40",
    textColor: "text-pink-300",
  },
  // ADDED: A new theme with a different background image
  {
    bgGradient: "bg-gradient-to-br from-[#1c1c1c] via-[#3c3c3c] to-[#1c1c1c]",
    bgImage: "/backgrounds/background1.jpg",
    borderColor: "border-gray-500/40",
    textColor: "text-gray-300",
  },
  // ADDED: Another new theme with a different background image and colors
  {
    bgGradient: "bg-gradient-to-br from-[#4b3c19] via-[#6d5c39] to-[#4b3c19]",
    bgImage: "/backgrounds/background2.jpg",
    borderColor: "border-orange-500/40",
    textColor: "text-orange-300",
  },
];

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  // Use useEffect to run this code only once when the component mounts on the client
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);
  }, []);

  const content = {
    title: 'The countdown begins!',
    subtitle: 'Mark your calendars for a weekend of spiritual enlightenment and brotherhood.',
    date: '🗓️ Dates: 24th (Friday), 25th (Saturday), & 26th (Sunday) October 2025.',
    location: '📍 Location: Qadian, Punjab, India',
    hashtags: ['AnsarIjtemaBharat2025', 'MajlisAnsarullah', 'SalanaIjtema2025', 'Ahmadiyyat']
  };

  // Render nothing until the theme is set to prevent hydration errors
  if (!currentTheme) {
    return null;
  }

  return (
    <main className={`relative flex min-h-screen flex-col items-center justify-center p-4 text-white text-center font-sans overflow-hidden ${currentTheme.bgGradient} bg-[length:400%_400%] animate-animatedGradient`}>
      {/* Background Pattern Overlay - Removed opacity-10 */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('${currentTheme.bgImage}')` }}></div>
      
      {/* Main Content Container with a subtle blur effect */}
      <div className={`relative z-10 w-full max-w-2xl backdrop-blur-sm bg-black/30 p-6 sm:p-8 rounded-3xl shadow-3xl border-2 ${currentTheme.borderColor}`}>
        
        {/* English Headings with a staggered delay and new animation */}
        <div className="p-4 sm:p-4 rounded-lg animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <h1 className={`text-4xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>Salana Ijtema</h1>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>Majlis Ansarullah Bharat 2025</h1>
        </div>

        {/* Urdu Headings with a staggered delay and new animation */}
        <div className="p-4 sm:p-4 rounded-lg animate-fadeIn" style={{ animationDelay: '1s' }}>
          <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-4xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>سالانہ اجتماع مجلس انصار اللہ بھارت</h1>
          <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>2025</h1>
        </div>
         
        {/* Content component with a longer delay */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
          <Content content={content} />
        </div>
      </div>
    </main>
  );
}