import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useContextoAuth } from './ContextoAuth';
import { debounce } from 'lodash';

export interface Noticia {
  id: string | number;
  titulo: string;
  contenido: string;
  resumen: string;
  seccion: {
    id: number;
    nombre: string;
  } | null;
  autorTexto: string;
  autorFoto: string;
  media: { url: string; tipo: string; descripcion?: string }[];
  fecha_publicacion: Date | string;
  destacada?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Publicidad {
  id: string | number;
  imagen: string;
  url?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  descripcion?: string;
  posicion: string;
  visible?: boolean;
}

export interface ContenidoDestacado {
  id: string | number;
  media: string; // antes: imagen
  url?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  titulo?: string; // antes: descripcion
  ubicacion: string; // antes: posicion
  visible?: boolean;
}

interface ContextoNoticiasType {
  noticias: Noticia[];
  publicidades: Publicidad[];
  contenidosDestacados: ContenidoDestacado[];
  agregarNoticia: (formData: FormData) => Promise<void>;
  editarNoticia: (id: string, noticia: Partial<Noticia>) => Promise<void>;
  eliminarNoticia: (id: string) => Promise<void>;
  agregarPublicidad: (publicidad: Omit<Publicidad, 'id'>) => void;
  eliminarPublicidad: (id: string) => void;
  agregarContenidoDestacado: (contenido: Omit<ContenidoDestacado, 'id'>) => void;
  eliminarContenidoDestacado: (id: string) => void;
  obtenerNoticiasPorSeccion: (seccion: string) => Promise<Noticia[]>;
  obtenerNoticiaPorId: (id: string) => Noticia | undefined;
  setTerminoBusqueda: (termino: string) => void;
  cargandoBusqueda: boolean;
}

const ContextoNoticias = createContext<ContextoNoticiasType | undefined>(undefined);

// Publicidades iniciales para que el carrusel funcione mientras se cargan los banners
const publicidadesIniciales: Publicidad[] = [
  {
    id: '1',
    imagen: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400',
    posicion: 'header-bg',
    descripcion: 'Banco Regional Guárico',
    visible: true
  },
  {
    id: '2',
    imagen: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    posicion: 'main-1',
    descripcion: 'Supermercados El Llano',
    visible: true
  }
];

const API_URL = 'https://ciudadguaricor.onrender.com/api'; // Backend en producción

export function ProveedorContextoNoticias({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [publicidades, setPublicidades] = useState<Publicidad[]>(publicidadesIniciales);
  const [contenidosDestacados, setContenidosDestacados] = useState<ContenidoDestacado[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const { token } = useContextoAuth();

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Cargar contenidos destacados activos y visibles desde el backend
  const cargarContenidosDestacados = async () => {
    try {
      console.log('Cargando contenidos destacados desde:', `${API_URL}/content/contenido-destacado`);
      const response = await axios.get(`${API_URL}/content/contenido-destacado`);
      console.log('Respuesta de contenidos destacados:', response.data);
      
      // Cargar todos los contenidos destacados del backend
      const contenidosDelBackend = response.data.map((c: any) => ({
        ...c,
        media: c.media, // URL directa de Cloudinary
        // Agregar campos necesarios para el carrusel
        titulo: c.titulo,
        ubicacion: c.ubicacion,
        tipo: c.ubicacion === 'carrusel' ? 'carrusel' : 'banner'
      }));
      
      console.log('Contenidos destacados procesados:', contenidosDelBackend);
      setContenidosDestacados(contenidosDelBackend);
    } catch (error) {
      console.error('Error al cargar contenidos destacados:', error);
      // Mantener los contenidos iniciales si hay error
    }
  };

  // Búsqueda global en el backend en tiempo real (autosuggest)
  React.useEffect(() => {
    let cancelado = false;
    const buscarNoticias = async () => {
      if (terminoBusqueda.trim().length === 0) {
        setCargandoBusqueda(true);
        await cargarNoticias();
        setCargandoBusqueda(false);
        return;
      }
      setCargandoBusqueda(true);
      try {
        const response = await axios.get(`${API_URL}/news?search=${encodeURIComponent(terminoBusqueda)}`);
        if (!cancelado) {
          const noticiasMapeadas = response.data.map((noticia: any) => ({
            id: noticia.id,
            titulo: noticia.titulo,
            contenido: noticia.contenido,
            resumen: noticia.resumen,
            seccion: noticia.seccion,
            autorTexto: noticia.autorTexto,
            autorFoto: noticia.autorFoto,
            media: (noticia.media || []).map((m: any) => ({
              ...m,
              url: m.url // URL directa de Cloudinary
            })),
            fecha_publicacion: noticia.fecha_publicacion,
            destacada: noticia.destacada,
            created_at: noticia.created_at,
            updated_at: noticia.updated_at
          }));
          setNoticias(noticiasMapeadas || []);
        }
      } catch (error) {
        if (!cancelado) setNoticias([]);
      } finally {
        if (!cancelado) setCargandoBusqueda(false);
      }
    };
    const timeout = setTimeout(buscarNoticias, 250);
    return () => {
      cancelado = true;
      clearTimeout(timeout);
    };
  }, [terminoBusqueda]);

  useEffect(() => {
    cargarNoticias();
    cargarContenidosDestacados(); // Cargar contenidos destacados
  }, []);

  const cargarNoticias = async () => {
    try {
      console.log('Cargando noticias desde:', `${API_URL}/news`);
      const response = await axios.get(`${API_URL}/news`);
      console.log('Respuesta del backend:', response.data);
      // Mapear la nueva estructura
      const noticiasMapeadas = response.data.map((noticia: any) => ({
        id: noticia.id,
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        resumen: noticia.resumen,
        seccion: noticia.seccion,
        autorTexto: noticia.autorTexto,
        autorFoto: noticia.autorFoto,
        media: (noticia.media || []).map((m: any) => ({
          ...m,
          url: m.url && m.url.startsWith('/uploads') ? `https://ciudadguaricor.onrender.com${m.url}` : m.url
        })),
        fecha_publicacion: noticia.fecha_publicacion,
        destacada: noticia.destacada,
        created_at: noticia.created_at,
        updated_at: noticia.updated_at
      }));
      setNoticias(noticiasMapeadas || []);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      setNoticias([]);
    }
  };

  // Cambiado para aceptar FormData
  const agregarNoticia = async (formData: FormData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.post(`${API_URL}/news`, formData, config);
      // Procesar la imagen de la noticia recién creada
      const noticiaConImagen = {
        ...response.data,
        imagen: response.data.imagen // URL directa de Cloudinary
      };
      setNoticias(prev => [noticiaConImagen, ...prev]);
    } catch (error) {
      console.error('Error al agregar noticia:', error);
      throw error;
    }
  };

  const editarNoticia = async (id: string, cambios: Partial<Noticia>) => {
    try {
      const response = await axios.put(`${API_URL}/news/${id}`, cambios, config);
    setNoticias(prev => prev.map(noticia => 
        noticia.id === id ? response.data : noticia
    ));
    } catch (error) {
      console.error('Error al editar noticia:', error);
      throw error;
    }
  };

  const eliminarNoticia = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/news/${id}`, config);
    setNoticias(prev => prev.filter(noticia => noticia.id !== id));
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
      throw error;
    }
  };

  const agregarPublicidad = (nuevaPublicidad: Omit<Publicidad, 'id'>) => {
    const publicidad: Publicidad = {
      ...nuevaPublicidad,
      id: Date.now().toString(),
    };
    setPublicidades(prev => [publicidad, ...prev]);
  };

  const eliminarPublicidad = (id: string) => {
    setPublicidades(prev => prev.filter(pub => pub.id !== id));
  };

  const agregarContenidoDestacado = (nuevoContenido: Omit<ContenidoDestacado, 'id'>) => {
    const contenido: ContenidoDestacado = {
      ...nuevoContenido,
      id: Date.now().toString(),
    };
    setContenidosDestacados(prev => [contenido, ...prev]);
  };

  const eliminarContenidoDestacado = (id: string) => {
    setContenidosDestacados(prev => prev.filter(cont => cont.id !== id));
  };

  const obtenerNoticiasPorSeccion = async (seccion: string): Promise<Noticia[]> => {
    try {
      const response = await axios.get(`${API_URL}/news/section/${seccion}`);
      return response.data.map((noticia: any) => ({
        id: noticia.id,
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        resumen: noticia.resumen,
        seccion: noticia.seccion,
        autorTexto: noticia.autorTexto,
        autorFoto: noticia.autorFoto,
        media: (noticia.media || []).map((m: any) => ({
          ...m,
          url: m.url && m.url.startsWith('/uploads') ? `https://ciudadguaricor.onrender.com${m.url}` : m.url
        })),
        fecha_publicacion: noticia.fecha_publicacion,
        destacada: noticia.destacada,
        created_at: noticia.created_at,
        updated_at: noticia.updated_at
      }));
    } catch (error) {
      return [];
    }
  };

  const obtenerNoticiaPorId = (id: string) => {
    return noticias.find(n => n.id === id || n.id === Number(id));
  };

  // Filtrar noticias por término de búsqueda global
  const noticiasFiltradas = terminoBusqueda.trim().length > 0
    ? noticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        noticia.resumen.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        noticia.autorTexto.toLowerCase().includes(terminoBusqueda.toLowerCase())
      )
    : noticias;

  return (
    <ContextoNoticias.Provider value={{
      noticias,
      publicidades,
      contenidosDestacados, // Agregar contenidos destacados al contexto
      agregarNoticia,
      editarNoticia,
      eliminarNoticia,
      agregarPublicidad,
      eliminarPublicidad,
      agregarContenidoDestacado,
      eliminarContenidoDestacado,
      obtenerNoticiasPorSeccion,
      obtenerNoticiaPorId,
      setTerminoBusqueda,
      cargandoBusqueda
    }}>
      {children}
    </ContextoNoticias.Provider>
  );
}

export function useContextoNoticias() {
  const contexto = useContext(ContextoNoticias);
  if (contexto === undefined) {
    throw new Error('useContextoNoticias debe usarse dentro de ProveedorContextoNoticias');
  }
  return contexto;
}