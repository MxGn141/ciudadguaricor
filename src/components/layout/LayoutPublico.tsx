import React from 'react';
import { Outlet } from 'react-router-dom';
import CarruselPublicidad from '../comunes/CarruselPublicidad';
import EncabezadoPrincipal from '../comunes/EncabezadoPrincipal';
import BarraNavegacion from '../comunes/BarraNavegacion';
import CarruselNoticias from '../comunes/CarruselNoticias';
import CarruselTitulares from '../comunes/CarruselTitulares';
import BarraLateral from '../comunes/BarraLateral';
import PiePagina from '../comunes/PiePagina';

export default function LayoutPublico() {
  const manejarBusqueda = (termino: string) => {
    console.log('Búsqueda:', termino);
    // Implementar lógica de búsqueda
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CarruselPublicidad />
      <EncabezadoPrincipal onBuscar={manejarBusqueda} />
      <BarraNavegacion />
      <CarruselTitulares />
      
      <Outlet />
      
      <PiePagina />
    </div>
  );
}