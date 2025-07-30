import { getPrismaClient } from '../config/prisma';

async function seedDatabase() {
  try {
    const prisma = getPrismaClient();
    
    console.log('🌱 Poblando la base de datos...');

    // Crear secciones
    const secciones = [
      { nombre: 'Política' },
      { nombre: 'Economía' },
      { nombre: 'Deportes' },
      { nombre: 'Cultura' },
      { nombre: 'Tecnología' },
      { nombre: 'Salud' },
      { nombre: 'Educación' },
      { nombre: 'Medio Ambiente' }
    ];

    for (const seccion of secciones) {
      try {
        await prisma.seccion.create({
          data: seccion
        });
      } catch (error) {
        // Si ya existe, continuamos
        console.log(`Sección "${seccion.nombre}" ya existe`);
      }
    }

    console.log('✅ Secciones creadas exitosamente');

    // Crear roles si no existen
    const roles = [
      { nombre: 'admin' },
      { nombre: 'editor' },
      { nombre: 'reportero' }
    ];

    for (const rol of roles) {
      try {
        await prisma.rol.create({
          data: rol
        });
      } catch (error) {
        // Si ya existe, continuamos
        console.log(`Rol "${rol.nombre}" ya existe`);
      }
    }

    console.log('✅ Roles creados exitosamente');

    await prisma.$disconnect();
    console.log('🎉 Base de datos poblada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase(); 