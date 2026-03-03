const BotanicalBackground = () => (
  <svg
    className="fixed inset-0 w-full h-full -z-10 pointer-events-none breathe-anim"
    viewBox="0 0 1920 1080"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#a8d5a8', stopOpacity: 0.5 }} />
        <stop offset="100%" style={{ stopColor: '#7fb77f', stopOpacity: 0.2 }} />
      </linearGradient>
      <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#d4a8d8', stopOpacity: 0.6 }} />
        <stop offset="100%" style={{ stopColor: '#a589b8', stopOpacity: 0.3 }} />
      </linearGradient>
      <filter id="flowerGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Top Left */}
    <g className="leaf-left-1">
      <circle cx="80" cy="120" r="6" fill="url(#flowerGrad)" opacity="0.7" filter="url(#flowerGlow)" />
      <circle cx="60" cy="110" r="4" fill="#d4a8d8" opacity="0.5" />
      <circle cx="70" cy="95" r="4" fill="#d4a8d8" opacity="0.5" />
      <circle cx="90" cy="100" r="4" fill="#d4a8d8" opacity="0.5" />
      <circle cx="100" cy="115" r="4" fill="#d4a8d8" opacity="0.5" />
      <path d="M 50 100 Q 100 200 80 350 Q 60 450 120 500" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="50" cy="100" rx="16" ry="26" fill="url(#leafGrad)" transform="rotate(-35 50 100)" />
      <ellipse cx="70" cy="160" rx="14" ry="24" fill="url(#leafGrad)" transform="rotate(20 70 160)" />
      <ellipse cx="65" cy="230" rx="15" ry="25" fill="url(#leafGrad)" transform="rotate(-25 65 230)" />
      <ellipse cx="85" cy="310" rx="17" ry="27" fill="url(#leafGrad)" transform="rotate(30 85 310)" />
    </g>

    {/* Top Right */}
    <g className="leaf-right-1">
      <circle cx="1850" cy="100" r="6" fill="url(#flowerGrad)" opacity="0.7" filter="url(#flowerGlow)" />
      <circle cx="1830" cy="90" r="4" fill="#d4a8d8" opacity="0.5" />
      <circle cx="1860" cy="80" r="4" fill="#d4a8d8" opacity="0.5" />
      <path d="M 1870 80 Q 1820 180 1840 320 Q 1830 420 1780 500" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="1870" cy="80" rx="17" ry="28" fill="url(#leafGrad)" transform="rotate(35 1870 80)" />
      <ellipse cx="1835" cy="160" rx="15" ry="25" fill="url(#leafGrad)" transform="rotate(-15 1835 160)" />
      <ellipse cx="1840" cy="240" rx="16" ry="26" fill="url(#leafGrad)" transform="rotate(25 1840 240)" />
    </g>

    {/* Bottom Left */}
    <g className="leaf-left-2">
      <circle cx="200" cy="980" r="7" fill="url(#flowerGrad)" opacity="0.8" filter="url(#flowerGlow)" />
      <path d="M 150 1000 Q 180 900 170 750 Q 165 600 190 450" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="150" cy="1000" rx="18" ry="28" fill="url(#leafGrad)" transform="rotate(-40 150 1000)" />
      <ellipse cx="170" cy="950" rx="16" ry="26" fill="url(#leafGrad)" transform="rotate(30 170 950)" />
      <ellipse cx="190" cy="890" rx="15" ry="25" fill="url(#leafGrad)" transform="rotate(-35 190 890)" />
    </g>

    {/* Bottom Right */}
    <g className="leaf-right-2">
      <circle cx="1720" cy="1000" r="7" fill="url(#flowerGrad)" opacity="0.8" filter="url(#flowerGlow)" />
      <path d="M 1770 1010 Q 1740 900 1760 740" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="1770" cy="1010" rx="18" ry="28" fill="url(#leafGrad)" transform="rotate(45 1770 1010)" />
      <ellipse cx="1750" cy="950" rx="16" ry="26" fill="url(#leafGrad)" transform="rotate(-25 1750 950)" />
    </g>

    {/* Center */}
    <g className="vine-drift">
      <circle cx="960" cy="120" r="6" fill="url(#flowerGrad)" opacity="0.7" filter="url(#flowerGlow)" />
      <path d="M 960 150 Q 980 300 950 450 Q 930 600 970 750" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="960" cy="150" rx="14" ry="24" fill="url(#leafGrad)" transform="rotate(-30 960 150)" className="growth-pulse" />
      <ellipse cx="970" cy="250" rx="13" ry="23" fill="url(#leafGrad)" transform="rotate(35 970 250)" className="growth-pulse" />
      <ellipse cx="945" cy="370" rx="12" ry="22" fill="url(#leafGrad)" transform="rotate(-25 945 370)" className="growth-pulse" />
    </g>

    {/* Subtle texture */}
    <g opacity="0.2" stroke="currentColor" strokeWidth="0.5" fill="none">
      <path d="M 0 500 Q 300 480 600 520 T 1920 500" />
      <path d="M 0 700 Q 400 680 800 730 T 1920 700" />
    </g>
  </svg>
);

export default BotanicalBackground;
