import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Newspaper, Filter, Search } from 'lucide-react';
import BarraLateral from '../components/comunes/BarraLateral';
import axios from 'axios';

interface Editorial {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  autor?: string;
}

const OpinionEditoriales: React.FC = () => {
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [editorialesFiltrados, setEditorialesFiltrados] = useState<Editorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [ordenPor, setOrdenPor] = useState<'fecha' | 'titulo'>('fecha');

  useEffect(() => {
    const fetchEditoriales = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/editoriales');
        setEditoriales(response.data);
        setEditorialesFiltrados(response.data);
      } catch (error) {
        console.error('Error fetching editoriales:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEditoriales();
  }, []);

  useEffect(() => {
    let filtrados = [...editoriales];

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      filtrados = filtrados.filter(editorial =>
        editorial.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        editorial.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
        (editorial.autor && editorial.autor.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    // Ordenar
    filtrados.sort((a, b) => {
      if (ordenPor === 'fecha') {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      } else {
        return a.titulo.localeCompare(b.titulo);
      }
    });

    setEditorialesFiltrados(filtrados);
  }, [editoriales, busqueda, ordenPor]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncarTexto = (texto: string, limite: number) => {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-guarico-green mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando editoriales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-guarico-gold to-yellow-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Newspaper className="h-12 w-12 text-white mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Editoriales</h1>
            </div>
            <p className="text-lg md:text-xl text-yellow-100 max-w-2xl mx-auto">
              La voz institucional de Ciudad Guárico. Análisis y posiciones sobre los temas más relevantes.
            </p>
            <div className="mt-6">
              <Link 
                to="/opinion"
                className="inline-flex items-center text-yellow-200 hover:text-white transition-colors duration-300"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Volver a Opinión
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          {/* Controles de búsqueda y filtros */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar en editoriales..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-gold focus:border-guarico-gold transition-colors duration-300"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={ordenPor}
                    onChange={(e) => setOrdenPor(e.target.value as 'fecha' | 'titulo')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-gold focus:border-guarico-gold"
                  >
                    <option value="fecha">Más recientes</option>
                    <option value="titulo">Por título</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  {editorialesFiltrados.length} editorial{editorialesFiltrados.length !== 1 ? 'es' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Editorial destacado */}
          {editorialesFiltrados.length > 0 && (
            <div className="mb-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-guarico-green to-green-600 px-8 py-6">
                  <div className="flex items-center">
                    <Newspaper className="h-8 w-8 text-white mr-3" />
                    <h2 className="text-2xl font-bold text-white">Editorial Destacado</h2>
                  </div>
                </div>
                <div className="p-8">
                  <Link 
                    to={`/opinion/editorial/${editorialesFiltrados[0].id}`}
                    className="group block"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-guarico-green transition-colors duration-300">
                      {editorialesFiltrados[0].titulo}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {truncarTexto(editorialesFiltrados[0].contenido.replace(/<[^>]*>/g, ''), 300)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatearFecha(editorialesFiltrados[0].fecha)}</span>
                        {editorialesFiltrados[0].autor && (
                          <>
                            <User className="h-4 w-4 ml-4 mr-2" />
                            <span>{editorialesFiltrados[0].autor}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-guarico-green font-semibold group-hover:text-guarico-gold transition-colors duration-300">
                        <span className="mr-2">Leer editorial completo</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Lista de editoriales */}
          {editorialesFiltrados.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {editorialesFiltrados.slice(1).map((editorial) => (
                <article key={editorial.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <Link 
                      to={`/opinion/editorial/${editorial.id}`}
                      className="group block"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-guarico-green transition-colors duration-300 line-clamp-2">
                        {editorial.titulo}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed">
                        {truncarTexto(editorial.contenido.replace(/<[^>]*>/g, ''), 150)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatearFecha(editorial.fecha)}</span>
                        </div>
                        {editorial.autor && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{editorial.autor}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-guarico-green font-medium group-hover:text-guarico-gold transition-colors duration-300">
                        <span className="mr-2">Leer más</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : editorialesFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron editoriales</h3>
              <p className="text-gray-500">
                {busqueda ? 'Intenta con otros términos de búsqueda' : 'Aún no hay editoriales publicados'}
              </p>
            </div>
          ) : null}
        </div>

        {/* Sidebar derecho: minuto a minuto y publicidades */}
        <aside className="hidden lg:block lg:col-span-1">
          <BarraLateral />
        </aside>
      </div>
    </div>
  );
};

export default OpinionEditoriales;
