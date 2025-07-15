import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
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
    alert('Publicidad agregada exitosamente');
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
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Gestionar Publicidad</h2>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span className="text-sm text-gray-600">Total: {publicidadesBuscadas.length} publicidades</span>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por título..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <select
            value={tipoFiltro}
            onChange={e => setTipoFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="sidebar">Sidebar</option>
            <option value="carrusel">Carrusel Superior</option>
          </select>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Nueva Publicidad</h3>
          <form onSubmit={manejarSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formulario.titulo}
                  onChange={manejarCambio}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nombre del anunciante"
                />
              </div>
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Publicidad *
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

            <div>
              <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen *
              </label>
              <input
                type="url"
                id="imagen"
                name="imagen"
                value={formulario.imagen}
                onChange={manejarCambio}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>

            <div>
              <label htmlFor="enlace" className="block text-sm font-medium text-gray-700 mb-2">
                Enlace (opcional)
              </label>
              <input
                type="url"
                id="enlace"
                name="enlace"
                value={formulario.enlace}
                onChange={manejarCambio}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://ejemplo.com"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 text-white px-4 py-2">
            <h3 className="font-semibold">Publicidad del Sidebar (Máximo 6)</h3>
          </div>
          <div className="p-4 space-y-4">
            {publicidadesBuscadas.filter(pub => pub.tipo === 'sidebar').slice(0, 6).map((pub) => (
              <div key={pub.id} className="border rounded-lg overflow-hidden">
                <img
                  src={pub.imagen}
                  alt={pub.titulo}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-sm">{pub.titulo}</span>
                    {pub.enlace && (
                      <p className="text-xs text-gray-500 truncate">{pub.enlace}</p>
                    )}
                  </div>
                  <button
                    onClick={() => confirmarEliminacion(pub.id, pub.titulo)}
                    className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {publicidadesBuscadas.filter(pub => pub.tipo === 'sidebar').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay publicidades en el sidebar</p>
              </div>
            )}
            {publicidadesBuscadas.filter(pub => pub.tipo === 'sidebar').length < 6 && (
              <div className="text-center py-4 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p>Espacios disponibles: {6 - publicidadesBuscadas.filter(pub => pub.tipo === 'sidebar').length}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2">
            <h3 className="font-semibold">Publicidad del Carrusel</h3>
          </div>
          <div className="p-4 space-y-4">
            {publicidadesBuscadas.filter(pub => pub.tipo === 'carrusel').map((pub) => (
              <div key={pub.id} className="border rounded-lg overflow-hidden">
                <img
                  src={pub.imagen}
                  alt={pub.titulo}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 flex justify-between items-center">
                  <span className="font-medium">{pub.titulo}</span>
                  <button
                    onClick={() => confirmarEliminacion(pub.id, pub.titulo)}
                    className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}