import React, { useState, useRef } from 'react';
import { useContextoPublicidad } from '../../contexts/ContextoPublicidad';
import { Upload, X, Edit2, Check, Eye, EyeOff, Plus, Image as ImageIcon } from 'lucide-react';

export default function GestionarPublicidad() {
  const { banners, actualizarBanner, eliminarBanner, agregarBanner } = useContextoPublicidad();
  const [bannerEditando, setBannerEditando] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState<'header' | 'sidebar' | 'inicio' | 'inicio-back' | null>(null);
  const [nuevoBanner, setNuevoBanner] = useState({
    imagen: '',
    enlace: '',
    posicion: 'primera' as 'primera' | 'segunda'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
        alert('El archivo es demasiado grande. Máximo 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const banner = {
          id: Date.now().toString(),
          tipo,
          imagen: reader.result as string,
          enlace: nuevoBanner.enlace,
          activo: true,
          posicion: tipo === 'inicio' ? nuevoBanner.posicion : undefined
        };
        agregarBanner(banner);
        setNuevoBanner({ imagen: '', enlace: '', posicion: 'primera' });
        setMostrarFormulario(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleActivo = (banner: any) => {
    actualizarBanner({
      ...banner,
      activo: !banner.activo
    });
  };

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este banner?')) {
      eliminarBanner(id);
    }
  };

  const handleSubmitURL = (tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back') => {
    if (!nuevoBanner.imagen) {
      alert('Por favor ingresa una URL de imagen válida.');
      return;
    }

    const banner = {
      id: Date.now().toString(),
      tipo,
      imagen: nuevoBanner.imagen,
      enlace: nuevoBanner.enlace,
      activo: true,
      posicion: tipo === 'inicio' ? nuevoBanner.posicion : undefined
    };
    
    agregarBanner(banner);
    setNuevoBanner({ imagen: '', enlace: '', posicion: 'primera' });
    setMostrarFormulario(null);
  };

  const BannerSection = ({ tipo, titulo, descripcion }: { 
    tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back', 
    titulo: string, 
    descripcion: string 
  }) => {
    const bannersDelTipo = banners.filter(b => b.tipo === tipo);
    
    return (
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{titulo}</h2>
            <p className="text-sm text-gray-600 mt-1">{descripcion}</p>
          </div>
          <button
            onClick={() => setMostrarFormulario(tipo)}
            className="flex items-center px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Agregar Banner
          </button>
        </div>

        {/* Formulario para agregar banner */}
        {mostrarFormulario === tipo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="font-medium mb-4">Agregar Nuevo Banner</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={nuevoBanner.imagen}
                  onChange={(e) => setNuevoBanner(prev => ({ ...prev, imagen: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace (opcional)
                </label>
                <input
                  type="url"
                  value={nuevoBanner.enlace}
                  onChange={(e) => setNuevoBanner(prev => ({ ...prev, enlace: e.target.value }))}
                  placeholder="https://ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-blue focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSubmitURL(tipo)}
                  className="px-4 py-2 bg-guarico-green text-white rounded-lg hover:bg-guarico-light-green transition-colors"
                >
                  Agregar Banner
                </button>
                <span className="text-gray-500">o</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e, tipo)}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue transition-colors flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Subir Archivo
                </button>
                <button
                  onClick={() => {
                    setMostrarFormulario(null);
                    setNuevoBanner({ imagen: '', enlace: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de banners */}
        <div className="space-y-4">
          {bannersDelTipo.length > 0 ? (
            bannersDelTipo.map(banner => (
              <div key={banner.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      banner.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {banner.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    {banner.enlace && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Con enlace
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActivo(banner)}
                      className={`p-2 rounded-lg transition-colors ${
                        banner.activo 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={banner.activo ? 'Desactivar' : 'Activar'}
                    >
                      {banner.activo ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleEliminar(banner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="relative group">
                  <img
                    src={banner.imagen}
                    alt="Banner preview"
                    className={`w-full rounded-lg transition-opacity ${
                      tipo === 'header' ? 'h-32 object-cover' :
                      tipo === 'sidebar' ? 'h-48 object-cover' :
                      'h-40 object-cover'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x200/0088FF/FFFFFF?text=Error+al+cargar+imagen';
                    }}
                  />
                  {banner.enlace && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <a
                        href={banner.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 bg-white text-guarico-blue px-4 py-2 rounded-lg font-medium transition-opacity duration-300"
                      >
                        Ver enlace
                      </a>
                    </div>
                  )}
                </div>
                
                {banner.enlace && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Enlace:</strong> 
                    <a 
                      href={banner.enlace} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-guarico-blue hover:text-guarico-light-blue ml-1"
                    >
                      {banner.enlace}
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No hay banners configurados</p>
              <p className="text-sm">Agrega tu primer banner para esta sección</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestionar Publicidad</h1>

      {/* Banner Header */}
      <BannerSection
        tipo="header"
        titulo="Banner Principal"
        descripcion="Banner que aparece en el encabezado de la página"
      />

      {/* Banner Sidebar */}
      <BannerSection
        tipo="sidebar"
        titulo="Banners Laterales"
        descripcion="Banners que aparecen en la barra lateral (máximo 6)"
      />

      {/* Banner Inicio */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Banners de Inicio</h2>
            <p className="text-sm text-gray-600 mt-1">Banners que aparecen en la página principal (2 posiciones)</p>
          </div>
          <button
            onClick={() => setMostrarFormulario('inicio')}
            className="flex items-center px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Agregar Banner
          </button>
        </div>

        {mostrarFormulario === 'inicio' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="font-medium mb-4">Agregar Nuevo Banner de Inicio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición del Banner
                </label>
                <select
                  value={nuevoBanner.posicion}
                  onChange={(e) => setNuevoBanner(prev => ({ ...prev, posicion: e.target.value as 'primera' | 'segunda' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-blue focus:border-transparent"
                >
                  <option value="primera">Primera posición (Después de Más Noticias)</option>
                  <option value="segunda">Segunda posición (Entre Cultura y Sociales)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={nuevoBanner.imagen}
                  onChange={(e) => setNuevoBanner(prev => ({ ...prev, imagen: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace (opcional)
                </label>
                <input
                  type="url"
                  value={nuevoBanner.enlace}
                  onChange={(e) => setNuevoBanner(prev => ({ ...prev, enlace: e.target.value }))}
                  placeholder="https://ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-blue focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSubmitURL('inicio')}
                  className="px-4 py-2 bg-guarico-green text-white rounded-lg hover:bg-guarico-light-green transition-colors"
                >
                  Agregar Banner
                </button>
                <span className="text-gray-500">o</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e, 'inicio')}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue transition-colors flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Subir Archivo
                </button>
                <button
                  onClick={() => {
                    setMostrarFormulario(null);
                    setNuevoBanner({ imagen: '', enlace: '', posicion: 'primera' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de banners de inicio */}
        <div className="space-y-4">
          {banners.filter(b => b.tipo === 'inicio').map(banner => (
            <div key={banner.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    banner.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {banner.posicion === 'primera' ? 'Primera posición' : 'Segunda posición'}
                  </span>
                  {banner.enlace && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Con enlace
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActivo(banner)}
                    className={`p-2 rounded-lg transition-colors ${
                      banner.activo 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={banner.activo ? 'Desactivar' : 'Activar'}
                  >
                    {banner.activo ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => handleEliminar(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="relative group">
                <img
                  src={banner.imagen}
                  alt="Banner preview"
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x200/0088FF/FFFFFF?text=Error+al+cargar+imagen';
                  }}
                />
                {banner.enlace && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <a
                      href={banner.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 bg-white text-guarico-blue px-4 py-2 rounded-lg font-medium transition-opacity duration-300"
                    >
                      Ver enlace
                    </a>
                  </div>
                )}
              </div>
              
              {banner.enlace && (
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Enlace:</strong> 
                  <a 
                    href={banner.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-guarico-blue hover:text-guarico-light-blue ml-1"
                  >
                    {banner.enlace}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Banner Inicio-Back */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Banner Final</h2>
            <p className="text-sm text-gray-600 mt-1">Banner que aparece al final de la página principal</p>
          </div>
          <button
            onClick={() => setMostrarFormulario('inicio-back')}
            className="flex items-center px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Agregar Banner
          </button>
        </div>

        {mostrarFormulario === 'inicio-back' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="font-medium mb-4">Agregar Banner Final</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={nuevoBanner.imagen}
                  onChange={(e) => setNuevoBanner(prev => ({ ...prev, imagen: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace (opcional)
                </label>
                <input
                  type="url"
                  value={nuevoBanner.enlace}
                  onChange={(e) => setNuevoBanner(prev => ({ ...prev, enlace: e.target.value }))}
                  placeholder="https://ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-guarico-blue focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSubmitURL('inicio-back')}
                  className="px-4 py-2 bg-guarico-green text-white rounded-lg hover:bg-guarico-light-green transition-colors"
                >
                  Agregar Banner
                </button>
                <span className="text-gray-500">o</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e, 'inicio-back')}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-guarico-blue text-white rounded-lg hover:bg-guarico-light-blue transition-colors flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Subir Archivo
                </button>
                <button
                  onClick={() => {
                    setMostrarFormulario(null);
                    setNuevoBanner({ imagen: '', enlace: '', posicion: 'primera' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de banners inicio-back */}
        <div className="space-y-4">
          {banners.filter(b => b.tipo === 'inicio-back').map(banner => (
            <div key={banner.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    banner.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  {banner.enlace && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Con enlace
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActivo(banner)}
                    className={`p-2 rounded-lg transition-colors ${
                      banner.activo 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={banner.activo ? 'Desactivar' : 'Activar'}
                  >
                    {banner.activo ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => handleEliminar(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="relative group">
                <img
                  src={banner.imagen}
                  alt="Banner preview"
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x200/0088FF/FFFFFF?text=Error+al+cargar+imagen';
                  }}
                />
                {banner.enlace && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <a
                      href={banner.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 bg-white text-guarico-blue px-4 py-2 rounded-lg font-medium transition-opacity duration-300"
                    >
                      Ver enlace
                    </a>
                  </div>
                )}
              </div>
              
              {banner.enlace && (
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Enlace:</strong> 
                  <a 
                    href={banner.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-guarico-blue hover:text-guarico-light-blue ml-1"
                  >
                    {banner.enlace}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}