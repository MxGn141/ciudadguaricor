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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  contenido TEXT NOT NULL,
  resumen VARCHAR(300) NOT NULL,
  imagen VARCHAR(255),
  imagen_filename VARCHAR(255),
  autor_texto VARCHAR(100) NOT NULL,
  autor_foto VARCHAR(255),
  seccion ENUM('Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos') NOT NULL,
  destacada BOOLEAN DEFAULT FALSE,
  fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin por defecto
-- Usuario: admin
-- Contraseña: ciudad2025
INSERT INTO usuarios (username, password, role) 
VALUES ('admin', '$2b$10$XKXZq.3Zp/qwNNrdBfxOJ.9X9qp/HaB2WYgZqq1YzF4kqZ5ZtO5Vy', 'admin')
ON DUPLICATE KEY UPDATE username = username;