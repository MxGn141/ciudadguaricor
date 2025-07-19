import React, { useState } from 'react';

interface ImagenFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImagenFallback({ src, alt, className = '' }: ImagenFallbackProps) {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm">Imagen no disponible</p>
          <p className="text-gray-400 text-xs mt-1">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
} 