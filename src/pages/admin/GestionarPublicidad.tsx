import React, { useState, useRef, useEffect } from 'react';
import { useContextoContenido } from '../../contexts/ContextoContenido';
import { Upload, X, Eye, EyeOff, Plus, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const POSICIONES = [
  { key: 'header-bg', label: 'Header (Fondo Principal)' },
  { key: 'main-1', label: 'Main 1' },
  { key: 'main-2', label: 'Main 2' },
  { key: 'main-bg', label: 'Main Fondo' },
  { key: 'side-1', label: 'Side 1' },
  { key: 'side-2', label: 'Side 2' },
  { key: 'side-3', label: 'Side 3' },
  { key: 'side-4', label: 'Side 4' },
  { key: 'side-5', label: 'Side 5' },
  { key: 'side-6', label: 'Side 6' },
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
      const res = await axios.get('/api/content/banners');
      // Asegúrate de que la URL sea absoluta
      const banners = res.data.map((b: any) => ({
        ...b,
        imagen: b.imagen && b.imagen.startsWith('/uploads')
          ? `http://localhost:3000${b.imagen}`
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
        await axios.put(`/api/content/banners/${editBanner.id}`, data);
      } else {
        await axios.post('/api/content/banners', data);
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
        case 'header-bg':
          return { width: '100%', height: '200px', objectFit: 'cover' } as const;
        case 'main-1':
        case 'main-2':
          return { width: '1220px', height: '240px', objectFit: 'cover' } as const;
        case 'main-bg':
          return { width: '920px', height: '240px', objectFit: 'cover' } as const;
        case 'side-1':
        case 'side-2':
        case 'side-3':
        case 'side-4':
        case 'side-5':
        case 'side-6':
          return { width: '100%', height: 'auto', objectFit: 'contain' } as const;
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
    await axios.delete(`/api/content/banners/${id}`);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Gestión de Banners Publicitarios</h1>
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
      {/* LISTA DE BANNERS EN UNA SOLA COLUMNA, GRANDES Y CENTRADAS */}
      <div className="grid grid-cols-1 gap-8">
        {POSICIONES.map(pos => (
          <section key={pos.key} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{pos.label}</h2>
                <p className="text-xs text-gray-500">Banners para la posición <span className="font-mono">{pos.key}</span></p>
              </div>
              <button onClick={() => openModal(null, pos.key)} className="px-4 py-2 bg-guarico-green text-white rounded-lg hover:bg-guarico-light-green flex items-center font-semibold"><Plus size={16} className="mr-2" />Agregar Banner</button>
            </div>
            <div className="flex flex-col gap-6 w-full items-center">
              {banners.filter(b => b.posicion === pos.key).length === 0 && (
                <div className="text-center py-8 text-gray-400 w-full">No hay banners en esta posición</div>
              )}
              {banners.filter(b => b.posicion === pos.key).map(banner => {
                const hoy = new Date().toISOString().slice(0, 10);
                const activo = (!banner.fecha_inicio || banner.fecha_inicio <= hoy) && (!banner.fecha_fin || banner.fecha_fin >= hoy);
                return (
                  <div key={banner.id} className="relative bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center p-4 w-full max-w-3xl hover:shadow-xl transition-all">
                    <div className="flex-shrink-0 w-full md:w-96 flex justify-center items-center mb-4 md:mb-0">
                      <img src={banner.imagen} alt="banner" className="w-full h-40 object-contain rounded bg-white border" />
                  </div>
                    <div className="flex-1 flex flex-col items-center md:items-start px-0 md:px-6">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${activo ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{activo ? 'Activo' : 'Inactivo'}</span>
                        {banner.url && <a href={banner.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Enlace</a>}
                  </div>
                      <div className="text-xs text-gray-500 mb-1">{banner.fecha_inicio} - {banner.fecha_fin}</div>
                      <div className="text-xs text-gray-700 mb-2 text-center md:text-left">{banner.descripcion}</div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => openModal(banner, pos.key)} className="px-3 py-1 bg-guarico-blue text-white rounded hover:bg-guarico-light-blue text-xs font-semibold">Editar</button>
                        <button onClick={() => handleDelete(banner.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold">Eliminar</button>
                </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}