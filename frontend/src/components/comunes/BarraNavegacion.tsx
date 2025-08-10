import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Menu, X } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

// Secciones principales que siempre estarán visibles en desktop
const seccionesPrincipales = [
  { nombre: 'GESTIÓN', ruta: '/seccion/Gestión' },
  { nombre: 'MUNICIPALES', ruta: '/seccion/Municipales' },
  { nombre: 'DEPORTES', ruta: '/seccion/Deportes' },
  { nombre: 'SALUD', ruta: '/seccion/Salud' },
  { nombre: 'CULTURA', ruta: '/seccion/Cultura' },
  { nombre: 'PRODUCCIÓN', ruta: '/seccion/Produccion' },
];

// Secciones que van en el dropdown "Más"
const seccionesMas = [
  { nombre: 'COMUNIDAD', ruta: '/seccion/Comunidad' },
  { nombre: 'SEGURIDAD', ruta: '/seccion/Seguridad' },
  { nombre: 'TURISMO', ruta: '/seccion/Turismo' },
  { nombre: 'EDUCACIÓN', ruta: '/seccion/Educación' },
];

// Todas las secciones para móvil
const todasLasSecciones = [...seccionesPrincipales, ...seccionesMas];

const opinionSubsecciones = [
  { nombre: 'Portada Opinión', ruta: '/opinion' },
  { nombre: 'Editoriales', ruta: '/opinion/editoriales' },
  { nombre: 'Columnistas', ruta: '/opinion/columnistas' },
];

export default function BarraNavegacion({ isSticky = false }: { isSticky?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTerminoBusqueda } = useContextoNoticias();
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [dropdownOpinionAbierto, setDropdownOpinionAbierto] = useState(false);
  const [dropdownMasAbierto, setDropdownMasAbierto] = useState(false);
  const [termino, setTermino] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  
  const dropdownOpinionRef = useRef<HTMLDivElement>(null);
  const dropdownMasRef = useRef<HTMLDivElement>(null);
  const dropdownBusquedaRef = useRef<HTMLDivElement>(null); // Nueva referencia para búsqueda

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownOpinionRef.current && !dropdownOpinionRef.current.contains(event.target as Node)) {
        setDropdownOpinionAbierto(false);
      }
      if (dropdownMasRef.current && !dropdownMasRef.current.contains(event.target as Node)) {
        setDropdownMasAbierto(false);
      }
      // Cerrar búsqueda si se hace click fuera - usando la referencia correcta
      if (dropdownBusquedaRef.current && 
          !dropdownBusquedaRef.current.contains(event.target as Node)) {
        setMostrarBusqueda(false);
      }
    }

    if (dropdownOpinionAbierto || dropdownMasAbierto || mostrarBusqueda) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpinionAbierto, dropdownMasAbierto, mostrarBusqueda]);

  const manejarSubmitBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (termino.trim()) {
      setTerminoBusqueda(termino);
      navigate(`/buscar?q=${encodeURIComponent(termino.trim())}`);
      setMostrarBusqueda(false);
      setDrawerAbierto(false);
    }
  };

  const cerrarMenu = () => {
    setMostrarBusqueda(false);
    setDrawerAbierto(false);
    setDropdownOpinionAbierto(false);
    setDropdownMasAbierto(false);
  };

  // Verificar si alguna sección del dropdown "Más" está activa
  const masActivo = seccionesMas.some(s => location.pathname === s.ruta);

  return (
    <nav className={`z-50 border-b-2 border-guarico-gold transition-all duration-300 sticky top-0 ${
      isSticky ? 'bg-[#4CAF50] text-guarico-white shadow-lg' : 'bg-[#4CAF50] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center h-16">
          {/* Logo solo en sticky */}
          {isSticky && (
            <Link to="/" className="flex-shrink-0 mr-6">
              <img 
                src="/logo.png" 
                alt="Logo Ciudad Guárico" 
                className="h-10 w-auto drop-shadow-md hover:scale-105 transition-transform duration-200"
              />
            </Link>
          )}

          {/* Botón INICIO */}
          <Link
            to="/"
            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              location.pathname === '/'
                ? 'text-guarico-gold bg-white/10'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Home size={16} className="mr-2" />
            INICIO
          </Link>

          {/* Secciones principales */}
          <div className="flex items-center mx-6 space-x-1">
            {seccionesPrincipales.map((seccion) => (
              <Link
                key={seccion.nombre}
                to={seccion.ruta}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${
                  location.pathname === seccion.ruta
                    ? 'text-guarico-gold bg-white/10'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {seccion.nombre}
              </Link>
            ))}

            {/* Dropdown Opinión */}
            <div className="relative" ref={dropdownOpinionRef}>
              <button
                onClick={() => {
                  setDropdownOpinionAbierto(!dropdownOpinionAbierto);
                  setDropdownMasAbierto(false); // Cerrar el otro dropdown
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${
                  location.pathname.startsWith('/opinion')
                    ? 'text-guarico-gold bg-white/10'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-haspopup="menu"
                aria-expanded={dropdownOpinionAbierto}
              >
                OPINIÓN
              </button>
              
              {dropdownOpinionAbierto && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 z-50">
                  {opinionSubsecciones.map((sub) => (
                    <Link
                      key={sub.nombre}
                      to={sub.ruta}
                      className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                        location.pathname === sub.ruta
                          ? 'text-guarico-gold bg-guarico-gold/10'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setDropdownOpinionAbierto(false)}
                    >
                      {sub.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Más */}
            <div className="relative" ref={dropdownMasRef}>
              <button
                onClick={() => {
                  setDropdownMasAbierto(!dropdownMasAbierto);
                  setDropdownOpinionAbierto(false); // Cerrar el otro dropdown
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                  masActivo
                    ? 'text-guarico-gold bg-white/10'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                MÁS
              </button>
              
              {dropdownMasAbierto && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 z-50">
                  {seccionesMas.map((seccion) => (
                    <Link
                      key={seccion.nombre}
                      to={seccion.ruta}
                      className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                        location.pathname === seccion.ruta
                          ? 'text-guarico-gold bg-guarico-gold/10'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setDropdownMasAbierto(false)}
                    >
                      {seccion.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Búsqueda y menú móvil */}
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative" ref={dropdownBusquedaRef}> {/* Cambiada la referencia aquí */}
              <button
                onClick={() => {
                  setMostrarBusqueda(!mostrarBusqueda);
                  setDropdownOpinionAbierto(false);
                  setDropdownMasAbierto(false);
                }}
                className="p-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
              
              {/* Dropdown de búsqueda */}
              {mostrarBusqueda && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <form onSubmit={manejarSubmitBusqueda} className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar noticias..."
                        value={termino}
                        onChange={(e) => setTermino(e.target.value)}
                        className="w-full px-4 py-3 pl-10 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-gold focus:border-guarico-gold focus:outline-none"
                        autoFocus
                      />
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-3 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors duration-200 font-medium"
                    >
                      Buscar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Logo móvil */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo Ciudad Guárico" 
              className="h-8 w-auto"
            />
          </Link>

          <button
            onClick={() => setDrawerAbierto(true)}
            className="p-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
            aria-label="Menú de navegación"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={cerrarMenu} />
          <div className="relative w-80 max-w-[85vw] h-full bg-[#4CAF50] shadow-xl flex flex-col ml-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
              <span className="font-bold text-lg text-white">Menú</span>
              <button 
                onClick={cerrarMenu}
                className="p-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Búsqueda móvil */}
              <div className="p-4 border-b border-white/20">
                <form onSubmit={manejarSubmitBusqueda}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar noticias..."
                      value={termino}
                      onChange={(e) => setTermino(e.target.value)}
                      className="w-full px-4 py-2 pl-10 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-guarico-gold focus:outline-none"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </form>
              </div>

              {/* Enlaces de navegación móvil */}
              <div className="py-2">
                <Link
                  to="/"
                  className={`flex items-center px-6 py-3 text-white font-medium transition-colors duration-200 ${
                    location.pathname === '/' ? 'bg-white/20 text-guarico-gold' : 'hover:bg-white/10'
                  }`}
                  onClick={cerrarMenu}
                >
                  <Home size={18} className="mr-3" />
                  INICIO
                </Link>

                {todasLasSecciones.map((seccion) => (
                  <Link
                    key={seccion.nombre}
                    to={seccion.ruta}
                    className={`block px-6 py-3 text-white font-medium transition-colors duration-200 ${
                      location.pathname === seccion.ruta ? 'bg-white/20 text-guarico-gold' : 'hover:bg-white/10'
                    }`}
                    onClick={cerrarMenu}
                  >
                    {seccion.nombre}
                  </Link>
                ))}

                {/* Sección Opinión en móvil */}
                <div className="mt-2 border-t border-white/20 pt-2">
                  <span className="block px-6 py-2 text-xs font-bold text-guarico-gold uppercase tracking-wide">
                    Opinión
                  </span>
                  {opinionSubsecciones.map((sub) => (
                    <Link
                      key={sub.nombre}
                      to={sub.ruta}
                      className={`block px-8 py-2 text-white font-medium transition-colors duration-200 ${
                        location.pathname === sub.ruta ? 'bg-white/20 text-guarico-gold' : 'hover:bg-white/10'
                      }`}
                      onClick={cerrarMenu}
                    >
                      {sub.nombre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}