import React, { createContext, useContext, useState, useEffect } from 'react';

interface Banner {
  id: string;
  tipo: 'header' | 'sidebar' | 'inicio';
  imagen: string;
  enlace?: string;
  activo: boolean;
}

interface ContextoPublicidadProps {
  banners: Banner[];
  bannerHeader: Banner | null;
  bannerSidebar: Banner | null;
  bannerInicio: Banner | null;
  actualizarBanner: (banner: Banner) => void;
  eliminarBanner: (id: string) => void;
  agregarBanner: (banner: Banner) => void;
}

const ContextoPublicidad = createContext<ContextoPublicidadProps | undefined>(undefined);

export function ProveedorContextoPublicidad({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      tipo: 'header',
      imagen: '/banner-publicidad/banner-header.png',
      activo: true
    },
    {
      id: '2',
      tipo: 'sidebar',
      imagen: '/banner-publicidad/banner-sidebar.png',
      activo: true
    },
    {
      id: '3',
      tipo: 'inicio',
      imagen: '/banner-publicidad/banner-inicio.png',
      activo: true
    }
  ]);

  // Asegurarse de que las imágenes estén disponibles
  useEffect(() => {
    // Verificar si las imágenes existen y son accesibles
    const verificarImagen = async (src: string) => {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          console.error(`No se pudo cargar la imagen: ${src}`);
        }
      } catch (error) {
        console.error(`Error al cargar la imagen: ${src}`, error);
      }
    };

    banners.forEach(banner => {
      verificarImagen(banner.imagen);
    });
  }, []);

  const bannerHeader = banners.find(b => b.tipo === 'header' && b.activo) || null;
  const bannerSidebar = banners.find(b => b.tipo === 'sidebar' && b.activo) || null;
  const bannerInicio = banners.find(b => b.tipo === 'inicio' && b.activo) || null;

  const actualizarBanner = (bannerActualizado: Banner) => {
    setBanners(banners.map(banner => 
      banner.id === bannerActualizado.id ? bannerActualizado : banner
    ));
  };

  const eliminarBanner = (id: string) => {
    setBanners(banners.filter(banner => banner.id !== id));
  };

  const agregarBanner = (nuevoBanner: Banner) => {
    setBanners([...banners, nuevoBanner]);
  };

  return (
    <ContextoPublicidad.Provider value={{
      banners,
      bannerHeader,
      bannerSidebar,
      bannerInicio,
      actualizarBanner,
      eliminarBanner,
      agregarBanner
    }}>
      {children}
    </ContextoPublicidad.Provider>
  );
}

export function useContextoPublicidad() {
  const context = useContext(ContextoPublicidad);
  if (context === undefined) {
    throw new Error('useContextoPublicidad debe ser usado dentro de un ProveedorContextoPublicidad');
  }
  return context;
} 