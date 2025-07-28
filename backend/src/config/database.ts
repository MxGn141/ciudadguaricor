import { DataSource } from 'typeorm';
import { News } from '../models/News';
import { User } from '../models/User';
import { Section } from '../models/Section';
import { Role } from '../models/Role';
import { UserRole } from '../models/UserRole';
import { NewsMedia } from '../models/NewsMedia';
import { Media } from '../models/Media';
import { Publicidad } from '../models/Publicidad';
import { PDF } from '../models/PDF';
import { View } from '../models/View';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  driver: require('mysql2'),
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ciudadguaricor',
  entities: [News, User, Section, Role, UserRole, NewsMedia, Media, Publicidad, PDF, View],
  synchronize: true,
  logging: true,
  extra: {
    connectionLimit: 10
  }
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('Intentando conectar a la base de datos...');
      console.log('Host:', process.env.DB_HOST);
      console.log('Puerto:', process.env.DB_PORT);
      console.log('Usuario:', process.env.DB_USER);
      console.log('Base de datos:', process.env.DB_NAME);

      await AppDataSource.initialize();
      console.log('Conexión a la base de datos establecida');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Error detallado al conectar con la base de datos:', error);
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
};

export const getConnection = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error('La conexión a la base de datos no está inicializada');
  }
  return AppDataSource;
}; 