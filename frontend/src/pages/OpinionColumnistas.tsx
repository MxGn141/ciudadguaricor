import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Calendar } from 'lucide-react';
import axios from 'axios';
import { createApiUrl } from '../config/api';

interface Columnista {
  id: number;
  nombre: string;
  bio: string;
  fotoUrl?: string;
}

interface Noticia {
  id: number;
  titulo: string;
  fecha_publicacion: string;
  seccion: {
    nombre: string;
  };
}

const OpinionColumnistas: React.FC = () => {
  const [columnistas, setColumnistas] = useState<Columnista[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Usar configuración centralizada de API
        let columnistasData = [];
        let noticiasData = [];
        let apiConnected = false;
        
        try {
          console.log(`Intentando conectar a API...`);
          const [columnistasRes, noticiasRes] = await Promise.all([
            axios.get(createApiUrl('/api/columnistas')),
            axios.get(createApiUrl('/api/noticias?limit=5'))
          ]);
          
          columnistasData = columnistasRes.data;
          noticiasData = noticiasRes.data;
          apiConnected = true;
          console.log('✅ API conectada exitosamente');
          console.log('📊 Columnistas cargados desde API:', columnistasData);
          console.log('📰 Noticias cargadas:', noticiasData.length);
        } catch (apiError: any) {
          console.log(`❌ Error conectando a API:`, apiError.message);
        }
        
        if (apiConnected) {
          setColumnistas(columnistasData);
          setNoticias(noticiasData);
        } else {
          throw new Error('No se pudo conectar a la API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Usando datos de fallback para columnistas');
        // Datos de ejemplo si falla la API
        setColumnistas([
          {
            id: 1,
            nombre: "María González",
            bio: "Periodista especializada en política y análisis social con más de 15 años de experiencia en medios regionales.",
            fotoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: 2,
            nombre: "Carlos Rodríguez",
            bio: "Analista económico y columnista de opinión enfocado en temas de desarrollo regional y políticas públicas.",
            fotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: 3,
            nombre: "Ana Martínez",
            bio: "Escritora y columnista cultural, especialista en literatura latinoamericana y crítica de arte contemporáneo.",
            fotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: 4,
            nombre: "Luis Herrera",
            bio: "Periodista deportivo y analista de fútbol venezolano con amplia trayectoria en medios nacionales.",
            fotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: 5,
            nombre: "Carmen Silva",
            bio: "Especialista en temas sociales y derechos humanos, columnista comprometida con la justicia social.",
            fotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
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
          <p className="text-gray-600">Cargando columnistas...</p>
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
              <User className="h-12 w-12 text-white mr-4" />
              <h1 className="text-5xl font-bold">Columnistas</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Voces expertas que aportan análisis, reflexiones y perspectivas únicas sobre la actualidad
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
            {/* Grid de Columnistas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {columnistas.map((columnista) => (
                <div key={columnista.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="p-8">
                    <Link 
                      to={`/opinion/columnistas/${columnista.id}`}
                      className="group block text-center"
                    >
                      {/* Foto del columnista */}
                      <div className="mb-6">
                        {columnista.fotoUrl ? (
                          <img 
                            src={columnista.fotoUrl} 
                            alt={columnista.nombre}
                            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-200 group-hover:border-guarico-blue transition-colors duration-300"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-guarico-blue to-blue-600 flex items-center justify-center mx-auto border-4 border-blue-200 group-hover:border-guarico-blue transition-colors duration-300">
                            <span className="text-white font-bold text-2xl">
                              {columnista.nombre.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Nombre */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-guarico-blue transition-colors duration-300">
                        {columnista.nombre}
                      </h3>

                      {/* Bio */}
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {columnista.bio}
                      </p>

                      {/* Botón de acción */}
                      <div className="inline-flex items-center px-6 py-3 bg-guarico-blue text-white rounded-lg font-medium group-hover:bg-blue-700 transition-colors duration-300">
                        <span className="mr-2">Ver columnas</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </Link>
                  </div>
                </div>
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
                {noticias.slice(0, 5).map((noticia) => (
                  <div key={noticia.id} className="border-l-4 border-guarico-blue pl-4 hover:bg-gray-50 p-3 rounded-r-lg transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-guarico-blue transition-colors cursor-pointer">
                      {noticia.titulo}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES')} • {noticia.seccion.nombre}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpinionColumnistas;
