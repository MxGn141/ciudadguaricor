import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';
import axios from 'axios';
// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

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
  // TipTap editor para el contenido
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
    onUpdate: ({ editor }) => {
      setFormulario(prev => ({ ...prev, contenido: editor.getHTML() }));
    },
  });
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
      // Limpiar también el editor
      if (editor) {
        editor.commands.setContent('');
      }
      onCreada();
    } catch (error) {
      mostrarNotificacion('Error al crear la noticia', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {notificacion && <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} onClose={() => setNotificacion(null)} />}
      
      {/* Estilos CSS para el editor TipTap */}
      <style>{`
        .editor-container .ProseMirror {
          min-height: 400px !important;
          padding: 16px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          outline: none !important;
          border: none !important;
          width: 100% !important;
          box-sizing: border-box !important;
          color: #374151 !important;
        }
        
        .editor-container .ProseMirror:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .editor-container .ProseMirror p {
          margin: 0 0 12px 0 !important;
        }
        
        .editor-container .ProseMirror p:last-child {
          margin-bottom: 0 !important;
        }
        
        .editor-container .ProseMirror img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          margin: 16px 0 !important;
          display: block !important;
        }
        
        .editor-container .ProseMirror.is-editor-empty:first-child::before {
          color: #9ca3af !important;
          content: "Escribe aquí el contenido de tu noticia. Puedes insertar imágenes usando el botón de arriba..." !important;
          float: left !important;
          height: 0 !important;
          pointer-events: none !important;
        }
        
        .editor-container .ProseMirror h1, 
        .editor-container .ProseMirror h2, 
        .editor-container .ProseMirror h3 {
          font-weight: bold !important;
          margin: 24px 0 16px 0 !important;
        }
        
        .editor-container .ProseMirror h1 { font-size: 24px !important; }
        .editor-container .ProseMirror h2 { font-size: 20px !important; }
        .editor-container .ProseMirror h3 { font-size: 18px !important; }
        
        .editor-container .ProseMirror ul, 
        .editor-container .ProseMirror ol {
          margin: 12px 0 !important;
          padding-left: 24px !important;
        }
        
        .editor-container .ProseMirror li {
          margin: 4px 0 !important;
        }
      `}</style>

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

        {/* EDITOR DE CONTENIDO MEJORADO */}
        <div>
          <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-2">
            Contenido de la Noticia *
          </label>
          
          {/* Contenedor principal del editor */}
          <div className="editor-container border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
            {/* Barra de herramientas */}
            <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                onClick={() => document.getElementById('input-img-editor')?.click()}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                </svg>
                Insertar imagen
              </button>
              
              <input
                type="file"
                id="input-img-editor"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  if (!e.target.files || !e.target.files[0] || !editor) return;
                  const file = e.target.files[0];
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const res = await fetch('https://ciudadguaricor.onrender.com/api/media', {
                      method: 'POST',
                      body: formData
                    });
                    if (!res.ok) throw new Error('Error al subir la imagen');
                    const data = await res.json();
                    if (!data.url) throw new Error('No se obtuvo la URL de la imagen');
                    editor.chain().focus().setImage({ src: data.url }).run();
                    mostrarNotificacion('Imagen insertada correctamente', 'exito');
                  } catch (err) {
                    mostrarNotificacion('Error al subir la imagen', 'error');
                  } finally {
                    e.target.value = '';
                  }
                }}
              />
            </div>
            
            {/* Área del editor - con altura mínima grande */}
            <div className="min-h-[400px] w-full">
              <EditorContent 
                editor={editor}
                className="w-full h-full"
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {formulario.contenido.replace(/<[^>]+>/g, '').length}/5000 caracteres (texto)
          </p>
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
              // Limpiar también el editor
              if (editor) {
                editor.commands.setContent('');
              }
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