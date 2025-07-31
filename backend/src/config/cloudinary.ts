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
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' }, // Tamaño máximo
      { quality: 'auto:good', fetch_format: 'auto' }, // Optimización automática
    ],
  },
});

// Configurar almacenamiento para publicidad
export const storagePublicidad = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ciudadguaricor/publicidad',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Tamaño para banners
      { quality: 'auto:good', fetch_format: 'auto' }, // Optimización automática
    ],
  },
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