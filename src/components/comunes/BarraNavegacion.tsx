import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

const secciones = [
  { nombre: 'NACIONALES', ruta: '/seccion/Nacionales', color: 'bg-blue-500' },
  { nombre: 'MUNICIPALES', ruta: '/seccion/Municipales', color: 'bg-green-500' },
  { nombre: 'DEPORTES', ruta: '/seccion/Deportes', color: 'bg-red-500' },
  { nombre: 'CULTURA', ruta: '/seccion/Cultura', color: 'bg-purple-500' },
  { nombre: 'ECONOMÍA', ruta: '/seccion/Economía', color: 'bg-yellow-500' },
  { nombre: 'SOCIALES', ruta: '/seccion/Sociales', color: 'bg-pink-500' },
  { nombre: 'SUCESOS', ruta: '/seccion/Sucesos', color: 'bg-gray-600' },
];

export default function BarraNavegacion() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-40 shadow-sm hidden md:block">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center">
          {/* Botón de inicio */}
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors border-b-3 ${
              location.pathname === '/'
                ? 'border-red-500 bg-gray-50'
                : 'border-transparent'
            }`}
          >
            <Home size={16} className="mr-2" />
            <span className="hidden sm:inline">MÁS NOTICIAS</span>
          </Link>
          
          {/* Separador */}
          <div className="h-8 w-px bg-gray-300 mx-2"></div>
          
          {/* Secciones */}
          <div className="flex overflow-x-auto scrollbar-hide flex-1">
            {secciones.map((seccion) => (
              <Link
                key={seccion.nombre}
                to={seccion.ruta}
                className={`px-4 py-3 whitespace-nowrap text-sm font-medium hover:bg-gray-100 transition-colors border-b-3 ${
                  location.pathname === seccion.ruta
                    ? `${seccion.color} border-current text-white`
                    : 'border-transparent text-gray-700'
                }`}
              >
                {seccion.nombre}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}