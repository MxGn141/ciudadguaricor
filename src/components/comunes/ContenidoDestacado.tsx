import React from 'react';

interface ContenidoDestacadoProps {
  src: string;
  href?: string;
  className?: string;
}

export default function ContenidoDestacado({ src, href, className = '' }: ContenidoDestacadoProps) {
  const ContenidoBase = () => (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-guarico-blue/10 to-guarico-dark-blue/10" />
      <div 
        className="w-full h-full transform hover:scale-105 transition-transform duration-700"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '200px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );

  if (href) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block transform transition-all duration-500 hover:-translate-y-1"
      >
        <ContenidoBase />
      </a>
    );
  }

  return <ContenidoBase />;
} 