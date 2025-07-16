-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ciudad_guarico_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ciudad_guarico_db;

-- Tabla de usuarios (sistema simple como está implementado actualmente)
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de secciones (basada en las secciones actuales del sistema)
CREATE TABLE secciones (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL,
    orden INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Insertar secciones predefinidas
INSERT INTO secciones (id, nombre, color, orden) VALUES
(UUID(), 'Nacionales', '#3B82F6', 1),   -- blue-500
(UUID(), 'Municipales', '#22C55E', 2),  -- green-500
(UUID(), 'Deportes', '#EF4444', 3),     -- red-500
(UUID(), 'Cultura', '#A855F7', 4),      -- purple-500
(UUID(), 'Economía', '#EAB308', 5),     -- yellow-500
(UUID(), 'Sociales', '#EC4899', 6),     -- pink-500
(UUID(), 'Sucesos', '#6B7280', 7);      -- gray-500

-- Tabla de noticias (basada en la interfaz Noticia actual)
CREATE TABLE noticias (
    id VARCHAR(36) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    resumen TEXT NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    autor_texto VARCHAR(100) NOT NULL,
    autor_foto VARCHAR(100) NOT NULL,
    seccion_id VARCHAR(36) NOT NULL,
    fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    destacada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seccion_id) REFERENCES secciones(id),
    INDEX idx_seccion (seccion_id),
    INDEX idx_destacada (destacada),
    INDEX idx_fecha (fecha_publicacion)
) ENGINE=InnoDB;

-- Tabla de publicidad (basada en la interfaz Publicidad actual)
CREATE TABLE publicidad (
    id VARCHAR(36) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    enlace VARCHAR(255),
    tipo ENUM('carrusel', 'sidebar') NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_activa (activa)
) ENGINE=InnoDB;

-- Vista para obtener noticias con nombre de sección
CREATE VIEW v_noticias AS
SELECT 
    n.*,
    s.nombre as seccion_nombre,
    s.color as seccion_color
FROM noticias n
JOIN secciones s ON n.seccion_id = s.id;

-- Insertar usuario admin por defecto
INSERT INTO usuarios (id, usuario, password_hash) VALUES (
    UUID(),
    'admin',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- password: ciudad2025
); 