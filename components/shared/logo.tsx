import React from "react";

interface NextmoveLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function NextmoveLogo({
  size = 20,
  className = "",
  showText = false,
}: NextmoveLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform group-hover:scale-105"
      >
        <defs>
          <linearGradient
            id="nmLogoBg"
            x1="0"
            y1="0"
            x2="512"
            y2="512"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#121318" />
            <stop offset="100%" stopColor="#060608" />
          </linearGradient>
          <linearGradient
            id="nmLogoChev"
            x1="140"
            y1="120"
            x2="380"
            y2="390"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="35%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <radialGradient
            id="nmLogoBeacon"
            cx="0.5"
            cy="0.5"
            r="0.5"
            fx="0.5"
            fy="0.5"
          >
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>
        </defs>

        {/* Squircle container with hairline stroke */}
        <rect width="512" height="512" rx="116" fill="url(#nmLogoBg)" />
        <rect
          x="6"
          y="6"
          width="500"
          height="500"
          rx="110"
          stroke="#27272A"
          strokeWidth="12"
        />

        {/* Forward Tactical Chevron (Nextmove Vector) */}
        <path
          d="M 148 122 C 148 110 161 103 171 110 L 374 245 C 382 250 382 262 374 267 L 171 402 C 161 409 148 402 148 390 V 328 C 148 320 152 312 159 308 L 244 256 L 159 204 C 152 200 148 192 148 184 Z"
          fill="url(#nmLogoChev)"
        />

        {/* Live Signal Intelligence Beacon */}
        <circle cx="372" cy="256" r="22" fill="url(#nmLogoBeacon)" />
      </svg>

      {showText && (
        <span className="font-semibold text-[15px] tracking-tight text-text">
          Nextmove
        </span>
      )}
    </div>
  );
}
