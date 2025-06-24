import React, { useState } from 'react';

interface QuantumLogoProps {
  className?: string;
  showText?: boolean;
}

export const QuantumLogo: React.FC<QuantumLogoProps> = ({ 
  className = '', 
  showText = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // If we want to show text or if the image failed to load, show the text version
  const shouldShowText = showText || imageError || !imageLoaded;

  return (
    <div className={`quantum-logo-container ${className}`}>
      {/* Logo Image */}
      {!imageError && (
        <img
          src="/logo.png"
          alt="Quantum Radio"
          className={`quantum-logo transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: shouldShowText && imageLoaded ? 'none' : 'block' }}
        />
      )}
      
      {/* Text Fallback */}
      {shouldShowText && (
        <h1 className={`text-4xl md:text-5xl font-bold text-gradient transition-opacity duration-300 ${
          imageLoaded && !showText ? 'opacity-0' : 'opacity-100'
        }`}>
          Quantum Radio
        </h1>
      )}
    </div>
  );
}; 