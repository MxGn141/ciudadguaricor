import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Quote, Newspaper, Users } from 'lucide-react';
import axios from 'axios';

interface Editorial {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  autor?: string;
}

interface Columnista {
  id: number;
  nombre: string;
  bio: string;
  fotoUrl?: string;
}

interface Opinion {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  columnista: Columnista;
  destacado: boolean;
}

const OpinionPage: React.FC = () => {
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [columnistas, setColumnistas] = useState<Columnista[]>([]);
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [edRes, colRes, opRes] = await Promise.all([
          axios.get('/api/editoriales'),
          axios.get('/api/columnistas'),
          axios.get('/api/opiniones')
        ]);
        setEditoriales(edRes.data);
        setColumnistas(colRes.data);
        setOpiniones(opRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

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
          <p className="text-gray-600">Cargando contenido de opinión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-guarico-green to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Quote className="h-12 w-12 text-guarico-gold mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold">Opinión</h1>
            </div>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Voces autorizadas, análisis profundo y perspectivas que enriquecen el debate público
            </p>
            <div className="flex items-center justify-center mt-8 space-x-8 text-green-200">
              <div className="flex items-center">
                <Newspaper className="h-5 w-5 mr-2" />
                <span>Editoriales</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Columnistas</span>
              </div>
              <div className="flex items-center">
                <Quote className="h-5 w-5 mr-2" />
                <span>Columnas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editorial destacado a la izquierda (en mobile arriba) */}
          <section className="lg:col-span-2 flex flex-col gap-8">
            {editoriales.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-guarico-gold to-yellow-500 px-8 py-6">
                  <div className="flex items-center">
                    <Newspaper className="h-8 w-8 text-white mr-3" />
                    <h2 className="text-3xl font-bold text-white">Editorial Destacado</h2>
                  </div>
                </div>
                <div className="p-8">
                  <Link 
                    to={`/opinion/editorial/${editoriales[0].id}`}
                    className="group block"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-guarico-green transition-colors duration-300">
                      {editoriales[0].titulo}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {truncarTexto(editoriales[0].contenido.replace(/<[^>]*>/g, ''), 200)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatearFecha(editoriales[0].fecha)}</span>
                        {editoriales[0].autor && (
                          <>
                            <User className="h-4 w-4 ml-4 mr-2" />
                            <span>{editoriales[0].autor}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-guarico-green font-semibold group-hover:text-guarico-gold transition-colors duration-300">
                        <span className="mr-2">Leer editorial</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                  <div className="mt-6">
                    <Link to="/opinion/editoriales" className="inline-block px-6 py-2 rounded-lg bg-guarico-gold text-black font-semibold hover:bg-yellow-400 transition">Más editoriales</Link>
                  </div>
                </div>
              </div>
            )}
            {/* Aquí podrías poner columnas destacadas o recientes si lo deseas en el futuro */}
          </section>
          {/* Columnistas Destacados */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-white mr-2" />
                    <h2 className="text-xl font-bold text-white">Columnistas</h2>
                  </div>
                  <Link 
                    to="/opinion/columnistas"
                    className="text-blue-200 hover:text-white transition-colors duration-300 text-sm font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {columnistas.slice(0, 6).map(columnista => (
                    <Link 
                      key={columnista.id}
                      to={`/opinion/columnista/${columnista.id}`}
                      className="group flex items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-blue-200"
                    >
                      <div className="flex-shrink-0 mr-4">
                        {columnista.fotoUrl ? (
                          <img 
                            src={columnista.fotoUrl} 
                            alt={columnista.nombre}
                            className="w-16 h-16 rounded-full object-cover border-3 border-blue-200 group-hover:border-blue-400 transition-colors duration-300"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {columnista.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {truncarTexto(columnista.bio, 80)}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/opinion/columnistas" className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Más columnistas</Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {opiniones.filter(op => op.destacado).slice(0, 4).map(opinion => (
                    <article key={opinion.id} className="group">
                      <Link 
                        to={`/opinion/columnista/${opinion.columnista.id}`}
                        className="block p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-purple-200"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                          {opinion.titulo}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {truncarTexto(opinion.contenido.replace(/<[^>]*>/g, ''), 150)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span className="font-medium">{opinion.columnista.nombre}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatearFecha(opinion.fecha)}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors duration-300">
                            <span className="mr-1">Ver columnista</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>


      </div>
    </div>
  );
};

export default OpinionPage;
