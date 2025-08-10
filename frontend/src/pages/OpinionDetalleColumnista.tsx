import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import axios from 'axios';
import { createApiUrl } from '../config/api';

interface Opinion {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  destacado: boolean;
}

interface Columnista {
  id: number;
  nombre: string;
  bio: string;
  fotoUrl?: string;
  redes?: any;
  opiniones: Opinion[];
}

const OpinionDetalleColumnista: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [columnista, setColumnista] = React.useState<Columnista | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchColumnista = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Usar configuración centralizada de API
        let columnistaData = null;
        let apiConnected = false;
        
        try {
          console.log(`🔍 Buscando columnista en: ${createApiUrl(`/api/columnistas/${id}`)}`);
          const response = await axios.get(createApiUrl(`/api/columnistas/${id}`));
          columnistaData = response.data;
          apiConnected = true;
          console.log('✅ Columnista encontrado:', columnistaData);
        } catch (apiError: any) {
          console.log(`❌ Error en API:`, apiError.message);
        }
        
        if (apiConnected && columnistaData) {
          setColumnista(columnistaData);
        } else {
          throw new Error('No se pudo conectar a la API o el columnista no existe');
        }
        
      } catch (err: any) {
        console.error('Error cargando columnista:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchColumnista();
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">Cargando columnista...</div>;
  }
  if (error || !columnista) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">{error || 'Columnista no encontrado.'}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <Link to="/opinion/columnistas" className="inline-flex items-center text-guarico-blue mb-6 hover:underline">
        <ArrowLeft className="h-5 w-5 mr-2" /> Volver a Columnistas
      </Link>
      
      {/* Header del Columnista */}
      <div className="bg-gradient-to-r from-guarico-blue to-blue-600 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center mb-4">
          <img 
            src={columnista.fotoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} 
            alt={columnista.nombre} 
            className="w-24 h-24 rounded-full object-cover mr-6 border-4 border-white/20" 
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{columnista.nombre}</h1>
            <div className="flex items-center text-blue-100">
              <User className="h-4 w-4 mr-2" />
              <span>Columnista</span>
            </div>
          </div>
        </div>
        
        {/* Biografía */}
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-2">Biografía</h3>
          <p className="text-blue-50 leading-relaxed">{columnista.bio}</p>
        </div>
        
        {/* Redes Sociales */}
        {columnista.redes && (
          <div className="mt-4 flex items-center space-x-4">
            {columnista.redes.twitter && (
              <a href={`https://twitter.com/${columnista.redes.twitter.replace('@', '')}`} 
                 target="_blank" rel="noopener noreferrer"
                 className="text-blue-100 hover:text-white transition-colors">
                📱 {columnista.redes.twitter}
              </a>
            )}
            {columnista.redes.email && (
              <a href={`mailto:${columnista.redes.email}`}
                 className="text-blue-100 hover:text-white transition-colors">
                📧 {columnista.redes.email}
              </a>
            )}
          </div>
        )}
      </div>
      
      {/* Artículos del Columnista */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Artículos de {columnista.nombre}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({columnista.opiniones?.length || 0} {columnista.opiniones?.length === 1 ? 'artículo' : 'artículos'})
          </span>
        </h2>
        
        {columnista.opiniones && columnista.opiniones.length > 0 ? (
          <div className="space-y-6">
            {columnista.opiniones.map((opinion) => (
              <article key={opinion.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 hover:text-guarico-blue transition-colors">
                    {opinion.titulo}
                  </h3>
                  {opinion.destacado && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      Destacado
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(opinion.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {opinion.contenido.length > 300 
                      ? `${opinion.contenido.substring(0, 300)}...` 
                      : opinion.contenido
                    }
                  </p>
                </div>
                
                {opinion.contenido.length > 300 && (
                  <button className="mt-4 text-guarico-blue hover:text-blue-700 font-medium transition-colors">
                    Leer más →
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No hay artículos disponibles</h3>
            <p className="text-gray-500">Este columnista aún no ha publicado ningún artículo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpinionDetalleColumnista;
