"use client";

import React, { useState, useEffect, useCallback } from "react";

interface CountdownProps {
  targetDate: Date;
  /** Smaller box padding/text — used for the mini strip shown on non-dedicated pages. */
  compact?: boolean;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  compact = false,
}) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +targetDate - +new Date();
    if (difference <= 0) return ZERO;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const isComplete =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (isComplete) {
    return (
      <p
        className={
          compact
            ? "text-sm font-semibold text-amber-200"
            : "text-xl sm:text-2xl font-semibold text-amber-200"
        }
      >
        The Ijtema has begun!
      </p>
    );
  }

  return (
    <div
      className={`flex justify-center w-full ${compact ? "gap-1.5 max-w-[15rem]" : "gap-2 sm:gap-3 max-w-xs sm:max-w-sm"}`}
    >
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className={`flex flex-col items-center justify-center flex-1 rounded-xl
                     border border-white/10 bg-white/5 ${compact ? "py-1.5" : "py-3 sm:py-4"}`}
        >
          <span
            className={
              compact
                ? "text-sm font-semibold tabular-nums text-white"
                : "text-xl sm:text-3xl font-semibold tabular-nums text-white"
            }
          >
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span
            className={
              compact
                ? "text-[8px] uppercase tracking-wider text-slate-400"
                : "text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 mt-1"
            }
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
