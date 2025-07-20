-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ciudadguaricor;
USE ciudadguaricor;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  contenido TEXT NOT NULL,
  resumen VARCHAR(300) NOT NULL,
  imagen VARCHAR(255),
  autor_texto VARCHAR(100) NOT NULL,
  autor_foto VARCHAR(255),
  seccion ENUM('Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos') NOT NULL,
  destacada BOOLEAN DEFAULT FALSE,
  fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto
-- Password: ciudad2025 (como está en el frontend)
INSERT INTO usuarios (username, password, role) 
VALUES ('admin', '$2b$10$XKXZq.3Zp/qwNNrdBfxOJ.9X9qp/HaB2WYgZqq1YzF4kqZ5ZtO5Vy', 'admin')
ON DUPLICATE KEY UPDATE username = username; 