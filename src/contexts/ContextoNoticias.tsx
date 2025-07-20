import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useContextoAuth } from './ContextoAuth';

export interface Noticia {
  id: string | number;
  titulo: string;
  contenido: string;
  resumen: string;
  imagen: string;
  autorTexto: string;
  autorFoto: string;
  seccion: string;
  fechaPublicacion: Date | string;
  destacada?: boolean;
}

export interface Publicidad {
  id: string;
  titulo: string;
  imagen: string;
  enlace?: string;
  tipo: 'carrusel' | 'sidebar';
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
}

const ContextoNoticias = createContext<ContextoNoticiasType | undefined>(undefined);

const noticiasIniciales: Noticia[] = [
  {
    id: '1',
    titulo: 'Ministro Ñáñez acusa a El País de España de impulsar una campaña sucia contra Venezuela',
    contenido: 'El medio español reseña las declaraciones del fiscal chileno Héctor Barros quien afirmó que "el asesinato del exteniente, Ronald Ojeda, habría sido planificado en Caracas por motivos políticos"',
    resumen: 'El medio español reseña las declaraciones del fiscal chileno Héctor Barros quien afirmó que el asesinato habría sido planificado en Caracas.',
    imagen: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'María González',
    autorFoto: 'Carlos Rodríguez',
    seccion: 'Nacionales',
    fechaPublicacion: new Date(),
    destacada: true
  },
  {
    id: '2',
    titulo: 'Presidente Maduro y Yulimar Rojas: Atletas irán a París inspirados con tu ejemplo',
    contenido: 'La atleta fue sometida a una operación por lo que no participará en los Juegos Olímpicos que se realizarán entre julio y agosto',
    resumen: 'La atleta fue sometida a una operación por lo que no participará en los Juegos Olímpicos.',
    imagen: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Luis Pérez',
    autorFoto: 'Ana Martínez',
    seccion: 'Deportes',
    fechaPublicacion: new Date(),
    destacada: true
  },
  {
    id: '3',
    titulo: 'Diosdado Cabello recordó a los jóvenes que sin la Revolución, Venezuela era un país de excluidos',
    contenido: 'Desde el Parque Alí Primera, Cabello encabezó el acto para conmemorar junto a los jóvenes los 22 años del Golpe Fascista',
    resumen: 'Desde el Parque Alí Primera, Cabello encabezó el acto para conmemorar los 22 años del Golpe Fascista.',
    imagen: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Roberto Silva',
    autorFoto: 'Carmen López',
    seccion: 'Nacionales',
    fechaPublicacion: new Date(),
    destacada: true
  },
  {
    id: '4',
    titulo: 'Misión exploratoria de la Unión Europea sostiene reunión con autoridades del TSJ',
    contenido: 'También estuvo presente representante la viceministra para Europa del Ministerio de Relaciones Exteriores, Coromoto Godoy',
    resumen: 'También estuvo presente representante la viceministra para Europa del Ministerio de Relaciones Exteriores.',
    imagen: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Ana Rodríguez',
    autorFoto: 'Pedro Martín',
    seccion: 'Nacionales',
    fechaPublicacion: new Date(),
    destacada: true
  },
  {
    id: '5',
    titulo: 'Pobreza, escapar del círculo vicioso',
    contenido: 'Análisis sobre las políticas públicas necesarias para combatir la pobreza estructural en Venezuela',
    resumen: 'Análisis sobre las políticas públicas necesarias para combatir la pobreza estructural.',
    imagen: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'David Uzcátegui',
    autorFoto: 'María Fernández',
    seccion: 'Cultura',
    fechaPublicacion: new Date(),
    destacada: true
  },
  {
    id: '6',
    titulo: 'El pueblo',
    contenido: 'Reflexiones sobre la participación ciudadana en los procesos democráticos venezolanos',
    resumen: 'Reflexiones sobre la participación ciudadana en los procesos democráticos.',
    imagen: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Jean Maninat',
    autorFoto: 'Carlos Vega',
    seccion: 'Cultura',
    fechaPublicacion: new Date(),
    destacada: false
  },
  {
    id: '7',
    titulo: 'Misericordia',
    contenido: 'Columna de opinión sobre los valores humanos en tiempos de crisis',
    resumen: 'Columna de opinión sobre los valores humanos en tiempos de crisis.',
    imagen: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Soledad Morillo Belloso',
    autorFoto: 'Ana López',
    seccion: 'Sociales',
    fechaPublicacion: new Date(),
    destacada: false
  },
  // Noticias de Sucesos
  {
    id: '37',
    titulo: 'Bomberos controlan incendio en zona industrial',
    contenido: 'Rápida acción de los cuerpos de seguridad evita daños mayores en incidente.',
    resumen: 'Efectiva respuesta ante emergencia industrial.',
    imagen: 'https://images.pexels.com/photos/6061750/pexels-photo-6061750.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Roberto Méndez',
    autorFoto: 'María Sánchez',
    seccion: 'Sucesos',
    fechaPublicacion: new Date(),
    destacada: true
  },
  {
    id: '38',
    titulo: 'Protección Civil realiza simulacro de emergencia',
    contenido: 'Ejercicio de preparación involucra a múltiples organismos de seguridad.',
    resumen: 'Exitoso simulacro fortalece respuesta ante emergencias.',
    imagen: 'https://images.pexels.com/photos/6062557/pexels-photo-6062557.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Carlos López',
    autorFoto: 'Ana Torres',
    seccion: 'Sucesos',
    fechaPublicacion: new Date(Date.now() - 86400000),
    destacada: false
  },
  {
    id: '39',
    titulo: 'Rescatan excursionistas en Parque Nacional',
    contenido: 'Grupos especializados logran exitoso rescate de grupo extraviado.',
    resumen: 'Operativo de rescate culmina con éxito.',
    imagen: 'https://images.pexels.com/photos/6062573/pexels-photo-6062573.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Miguel Ángel',
    autorFoto: 'Patricia Blanco',
    seccion: 'Sucesos',
    fechaPublicacion: new Date(Date.now() - 172800000),
    destacada: false
  },
  {
    id: '40',
    titulo: 'Policía recupera vehículos robados',
    contenido: 'Operativo especial permite la recuperación de varios vehículos sustraídos.',
    resumen: 'Exitoso operativo policial contra el robo de vehículos.',
    imagen: 'https://images.pexels.com/photos/6062574/pexels-photo-6062574.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Pedro Ramírez',
    autorFoto: 'Laura González',
    seccion: 'Sucesos',
    fechaPublicacion: new Date(Date.now() - 259200000),
    destacada: false
  },
  {
    id: '41',
    titulo: 'Capacitan a comunidades en prevención de riesgos',
    contenido: 'Programa especial forma a líderes comunitarios en gestión de emergencias.',
    resumen: 'Comunidades mejor preparadas ante emergencias.',
    imagen: 'https://images.pexels.com/photos/6062575/pexels-photo-6062575.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Andrea Torres',
    autorFoto: 'José Martínez',
    seccion: 'Sucesos',
    fechaPublicacion: new Date(Date.now() - 345600000),
    destacada: false
  },
  {
    id: '42',
    titulo: 'Bomberos realizan jornada preventiva',
    contenido: 'Cuerpo de bomberos inspecciona establecimientos comerciales.',
    resumen: 'Importante labor preventiva de los bomberos.',
    imagen: 'https://images.pexels.com/photos/6062576/pexels-photo-6062576.jpeg?auto=compress&cs=tinysrgb&w=800',
    autorTexto: 'Luis García',
    autorFoto: 'Carmen Díaz',
    seccion: 'Sucesos',
    fechaPublicacion: new Date(Date.now() - 432000000),
    destacada: false
  }
];

const publicidadesIniciales: Publicidad[] = [
  {
    id: '1',
    titulo: 'Banco Regional Guárico',
    imagen: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400',
    tipo: 'carrusel'
  },
  {
    id: '2',
    titulo: 'Supermercados El Llano',
    imagen: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    tipo: 'sidebar'
  }
];

const API_URL = 'http://localhost:3000/api'; // Backend en puerto 3000

export function ProveedorContextoNoticias({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [publicidades, setPublicidades] = useState<Publicidad[]>(publicidadesIniciales);
  const { token } = useContextoAuth();

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      console.log('Cargando noticias desde:', `${API_URL}/news`);
      const response = await axios.get(`${API_URL}/news`);
      console.log('Respuesta del backend:', response.data);
      
      // Procesar las imágenes para que tengan la URL completa del backend
      const noticiasConImagenes = response.data.map((noticia: any) => ({
        ...noticia,
        imagen: noticia.imagen ? `http://localhost:3000${noticia.imagen}` : noticia.imagen
      }));
      
      console.log('Noticias procesadas:', noticiasConImagenes.map((n: any) => ({ id: n.id, titulo: n.titulo, seccion: n.seccion })));
      setNoticias(noticiasConImagenes || []);
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
      // Procesar las imágenes para que tengan la URL completa del backend
      const noticiasConImagenes = response.data.map((noticia: any) => ({
        ...noticia,
        imagen: noticia.imagen ? `http://localhost:3000${noticia.imagen}` : noticia.imagen
      }));
      return noticiasConImagenes || [];
    } catch (error) {
      console.error('Error al obtener noticias por sección:', error);
      return [];
    }
  };

  const obtenerNoticiaPorId = (id: string) => {
    console.log('Buscando noticia con ID:', id);
    console.log('Noticias disponibles:', noticias.map(n => ({ id: n.id, titulo: n.titulo })));
    
    // Buscar por ID exacto primero
    let noticiaEncontrada = noticias.find(noticia => noticia.id.toString() === id);
    
    // Si no se encuentra, intentar con conversión numérica
    if (!noticiaEncontrada) {
      const idNumerico = parseInt(id, 10);
      if (!isNaN(idNumerico)) {
        noticiaEncontrada = noticias.find(noticia => noticia.id === idNumerico);
      }
    }
    
    console.log('Noticia encontrada:', noticiaEncontrada?.titulo);
    return noticiaEncontrada;
  };

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
      obtenerNoticiaPorId
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