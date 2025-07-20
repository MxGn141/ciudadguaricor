import React from 'react';
import { Link } from 'react-router-dom';
import { Noticia } from '../../contexts/ContextoNoticias';

interface Props {
  noticia: Noticia;
}

export default function TarjetaNoticia({ noticia }: Props) {
  // Función para convertir fecha a Date si es string
  const convertirFecha = (fecha: Date | string): Date => {
    if (fecha instanceof Date) {
      return fecha;
    }
    return new Date(fecha);
  };

  // Obtener la imagen principal desde media
  const imagenPrincipal = noticia.media?.find(m => m.tipo === 'imagen')?.url || '';
  // Obtener autores como string
  const autores = [noticia.autorTexto, noticia.autorFoto].filter(Boolean).join(' / ');
  // Obtener nombre de la sección
  const nombreSeccion = noticia.seccion?.nombre || '';

  return (
    <Link 
      to={`/noticia/${noticia.id}`} 
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
          <img
            src={imagenPrincipal}
            alt={noticia.titulo}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
            {nombreSeccion}
          </span>
          <time className="text-gray-500 text-xs">
            {convertirFecha(noticia.fecha_publicacion).toLocaleDateString('es-ES')}
          </time>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600">
            {noticia.titulo}
          </h3>
        <p className="text-gray-600 line-clamp-3 text-sm mb-4">
            {noticia.resumen}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">{autores}</span>
          <time className="text-xs text-gray-500">
            {convertirFecha(noticia.fecha_publicacion).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </time>
        </div>
      </div>
    </Link>
  );
}