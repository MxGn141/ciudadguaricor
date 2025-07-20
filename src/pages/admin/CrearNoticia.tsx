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
    autorTexto: '',
    autorFoto: '',
    seccion: 'Nacionales',
    destacada: false
  });
  const [imagen, setImagen] = useState<File | null>(null);

  const secciones = ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos'];

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const manejarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulario.titulo || !formulario.contenido || !formulario.resumen || !imagen) {
      alert('Por favor completa todos los campos obligatorios y selecciona una imagen');
      return;
    }
    const formData = new FormData();
    Object.entries(formulario).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('imagen', imagen);
    try {
      await agregarNoticia(formData);
      alert('Noticia creada exitosamente');
      setFormulario({
        titulo: '',
        contenido: '',
        resumen: '',
        autorTexto: '',
        autorFoto: '',
        seccion: 'Nacionales',
        destacada: false
      });
      setImagen(null);
      onCreada();
    } catch (error) {
      alert('Error al crear la noticia');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Noticia</h2>
      <form onSubmit={manejarSubmit} encType="multipart/form-data" className="bg-white rounded-lg shadow-md p-6 space-y-6">
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
              Imagen de la Noticia *
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={manejarImagen}
              className="w-full"
              required
            />
            {imagen && <p className="text-xs text-gray-500 mt-1">{imagen.name}</p>}
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

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormulario({
                titulo: '',
                contenido: '',
                resumen: '',
                autorTexto: '',
                autorFoto: '',
                seccion: 'Nacionales',
                destacada: false
              });
              setImagen(null);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={!formulario.titulo || !formulario.contenido || !formulario.resumen || !imagen}
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