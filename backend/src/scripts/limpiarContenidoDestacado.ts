// Script para limpiar la tabla contenido_destacado y dejar solo los registros con media en Cloudinary
// Ejecuta este script con: npx ts-node backend/src/scripts/limpiarContenidoDestacado.ts

import { getPrismaClient } from '../config/prisma';

async function limpiarContenidoDestacado() {
  const prisma = getPrismaClient();
  const todos = await prisma.contenidoDestacado.findMany();
  let eliminados = 0;
  for (const c of todos) {
    // Elimina si no es Cloudinary o si es un banner de prueba (contiene '-demo' en la URL)
    if (!c.media.startsWith('https://res.cloudinary.com') || c.media.includes('-demo')) {
      await prisma.contenidoDestacado.delete({ where: { id: c.id } });
      eliminados++;
      console.log(`Eliminado registro id=${c.id} media=${c.media}`);
    }
  }
  console.log(`Listo. Registros eliminados: ${eliminados}`);
}

limpiarContenidoDestacado().catch(e => {
  console.error('Error al limpiar:', e);
  process.exit(1);
});
