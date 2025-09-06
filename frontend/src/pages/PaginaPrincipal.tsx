import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContextoNoticias, Noticia } from '../contexts/ContextoNoticias';
import TarjetaNoticia from '../components/noticias/TarjetaNoticia';

const secciones = [
  { nombre: 'Gestión', color: 'bg-blue-600', limite: 3 },
  { nombre: 'Municipales', color: 'bg-green-600', limite: 3 },
  { nombre: 'Deportes', color: 'bg-yellow-600', limite: 3 },
  { nombre: 'Cultura', color: 'bg-purple-600', limite: 3 },
  { nombre: 'Produccion', color: 'bg-emerald-600', limite: 3 },
  { nombre: 'Comunidad', color: 'bg-pink-600', limite: 3 },
  { nombre: 'Seguridad', color: 'bg-red-600', limite: 3 },
  { nombre: 'Turismo', color: 'bg-cyan-600', limite: 3 },
  { nombre: 'Educación', color: 'bg-indigo-600', limite: 3 }
];

// Paleta de colores para cada sección (igual que en PaginaSeccion)
const coloresSeccion = {
  'Gestión': 'bg-blue-600 text-white',
  'Municipales': 'bg-green-600 text-white',
  'Deportes': 'bg-yellow-500 text-gray-900',
  'Cultura': 'bg-purple-600 text-white',
  'Produccion': 'bg-emerald-600 text-white',
  'Comunidad': 'bg-pink-600 text-white',
  'Seguridad': 'bg-red-600 text-white',
  'Turismo': 'bg-cyan-600 text-white',
  'Educación': 'bg-indigo-600 text-white'
};

export default function PaginaPrincipal() {
  const [noticiasPorSeccion, setNoticiasPorSeccion] = useState<Record<string, Noticia[]>>({});

  const { obtenerNoticiasPorSeccion, noticias, cargandoBusqueda, contenidos } = useContextoNoticias();
  const [noticiaActual, setNoticiaActual] = useState(0);

  // Filtrar contenido destacado por ubicación (coincidiendo con backend)
  const contenidoMain1 = contenidos.find(c => c.ubicacion === 'main-1' && c.visible);
  const contenidoMain2 = contenidos.find(c => c.ubicacion === 'main-2' && c.visible);
  const contenidoMainBg = contenidos.find(c => c.ubicacion === 'main-bg' && c.visible); // Fondo del main, no del header

  // Función para convertir fecha a Date si es string
  const convertirFecha = (fecha: Date | string): Date => {
    if (fecha instanceof Date) {
      return fecha;
    }
    return new Date(fecha);
  };

  useEffect(() => {
    cargarNoticiasPorSeccion();
  }, []);

  useEffect(() => {
    // Reiniciar el índice del carrusel cuando cambien las noticias
    if (noticias.length > 0) {
      console.log('Noticias cargadas:', noticias.length);
      setNoticiaActual(0);
    }
  }, [noticias]);

  const cargarNoticiasPorSeccion = async () => {
    // Usar las secciones definidas arriba para mantener consistencia
    const nombresSecciones = secciones.map(s => s.nombre);
    const noticiasTemp: Record<string, Noticia[]> = {};
    
    console.log('Cargando noticias para secciones:', nombresSecciones);
    
    for (const seccion of nombresSecciones) {
      try {
        const noticiasSeccion = await obtenerNoticiasPorSeccion(seccion);
        console.log(`Noticias cargadas para ${seccion}:`, noticiasSeccion.length);
        noticiasTemp[seccion] = noticiasSeccion;
      } catch (error) {
        console.error(`Error cargando noticias para ${seccion}:`, error);
        noticiasTemp[seccion] = [];
      }
    }
    
    setNoticiasPorSeccion(noticiasTemp);
  };

  // En vez de usar todasLasNoticias, usa noticias (ya filtradas por el contexto)
  const noticiasPrincipales = noticias.slice(0, 5);
  const noticiasSecundarias = noticias.filter(noticia => noticia.destacada).slice(0, 3);

  // Debug: mostrar qué noticia se está mostrando
  console.log('Noticia actual:', noticiaActual, 'de', noticiasPrincipales.length);
  console.log('Noticias en carrusel:', noticiasPrincipales.map(n => n.titulo));

  // Efecto para el autoplay del carrusel
  useEffect(() => {
    if (noticiasPrincipales.length <= 1) return;
    
    const intervalo = setInterval(() => {
      setNoticiaActual((actual) => 
        actual === noticiasPrincipales.length - 1 ? 0 : actual + 1
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, [noticiasPrincipales.length]);

  const irANoticia = (indice: number) => {
    console.log('Cambiando a noticia:', indice, 'de', noticiasPrincipales.length);
    setNoticiaActual(indice);
  };

  const renderSeccion = (seccion: string) => {
    const noticiasSeccion = noticiasPorSeccion[seccion] || [];
    
    if (noticiasSeccion.length === 0) {
      return null;
    }
    
    // Título más pequeño, alineado a la izquierda, línea solo a la derecha
    return (
      <div key={seccion} className="my-12">
        <div className="relative flex items-center mb-6">
          <h2 className={`text-xl md:text-2xl font-bold px-4 py-2 rounded-lg shadow-md border-2 border-white ${coloresSeccion[seccion as keyof typeof coloresSeccion] || 'bg-blue-600 text-white'}`}>{seccion}</h2>
          <div className={`flex-1 h-0.5 ml-4 ${coloresSeccion[seccion as keyof typeof coloresSeccion]?.split(' ')[0] || 'bg-blue-600'} opacity-30`} />
        </div>
        {/* Grid responsivo con CSS que controla la visualización */}
        <div className="grid gap-4 md:gap-6">
          {/* Móvil: 1 por fila (apiladas) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {noticiasSeccion.slice(0, 4).map((noticia) => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </div>
          
          {/* Tablet: 2 noticias lado a lado */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
            {noticiasSeccion.slice(0, 2).map((noticia) => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </div>
          
          {/* Desktop: 3 noticias */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {noticiasSeccion.slice(0, 3).map((noticia) => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // En vez de recorrer todas las secciones, si hay término de búsqueda, muestra solo las noticias filtradas
  if (cargandoBusqueda) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Buscando...</h2>
          <p className="text-gray-500">Por favor espera mientras buscamos noticias.</p>
        </div>
      </div>
    );
  }
  if (!noticias || noticias.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-2">No se encontraron noticias</h2>
          <p className="text-gray-500">Intenta con otro término de búsqueda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Home className="w-4 h-4 text-guarico-blue mr-2" />
          <span className="text-guarico-blue font-medium">MÁS NOTICIAS</span>
        </div>
        {/* Si hay búsqueda, muestra solo las noticias filtradas */}
        {noticiasPrincipales.length > 0 && noticiasPrincipales[noticiaActual] ? (
          <div className="space-y-8">
            {/* Carrusel principal + noticias destacadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Carrusel principal */}
              <div className="relative group">
                {noticiasPrincipales.length > 0 && noticiasPrincipales[noticiaActual] ? (
                  <>
                    {/* Mostrar solo la noticia actual */}
                    {(() => {
                      const noticiaMostrada = noticiasPrincipales[noticiaActual];
                      if (!noticiaMostrada) return null;
                      console.log('Mostrando noticia actual:', noticiaMostrada?.id, noticiaMostrada?.titulo);
                      return (
                        <Link 
                          key={noticiaMostrada.id} 
                          to={`/noticia/${noticiaMostrada.id}`} 
                          className="block"
                        >
                          <div className="relative overflow-hidden rounded-lg group">
                            <img
                              src={noticiaMostrada.media?.find(m => m.tipo === 'imagen')?.url || ''}
                              alt={noticiaMostrada.titulo}
                              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <div className="mb-2">
                                <span className="inline-block bg-guarico-gold text-black px-3 py-1 text-sm font-semibold rounded">
                                  {noticiaMostrada.seccion?.nombre}
                                </span>
                              </div>
                              <h2 className="text-2xl font-bold mb-2 group-hover:text-guarico-gold transition-colors">
                                {noticiaMostrada.titulo}
                              </h2>
                              <p className="text-sm opacity-90 mb-2">{noticiaMostrada.resumen}</p>
                              <div className="text-xs opacity-75">
                                {convertirFecha(noticiaMostrada.fecha_publicacion).toLocaleDateString('es-ES')} | 
                                Diario Ciudad Guárico
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })()}

                    {/* Controles del carrusel */}
                    {noticiasPrincipales.length > 1 && (
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
                    )}

                    {/* Flechas de navegación */}
                    {noticiasPrincipales.length > 1 && (
                      <>
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
                      </>
                    )}
                  </>
                ) : (
                  <div className="relative h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-lg">No hay noticias disponibles</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Noticias destacadas */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Noticias Destacadas</h3>
                {noticiasSecundarias.length > 0 ? (
                  noticiasSecundarias.map((noticia) => (
                    <Link key={noticia.id} to={`/noticia/${noticia.id}`} className="block group">
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={noticia.media?.find(m => m.tipo === 'imagen')?.url || ''}
                          alt={noticia.titulo}
                          className="w-full sm:w-24 sm:h-20 h-40 object-cover rounded flex-shrink-0 mb-2 sm:mb-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="mb-1">
                              <span className="inline-block bg-guarico-gold text-black px-2 py-1 text-xs font-semibold rounded">
                                {noticia.seccion?.nombre}
                              </span>
                            </div>
                            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-guarico-blue transition-colors line-clamp-2 mb-1">
                              {noticia.titulo}
                            </h3>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 sm:mt-0">
                            {convertirFecha(noticia.fecha_publicacion).toLocaleDateString('es-ES')} | 
                            Diario Ciudad Guárico
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-500 text-center">No hay noticias destacadas</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido Destacado */}
            {contenidoMain1 && (
              <div className="w-full mb-8">
                {contenidoMain1.url ? (
                  <a href={contenidoMain1.url} target="_blank" rel="noopener noreferrer" className="block">
                    <img 
                      src={contenidoMain1.media}
                      alt={contenidoMain1.titulo || 'Contenido destacado'}
                      className="w-full h-auto hover:opacity-90 transition-opacity duration-300"
                    />
                  </a>
                ) : (
                  <img 
                    src={contenidoMain1.media}
                    alt={contenidoMain1.titulo || 'Contenido destacado'}
                    className="w-full h-auto"
                  />
                )}
              </div>
            )}

            {/* Secciones con contenido adicional */}
            {secciones.map((seccion, index) => {
              // Después de la sección de Cultura
              if (index > 0 && secciones[index - 1].nombre === 'Cultura') {
                return (
                  <React.Fragment key={seccion.nombre}>
                    {/* Contenido Relacionado */}
                    {contenidoMain2 && (
                      <div className="w-full mb-8">
                        {contenidoMain2.url ? (
                          <a href={contenidoMain2.url} target="_blank" rel="noopener noreferrer" className="block">
                            <img 
                              src={contenidoMain2.media}
                              alt={contenidoMain2.titulo || 'Contenido destacado'}
                              className="w-full h-auto hover:opacity-90 transition-opacity duration-300"
                            />
                          </a>
                        ) : (
                          <img 
                            src={contenidoMain2.media}
                            alt={contenidoMain2.titulo || 'Contenido destacado'}
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                    )}
                    {renderSeccion(seccion.nombre)}
                  </React.Fragment>
                );
              }
              
              // Antes de la sección de Educación, mostrar el banner final
              if (seccion.nombre === 'Educación') {
                return (
                  <React.Fragment key={seccion.nombre}>
                    {/* Banner publicitario antes de Educación */}
                    {contenidoMainBg && (
                      <div className="w-full mb-8">
                        {contenidoMainBg.url ? (
                          <a href={contenidoMainBg.url} target="_blank" rel="noopener noreferrer" className="block">
                            <img 
                              src={contenidoMainBg.media}
                              alt={contenidoMainBg.titulo || 'Contenido destacado'}
                              className="w-full h-auto hover:opacity-90 transition-opacity duration-300"
                            />
                          </a>
                        ) : (
                          <img 
                            src={contenidoMainBg.media}
                            alt={contenidoMainBg.titulo || 'Contenido destacado'}
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                    )}
                    {renderSeccion(seccion.nombre)}
                  </React.Fragment>
                );
              }
              
              return renderSeccion(seccion.nombre);
            })}


          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {noticias.map(noticia => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}