import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CarruselPublicidad from '../comunes/CarruselPublicidad';
import EncabezadoPrincipal from '../comunes/EncabezadoPrincipal';
import BarraNavegacion from '../comunes/BarraNavegacion';
import CarruselNoticias from '../comunes/CarruselNoticias';
import CarruselTitulares from '../comunes/CarruselTitulares';
import BarraLateral from '../comunes/BarraLateral';
import PiePagina from '../comunes/PiePagina';

export default function LayoutPublico() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 200;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const manejarBusqueda = (termino: string) => {
    console.log('Búsqueda:', termino);
    // Implementar lógica de búsqueda
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white">
        <CarruselPublicidad />
        <EncabezadoPrincipal onBuscar={manejarBusqueda} />
      </div>

      {/* Navegación y Titulares (sticky) */}
      <div className={`sticky top-0 z-40 bg-white shadow-sm transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}>
        <BarraNavegacion isSticky={scrolled} onBuscar={manejarBusqueda} />
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <CarruselTitulares />
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg shadow">
                <Outlet />
              </div>
            </div>

            {/* Barra Lateral */}
            <aside className="w-full md:w-80 shrink-0 order-2 md:order-none">
              <div className="sticky top-[calc(var(--header-height)+1rem)] space-y-6">
                <BarraLateral />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PiePagina />

      {/* Variables CSS para alturas dinámicas */}
      <style>{`
        :root {
          --header-height: 120px;
        }
        @media (max-width: 768px) {
          :root {
            --header-height: 100px;
          }
        }
      `}</style>
    </div>
  );
}