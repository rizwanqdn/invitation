// app/components/Countdown.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
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
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (timeLeft[interval as keyof typeof timeLeft] === undefined) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center text-center bg-white/10 rounded-xl p-4 w-1/4 backdrop-blur-sm shadow-lg animate-pulseGlow">
        <span className="text-3xl md:text-5xl font-bold transition-transform duration-500">{String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}</span>
        <span className="text-xs md:text-base uppercase tracking-wider mt-1 text-gray-200">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center gap-4 mb-10 w-full max-w-sm md:max-w-md animate-slideInFromTop">
      {timerComponents.length ? timerComponents : <span className="text-xl">Time&apos;s up!</span>}
    </div>
  );
};

export default Countdown;