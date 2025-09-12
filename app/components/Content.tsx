// app/components/Content.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Countdown from './Countdown';

interface ContentProps {
  content: {
    title: string;
    subtitle: string;
    date: string;
    location: string;
    hashtags: string[];
  };
  targetDate: Date;
  currentTheme: {
    borderColor: string;
    textColor: string;
  };
}

const Content: React.FC<ContentProps> = ({ content, targetDate, currentTheme }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl`}>
      {/* The logo is now an optimized Next.js Image component */}
      <div className="relative flex justify-center mb-3">
        <div className="relative w-32 h-32 md:w-48 md:h-48">
          <Image
            src="/ansarullah-logo.png"
            alt="Majlis Ansarullah Logo"
            fill
            className="rounded-full border-6 border-yellow-300 shadow-lg object-contain"
          />
        </div>
      </div>

      {/* English Headings with a staggered delay and new animation */}
      <div className={`p-4 sm:p-4 rounded-lg transition-transform duration-1000 animate-flip-in`} style={{ animationDelay: '0.5s' }}>
        <h1 className={`text-5xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>Salana Ijtema</h1>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>Majlis Ansarullah Bharat 2025</h1>
      </div>

      {/* Urdu Headings with a staggered delay and new animation */}
      <div className={`p-4 sm:p-4 rounded-lg transition-transform duration-1000 animate-flip-in`} style={{ animationDelay: '1s' }}>
        <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-6xl sm:text-6xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>سالانہ اجتماع </h1>
        <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-6xl sm:text-6xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>مجلس انصار اللہ بھارت</h1>
        <h1 className={`text-5xl sm:text-6xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>2025</h1>
      </div>

      {/* Countdown and other information */}
      <div className="mt-8 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
        <div className="flex flex-col items-center">
          <Countdown targetDate={targetDate} />
          <h1 className='text-xl sm:text-2xl md:text-3xl font-extrabold mb-6 animate-fadeIn text-yellow-300 drop-shadow-lg'>Left</h1>
        </div>
        
        <p className="text-md sm:text-lg md:text-xl font-extrabold text-amber-200 mb-2">{content.date}</p>
        <p className="text-sm sm:text-md md:text-lg font-extrabold text-gray-300 mb-6">{content.location}</p>
        
        <p className="text-xl sm:text-base md:text-lg leading-relaxed text-yellow-300 mb-6">{content.subtitle}</p>
        
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {content.hashtags.map((tag, index) => (
            <span key={index} className="text-xs sm:text-sm font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">{`#${tag}`}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;