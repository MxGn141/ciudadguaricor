import React, { useState } from 'react';
import { Search, Menu, X, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  onBuscar: (termino: string) => void;
}

export default function EncabezadoPrincipal({ onBuscar }: Props) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(terminoBusqueda);
  };

  return (
    <header className="bg-red-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between min-h-0" style={{ minHeight: 0 }}>
          {/* Menú hamburguesa y búsqueda (móvil) */}
          <div className="flex items-center space-x-2 md:w-48">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2 hover:bg-red-500 rounded text-white"
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-2 hover:bg-red-500 rounded text-white">
                <Menu size={20} className="text-white" />
              </button>
              <button 
                onClick={() => document.getElementById('search-input')?.focus()}
                className="p-2 hover:bg-red-500 rounded text-white"
              >
                <Search size={20} className="text-white" />
              </button>
            </div>
          </div>
          
          {/* Título principal centrado */}
          <div className="flex-1 flex justify-center items-center">
            <img 
              src="/logo.png" 
              alt="Logo Ciudad Guárico" 
              className="h-16 md:h-20 lg:h-24 w-auto max-w-[220px] object-contain transition-all duration-200"
              style={{ minWidth: '150px', minHeight: '175px' }}
            />
          </div>

          {/* Redes sociales */}
          <div className="flex items-center space-x-3 md:w-48 justify-end">
            <a href="https://twitter.com/ciudadguarico" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 transition-colors">
              <Twitter size={28} className="text-white hover:text-blue-400 transition-colors" />
            </a>
            <a href="https://facebook.com/ciudadguarico" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-blue-100 transition-colors">
              <Facebook size={28} className="text-white hover:text-blue-600 transition-colors" />
            </a>
            <a href="https://instagram.com/ciudadguarico" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-pink-100 transition-colors">
              <Instagram size={28} className="text-white hover:text-pink-400 transition-colors" />
            </a>
            <a href="https://youtube.com/ciudadguarico" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-red-100 transition-colors">
              <Youtube size={28} className="text-white hover:text-red-500 transition-colors" />
            </a>
          </div>
        </div>

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="md:hidden mt-2 border-t border-red-500 pt-4 space-y-4 bg-red-600 rounded-b-lg shadow-lg w-full">
            <nav className="flex flex-col space-y-2 mb-4 px-4">
              <Link to="/" className="block text-white text-lg font-bold hover:underline">Inicio</Link>
              <Link to="/seccion/Nacionales" className="block text-white text-lg hover:underline">Nacionales</Link>
              <Link to="/seccion/Municipales" className="block text-white text-lg hover:underline">Municipales</Link>
              <Link to="/seccion/Deportes" className="block text-white text-lg hover:underline">Deportes</Link>
              <Link to="/seccion/Cultura" className="block text-white text-lg hover:underline">Cultura</Link>
              <Link to="/seccion/Economía" className="block text-white text-lg hover:underline">Economía</Link>
              <Link to="/seccion/Sociales" className="block text-white text-lg hover:underline">Sociales</Link>
              <Link to="/seccion/Sucesos" className="block text-white text-lg hover:underline">Sucesos</Link>
            </nav>
            <form onSubmit={manejarBusqueda} className="relative mb-2 px-4">
              <input
                id="search-input-mobile"
                type="text"
                placeholder="Buscar noticias..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-6 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <Search size={20} className="text-gray-500" />
              </button>
            </form>
          </div>
        )}

        {/* Barra de búsqueda desktop (oculta por defecto) */}
        <div className="hidden md:block mt-4">
          <form onSubmit={manejarBusqueda} className="max-w-md mx-auto relative">
            <input
              id="search-input"
              type="text"
              placeholder="Buscar noticias..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </form>
        </div>
      </div>
    </header>
  );
}