import React from 'react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';
import { Calendar, TrendingUp, Eye, Star } from 'lucide-react';

export default function EstadisticasPanel() {
  const { noticias, publicidades } = useContextoNoticias();

  // Calcular estadísticas
  const totalNoticias = noticias.length;
  const noticiasDestacadas = noticias.filter(n => n.destacada).length;
  const totalPublicidades = publicidades.length;
  
  // Noticias por sección
  const noticiasPorSeccion = noticias.reduce((acc, noticia) => {
    acc[noticia.seccion] = (acc[noticia.seccion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Noticias por mes
  const noticiasPorMes = noticias.reduce((acc, noticia) => {
    const mes = noticia.fechaPublicacion.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Autores más activos
  const autoresMasActivos = noticias.reduce((acc, noticia) => {
    if (noticia.autorTexto) {
      acc[noticia.autorTexto] = (acc[noticia.autorTexto] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topAutores = Object.entries(autoresMasActivos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Estadísticas del Portal</h2>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Noticias</p>
              <p className="text-2xl font-bold text-gray-900">{totalNoticias}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Destacadas</p>
              <p className="text-2xl font-bold text-gray-900">{noticiasDestacadas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publicidades</p>
              <p className="text-2xl font-bold text-gray-900">{totalPublicidades}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Secciones</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(noticiasPorSeccion).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Noticias por sección */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Distribución por Sección</h3>
          <div className="space-y-3">
            {Object.entries(noticiasPorSeccion)
              .sort(([,a], [,b]) => b - a)
              .map(([seccion, cantidad]) => (
              <div key={seccion} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{seccion}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(cantidad / Math.max(...Object.values(noticiasPorSeccion))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-6 text-right">{cantidad}</span>
                  <span className="text-xs text-gray-500">
                    ({((cantidad / totalNoticias) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Autores más activos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Autores Más Activos</h3>
          <div className="space-y-3">
            {topAutores.length > 0 ? (
              topAutores.map(([autor, cantidad], index) => (
                <div key={autor} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{autor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{cantidad}</span>
                    <span className="text-xs text-gray-500">artículos</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No hay datos de autores disponibles</p>
            )}
          </div>
        </div>
      </div>

      {/* Actividad por mes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Actividad por Mes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(noticiasPorMes)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([mes, cantidad]) => (
            <div key={mes} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">{mes}</p>
              <p className="text-xl font-bold text-gray-900">{cantidad} noticias</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de publicidad */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Resumen de Publicidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Publicidad del Carrusel</h4>
            <p className="text-2xl font-bold text-blue-600">
              {publicidades.filter(p => p.tipo === 'carrusel').length}
            </p>
            <p className="text-sm text-gray-500">anuncios activos</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Publicidad del Sidebar</h4>
            <p className="text-2xl font-bold text-green-600">
              {publicidades.filter(p => p.tipo === 'sidebar').length}
            </p>
            <p className="text-sm text-gray-500">de 6 espacios disponibles</p>
          </div>
        </div>
      </div>
    </div>
  );
}