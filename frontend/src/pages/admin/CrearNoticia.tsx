import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';
import axios from 'axios';

// Notificación flotante
function Notificacion({ mensaje, tipo, onClose }: { mensaje: string, tipo: 'exito' | 'error', onClose: () => void }) {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white transition-all animate-fade-in-down ${tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'}`}
      style={{ minWidth: 220 }}>
      <div className="flex items-center justify-between gap-4">
        <span>{mensaje}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 font-bold">×</button>
      </div>
    </div>
  );
}

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
    autorTexto: '',
    autorFoto: '',
    destacada: false
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [notificacion, setNotificacion] = useState<{ mensaje: string, tipo: 'exito' | 'error' } | null>(null);

  useEffect(() => {
    axios.get('https://ciudadguaricor.onrender.com/api/sections').then(res => {
      setSecciones(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3500);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'select-one' ? String(value) : value)
    }));
  };

  const manejarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulario.titulo || !formulario.contenido || !formulario.resumen || !formulario.seccion_id || !imagen) {
      mostrarNotificacion('Por favor completa todos los campos obligatorios y selecciona una imagen', 'error');
      return;
    }
    let mediaIds: number[] = [];
    try {
      // Usa la URL absoluta para el backend
      const formDataImg = new FormData();
      formDataImg.append('file', imagen);
      const res = await axios.post('https://ciudadguaricor.onrender.com/api/media', formDataImg, { headers: { 'Content-Type': 'multipart/form-data' } });
      mediaIds = [res.data.id];
    } catch (err) {
      mostrarNotificacion('Error al subir la imagen', 'error');
      return;
    }
    const noticiaForm = new FormData();
    noticiaForm.append('titulo', formulario.titulo);
    noticiaForm.append('contenido', formulario.contenido);
    noticiaForm.append('resumen', formulario.resumen);
    noticiaForm.append('seccion_id', formulario.seccion_id);
    noticiaForm.append('autorTexto', formulario.autorTexto);
    noticiaForm.append('autorFoto', formulario.autorFoto);
    noticiaForm.append('destacada', String(formulario.destacada));
    mediaIds.forEach(id => noticiaForm.append('media', String(id)));
    try {
      await agregarNoticia(noticiaForm);
      mostrarNotificacion('Noticia creada exitosamente', 'exito');
      setFormulario({
        titulo: '',
        contenido: '',
        resumen: '',
        seccion_id: '',
        autorTexto: '',
        autorFoto: '',
        destacada: false
      });
      setImagen(null);
      onCreada();
    } catch (error) {
      mostrarNotificacion('Error al crear la noticia', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {notificacion && <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} onClose={() => setNotificacion(null)} />}
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
              {(Array.isArray(secciones) ? secciones : []).map(seccion => (
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
            <label htmlFor="autorTexto" className="block text-sm font-medium text-gray-700 mb-2">
              Autor de Texto *
            </label>
            <input
              type="text"
              id="autorTexto"
              name="autorTexto"
              value={formulario.autorTexto}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nombre del autor de texto"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="autorFoto" className="block text-sm font-medium text-gray-700 mb-2">
              Autor de Foto *
            </label>
            <input
              type="text"
              id="autorFoto"
              name="autorFoto"
              value={formulario.autorFoto}
              onChange={manejarCambio}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nombre del autor de foto"
              required
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
                seccion_id: '',
                autorTexto: '',
                autorFoto: '',
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