import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Facebook, Twitter, Instagram } from 'lucide-react';
import { useContextoPublicidad } from '../../contexts/ContextoPublicidad';

interface Props {
  onBuscar: (termino: string) => void;
}

export default function EncabezadoPrincipal({ onBuscar }: Props) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const { bannerHeader } = useContextoPublicidad();

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(terminoBusqueda);
    setMostrarBusqueda(false);
  };

  // Verificar que el banner se está cargando
  useEffect(() => {
    if (bannerHeader) {
      console.log('Banner cargado:', bannerHeader);
    } else {
      console.log('No hay banner disponible');
    }
  }, [bannerHeader]);

  return (
    <header className="shadow-md relative z-50">
      {/* Barra superior con redes sociales */}
      <div className="bg-guarico-dark-blue">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="text-guarico-white text-sm">
              Síguenos en nuestras redes sociales
            </div>
            <div className="flex items-center space-x-4">
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
      <div className="relative">
        {/* Banner de fondo */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: '#0088FF',
            ...(bannerHeader && {
              backgroundImage: `url(${bannerHeader.imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            })
          }}
        />
        
        {/* Contenido del encabezado */}
        <div className="relative max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Menú móvil y búsqueda */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="p-2 hover:bg-black/20 rounded-lg text-guarico-white transition-colors"
                aria-label="Menú principal"
              >
                {menuAbierto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo centrado */}
            <div className="flex-1 flex justify-center items-center">
              <Link to="/" className="block">
                <img 
                  src="/logo.png" 
                  alt="Logo Ciudad Guárico" 
                  className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105 sm:h-24 md:h-28 lg:h-32"
                />
              </Link>
            </div>

            {/* Búsqueda desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <form onSubmit={manejarBusqueda} className="relative">
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 rounded-lg border-2 border-white/30 focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold focus:outline-none bg-black/20 text-white placeholder-white/70"
                />
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                />
              </form>
            </div>

            {/* Botón de búsqueda móvil */}
            <div className="lg:hidden">
              <button
                onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
                className="p-2 hover:bg-black/20 rounded-lg text-guarico-white transition-colors"
                aria-label="Buscar"
              >
                <Search size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-50 bg-guarico-blue bg-opacity-98">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-guarico-light-blue">
              <img 
                src="/logo.png" 
                alt="Logo Ciudad Guárico" 
                className="h-20 w-auto"
              />
              <button
                onClick={() => setMenuAbierto(false)}
                className="p-2 hover:bg-guarico-light-blue rounded-lg text-guarico-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Inicio
                </Link>
                <Link 
                  to="/seccion/Nacionales" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Nacionales
                </Link>
                <Link 
                  to="/seccion/Municipales" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Municipales
                </Link>
                <Link 
                  to="/seccion/Deportes" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Deportes
                </Link>
                <Link 
                  to="/seccion/Cultura" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Cultura
                </Link>
                <Link 
                  to="/seccion/Economía" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Economía
                </Link>
                <Link 
                  to="/seccion/Sociales" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Sociales
                </Link>
                <Link 
                  to="/seccion/Sucesos" 
                  className="block text-guarico-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-guarico-light-blue transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Sucesos
                </Link>
              </div>
            </nav>
            <div className="p-4 border-t border-guarico-light-blue">
              <form onSubmit={manejarBusqueda} className="relative">
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-guarico-light-blue focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold focus:outline-none"
                  autoFocus
                />
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-guarico-gold"
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda móvil */}
      {mostrarBusqueda && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-guarico-white shadow-lg p-4 animate-slideDown">
          <form onSubmit={manejarBusqueda} className="relative">
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-guarico-light-blue focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold focus:outline-none"
              autoFocus
            />
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-guarico-gold"
            />
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        /* Estilos para el contenedor del banner */
        .banner-container {
          position: relative;
          width: 100%;
          padding-top: 25%; /* Proporción 4:1 para pantallas grandes */
        }

        /* Media queries para ajustar la proporción del banner */
        @media (max-width: 1280px) {
          .banner-container {
            padding-top: 30%; /* Proporción 3.33:1 para pantallas medianas */
          }
        }

        @media (max-width: 1024px) {
          .banner-container {
            padding-top: 35%; /* Proporción 2.85:1 para tablets */
          }
        }

        @media (max-width: 768px) {
          .banner-container {
            padding-top: 40%; /* Proporción 2.5:1 para tablets pequeñas */
          }
        }

        @media (max-width: 640px) {
          .banner-container {
            padding-top: 50%; /* Proporción 2:1 para móviles */
          }
        }
      `}</style>
    </header>
  );
}