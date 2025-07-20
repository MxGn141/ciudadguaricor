import React, { createContext, useContext, useState } from 'react';

interface ContenidoDestacado {
  id: string;
  tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back' | 'inicio-2';
  imagen: string;
  enlace?: string;
  activo: boolean;
}

interface ContextoContenidoProps {
  contenidos: ContenidoDestacado[];
  contenidoHeader: ContenidoDestacado | null;
  contenidosLaterales: ContenidoDestacado[];
  contenidoInicio: ContenidoDestacado | null;
  contenidoInicioBack: ContenidoDestacado | null;
  contenidoInicio2: ContenidoDestacado | null;
  actualizarContenido: (contenido: ContenidoDestacado) => void;
  eliminarContenido: (id: string) => void;
  agregarContenido: (contenido: ContenidoDestacado) => void;
}

const ContextoContenido = createContext<ContextoContenidoProps | undefined>(undefined);

export function ProveedorContextoContenido({ children }: { children: React.ReactNode }) {
  const [contenidos, setContenidos] = useState<ContenidoDestacado[]>([
    {
      id: '1',
      tipo: 'header' as const,
      imagen: '/media/contenido/header-bg.png',
      activo: true
    },
    {
      id: '2',
      tipo: 'sidebar' as const,
      imagen: '/media/contenido/side-1.png',
      activo: true
    },
    {
      id: '3',
      tipo: 'sidebar' as const,
      imagen: '/media/contenido/side-2.png',
      activo: true
    },
    {
      id: '4',
      tipo: 'sidebar' as const,
      imagen: '/media/contenido/side-1.png',
      activo: true
    },
    {
      id: '5',
      tipo: 'sidebar' as const,
      imagen: '/media/contenido/side-2.png',
      activo: true
    },
    {
      id: '6',
      tipo: 'sidebar' as const,
      imagen: '/media/contenido/side-1.png',
      activo: true
    },
    {
      id: '7',
      tipo: 'sidebar' as const,
      imagen: '/media/contenido/side-2.png',
      activo: true
    },
    {
      id: '8',
      tipo: 'inicio' as const,
      imagen: '/media/contenido/main-1.png',
      activo: true
    },
    {
      id: '9',
      tipo: 'inicio-back' as const,
      imagen: '/media/contenido/main-bg.png',
      activo: true
    },
    {
      id: '10',
      tipo: 'inicio-2' as const,
      imagen: '/media/contenido/main-2.png',
      activo: true
    }
  ]);

  const contenidoHeader = contenidos.find(b => b.tipo === 'header' && b.activo) || null;
  const contenidosLaterales = contenidos.filter(b => b.tipo === 'sidebar' && b.activo).slice(0, 6);
  const contenidoInicio = contenidos.find(b => b.tipo === 'inicio' && b.activo) || null;
  const contenidoInicioBack = contenidos.find(b => b.tipo === 'inicio-back' && b.activo) || null;
  const contenidoInicio2 = contenidos.find(b => b.tipo === 'inicio-2' && b.activo) || null;

  const actualizarContenido = (contenidoActualizado: ContenidoDestacado) => {
    setContenidos(contenidos.map(contenido => 
      contenido.id === contenidoActualizado.id ? contenidoActualizado : contenido
    ));
  };

  const eliminarContenido = (id: string) => {
    setContenidos(contenidos.filter(contenido => contenido.id !== id));
  };

  const agregarContenido = (nuevoContenido: ContenidoDestacado) => {
    setContenidos(prev => [...prev, nuevoContenido]);
  };

  return (
    <ContextoContenido.Provider value={{
      contenidos,
      contenidoHeader,
      contenidosLaterales,
      contenidoInicio,
      contenidoInicioBack,
      contenidoInicio2,
      actualizarContenido,
      eliminarContenido,
      agregarContenido
    }}>
      {children}
    </ContextoContenido.Provider>
  );
}

export function useContextoContenido() {
  const context = useContext(ContextoContenido);
  if (context === undefined) {
    throw new Error('useContextoContenido debe ser usado dentro de un ProveedorContextoContenido');
  }
  return context;
} 