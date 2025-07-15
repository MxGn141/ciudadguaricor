import React, { useState } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

interface Props {
  onCreada: () => void;
}

export default function CrearNoticia({ onCreada }: Props) {
  const { agregarNoticia } = useContextoNoticias();
  const [formulario, setFormulario] = useState({
    titulo: '',
    contenido: '',
    resumen: '',
    imagen: '',
    autorTexto: '',
    autorFoto: '',
    seccion: 'Nacionales',
    destacada: false
  });

  const secciones = ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos'];

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formulario.titulo || !formulario.contenido || !formulario.resumen) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar URL de imagen si se proporciona
    if (formulario.imagen && !formulario.imagen.startsWith('http')) {
      alert('La URL de la imagen debe comenzar con http:// o https://');
      return;
    }
    agregarNoticia({
      ...formulario,
      imagen: formulario.imagen || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
      fechaPublicacion: new Date()
    });

    // Resetear formulario
    setFormulario({
      titulo: '',
      contenido: '',
      resumen: '',
      imagen: '',
      autorTexto: '',
      autorFoto: '',
      seccion: 'Nacionales',
      destacada: false
    });

    alert('Noticia creada exitosamente');
    onCreada();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Noticia</h2>
      
      <form onSubmit={manejarSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título de la Noticia *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formulario.titulo}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ingrese el título de la noticia"
              maxLength={150}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formulario.titulo.length}/150 caracteres</p>
          </div>

          <div>
            <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-2">
              Sección *
            </label>
            <select
              id="seccion"
              name="seccion"
              value={formulario.seccion}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              {secciones.map(seccion => (
                <option key={seccion} value={seccion}>{seccion}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen (opcional)
            </label>
            <input
              type="url"
              id="imagen"
              name="imagen"
              value={formulario.imagen}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Si no se proporciona, se usará una imagen por defecto</p>
          </div>

          <div>
            <label htmlFor="autorTexto" className="block text-sm font-medium text-gray-700 mb-2">
              Autor del Texto
            </label>
            <input
              type="text"
              id="autorTexto"
              name="autorTexto"
              value={formulario.autorTexto}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nombre del periodista"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="autorFoto" className="block text-sm font-medium text-gray-700 mb-2">
              Autor de la Foto
            </label>
            <input
              type="text"
              id="autorFoto"
              name="autorFoto"
              value={formulario.autorFoto}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nombre del fotógrafo"
              maxLength={50}
            />
          </div>
        </div>

        <div>
          <label htmlFor="resumen" className="block text-sm font-medium text-gray-700 mb-2">
            Resumen *
          </label>
          <textarea
            id="resumen"
            name="resumen"
            value={formulario.resumen}
            onChange={manejarCambio}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Resumen breve de la noticia"
            maxLength={300}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{formulario.resumen.length}/300 caracteres</p>
        </div>

        <div>
          <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-2">
            Contenido de la Noticia *
          </label>
          <textarea
            id="contenido"
            name="contenido"
            value={formulario.contenido}
            onChange={manejarCambio}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Contenido completo de la noticia"
            maxLength={5000}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{formulario.contenido.length}/5000 caracteres</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="destacada"
            name="destacada"
            checked={formulario.destacada}
            onChange={manejarCambio}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="destacada" className="ml-2 block text-sm text-gray-900">
            Marcar como noticia destacada
          </label>
        </div>

        {/* Vista previa */}
        {formulario.titulo && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-4">
                {formulario.imagen && (
                  <img
                    src={formulario.imagen}
                    alt="Vista previa"
                    className="w-24 h-16 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                )}
                <div className="flex-1">
                  <span className="inline-block bg-red-600 text-white px-2 py-1 text-xs rounded mb-2">
                    {formulario.seccion}
                  </span>
                  <h4 className="font-bold text-gray-900 mb-1">{formulario.titulo}</h4>
                  {formulario.resumen && (
                    <p className="text-sm text-gray-600 line-clamp-2">{formulario.resumen}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setFormulario({
              titulo: '',
              contenido: '',
              resumen: '',
              imagen: '',
              autorTexto: '',
              autorFoto: '',
              seccion: 'Nacionales',
              destacada: false
            })}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={!formulario.titulo || !formulario.contenido || !formulario.resumen}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} className="mr-2" />
            Guardar Noticia
          </button>
        </div>
      </form>
    </div>
  );
}