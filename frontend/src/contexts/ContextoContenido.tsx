
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
      // Usa la URL absoluta del backend para evitar problemas de CORS y entorno
      const API_URL = 'https://ciudadguaricor.onrender.com/api/content/contenido-destacado';
      const res = await axios.get(API_URL);
      // Ajusta la URL de la imagen si empieza con /uploads (igual que en el admin)
      const contenidosAjustados = res.data.map((c: any) => ({
        ...c,
        media: c.media && c.media.startsWith('/uploads')
          ? `https://ciudadguaricor.onrender.com${c.media}`
          : c.media
      }));
      setContenidos(contenidosAjustados);
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