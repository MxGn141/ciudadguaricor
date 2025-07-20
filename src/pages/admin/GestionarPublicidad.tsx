import React, { useState, useRef } from 'react';
import { useContextoContenido } from '../../contexts/ContextoContenido';
import { Upload, X, Eye, EyeOff, Plus, Image as ImageIcon } from 'lucide-react';

export default function GestionarPublicidad() {
  const { contenidos, actualizarContenido, eliminarContenido, agregarContenido } = useContextoContenido();
  const [bannerEditando, setBannerEditando] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState<'header' | 'sidebar' | 'inicio' | 'inicio-back' | 'inicio-2' | null>(null);
  const [nuevoBanner, setNuevoBanner] = useState({
    imagen: '',
    enlace: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back' | 'inicio-2') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
        alert('El archivo es demasiado grande. Máximo 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const contenido = {
          id: Date.now().toString(),
          tipo,
          imagen: reader.result as string,
          enlace: nuevoBanner.enlace,
          activo: true
        };
        agregarContenido(contenido);
        setNuevoBanner({ imagen: '', enlace: '' });
        setMostrarFormulario(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleActivo = (contenido: any) => {
    actualizarContenido({
      ...contenido,
      activo: !contenido.activo
    });
  };

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      eliminarContenido(id);
    }
  };

  const handleSubmitURL = (tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back' | 'inicio-2') => {
    if (!nuevoBanner.imagen) {
      alert('Por favor ingresa una URL de imagen válida.');
      return;
    }

    const contenido = {
      id: Date.now().toString(),
      tipo,
      imagen: nuevoBanner.imagen,
      enlace: nuevoBanner.enlace,
      activo: true
    };
    
    agregarContenido(contenido);
    setNuevoBanner({ imagen: '', enlace: '' });
    setMostrarFormulario(null);
  };

  const BannerSection = ({ tipo, titulo, descripcion }: { 
    tipo: 'header' | 'sidebar' | 'inicio' | 'inicio-back' | 'inicio-2', 
    titulo: string, 
    descripcion: string 
  }) => {
    const contenidosDelTipo = contenidos.filter(b => b.tipo === tipo);
    
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
            Agregar Contenido
          </button>
        </div>

        {/* Formulario para agregar contenido */}
        {mostrarFormulario === tipo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="font-medium mb-4">Agregar Nuevo Contenido</h3>
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
                  Agregar Contenido
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

        {/* Lista de contenidos */}
        <div className="space-y-4">
          {contenidosDelTipo.length > 0 ? (
            contenidosDelTipo.map(contenido => (
              <div key={contenido.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      contenido.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contenido.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    {contenido.enlace && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Con enlace
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActivo(contenido)}
                      className={`p-2 rounded-lg transition-colors ${
                        contenido.activo 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={contenido.activo ? 'Desactivar' : 'Activar'}
                    >
                      {contenido.activo ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleEliminar(contenido.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="relative group">
                  <img
                    src={contenido.imagen}
                    alt="Vista previa"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {contenido.enlace && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <a
                        href={contenido.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 bg-white text-guarico-blue px-4 py-2 rounded-lg font-medium transition-opacity duration-300"
                      >
                        Ver enlace
                      </a>
                    </div>
                  )}
                </div>
                
                {contenido.enlace && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Enlace:</strong> 
                    <a 
                      href={contenido.enlace} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-guarico-blue hover:text-guarico-light-blue ml-1"
                    >
                      {contenido.enlace}
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No hay contenido configurado</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestionar Contenido</h1>
      
      <BannerSection
        tipo="header"
        titulo="Encabezado Principal"
        descripcion="Imagen que aparece en el encabezado de todas las páginas"
      />
      
      <BannerSection
        tipo="sidebar"
        titulo="Contenido Lateral"
        descripcion="Imágenes que aparecen en la barra lateral"
      />
      
      <BannerSection
        tipo="inicio"
        titulo="Contenido Superior"
        descripcion="Imagen que aparece después de la sección Más Noticias"
      />
      
      <BannerSection
        tipo="inicio-back"
        titulo="Imagen de Fondo"
        descripcion="Imagen que aparece como fondo en la página principal"
      />

      <BannerSection
        tipo="inicio-2"
        titulo="Contenido Entre Secciones"
        descripcion="Imagen que aparece entre las secciones de Cultura y Sociales"
      />
    </div>
  );
}