import React from 'react';
import logoImg from '../assets/images/controlseg_logo_1782755774458.jpg';

interface CompanyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  className = '', 
  size = 'md', 
  theme = 'light' 
}) => {
  // Height mappings for different logo placements
  const heights = {
    sm: 'h-10 sm:h-12',
    md: 'h-16 sm:h-20',
    lg: 'h-24 sm:h-32',
    xl: 'h-36 sm:h-44'
  };

  return (
    <div className={`flex items-center select-none ${className}`} id="company-main-logo">
      <img 
        src={logoImg} 
        alt="Control Seg Logo" 
        className={`${heights[size]} object-contain mix-blend-multiply`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

