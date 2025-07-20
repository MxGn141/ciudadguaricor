import React from 'react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function CarruselPublicidad() {
  const { publicidades } = useContextoNoticias();
  
  const publicidadesCarrusel = publicidades.filter(pub => pub.tipo === 'carrusel');

  if (publicidadesCarrusel.length === 0) {
    return (
      <div className="h-16 md:h-20 bg-gradient-to-r from-guarico-blue to-guarico-dark-blue flex items-center justify-center border-b-2 border-guarico-light-blue overflow-x-auto">
        <div className="flex animate-scroll-right min-w-full">
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
          @keyframes scroll-right {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
          
          .animate-scroll-right {
            animation: scroll-right 30s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // Duplicamos muchas veces para asegurar un scroll perpetuo
  const publicidadesDuplicadas = Array(12).fill(publicidadesCarrusel).flat();

  return (
    <div className="h-16 md:h-20 bg-gradient-to-r from-guarico-blue to-guarico-dark-blue overflow-x-hidden border-b-2 border-guarico-light-blue relative">
      <div className="flex h-full animate-scroll-right" style={{ minWidth: '400%' }}>
        {publicidadesDuplicadas.map((pub, index) => (
          <div key={`${pub.id}-${index}`} className="flex items-center justify-center px-4 md:px-8 whitespace-nowrap">
            <div className="flex items-center space-x-2 md:space-x-4">
              <img 
                src={pub.imagen} 
                alt={pub.titulo}
                className="h-8 w-8 md:h-12 md:w-12 object-cover rounded"
              />
              <span className="text-guarico-gold font-semibold text-sm md:text-lg">{pub.titulo}</span>
            </div>
            <span className="text-guarico-light-gold mx-3 md:mx-6">•</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-scroll-right {
          animation: scroll-right 120s linear infinite;
        }
      `}</style>
    </div>
  );
}