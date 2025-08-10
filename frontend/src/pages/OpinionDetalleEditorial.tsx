import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';
import axios from 'axios';
import { createApiUrl } from '../config/api';

interface Editorial {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  autor?: string;
}

const OpinionDetalleEditorial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [editorial, setEditorial] = React.useState<Editorial | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEditorial = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Usar configuración centralizada de API
        let editorialData = null;
        let apiConnected = false;
        
        try {
          console.log(`🔍 Buscando editorial en: ${createApiUrl(`/api/editoriales/${id}`)}`);
          const response = await axios.get(createApiUrl(`/api/editoriales/${id}`));
          editorialData = response.data;
          apiConnected = true;
          console.log('✅ Editorial encontrado:', editorialData);
        } catch (apiError: any) {
          console.log(`❌ Error en API:`, apiError.message);
        }
        
        if (apiConnected && editorialData) {
          setEditorial(editorialData);
        } else {
          throw new Error('No se pudo conectar a la API o el editorial no existe');
        }
        
      } catch (err: any) {
        console.error('Error cargando editorial:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEditorial();
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">Cargando editorial...</div>;
  }
  if (error || !editorial) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">{error || 'Editorial no encontrado.'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link to="/opinion/editoriales" className="inline-flex items-center text-guarico-blue mb-6 hover:underline">
        <ArrowLeft className="h-5 w-5 mr-2" /> Volver a Editoriales
      </Link>
      
      {/* Header del Editorial */}
      <div className="bg-gradient-to-r from-guarico-blue to-blue-600 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center text-blue-100 mb-2">
              <span className="text-sm font-medium">EDITORIAL</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight">{editorial.titulo}</h1>
          </div>
        </div>
        
        {/* Metadatos */}
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(editorial.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {editorial.autor && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{editorial.autor}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenido del Editorial */}
      <article className="bg-white rounded-lg shadow-lg p-8">
        <div className="prose prose-lg max-w-none">
          {editorial.contenido.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-6 text-justify">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Footer del Editorial */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Publicado el {new Date(editorial.fecha).toLocaleDateString('es-ES')}
              {editorial.autor && ` por ${editorial.autor}`}
            </div>
            <div className="text-sm text-guarico-blue font-medium">
              Diario Ciudad Guárico
            </div>
          </div>
        </div>
      </article>
      
      {/* Navegación relacionada */}
      <div className="mt-8 text-center">
        <Link 
          to="/opinion/editoriales" 
          className="inline-flex items-center px-6 py-3 bg-guarico-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Ver más editoriales
        </Link>
      </div>
    </div>
  );
};

export default OpinionDetalleEditorial;
