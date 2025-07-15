import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useContextoNoticias } from '../contexts/ContextoNoticias';
import TarjetaNoticia from '../components/noticias/TarjetaNoticia';

const seccionesValidas = ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos'];

export default function PaginaSeccion() {
  const { seccion } = useParams<{ seccion: string }>();
  const { obtenerNoticiasPorSeccion } = useContextoNoticias();
  
  if (!seccion || !seccionesValidas.includes(seccion)) {
    return <Navigate to="/" replace />;
  }
  
  const noticias = obtenerNoticiasPorSeccion(seccion);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {seccion}
          </h1>
          <div className="h-1 w-20 bg-red-600"></div>
        </div>
        
        {noticias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}