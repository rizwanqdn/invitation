// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Content from './components/Content';

// Define a type for a single theme
type Theme = {
  mediaType: 'image' | 'video';
  mediaSource: string; // This will hold the path to the image or video
  borderColor: string;
  textColor: string;
};

// Define your list of themes with local background images and a video
const themes: Theme[] = [
  {
    mediaType: 'image',
    mediaSource: "/islamic-pattern.jpg",
    borderColor: "border-yellow-300/40",
    textColor: "text-yellow-300",
  },
  {
    mediaType: 'image',
    mediaSource: "/white-pattern.jpg",
    borderColor: "border-teal-300/40",
    textColor: "text-teal-300",
  },
  {
    mediaType: 'image',
    mediaSource: "/black-pattern.jpg",
    borderColor: "border-pink-300/40",
    textColor: "text-pink-300",
  },
  {
    mediaType: 'image',
    mediaSource: "/backgrounds/background1.jpg",
    borderColor: "border-gray-500/40",
    textColor: "text-gray-300",
  },
  {
    mediaType: 'video',
    mediaSource: "/backgrounds/background-video.mp4", // This is your video source
    borderColor: "border-orange-500/40",
    textColor: "text-orange-300",
  },
];

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [headingsVisible, setHeadingsVisible] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);

    // Set headings to visible after a delay
    const headingTimer = setTimeout(() => {
      setHeadingsVisible(true);
    }, 500); // Wait 0.5s before starting the flip animation

    return () => clearTimeout(headingTimer);
  }, []);

  // Function to toggle the audio
  const toggleAudio = () => {
    setIsMuted(!isMuted);
  };

  const content = {
    title: 'The countdown begins!',
    subtitle: 'Mark your calendars for a weekend of spiritual enlightenment and brotherhood.',
    date: '🗓️ Dates: 24 | 25 | 26 October 2025 Friday | Saturday | Sunday',
    location: '📍 Location: Qadian, Punjab, India',
    hashtags: ['AnsarIjtemaBharat2025', 'MajlisAnsarullah', 'SalanaIjtema2025', 'Ahmadiyyat', 'IslamInIndia']
  };

  if (!currentTheme) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 text-white text-center font-sans overflow-hidden">
      {/* Background Layer: Conditionally render video or image */}
      {currentTheme.mediaType === 'video' ? (
        <video
          className="absolute inset-0 z-0 w-full h-full object-cover bg-fixed"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={currentTheme.mediaSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed animate-ken-burns" 
          style={{ backgroundImage: `url('${currentTheme.mediaSource}')` }}
        ></div>
      )}
      
      {/* Audio Element: Controls the volume based on state */}
      <audio autoPlay loop muted={isMuted}>
        <source src="/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Audio Control Button */}
      <button 
        onClick={toggleAudio}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors text-white"
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

      {/* Main Content Container with a subtle blur effect */}
      <div className={`relative z-10 w-full max-w-2xl backdrop-blur-sm bg-black/30 p-6 sm:p-8 rounded-3xl shadow-3xl border-2 ${currentTheme.borderColor}`}>
        
        {/* English Headings with a staggered delay and new animation */}
        <div className={`p-4 sm:p-4 rounded-lg transition-transform duration-1000 ${headingsVisible ? 'animate-flip-in' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
          <h1 className={`text-5xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>Salana Ijtema</h1>
          <h1 className={`text-3xl sm:text-4xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>Majlis Ansarullah Bharat 2025</h1>
        </div>

        {/* Urdu Headings with a staggered delay and new animation */}
        <div className={`p-4 sm:p-4 rounded-lg transition-transform duration-1000 ${headingsVisible ? 'animate-flip-in' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-6xl sm:text-6xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>سالانہ اجتماع </h1>
         <h1 style={{ fontFamily: "'Jameel Noori Nastaleeq', sans-serif" }} className={`text-6xl sm:text-6xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>مجلس انصار اللہ بھارت</h1>
         <h1  className={`text-5xl sm:text-6xl md:text-6xl font-extrabold mb-1 sm:mb-2 ${currentTheme.textColor} drop-shadow-lg animate-pulse-fast`}>2025</h1>
        </div>
         
        {/* Content component with a longer delay */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
          <Content content={content} />
        </div>
      </div>
    </main>
  );
}