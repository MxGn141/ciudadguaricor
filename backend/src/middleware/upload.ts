import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurar que el directorio de uploads existe
const uploadDir = path.join(__dirname, '../../uploads/noticias');
const publicidadUploadDir = path.join(__dirname, '../../uploads/publicidad');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(publicidadUploadDir)) {
  fs.mkdirSync(publicidadUploadDir, { recursive: true });
}

// Configuración de almacenamiento para noticias
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuración de almacenamiento para publicidad
const publicidadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, publicidadUploadDir);
  },
  filename: (_req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG y GIF.'));
  }
};

// Configuración de multer para noticias
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Configuración de multer para publicidad
export const uploadPublicidad = multer({
  storage: publicidadStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Función para eliminar imagen
export const deleteImage = (filename: string) => {
  const filepath = path.join(uploadDir, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}; 