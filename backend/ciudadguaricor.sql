-- Tabla de Secciones
CREATE TABLE secciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE
);

-- Tabla de Roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

-- Tabla de Media (archivos multimedia)
CREATE TABLE media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  tipo ENUM('imagen','video','pdf') NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL
);

-- Tabla de Noticias (depende de 'secciones')
CREATE TABLE noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  contenido TEXT NOT NULL,
  resumen VARCHAR(300) NOT NULL,
  autorTexto VARCHAR(100) NOT NULL,
  autorFoto VARCHAR(100) NOT NULL,
  destacada BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  seccion_id INT,
  CONSTRAINT fk_noticias_seccion
    FOREIGN KEY (seccion_id) REFERENCES secciones(id)
    ON DELETE SET NULL
);

-- Tabla de Unión: Usuarios y Roles (Muchos-a-Muchos)
CREATE TABLE usuario_rol (
  usuario_id INT NOT NULL,
  rol_id INT NOT NULL,
  PRIMARY KEY (usuario_id, rol_id),
  CONSTRAINT fk_usuariorol_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_usuariorol_rol
    FOREIGN KEY (rol_id) REFERENCES roles(id)
    ON DELETE CASCADE
);

-- Tabla de Unión: Noticias y Media (Muchos-a-Muchos)
CREATE TABLE noticia_media (
  noticia_id INT NOT NULL,
  media_id INT NOT NULL,
  PRIMARY KEY (noticia_id, media_id),
  CONSTRAINT fk_noticiamedia_noticia
    FOREIGN KEY (noticia_id) REFERENCES noticias(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_noticiamedia_media
    FOREIGN KEY (media_id) REFERENCES media(id)
    ON DELETE CASCADE
);

-- Tabla de publicidades
CREATE TABLE publicidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imagen VARCHAR(255) NOT NULL,
  url VARCHAR(255),
  fecha_inicio DATE,
  fecha_fin DATE,
  descripcion TEXT,
  posicion VARCHAR(50) NOT NULL,
  visible BOOLEAN DEFAULT TRUE
);

-- Tabla de PDFs del periódico
CREATE TABLE pdfs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL
);

-- Tabla de vistas/previsualizaciones
CREATE TABLE views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL,
  configuracion JSON,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserción de datos de ejemplo
INSERT INTO secciones (nombre) VALUES
  ('Nacionales'), ('Municipales'), ('Deportes'),
  ('Cultura'), ('Produccion'), ('Comunidad'), ('Seguridad'), ('Turismo');

INSERT INTO roles (nombre) VALUES ('admin'), ('editor'), ('reportero');

INSERT INTO usuarios (username, password) VALUES ('admin', '$2b$10$5zfDHVnQNMHkY8fjki9J4.4j1EfNNj3GRQStDLWMMh6Vh9FIG2Oz6');

INSERT INTO usuario_rol (usuario_id, rol_id) VALUES (1, 1);

INSERT INTO media (url, tipo, descripcion) VALUES ('/uploads/noticias/ejemplo.jpg', 'imagen', 'Imagen principal de la noticia');

INSERT INTO noticias (titulo, contenido, resumen, seccion_id, autorTexto, autorFoto, destacada) VALUES
  ('Calor sin precedentes en San Juan de Los Morros', 'El contenido completo de la noticia sobre la ola de calor...', 'Resumen: Las temperaturas alcanzan niveles históricos en la capital guariqueña.', 1, 'Ana Pérez', 'Carlos Gómez', TRUE),
  ('Alcaldía inicia plan de bacheo en la Av. Bolívar', 'Detalles sobre las obras de reparación vial en el centro de la ciudad...', 'Resumen: Autoridades municipales comienzan a reparar las principales avenidas.', 2, 'Redacción Ciudad Guárico', 'Oscar de León', FALSE);

INSERT INTO noticia_media (noticia_id, media_id) VALUES (1, 1), (2, 1);

INSERT INTO publicidades (imagen, url, fecha_inicio, fecha_fin, descripcion, posicion) VALUES
  ('/uploads/publicidad/banner1.jpg', 'https://ejemplo.com', '2025-07-01', '2025-07-31', 'Banner principal', 'header'),
  ('/uploads/publicidad/banner2.jpg', 'https://ejemplo.com/otro', '2025-08-01', '2025-08-31', 'Banner secundario', 'sidebar');

INSERT INTO pdfs (url, fecha, descripcion) VALUES
  ('/uploads/pdf/periodico_julio.pdf', '2025-07-01', 'Edición de julio 2025');

-- Insertar algunas vistas predefinidas
INSERT INTO views (nombre, descripcion, tipo, configuracion) VALUES
('Vista Principal', 'Vista principal del sitio web', 'principal', '{"layout": "default", "sections": ["header", "main", "sidebar", "footer"]}'),
('Vista Noticia', 'Vista detallada de una noticia', 'noticia', '{"layout": "article", "sections": ["header", "content", "sidebar", "related"]}'),
('Vista Sección', 'Vista de noticias por sección', 'seccion', '{"layout": "grid", "sections": ["header", "filters", "content", "pagination"]}'),
('Vista Admin', 'Panel de administración', 'admin', '{"layout": "dashboard", "sections": ["sidebar", "main", "stats"]}');

-- FIN DEL SCRIPT