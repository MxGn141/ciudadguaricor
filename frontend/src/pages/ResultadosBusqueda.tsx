import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { useContextoNoticias, Noticia } from '../contexts/ContextoNoticias';
import TarjetaNoticia from '../components/noticias/TarjetaNoticia';

export default function ResultadosBusqueda() {
  const [searchParams] = useSearchParams();
  const { noticias, cargandoBusqueda } = useContextoNoticias();
  const [resultados, setResultados] = useState<Noticia[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    const termino = searchParams.get('q') || '';
    setTerminoBusqueda(termino);
    
    if (termino.trim()) {
      // Buscar en título, contenido y resumen
      const resultadosFiltrados = noticias.filter(noticia => {
        const textoCompleto = `${noticia.titulo} ${noticia.contenido} ${noticia.resumen}`.toLowerCase();
        const terminoLower = termino.toLowerCase();
        return textoCompleto.includes(terminoLower);
      });
      setResultados(resultadosFiltrados);
    } else {
      setResultados([]);
    }
  }, [searchParams, noticias]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de resultados */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
           
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Resultados de búsqueda
              </h1>
              <p className="text-gray-600 mt-1">
                {cargandoBusqueda ? (
                  'Buscando...'
                ) : (
                  `${resultados.length} noticia${resultados.length !== 1 ? 's' : ''} encontrada${resultados.length !== 1 ? 's' : ''} para "${terminoBusqueda}"`
                )}
              </p>
            </div>
            <div className="flex items-center text-gray-500">
              <Search size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {cargandoBusqueda ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-guarico-blue"></div>
          </div>
        ) : resultados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((noticia) => (
              <TarjetaNoticia key={noticia.id} noticia={noticia} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron resultados
            </h2>
            <p className="text-gray-600 mb-6">
              No se encontraron noticias que coincidan con "{terminoBusqueda}"
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Sugerencias:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Verifica que las palabras estén escritas correctamente</li>
                <li>• Intenta con términos más generales</li>
                <li>• Usa menos palabras clave</li>
              </ul>
            </div>
            <Link 
              to="/" 
              className="inline-block mt-6 px-6 py-3 bg-guarico-blue text-white rounded-lg hover:bg-guarico-dark-blue transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 