import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function CarruselNoticias() {
  const { noticias } = useContextoNoticias();
  const [indiceActual, setIndiceActual] = useState(0);
  const noticiasDestacadas = noticias.filter(noticia => noticia.destacada).slice(0, 3);

  useEffect(() => {
    if (noticiasDestacadas.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndiceActual(actual => 
        actual === noticiasDestacadas.length - 1 ? 0 : actual + 1
      );
    }, 5000); // Cambiar cada 5 segundos

    return () => clearInterval(intervalo);
  }, [noticiasDestacadas.length]);

  const irAAnterior = () => {
    setIndiceActual(actual => 
      actual === 0 ? noticiasDestacadas.length - 1 : actual - 1
    );
  };

  const irASiguiente = () => {
    setIndiceActual(actual => 
      actual === noticiasDestacadas.length - 1 ? 0 : actual + 1
    );
  };

  if (noticiasDestacadas.length === 0) return null;

  return (
    <div className="relative group">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl">
        {noticiasDestacadas.map((noticia, index) => (
          <div
            key={noticia.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === indiceActual ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Link to={`/noticia/${noticia.id}`} className="block h-full group">
              <div className="relative h-full">
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-2">
                    <span className="inline-block bg-guarico-gold text-black px-3 py-1 text-sm font-semibold rounded">
                      {noticia.seccion}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 group-hover:text-guarico-gold transition-colors">
                    {noticia.titulo}
                  </h2>
                  <p className="text-gray-200 text-sm md:text-base line-clamp-2">
                    {noticia.resumen}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controles del carrusel */}
      {noticiasDestacadas.length > 1 && (
        <>
          <button
            onClick={irAAnterior}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Anterior noticia"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={irASiguiente}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Siguiente noticia"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores de posición */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {noticiasDestacadas.map((_, index) => (
              <button
                key={index}
                onClick={() => setIndiceActual(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === indiceActual 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir a noticia ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}