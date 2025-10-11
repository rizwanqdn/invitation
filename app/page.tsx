'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
// Assuming the path to your Countdown component is correct
import Countdown from './components/Countdown'; 

// --- Theme Definitions ---

type Theme = {
  background: string;
  containerBackground: string; 
  containerBorder: string;
  textColor: string;
  linkHoverBg: string;
  shadow: string;
};

const themes: Theme[] = [
  {
    background: "/backgrounds/background1.jpg",
    containerBackground: 'bg-indigo-950',
    containerBorder: "border-indigo-400/30",
    textColor: "text-indigo-200",
    linkHoverBg: 'hover:bg-indigo-700/60',
    shadow: 'shadow-indigo-500',
  },
  {
    background: "/backgrounds/background2.jpg",
    containerBackground: 'bg-gray-950',
    containerBorder: "border-gray-500/30",
    textColor: "text-gray-300",
    linkHoverBg: 'hover:bg-gray-700/60',
    shadow: 'shadow-gray-500',
  },
  {
    background: "/backgrounds/background3.jpg",
    containerBackground: 'bg-teal-950',
    containerBorder: "border-teal-400/30",
    textColor: "text-teal-200",
    linkHoverBg: 'hover:bg-teal-700/60',
    shadow: 'shadow-teal-500',
  },
  {
    background: "/islamic-pattern.jpg",
    containerBackground: 'bg-amber-950',
    containerBorder: "border-yellow-300/30",
    textColor: "text-yellow-300",
    linkHoverBg: 'hover:bg-yellow-700/60',
    shadow: 'shadow-yellow-500',
  },
  {
    background: "/black-pattern.jpg",
    containerBackground: 'bg-zinc-950',
    containerBorder: "border-white/30",
    textColor: "text-white",
    linkHoverBg: 'hover:bg-zinc-800/60',
    shadow: 'shadow-white',
  },
];

const cardStyles = [
  // Card 0: Logo & Headings - Teal for glow
  { 
    gradient: '', // Not used in Glassmorphism
    text: 'text-cyan-100', 
    border: 'border-cyan-400',
    bgColor: '#0e7490' // Teal for glow
  },
  // Card 1: Countdown - Emerald for glow
  { 
    gradient: '', // Not used in Glassmorphism
    text: 'text-green-100', 
    border: 'border-green-400',
    bgColor: '#059669' // Emerald for glow
  },
  // Card 2: Details - Violet for glow
  { 
    gradient: '', // Not used in Glassmorphism
    text: 'text-pink-100', 
    border: 'border-pink-400', 
    bgColor: '#8A2BE2' // Violet for glow
  },
  // Card 3: Links - Orange for glow
  { 
    gradient: '', // Not used in Glassmorphism
    text: 'text-blue-900', // Note: Using blue text against glass for contrast
    border: 'border-orange-400',
    bgColor: '#c2410c' // Orange for glow
  },
];
const totalCards = 4;

// --- Card Component (Glassmorphism) ---

interface CardProps {
  index: number;
  currentIndex: number;
  currentTheme: Theme;
  children: React.ReactNode;
}

interface GlowStyle extends React.CSSProperties {
    '--glow-color': string;
}

const Card: React.FC<CardProps> = ({ index, currentIndex, children }) => {
  const isActive = index === currentIndex;
  const { text, border } = cardStyles[index]; 
  
  const cardBorderClass = border.replace('border-', 'border-'); // Keep border class
  
  let transform = 'translateZ(0) rotateX(0deg)';
  let opacity = 1;
  let zIndex = 10;
  let pointerEvents: 'auto' | 'none' = 'auto'; 
  
  let animationClasses = '';
  let outerCardClasses = 'transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]'; 

  if (isActive) {
    transform = 'translateZ(10px) scale(1)'; 
    zIndex = 50;
    animationClasses = 'animate-fadeInUp'; 
    outerCardClasses += ' hover:scale-[1.01]'; 
    pointerEvents = 'auto'; 
  } else if (index < currentIndex) {
    const offset = currentIndex - index;
    const translationY = -100 - (offset * 3);
    const rotationX = -90 - (offset * 5); 

    transform = `translateZ(${offset * 50}px) translateY(${translationY}%) rotateX(${rotationX}deg)`; 
    opacity = 0.9; 
    zIndex = 60 + index; 
    pointerEvents = 'none';
  } else {
    const offset = index - currentIndex;
    const translationY = offset * 5; 
    const scale = 1 - (offset * 0.08);

    transform = `translateZ(-${offset * 50}px) translateY(${translationY}%) scale(${scale})`;
    zIndex = 40 - offset; 
    outerCardClasses += ' hover:scale-[1.01]'; 
  }

  const glowColor = cardStyles[index].bgColor;
  // Adjusted glow style for a more subtle glass effect
  const glowStyle: GlowStyle = { 
    '--glow-color': glowColor,
    boxShadow: `
      0 0 5px rgba(255, 255, 255, 0.2), /* Inner light */
      0 0 10px var(--glow-color, rgba(255, 255, 255, 0.1)), /* Subtle color glow */
      0 0 20px var(--glow-color, rgba(255, 255, 255, 0.05)) /* Wider, softer glow */
    `,
  };

  return (
    <div
      className={`absolute inset-0 p-3 sm:p-4 ${text} ${outerCardClasses}`} 
      style={{
        transform,
        opacity,
        zIndex,
        pointerEvents: pointerEvents, 
      }}
    >
      <div 
        // Glassmorphism classes applied here
        className={`w-full h-full flex flex-col items-center justify-center rounded-[30px] sm:rounded-[40px] transition-all duration-300 transition-colors border ${cardBorderClass} ${animationClasses} overflow-y-auto relative 
          backdrop-blur-xl bg-white/10 border-white/20`}
        style={{ ...glowStyle }} 
      >
        <div>
            {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  
  // Initialize cardIndex from localStorage
  const [cardIndex, setCardIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('lastCardIndex');
      return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
    }
    return 0;
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Ref to hold the most current card index for stable handlers
  const currentCardIndexRef = useRef(cardIndex); 
  
  const targetDate = new Date('2025-10-24T00:00:00');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);
  }, []);

  // Update the ref AND localStorage whenever cardIndex changes
  useEffect(() => {
    currentCardIndexRef.current = cardIndex;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastCardIndex', cardIndex.toString());
    }
  }, [cardIndex]);


  const toggleAudio = () => {
    if (audioRef.current) {
      const isCurrentlyMuted = isMuted;
      audioRef.current.muted = !isCurrentlyMuted;
      if (isCurrentlyMuted) {
         audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
      setIsMuted(!isCurrentlyMuted);
    }
  };

  // Function to set the card index directly (used by the new buttons)
  const setCardIndexDirectly = useCallback((index: number) => {
      setCardIndex(index);
  }, []);

  
  if (!currentTheme) {
    return null;
  }
  
  return (
    <main 
      className="relative flex h-screen min-h-screen flex-col items-center justify-center p-2 sm:p-4 text-white text-center font-sans overflow-hidden focus:outline-none"
      tabIndex={-1} 
    >
      
      {/* Background Layer 1: Static Image + Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed animate-ken-burns" 
        style={{ backgroundImage: `url('${currentTheme.background}')` }}
      >
        <div className="absolute inset-0 bg-black/40 animate-slow-pulse"></div>
      </div>

      {/* Background Layer 2: Animated Gradient Overlay (Subtle Glow) */}
      <div 
          className="absolute inset-0 z-10 opacity-30" 
      />
      
      {/* Audio Element and Button */}
      <audio ref={audioRef} autoPlay loop muted={isMuted}>
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>

      <button 
        onClick={toggleAudio}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full bg-black/50 transition-all duration-300 hover:bg-black/70 text-white shadow-2xl border ${currentTheme.containerBorder} hover:scale-110`} 
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 11.173V7.067a.5.5 0 01.9-.387l5.223 3.917a.5.5 0 010 .774l-5.223 3.917a.5.5 0 01-.9-.387v-4.106zm-7 0v2.654a1.996 1.996 0 001.077 1.76l4.223 3.167A.5.5 0 009 17.5V6.5a.5.5 0 00-.7-.387L4.077 9.259A1.996 1.996 0 003 11.013zM15 9l5 5m0-5l-5 5" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5v14m0-14H5a2 2 0 00-2 2v10a2 2 0 002 2h6l5 4V1l-5 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 10v4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8v8" />
            </svg>
        )}
      </button>

      {/* Main Content Container (3D Viewport) */}
      
      <div 
        className={`relative z-20 w-full max-w-sm sm:max-w-3xl p-3 sm:p-10 rounded-[40px] h-[54vh] md:h-[85vh] flex flex-col items-center justify-between overflow-hidden transition-all duration-800 ease-in-out `} 
      >
        
        {/* Inner container for 3D card viewport */}
        <div className="relative w-full h-full flex-grow">
          
          {/* Card 0: Logo and Urdu Headings */}
          <Card index={0} currentIndex={cardIndex} currentTheme={currentTheme} >
             <div className="w-full flex flex-col items-center justify-center py-4">
                <h1 className={`text-2xl sm:text-5xl font-extrabold my-1 ${cardStyles[0].text} drop-shadow-lg font-jost`}>Salana Ijtema</h1>
                <h1 className={`text-xl sm:text-3xl font-extrabold mb-2 ${cardStyles[0].text} drop-shadow-lg font-jost`}>Majlis Ansarullah Bharat 2025</h1>
                <div className={`w-1/3 h-1 ${cardStyles[0].border.replace('border-', 'bg-').replace('/50', '')} rounded-full mt-2 opacity-50`}></div>
            

                <div className="relative w-28 h-28 md:w-40 md:h-40  transform hover:scale-105 transition-transform duration-500">
                <Image
                    src="/ansarullah-logo.png"
                    alt="Majlis Ansarullah Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    className={`rounded-full shadow-3xl ${cardStyles[0].border.replace('border', 'border-4')}`}
                />
                </div>
                <div className="mt-2">
                    <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-4xl sm:text-7xl font-extrabold my-1 ${cardStyles[0].text} drop-shadow-lg`}>سالانہ اجتماع </h1>
                    <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-3xl sm:text-6xl font-extrabold my-1 ${cardStyles[0].text} drop-shadow-lg`}>مجلس انصار اللہ بھارت</h1>
                    <h1 className={`text-2xl sm:text-5xl font-extrabold my-1 ${cardStyles[0].text} drop-shadow-lg font-jost`}>2025</h1>
                </div>
            </div>
          </Card>
          
          {/* Card 1: Countdown */}
          <Card index={1} currentIndex={cardIndex} currentTheme={currentTheme} >
            <div className="w-full flex flex-col items-center justify-center py-4">
                <h2 className={`text-2xl sm:text-4xl font-bold ${cardStyles[1].text} mb-6 font-jost tracking-wider`}>Countdown Begins! </h2>
                <div className={`p-4 rounded-xl shadow-lg`}>
                <Countdown targetDate={targetDate} textColor={cardStyles[1].text} /> 
                </div>
                <p className={`text-base sm:text-lg font-light ${cardStyles[1].text} opacity-80 mt-6 font-lato`}>Time left until this inspiring and memorable event.</p>
                <h3 className={`text-xl sm:text-2xl font-extrabold ${cardStyles[1].text} mt-4 font-jost animate-bounce-subtle`}>JOIN US</h3>
            </div>
          </Card>
          
          {/* Card 2: Dates and Location */}
          <Card index={2} currentIndex={cardIndex} currentTheme={currentTheme} >
            <div className="w-full flex flex-col items-center justify-center py-4">
                <h2 className={`text-3xl sm:text-4xl font-bold ${cardStyles[2].text} mb-8 font-jost tracking-wider`}>Event Details</h2>
                
                <div className={`p-4 w-full max-w-xs sm:max-w-sm rounded-xl shadow-xl`}> 
                <p className="text-xl sm:text-3xl font-extrabold text-amber-200 mb-4 font-lato flex items-center justify-center"> 
                    <span className="mr-3 text-2xl sm:text-3xl">🗓️</span> Dates: 24 | 25 | 26 Oct 2025
                </p>
                <div className="w-full h-px bg-white/20 my-4"></div>
                <p className="text-lg sm:text-2xl font-extrabold text-gray-300 mb-4 font-lato flex items-center justify-center"> 
                    <span className="mr-3 text-xl sm:text-2xl">📍</span> Location: Qadian, Punjab, India
                </p>
                </div>

                <p className="text-base sm:text-lg leading-relaxed text-yellow-300 mt-6 font-lato opacity-90">Mark your calendars for a weekend of spiritual enlightenment and brotherhood.</p>
            </div>
          </Card>
          
          {/* Card 3: Useful Links */}
          <Card index={3} currentIndex={cardIndex} currentTheme={currentTheme} >
            <div className="w-full flex flex-col items-center justify-center py-4">
                <h2 className={`text-3xl sm:text-4xl font-bold ${cardStyles[3].text} mb-6 font-jost tracking-wider`}>Useful Links</h2>
                <div className="grid grid-cols-1 gap-2 mt-4 w-full max-w-xs"> 
                    {[
                        { href: "https://ansarullahbharat.in", text: "ansarullahbharat.in" },
                        { href: "https://ahmadiyyamuslimjamaat.in/", text: "ahmadiyyamuslimjamaat.in" },
                        { href: "https://www.alislam.org/", text: "www.alislam.org" },
                        { href: "https://lightofislam.in/", text: "lightofislam.in" },
                        { href: "https://akhbarbadr.in/", text: "akhbarbadr.in" },
                    ].map((link, index) => (
                        <a 
                            key={index}
                            href={link.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`w-full text-sm font-medium px-3 py-2 rounded-full text-white transition-all duration-300 transform hover:scale-[1.03] border ${cardStyles[3].border} shadow-md hover:shadow-lg backdrop-blur-sm bg-black/20`} 
                          
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
            </div>
          </Card>
        </div>

        {/* --- Card Number Navigation Buttons --- */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-50 p-2 rounded-full backdrop-blur-md shadow-xl">
            {Array.from({ length: totalCards }).map((_, navIndex) => (
              <button
                key={navIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  setCardIndexDirectly(navIndex);
                }}
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-black/50 
                  ${navIndex === cardIndex 
                    ? `bg-red-600 text-black scale-110` 
                    : 'bg-white/10 text-white hover:bg-white/30'
                  }`}
                aria-label={`Go to card ${navIndex + 1}`}
              >
                {navIndex + 1}
              </button>
            ))}
      </div>
    </div>
    </main>
  );
}