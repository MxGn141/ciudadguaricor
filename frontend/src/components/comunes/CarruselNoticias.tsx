import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function CarruselNoticias() {
  const { noticias } = useContextoNoticias();
  const [indiceActual, setIndiceActual] = useState(0);

  // Obtener noticias destacadas del backend
  const noticiasDestacadas = noticias.filter(noticia => noticia.destacada).slice(0, 5);

  // Si no hay noticias destacadas, usar las primeras noticias
  const noticiasParaMostrar = noticiasDestacadas.length > 0 ? noticiasDestacadas : noticias.slice(0, 5);

  useEffect(() => {
    if (noticiasParaMostrar.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndiceActual((actual) => 
        actual === noticiasParaMostrar.length - 1 ? 0 : actual + 1
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, [noticiasParaMostrar.length]);

  const irASiguiente = () => {
    setIndiceActual((actual) => 
      actual === noticiasParaMostrar.length - 1 ? 0 : actual + 1
    );
  };

  const irAAnterior = () => {
    setIndiceActual((actual) => 
      actual === 0 ? noticiasParaMostrar.length - 1 : actual - 1
    );
  };

  if (noticiasParaMostrar.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl bg-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg">No hay noticias destacadas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl">
        {noticiasParaMostrar.map((noticia, index) => {
          console.log('Carrusel noticia:', noticia);
          // Obtener la imagen principal desde media
          const imagenPrincipal = noticia.media?.find(m => m.tipo === 'imagen')?.url || '';
          // Obtener nombre de la sección
          const nombreSeccion = typeof noticia.seccion === 'object' && noticia.seccion !== null ? noticia.seccion.nombre : String(noticia.seccion);
          return (
            <div
              key={noticia.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === indiceActual ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Link to={`/noticia/${noticia.id}`} className="block h-full group">
                <div className="relative h-full">
                  <img
                    src={imagenPrincipal}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                      <span className="inline-block bg-guarico-gold text-black px-3 py-1 text-sm font-semibold rounded">
                        {nombreSeccion}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 group-hover:text-guarico-gold transition-colors">
                      {noticia.titulo}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Controles del carrusel */}
      {noticiasParaMostrar.length > 1 && (
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
            {noticiasParaMostrar.map((_, index) => (
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