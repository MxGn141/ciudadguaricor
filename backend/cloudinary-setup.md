# Configuración de Cloudinary para almacenamiento de imágenes

## Problema actual:
- Render no persiste archivos subidos
- Las imágenes se pierden cuando el servidor se reinicia
- URLs de imágenes no funcionan en producción

## Solución: Cloudinary

### 1. Crear cuenta en Cloudinary
- Ve a https://cloudinary.com/
- Crea una cuenta gratuita
- Obtén tus credenciales: Cloud Name, API Key, API Secret

### 2. Instalar dependencias
```bash
npm install cloudinary multer-storage-cloudinary
```

### 3. Configurar variables de entorno
```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Configurar middleware de upload
```ts
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'ciudadguaricor',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});
```

### 5. Ventajas de Cloudinary:
- ✅ Almacenamiento persistente
- ✅ URLs públicas accesibles
- ✅ Optimización automática de imágenes
- ✅ Transformaciones (redimensionar, recortar, etc.)
- ✅ Plan gratuito generoso

## Alternativas:
- **Supabase Storage**: Si ya usas Supabase
- **AWS S3**: Para proyectos más grandes
- **Firebase Storage**: Si usas Firebase 