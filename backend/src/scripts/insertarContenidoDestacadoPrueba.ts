// Script para insertar banners de prueba en la tabla contenido_destacado
// Ejecuta este script con: npx ts-node backend/src/scripts/insertarContenidoDestacadoPrueba.ts

import { getPrismaClient } from '../config/prisma';

async function insertarContenidoDestacadoPrueba() {
  const prisma = getPrismaClient();

  // URLs de imágenes de Cloudinary de prueba (puedes cambiarlas por las tuyas)
  const urls = [
    'https://res.cloudinary.com/dilkjqca2/image/upload/v1620000000/ciudadguaricor/contenido/principal-izq-demo.jpg',
    'https://res.cloudinary.com/dilkjqca2/image/upload/v1620000000/ciudadguaricor/contenido/principal-der-demo.jpg',
    'https://res.cloudinary.com/dilkjqca2/image/upload/v1620000000/ciudadguaricor/contenido/principal-fondo-demo.jpg'
  ];

  const ubicaciones = ['principal-izq', 'principal-der', 'principal-fondo'];

  for (let i = 0; i < urls.length; i++) {
    await prisma.contenidoDestacado.create({
      data: {
        media: urls[i],
        url: 'https://ejemplo.com',
        titulo: `Banner de prueba ${i+1}`,
        ubicacion: ubicaciones[i],
        visible: true
      }
    });
    console.log(`Insertado banner de prueba para ${ubicaciones[i]}`);
  }

  console.log('Listo. Banners de prueba insertados.');
}

insertarContenidoDestacadoPrueba().catch(e => {
  console.error('Error al insertar:', e);
  process.exit(1);
});
