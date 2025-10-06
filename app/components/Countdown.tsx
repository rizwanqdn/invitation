'use client';

import React, { useState, useEffect, useCallback } from 'react'; // 👈 ADDED useCallback

interface CountdownProps {
  targetDate: Date;
  textColor?: string;
}

// Define the colors for the countdown numbers
const countdownColors = [
  'text-yellow-300',
  'text-teal-300',
  'text-pink-300',
  'text-orange-300',
];

const Countdown: React.FC<CountdownProps> = ({ targetDate}) => {
  // 👈 WRAPPED in useCallback
  const calculateTimeLeft = useCallback(() => {
    const difference = +targetDate - +new Date();
    let timeLeft: { days?: number; hours?: number; minutes?: number; seconds?: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [targetDate]); // 👈 Added targetDate dependency

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    // Re-initialize time left on targetDate change
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % countdownColors.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]); // 👈 Now depends on calculateTimeLeft (which depends on targetDate)

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (timeLeft[interval as keyof typeof timeLeft] === undefined) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center text-center bg-white/10  sm:p-4 w-1/4 backdrop-blur-sm shadow-lg rounded-xl animate-pulseGlow">
        <span 
          className={`text-2xl sm:text-3xl md:text-5xl font-bold transition-transform duration-500 ${countdownColors[currentColorIndex]}`}>
          {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        </span>
        <span className="text-xs sm:text-sm md:text-base uppercase tracking-wider mt-1 text-gray-200">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-10 w-full max-w-xs sm:max-w-sm md:max-w-md">
      {timerComponents.length ? timerComponents : <span className="text-xl">Time&apos;s up!</span>}
    </div>
  );
};

export default Countdown;