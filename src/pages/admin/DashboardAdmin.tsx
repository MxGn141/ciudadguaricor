import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Image, 
  Users, 
  LogOut, 
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useContextoAuth } from '../../contexts/ContextoAuth';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';
import GestionarNoticias from './GestionarNoticias';
import CrearNoticia from './CrearNoticia';
import GestionarPublicidad from './GestionarPublicidad';
import EstadisticasPanel from './EstadisticasPanel';
import EdicionPDF from './EdicionPDF';

type VistaActiva = 'resumen' | 'noticias' | 'crear' | 'publicidad' | 'estadisticas' | 'pdf';

export default function DashboardAdmin() {
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('resumen');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { estaAutenticado, cerrarSesion } = useContextoAuth();
  const { noticias, publicidades } = useContextoNoticias();

  if (!estaAutenticado) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { id: 'resumen', nombre: 'Resumen', icono: BarChart3 },
    { id: 'noticias', nombre: 'Gestionar Noticias', icono: FileText },
    { id: 'crear', nombre: 'Crear Noticia', icono: Plus },
    { id: 'publicidad', nombre: 'Publicidad', icono: Image },
    { id: 'estadisticas', nombre: 'Estadísticas', icono: Settings },
    { id: 'pdf', nombre: 'Edición PDF', icono: FileText },
  ];

  const noticiasDestacadas = noticias.filter(n => n.destacada).length;
  const noticiasPorSeccion = noticias.reduce((acc, noticia) => {
    acc[noticia.seccion] = (acc[noticia.seccion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderContenido = () => {
    switch (vistaActiva) {
      case 'resumen':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Resumen del Sistema</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <FileText className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Noticias</p>
                    <p className="text-2xl font-bold text-gray-900">{noticias.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Image className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Publicidades</p>
                    <p className="text-2xl font-bold text-gray-900">{publicidades.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Plus className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Noticias Destacadas</p>
                    <p className="text-2xl font-bold text-gray-900">{noticiasDestacadas}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-[#4CAF50]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Secciones Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{Object.keys(noticiasPorSeccion).length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gráfico de noticias por sección */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Noticias por Sección</h3>
              <div className="space-y-4">
                {Object.entries(noticiasPorSeccion).map(([seccion, cantidad]) => (
                  <div key={seccion} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 min-w-[120px]">{seccion}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#4CAF50] h-2.5 rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${(cantidad / Math.max(...Object.values(noticiasPorSeccion))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'noticias':
        return <GestionarNoticias />;
      case 'crear':
        return <CrearNoticia onCreada={() => setVistaActiva('noticias')} />;
      case 'publicidad':
        return <GestionarPublicidad />;
      case 'estadisticas':
        return <EstadisticasPanel />;
      case 'pdf':
        return <EdicionPDF />;
      default:
        return null;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex flex-col items-center py-6 border-b border-gray-200">
        <img src="/logo-admin.png" alt="Logo Admin" className="h-16 w-auto" />
        <h1 className="text-xl font-bold text-gray-900 mt-4">Panel Administrativo</h1>
      </div>
      <nav className="mt-6 flex-1 px-2">
        {menuItems.map((item) => {
          const Icono = item.icono;
          return (
            <button
              key={item.id}
              onClick={() => {
                setVistaActiva(item.id as VistaActiva);
                setSidebarAbierto(false);
              }}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-left transition-all duration-200 ${
                vistaActiva === item.id 
                  ? 'bg-green-50 text-[#4CAF50] shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icono size={20} className="mr-3" />
              {item.nombre}
            </button>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-gray-200">
        <button
          onClick={cerrarSesion}
          className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Móvil */}
      <div className="lg:hidden flex items-center justify-between bg-white shadow-sm px-4 py-2 sticky top-0 z-50">
        <button 
          onClick={() => setSidebarAbierto(true)} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-[#4CAF50]" />
        </button>
        <img src="/logo-admin.png" alt="Logo Admin" className="h-8 w-auto" />
        <button 
          onClick={cerrarSesion} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={24} className="text-[#4CAF50]" />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white shadow-lg min-h-screen sticky top-0">
          <SidebarContent />
        </aside>

        {/* Sidebar Mobile */}
        {sidebarAbierto && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
              onClick={() => setSidebarAbierto(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300">
              <button 
                onClick={() => setSidebarAbierto(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-[#4CAF50]" />
              </button>
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Contenido principal */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContenido()}
          </div>
        </main>
      </div>
    </div>
  );
}