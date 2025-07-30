import React from 'react';

interface ContenidoPersonalizadoProps {
  src: string;
  href?: string;
  className?: string;
}

export default function ContenidoPersonalizado({ src, href, className = '' }: ContenidoPersonalizadoProps) {
  const ContenidoBase = () => (
    <div className={`relative ${className}`}>
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100px'
        }}
      />
    </div>
  );

  if (href) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-[1.02]"
      >
        <ContenidoBase />
      </a>
    );
  }

  return <ContenidoBase />;
} 