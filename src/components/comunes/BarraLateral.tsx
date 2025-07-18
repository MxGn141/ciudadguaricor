import React from 'react';
import { Download, FileText, Calendar, Eye } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function BarraLateral() {
  const { publicidades } = useContextoNoticias();
  const publicidadesSidebar = publicidades.filter(pub => pub.tipo === 'sidebar').slice(0, 6);

  return (
    <aside className="w-full space-y-6">
      {/* Edición del Día */}
      <div className="bg-guarico-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-guarico-white px-4 py-2">
          <h3 className="font-bold text-lg">EDICIÓN DEL DÍA</h3>
        </div>
        <div className="p-4">
          <div className="relative bg-guarico-dark-blue rounded-lg overflow-hidden">
            <div className="aspect-[3/4] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-guarico-gold mb-2">CIUDAD</div>
                <div className="text-6xl font-bold text-guarico-gold">GUÁRICO</div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-guarico-white font-semibold">
                    {new Date().toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
            <button className="absolute top-2 right-2 bg-guarico-black bg-opacity-50 text-guarico-white p-2 rounded-full hover:bg-opacity-75 transition-all">
              <Eye size={16} />
            </button>
          </div>
          <button 
            onClick={() => window.open('/edicion-pdf', '_blank')}
            className="w-full mt-4 bg-guarico-blue text-guarico-white px-4 py-2 rounded font-semibold hover:bg-guarico-light-blue transition-colors flex items-center justify-center"
          >
            <Download size={20} className="mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>

      {/* Iconos circulares */}
      <div className="flex justify-center space-x-3">
        <button 
          onClick={() => window.open('https://twitter.com/ciudadguarico', '_blank')}
          className="w-12 h-12 bg-guarico-blue rounded-full flex items-center justify-center hover:bg-guarico-light-blue transition-colors"
        >
          <span className="text-guarico-gold font-bold text-xl">★</span>
        </button>
        <button 
          onClick={() => document.getElementById('search-input')?.focus()}
          className="w-12 h-12 bg-guarico-green rounded-full flex items-center justify-center hover:bg-guarico-light-green transition-colors"
        >
          <span className="text-guarico-white font-bold text-xl">🔍</span>
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="w-12 h-12 bg-guarico-gold rounded-full flex items-center justify-center hover:bg-guarico-light-gold transition-colors"
        >
          <span className="text-guarico-black font-bold text-xl">⚡</span>
        </button>
        <button 
          onClick={() => window.open('/', '_blank')}
          className="w-12 h-12 bg-guarico-blue rounded-full flex items-center justify-center hover:bg-guarico-light-blue transition-colors"
        >
          <span className="text-guarico-gold font-bold text-xl">CG</span>
        </button>
      </div>

      {/* Publicidad */}
      <div className="bg-guarico-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-guarico-white px-4 py-2">
          <h3 className="font-semibold">Publicidad</h3>
        </div>
        <div className="p-4 space-y-3">
          {publicidadesSidebar.length > 0 ? (
            publicidadesSidebar.map((pub) => (
              <div key={pub.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                {pub.enlace ? (
                  <a href={pub.enlace} target="_blank" rel="noopener noreferrer">
                    <img
                      src={pub.imagen}
                      alt={pub.titulo}
                      className="w-full h-24 object-cover hover:opacity-90 transition-opacity"
                    />
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{pub.titulo}</p>
                    </div>
                  </a>
                ) : (
                  <>
                    <img
                      src={pub.imagen}
                      alt={pub.titulo}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{pub.titulo}</p>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <div className="border-2 border-dashed border-guarico-light-blue rounded-lg p-4">
                <p className="text-sm">Espacio publicitario disponible</p>
                <p className="text-xs mt-1">Hasta 6 anuncios</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clima */}
      <div className="bg-guarico-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-green text-guarico-white px-4 py-2">
          <h3 className="font-semibold">Clima en Guárico</h3>
        </div>
        <div className="p-4 text-center">
          <div className="text-3xl font-bold text-gray-800 mb-2">28°C</div>
          <p className="text-gray-600 text-sm mb-2">Parcialmente nublado</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>Máx: 32°C</div>
            <div>Mín: 24°C</div>
            <div>Humedad: 65%</div>
            <div>Viento: 12 km/h</div>
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-guarico-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-guarico-blue text-guarico-white px-4 py-2">
          <h3 className="font-semibold">Síguenos</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => window.open('https://facebook.com/ciudadguarico', '_blank')}
              className="bg-guarico-blue text-guarico-white px-3 py-2 rounded text-sm hover:bg-guarico-light-blue transition-colors"
            >
              Facebook
            </button>
            <button 
              onClick={() => window.open('https://twitter.com/ciudadguarico', '_blank')}
              className="bg-guarico-green text-guarico-white px-3 py-2 rounded text-sm hover:bg-guarico-light-green transition-colors"
            >
              Twitter
            </button>
            <button 
              onClick={() => window.open('https://instagram.com/ciudadguarico', '_blank')}
              className="bg-guarico-gold text-guarico-black px-3 py-2 rounded text-sm hover:bg-guarico-light-gold transition-colors"
            >
              Instagram
            </button>
            <button 
              onClick={() => window.open('https://youtube.com/ciudadguarico', '_blank')}
              className="bg-guarico-blue text-guarico-white px-3 py-2 rounded text-sm hover:bg-guarico-light-blue transition-colors"
            >
              YouTube
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}