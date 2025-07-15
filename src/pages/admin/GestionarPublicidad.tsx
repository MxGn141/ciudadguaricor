import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Search, X } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function GestionarPublicidad() {
  const { publicidades, agregarPublicidad, eliminarPublicidad } = useContextoNoticias();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({
    titulo: '',
    imagen: '',
    enlace: '',
    tipo: 'sidebar' as 'carrusel' | 'sidebar'
  });
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formulario.titulo || !formulario.imagen) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    agregarPublicidad(formulario);
    
    setFormulario({
      titulo: '',
      imagen: '',
      enlace: '',
      tipo: 'sidebar'
    });
    
    setMostrarFormulario(false);
  };

  const confirmarEliminacion = (id: string, titulo: string) => {
    if (window.confirm(`¿Está seguro de eliminar la publicidad "${titulo}"?`)) {
      eliminarPublicidad(id);
    }
  };

  const publicidadesFiltradas = tipoFiltro
    ? publicidades.filter(pub => pub.tipo === tipoFiltro)
    : publicidades;
  const publicidadesBuscadas = publicidadesFiltradas.filter(pub =>
    pub.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestionar Publicidad</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por título..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <select
            value={tipoFiltro}
            onChange={e => setTipoFiltro(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            <option value="">Todos los tipos</option>
            <option value="sidebar">Sidebar</option>
            <option value="carrusel">Carrusel Superior</option>
          </select>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Nueva Publicidad
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publicidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enlace</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publicidadesBuscadas.map((publicidad) => (
                <tr key={publicidad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={publicidad.imagen} 
                        alt={publicidad.titulo} 
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                      <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                        {publicidad.titulo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      publicidad.tipo === 'carrusel' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {publicidad.tipo === 'carrusel' ? 'Carrusel Superior' : 'Sidebar'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {publicidad.enlace ? (
                      <a 
                        href={publicidad.enlace} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {publicidad.enlace}
                      </a>
                    ) : (
                      <span className="text-gray-400">Sin enlace</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => confirmarEliminacion(publicidad.id, publicidad.titulo)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      title="Eliminar publicidad"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {publicidadesBuscadas.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron publicidades</h3>
            <p className="text-gray-500">
              {busqueda || tipoFiltro 
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando una nueva publicidad"}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <p className="text-sm text-gray-600">
          Total: {publicidadesBuscadas.length} {publicidadesBuscadas.length === 1 ? 'publicidad' : 'publicidades'}
        </p>
      </div>

      {/* Modal de nueva publicidad */}
      {mostrarFormulario && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={() => setMostrarFormulario(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={manejarSubmit} className="bg-white px-4 pb-4 pt-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Nueva Publicidad</h3>
                    <button
                      type="button"
                      onClick={() => setMostrarFormulario(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                        Título *
                      </label>
                      <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formulario.titulo}
                        onChange={manejarCambio}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
                        URL de la imagen *
                      </label>
                      <input
                        type="url"
                        id="imagen"
                        name="imagen"
                        value={formulario.imagen}
                        onChange={manejarCambio}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="enlace" className="block text-sm font-medium text-gray-700 mb-1">
                        Enlace
                      </label>
                      <input
                        type="url"
                        id="enlace"
                        name="enlace"
                        value={formulario.enlace}
                        onChange={manejarCambio}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select
                        id="tipo"
                        name="tipo"
                        value={formulario.tipo}
                        onChange={manejarCambio}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="sidebar">Sidebar</option>
                        <option value="carrusel">Carrusel Superior</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setMostrarFormulario(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}