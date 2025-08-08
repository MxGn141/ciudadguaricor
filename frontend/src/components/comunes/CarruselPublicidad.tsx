import React from 'react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function CarruselContenidoDestacado() {
  const { contenidosDestacados } = useContextoNoticias();
  
  // Debug: mostrar todos los contenidos disponibles
  console.log('Contenidos destacados para carrusel:', contenidosDestacados);
  console.log('Ubicaciones disponibles:', contenidosDestacados.map(c => c.ubicacion));
  
  // Filtrar contenidos para el carrusel (solo contenidos específicos para carrusel)
  const contenidosCarrusel = contenidosDestacados.filter(cont => {
    const esTipoCarrusel = (cont as any).tipo === 'carrusel';
    const esUbicacionCarrusel = cont.ubicacion === 'carrusel';
    return esTipoCarrusel || esUbicacionCarrusel;
  }).slice(0, 7); // Límite de 7 contenidos
  
  console.log('Contenidos filtrados para carrusel:', contenidosCarrusel);
  
  if (contenidosCarrusel.length === 0) {
    return (
      <div className="h-16 md:h-20 bg-gradient-to-r from-guarico-blue to-guarico-dark-blue flex items-center justify-center border-b-2 border-guarico-light-blue overflow-hidden">
        <div className="flex animate-scroll-left min-w-full">
          <div className="flex items-center whitespace-nowrap">
            <span className="text-guarico-gold font-medium mx-8">Espacio de Contenido Disponible</span>
            <span className="text-guarico-light-gold mx-4">•</span>
            <span className="text-guarico-gold font-medium mx-8">Contacte con nosotros para destacar su contenido</span>
            <span className="text-guarico-light-gold mx-4">•</span>
            <span className="text-guarico-gold font-medium mx-8">Espacio de Contenido Disponible</span>
            <span className="text-guarico-light-gold mx-4">•</span>
            <span className="text-guarico-gold font-medium mx-8">Contacte con nosotros para destacar su contenido</span>
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
  const contenidosDuplicados = Array(4).fill(contenidosCarrusel).flat();

  return (
    <div className="h-16 md:h-20 bg-gradient-to-r from-guarico-blue to-guarico-dark-blue overflow-hidden border-b-2 border-guarico-light-blue relative">
      <div className="flex h-full animate-scroll-left" style={{ minWidth: '200%' }}>
        {contenidosDuplicados.map((contenido, index) => (
          <div key={`${contenido.id}-${index}`} className="flex items-center justify-center px-4 md:px-8 whitespace-nowrap flex-shrink-0">
            <div className="flex items-center space-x-2 md:space-x-4">
              <img 
                src={contenido.media} 
                alt={(contenido as any).titulo || contenido.titulo || 'Contenido destacado'}
                className="h-8 w-8 md:h-12 md:w-12 object-contain rounded"
              />
              <span className="text-guarico-gold font-semibold text-sm md:text-lg">
                {(contenido as any).titulo || contenido.titulo || 'Contenido'}
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