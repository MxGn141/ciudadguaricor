import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, MessageSquare, User } from 'lucide-react';
import axios from 'axios';
import { createApiUrl } from '../config/api';

interface Editorial {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  autor?: string;
}

interface Noticia {
  id: number;
  titulo: string;
  fecha_publicacion: string;
  seccion: { nombre: string };
}

const OpinionEditoriales: React.FC = () => {
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [editorialesRes, noticiasRes] = await Promise.all([
          axios.get(createApiUrl('/api/editoriales')),
          axios.get(createApiUrl('/api/noticias?limit=5'))
        ]);
        setEditoriales(editorialesRes.data);
        setNoticias(noticiasRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Datos de ejemplo si falla la API
        setEditoriales([
          {
            id: 1,
            titulo: "Reflexiones sobre el futuro de nuestra región",
            contenido: "En estos tiempos de cambio, es fundamental que como sociedad reflexionemos sobre el rumbo que queremos tomar. La participación ciudadana y el compromiso con el desarrollo sostenible son claves para construir un mejor mañana. Necesitamos líderes visionarios que entiendan las necesidades de nuestra comunidad y trabajen incansablemente por el progreso de todos.",
            fecha: "2024-01-15",
            autor: "Redacción Editorial"
          },
          {
            id: 2,
            titulo: "La importancia de la educación en el desarrollo local",
            contenido: "La educación sigue siendo la herramienta más poderosa para transformar nuestra realidad. Invertir en educación de calidad es invertir en el futuro de nuestras comunidades. Debemos garantizar que todos los niños y jóvenes tengan acceso a una formación integral que les permita desarrollar su máximo potencial.",
            fecha: "2024-01-12",
            autor: "Redacción Editorial"
          },
          {
            id: 3,
            titulo: "Desarrollo económico y sostenibilidad ambiental",
            contenido: "El crecimiento económico debe ir de la mano con la protección del medio ambiente y la justicia social. Es posible crear empleos y generar riqueza sin comprometer los recursos naturales para las futuras generaciones. La innovación y la tecnología verde son aliados fundamentales en esta misión.",
            fecha: "2024-01-10",
            autor: "Redacción Editorial"
          },
          {
            id: 4,
            titulo: "Fortalecimiento de la democracia participativa",
            contenido: "La democracia no se limita al ejercicio del voto, sino que requiere la participación activa y constante de la ciudadanía. Es necesario crear espacios de diálogo y consulta que permitan a todos los sectores de la sociedad contribuir en la toma de decisiones que afectan su futuro.",
            fecha: "2024-01-08",
            autor: "Redacción Editorial"
          },
          {
            id: 5,
            titulo: "La cultura como motor de identidad y progreso",
            contenido: "Nuestra riqueza cultural es un patrimonio invaluable que debe ser preservado y promovido. Las tradiciones, el arte y las expresiones culturales locales no solo fortalecen nuestra identidad, sino que también pueden convertirse en motores de desarrollo económico a través del turismo cultural y las industrias creativas.",
            fecha: "2024-01-05",
            autor: "Redacción Editorial"
          }
        ]);
        setNoticias([
          {
            id: 1,
            titulo: "Análisis de la situación política actual",
            fecha_publicacion: "2024-01-15",
            seccion: { nombre: "Política" }
          },
          {
            id: 2,
            titulo: "Perspectivas económicas para el nuevo año",
            fecha_publicacion: "2024-01-14",
            seccion: { nombre: "Economía" }
          },
          {
            id: 3,
            titulo: "Iniciativas culturales en la región",
            fecha_publicacion: "2024-01-13",
            seccion: { nombre: "Cultura" }
          },
          {
            id: 4,
            titulo: "Avances en infraestructura educativa",
            fecha_publicacion: "2024-01-12",
            seccion: { nombre: "Educación" }
          },
          {
            id: 5,
            titulo: "Proyectos de desarrollo sostenible",
            fecha_publicacion: "2024-01-11",
            seccion: { nombre: "Medio Ambiente" }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-guarico-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando editoriales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-guarico-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-white mr-4" />
              <h1 className="text-5xl font-bold">Editoriales</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Análisis profundos y reflexiones editoriales sobre los temas más relevantes de nuestra región
            </p>
            <div className="mt-6">
              <Link 
                to="/opinion"
                className="inline-flex items-center text-blue-200 hover:text-white transition-colors duration-300"
              >
                ← Volver a Opinión
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Lista de Editoriales */}
            <div className="space-y-8">
              {editoriales.map((editorial, index) => (
                <article key={editorial.id} className={`bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  index === 0 ? 'transform hover:-translate-y-2' : 'hover:shadow-md'
                }`}>
                  <div className={`p-8 ${index === 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''}`}>
                    <Link 
                      to={`/opinion/editoriales/${editorial.id}`}
                      className="group block"
                    >
                      {index === 0 && (
                        <div className="inline-flex items-center px-3 py-1 bg-guarico-blue text-white text-sm font-medium rounded-full mb-4">
                          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                          Editorial Destacado
                        </div>
                      )}
                      
                      <h2 className={`font-bold text-gray-900 group-hover:text-guarico-blue transition-colors duration-300 mb-4 ${
                        index === 0 ? 'text-3xl' : 'text-2xl'
                      }`}>
                        {editorial.titulo}
                      </h2>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(editorial.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                        {editorial.autor && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{editorial.autor}</span>
                          </>
                        )}
                      </div>
                      
                      <p className={`text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors ${
                        index === 0 ? 'text-lg mb-6' : 'mb-4'
                      }`}>
                        {editorial.contenido.substring(0, index === 0 ? 300 : 200)}...
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center text-guarico-blue group-hover:text-blue-700 font-medium transition-colors">
                          <span className="mr-2">Leer editorial completo</span>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                        
                        {index === 0 && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                            <span>Destacado</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg border p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="mr-3 h-6 w-6 text-guarico-blue" />
                Minuto a Minuto
              </h3>
              <div className="space-y-6">
                {noticias.slice(0, 5).map((noticia, index) => {
                  const colors = ['border-guarico-blue', 'border-green-500', 'border-purple-500', 'border-orange-500', 'border-red-500'];
                  return (
                    <div key={noticia.id} className={`border-l-4 ${colors[index]} pl-4 hover:bg-gray-50 p-3 rounded-r-lg transition-colors`}>
                      <h4 className="font-semibold text-gray-900 mb-2 hover:text-guarico-blue transition-colors cursor-pointer">
                        {noticia.titulo}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES')} • {noticia.seccion.nombre}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Sección adicional de navegación rápida */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Navegación Rápida
              </h3>
              <div className="space-y-4">
                <Link 
                  to="/opinion" 
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <BookOpen className="h-5 w-5 text-guarico-blue mr-3" />
                  <span className="font-medium text-gray-900 group-hover:text-guarico-blue transition-colors">Opinión Principal</span>
                </Link>
                <Link 
                  to="/opinion/columnistas" 
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <User className="h-5 w-5 text-guarico-blue mr-3" />
                  <span className="font-medium text-gray-900 group-hover:text-guarico-blue transition-colors">Columnistas</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpinionEditoriales;
