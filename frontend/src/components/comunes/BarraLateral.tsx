import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function BarraLateral() {
  const { contenidos } = useContextoNoticias();

  // Filtrar los contenidos destacados con ubicaciones laterales (side-1, side-2, etc.) y visibles
  const contenidosSide = Array.isArray(contenidos)
    ? contenidos.filter(c => c.ubicacion?.startsWith('side-') && c.visible)
    : [];
  
  // Debug: mostrar qué contenidos se encontraron
  console.log('Todos los contenidos:', contenidos);
  console.log('Contenidos side encontrados:', contenidosSide);
  console.log('Ubicaciones disponibles:', contenidos.map(c => c.ubicacion));

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
          <h3 className="font-bold">Promociones</h3>
        </div>
        <div className="p-4 space-y-4">
          {contenidosSide.length === 0 ? (
            <div className="text-gray-400 text-center py-6">
              No hay banners laterales disponibles.
            </div>
          ) : (
            contenidosSide.map((contenido, idx) => (
              <a
                key={contenido.id || idx}
                href={contenido.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-90 transition-opacity"
              >
                <img
                  src={contenido.media}
                  alt={contenido.titulo || 'Banner lateral'}
                  className="w-full h-auto object-contain rounded-lg shadow"
                />
              </a>
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