import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContextoNoticias } from '../contexts/ContextoNoticias';
import { useContextoPublicidad } from '../contexts/ContextoPublicidad';
import ImagenFallback from '../components/comunes/ImagenFallback';

const secciones = [
  { nombre: 'Nacionales', color: 'bg-blue-600', limite: 3 },
  { nombre: 'Municipales', color: 'bg-green-600', limite: 3 },
  { nombre: 'Deportes', color: 'bg-yellow-600', limite: 3 },
  { nombre: 'Cultura', color: 'bg-purple-600', limite: 3 },
  { nombre: 'Economía', color: 'bg-emerald-600', limite: 3 },
  { nombre: 'Sociales', color: 'bg-pink-600', limite: 3 },
  { nombre: 'Sucesos', color: 'bg-red-600', limite: 3 }
];

export default function PaginaPrincipal() {
  const { noticias, obtenerNoticiasPorSeccion } = useContextoNoticias();
  const { bannerInicio, bannerInicioBack, bannerInicio2 } = useContextoPublicidad();
  const [noticiaActual, setNoticiaActual] = useState(0);

  // Obtener las 3 noticias principales
  const noticiasPrincipales = noticias.slice(0, 3);
  
  // Obtener noticias secundarias
  const noticiasSecundarias = noticias.slice(3, 6);

  // Efecto para el autoplay del carrusel
  useEffect(() => {
    const intervalo = setInterval(() => {
      setNoticiaActual((actual) => 
        actual === noticiasPrincipales.length - 1 ? 0 : actual + 1
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, [noticiasPrincipales.length]);

  const irANoticia = (indice: number) => {
    setNoticiaActual(indice);
  };

  const renderSeccion = (seccion: typeof secciones[0], index: number) => {
    const noticiasSeccion = obtenerNoticiasPorSeccion(seccion.nombre, seccion.limite);
    
    if (noticiasSeccion.length === 0) return null;
    
    return (
      <section key={seccion.nombre} className="mb-12">
        <div className={`${seccion.color} w-full py-8 mb-8 rounded-lg`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{seccion.nombre}</h2>
                <p className="text-white/80">Las últimas noticias de {seccion.nombre.toLowerCase()}</p>
              </div>
              <Link 
                to={`/seccion/${seccion.nombre}`}
                className="inline-block bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                VER MÁS
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticiasSeccion.map((noticia) => (
            <Link 
              key={noticia.id} 
              to={`/noticia/${noticia.id}`} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`${seccion.color} text-white text-xs px-3 py-1 rounded-full`}>
                    {seccion.nombre}
                  </span>
                  <time className="text-gray-500 text-xs">
                    {new Date(noticia.fechaPublicacion).toLocaleDateString('es-ES')}
                  </time>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600">
                  {noticia.titulo}
                </h3>
                <p className="text-gray-600 line-clamp-3 text-sm mb-4">
                  {noticia.resumen}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">{noticia.autorTexto}</span>
                  <time className="text-xs text-gray-500">
                    {new Date(noticia.fechaPublicacion).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Home className="w-4 h-4 text-guarico-blue mr-2" />
          <span className="text-guarico-blue font-medium">MÁS NOTICIAS</span>
        </div>

        {/* Layout principal */}
        <div className="space-y-8">
          {/* Carrusel principal + noticias secundarias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Carrusel principal */}
            <div className="relative group">
              {noticiasPrincipales.map((noticia, index) => (
                <Link 
                  key={noticia.id} 
                  to={`/noticia/${noticia.id}`} 
                  className={`block transition-opacity duration-500 ${
                    index === noticiaActual ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-lg group">
                    <img
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-guarico-gold transition-colors">
                        {noticia.titulo}
                      </h2>
                      <p className="text-sm opacity-90 mb-2">{noticia.resumen}</p>
                      <div className="text-xs opacity-75">
                        {new Date(noticia.fechaPublicacion).toLocaleDateString('es-ES')} | 
                        Diario Ciudad Guárico
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Controles del carrusel */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {noticiasPrincipales.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => irANoticia(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === noticiaActual 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Ir a noticia ${index + 1}`}
                  />
                ))}
              </div>

              {/* Flechas de navegación */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  irANoticia(noticiaActual === 0 ? noticiasPrincipales.length - 1 : noticiaActual - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Noticia anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  irANoticia(noticiaActual === noticiasPrincipales.length - 1 ? 0 : noticiaActual + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Siguiente noticia"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Noticias secundarias */}
            <div className="space-y-4">
              {noticiasSecundarias.map((noticia) => (
                <Link key={noticia.id} to={`/noticia/${noticia.id}`} className="block group">
                  <div className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      className="w-24 h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-guarico-blue transition-colors line-clamp-2 mb-1">
                        {noticia.titulo}
                      </h3>
                      <div className="text-xs text-gray-500">
                        {new Date(noticia.fechaPublicacion).toLocaleDateString('es-ES')} | 
                        Diario Ciudad Guárico
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Banner publicitario superior */}
          {bannerInicio && (
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              {bannerInicio.enlace ? (
                <a href={bannerInicio.enlace} target="_blank" rel="noopener noreferrer">
                  <ImagenFallback 
                    src={bannerInicio.imagen}
                    alt="Contenido patrocinado"
                    className="w-full h-auto object-contain"
                  />
                </a>
              ) : (
                <ImagenFallback 
                  src={bannerInicio.imagen}
                  alt="Contenido patrocinado"
                  className="w-full h-auto object-contain"
                />
              )}
            </div>
          )}

          {/* Secciones con banners */}
          {secciones.map((seccion, index) => {
            // Después de la sección de Cultura
            if (index > 0 && secciones[index - 1].nombre === 'Cultura') {
              return (
                <React.Fragment key={seccion.nombre}>
                  {/* Banner inicio-2 */}
                  {bannerInicio2 && (
                    <div className="w-full mb-8 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      {bannerInicio2.enlace ? (
                        <a href={bannerInicio2.enlace} target="_blank" rel="noopener noreferrer">
                          <ImagenFallback 
                            src={bannerInicio2.imagen}
                            alt="Contenido patrocinado"
                            className="w-full h-auto object-contain"
                          />
                        </a>
                      ) : (
                        <ImagenFallback 
                          src={bannerInicio2.imagen}
                          alt="Contenido patrocinado"
                          className="w-full h-auto object-contain"
                        />
                      )}
                    </div>
                  )}
                  {renderSeccion(seccion, index)}
                </React.Fragment>
              );
            }
            return renderSeccion(seccion, index);
          })}

          {/* Banner publicitario final */}
          {bannerInicioBack && (
            <div className="w-full mt-8 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              {bannerInicioBack.enlace ? (
                <a href={bannerInicioBack.enlace} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={bannerInicioBack.imagen}
                    alt="Publicidad"
                    className="w-full h-auto object-contain"
                  />
                </a>
              ) : (
                <img 
                  src={bannerInicioBack.imagen}
                  alt="Publicidad"
                  className="w-full h-auto object-contain"
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}