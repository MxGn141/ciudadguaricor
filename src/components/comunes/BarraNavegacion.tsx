import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronDown, Search } from 'lucide-react';

interface Props {
  isSticky?: boolean;
  onBuscar: (termino: string) => void;
}

const secciones = [
  { nombre: 'NACIONALES', ruta: '/seccion/Nacionales', color: 'bg-guarico-blue' },
  { nombre: 'MUNICIPALES', ruta: '/seccion/Municipales', color: 'bg-guarico-green' },
  { nombre: 'DEPORTES', ruta: '/seccion/Deportes', color: 'bg-guarico-gold' },
  { nombre: 'CULTURA', ruta: '/seccion/Cultura', color: 'bg-guarico-blue' },
  { nombre: 'ECONOMÍA', ruta: '/seccion/Economía', color: 'bg-guarico-green' },
  { nombre: 'SOCIALES', ruta: '/seccion/Sociales', color: 'bg-guarico-gold' },
  { nombre: 'SUCESOS', ruta: '/seccion/Sucesos', color: 'bg-guarico-blue' },
];

export default function BarraNavegacion({ isSticky = false, onBuscar }: Props) {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const manejarSubmitBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(terminoBusqueda);
  };

  return (
    <nav className={`border-b border-guarico-gold transition-all duration-300 ${
      isSticky ? 'bg-guarico-blue text-guarico-white' : 'bg-guarico-white'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Navegación Desktop */}
        <div className="hidden lg:flex items-center justify-between h-12">
          <div className="flex items-center space-x-1">
            {isSticky && (
              <Link to="/" className="flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Logo Ciudad Guárico" 
                  className="h-10 w-auto mr-2"
                />
              </Link>
            )}
            <Link
              to="/"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-guarico-gold border-b-2 border-guarico-gold' 
                  : isSticky 
                    ? 'text-guarico-white hover:bg-guarico-light-blue' 
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home size={16} className="mr-2" />
              <span>INICIO</span>
            </Link>
            
            {secciones.map((seccion) => (
              <Link
                key={seccion.nombre}
                to={seccion.ruta}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                  location.pathname === seccion.ruta
                    ? isSticky 
                      ? 'text-guarico-gold border-guarico-gold'
                      : 'text-guarico-blue border-guarico-blue'
                    : isSticky
                      ? 'text-guarico-white border-transparent hover:border-guarico-light-blue hover:bg-guarico-light-blue'
                      : 'text-gray-700 border-transparent hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {seccion.nombre}
              </Link>
            ))}
          </div>

          {isSticky && (
            <div className="flex-shrink-0">
              <form onSubmit={manejarSubmitBusqueda} className="relative">
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-48 px-3 py-1 pl-8 text-sm rounded-lg border-2 border-guarico-light-blue focus:border-guarico-light-blue focus:ring-1 focus:ring-guarico-light-blue focus:outline-none bg-guarico-blue text-guarico-white placeholder-guarico-light-gold"
                />
                <Search 
                  size={14} 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-guarico-light-gold"
                />
              </form>
            </div>
          )}
        </div>

        {/* Navegación Mobile */}
        <div className="lg:hidden">
          <div className={`flex items-center justify-between h-14 ${
            isSticky ? 'text-guarico-white' : 'text-gray-700'
          }`}>
            {isSticky && (
              <Link to="/" className="flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Logo Ciudad Guárico" 
                  className="h-8 w-auto"
                />
              </Link>
            )}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-guarico-light-blue hover:text-guarico-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-guarico-light-blue transition-colors duration-200"
            >
              <span className="sr-only">Abrir menú principal</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">Secciones</span>
                <ChevronDown 
                  size={20} 
                  className={`transform transition-transform duration-200 ${
                    menuAbierto ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Menú móvil desplegable */}
          <div className={`transform transition-all duration-300 ease-in-out ${
            menuAbierto 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className={`border-t border-guarico-light-blue py-2 ${
              isSticky ? 'bg-guarico-blue' : 'bg-guarico-white'
            }`}>
              <Link
                to="/"
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? isSticky
                      ? 'text-guarico-gold bg-guarico-dark-blue'
                      : 'text-guarico-blue bg-gray-50'
                    : isSticky
                      ? 'text-guarico-white hover:bg-guarico-light-blue'
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                <Home size={18} className="mr-2" />
                <span>INICIO</span>
              </Link>
              
              {secciones.map((seccion) => (
                <Link
                  key={seccion.nombre}
                  to={seccion.ruta}
                  className={`block px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === seccion.ruta
                      ? isSticky
                        ? 'text-guarico-gold bg-guarico-dark-blue'
                        : 'text-guarico-blue bg-gray-50'
                      : isSticky
                        ? 'text-guarico-white hover:bg-guarico-light-blue'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMenuAbierto(false)}
                >
                  {seccion.nombre}
                </Link>
              ))}

              {isSticky && (
                <div className="px-4 py-3 border-t border-guarico-light-blue mt-2">
                  <form onSubmit={manejarSubmitBusqueda} className="relative">
                    <input
                      type="text"
                      placeholder="Buscar noticias..."
                      value={terminoBusqueda}
                      onChange={(e) => setTerminoBusqueda(e.target.value)}
                      className="w-full px-4 py-2 pl-10 text-sm rounded-lg border-2 border-guarico-light-blue focus:border-guarico-light-blue focus:ring-1 focus:ring-guarico-light-blue focus:outline-none bg-guarico-blue text-guarico-white placeholder-guarico-light-gold"
                    />
                    <Search 
                      size={16} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-guarico-light-gold"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}