'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
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
  // Card 0: Logo & Headings - Deep Teal/Blue
  { 
    gradient: 'linear-gradient(140deg, #0e7490 0%, #1d4ed8 100%)', 
    text: 'text-cyan-100', 
    border: 'border-cyan-400',
    bgColor: '#0e7490' // Teal
  },
  // Card 1: Countdown - Forest Green/Emerald
  { 
    gradient: 'linear-gradient(140deg, #16a34a 0%, #059669 100%)', 
    text: 'text-green-100', 
    border: 'border-green-400',
    bgColor: '#059669' // Emerald
  },
  // Card 2: Details - ELECTRIC VIOLET (Modern Variant) ⚡
  { 
    // New Gradient: Blends bright magenta (#e93b82) and electric violet (#663399)
    gradient: 'linear-gradient(140deg, #e93b82 0%, #663399 100%)', 
    text: 'text-pink-100', // Changed text color for better contrast
    border: 'border-pink-400', // Changed border
    bgColor: '#8A2BE2' // Solid Bright Blue Violet (Modern Fallback Color)
  },
  // Card 3: Links - Deep Orange/Red
  { 
    gradient: 'linear-gradient(140deg, #c2410c 0%, #b91c1c 100%)', 
    text: 'text-orange-100', 
    border: 'border-orange-400',
    bgColor: '#b91c1c' // Red
  },
];
const totalCards = 4;

// --- Card Component with 3D Logic ---

interface CardProps {
  index: number;
  currentIndex: number;
  currentTheme: Theme;
  children: React.ReactNode;
}

// Interface for custom CSS variable used in glowStyle
interface GlowStyle extends React.CSSProperties {
    '--glow-color': string;
}

const Card: React.FC<CardProps> = ({ index, currentIndex, children }) => {
  const isActive = index === currentIndex;
  const { gradient, text, border, bgColor } = cardStyles[index]; 
  
  // FIX: Changed let to const for properties only assigned once
  const cardBgStyle: React.CSSProperties = {};
  const cardBorderClass = border;
  
  let transform = 'translateZ(0) rotateX(0deg)';
  let opacity = 1;
  let zIndex = 10;
  // FIX: Used explicit type for reassigned variable
  let pointerEvents: 'auto' | 'none' = 'auto'; 
  
  let animationClasses = '';
  let outerCardClasses = 'transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]'; 

  if (isActive) {
    // Active card: Front and slightly forward
    transform = 'translateZ(10px) scale(1)'; 
    zIndex = 50;
    
    // Set the active card's background color dynamically
    cardBgStyle.backgroundColor = bgColor; 
    
    animationClasses = 'animate-fadeInUp'; 
    
    outerCardClasses += ' hover:scale-[1.01]'; 
  } else if (index < currentIndex) {
    // Previous cards: Peel Up and Away
    const offset = currentIndex - index;
    const translationY = -100 - (offset * 3);
    const rotationX = -90 - (offset * 5); 

    transform = `translateZ(${offset * 50}px) translateY(${translationY}%) rotateX(${rotationX}deg)`; 
    opacity = 0.9; 
    zIndex = 60 + index; 
    pointerEvents = 'none'; // Reassignment is okay as it was declared with 'let'
    
    // Use static gradient/color for the peeled stack via inline style
    cardBgStyle.backgroundImage = cardStyles[index].gradient;
    cardBgStyle.opacity = 0.7;
  } else {
    // Next cards: Stacked behind
    const offset = index - currentIndex;
    const translationY = offset * 5; 
    const scale = 1 - (offset * 0.08);

    transform = `translateZ(-${offset * 50}px) translateY(${translationY}%) scale(${scale})`;
    zIndex = 40 - offset; 
    
    // Use static gradient/color for the stack behind via inline style
    cardBgStyle.backgroundImage = gradient;
    cardBgStyle.opacity = 0.8; 
    outerCardClasses += ' hover:scale-[1.01]'; 
  }

  // --- GLOW EFFECT LOGIC ---
  const glowColor = cardStyles[index].bgColor;
  // FIX: Explicitly typed to include the custom CSS variable
  const glowStyle: GlowStyle = { 
    '--glow-color': glowColor,
    boxShadow: `
      0 0 15px rgba(255, 255, 255, 0.1),
      0 0 30px var(--glow-color, rgba(255, 255, 255, 0.15)),
      0 0 45px var(--glow-color, rgba(255, 255, 255, 0.05))
    `,
  };

  return (
    <div
      className={`absolute inset-0 p-3 sm:p-4 ${text} ${outerCardClasses}`} 
      style={{
        transform,
        opacity,
        zIndex,
        // FIX: pointerEvents is now correctly typed
        pointerEvents: pointerEvents, 
      }}
    >
      <div 
        className={`w-full h-full flex flex-col items-center justify-center rounded-[30px] sm:rounded-[40px] transition-all duration-300 transition-colors border ${cardBorderClass} ${animationClasses} overflow-y-auto`}
        style={{ ...cardBgStyle, ...glowStyle }} 
      >
        {children}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null); 
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); 

  const targetDate = new Date('2025-10-24T00:00:00');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);
  }, []);

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

  const navigateCard = useCallback((direction: 'prev' | 'next') => {
    setCardIndex((prevIndex) => {
      if (direction === 'next') {
        if (prevIndex === totalCards - 1) return totalCards - 1;
        return prevIndex + 1;
      }
      if (prevIndex === 0) return 0;
      return prevIndex - 1;
    });
  }, []);

  // --- SCROLL HANDLING (Desktop) ---
  const handleScroll = useCallback((e: WheelEvent) => {
    if (scrollTimeoutRef.current) {
      return;
    }

    const direction: 'prev' | 'next' = e.deltaY > 0 ? 'next' : 'prev';

    e.preventDefault(); 

    if (
        (direction === 'next' && cardIndex < totalCards - 1) || 
        (direction === 'prev' && cardIndex > 0)
    ) {
        navigateCard(direction);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      scrollTimeoutRef.current = null;
    }, 700);

  }, [cardIndex, navigateCard]);


  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScroll);
      if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // --- TOUCH/SWIPE HANDLING (Mobile) ---

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY); 
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const touchDifferenceY = touchStartY - touchEndY; 
    const swipeThreshold = 50;

    if (Math.abs(touchDifferenceY) > swipeThreshold) {
      if (touchDifferenceY > 0) {
        // Swiping Up -> Next Card
        navigateCard('next');
      } else {
        // Swiping Down -> Previous Card
        navigateCard('prev');
      }
    }
    setTouchStartY(null);
  };
  
  // --- CLICK HANDLING (Fallback/Manual Navigation) ---

  const handleMainClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top; 
    
    const isClickOnInteractive = (target: EventTarget) => {
        return ['BUTTON', 'A'].includes((target as HTMLElement).tagName) || (target as HTMLElement).closest('button, a');
    };

    if (isClickOnInteractive(e.target)) {
        return;
    }

    if (clickY < rect.height / 2) {
      navigateCard('prev'); 
    } else {
      navigateCard('next');
    }
  };
  
  if (!currentTheme) {
    return null;
  }
  
  const activeCardStyle = cardStyles[cardIndex];


  return (
    <main 
      ref={mainRef} 
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
        onClick={handleMainClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative z-20 w-full max-w-sm sm:max-w-3xl p-3 sm:p-10 rounded-[40px] shadow-3xl h-[55vh] md:h-[85vh] flex flex-col items-center justify-between overflow-hidden transition-all duration-800 ease-in-out `} 
        
      >
        
        {/* Inner container for 3D card viewport */}
        <div className="relative w-full h-full flex-grow">
          
          {/* Card 0: Logo and Urdu Headings */}
          <Card index={0} currentIndex={cardIndex} currentTheme={currentTheme}>
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
          <Card index={1} currentIndex={cardIndex} currentTheme={currentTheme}>
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
          <Card index={2} currentIndex={cardIndex} currentTheme={currentTheme}>
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
          <Card index={3} currentIndex={cardIndex} currentTheme={currentTheme}>
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
                            className={`w-full text-sm font-medium px-3 py-2 rounded-full text-white transition-all duration-300 transform hover:scale-[1.03] border ${cardStyles[3].border} shadow-md hover:shadow-lg`} 
                            style={{ backgroundImage: cardStyles[3].gradient }}
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
            </div>
          </Card>
        </div>

        {/* Navigation Arrows (Vertical: Up/Down) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateCard('prev');
          }}
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 pt-2 pb-1 px-3 rounded-b-lg text-white/50 hover:text-white transition-colors cursor-pointer z-50 ${cardIndex === 0 ? 'opacity-30 pointer-events-none' : ''}`}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateCard('next');
          }}
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-2 pt-1 px-3 rounded-t-lg text-white/50 hover:text-white transition-colors cursor-pointer z-50 ${cardIndex === totalCards - 1 ? 'opacity-30 pointer-events-none' : ''}`}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Navigation Dots Indicator */}
        <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-50">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCardIndex(index);
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === cardIndex 
                  ? `h-3 w-3 ${activeCardStyle.text.replace('text-', 'bg-')}` 
                  : 'bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}