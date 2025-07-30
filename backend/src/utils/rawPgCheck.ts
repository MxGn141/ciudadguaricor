import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

client.connect(err => {
  if (err) {
    console.error('❌ Error de conexión con PG:', err.message);
  } else {
    console.log('✅ Conexión directa con PG establecida');
    client.end();
  }
});
