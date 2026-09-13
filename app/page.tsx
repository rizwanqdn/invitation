"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Countdown from "./components/Countdown";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const BACKGROUNDS = [
  "/backgrounds/background1.jpg",
  "/backgrounds/background3.jpg",
  "/backgrounds/background4.jpg",
  "/backgrounds/background5.jpg",
  "/islamic-pattern.jpg",
];

const BRAND = {
  accent: "#D4AF37", // muted gold
  accentSoft: "rgba(212, 175, 55, 0.35)",
};

const FLIP_DURATION = 750; // ms — one book page turn
const FLIP_EASING = "cubic-bezier(0.45, 0.05, 0.25, 1)";

type Section = {
  id: string;
  label: string;
};

const SECTIONS: Section[] = [
  { id: "welcome", label: "Welcome" },
  { id: "countdown", label: "Countdown" },
  { id: "details", label: "Details" },
  { id: "links", label: "Links" },
];

// Small inline icons — avoids adding an icon-library dependency.
const SectionIcon: React.FC<{ id: string; className?: string }> = ({
  id,
  className,
}) => {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };
  switch (id) {
    case "welcome":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l7 4v5c0 4.4-3 8-7 9-4-1-7-4.6-7-9V7l7-4z"
          />
        </svg>
      );
    case "countdown":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="13"
            r="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4l3 2M9 2h6"
          />
        </svg>
      );
    case "details":
      return (
        <svg {...common}>
          <rect
            x="4"
            y="5"
            width="16"
            height="16"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 3v4M16 3v4M4 10h16"
          />
        </svg>
      );
    case "links":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15l6-6M10 6l1-1a4 4 0 015.7 5.7l-1.4 1.4M14 18l-1 1a4 4 0 01-5.7-5.7l1.4-1.4"
          />
        </svg>
      );
    default:
      return null;
  }
};

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const TARGET_DATE = new Date("2026-10-23T00:00:00");

// External-link arrow used on the Links section
const ExternalArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

// Small ornamental divider — reads as "formal invitation", not plain hr
const GoldDivider: React.FC = () => (
  <div className="flex items-center gap-3 w-40" aria-hidden>
    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/50" />
    <span className="h-1.5 w-1.5 rotate-45 bg-amber-400/70" />
    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/50" />
  </div>
);

// ---------------------------------------------------------------------------
// Book page card shell
// ---------------------------------------------------------------------------
// Each card is a "sheet" hinged on the left edge. Its rotation is a pure
// function of index vs. currentIndex, so React re-renders animate it for
// free — going back just reverses the same transition.
//
// `prevIndex` lets a card know whether IT is one of the sheets actually in
// motion on this particular update (as opposed to a sheet that was already
// flat before and after). Only sheets in motion get the shading/lift
// treatment, so jumping several pages via the nav dots doesn't flash shadow
// across pages that never moved.

interface CardProps {
  index: number;
  currentIndex: number;
  prevIndex: number;
  isFlipping: boolean;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  index,
  currentIndex,
  prevIndex,
  isFlipping,
  children,
}) => {
  const isActive = index === currentIndex;
  const turned = index < currentIndex;
  const wasTurned = index < prevIndex;
  const isTransitioning = isFlipping && turned !== wasTurned;

  const zIndex = turned ? 60 : isActive ? 50 : 40 - index;

  const faceBase =
    "absolute inset-0 rounded-3xl border border-white/10 overflow-hidden";

  return (
    <div
      className="absolute inset-0 will-change-transform"
      style={{
        transform: `rotateY(${turned ? -180 : 0}deg)`,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        transition: `transform ${FLIP_DURATION}ms ${FLIP_EASING}`,
        zIndex,
        pointerEvents: isActive ? "auto" : "none",
      }}
      aria-hidden={!isActive}
    >
      {/* FRONT of the page */}
      <div
        className={`${faceBase} bg-slate-950/60 backdrop-blur-xl ${
          isTransitioning ? "page-flip-lift" : "shadow-2xl"
        }`}
        style={{ backfaceVisibility: "hidden" }}
      >
        {/* Book gutter: soft shadow along the spine */}
        <div
          className="absolute inset-y-0 left-0 w-10 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.45), transparent)",
          }}
        />
        {/* Page-edge hint: fine lines at the right suggesting a page stack */}
        <div
          className="absolute inset-y-3 right-0 w-[5px] rounded-r-3xl pointer-events-none opacity-60"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.10) 0 1px, transparent 1px 4px)",
          }}
        />
        {/* Folded corner hint — invites a page turn */}
        <div
          className="absolute bottom-0 right-0 h-9 w-9 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.4) 45%, rgba(0,0,0,0.4) 46%, transparent 48%)",
            clipPath: "polygon(100% 100%, 100% 38%, 38% 100%)",
            filter: "drop-shadow(-1px -1px 2px rgba(0,0,0,0.35))",
          }}
        />
        {/* Directional shading — brightens/darkens as the sheet lifts off
            the page, peaking exactly as it turns edge-on to the viewer. */}
        {isTransitioning && (
          <div
            className="absolute inset-0 z-20 pointer-events-none page-flip-shade"
            style={{
              background:
                "linear-gradient(100deg, rgba(0,0,0,0.65), transparent 55%)",
            }}
          />
        )}

        <div className="relative w-full h-full flex flex-col overflow-y-auto">
          {children}
        </div>
      </div>

      {/* BACK of the page — what you see while/after a sheet is turned */}
      <div
        className={`${faceBase} bg-slate-900 ${
          isTransitioning ? "page-flip-lift" : "shadow-2xl"
        }`}
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        {/* Faint decorative lattice on the page back */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #D4AF37 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, #D4AF37 0 1px, transparent 1px 14px)",
          }}
        />
        {/* Spine shadow along the right edge of the back (which is the
            spine side once the page has landed on the left) */}
        <div
          className="absolute inset-y-0 right-0 w-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(0,0,0,0.5), transparent)",
          }}
        />
        {isTransitioning && (
          <div
            className="absolute inset-0 z-20 pointer-events-none page-flip-shade"
            style={{
              background:
                "linear-gradient(260deg, rgba(0,0,0,0.65), transparent 55%)",
            }}
          />
        )}
        {/* Centered ornament */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 opacity-70">
            <span className="h-2 w-2 rotate-45 bg-amber-400/60" />
            <span className="h-px w-24 bg-amber-400/40" />
            <span className="h-2 w-2 rotate-45 bg-amber-400/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Shared header / footer / heading
// ---------------------------------------------------------------------------

const CardHeader: React.FC = () => (
  <div className="w-full pt-5 pb-3 px-6 text-center border-b border-white/10 shrink-0">
    <p
      style={{ fontFamily: "'Jameel Noori Nastaleeq', serif" }}
      className="text-xl sm:text-3xl text-amber-100/90 leading-snug"
    >
      سالانہ اجتماع مجلس انصار اللہ بھارت
    </p>
    <div className="mt-2 flex justify-center">
      <GoldDivider />
    </div>
    <h1 className="mt-2 text-base sm:text-xl font-semibold tracking-[0.08em] text-white font-serif uppercase">
      Salana Ijtema
    </h1>
    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400 mt-1">
      Majlis Ansarullah Bharat &middot; 2026
    </p>
  </div>
);

const PageFooter: React.FC<{ page: number; total: number }> = ({
  page,
  total,
}) => (
  <div className="shrink-0 pb-2 pt-1 flex justify-center">
    <span className="text-[10px] tracking-[0.3em] text-slate-500">
      &mdash;&nbsp; {page} / {total} &nbsp;&mdash;
    </span>
  </div>
);

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex flex-col items-center gap-2">
    <h2 className="text-xs sm:text-sm uppercase tracking-[0.25em] text-amber-200/90 font-semibold">
      {children}
    </h2>
    <GoldDivider />
  </div>
);

// A countdown strip reused at the top of every page (except the dedicated
// Countdown page itself, which already shows the full version as its main
// content) — keeps the "time remaining" visible no matter which page
// someone lands on. `large` shows the full-size boxes (used on the Welcome
// page, where there's more room); the other pages use the compact form so
// it doesn't compete with their own content.
const MiniCountdown: React.FC<{ large?: boolean }> = ({ large = false }) => (
  <div
    className={`w-full px-6 flex flex-col items-center shrink-0 ${large ? "pt-4 gap-2" : "pt-3 gap-1"}`}
  >
    <p
      className={
        large
          ? "text-[10px] uppercase tracking-[0.3em] text-amber-200/70"
          : "text-[9px] uppercase tracking-[0.25em] text-amber-200/70"
      }
    >
      Countdown
    </p>
    <Countdown targetDate={TARGET_DATE} compact={!large} />
  </div>
);

const CHEVRON_BTN_CLASS =
  "hidden sm:flex shrink-0 h-11 w-11 items-center justify-center rounded-full " +
  "bg-slate-900/70 border border-white/10 text-white/80 hover:text-white " +
  "hover:bg-slate-900/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70";

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [background, setBackground] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    setBackground(BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]);
  }, []);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("lastSectionIndex")
        : null;
    if (saved !== null) {
      const n = parseInt(saved, 10);
      if (!isNaN(n)) {
        setSectionIndex(Math.min(Math.max(n, 0), SECTIONS.length - 1));
        prevIndexRef.current = Math.min(Math.max(n, 0), SECTIONS.length - 1);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lastSectionIndex", sectionIndex.toString());
    }
  }, [sectionIndex]);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    if (!nextMuted) {
      audio.play().catch((e) => console.error("Audio playback failed:", e));
    }
    setIsMuted(nextMuted);
  }, [isMuted]);

  const goTo = useCallback((i: number) => {
    setSectionIndex((prev) => {
      const next = Math.min(Math.max(i, 0), SECTIONS.length - 1);
      if (next === prev) return prev;
      prevIndexRef.current = prev;
      setIsFlipping(true);
      if (flipTimer.current) clearTimeout(flipTimer.current);
      flipTimer.current = setTimeout(() => setIsFlipping(false), FLIP_DURATION);
      return next;
    });
  }, []);
  const goNext = useCallback(
    () => goTo(sectionIndex + 1),
    [sectionIndex, goTo],
  );
  const goPrev = useCallback(
    () => goTo(sectionIndex - 1),
    [sectionIndex, goTo],
  );

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  // Touch swipe navigation
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 40;
    if (deltaX > SWIPE_THRESHOLD) goPrev();
    else if (deltaX < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  };

  return (
    <main className="relative flex h-screen min-h-screen flex-col items-center justify-center p-3 sm:p-6 text-white font-sans overflow-hidden">
      {/* Keyframes for the paper-flip shading & shadow lift. Defined once,
          globally, since @keyframes cannot be scoped per-element anyway. */}
      <style>{`
        @keyframes pageShade {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 0.55;
          }
        }
        @keyframes pageLiftShadow {
          0%,
          100% {
            box-shadow:
              0 10px 15px -3px rgba(0, 0, 0, 0.35),
              0 4px 6px -4px rgba(0, 0, 0, 0.35);
          }
          50% {
            box-shadow:
              0 30px 55px -10px rgba(0, 0, 0, 0.6),
              0 12px 20px -6px rgba(0, 0, 0, 0.45);
          }
        }
        .page-flip-shade {
          animation: pageShade ${FLIP_DURATION}ms ${FLIP_EASING};
        }
        .page-flip-lift {
          animation: pageLiftShadow ${FLIP_DURATION}ms ${FLIP_EASING};
        }
      `}</style>

      {/* Background — random per refresh; solid dark slate shown until
          picked so there's no blank flash on first paint */}
      <div
        className="absolute inset-0 z-0 bg-slate-950 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: background ? `url('${background}')` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(2,6,23,0) 35%, rgba(2,6,23,0.55) 100%)",
          }}
        />
      </div>

      {/* Audio */}
      <audio ref={audioRef} autoPlay loop muted={isMuted}>
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-slate-900/70 border border-white/10
                   text-white/90 hover:bg-slate-900/90 hover:text-white transition-colors shadow-lg
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
        aria-label={
          isMuted ? "Unmute background audio" : "Mute background audio"
        }
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5v14m0-14H5a2 2 0 00-2 2v10a2 2 0 002 2h6l5 4V1l-5 4z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 9l5 5m0-5l-5 5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5v14m0-14H5a2 2 0 00-2 2v10a2 2 0 002 2h6l5 4V1l-5 4z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9v6M18 7v10"
            />
          </svg>
        )}
      </button>

      {/* Row: [prev chevron] [book] [next chevron] — all in normal flex
          flow instead of absolutely positioned outside the book's bounds.
          That's what was clipping the chevrons on medium-width desktop
          windows before; now the whole row just shrinks together and
          nothing can spill past the viewport edge. */}
      <div className="relative z-20 w-full max-w-5xl flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">
        <button
          onClick={goPrev}
          disabled={sectionIndex === 0 || isFlipping}
          aria-label="Previous page"
          className={CHEVRON_BTN_CLASS}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-md sm:max-w-xl lg:max-w-2xl h-[78vh] sm:h-[95vh]  max-h-[720px] flex flex-col">
          <div
            className="relative flex-1"
            style={{ perspective: "1800px" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Page 1 — Welcome */}
            <Card
              index={0}
              currentIndex={sectionIndex}
              prevIndex={prevIndexRef.current}
              isFlipping={isFlipping}
            >
              <CardHeader />
              <MiniCountdown large />
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-3 gap-3">
                <div className="relative">
                  <span
                    className="absolute -inset-4 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative w-32 h-32 sm:w-24 sm:h-24 rounded-full ring-1 ring-amber-400/50 p-1.5">
                    <div className="relative w-full h-full rounded-full ring-1 ring-amber-400/25 overflow-hidden">
                      <Image
                        src="/ansarullah-logo.png"
                        alt="Majlis Ansarullah logo"
                        fill
                        sizes="(min-width: 640px) 6rem, 4rem"
                        style={{ objectFit: "contain" }}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-200/80">
                    You are cordially invited
                  </p>
                  <p className="text-center text-slate-200 text-sm sm:text-base max-w-sm leading-relaxed">
                    Join us for the 2026 Salana Ijtema of Majlis Ansarullah
                    Bharat — a gathering of faith, learning, and fellowship.
                  </p>
                </div>
              </div>
              <PageFooter page={1} total={SECTIONS.length} />
            </Card>

            {/* Page 2 — Countdown */}
            <Card
              index={1}
              currentIndex={sectionIndex}
              prevIndex={prevIndexRef.current}
              isFlipping={isFlipping}
            >
              <CardHeader />
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-5">
                <SectionHeading>Countdown to the Ijtema</SectionHeading>
                <Countdown targetDate={TARGET_DATE} />
                <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed">
                  Time remaining until this year&apos;s gathering begins.
                </p>
              </div>
              <PageFooter page={2} total={SECTIONS.length} />
            </Card>

            {/* Page 3 — Details */}
            <Card
              index={2}
              currentIndex={sectionIndex}
              prevIndex={prevIndexRef.current}
              isFlipping={isFlipping}
            >
              <CardHeader />
              <MiniCountdown />
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-5">
                <SectionHeading>Event Details</SectionHeading>
                <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-5 text-center space-y-3 relative overflow-hidden">
                  <span
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
                    }}
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1">
                      Dates
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-white">
                      23 &ndash; 25 October 2026
                    </p>
                    <p className="text-xs sm:text-sm text-amber-200/80 mt-1 tracking-wide">
                      Friday &middot; Saturday &middot; Sunday
                    </p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1">
                      Venue
                    </p>
                    <p className="text-sm sm:text-base text-slate-100">
                      Qadian, Punjab, India
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 text-center max-w-sm leading-relaxed">
                  Mark your calendars for a weekend of spiritual enlightenment
                  and brotherhood.
                </p>
              </div>
              <PageFooter page={3} total={SECTIONS.length} />
            </Card>

            {/* Page 4 — Links */}
            <Card
              index={3}
              currentIndex={sectionIndex}
              prevIndex={prevIndexRef.current}
              isFlipping={isFlipping}
            >
              <CardHeader />
              <MiniCountdown />
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-4">
                <SectionHeading>Useful Links</SectionHeading>
                <div className="w-full max-w-xs flex flex-col gap-1.5">
                  {[
                    {
                      href: "https://ansarullahbharat.in",
                      text: "ansarullahbharat.in",
                    },
                    {
                      href: "https://ahmadiyyamuslimjamaat.in/",
                      text: "ahmadiyyamuslimjamaat.in",
                    },
                    { href: "https://www.alislam.org/", text: "alislam.org" },
                    {
                      href: "https://lightofislam.in/",
                      text: "lightofislam.in",
                    },
                    { href: "https://akhbarbadr.in/", text: "akhbarbadr.in" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-full flex items-center justify-between text-sm font-medium
                                 px-4 py-2 rounded-xl text-slate-100
                                 border border-white/10 bg-slate-900/60 backdrop-blur-sm
                                 hover:border-amber-400/40 hover:bg-slate-900/80
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70
                                 transition-colors"
                    >
                      <span className="truncate">{link.text}</span>
                      <ExternalArrow className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-300 transition-colors shrink-0 ml-3" />
                    </a>
                  ))}
                </div>
              </div>
              <PageFooter page={4} total={SECTIONS.length} />
            </Card>
          </div>

          {/* Progress navigation */}
          <nav
            className="mt-4 flex items-center justify-center gap-2 flex-wrap"
            aria-label="Section navigation"
          >
            {SECTIONS.map((section, i) => (
              <button
                key={section.id}
                onClick={() => goTo(i)}
                disabled={isFlipping}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70
                  ${
                    i === sectionIndex
                      ? "bg-amber-400/90 text-slate-900 border-amber-400"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                  } ${isFlipping ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-current={i === sectionIndex ? "true" : undefined}
              >
                <SectionIcon
                  id={section.id}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={goNext}
          disabled={sectionIndex === SECTIONS.length - 1 || isFlipping}
          aria-label="Next page"
          className={CHEVRON_BTN_CLASS}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
