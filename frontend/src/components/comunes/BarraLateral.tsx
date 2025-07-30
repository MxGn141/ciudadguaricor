import React from 'react';
import { useContextoContenido } from '../../contexts/ContextoContenido';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function BarraLateral() {
  const { contenidosLaterales } = useContextoContenido();
  const { publicidades } = useContextoNoticias();

  // Obtener los banners side en orden específico
  const bannersSide = [
    publicidades.find(pub => pub.posicion === 'side-1'),
    publicidades.find(pub => pub.posicion === 'side-2'),
    publicidades.find(pub => pub.posicion === 'side-3'),
    publicidades.find(pub => pub.posicion === 'side-4'),
    publicidades.find(pub => pub.posicion === 'side-5'),
    publicidades.find(pub => pub.posicion === 'side-6'),
  ];

  // Debug: mostrar qué banners se encontraron
  console.log('Publicidades disponibles:', publicidades);
  console.log('Banners side encontrados:', bannersSide);

  return (
    <aside className="space-y-6">
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

      {/* Contenido Relacionado (banners side) */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-white px-4 py-3">
          <h3 className="font-bold">CONTENIDO RELACIONADO</h3>
        </div>
        <div className="p-4 space-y-4">
          {bannersSide.map((banner, idx) => {
            if (!banner) {
              console.log(`No se encontró banner para posición ${idx + 1}`);
              return null;
            }
            
            console.log(`Renderizando banner ${banner.posicion}:`, banner);
            
            return (
              <div key={banner.id} className="flex justify-center">
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
              </div>
            );
          })}
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