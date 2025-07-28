import React from 'react';
import { useContextoContenido } from '../../contexts/ContextoContenido';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function BarraLateral() {
  const { contenidosLaterales } = useContextoContenido();
  const { publicidades } = useContextoNoticias();
  
  // Filtrar banners para la barra lateral (posiciones side-1 a side-6)
  const bannersLaterales = publicidades.filter(pub => 
    ['side-1', 'side-2', 'side-3', 'side-4', 'side-5', 'side-6'].includes(pub.posicion)
  );

  return (
    <aside className="space-y-6">
      {/* Banner lateral superior */}
      {bannersLaterales.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-guarico-blue text-white px-4 py-3">
            <h3 className="font-bold">PUBLICIDAD</h3>
          </div>
          <div className="p-4 space-y-4">
            {bannersLaterales.map((banner) => (
              <article key={banner.id} className="overflow-hidden rounded-lg">
                {banner.url ? (
                  <a 
                    href={banner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={banner.imagen}
                      alt={banner.descripcion || 'Banner publicitario'}
                      className="w-full h-auto object-contain"
                    />
                  </a>
                ) : (
                  <img
                    src={banner.imagen}
                    alt={banner.descripcion || 'Banner publicitario'}
                    className="w-full h-auto object-contain"
                  />
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Enlaces Institucionales */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-white px-4 py-3">
          <h3 className="font-bold">ENLACES</h3>
        </div>
        <div className="p-4 space-y-4">
          {/* Gobernación de Guárico */}
          <a 
            href="https://guarico.gob.ve/"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-90 transition-opacity"
          >
            <img
              src="/gob.png"
              alt="Gobernación de Guárico"
              className="w-full h-auto object-contain"
            />
          </a>

          {/* Canta Guárico */}
          <div className="space-y-2">
            <a 
              href="https://zeno.fm/radio/cantaguarico-91-3fm/"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity"
            >
              <img
                src="/cantaguarico.jpg"
                alt="Canta Guárico"
                className="w-full h-auto object-contain"
              />
            </a>
            {/* Reproductor de Radio */}
            <div className="w-full bg-gray-100 rounded-lg p-2">
              <iframe
                title="Canta Guárico Radio"
                src="https://zeno.fm/player/cantaguarico-91-3fm"
                width="100%"
                height="100"
                frameBorder="0"
                scrolling="no"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Relacionado */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-white px-4 py-3">
          <h3 className="font-bold">CONTENIDO RELACIONADO</h3>
        </div>
        <div className="p-4 space-y-4">
          {contenidosLaterales.length > 0 ? (
            contenidosLaterales.map((contenido) => (
              <article key={contenido.id} className="overflow-hidden rounded-lg">
                {contenido.enlace ? (
                  <a 
                    href={contenido.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={contenido.imagen}
                      alt="Contenido relacionado"
                      className="w-full h-auto object-contain"
                    />
                  </a>
                ) : (
                  <img
                    src={contenido.imagen}
                    alt="Contenido relacionado"
                    className="w-full h-auto object-contain"
                  />
                )}
              </article>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <div className="border-2 border-dashed border-guarico-light-blue rounded-lg p-4">
                <p className="text-sm">Próximamente más contenido</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Espacio adicional */}
      <section className="bg-gray-100 rounded-lg p-4 text-center min-h-[600px] flex items-center justify-center">
        <div className="text-gray-400">
          <p className="text-sm">Próximamente más contenido</p>
        </div>
      </section>
    </aside>
  );
}