import React, { useState, useCallback } from 'react';
import { Edit2, Trash2, Eye, Star, StarOff, Image as ImageIcon, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContextoNoticias, Noticia } from '../../contexts/ContextoNoticias';
import axios from 'axios';

// Notificación flotante
function Notificacion({ mensaje, tipo, onClose }: { mensaje: string, tipo: 'exito' | 'error', onClose: () => void }) {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white transition-all animate-fade-in-down ${tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'}`}
      style={{ minWidth: 220 }}>
      <div className="flex items-center justify-between gap-4">
        <span>{mensaje}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 font-bold">×</button>
      </div>
    </div>
  );
}

export default function GestionarNoticias() {
  const { noticias, eliminarNoticia, editarNoticia, cargarNoticias } = useContextoNoticias();
  const [seccionFiltro, setSeccionFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [noticiaEditando, setNoticiaEditando] = useState<Noticia | null>(null);
  const [formularioEdicion, setFormularioEdicion] = useState<Partial<Noticia>>({});
  const [secciones, setSecciones] = useState<{ id: number; nombre: string }[]>([]);
  const [autores, setAutores] = useState<{ id: number; nombre: string }[]>([]);
  const [notificacion, setNotificacion] = useState<{ mensaje: string, tipo: 'exito' | 'error' } | null>(null);

  React.useEffect(() => {
    axios.get('https://ciudadguaricor.onrender.com/api/sections').then(res => setSecciones(res.data));
    // Si tienes autores, cámbialo también si es necesario
    // axios.get('http://localhost:3000/api/authors').then(res => setAutores(res.data));
  }, []);

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  const noticiasFiltradas = seccionFiltro 
    ? noticias.filter(noticia => noticia.seccion?.nombre === seccionFiltro)
    : noticias;
  const noticiasBuscadas = noticiasFiltradas.filter(noticia =>
    noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    noticia.autorTexto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const seccionesOptions = secciones.map(s => ({ id: s.id, nombre: s.nombre }));
  const autoresOptions = autores.map(a => ({ id: a.id, nombre: a.nombre }));

  const confirmarEliminacion = async (id: string | number, titulo: string) => {
    if (window.confirm(`¿Está seguro de eliminar la noticia "${titulo}"?`)) {
      try {
        await eliminarNoticia(String(id));
        await cargarNoticias();
        mostrarNotificacion('Noticia eliminada exitosamente', 'exito');
      } catch (error) {
        mostrarNotificacion('Error al eliminar la noticia', 'error');
      }
    }
  };

  const alternarDestacada = async (id: string | number, destacada: boolean) => {
    try {
      // Si se intenta marcar como destacada, verificar el límite
      if (!destacada) {
        const noticiasDestacadas = noticias.filter(n => n.destacada && n.id !== id);
        if (noticiasDestacadas.length >= 3) {
          // Preguntar al usuario si quiere continuar
          const confirmar = window.confirm(
            `Ya hay 3 noticias destacadas (máximo permitido).\n\n¿Deseas continuar? Esto reemplazará automáticamente la noticia destacada más antigua.`
          );
          if (!confirmar) {
            mostrarNotificacion('Operación cancelada', 'error');
            return; // Salir sin hacer nada
          }
        }
      }
      
      await editarNoticia(String(id), { destacada: !destacada });
      
      // Esperar un momento para que el backend procese y luego recargar
      setTimeout(async () => {
        await cargarNoticias();
        mostrarNotificacion(
          destacada 
            ? 'Noticia removida de destacadas' 
            : 'Noticia marcada como destacada', 
          'exito'
        );
      }, 800);
    } catch (error) {
      mostrarNotificacion('Error al actualizar destacada', 'error');
    }
  };

  const abrirModalEdicion = (noticia: Noticia) => {
    setNoticiaEditando(noticia);
    setFormularioEdicion({
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      contenido: noticia.contenido,
      seccion: noticia.seccion || null,
      autorTexto: noticia.autorTexto || '',
      autorFoto: noticia.autorFoto || '',
      destacada: noticia.destacada || false
    });
  };

  const cerrarModalEdicion = useCallback(() => {
    setNoticiaEditando(null);
    setFormularioEdicion({});
  }, []);

  const manejarClicFueraModal = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      cerrarModalEdicion();
    }
  }, [cerrarModalEdicion]);

  const guardarEdicion = async () => {
    if (noticiaEditando && Object.keys(formularioEdicion).length > 0) {
      // Enviar solo los campos editables y seccion_id
      const payload: any = {
        ...formularioEdicion,
        seccion_id: formularioEdicion.seccion?.id || noticiaEditando.seccion?.id || null
      };
      delete payload.seccion;
      try {
        await editarNoticia(String(noticiaEditando.id), payload);
        mostrarNotificacion('Noticia editada exitosamente', 'exito');
        cerrarModalEdicion();
      } catch (error) {
        mostrarNotificacion('Error al editar la noticia', 'error');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormularioEdicion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="space-y-6 p-4">
      {notificacion && <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} onClose={() => setNotificacion(null)} />}
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestionar Noticias</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
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
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            <option value="">Todas las secciones</option>
            {seccionesOptions.map(seccion => (
              <option key={seccion.id} value={seccion.nombre}>{seccion.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {/* Vista móvil */}
          <div className="sm:hidden">
            {noticiasBuscadas.map((noticia) => (
              <div key={noticia.id} className="p-4 border-b border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {noticia.titulo}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {noticia.seccion?.nombre}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        noticia.destacada 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {noticia.destacada ? 'Destacada' : 'Normal'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {noticia.autorTexto}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => alternarDestacada(noticia.id, noticia.destacada || false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={noticia.destacada ? "Quitar destacada" : "Marcar como destacada"}
                      >
                        {noticia.destacada ? (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Star className="h-5 w-5 text-yellow-400" />
                        )}
                      </button>
                      <Link
                        to={`/noticia/${noticia.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver noticia"
                      >
                        <Eye className="h-5 w-5 text-blue-500" />
                      </Link>
                      <button
                        onClick={() => abrirModalEdicion(noticia)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar noticia"
                      >
                        <Edit2 className="h-5 w-5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => confirmarEliminacion(noticia.id, noticia.titulo)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar noticia"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop */}
          <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                        {noticia.titulo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {noticia.seccion?.nombre}
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
                        to={`/noticia/${noticia.id}`}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Ver noticia"
                      >
                        <Eye className="h-5 w-5 text-blue-500" />
                      </Link>
                      <button
                        onClick={() => abrirModalEdicion(noticia)}
                        className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                        title="Editar noticia"
                      >
                        <Edit2 className="h-5 w-5 text-blue-500" />
                      </button>
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

      {/* Modal de Edición */}
      {noticiaEditando && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 min-h-screen w-screen"
          onClick={manejarClicFueraModal}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">Editar Noticia</h3>
              <button
                onClick={cerrarModalEdicion}
                className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formularioEdicion.titulo || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resumen
                </label>
                <textarea
                  name="resumen"
                  value={formularioEdicion.resumen || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido
                </label>
                <textarea
                  name="contenido"
                  value={formularioEdicion.contenido || ''}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="seccion_id" className="block text-sm font-medium text-gray-700 mb-2">Sección *</label>
                <select
                  id="seccion_id"
                  name="seccion_id"
                  value={formularioEdicion.seccion?.id || ''}
                  onChange={e => {
                    const id = Number(e.target.value);
                    const seccion = secciones.find(s => s.id === id) || null;
                    setFormularioEdicion(prev => ({ ...prev, seccion }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione una sección</option>
                  {seccionesOptions.map(seccion => (
                    <option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="autorTexto" className="block text-sm font-medium text-gray-700 mb-2">
                  Autor de Texto *
                </label>
                <input
                  type="text"
                  id="autorTexto"
                  name="autorTexto"
                  value={formularioEdicion.autorTexto || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="autorFoto" className="block text-sm font-medium text-gray-700 mb-2">
                  Autor de Foto *
                </label>
                <input
                  type="text"
                  id="autorFoto"
                  name="autorFoto"
                  value={formularioEdicion.autorFoto || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t">
              <button
                onClick={cerrarModalEdicion}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}