// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        // Standard Keyframes
        
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInFromTop: {
          '0%': { opacity: '0', transform: 'translateY(-50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flipIn: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        animatedGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        
        // Custom Modern Keyframes (For unique design aesthetics)
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)', 'filter': 'brightness(100%)' },
          '50%': { transform: 'scale(1.15) translate(5%, 5%)', 'filter': 'brightness(90%)' },
          '100%': { transform: 'scale(1) translate(0, 0)', 'filter': 'brightness(100%)' },
        },
        'slow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.9' },
        },
        'bounce-subtle': {
            '0%, 100%': { transform: 'translateY(-2%)' },
            '50%': { transform: 'translateY(0)' },
        },
        pulseFast: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      animation: {
        // Standard Animations
        fadeIn: 'fadeIn 1s ease-in-out',
        slideInFromTop: 'slideInFromTop 1s ease-out',
        animatedGradient: 'animatedGradient 15s ease infinite',
        pulseGlow: 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeInUp: 'fadeInUp 1s ease-out forwards',
        'pulse-fast': 'pulseFast 1s ease-in-out infinite',
        
        // Custom Modern Animations (Used in app/page.tsx)
        'ken-burns': 'ken-burns 40s ease-in-out infinite alternate', 
        'slow-pulse': 'slow-pulse 15s ease-in-out infinite alternate', 
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
      },
      
      // Font Definitions for Readability and Urdu Text
      fontFamily: {
        // Fallback for standard text, assuming you have imported these
        sans: ['Jost', 'Lato', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        // Critical for Urdu text (You must ensure this font is imported via CSS/Next.js)
        'jameel-noori-nastaleeq': ['Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'sans-serif'],
      },
      
      // Shadow and DropShadow Adjustments
      dropShadow: {
        'lg': '0 10px 10px rgba(0, 0, 0, 0.5)',
      },
      boxShadow: {
        // Enhanced 3D/Floating look
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;