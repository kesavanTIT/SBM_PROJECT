import React from 'react';

export function Logo({ className = "h-12 w-auto" }) {
  return (
    <svg 
      viewBox="0 0 200 130" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer soft outline ellipse */}
      <ellipse cx="100" cy="65" rx="94" ry="49" fill="#9cc0e6" opacity="0.6" />
      
      {/* Inner Main Blue ellipse */}
      <ellipse cx="100" cy="65" rx="85" ry="41" fill="#1b6cb7" />
      
      {/* SBM Bold White Text */}
      <text 
        x="98" 
        y="75" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="900" 
        fontSize="44" 
        fill="white" 
        letterSpacing="-1.5" 
        textAnchor="middle"
      >
        SBM
      </text>
      
      {/* Yellow Capsule/Banner */}
      <rect x="78" y="78" width="86" height="15" rx="7.5" fill="#fde047" />
      
      {/* Banner Text "Design for all time" */}
      <text 
        x="121" 
        y="88" 
        fontFamily="Georgia, serif" 
        fontSize="7.5" 
        fontWeight="bold" 
        fill="#dc2626" 
        textAnchor="middle"
      >
        Design for all time
      </text>
    </svg>
  );
}
export default Logo;
