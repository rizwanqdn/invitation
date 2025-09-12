// app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Countdown from './components/Countdown';

// Define a type for a single theme
type Theme = {
  background: string;
  borderColor: string;
  textColor: string;
  containerGradient: string;
  linkHoverBg: string; // New property for link hover effects
};

// Define your curated list of modern themes
const themes: Theme[] = [
  // A modern, dark indigo theme
  {
    background: "/backgrounds/background1.jpg",
    borderColor: "border-indigo-400/40",
    textColor: "text-indigo-200",
    containerGradient: 'bg-gradient-to-br from-indigo-950/50 to-zinc-950/50',
    linkHoverBg: 'hover:bg-indigo-700/60',
  },
  // A sleek, light silver theme
  {
    background: "/backgrounds/background2.jpg",
    borderColor: "border-gray-500/40",
    textColor: "text-gray-300",
    containerGradient: 'bg-gradient-to-br from-gray-950/50 to-gray-900/50',
    linkHoverBg: 'hover:bg-gray-700/60',
  },
  // A vibrant, dark teal theme
  {
    background: "/backgrounds/background3.jpg",
    borderColor: "border-teal-400/40",
    textColor: "text-teal-200",
    containerGradient: 'bg-gradient-to-br from-teal-950/50 to-slate-900/50',
    linkHoverBg: 'hover:bg-teal-700/60',
  },
  // A warm, golden theme
  {
    background: "/islamic-pattern.jpg",
    borderColor: "border-yellow-300/40",
    textColor: "text-yellow-300",
    containerGradient: 'bg-gradient-to-br from-amber-950/50 to-stone-900/50',
    linkHoverBg: 'hover:bg-yellow-700/60',
  },
  {
    background: "/backgrounds/background4.jpg",
    borderColor: "border-indigo-400/40",
    textColor: "text-yellow-300",
    containerGradient: 'bg-gradient-to-br from-indigo-950/50 to-zinc-950/50',
    linkHoverBg: 'hover:bg-indigo-700/60',
  },
  {
    background: "/backgrounds/background5.jpg",
    borderColor: "border-indigo-400/40",
    textColor: "text-yellow-300",
    containerGradient: 'bg-gradient-to-br from-indigo-950/50 to-zinc-950/50',
    linkHoverBg: 'hover:bg-indigo-700/60',
  },
  {
    background: "/black-pattern.jpg",
    borderColor: "border-indigo-400/40",
    textColor: "text-yellow-300",
    containerGradient: 'bg-gradient-to-br from-indigo-950/50 to-zinc-950/50',
    linkHoverBg: 'hover:bg-indigo-700/60',
  },
  {
    background: "/white-pattern.jpg",
    borderColor: "border-indigo-400/40",
    textColor: "text-yellow-300",
    containerGradient: 'bg-gradient-to-br from-indigo-950/50 to-zinc-950/50',
    linkHoverBg: 'hover:bg-indigo-700/60',
  },
];

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const targetDate = new Date('2025-10-24T00:00:00');
  const totalCards = 4;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play();
      } else {
        audioRef.current.muted = true;
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleMainClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    
    // Check if the click is on the navigation arrows or audio button
    // This prevents accidental clicks on the background when trying to use buttons
    const isClickOnButton = (target: EventTarget) => {
        return (target as HTMLElement).tagName === 'BUTTON' || (target as HTMLElement).closest('button');
    };

    if (isClickOnButton(e.target)) {
        return;
    }

    if (clickX < rect.width / 2) {
      // Clicked on the left side
      setCardIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
    } else {
      // Clicked on the right side
      setCardIndex((prevIndex) => (prevIndex + 1) % totalCards);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const touchDifference = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (touchDifference > swipeThreshold) {
      // Swiped left, go to next card
      setCardIndex((prevIndex) => (prevIndex + 1) % totalCards);
    } else if (touchDifference < -swipeThreshold) {
      // Swiped right, go to previous card
      setCardIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
    }

    setTouchStart(null);
  };
  
  if (!currentTheme) {
    return null;
  }

  const transformValue = `translateX(-${cardIndex * 100}%)`;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 text-white text-center font-sans overflow-hidden">
      {/* Background Layer with image and a subtle gradient overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed animate-ken-burns" 
        style={{ backgroundImage: `url('${currentTheme.background}')` }}
      >
        <div className="absolute inset-0 bg-black/50 animate-pulse-subtle"></div>
      </div>
      
      {/* Audio Element: Controls the volume based on state */}
      <audio ref={audioRef} autoPlay loop muted={isMuted}>
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Audio Control Button */}
      <button 
        onClick={toggleAudio}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-3xl transition-colors text-white shadow-lg border border-white/20"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M7 3h4m-4 4h4m0 0l5 5m-5 5v-4m4 4h-4m-4 0v-4" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9l1.414 1.414a9 9 0 010 12.728m-2.828-9.9l1.414 1.414a9 9 0 010 12.728M5.8 7.172a3.001 3.001 0 00-4.243 0l-1.414 1.414a3.001 3.001 0 000 4.243l1.414 1.414a3.001 3.001 0 004.243 0l1.414-1.414z" />
            </svg>
        )}
      </button>

      {/* Main Content Container with gradient border and blur */}
      <div 
        onClick={handleMainClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative z-10 w-full max-w-2xl backdrop-blur-3xl ${currentTheme.containerGradient} p-6 sm:p-10 rounded-3xl shadow-3xl min-h-[500px] flex flex-col items-center justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl`}>
        
        {/* Fixed Header Content (Always Visible) */}
        <div className="flex flex-col items-center">
            <h1 className={`text-4xl sm:text-5xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg font-jost`}>Salana Ijtema</h1>
            <h1 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${currentTheme.textColor} drop-shadow-lg font-jost`}>Majlis Ansarullah Bharat 2025</h1>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCardIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
          }}
          className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer z-20 ${cardIndex === 0 ? 'opacity-30' : ''}`}
          disabled={cardIndex === 0}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCardIndex((prevIndex) => (prevIndex + 1) % totalCards);
          }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer z-20`}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Inner container for sliding cards - now with fixed width and overflow */}
        <div className="relative w-full h-full flex-grow overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full h-full"
            style={{ transform: transformValue }}
          >
            {/* Card 1: Logo and Urdu Headings */}
            <div className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4">
              <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4">
                <Image
                  src="/ansarullah-logo.png"
                  alt="Majlis Ansarullah Logo"
                  fill
                  className="rounded-full border-6 border-yellow-300 shadow-lg object-contain"
                />
              </div>
              {/* Urdu Headings */}
              <div className="mt-4">
                  <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-6xl sm:text-7xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg`}>سالانہ اجتماع </h1>
                  <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-5xl sm:text-6xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg`}>مجلس انصار اللہ بھارت</h1>
                  <h1 className={`text-4xl sm:text-5xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg`}>2025</h1>
              </div>
            </div>
            
            {/* Card 2: Countdown */}
            <div className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4">
              <h2 className={`text-4xl font-bold ${currentTheme.textColor} mb-2 font-jost`}>Countdown begins! </h2>
              <Countdown targetDate={targetDate} />
               <p className={`text-lg font-bold ${currentTheme.textColor} mt-4 font-jost`}>Time left until this inspiring and memorable event.</p>
               <h3 className={`text-2xl font-bold ${currentTheme.textColor} mt-4 font-jost`}>JOIN US</h3>

            </div>
            
            {/* Card 3: Dates and Location */}
            <div className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4">
              <h2 className={`text-4xl font-bold ${currentTheme.textColor} mb-6 font-jost`}>Event Details</h2>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-200 mb-2 font-lato">🗓️ Dates: 24 | 25 | 26 October 2025</p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-300 mb-6 font-lato">📍 Location: Qadian, Punjab, India</p>
              <p className="text-xl sm:text-xl leading-relaxed text-yellow-300 mb-6 font-lato">Mark your calendars for a weekend of spiritual enlightenment and brotherhood.</p>
            </div>
            
            {/* Card 4: Useful Links */}
            <div className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4">
              <h2 className={`text-4xl font-bold ${currentTheme.textColor} mb-6 font-jost`}>Usefull Links</h2>
              <div className="flex flex-col items-center justify-center gap-4 mt-4 w-full">
                  <a href="https://ansarullahbharat.in" target="_blank" rel="noopener noreferrer" className={`w-full max-w-xs text-sm sm:text-base font-medium px-4 py-2 rounded-full text-white backdrop-blur-3xl transition-all duration-300 transform hover:scale-105 ${currentTheme.containerGradient} border border-white/20 hover:border-white/40`}>ansarullahbharat.in</a>
                  <a href="https://ahmadiyyamuslimjamaat.in/" target="_blank" rel="noopener noreferrer" className={`w-full max-w-xs text-sm sm:text-base font-medium px-4 py-2 rounded-full text-white backdrop-blur-3xl transition-all duration-300 transform hover:scale-105 ${currentTheme.containerGradient} border border-white/20 hover:border-white/40`}>ahmadiyyamuslimjamaat.in</a>
                  <a href="https://www.alislam.org/" target="_blank" rel="noopener noreferrer" className={`w-full max-w-xs text-sm sm:text-base font-medium px-4 py-2 rounded-full text-white backdrop-blur-3xl transition-all duration-300 transform hover:scale-105 ${currentTheme.containerGradient} border border-white/20 hover:border-white/40`}>www.alislam.org</a>
                  <a href="https://lightofislam.in/" target="_blank" rel="noopener noreferrer" className={`w-full max-w-xs text-sm sm:text-base font-medium px-4 py-2 rounded-full text-white backdrop-blur-3xl transition-all duration-300 transform hover:scale-105 ${currentTheme.containerGradient} border border-white/20 hover:border-white/40`}>lightofislam.in</a>
                  <a href="https://akhbarbadr.in/" target="_blank" rel="noopener noreferrer" className={`w-full max-w-xs text-sm sm:text-base font-medium px-4 py-2 rounded-full text-white backdrop-blur-3xl transition-all duration-300 transform hover:scale-105 ${currentTheme.containerGradient} border border-white/20 hover:border-white/40`}>akhbarbadr.in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}