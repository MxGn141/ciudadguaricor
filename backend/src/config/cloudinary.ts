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
    console.log(`Imagen eliminada de Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};

// Función para extraer public_id de URL de Cloudinary
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Ejemplo de URL: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/ciudadguaricor/noticias/abc123.jpg
    const regex = /\/v\d+\/(.+)\.[a-zA-Z]{3,4}$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error al extraer public_id:', error);
    return null;
  }
};

// Función para limpiar múltiples imágenes
export const deleteMultipleImages = async (urls: string[]): Promise<void> => {
  try {
    const deletePromises = urls.map(async (url) => {
      const publicId = extractPublicIdFromUrl(url);
      if (publicId) {
        return await deleteImage(publicId);
      }
      return null;
    });
    
    await Promise.all(deletePromises);
    console.log(`Eliminadas ${urls.length} imágenes de Cloudinary`);
  } catch (error) {
    console.error('Error al eliminar múltiples imágenes:', error);
    throw error;
  }
};

export default cloudinary; 