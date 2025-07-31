import React, { useState, useRef, useEffect } from 'react';
import { useContextoContenido } from '../../contexts/ContextoContenido';
import { Upload, X, Eye, EyeOff, Plus, Image as ImageIcon, Settings, Users } from 'lucide-react';
import axios from 'axios';

const POSICIONES = [
  { key: 'carrusel', label: 'Carrusel Superior (Máx. 7)', maxItems: 7, description: 'Banners que aparecen en el carrusel superior del sitio' },
  { key: 'header-bg', label: 'Header (Fondo Principal)', maxItems: 1, description: 'Banner de fondo para el header principal' },
  { key: 'main-1', label: 'Main 1', maxItems: 1, description: 'Banner principal izquierdo' },
  { key: 'main-2', label: 'Main 2', maxItems: 1, description: 'Banner principal derecho' },
  { key: 'main-bg', label: 'Main Fondo', maxItems: 1, description: 'Banner de fondo para la sección principal' },
  { key: 'side-1', label: 'Side 1', maxItems: 1, description: 'Banner lateral superior' },
  { key: 'side-2', label: 'Side 2', maxItems: 1, description: 'Banner lateral medio' },
  { key: 'side-3', label: 'Side 3', maxItems: 1, description: 'Banner lateral inferior' },
  { key: 'side-4', label: 'Side 4', maxItems: 1, description: 'Banner lateral adicional' },
  { key: 'side-5', label: 'Side 5', maxItems: 1, description: 'Banner lateral adicional' },
  { key: 'side-6', label: 'Side 6', maxItems: 1, description: 'Banner lateral adicional' },
];

export default function GestionarPublicidad() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<any | null>(null);
  const [form, setForm] = useState({
    imagen: '',
    file: null as File | null,
    url: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
    posicion: POSICIONES[0].key,
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

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://ciudadguaricor.onrender.com/api/content/banners');
      // Asegúrate de que la URL sea absoluta
      const banners = res.data.map((b: any) => ({
        ...b,
        imagen: b.imagen && b.imagen.startsWith('/uploads')
          ? `https://ciudadguaricor.onrender.com${b.imagen}`
          : b.imagen
      }));
      setBanners(banners);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setForm(f => ({ ...f, file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, imagen: reader.result as string }));
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
    
    // Verificar límite de banners para carrusel
    const posicion = POSICIONES.find(p => p.key === form.posicion);
    if (posicion && posicion.maxItems) {
      const bannersEnPosicion = banners.filter(b => b.posicion === form.posicion && b.id !== editBanner?.id);
      if (bannersEnPosicion.length >= posicion.maxItems) {
        alert(`No se pueden agregar más de ${posicion.maxItems} banners en la posición "${posicion.label}"`);
        return;
      }
    }
    
    const data = new FormData();
    if (form.file) data.append('file', form.file);
    data.append('url', form.url);
    data.append('fecha_inicio', form.fecha_inicio);
    data.append('fecha_fin', form.fecha_fin);
    data.append('descripcion', form.descripcion);
    data.append('posicion', form.posicion);
    data.append('visible', String(form.visible));
    try {
      if (editBanner) {
        await axios.put(`https://ciudadguaricor.onrender.com/api/content/banners/${editBanner.id}`, data);
      } else {
        await axios.post('https://ciudadguaricor.onrender.com/api/content/banners', data);
      }
      setForm({ imagen: '', file: null, url: '', fecha_inicio: '', fecha_fin: '', descripcion: '', posicion: POSICIONES[0].key, visible: true });
      setFormOpen(false);
      setEditBanner(null);
      fetchBanners();
      closeModal();
    } catch (err) {
      alert('Error al guardar el banner');
    }
  };

  // Función para previsualizar el banner
  const previsualizarBanner = () => {
    if (!form.imagen) return null;
    
    const getBannerStyle = () => {
      switch (form.posicion) {
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
        <h4 className="text-sm font-semibold mb-2">Previsualización - {POSICIONES.find(p => p.key === form.posicion)?.label}</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <img 
            src={form.imagen} 
            alt="Previsualización" 
            style={getBannerStyle()}
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

  const handleEdit = (banner: any) => {
    setEditBanner(banner);
    setForm({
      imagen: banner.imagen,
      file: null,
      url: banner.url || '',
      fecha_inicio: banner.fecha_inicio || '',
      fecha_fin: banner.fecha_fin || '',
      descripcion: banner.descripcion || '',
      posicion: banner.posicion,
      visible: banner.visible !== false
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este banner?')) return;
    await axios.delete(`https://ciudadguaricor.onrender.com/api/content/banners/${id}`);
    fetchBanners();
  };

  const handleNew = (posicion: string) => {
    setEditBanner(null);
    setForm({ imagen: '', file: null, url: '', fecha_inicio: '', fecha_fin: '', descripcion: '', posicion, visible: true });
    setFormOpen(true);
  };
    
  const openModal = (banner: any | null, posicion: string) => {
    setModalSection(posicion);
    if (banner) {
      setEditBanner(banner);
      setForm({
        imagen: banner.imagen,
        file: null,
        url: banner.url || '',
        fecha_inicio: banner.fecha_inicio || '',
        fecha_fin: banner.fecha_fin || '',
        descripcion: banner.descripcion || '',
        posicion: banner.posicion,
        visible: banner.visible !== false
      });
    } else {
      setEditBanner(null);
      setForm({ imagen: '', file: null, url: '', fecha_inicio: '', fecha_fin: '', descripcion: '', posicion, visible: true });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditBanner(null);
    setModalSection('');
  };
    
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Banners Publicitarios</h1>
          <p className="text-gray-600 mt-1">Administra los banners publicitarios del sitio web</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Settings size={16} />
          <span>Total: {banners.length} banners</span>
        </div>
      </div>

      {/* MODAL PARA AGREGAR/EDITAR */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-all animate-fadeIn">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeInUp max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"><X /></button>
            <h2 className="text-2xl font-bold mb-6 text-center">{editBanner ? 'Editar Banner' : 'Nuevo Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Posición solo visible en modo edición, no editable */}
              {editBanner && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
                  <input value={form.posicion} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen *</label>
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="w-full" />
                {form.imagen && (
                  <img src={form.imagen} alt="preview" className="mt-2 h-32 rounded mx-auto" />
                )}
              </div>
              {/* Previsualización del banner */}
              {previsualizarBanner()}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="visible" checked={form.visible} onChange={handleInputChange} />
                  Mostrar en el sitio
                </label>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="submit" className="px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue font-semibold shadow">{editBanner ? 'Guardar Cambios' : 'Crear Banner'}</button>
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA DE BANNERS ORGANIZADA POR POSICIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {POSICIONES.map(pos => {
          const bannersEnPosicion = banners.filter(b => b.posicion === pos.key);
          const puedeAgregar = !pos.maxItems || bannersEnPosicion.length < pos.maxItems;
          
          return (
            <section key={pos.key} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-gray-900">{pos.label}</h2>
                    {pos.maxItems && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {bannersEnPosicion.length}/{pos.maxItems}
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
                {bannersEnPosicion.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <ImageIcon size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay banners en esta posición</p>
                    {!puedeAgregar && (
                      <p className="text-xs text-red-500 mt-1">Límite alcanzado</p>
                    )}
                  </div>
                ) : (
                  bannersEnPosicion.map(banner => {
                    const hoy = new Date().toISOString().slice(0, 10);
                    const activo = (!banner.fecha_inicio || banner.fecha_inicio <= hoy) && (!banner.fecha_fin || banner.fecha_fin >= hoy);
                    
                    return (
                      <div key={banner.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <img 
                            src={banner.imagen} 
                            alt="banner" 
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${activo ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                {activo ? 'Activo' : 'Inactivo'}
                              </span>
                              {banner.url && (
                                <a href={banner.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                                  Ver enlace
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1 line-clamp-2">{banner.descripcion}</p>
                            <p className="text-xs text-gray-500">{banner.fecha_inicio} - {banner.fecha_fin}</p>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => openModal(banner, pos.key)} 
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Editar"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(banner.id)} 
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