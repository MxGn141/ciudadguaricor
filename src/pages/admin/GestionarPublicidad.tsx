import React, { useState, useRef } from 'react';
import { useContextoPublicidad } from '../../contexts/ContextoPublicidad';
import { Upload, X, Edit2, Check } from 'lucide-react';

export default function GestionarPublicidad() {
  const { banners, actualizarBanner, eliminarBanner, agregarBanner } = useContextoPublicidad();
  const [bannerEditando, setBannerEditando] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, tipo: 'header' | 'sidebar' | 'inicio') => {
    const file = event.target.files?.[0];
    if (file) {
      // En un caso real, aquí subiríamos el archivo a un servidor
      const reader = new FileReader();
      reader.onloadend = () => {
        const nuevoBanner = {
          id: Date.now().toString(),
          tipo,
          imagen: reader.result as string,
          activo: true
        };
        agregarBanner(nuevoBanner);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestionar Publicidad</h1>

      {/* Sección de Banner Header */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Banner del Encabezado</h2>
        <div className="space-y-4">
          {banners.filter(b => b.tipo === 'header').map(banner => (
            <div key={banner.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    banner.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <button
                    onClick={() => handleToggleActivo(banner)}
                    className="text-sm text-guarico-blue hover:text-guarico-light-blue"
                  >
                    {banner.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEliminar(banner.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <img
                src={banner.imagen}
                alt="Banner preview"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          ))}
          
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e, 'header')}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-guarico-blue hover:border-guarico-blue transition-colors"
            >
              <Upload size={20} className="mr-2" />
              Subir nuevo banner
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Banner Sidebar */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Banner Lateral</h2>
        {/* Similar al banner header */}
      </div>

      {/* Sección de Banner Inicio */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Banner de Inicio</h2>
        {/* Similar al banner header */}
      </div>
    </div>
  );
}