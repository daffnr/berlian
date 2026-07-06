import React from "react";

export function Logo({ className = "h-8 w-8", showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Diamond facets (geometris & modern) */}
        <polygon
          points="50,20 65,35 50,80 35,35"
          fill="url(#diamond-center-grad)"
          className="stroke-cyan-200/20 dark:stroke-cyan-500/20"
          strokeWidth="0.5"
        />
        <polygon
          points="50,20 80,35 65,35"
          fill="url(#diamond-right-top-grad)"
        />
        <polygon
          points="65,35 80,35 50,80"
          fill="url(#diamond-right-bottom-grad)"
        />
        <polygon
          points="35,35 50,20 20,35"
          fill="url(#diamond-left-top-grad)"
        />
        <polygon
          points="20,35 35,35 50,80"
          fill="url(#diamond-left-bottom-grad)"
        />

        {/* Circular recycling / circular arrow loops */}
        {/* Top-Right Arrow Sweep */}
        <path
          d="M 50 8 C 72 8 90 26 92 48"
          stroke="url(#arrow-grad-1)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points="92,48 87,40 97,40"
          fill="#06b6d4"
        />

        {/* Bottom-Left Arrow Sweep */}
        <path
          d="M 50 92 C 28 92 10 74 8 52"
          stroke="url(#arrow-grad-2)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points="8,52 13,60 3,60"
          fill="#0d9488"
        />

        {/* Gradient Defs */}
        <defs>
          <linearGradient id="diamond-center-grad" x1="50" y1="20" x2="50" y2="80">
            <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-400 */}
            <stop offset="100%" stopColor="#0284c7" /> {/* sky-600 */}
          </linearGradient>
          <linearGradient id="diamond-right-top-grad" x1="50" y1="20" x2="80" y2="35">
            <stop offset="0%" stopColor="#e0f7fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="diamond-right-bottom-grad" x1="65" y1="35" x2="50" y2="80">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0369a1" /> {/* sky-700 */}
          </linearGradient>
          <linearGradient id="diamond-left-top-grad" x1="50" y1="20" x2="20" y2="35">
            <stop offset="0%" stopColor="#e0f7fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="diamond-left-bottom-grad" x1="35" y1="35" x2="50" y2="80">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="arrow-grad-1" x1="50" y1="8" x2="92" y2="48">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="arrow-grad-2" x1="50" y1="92" x2="8" y2="52">
            <stop offset="0%" stopColor="#0d9488" /> {/* teal-600 */}
            <stop offset="100%" stopColor="#14b8a6" /> {/* teal-500 */}
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className="font-black text-slate-900 dark:text-white tracking-wider text-base">
          BERLIAN
        </span>
      )}
    </div>
  );
}
