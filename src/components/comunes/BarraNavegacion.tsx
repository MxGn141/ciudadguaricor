import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Menu, X } from 'lucide-react';

interface Props {
  isSticky?: boolean;
  onBuscar: (termino: string) => void;
}

const secciones = [
  { nombre: 'NACIONALES', ruta: '/seccion/Nacionales' },
  { nombre: 'MUNICIPALES', ruta: '/seccion/Municipales' },
  { nombre: 'DEPORTES', ruta: '/seccion/Deportes' },
  { nombre: 'CULTURA', ruta: '/seccion/Cultura' },
  { nombre: 'ECONOMÍA', ruta: '/seccion/Economía' },
  { nombre: 'SOCIALES', ruta: '/seccion/Sociales' },
  { nombre: 'SUCESOS', ruta: '/seccion/Sucesos' },
];

export default function BarraNavegacion({ isSticky = false, onBuscar }: Props) {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const manejarSubmitBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(terminoBusqueda);
    setMenuAbierto(false);
    setMostrarBusqueda(false);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
    setMostrarBusqueda(false);
  };

  return (
    <nav className={`border-b-2 border-guarico-gold transition-all duration-300 ${
      isSticky 
        ? 'bg-[#4CAF50] text-guarico-white shadow-lg' 
        : 'bg-[#4CAF50] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Navegación Desktop */}
        <div className="hidden lg:flex items-center justify-between h-14">
          <div className="flex items-center space-x-1">
            {/* Logo sticky solo en desktop */}
            {isSticky && (
              <Link to="/" className="flex-shrink-0 mr-6">
                <img 
                  src="/logo.png" 
                  alt="Logo Ciudad Guárico" 
                  className="h-12 sm:h-14 md:h-16 w-auto drop-shadow-md transition-transform duration-200 hover:scale-105"
                />
              </Link>
            )}
            
            {/* Enlaces de navegación */}
            <Link
              to="/"
              className={`flex items-center px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg border-b-2 ${
                location.pathname === '/' 
                  ? 'text-guarico-gold border-guarico-gold bg-white/10' 
                  : 'text-white border-transparent hover:border-guarico-gold hover:bg-white/10'
              }`}
            >
              <Home size={16} className="mr-2" />
              INICIO
            </Link>
            
            {secciones.map((seccion) => (
              <Link
                key={seccion.nombre}
                to={seccion.ruta}
                className={`px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg border-b-2 ${
                  location.pathname === seccion.ruta
                    ? 'text-guarico-gold border-guarico-gold bg-white/10'
                    : 'text-white border-transparent hover:border-guarico-gold hover:bg-white/10'
                }`}
              >
                {seccion.nombre}
              </Link>
            ))}
          </div>

          {/* Búsqueda sticky desktop */}
          {isSticky && (
            <div className="flex-shrink-0">
              <form onSubmit={manejarSubmitBusqueda} className="relative">
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-56 xl:w-64 px-4 py-2 pl-10 text-sm rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-transparent focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold/50 focus:outline-none shadow-sm"
                />
                <Search 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </form>
            </div>
          )}
        </div>

        {/* Navegación Mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 text-white">
            {/* Logo sticky móvil */}
            {isSticky && (
              <Link to="/" className="flex-shrink-0" onClick={cerrarMenu}>
                <img 
                  src="/logo.png" 
                  alt="Logo Ciudad Guárico" 
                  className="h-12 sm:h-14 w-auto drop-shadow-md"
                />
              </Link>
            )}
            
            <div className="flex items-center space-x-3">
              {/* Búsqueda móvil sticky */}
              {isSticky && (
                <button
                  onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
                  className="p-2 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
                  aria-label="Buscar"
                >
                  <Search size={20} />
                </button>
              )}
              
              {/* Botón hamburguesa */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white text-white hover:bg-white/20"
                aria-label="Menú de navegación"
              >
                {menuAbierto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          <div className={`transform transition-all duration-300 ease-in-out overflow-hidden ${
            menuAbierto 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0'
          }`}>
            <div className="border-t-2 border-guarico-gold py-2 bg-[#4CAF50]">
              {/* Enlace de inicio */}
              <Link
                to="/"
                className={`flex items-center px-6 py-4 text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'text-guarico-gold bg-white/20 border-l-4 border-guarico-gold'
                    : 'text-white hover:bg-white/20'
                }`}
                onClick={cerrarMenu}
              >
                <Home size={18} className="mr-3" />
                INICIO
              </Link>
              
              {/* Enlaces de secciones */}
              {secciones.map((seccion) => (
                <Link
                  key={seccion.nombre}
                  to={seccion.ruta}
                  className={`block px-6 py-4 text-sm font-semibold transition-colors duration-200 ${
                    location.pathname === seccion.ruta
                      ? 'text-guarico-gold bg-white/20 border-l-4 border-guarico-gold'
                      : 'text-white hover:bg-white/20'
                  }`}
                  onClick={cerrarMenu}
                >
                  {seccion.nombre}
                </Link>
              ))}

              {/* Búsqueda móvil */}
              {isSticky && (
                <div className="px-6 py-4 border-t border-white/30 mt-2">
                  <form onSubmit={manejarSubmitBusqueda} className="relative">
                    <input
                      type="text"
                      placeholder="Buscar noticias..."
                      value={terminoBusqueda}
                      onChange={(e) => setTerminoBusqueda(e.target.value)}
                      className="w-full px-4 py-3 pl-10 text-sm rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-transparent focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold/50 focus:outline-none shadow-sm"
                    />
                    <Search 
                      size={16} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
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