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

interface ContextoNoticiasType {
  noticias: Noticia[];
  publicidades: Publicidad[];
  agregarNoticia: (formData: FormData) => Promise<void>;
  editarNoticia: (id: string, noticia: Partial<Noticia>) => Promise<void>;
  eliminarNoticia: (id: string) => Promise<void>;
  agregarPublicidad: (publicidad: Omit<Publicidad, 'id'>) => void;
  eliminarPublicidad: (id: string) => void;
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

const API_URL = 'http://localhost:3000/api'; // Backend en puerto 3000

export function ProveedorContextoNoticias({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [publicidades, setPublicidades] = useState<Publicidad[]>(publicidadesIniciales);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const { token } = useContextoAuth();

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Cargar publicidades activas y visibles desde el backend
  const cargarPublicidades = async () => {
    try {
      console.log('Cargando publicidades desde:', `${API_URL}/content/banners`);
      const response = await axios.get(`${API_URL}/content/banners`);
      console.log('Respuesta de banners:', response.data);
      
      // Cargar todos los banners del backend
      const bannersDelBackend = response.data.map((b: any) => ({
        ...b,
        imagen: b.imagen && b.imagen.startsWith('/uploads') ? `http://localhost:3000${b.imagen}` : b.imagen,
        // Agregar campos necesarios para el carrusel
        titulo: b.descripcion,
        posicion: b.posicion,
        tipo: b.posicion === 'carrusel' ? 'carrusel' : 'banner'
      }));
      
      console.log('Banners procesados:', bannersDelBackend);
      
      if (bannersDelBackend.length > 0) {
        setPublicidades(bannersDelBackend);
        console.log('Banners cargados en el estado:', bannersDelBackend);
      } else {
        console.log('No hay banners del backend, usando iniciales');
        setPublicidades(publicidadesIniciales);
      }
    } catch (error) {
      console.error('Error al cargar publicidades:', error);
      console.log('Manteniendo publicidades iniciales debido al error');
      setPublicidades(publicidadesIniciales);
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
              url: m.url && m.url.startsWith('/uploads') ? `http://localhost:3000${m.url}` : m.url
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
    cargarPublicidades();
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
          url: m.url && m.url.startsWith('/uploads') ? `http://localhost:3000${m.url}` : m.url
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
        imagen: response.data.imagen ? `http://localhost:3000${response.data.imagen}` : response.data.imagen
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
          url: m.url && m.url.startsWith('/uploads') ? `http://localhost:3000${m.url}` : m.url
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
      agregarNoticia,
      editarNoticia,
      eliminarNoticia,
      agregarPublicidad,
      eliminarPublicidad,
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