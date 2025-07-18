import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Facebook, Twitter, Instagram } from 'lucide-react';
import { useContextoPublicidad } from '../../contexts/ContextoPublicidad';

interface Props {
  onBuscar: (termino: string) => void;
}

export default function EncabezadoPrincipal({ onBuscar }: Props) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const { bannerHeader } = useContextoPublicidad();

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(terminoBusqueda);
    setMostrarBusqueda(false);
  };

  return (
    <header className="w-full">
      {/* Barra superior con redes sociales */}
      <div className="bg-gradient-to-r from-guarico-blue to-guarico-dark-blue">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="text-guarico-white text-sm hidden sm:block">
              Síguenos en nuestras redes sociales
            </div>
            <div className="flex items-center space-x-4 mx-auto sm:mx-0">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-guarico-white hover:text-guarico-gold transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-guarico-white hover:text-guarico-gold transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-guarico-white hover:text-guarico-gold transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Encabezado principal con banner */}
      <div className="w-full relative">
        {/* Banner principal */}
        <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64">
          {/* Banner de fondo */}
          <div 
            className="absolute inset-0 w-full h-full bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${bannerHeader?.imagen || '/banner-publicidad/banner-header.png'})`,
              backgroundSize: '100% 100%'
            }}
          >
            {bannerHeader?.enlace && (
              <a 
                href={bannerHeader.enlace} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 w-full h-full"
                aria-label="Enlace publicitario"
              />
            )}
          </div>
          
          {/* Contenido del encabezado */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            {/* Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="block">
                <img 
                  src="/logo.png"
                  alt="Logo Ciudad Guárico" 
                  className="h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                  }}
                />
              </Link>
            </div>

            {/* Búsqueda desktop */}
            <div className="hidden lg:flex items-center absolute right-6">
              <form onSubmit={manejarBusqueda} className="relative">
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-48 xl:w-64 px-3 xl:px-4 py-2 pl-10 rounded-lg bg-white/90 border border-gray-200 focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold focus:outline-none text-gray-800 placeholder-gray-600 shadow-sm text-sm xl:text-base"
                />
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                />
              </form>
            </div>

            {/* Botón de búsqueda móvil */}
            <div className="lg:hidden absolute right-4">
              <button
                onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
                className="p-2 bg-[#4CAF50] rounded-lg shadow-sm text-white"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        {mostrarBusqueda && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 animate-slideDown z-50 border-t border-guarico-gold">
            <form onSubmit={manejarBusqueda} className="relative">
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold focus:outline-none shadow-sm"
                autoFocus
              />
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              />
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
}