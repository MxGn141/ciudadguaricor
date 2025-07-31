# Variables de entorno para Cloudinary en Render

## Configurar en Render Dashboard:

1. Ve a tu proyecto en Render
2. Settings → Environment Variables
3. Agrega estas variables:

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Obtener credenciales de Cloudinary:

1. Ve a https://cloudinary.com/
2. Crea una cuenta gratuita
3. En el Dashboard, ve a "Account Details"
4. Copia:
   - Cloud Name
   - API Key
   - API Secret

## Ejemplo de configuración:
```
CLOUDINARY_CLOUD_NAME=mi_proyecto
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

## Después de configurar:
1. Haz redeploy en Render
2. Las imágenes se subirán a Cloudinary automáticamente
3. Las URLs serán persistentes y optimizadas 