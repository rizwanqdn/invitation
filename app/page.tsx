// app/page.tsx
'use client'; // This line is the solution

import React from 'react';
import Content from './components/Content';

export default function Home() {
  const content = {
    title: 'The countdown begins!',
    subtitle: 'Mark your calendars for a weekend of spiritual enlightenment and brotherhood.',
    date: '🗓️ Dates: 24th (Friday), 25th (Saturday), & 26th (Sunday) October 2025.',
    location: '📍 Location: Qadian, Punjab, India',
    hashtags: ['AnsarIjtemaBharat2025', 'MajlisAnsarullah', 'SalanaIjtema2025', 'Ahmadiyyat']
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 text-white text-center font-sans overflow-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/islamic-pattern.jpg')] bg-cover bg-center"></div>
      
      {/* Main Content Container with a subtle blur effect */}
      <div className="relative z-10 w-full max-w-2xl backdrop-blur-sm bg-black/30 p-6 sm:p-8 rounded-3xl shadow-3xl border-2 border-yellow-300/40">
        
        {/* English Headings with a staggered delay and new animation */}
        <div className="p-4 sm:p-4 rounded-lg animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <h1 className="text-4xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 text-yellow-300 drop-shadow-lg animate-pulse-fast">Salana Ijtema</h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2 text-yellow-300 drop-shadow-lg animate-pulse-fast">Majlis Ansarullah Bharat 2025</h1>
        </div>

        {/* Urdu Headings with a staggered delay and new animation */}
        <div className="p-4 sm:p-4 rounded-lg animate-fadeIn" style={{ animationDelay: '1s' }}>
          <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className="text-4xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 text-yellow-300 drop-shadow-lg animate-pulse-fast">سالانہ اجتماع مجلس انصار اللہ بھارت</h1>
          <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2 text-yellow-300 drop-shadow-lg animate-pulse-fast">2025</h1>
        </div>
         
        {/* Content component with a longer delay */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
          <Content content={content} />
        </div>
      </div>
    </main>
  );
}