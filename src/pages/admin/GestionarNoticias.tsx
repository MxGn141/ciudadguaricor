import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Star, StarOff, Image as ImageIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContextoNoticias, Noticia } from '../../contexts/ContextoNoticias';

export default function GestionarNoticias() {
  const { noticias, eliminarNoticia, editarNoticia } = useContextoNoticias();
  const [seccionFiltro, setSeccionFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [noticiaEditando, setNoticiaEditando] = useState<string | null>(null);
  const [formularioEdicion, setFormularioEdicion] = useState<Partial<Noticia>>({});
  const [mostrarEdicionCompleta, setMostrarEdicionCompleta] = useState(false);

  const noticiasFiltradas = seccionFiltro 
    ? noticias.filter(noticia => noticia.seccion === seccionFiltro)
    : noticias;
  const noticiasBuscadas = noticiasFiltradas.filter(noticia =>
    noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    noticia.autorTexto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const secciones = ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos'];

  const confirmarEliminacion = (id: string, titulo: string) => {
    if (window.confirm(`¿Está seguro de eliminar la noticia "${titulo}"?`)) {
      eliminarNoticia(id);
    }
  };

  const alternarDestacada = (id: string, destacada: boolean) => {
    editarNoticia(id, { destacada: !destacada });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestionar Noticias</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por título o autor..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <select
            value={seccionFiltro}
            onChange={(e) => setSeccionFiltro(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            <option value="">Todas las secciones</option>
            {secciones.map(seccion => (
              <option key={seccion} value={seccion}>{seccion}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {noticiasBuscadas.map((noticia) => (
                <tr key={noticia.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {noticia.imagen && (
                        <img 
                          src={noticia.imagen} 
                          alt={noticia.titulo} 
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                        {noticia.titulo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {noticia.seccion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {noticia.autorTexto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      noticia.destacada 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {noticia.destacada ? 'Destacada' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => alternarDestacada(noticia.id, noticia.destacada || false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title={noticia.destacada ? "Quitar destacada" : "Marcar como destacada"}
                      >
                        {noticia.destacada ? (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Star className="h-5 w-5 text-yellow-400" />
                        )}
                      </button>
                      <Link
                        to={`/noticias/${noticia.id}`}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Ver noticia"
                      >
                        <Eye className="h-5 w-5 text-blue-500" />
                      </Link>
                      <button
                        onClick={() => confirmarEliminacion(noticia.id, noticia.titulo)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        title="Eliminar noticia"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {noticiasBuscadas.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron noticias</h3>
            <p className="text-gray-500">
              {busqueda || seccionFiltro 
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando una nueva noticia"}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <p className="text-sm text-gray-600">
          Total: {noticiasBuscadas.length} {noticiasBuscadas.length === 1 ? 'noticia' : 'noticias'}
        </p>
      </div>
    </div>
  );
}