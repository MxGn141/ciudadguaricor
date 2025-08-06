import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowRight, Users, Search, Filter, Mail, Globe } from 'lucide-react';
import axios from 'axios';

interface Columnista {
  id: number;
  nombre: string;
  bio: string;
  fotoUrl?: string;
  redes?: {
    twitter?: string;
    instagram?: string;
    email?: string;
    website?: string;
  };
}

const OpinionColumnistas: React.FC = () => {
  const [columnistas, setColumnistas] = useState<Columnista[]>([]);
  const [columnistasFiltrados, setColumnistasFiltrados] = useState<Columnista[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [ordenPor, setOrdenPor] = useState<'nombre' | 'reciente'>('nombre');

  useEffect(() => {
    const fetchColumnistas = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/columnistas');
        setColumnistas(response.data);
        setColumnistasFiltrados(response.data);
      } catch (error) {
        console.error('Error fetching columnistas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchColumnistas();
  }, []);

  useEffect(() => {
    let filtrados = [...columnistas];

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      filtrados = filtrados.filter(columnista =>
        columnista.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        columnista.bio.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Ordenar
    filtrados.sort((a, b) => {
      if (ordenPor === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      } else {
        // Por ahora ordenamos por nombre si no hay fecha de creación
        return a.nombre.localeCompare(b.nombre);
      }
    });

    setColumnistasFiltrados(filtrados);
  }, [columnistas, busqueda, ordenPor]);

  const truncarTexto = (texto: string, limite: number) => {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando columnistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-white mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Columnistas</h1>
            </div>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Voces expertas que aportan análisis, reflexiones y perspectivas únicas sobre la actualidad.
            </p>
            <div className="mt-6">
              <Link 
                to="/opinion"
                className="inline-flex items-center text-blue-200 hover:text-white transition-colors duration-300"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Volver a Opinión
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controles de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar columnistas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={ordenPor}
                  onChange={(e) => setOrdenPor(e.target.value as 'nombre' | 'reciente')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="nombre">Por nombre</option>
                  <option value="reciente">Más recientes</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {columnistasFiltrados.length} columnista{columnistasFiltrados.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de columnistas */}
        {columnistasFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {columnistasFiltrados.map((columnista) => (
              <div key={columnista.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <Link 
                    to={`/opinion/columnista/${columnista.id}`}
                    className="group block text-center"
                  >
                    {/* Foto del columnista */}
                    <div className="mb-4">
                      {columnista.fotoUrl ? (
                        <img 
                          src={columnista.fotoUrl} 
                          alt={columnista.nombre}
                          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-200 group-hover:border-blue-400 transition-colors duration-300"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto border-4 border-blue-200 group-hover:border-blue-400 transition-colors duration-300">
                          <User className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Nombre */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {columnista.nombre}
                    </h3>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                      {truncarTexto(columnista.bio, 120)}
                    </p>

                    {/* Botón de acción */}
                    <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                      <span className="mr-2">Ver columnas</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>

                  {/* Redes sociales */}
                  {columnista.redes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-center space-x-3">
                        {columnista.redes.email && (
                          <a 
                            href={`mailto:${columnista.redes.email}`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                        {columnista.redes.website && (
                          <a 
                            href={columnista.redes.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                            title="Sitio web"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                        {columnista.redes.twitter && (
                          <a 
                            href={`https://twitter.com/${columnista.redes.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                            title="Twitter"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                        {columnista.redes.instagram && (
                          <a 
                            href={`https://instagram.com/${columnista.redes.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                            title="Instagram"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-4.262 1.781c-1.297 0-2.345 1.048-2.345 2.345s1.048 2.345 2.345 2.345 2.345-1.048 2.345-2.345-1.048-2.345-2.345-2.345z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron columnistas</h3>
            <p className="text-gray-500">
              {busqueda ? 'Intenta con otros términos de búsqueda' : 'Aún no hay columnistas registrados'}
            </p>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default OpinionColumnistas;
