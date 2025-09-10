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
    <div className={`p-6 md:p-8 bg-black/10 rounded-2xl shadow-xl border border-white/10 transition-all duration-1000 ease-in-out delay-[1500ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      
      {/* The logo is now an optimized Next.js Image component */}
      <div className="flex justify-center mb-6">
        <Image
          src="/ansarullah-logo.png"
          alt="Majlis Ansarullah Logo"
          width={128} // You must define width and height for Image
          height={128} // These are the intrinsic dimensions of the image
          className="rounded-full border-4 border-yellow-300 shadow-lg w-24 h-24 md:w-32 md:h-32"
        />
      </div>

      {/* The countdown message you requested */}
      <p className="text-2xl md:text-3xl font-semibold mb-6 text-amber-200">{content.title}</p>
        <div className='items-center justify-center mt-6 align-middle'>
                <Countdown targetDate={targetDate} />
                <h1 className='text-2xl md:text-2xl font-extrabold mb-9 animate-fadeIn text-yellow-300 drop-shadow-lg'>Left</h1>
              </div>
      {/* Date and Location in larger fonts */}
      <p className="text-lg md:text-xl font-medium text-amber-200 mb-2">{content.date}</p>
      <p className="text-md md:text-lg font-medium text-gray-300 mb-6">{content.location}</p>
      
      {/* Spiritual message */}
      <p className="text-base md:text-lg leading-relaxed text-gray-300 mb-6">{content.subtitle}</p>
      
      {/* Hashtags */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {content.hashtags.map((tag, index) => (
          <span key={index} className="text-xs md:text-sm font-medium bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/40 transition-colors">{`#${tag}`}</span>
        ))}
      </div>
    </div>
  );
};

export default Content;