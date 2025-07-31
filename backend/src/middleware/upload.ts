import multer from 'multer';
import { storageNoticias, storageContenido } from '../config/cloudinary';

// Filtro de archivos
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG, GIF y WebP.'));
  }
};

// Configuración de multer para noticias con Cloudinary
export const upload = multer({
  storage: storageNoticias,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB (Cloudinary maneja la optimización)
  }
});

// Configuración de multer para contenido destacado con Cloudinary
export const uploadContenido = multer({
  storage: storageContenido,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB (Cloudinary maneja la optimización)
  }
});

// Función para eliminar imagen de Cloudinary
export const deleteImage = async (publicId: string) => {
  try {
    const { deleteImage: deleteCloudinaryImage } = await import('../config/cloudinary');
    return await deleteCloudinaryImage(publicId);
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
}; 