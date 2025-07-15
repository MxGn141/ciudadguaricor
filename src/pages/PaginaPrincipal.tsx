import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useContextoNoticias } from '../contexts/ContextoNoticias';
import BarraLateral from '../components/comunes/BarraLateral';

const secciones = [
  { nombre: 'Nacionales', color: 'bg-blue-500', limite: 3 },
  { nombre: 'Municipales', color: 'bg-green-500', limite: 3 },
  { nombre: 'DEPORTES', color: 'bg-red-500', limite: 3 },
  { nombre: 'Cultura', color: 'bg-purple-500', limite: 3 },
  { nombre: 'Economía', color: 'bg-yellow-500', limite: 3 },
  { nombre: 'Sociales', color: 'bg-pink-500', limite: 3 },
  { nombre: 'Sucesos', color: 'bg-gray-600', limite: 3 }
];

export default function PaginaPrincipal() {
  const { noticias, obtenerNoticiasPorSeccion } = useContextoNoticias();

  // Obtener la noticia principal (más reciente)
  const noticiaPrincipal = noticias[0];
  
  // Obtener noticias secundarias (siguientes 3)
  const noticiasSecundarias = noticias.slice(1, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Home className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-red-600 font-medium">MÁS NOTICIAS</span>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Noticia principal + secundarias */}
            {noticiaPrincipal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Noticia principal */}
                <div className="md:col-span-1">
                  <Link to={`/noticia/${noticiaPrincipal.id}`} className="block group">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={noticiaPrincipal.imagen}
                        alt={noticiaPrincipal.titulo}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-red-300 transition-colors">
                          {noticiaPrincipal.titulo}
                        </h2>
                        <p className="text-sm opacity-90 mb-2">{noticiaPrincipal.resumen}</p>
                        <div className="text-xs opacity-75">
                          {noticiaPrincipal.fechaPublicacion.toLocaleDateString('es-ES')} | 
                          Diario Ciudad Guárico
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Noticias secundarias */}
                <div className="md:col-span-1 space-y-4">
                  {noticiasSecundarias.map((noticia) => (
                    <Link key={noticia.id} to={`/noticia/${noticia.id}`} className="block group">
                      <div className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={noticia.imagen}
                          alt={noticia.titulo}
                          className="w-24 h-20 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {noticia.titulo}
                          </h3>
                          <div className="text-xs text-gray-500">
                            {noticia.fechaPublicacion.toLocaleDateString('es-ES')} | 
                            Diario Ciudad Guárico
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Secciones */}
            {secciones.map((seccion) => {
              const noticiasSeccion = obtenerNoticiasPorSeccion(seccion.nombre, seccion.limite);
              
              if (noticiasSeccion.length === 0) return null;
              
              return (
                <section key={seccion.nombre} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-bold text-white px-4 py-2 ${seccion.color} inline-block`}>
                      {seccion.nombre}
                    </h2>
                    <Link 
                      to={`/seccion/${seccion.nombre}`}
                      className="bg-purple-500 text-white px-4 py-1 text-sm rounded hover:bg-purple-600 transition-colors"
                    >
                      VER MÁS
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {noticiasSeccion.map((noticia) => (
                      <div key={noticia.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <Link to={`/noticia/${noticia.id}`} className="block group">
                          <img
                            src={noticia.imagen}
                            alt={noticia.titulo}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {noticia.titulo}
                            </h3>
                            <div className="text-xs text-gray-500 mb-2">
                              {noticia.fechaPublicacion.toLocaleDateString('es-ES')} | 
                              {noticia.fechaPublicacion.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{noticia.resumen}</p>
                            <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                              Diario Ciudad Guárico
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar derecho */}
          <div className="lg:col-span-1">
            <BarraLateral />
          </div>
        </div>
      </main>
    </div>
  );
}