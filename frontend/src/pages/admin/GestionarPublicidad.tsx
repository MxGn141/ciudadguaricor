import React, { useState, useRef, useEffect } from 'react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';
import { Upload, X, Eye, EyeOff, Plus, Image as ImageIcon, Settings, Users } from 'lucide-react';
import axios from 'axios';

const POSICIONES = [
  { key: 'carrusel', label: 'Carrusel Superior (Máx. 7)', maxItems: 7, description: 'Contenidos que aparecen en el carrusel superior del sitio' },
  { key: 'header-bg', label: 'Header (Fondo Principal)', maxItems: 1, description: 'Contenido de fondo para el header principal' },
  { key: 'main-1', label: 'Main 1', maxItems: 1, description: 'Contenido principal izquierdo' },
  { key: 'main-2', label: 'Main 2', maxItems: 1, description: 'Contenido principal derecho' },
  { key: 'main-bg', label: 'Main Fondo', maxItems: 1, description: 'Contenido de fondo para la sección principal' },
  { key: 'side-1', label: 'Side 1', maxItems: 1, description: 'Contenido lateral superior' },
  { key: 'side-2', label: 'Side 2', maxItems: 1, description: 'Contenido lateral medio' },
  { key: 'side-3', label: 'Side 3', maxItems: 1, description: 'Contenido lateral inferior' },
  { key: 'side-4', label: 'Side 4', maxItems: 1, description: 'Contenido lateral adicional' },
  { key: 'side-5', label: 'Side 5', maxItems: 1, description: 'Contenido lateral adicional' },
  { key: 'side-6', label: 'Side 6', maxItems: 1, description: 'Contenido lateral adicional' },
];

export default function GestionarContenidoDestacado() {
  const [contenidos, setContenidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editContenido, setEditContenido] = useState<any | null>(null);
  const [form, setForm] = useState({
    media: '',
    file: null as File | null,
    url: '',
    fecha_inicio: '',
    fecha_fin: '',
    titulo: '',
    ubicacion: POSICIONES[0].key,
    visible: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Cierre modal por click fuera
  useEffect(() => {
    if (!modalOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [modalOpen]);

  const fetchContenidos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://ciudadguaricor.onrender.com/api/content/contenido-destacado');
      // Asegúrate de que la URL sea absoluta
      const contenidos = res.data.map((b: any) => ({
        ...b,
        media: b.media && b.media.startsWith('/uploads')
          ? `https://ciudadguaricor.onrender.com${b.media}`
          : b.media
      }));
      setContenidos(contenidos);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchContenidos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setForm(f => ({ ...f, file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, media: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar límite de contenidos para carrusel
    const posicion = POSICIONES.find(p => p.key === form.ubicacion);
    if (posicion && posicion.maxItems) {
      const contenidosEnPosicion = contenidos.filter(b => b.ubicacion === form.ubicacion && b.id !== editContenido?.id);
      if (contenidosEnPosicion.length >= posicion.maxItems) {
        alert(`No se pueden agregar más de ${posicion.maxItems} contenidos en la posición "${posicion.label}"`);
        return;
      }
    }
    
    const data = new FormData();
    if (form.file) data.append('file', form.file);
    data.append('url', form.url);
    data.append('fecha_inicio', form.fecha_inicio);
    data.append('fecha_fin', form.fecha_fin);
    data.append('titulo', form.titulo);
    data.append('ubicacion', form.ubicacion);
    data.append('visible', String(form.visible));
    try {
      if (editContenido) {
        await axios.put(`https://ciudadguaricor.onrender.com/api/content/contenido-destacado/${editContenido.id}`, data);
      } else {
        await axios.post('https://ciudadguaricor.onrender.com/api/content/contenido-destacado', data);
      }
      setForm({ media: '', file: null, url: '', fecha_inicio: '', fecha_fin: '', titulo: '', ubicacion: POSICIONES[0].key, visible: true });
      setFormOpen(false);
      setEditContenido(null);
      fetchContenidos();
      closeModal();
    } catch (err) {
      alert('Error al guardar el contenido destacado');
    }
  };

  // Función para previsualizar el contenido destacado
  const previsualizarContenido = () => {
    if (!form.media) return null;
    
    const getContenidoStyle = () => {
      switch (form.ubicacion) {
        case 'carrusel':
          return { width: '200px', height: '60px', objectFit: 'contain' } as const;
        case 'header-bg':
          return { width: '100%', height: '200px', objectFit: 'cover' } as const;
        case 'main-1':
        case 'main-2':
          return { width: '300px', height: '150px', objectFit: 'cover' } as const;
        case 'main-bg':
          return { width: '400px', height: '200px', objectFit: 'cover' } as const;
        case 'side-1':
        case 'side-2':
        case 'side-3':
        case 'side-4':
        case 'side-5':
        case 'side-6':
          return { width: '250px', height: 'auto', objectFit: 'contain' } as const;
        default:
          return { width: '100%', height: 'auto', objectFit: 'cover' } as const;
      }
    };

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Previsualización - {POSICIONES.find(p => p.key === form.ubicacion)?.label}</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <img 
            src={form.media} 
            alt="Previsualización" 
            style={getContenidoStyle()}
            className="block"
          />
        </div>
        {form.url && (
          <p className="text-xs text-gray-600 mt-2">
            Enlace: <a href={form.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{form.url}</a>
          </p>
        )}
      </div>
    );
  };

  const handleEdit = (contenido: any) => {
    setEditContenido(contenido);
    setForm({
      media: contenido.media,
      file: null,
      url: contenido.url || '',
      fecha_inicio: contenido.fecha_inicio || '',
      fecha_fin: contenido.fecha_fin || '',
      titulo: contenido.titulo || '',
      ubicacion: contenido.ubicacion,
      visible: contenido.visible !== false
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este contenido destacado?')) return;
    await axios.delete(`https://ciudadguaricor.onrender.com/api/content/contenido-destacado/${id}`);
    fetchContenidos();
  };

  const handleNew = (ubicacion: string) => {
    setEditContenido(null);
    setForm({ media: '', file: null, url: '', fecha_inicio: '', fecha_fin: '', titulo: '', ubicacion, visible: true });
    setFormOpen(true);
  };
    
  const openModal = (contenido: any | null, ubicacion: string) => {
    setModalSection(ubicacion);
    if (contenido) {
      setEditContenido(contenido);
      setForm({
        media: contenido.media,
        file: null,
        url: contenido.url || '',
        fecha_inicio: contenido.fecha_inicio || '',
        fecha_fin: contenido.fecha_fin || '',
        titulo: contenido.titulo || '',
        ubicacion: contenido.ubicacion,
        visible: contenido.visible !== false
      });
    } else {
      setEditContenido(null);
      setForm({ media: '', file: null, url: '', fecha_inicio: '', fecha_fin: '', titulo: '', ubicacion, visible: true });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditContenido(null);
    setModalSection('');
  };
    
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Contenidos Destacados</h1>
          <p className="text-gray-600 mt-1">Administra los contenidos destacados del sitio web</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Settings size={16} />
          <span>Total: {contenidos.length} contenidos destacados</span>
        </div>
      </div>

      {/* MODAL PARA AGREGAR/EDITAR */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-all animate-fadeIn">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeInUp max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"><X /></button>
            <h2 className="text-2xl font-bold mb-6 text-center">{editContenido ? 'Editar Contenido Destacado' : 'Nuevo Contenido Destacado'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Ubicación solo visible en modo edición, no editable */}
              {editContenido && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input value={form.ubicacion} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media *</label>
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} ref={fileInputRef} className="w-full" />
                {form.media && (
                  <img src={form.media} alt="preview" className="mt-2 h-32 rounded mx-auto" />
                )}
              </div>
              {/* Previsualización del contenido destacado */}
              {previsualizarContenido()}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enlace (opcional)</label>
                <input name="url" value={form.url} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
                  <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin *</label>
                  <input type="date" name="fecha_fin" value={form.fecha_fin} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input name="titulo" value={form.titulo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="visible" checked={form.visible} onChange={handleInputChange} />
                  Mostrar en el sitio
                </label>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="submit" className="px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue font-semibold shadow">{editContenido ? 'Guardar Cambios' : 'Crear Contenido Destacado'}</button>
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA DE CONTENIDOS ORGANIZADA POR Ubicación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {POSICIONES.map(pos => {
          const contenidosEnPosicion = contenidos.filter(b => b.ubicacion === pos.key);
          const puedeAgregar = !pos.maxItems || contenidosEnPosicion.length < pos.maxItems;
          
          return (
            <section key={pos.key} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-gray-900">{pos.label}</h2>
                    {pos.maxItems && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {contenidosEnPosicion.length}/{pos.maxItems}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{pos.description}</p>
                </div>
                {puedeAgregar && (
                  <button 
                    onClick={() => openModal(null, pos.key)} 
                    className="px-3 py-1 bg-guarico-green text-white rounded-lg hover:bg-guarico-light-green flex items-center text-sm font-semibold"
                  >
                    <Plus size={14} className="mr-1" />
                    Agregar
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {contenidosEnPosicion.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <ImageIcon size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay contenidos destacados en esta ubicación</p>
                    {!puedeAgregar && (
                      <p className="text-xs text-red-500 mt-1">Límite alcanzado</p>
                    )}
                  </div>
                ) : (
                  contenidosEnPosicion.map(contenido => {
                    const hoy = new Date().toISOString().slice(0, 10);
                    const activo = (!contenido.fecha_inicio || contenido.fecha_inicio <= hoy) && (!contenido.fecha_fin || contenido.fecha_fin >= hoy);
                    
                    return (
                      <div key={contenido.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <img 
                            src={contenido.media} 
                            alt="contenido" 
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${activo ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                {activo ? 'Activo' : 'Inactivo'}
                              </span>
                              {contenido.url && (
                                <a href={contenido.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                                  Ver enlace
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1 line-clamp-2">{contenido.titulo}</p>
                            <p className="text-xs text-gray-500">{contenido.fecha_inicio} - {contenido.fecha_fin}</p>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => openModal(contenido, pos.key)} 
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Editar"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(contenido.id)} 
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Eliminar"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}