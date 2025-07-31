import React from 'react';
import { useContextoContenido } from '../../contexts/ContextoContenido';

export default function BarraLateral() {
  const { contenidos } = useContextoContenido();
  // Filtrar los contenidos destacados de la ubicación 'sidebar' y visibles
  const contenidosSide = contenidos.filter(c => c.ubicacion === 'sidebar' && c.visible);
  // Debug: mostrar qué contenidos se encontraron
  console.log('Contenidos side encontrados:', contenidosSide);

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

      {/* Contenido Relacionado (contenidos side) */}
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-white px-4 py-3">
          <h3 className="font-bold">CONTENIDO RELACIONADO</h3>
        </div>
        <div className="p-4 space-y-4">
          {contenidosSide.length === 0 ? (
            <p className="text-gray-500 text-center">No hay contenido relacionado</p>
          ) : (
            contenidosSide.map((contenido, idx) => (
              <div key={contenido.id} className="mb-4">
                {contenido.url ? (
                  <a href={contenido.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={contenido.media}
                      alt={contenido.titulo || 'Contenido relacionado'}
                      className="w-full h-32 object-cover rounded"
                    />
                  </a>
                ) : (
                  <img
                    src={contenido.media}
                    alt={contenido.titulo || 'Contenido relacionado'}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                {contenido.titulo && (
                  <div className="mt-2 text-center text-sm text-gray-700 font-medium">
                    {contenido.titulo}
                  </div>
                )}
              </div>
            ))
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