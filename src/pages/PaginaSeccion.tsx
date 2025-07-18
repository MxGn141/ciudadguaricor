import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useContextoNoticias } from '../contexts/ContextoNoticias';
import TarjetaNoticia from '../components/noticias/TarjetaNoticia';
import { ArrowLeft } from 'lucide-react';

const seccionesValidas = ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos'];

const coloresSeccion = {
  'Nacionales': 'bg-guarico-blue',
  'Municipales': 'bg-guarico-green',
  'Deportes': 'bg-guarico-gold',
  'Cultura': 'bg-guarico-blue',
  'Economía': 'bg-guarico-green',
  'Sociales': 'bg-guarico-gold',
  'Sucesos': 'bg-guarico-blue'
};

export default function PaginaSeccion() {
  const { seccion } = useParams<{ seccion: string }>();
  const { obtenerNoticiasPorSeccion } = useContextoNoticias();
  
  if (!seccion || !seccionesValidas.includes(seccion)) {
    return <Navigate to="/" replace />;
  }
  
  const noticias = obtenerNoticiasPorSeccion(seccion);
  const colorSeccion = coloresSeccion[seccion as keyof typeof coloresSeccion] || 'bg-guarico-blue';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <Link 
              to="/" 
              className="inline-flex items-center text-guarico-blue hover:text-guarico-light-blue mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver al inicio
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-8">
                <h1 className={`text-3xl md:text-4xl font-bold text-white px-6 py-3 ${colorSeccion} rounded-lg inline-block`}>
                  {seccion}
                </h1>
              </div>
              
              {noticias.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {noticias.map((noticia) => (
                    <TarjetaNoticia key={noticia.id} noticia={noticia} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No hay noticias disponibles en la sección {seccion}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Barra Lateral */}
          <aside className="w-full md:w-80 shrink-0 order-2 md:order-none">
            <div className="sticky top-[calc(var(--header-height)+1rem)] space-y-6">
              {/* Aquí se renderizará automáticamente la BarraLateral desde el LayoutPublico */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}