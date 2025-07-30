import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Menu, X } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

const secciones = [
  { nombre: 'NACIONALES', ruta: '/seccion/Nacionales' },
  { nombre: 'MUNICIPALES', ruta: '/seccion/Municipales' },
  { nombre: 'DEPORTES', ruta: '/seccion/Deportes' },
  { nombre: 'CULTURA', ruta: '/seccion/Cultura' },
  { nombre: 'PRODUCCIÓN', ruta: '/seccion/Produccion' },
  { nombre: 'COMUNIDAD', ruta: '/seccion/Comunidad' },
  { nombre: 'SEGURIDAD', ruta: '/seccion/Seguridad' },
  { nombre: 'TURISMO', ruta: '/seccion/Turismo' },
];

const MAX_SECCIONES_DESKTOP = 6; // Secciones visibles antes de agrupar en 'Más'

export default function BarraNavegacion({ isSticky = false }: { isSticky?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTerminoBusqueda } = useContextoNoticias();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [termino, setTermino] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAbierto(false);
      }
    }
    if (dropdownAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownAbierto]);

  const manejarSubmitBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (termino.trim()) {
      setTerminoBusqueda(termino);
      navigate(`/buscar?q=${encodeURIComponent(termino.trim())}`);
      setMenuAbierto(false);
      setMostrarBusqueda(false);
      setDrawerAbierto(false);
    }
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
    setMostrarBusqueda(false);
    setDrawerAbierto(false);
  };

  // Agrupar secciones para el dropdown 'Más'
  const seccionesVisibles = secciones.slice(0, MAX_SECCIONES_DESKTOP);
  const seccionesDropdown = secciones.slice(MAX_SECCIONES_DESKTOP);

  return (
    <nav className={`z-50 border-b-2 border-guarico-gold transition-all duration-300 sticky top-0 ${
      isSticky ? 'bg-[#4CAF50] text-guarico-white shadow-lg' : 'bg-[#4CAF50] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between h-16 w-full">
          {/* Logo solo en sticky */}
          {isSticky ? (
            <Link to="/" className="flex-shrink-0 flex items-center h-full">
              <img 
                src="/logo.png" 
                alt="Logo Ciudad Guárico" 
                className="h-12 w-auto drop-shadow-md transition-transform duration-200 hover:scale-105"
              />
            </Link>
          ) : (
            <div className="w-12" />
          )}
          {/* Secciones centradas */}
          <div className="flex-1 flex justify-center items-center gap-x-1 relative">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg border-b-2 whitespace-nowrap ${
                location.pathname === '/' 
                  ? 'text-guarico-gold border-guarico-gold bg-white/10' 
                  : 'text-white border-transparent hover:border-guarico-gold hover:bg-white/10'
              }`}
            >
              <Home size={16} className="mr-2" />
              INICIO
            </Link>
            {seccionesVisibles.map((seccion) => (
              <Link
                key={seccion.nombre}
                to={seccion.ruta}
                className={`px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg border-b-2 whitespace-nowrap ${
                  location.pathname === seccion.ruta
                    ? 'text-guarico-gold border-guarico-gold bg-white/10'
                    : 'text-white border-transparent hover:border-guarico-gold hover:bg-white/10'
                }`}
              >
                {seccion.nombre}
              </Link>
            ))}
            {seccionesDropdown.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAbierto((v) => !v)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border-b-2 flex items-center gap-1 transition-all duration-200 ${
                    seccionesDropdown.some(s => location.pathname === s.ruta)
                      ? 'text-guarico-gold border-guarico-gold bg-white/10'
                      : 'text-white border-transparent hover:border-guarico-gold hover:bg-white/10'
                  }`}
                >
                  Más
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownAbierto && (
                  <div className="absolute left-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 z-50">
                    {seccionesDropdown.map((seccion) => (
                      <Link
                        key={seccion.nombre}
                        to={seccion.ruta}
                        className={`block px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap ${
                          location.pathname === seccion.ruta
                            ? 'text-guarico-gold bg-guarico-gold/10'
                            : 'hover:bg-guarico-gold/10'
                        }`}
                        onClick={() => setDropdownAbierto(false)}
                      >
                        {seccion.nombre}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Buscador a la derecha */}
          <div className="flex-shrink-0 ml-4">
            <form onSubmit={manejarSubmitBusqueda} className="relative">
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                className="w-44 xl:w-56 px-4 py-2 pl-10 text-sm rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-transparent focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold/50 focus:outline-none shadow-sm"
              />
              <Search 
                size={18} 
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </form>
          </div>
        </div>
        {/* Mobile/Tablet */}
        <div className="lg:hidden flex items-center justify-between h-16 text-white">
          {/* Logo solo en sticky */}
          {isSticky ? (
            <Link to="/" className="flex-shrink-0 flex items-center h-full">
              <img 
                src="/logo.png" 
                alt="Logo Ciudad Guárico" 
                className="h-12 w-auto drop-shadow-md"
              />
            </Link>
          ) : (
            <div className="w-12" />
          )}
          <div className="flex items-center space-x-3">
            {/* Búsqueda móvil sticky */}
            <button
              onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
              className="p-2 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
            {/* Botón hamburguesa */}
            <button
              onClick={() => setDrawerAbierto(true)}
              className="p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white text-white hover:bg-white/20"
              aria-label="Menú de navegación"
            >
              <Menu size={26} />
            </button>
          </div>
          {/* Drawer lateral */}
          {drawerAbierto && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black bg-opacity-40" onClick={cerrarMenu}></div>
              <div className="relative w-72 max-w-full bg-[#4CAF50] h-full shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-4 py-4 border-b border-guarico-gold">
                  <span className="font-bold text-lg">Menú</span>
                  <button onClick={cerrarMenu} className="p-2 rounded-lg hover:bg-white/20">
                    <X size={26} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <Link
                    to="/"
                    className={`flex items-center px-6 py-4 text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                      location.pathname === '/' 
                        ? 'text-guarico-gold bg-white/20 border-l-4 border-guarico-gold'
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={cerrarMenu}
                  >
                    <Home size={18} className="mr-3" />
                    INICIO
                  </Link>
                  {secciones.map((seccion) => (
                    <Link
                      key={seccion.nombre}
                      to={seccion.ruta}
                      className={`block px-6 py-4 text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                        location.pathname === seccion.ruta
                          ? 'text-guarico-gold bg-white/20 border-l-4 border-guarico-gold'
                          : 'text-white hover:bg-white/20'
                      }`}
                      onClick={cerrarMenu}
                    >
                      {seccion.nombre}
                    </Link>
                  ))}
                  <div className="px-6 py-4 border-t border-white/30 mt-2">
                    <form onSubmit={manejarSubmitBusqueda} className="relative">
                      <input
                        type="text"
                        placeholder="Buscar noticias..."
                        value={termino}
                        onChange={(e) => setTermino(e.target.value)}
                        className="w-full px-4 py-3 pl-10 text-sm rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-transparent focus:border-guarico-gold focus:ring-2 focus:ring-guarico-gold/50 focus:outline-none shadow-sm"
                      />
                      <Search 
                        size={18} 
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}