// app/components/Content.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Import the Image component
import Countdown from './Countdown';

interface ContentProps {
  content: {
    title: string;
    subtitle: string;
    date: string;
    location: string;
    hashtags: string[];
  };
}

const Content: React.FC<ContentProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetDate = new Date('2025-10-24T00:00:00Z');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-6 md:p-8 bg-black/10 rounded-2xl shadow-xl border border-white/10 transition-all duration-1000 ease-in-out delay-[1500ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      
      {/* The logo is now an optimized Next.js Image component */}
      <div className="relative flex justify-center mb-3">
        {/* A container for the logo to control its size */}
        <div className="relative w-32 h-32 md:w-48 md:h-48">
          <Image
            src="/ansarullah-logo.png"
            alt="Majlis Ansarullah Logo"
            fill // Use fill to make the image cover the parent container
            className="rounded-full border-6 border-yellow-300 shadow-lg object-contain" // object-contain ensures the image fits without cropping
          />
        </div>
      </div>

      {/* The countdown message and countdown are grouped */}
      <div className="mt-4 flex flex-col items-center">
        {/* Adjusted title size for smaller screens */}
        <p className="text-3xl sm:text-3xl md:text-3xl font-semibold mb-4 text-amber-200">{content.title}</p>
        
        {/* ADDED: A new flexbox container to center the countdown and heading */}
        <div className="flex flex-col items-center">
            <Countdown targetDate={targetDate} />
            <h1 className='text-xl sm:text-2xl md:text-3xl font-extrabold mb-6 animate-fadeIn text-yellow-300 drop-shadow-lg'>Left</h1>
        </div>
      </div>

      {/* Date and Location in larger fonts */}
      <p className="text-md sm:text-lg md:text-xl font-extrabold text-amber-200 mb-2">{content.date}</p>
      <p className="text-sm sm:text-md md:text-lg font-extrabold text-gray-300 mb-6">{content.location}</p>
      
      {/* Spiritual message */}
      <p className="text-xl sm:text-base md:text-lg leading-relaxed text-yellow-300 mb-6">{content.subtitle}</p>
      
      {/* Hashtags */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {content.hashtags.map((tag, index) => (
          <span key={index} className="text-xs sm:text-sm font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">{`#${tag}`}</span>
        ))}
      </div>
    </div>
  );
};

export default Content;

