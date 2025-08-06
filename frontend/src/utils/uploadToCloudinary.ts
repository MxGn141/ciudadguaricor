// Helper para subir imágenes a Cloudinary desde el frontend
// Retorna la URL segura de Cloudinary

export async function uploadToCloudinary(file: File): Promise<string> {
  const url = 'https://api.cloudinary.com/v1_1/dilkjqca2/image/upload';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', '<tu_upload_preset>'); // <--- Reemplaza esto por tu upload_preset unsigned creado en Cloudinary

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Error al subir imagen a Cloudinary');
  const data = await response.json();
  return data.secure_url;
}

// Reemplaza <tu_cloud_name> y <tu_upload_preset> por tus valores reales de Cloudinary.
