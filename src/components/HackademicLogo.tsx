import React from 'react';

interface HackademicLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textColor?: 'dark' | 'light' | 'cyan';
}

export const HackademicLogo: React.FC<HackademicLogoProps> = ({
  size = 40,
  showText = true,
  className = '',
  textColor = 'light',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector Emblem matching the Hackademic Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="hackademicSwoop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00b4d8" />
            <stop offset="50%" stopColor="#0096c7" />
            <stop offset="100%" stopColor="#0077b6" />
          </linearGradient>
          <linearGradient id="hackademicShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a2540" />
            <stop offset="100%" stopColor="#041b2d" />
          </linearGradient>
          <linearGradient id="hackademicCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Dynamic Orbital Swoop Behind / Wrapping Around Shield */}
        <path
          d="M 320 40 C 430 10 490 80 470 170 C 440 270 330 380 70 370 C 30 368 5 330 20 290 C 35 250 80 230 120 235 C 100 280 130 320 200 330 C 330 350 440 260 450 170 C 460 90 390 50 320 40 Z"
          fill="url(#hackademicCyanGlow)"
        />

        {/* Outer Shield Outline */}
        <path
          d="M 250 70 L 410 135 L 390 280 C 370 375 250 435 250 435 C 250 435 130 375 110 280 L 90 135 Z"
          fill="#06283d"
          stroke="#00b4d8"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Inner Shield Facet */}
        <path
          d="M 250 105 L 375 158 L 360 270 C 342 345 250 395 250 395 C 250 395 158 345 140 270 L 125 158 Z"
          fill="#021422"
          stroke="#083344"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* Circular Aperture Ring Outer (Vibrant Cyan) */}
        <circle
          cx="250"
          cy="235"
          r="86"
          fill="#00b4d8"
        />

        {/* Circular Aperture Ring Mid (Dark Teal Navy) */}
        <circle
          cx="250"
          cy="235"
          r="66"
          fill="#041b2d"
        />

        {/* Circular Aperture Iris / Lens Center */}
        <circle
          cx="250"
          cy="235"
          r="46"
          fill="#00b4d8"
        />

        {/* Core Pupil (Deep Navy) */}
        <circle
          cx="250"
          cy="235"
          r="34"
          fill="#021422"
        />

        {/* Specular Highlight Dot */}
        <circle
          cx="262"
          cy="222"
          r="9"
          fill="#ffffff"
        />
        <circle
          cx="242"
          cy="244"
          r="4"
          fill="#ffffff"
          opacity="0.7"
        />
      </svg>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-wider uppercase text-lg sm:text-xl font-serif ${
                textColor === 'light'
                  ? 'text-white'
                  : textColor === 'cyan'
                  ? 'text-cyan-400'
                  : 'text-slate-900'
              }`}
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Cinzel', 'Rockwell', 'Georgia', serif",
                letterSpacing: '0.08em',
              }}
            >
              HACK<span className="text-cyan-400">ADEMIC</span>
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 -mt-1">
            Career Intelligence Platform
          </span>
        </div>
      )}
    </div>
  );
};
