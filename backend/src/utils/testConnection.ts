import { PrismaClient } from '@prisma/client';
import dns from 'dns';

const prisma = new PrismaClient();

dns.lookup('db.hwdurinddscmbicshdko.supabase.co', (err, address, family) => {
  if (err) {
    console.error('❌ DNS resolution failed:', err.message);
  } else {
    console.log(`✅ DNS resolved: ${address} (IPv${family})`);
  }
});

prisma.$connect()
  .then(() => {
    console.log('✅ Prisma conectado correctamente');
  })
  .catch((err) => {
    console.error('❌ Prisma no logró conectar:', err.message);
  });
