import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializePrisma = async () => {
  try {
    console.log('Conectando a Supabase con Prisma...');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Conexión a Supabase establecida exitosamente');
    
    return prisma;
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error);
    throw error;
  }
};

export const getPrismaClient = () => {
  return prisma;
};

export default prisma; 