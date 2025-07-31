
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export interface ContenidoDestacado {
  id: string | number;
  media: string; // URL de Cloudinary
  url?: string;
  fechaInicio?: string;
  fechaFin?: string;
  titulo?: string;
  ubicacion: string;
  visible?: boolean;
}

interface ContextoContenidoProps {
  contenidos: ContenidoDestacado[];
  cargarContenidos: () => Promise<void>;
}

const ContextoContenido = createContext<ContextoContenidoProps | undefined>(undefined);

export function ProveedorContextoContenido({ children }: { children: React.ReactNode }) {
  const [contenidos, setContenidos] = useState<ContenidoDestacado[]>([]);

  const cargarContenidos = async () => {
    try {
      const res = await axios.get('/api/content/contenido-destacado');
      setContenidos(res.data);
    } catch (error) {
      console.error('Error al cargar contenidos destacados:', error);
    }
  };

  useEffect(() => {
    cargarContenidos();
  }, []);

  return (
    <ContextoContenido.Provider value={{
      contenidos,
      cargarContenidos
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