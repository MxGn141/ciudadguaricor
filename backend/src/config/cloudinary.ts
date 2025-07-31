import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar almacenamiento para noticias
export const storageNoticias = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ciudadguaricor/noticias',
  } as any,
});

// Configurar almacenamiento para contenido destacado
export const storageContenido = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ciudadguaricor/contenido',
  } as any,
});

// Función para obtener URL optimizada
export const getOptimizedImageUrl = (publicId: string, options: any = {}) => {
  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...options
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

// Función para eliminar imagen
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};

export default cloudinary; 