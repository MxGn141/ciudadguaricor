import React from 'react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function CarruselPublicidad() {
  const { publicidades } = useContextoNoticias();
  
  // Filtrar banners para el carrusel (solo banners específicos para carrusel)
  const bannersCarrusel = publicidades.filter(pub => {
    const esTipoCarrusel = (pub as any).tipo === 'carrusel';
    const esPosicionCarrusel = ['carrusel', 'banner-carrusel'].includes(pub.posicion);
    return esTipoCarrusel || esPosicionCarrusel;
  }).slice(0, 7); // Límite de 7 publicidades
  
  if (bannersCarrusel.length === 0) {
    return (
      <div className="h-16 md:h-20 bg-gradient-to-r from-guarico-blue to-guarico-dark-blue flex items-center justify-center border-b-2 border-guarico-light-blue overflow-hidden">
        <div className="flex animate-scroll-left min-w-full">
          <div className="flex items-center whitespace-nowrap">
            <span className="text-guarico-gold font-medium mx-8">Espacio Publicitario Disponible</span>
            <span className="text-guarico-light-gold mx-4">•</span>
            <span className="text-guarico-gold font-medium mx-8">Contacte con nosotros para anunciar</span>
            <span className="text-guarico-light-gold mx-4">•</span>
            <span className="text-guarico-gold font-medium mx-8">Espacio Publicitario Disponible</span>
            <span className="text-guarico-light-gold mx-4">•</span>
            <span className="text-guarico-gold font-medium mx-8">Contacte con nosotros para anunciar</span>
            <span className="text-guarico-light-gold mx-4">•</span>
          </div>
        </div>
        
        <style>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-left {
            animation: scroll-left 30s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // Duplicamos para asegurar un scroll perpetuo
  const bannersDuplicados = Array(4).fill(bannersCarrusel).flat();

  return (
    <div className="h-16 md:h-20 bg-gradient-to-r from-guarico-blue to-guarico-dark-blue overflow-hidden border-b-2 border-guarico-light-blue relative">
      <div className="flex h-full animate-scroll-left" style={{ minWidth: '200%' }}>
        {bannersDuplicados.map((banner, index) => (
          <div key={`${banner.id}-${index}`} className="flex items-center justify-center px-4 md:px-8 whitespace-nowrap flex-shrink-0">
            <div className="flex items-center space-x-2 md:space-x-4">
              <img 
                src={banner.imagen} 
                alt={(banner as any).titulo || banner.descripcion || 'Banner publicitario'}
                className="h-8 w-8 md:h-12 md:w-12 object-contain rounded"
              />
              <span className="text-guarico-gold font-semibold text-sm md:text-lg">
                {(banner as any).titulo || banner.descripcion || 'Publicidad'}
              </span>
            </div>
            <span className="text-guarico-light-gold mx-3 md:mx-6">•</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
      `}</style>
    </div>
  );
}