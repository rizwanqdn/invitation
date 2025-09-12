// app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Countdown from './components/Countdown';

// Define a type for a single theme
type Theme = {
  mediaSource: string; // This will hold the path to the image
  borderColor: string;
  textColor: string;
};

// Define your list of themes with local background images
const themes: Theme[] = [
  {
    mediaSource: "/islamic-pattern.jpg",
    borderColor: "border-yellow-300/40",
    textColor: "text-yellow-300",
  },
  {
    mediaSource: "/white-pattern.jpg",
    borderColor: "border-teal-300/40",
    textColor: "text-teal-300",
  },
  {
    mediaSource: "/black-pattern.jpg",
    borderColor: "border-pink-300/40",
    textColor: "text-pink-300",
  },
  {
    mediaSource: "/backgrounds/background1.jpg",
    borderColor: "border-gray-500/40",
    textColor: "text-gray-300",
  },
  {
    mediaSource: "/backgrounds/background2.jpg",
    borderColor: "border-gray-500/40",
    textColor: "text-gray-300",
  },
  // You can add more image backgrounds here if needed
];

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // New state to track if audio is playing
  const [cardIndex, setCardIndex] = useState(0);

  // Use useRef to get a direct reference to the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const targetDate = new Date('2025-10-24T00:00:00');
  const totalCards = 4;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCardClick = () => {
    setCardIndex((prevIndex) => (prevIndex + 1) % totalCards);
  };
  
  if (!currentTheme) {
    return null;
  }

  const transformValue = `translateX(-${cardIndex * 100}%)`;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 text-white text-center font-sans overflow-hidden">
      {/* Background Layer: Always an image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed animate-ken-burns" 
        style={{ backgroundImage: `url('${currentTheme.mediaSource}')` }}
      ></div>
      
      {/* Audio Element: Controls the volume based on state */}
      <audio ref={audioRef} autoPlay loop muted>
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Audio Control Button */}
      <button 
        onClick={toggleAudio}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors text-white"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? (
          // Pause Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7.293-9.293a1 1 0 00-1.414 0L12 11.586l-5.879-5.879a1 1 0 00-1.414 1.414L10.586 13l-5.879 5.879a1 1 0 101.414 1.414L12 14.414l5.879 5.879a1 1 0 101.414-1.414L13.414 12l5.879-5.879a1 1 0 000-1.414z" />
          </svg>
        ) : (
          // Play Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.155-2.071a1 1 0 00-1.488.948v4.144a1 1 0 001.488.948l3.155-2.071a1 1 0 000-1.858z" />
          </svg>
        )}
      </button> 

      {/* Main Content Container */}
      <div 
        onClick={handleCardClick}
        className={`relative z-10 w-full max-w-2xl backdrop-blur-sm bg-black/30 p-6 sm:p-8 rounded-3xl shadow-3xl border-2 ${currentTheme.borderColor} min-h-[500px] flex flex-col items-center justify-between overflow-hidden cursor-pointer`}>
        
        {/* Fixed Header Content (Always Visible) */}
        <div className="flex flex-col items-center">
            <h1 className={`text-4xl sm:text-5xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg`}>Salana Ijtema</h1>
            <h1 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${currentTheme.textColor} drop-shadow-lg`}>Majlis Ansarullah Bharat 2025</h1>
        </div>

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
                  <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-5xl sm:text-6xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg`}>سالانہ اجتماع </h1>
                  <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-5xl sm:text-6xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg`}>مجلس انصار اللہ بھارت</h1>
                  <h1 className={`text-4xl sm:text-5xl font-extrabold my-1 ${currentTheme.textColor} drop-shadow-lg`}>2025</h1>
              </div>
            </div>
            
            {/* Card 2: Countdown */}
            <div className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4">
              <h2 className={`text-4xl font-bold ${currentTheme.textColor} mb-6`}>Countdown</h2>
              <Countdown targetDate={targetDate} />
            </div>
            
            {/* Card 3: Dates and Location */}
            <div className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4">
              <h2 className={`text-4xl font-bold ${currentTheme.textColor} mb-6`}>Event Details</h2>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-200 mb-2">🗓️ Dates: 24 | 25 | 26 October 2025</p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-300 mb-6">📍 Location: Qadian, Punjab, India</p>
              <p className="text-xl sm:text-xl leading-relaxed text-yellow-300 mb-6">Mark your calendars for a weekend of spiritual enlightenment and brotherhood.</p>
            </div>
            
            {/* Card 4: Hashtags */}
            <div className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4">
              <h2 className={`text-4xl font-bold ${currentTheme.textColor} mb-6`}>Hashtags</h2>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="text-sm sm:text-base font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">#AnsarIjtemaBharat2025</span>
                  <span className="text-sm sm:text-base font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">#MajlisAnsarullah</span>
                  <span className="text-sm sm:text-base font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">#SalanaIjtema2025</span>
                  <span className="text-sm sm:text-base font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">#Ahmadiyyat</span>
                  <span className="text-sm sm:text-base font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">#IslamInIndia</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Navigation Link at the bottom */}
        <div className="mt-auto text-xl text-gray-300 animate-pulse">
            Click to {cardIndex === totalCards - 1 ? 'start over' : 'continue'}
        </div>
      </div>
    </main>
  );
}