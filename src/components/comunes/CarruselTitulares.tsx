import React from 'react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function CarruselTitulares() {
  const { noticias } = useContextoNoticias();
  
  const titulares = noticias.slice(0, 8).map(noticia => `${noticia.seccion}: ${noticia.titulo}`);

  if (titulares.length === 0) return null;

  // Duplicamos los titulares para crear el efecto infinito
  const titularesDuplicados = [...titulares, ...titulares];

  return (
    <div className="bg-guarico-dark-blue border-b border-guarico-light-blue py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          <span className="bg-guarico-gold text-guarico-black px-3 py-1 text-sm font-semibold rounded mr-4 whitespace-nowrap z-10">
            ÚLTIMA HORA
          </span>
          <div className="flex-1 overflow-hidden relative">
            <div className="flex animate-scroll-left">
              {titularesDuplicados.map((titular, index) => (
                <div key={index} className="flex items-center whitespace-nowrap">
                  <span className="text-sm text-guarico-white mx-8">{titular}</span>
                  <span className="text-guarico-gold mx-4">•</span>
                </div>
              ))}
            </div>
          </div>
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
          animation: scroll-left 60s linear infinite;
        }
      `}</style>
    </div>
  );
}