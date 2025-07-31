import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initializePrisma } from './config/prisma';
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';
import contentRoutes from './routes/content';
import sectionsRoutes from './routes/sections';
import mediaRoutes from './routes/media';

// Configuración de variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Ruta de bienvenida para la raíz
app.get('/', (req, res) => {
  res.send('API ciudadguaricor backend funcionando 🚀');
});

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:5173', // Desarrollo local
    'https://ciudadguaricor.vercel.app', // Producción Vercel
    'https://ciudadguaricor-git-test-mxgn141s-projects.vercel.app' // URL alternativa de Vercel
  ],
  credentials: true
}));



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Inicializar base de datos y servidor
const startServer = async () => {
  try {
    // Conectar a Supabase con Prisma
    await initializePrisma();

    // Rutas
    app.use('/api/auth', authRoutes);
    app.use('/api/news', newsRoutes);
    app.use('/api/content', contentRoutes);
    app.use('/api/sections', sectionsRoutes);
    app.use('/api/media', mediaRoutes);

    // Manejo básico de errores
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error en el servidor:', err);
      res.status(500).json({ 
        message: 'Algo salió mal!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Puerto
    const PORT = process.env.PORT || 3000;

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📊 Conectado a Supabase con Prisma`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer().catch(error => {
  console.error('Error fatal al iniciar la aplicación:', error);
  process.exit(1);
}); 