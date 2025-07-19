import React from 'react';
import { Download, Eye } from 'lucide-react';
import { useContextoPublicidad } from '../../contexts/ContextoPublicidad';
import ContenidoDestacado from './ContenidoDestacado';

export default function BarraLateral() {
  const { bannersSidebar } = useContextoPublicidad();

  return (
    <aside className="w-full space-y-6">
      {/* Edición Digital */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-white px-4 py-3">
          <h3 className="font-bold text-lg">EDICIÓN DIGITAL</h3>
        </div>
        <div className="p-4">
          <div className="relative bg-guarico-dark-blue rounded-lg overflow-hidden">
            <div className="aspect-[3/4] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-guarico-gold mb-2">CIUDAD</div>
                <div className="text-6xl font-bold text-guarico-gold">GUÁRICO</div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-semibold">
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long',
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
            <button className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all">
              <Eye size={16} />
            </button>
          </div>
          <button 
            onClick={() => window.open('/edicion-pdf', '_blank')}
            className="w-full mt-4 bg-guarico-blue text-white px-4 py-3 rounded font-semibold hover:bg-guarico-blue/90 transition-colors flex items-center justify-center"
          >
            <Download size={20} className="mr-2" />
            Descargar Edición Digital
          </button>
        </div>
      </div>

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
            {/* ContenidoPersonalizado */}
            <ContenidoDestacado
              src="/gob.png"
              className="w-full h-32"
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
              <ContenidoDestacado
                src="/cantaguarico.jpg"
                className="w-full h-32"
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

      {/* Contenido Destacado */}
      <section className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-guarico-blue to-guarico-dark-blue text-white px-4 py-3">
          <h3 className="font-bold">DESTACADOS</h3>
        </div>
        <div className="p-4 space-y-4">
          {bannersSidebar.length > 0 ? (
            bannersSidebar.map((banner) => (
              <div key={banner.id} className="transform transition-all duration-500 hover:scale-[1.02]">
                <ContenidoDestacado
                  src={banner.imagen}
                  href={banner.enlace}
                  className="w-full aspect-[4/3]"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <div className="border-2 border-dashed border-guarico-light-blue rounded-lg p-4">
                <p className="text-sm">Espacio disponible</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Espacio adicional */}
      <section className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 text-center min-h-[600px] flex items-center justify-center">
        <div className="text-gray-400">
          <p className="text-sm">Espacio disponible</p>
        </div>
      </section>
    </aside>
  );
}