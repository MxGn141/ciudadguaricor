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
  Menu
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Noticias</p>
                    <p className="text-2xl font-bold text-gray-900">{noticias.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Image className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Publicidades</p>
                    <p className="text-2xl font-bold text-gray-900">{publicidades.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Plus className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Noticias Destacadas</p>
                    <p className="text-2xl font-bold text-gray-900">{noticiasDestacadas}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
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
              <div className="space-y-3">
                {Object.entries(noticiasPorSeccion).map(([seccion, cantidad]) => (
                  <div key={seccion} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{seccion}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${(cantidad / Math.max(...Object.values(noticiasPorSeccion))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{cantidad}</span>
                    </div>
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

  return (
    <div className="min-h-screen bg-gray-100 flex md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg h-screen fixed md:static left-0 top-0 z-40">
        <div className="flex flex-col items-center py-6 border-b">
          <img src="/logo-admin.png" alt="Logo Admin" className="h-16 w-auto mb-2" />
          <h1 className="text-xl font-bold text-gray-900 mt-2">Panel Administrativo</h1>
        </div>
        <nav className="mt-6 flex-1">
          {menuItems.map((item) => {
            const Icono = item.icono;
            return (
              <button
                key={item.id}
                onClick={() => setVistaActiva(item.id as VistaActiva)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  vistaActiva === item.id ? 'bg-red-50 border-r-4 border-red-600 text-red-600' : 'text-gray-700'
                }`}
              >
                <Icono size={20} className="mr-3" />
                {item.nombre}
              </button>
            );
          })}
        </nav>
        <div className="p-6 mt-auto">
          <button
            onClick={cerrarSesion}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
      {/* Sidebar Mobile */}
      <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-2 sticky top-0 z-50">
        <button onClick={() => setSidebarAbierto(true)} className="p-2 text-red-600"><Menu size={28} /></button>
        <img src="/logo-admin.png" alt="Logo Admin" className="h-10 w-auto" />
        <button onClick={cerrarSesion} className="p-2 text-gray-700"><LogOut size={24} /></button>
      </div>
      {sidebarAbierto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <aside className="w-64 bg-white shadow-lg h-screen flex flex-col">
            <div className="flex flex-col items-center py-6 border-b">
              <img src="/logo-admin.png" alt="Logo Admin" className="h-16 w-auto mb-2" />
              <h1 className="text-xl font-bold text-gray-900 mt-2">Panel Administrativo</h1>
            </div>
            <nav className="mt-6 flex-1">
              {menuItems.map((item) => {
                const Icono = item.icono;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setVistaActiva(item.id as VistaActiva); setSidebarAbierto(false); }}
                    className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                      vistaActiva === item.id ? 'bg-red-50 border-r-4 border-red-600 text-red-600' : 'text-gray-700'
                    }`}
                  >
                    <Icono size={20} className="mr-3" />
                    {item.nombre}
                  </button>
                );
              })}
            </nav>
            <div className="p-6 mt-auto">
              <button
                onClick={cerrarSesion}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                Cerrar Sesión
              </button>
            </div>
            <button onClick={() => setSidebarAbierto(false)} className="absolute top-4 right-4 text-gray-500 text-2xl">×</button>
          </aside>
          <div className="flex-1" onClick={() => setSidebarAbierto(false)} />
        </div>
      )}
      {/* Contenido principal */}
      <main className="flex-1 min-w-0 ml-0 md:ml-64 p-4 md:p-8 overflow-x-auto">{renderContenido()}</main>
    </div>
  );
}