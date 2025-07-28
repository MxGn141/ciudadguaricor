import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContextoNoticias, Noticia } from '../contexts/ContextoNoticias';
import { useContextoContenido } from '../contexts/ContextoContenido';
import TarjetaNoticia from '../components/noticias/TarjetaNoticia';

const secciones = [
  { nombre: 'Nacionales', color: 'bg-blue-600', limite: 3 },
  { nombre: 'Municipales', color: 'bg-green-600', limite: 3 },
  { nombre: 'Deportes', color: 'bg-yellow-600', limite: 3 },
  { nombre: 'Cultura', color: 'bg-purple-600', limite: 3 },
  { nombre: 'Produccion', color: 'bg-emerald-600', limite: 3 },
  { nombre: 'Comunidad', color: 'bg-pink-600', limite: 3 },
  { nombre: 'Seguridad', color: 'bg-red-600', limite: 3 },
  { nombre: 'Turismo', color: 'bg-cyan-600', limite: 3 }
];

// Paleta de colores para cada sección (igual que en PaginaSeccion)
const coloresSeccion = {
  'Nacionales': 'bg-blue-600 text-white',
  'Municipales': 'bg-green-600 text-white',
  'Deportes': 'bg-yellow-500 text-gray-900',
  'Cultura': 'bg-purple-600 text-white',
  'Produccion': 'bg-emerald-600 text-white',
  'Comunidad': 'bg-pink-600 text-white',
  'Seguridad': 'bg-red-600 text-white',
  'Turismo': 'bg-cyan-600 text-white'
};

export default function PaginaPrincipal() {
  const [noticiasPorSeccion, setNoticiasPorSeccion] = useState<Record<string, Noticia[]>>({});
  const [todasLasNoticias, setTodasLasNoticias] = useState<Noticia[]>([]);
  const [noticiasDestacadas, setNoticiasDestacadas] = useState<Noticia[]>([]);
  const { obtenerNoticiasPorSeccion, noticias, cargandoBusqueda, publicidades } = useContextoNoticias();
  const { contenidoInicio, contenidoInicioBack, contenidoInicio2 } = useContextoContenido();
  const [noticiaActual, setNoticiaActual] = useState(0);

  // Filtrar banners por posición
  const bannerMain1 = publicidades.find(pub => pub.posicion === 'main-1');
  const bannerMain2 = publicidades.find(pub => pub.posicion === 'main-2');
  const bannerMainBg = publicidades.find(pub => pub.posicion === 'main-bg');

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
    // Procesar todas las noticias para obtener las más nuevas y destacadas
    if (noticias.length > 0) {
      console.log('Noticias cargadas:', noticias.length);
      console.log('Primeras 3 noticias:', noticias.slice(0, 3).map(n => ({ id: n.id, titulo: n.titulo, fecha: n.fecha_publicacion })));
      
      // Ordenar por fecha de publicación (más nuevas primero)
      const noticiasOrdenadas = [...noticias].sort((a, b) => 
        convertirFecha(b.fecha_publicacion).getTime() - convertirFecha(a.fecha_publicacion).getTime()
      );
      
      setTodasLasNoticias(noticiasOrdenadas);
      
      // Obtener noticias destacadas
      const destacadas = noticiasOrdenadas.filter(noticia => noticia.destacada).slice(0, 3);
      setNoticiasDestacadas(destacadas);
      
      // Reiniciar el índice del carrusel cuando cambien las noticias
      setNoticiaActual(0);
    }
  }, [noticias]);

  const cargarNoticiasPorSeccion = async () => {
    const secciones = ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Produccion', 'Comunidad', 'Seguridad', 'Turismo'];
    const noticiasTemp: Record<string, Noticia[]> = {};
    
    for (const seccion of secciones) {
      const noticias = await obtenerNoticiasPorSeccion(seccion);
      noticiasTemp[seccion] = noticias;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticiasSeccion.map((noticia) => (
            <TarjetaNoticia key={noticia.id} noticia={noticia} />
          ))}
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
            {bannerMain1 && (
              <article className="w-full mb-8 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {bannerMain1.url ? (
                  <a href={bannerMain1.url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={bannerMain1.imagen}
                      alt={bannerMain1.descripcion || 'Banner publicitario'}
                      className="w-full h-60 object-cover"
                    />
                  </a>
                ) : (
                  <img 
                    src={bannerMain1.imagen}
                    alt={bannerMain1.descripcion || 'Banner publicitario'}
                    className="w-full h-60 object-cover"
                  />
                )}
              </article>
            )}

            {/* Secciones con contenido adicional */}
            {secciones.map((seccion, index) => {
              // Después de la sección de Cultura
              if (index > 0 && secciones[index - 1].nombre === 'Cultura') {
                return (
                  <React.Fragment key={seccion.nombre}>
                    {/* Contenido Relacionado */}
                    {bannerMain2 && (
                      <article className="w-full mb-8 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        {bannerMain2.url ? (
                          <a href={bannerMain2.url} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={bannerMain2.imagen}
                              alt={bannerMain2.descripcion || 'Banner publicitario'}
                              className="w-full h-60 object-cover"
                            />
                          </a>
                        ) : (
                          <img 
                            src={bannerMain2.imagen}
                            alt={bannerMain2.descripcion || 'Banner publicitario'}
                            className="w-full h-60 object-cover"
                          />
                        )}
                      </article>
                    )}
                    {renderSeccion(seccion.nombre)}
                  </React.Fragment>
                );
              }
              return renderSeccion(seccion.nombre);
            })}

            {/* Banner publicitario final */}
            {bannerMainBg && (
              <div className="w-full mt-8 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {bannerMainBg.url ? (
                  <a href={bannerMainBg.url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={bannerMainBg.imagen}
                      alt={bannerMainBg.descripcion || 'Banner publicitario'}
                      className="w-full h-60 object-cover"
                    />
                  </a>
                ) : (
                  <img 
                    src={bannerMainBg.imagen}
                    alt={bannerMainBg.descripcion || 'Banner publicitario'}
                    className="w-full h-60 object-cover"
                  />
                )}
              </div>
            )}
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