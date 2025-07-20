-- BORRA Y RECREA TODAS LAS TABLAS CLAVE CON DATOS VÁLIDOS Y ÚNICOS

DROP TABLE IF EXISTS noticia_media, noticia_autor, usuario_rol, noticias, media, autores, secciones, usuarios, roles, publicidades, pdfs;

CREATE TABLE secciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(30) DEFAULT NULL
);
INSERT INTO secciones (id, nombre, color) VALUES
  (1, 'Nacionales', '#2563eb'),
  (2, 'Municipales', '#16a34a'),
  (3, 'Deportes', '#eab308'),
  (4, 'Cultura', '#7c3aed'),
  (5, 'Economía', '#10b981'),
  (6, 'Sociales', '#db2777'),
  (7, 'Sucesos', '#dc2626');

DROP TABLE IF EXISTS autores;
CREATE TABLE autores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO autores (id, nombre) VALUES
  (1, 'Héctor el padre'),
  (2, 'Oscar de León'),
  (3, 'Redacción Ciudad Guárico');

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO roles (id, nombre) VALUES
  (1, 'admin'),
  (2, 'editor'),
  (3, 'reportero');

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);
INSERT INTO usuarios (id, username, password, created_at) VALUES
  (1, 'admin', '$2b$10$5zfDHVnQNMHkY8fjki9J4.4j1EfNNj3GRQStDLWMMh6Vh9FIG2Oz6', NOW());

CREATE TABLE usuario_rol (
  usuario_id INT NOT NULL,
  rol_id INT NOT NULL,
  PRIMARY KEY (usuario_id, rol_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);
INSERT INTO usuario_rol (usuario_id, rol_id) VALUES (1, 1);

CREATE TABLE media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  tipo ENUM('imagen','video','pdf') NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL
);
INSERT INTO media (id, url, tipo, descripcion) VALUES
  (1, '/uploads/noticias/ejemplo.jpg', 'imagen', 'Imagen principal de la noticia');

CREATE TABLE noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  contenido TEXT NOT NULL,
  resumen VARCHAR(300) NOT NULL,
  seccion_id INT NOT NULL,
  destacada BOOLEAN NOT NULL DEFAULT 0,
  fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (seccion_id) REFERENCES secciones(id) ON DELETE RESTRICT
);
INSERT INTO noticias (id, titulo, contenido, resumen, seccion_id, destacada, fecha_publicacion, created_at, updated_at) VALUES
  (1, 'Ejemplo de noticia', 'Contenido de la noticia...', 'Resumen de la noticia...', 1, 1, NOW(), NOW(), NOW());

CREATE TABLE noticia_autor (
  noticia_id INT NOT NULL,
  autor_id INT NOT NULL,
  PRIMARY KEY (noticia_id, autor_id),
  FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE,
  FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE
);
INSERT INTO noticia_autor (noticia_id, autor_id) VALUES (1, 1);

CREATE TABLE noticia_media (
  noticia_id INT NOT NULL,
  media_id INT NOT NULL,
  PRIMARY KEY (noticia_id, media_id),
  FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);
INSERT INTO noticia_media (noticia_id, media_id) VALUES (1, 1);

CREATE TABLE publicidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imagen VARCHAR(255) NOT NULL,
  url VARCHAR(255) DEFAULT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  descripcion VARCHAR(255) DEFAULT NULL
);
INSERT INTO publicidades (id, imagen, url, fecha_inicio, fecha_fin, descripcion) VALUES
  (1, '/uploads/publicidad/banner1.jpg', 'https://ejemplo.com', '2025-07-01', '2025-07-31', 'Banner principal');

CREATE TABLE pdfs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL
);
INSERT INTO pdfs (id, url, fecha, descripcion) VALUES
  (1, '/uploads/pdf/periodico_julio.pdf', '2025-07-01', 'Edición de julio 2025');
