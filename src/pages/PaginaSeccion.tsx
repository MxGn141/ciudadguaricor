import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useContextoNoticias } from '../contexts/ContextoNoticias';
import { Calendar, Clock } from 'lucide-react';

const seccionesValidas = ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos'];

const coloresSeccion = {
  'Nacionales': 'from-blue-600 to-blue-800',
  'Municipales': 'from-green-600 to-green-800',
  'Deportes': 'from-yellow-600 to-yellow-800',
  'Cultura': 'from-purple-600 to-purple-800',
  'Economía': 'from-emerald-600 to-emerald-800',
  'Sociales': 'from-pink-600 to-pink-800',
  'Sucesos': 'from-red-600 to-red-800'
};

export default function PaginaSeccion() {
  const { seccion } = useParams<{ seccion: string }>();
  const { obtenerNoticiasPorSeccion } = useContextoNoticias();
  
  if (!seccion || !seccionesValidas.includes(seccion)) {
    return <Navigate to="/" replace />;
  }
  
  const noticias = obtenerNoticiasPorSeccion(seccion);
  const gradienteSeccion = coloresSeccion[seccion as keyof typeof coloresSeccion] || 'from-blue-600 to-blue-800';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado de la sección */}
      <div className={`w-full bg-gradient-to-r ${gradienteSeccion} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {seccion}
            </h1>
            <p className="text-lg text-white/80">
              Las últimas noticias de {seccion.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Encabezado de la sección */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900">{seccion}</h1>
        </div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.length > 0 ? (
            noticias.map((noticia) => (
              <Link 
                key={noticia.id}
                to={`/noticia/${noticia.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={noticia.imagen} 
                    alt={noticia.titulo}
                  />
                </div>
                
                {/* Contenido */}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    <time>{new Date(noticia.fechaPublicacion).toLocaleDateString()}</time>
                  </div>
                  
                  <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {noticia.titulo}
                  </h2>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {noticia.resumen}
                  </p>

                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <time className="text-gray-500">
                        {new Date(noticia.fechaPublicacion).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                    <span className="text-gray-600">
                      {noticia.autorTexto}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600 text-lg">
                No hay noticias disponibles en la sección {seccion}
              </p>
            </div>
          )}
        </div>

        {/* Barra Lateral */}
        <aside className="hidden lg:block fixed right-4 top-[calc(var(--header-height)+2rem)] w-80">
          <div className="space-y-6">
            {/* Aquí se renderizará automáticamente la BarraLateral desde el LayoutPublico */}
          </div>
        </aside>
      </div>
    </div>
  );
}