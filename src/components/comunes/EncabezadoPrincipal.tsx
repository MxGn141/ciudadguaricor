import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Facebook, Twitter, Instagram } from 'lucide-react';

interface Props {
  onBuscar: (termino: string) => void;
}

export default function EncabezadoPrincipal({ onBuscar }: Props) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(terminoBusqueda);
    setMostrarBusqueda(false);
  };

  return (
    <header className="bg-red-600 shadow-md relative z-50">
      {/* Barra superior con redes sociales */}
      <div className="bg-red-700">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="text-white text-sm">
              Síguenos en nuestras redes sociales
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-200 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-200 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-200 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Encabezado principal */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menú móvil y búsqueda */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-2 hover:bg-red-500 rounded-lg text-white transition-colors"
              aria-label="Menú principal"
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo centrado */}
          <div className="flex-1 flex justify-center items-center relative">
            <Link to="/" className="block">
              <img 
                src="/logo.png" 
                alt="Logo Ciudad Guárico" 
                className="h-28 w-auto object-contain transition-transform duration-300 hover:scale-105"
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
                className="w-64 px-4 py-2 pl-10 rounded-lg border-2 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition-shadow"
              />
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
              />
            </form>
          </div>

          {/* Botón de búsqueda móvil */}
          <div className="lg:hidden">
            <button
              onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
              className="p-2 hover:bg-red-500 rounded-lg text-white transition-colors"
              aria-label="Buscar"
            >
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-50 bg-red-600 bg-opacity-98">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-red-500">
              <img 
                src="/logo.png" 
                alt="Logo Ciudad Guárico" 
                className="h-20 w-auto"
              />
              <button
                onClick={() => setMenuAbierto(false)}
                className="p-2 hover:bg-red-500 rounded-lg text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Inicio
                </Link>
                <Link 
                  to="/seccion/Nacionales" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Nacionales
                </Link>
                <Link 
                  to="/seccion/Municipales" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Municipales
                </Link>
                <Link 
                  to="/seccion/Deportes" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Deportes
                </Link>
                <Link 
                  to="/seccion/Cultura" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Cultura
                </Link>
                <Link 
                  to="/seccion/Economía" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Economía
                </Link>
                <Link 
                  to="/seccion/Sociales" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Sociales
                </Link>
                <Link 
                  to="/seccion/Sucesos" 
                  className="block text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  Sucesos
                </Link>
              </div>
            </nav>
            <div className="p-4 border-t border-red-500">
              <form onSubmit={manejarBusqueda} className="relative">
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda móvil */}
      {mostrarBusqueda && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 animate-slideDown">
          <form onSubmit={manejarBusqueda} className="relative">
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
              autoFocus
            />
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
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
      `}</style>
    </header>
  );
}