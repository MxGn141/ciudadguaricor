import React, { createContext, useContext, useState, useEffect } from 'react';

interface Banner {
  id: string;
  tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back';
  imagen: string;
  enlace?: string;
  activo: boolean;
  posicion?: 'primera' | 'segunda';
}

interface ContextoPublicidadProps {
  banners: Banner[];
  bannerHeader: Banner | null;
  bannersSidebar: Banner[];
  bannerInicio: Banner | null;
  bannerInicioBack: Banner | null;
  actualizarBanner: (banner: Banner) => void;
  eliminarBanner: (id: string) => void;
  agregarBanner: (banner: Banner) => void;
}

const ContextoPublicidad = createContext<ContextoPublicidadProps | undefined>(undefined);

// Función para validar si una imagen existe
const validarImagen = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export function ProveedorContextoPublicidad({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const cargarBannersIniciales = async () => {
      const bannersIniciales = [
        {
          id: '1',
          tipo: 'header' as const,
          imagen: '/banner-publicidad/banner-header.png',
          activo: true
        },
        {
          id: '2',
          tipo: 'sidebar' as const,
          imagen: '/banner-publicidad/banner-sidebar.png',
          activo: true
        },
        {
          id: '3',
          tipo: 'sidebar' as const,
          imagen: '/banner-publicidad/banner-sidebar-b.png',
          activo: true
        },
        {
          id: '4',
          tipo: 'sidebar' as const,
          imagen: '/banner-publicidad/banner-sidebar.png',
          activo: true
        },
        {
          id: '5',
          tipo: 'sidebar' as const,
          imagen: '/banner-publicidad/banner-sidebar-b.png',
          activo: true
        },
        {
          id: '6',
          tipo: 'sidebar' as const,
          imagen: '/banner-publicidad/banner-sidebar.png',
          activo: true
        },
        {
          id: '7',
          tipo: 'sidebar' as const,
          imagen: '/banner-publicidad/banner-sidebar-b.png',
          activo: true
        },
        {
          id: '8',
          tipo: 'inicio' as const,
          imagen: '/banner-publicidad/banner-inicio.png',
          activo: true,
          posicion: 'primera' as const
        },
        {
          id: '9',
          tipo: 'inicio' as const,
          imagen: '/banner-publicidad/banner-inicio.png',
          activo: true,
          posicion: 'segunda' as const
        },
        {
          id: '10',
          tipo: 'inicio-back' as const,
          imagen: '/banner-publicidad/banner-inicio-back.png',
          activo: true
        }
      ];

      // Validar cada banner y establecer su estado activo según si la imagen existe
      const bannersValidados = await Promise.all(
        bannersIniciales.map(async (banner) => {
          const imagenExiste = await validarImagen(banner.imagen);
          return {
            ...banner,
            activo: banner.activo && imagenExiste
          };
        })
      );

      setBanners(bannersValidados);
    };

    cargarBannersIniciales();
  }, []);

  const bannerHeader = banners.find(b => b.tipo === 'header' && b.activo) || null;
  const bannersSidebar = banners.filter(b => b.tipo === 'sidebar' && b.activo).slice(0, 6);
  const bannerInicio = banners.find(b => b.tipo === 'inicio' && b.activo) || null;
  const bannerInicioBack = banners.find(b => b.tipo === 'inicio-back' && b.activo) || null;

  const actualizarBanner = (bannerActualizado: Banner) => {
    setBanners(banners.map(banner => 
      banner.id === bannerActualizado.id ? bannerActualizado : banner
    ));
  };

  const eliminarBanner = (id: string) => {
    setBanners(banners.filter(banner => banner.id !== id));
  };

  const agregarBanner = async (nuevoBanner: Banner) => {
    const imagenExiste = await validarImagen(nuevoBanner.imagen);
    if (imagenExiste) {
      setBanners(prev => [...prev, nuevoBanner]);
    }
  };

  return (
    <ContextoPublicidad.Provider value={{
      banners,
      bannerHeader,
      bannersSidebar,
      bannerInicio,
      bannerInicioBack,
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