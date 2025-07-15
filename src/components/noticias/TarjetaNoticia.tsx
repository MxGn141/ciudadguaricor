import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Camera } from 'lucide-react';
import { Noticia } from '../../contexts/ContextoNoticias';

interface Props {
  noticia: Noticia;
  tamaño?: 'pequeño' | 'mediano' | 'grande';
}

export default function TarjetaNoticia({ noticia, tamaño = 'mediano' }: Props) {
  const clasesTamaño = {
    pequeño: 'text-sm',
    mediano: 'text-base',
    grande: 'text-lg'
  };

  const clasesImagen = {
    pequeño: 'h-32',
    mediano: 'h-40',
    grande: 'h-48'
  };

  return (
    <Link to={`/noticia/${noticia.id}`} className="block">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={noticia.imagen}
            alt={noticia.titulo}
            className={`w-full object-cover transition-transform duration-300 hover:scale-110 ${clasesImagen[tamaño]}`}
          />
          <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded shadow-md">
            {noticia.seccion}
          </span>
        </div>
      
        <div className="p-4">
          <h3 className={`font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors ${clasesTamaño[tamaño]} line-clamp-2`}>
            {noticia.titulo}
          </h3>
        
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {noticia.resumen}
          </p>
        
          <div className="flex flex-col space-y-1 text-xs text-gray-500">
            <div className="flex items-center">
              <User size={12} className="mr-1" />
              <span>Por {noticia.autorTexto}</span>
            </div>
            <div className="flex items-center">
              <Camera size={12} className="mr-1" />
              <span>Foto: {noticia.autorFoto}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{noticia.fechaPublicacion.toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}