import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';
import axios from 'axios';

interface Props {
  onCreada: () => void;
}

interface Seccion {
  id: number;
  nombre: string;
}

interface Autor {
  id: number;
  nombre: string;
}

export default function CrearNoticia({ onCreada }: Props) {
  const { agregarNoticia } = useContextoNoticias();
  const [formulario, setFormulario] = useState({
    titulo: '',
    contenido: '',
    resumen: '',
    seccion_id: '',
    autores: [] as string[],
    destacada: false
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);

  useEffect(() => {
    // Cargar secciones y autores desde el backend
    axios.get('/api/sections').then(res => setSecciones(res.data));
    axios.get('/api/authors').then(res => setAutores(res.data));
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'autores') {
      const options = (e.target as HTMLSelectElement).options;
      const values = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormulario(prev => ({ ...prev, autores: values }));
    } else {
      setFormulario(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const manejarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulario.titulo || !formulario.contenido || !formulario.resumen || !formulario.seccion_id || !imagen) {
      alert('Por favor completa todos los campos obligatorios y selecciona una imagen');
      return;
    }
    // Subir la imagen primero (puedes adaptar esto a tu endpoint de media)
    let mediaIds: number[] = [];
    if (imagen) {
      const formDataImg = new FormData();
      formDataImg.append('file', imagen);
      const res = await axios.post('/api/media', formDataImg, { headers: { 'Content-Type': 'multipart/form-data' } });
      mediaIds = [res.data.id];
    }
    // Armar el objeto para el backend
    const noticiaPayload = {
      titulo: formulario.titulo,
      contenido: formulario.contenido,
      resumen: formulario.resumen,
      seccion_id: Number(formulario.seccion_id),
      autores: formulario.autores.map(Number),
      media: mediaIds,
      destacada: formulario.destacada
    };
    try {
      await agregarNoticia(noticiaPayload);
      alert('Noticia creada exitosamente');
      setFormulario({
        titulo: '',
        contenido: '',
        resumen: '',
        seccion_id: '',
        autores: [],
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
            <label htmlFor="seccion_id" className="block text-sm font-medium text-gray-700 mb-2">
              Sección *
            </label>
            <select
              id="seccion_id"
              name="seccion_id"
              value={formulario.seccion_id}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Seleccione una sección</option>
              {secciones.map(seccion => (
                <option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>
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

          <div className="md:col-span-2">
            <label htmlFor="autores" className="block text-sm font-medium text-gray-700 mb-2">
              Autores *
            </label>
            <select
              id="autores"
              name="autores"
              multiple
              value={formulario.autores}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              {autores.map(autor => (
                <option key={autor.id} value={autor.id}>{autor.nombre}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Puede seleccionar uno o varios autores (Ctrl+Click)</p>
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
                seccion_id: '',
                autores: [],
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
            disabled={!formulario.titulo || !formulario.contenido || !formulario.resumen || !formulario.seccion_id || !imagen}
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