import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, Star, StarOff, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContextoNoticias, Noticia } from '../../contexts/ContextoNoticias';
import ReactDOM from 'react-dom';

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

  const iniciarEdicion = (noticia: Noticia) => {
    setNoticiaEditando(noticia.id);
    setFormularioEdicion(noticia);
    setMostrarEdicionCompleta(true);
  };

  const cancelarEdicion = () => {
    setNoticiaEditando(null);
    setFormularioEdicion({});
    setMostrarEdicionCompleta(false);
  };

  const guardarEdicion = () => {
    if (noticiaEditando && formularioEdicion) {
      editarNoticia(noticiaEditando, formularioEdicion);
      setNoticiaEditando(null);
      setFormularioEdicion({});
      setMostrarEdicionCompleta(false);
      // Aquí se puede mostrar un toast en vez de alert
      alert('Noticia actualizada exitosamente');
    }
  };

  const manejarCambioEdicion = (campo: keyof Noticia, valor: any) => {
    setFormularioEdicion(prev => ({ ...prev, [campo]: valor }));
  };

  // Evita el scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (mostrarEdicionCompleta) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mostrarEdicionCompleta]);

  // Modal de edición sobre la tabla, no sobre toda la pantalla
  const modalEdicion = mostrarEdicionCompleta ? (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.25)' }}
      onClick={cancelarEdicion}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl p-4 sm:p-6 w-full max-w-md mx-auto animate-modal-pop"
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Editar Noticia</h3>
        <div className="space-y-4">
              <input
                type="text"
                value={formularioEdicion.titulo || ''}
                onChange={e => manejarCambioEdicion('titulo', e.target.value)}
                placeholder="Título"
                className="w-full px-3 py-2 border rounded"
                maxLength={150}
                required
              />
              <select
                value={formularioEdicion.seccion || ''}
                onChange={e => manejarCambioEdicion('seccion', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              >
                {secciones.map(seccion => (
                  <option key={seccion} value={seccion}>{seccion}</option>
                ))}
              </select>
              <input
                type="url"
                value={formularioEdicion.imagen || ''}
                onChange={e => manejarCambioEdicion('imagen', e.target.value)}
                placeholder="URL de la imagen"
                className="w-full px-3 py-2 border rounded"
              />
              {formularioEdicion.imagen && (
                <img src={formularioEdicion.imagen} alt="preview" className="h-16 w-16 object-cover rounded border mb-2" />
              )}
              <input
                type="text"
                value={formularioEdicion.autorTexto || ''}
                onChange={e => manejarCambioEdicion('autorTexto', e.target.value)}
                placeholder="Autor del texto"
                className="w-full px-3 py-2 border rounded"
                maxLength={50}
              />
              <input
                type="text"
                value={formularioEdicion.autorFoto || ''}
                onChange={e => manejarCambioEdicion('autorFoto', e.target.value)}
                placeholder="Autor de la foto"
                className="w-full px-3 py-2 border rounded"
                maxLength={50}
              />
              <textarea
                value={formularioEdicion.resumen || ''}
                onChange={e => manejarCambioEdicion('resumen', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded"
                placeholder="Resumen breve de la noticia"
                maxLength={300}
                required
              />
              <textarea
                value={formularioEdicion.contenido || ''}
                onChange={e => manejarCambioEdicion('contenido', e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border rounded"
                placeholder="Contenido completo de la noticia"
                maxLength={5000}
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formularioEdicion.destacada}
                  onChange={e => manejarCambioEdicion('destacada', e.target.checked)}
                />
                Destacada
              </label>
              <label className="block text-xs mb-1">Fecha de publicación</label>
              <input
                type="date"
                value={formularioEdicion.fechaPublicacion ? new Date(formularioEdicion.fechaPublicacion).toISOString().split('T')[0] : ''}
                onChange={e => manejarCambioEdicion('fechaPublicacion', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={cancelarEdicion} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                <button onClick={guardarEdicion} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Guardar</button>
              </div>
        </div>
        <button onClick={cancelarEdicion} className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-600">×</button>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease; }
        @keyframes modal-pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-modal-pop { animation: modal-pop 0.2s cubic-bezier(.4,2,.6,1) }
      `}</style>
    </div>
  ) : null;
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-gray-900">Gestionar Noticias</h2>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-sm text-gray-600">Total: {noticiasBuscadas.length} noticias</span>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por título o autor..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <select
              value={seccionFiltro}
              onChange={(e) => setSeccionFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Todas las secciones</option>
              {secciones.map(seccion => (
                <option key={seccion} value={seccion}>{seccion}</option>
              ))}
            </select>
          </div>
        </div>

        {noticiasBuscadas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay noticias disponibles</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Noticia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {noticiasBuscadas.map((noticia) => (
                    <tr key={noticia.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={noticia.imagen}
                            alt={noticia.titulo}
                            className="h-12 w-12 object-cover rounded mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {noticia.titulo}
                            </div>
                            {noticia.destacada && (
                              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                                Destacada
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {noticia.seccion}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {noticia.autorTexto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {noticia.fechaPublicacion.toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => alternarDestacada(noticia.id, noticia.destacada || false)}
                          className={`p-1 rounded ${noticia.destacada ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}
                          title={noticia.destacada ? 'Quitar de destacadas' : 'Marcar como destacada'}
                        >
                          {noticia.destacada ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/noticia/${noticia.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Ver noticia"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => iniciarEdicion(noticia)}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            title="Editar noticia"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => confirmarEliminacion(noticia.id, noticia.titulo)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Eliminar noticia"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {modalEdicion}
    </>
  );
}