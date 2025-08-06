-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 30-07-2025 a las 17:41:54
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ciudadguaricor`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `tipo` enum('imagen','video','pdf') NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `media`
--

INSERT INTO `media` (`id`, `url`, `tipo`, `descripcion`) VALUES
(1, '/uploads/noticias/ejemplo.jpg', 'imagen', 'Imagen principal de la noticia'),
(2, '/uploads/noticias/1753045571375-873711239.jpg', 'imagen', NULL),
(3, '/uploads/noticias/1753045729797-315430889.jpg', 'imagen', NULL),
(4, '/uploads/noticias/1753045734305-40803622.jpg', 'imagen', NULL),
(5, '/uploads/noticias/1753045811625-353995195.jpg', 'imagen', NULL),
(6, '/uploads/noticias/1753045856433-898691893.jpg', 'imagen', NULL),
(7, '/uploads/noticias/1753046053056-25766699.jpg', 'imagen', NULL),
(8, '/uploads/noticias/1753046290855-732027981.jpg', 'imagen', NULL),
(9, '/uploads/noticias/1753047176335-93846347.jpg', 'imagen', NULL),
(10, '/uploads/noticias/1753050110416-188726598.jpg', 'imagen', NULL),
(11, '/uploads/noticias/1753050144906-853068528.jpg', 'imagen', NULL),
(12, '/uploads/noticias/1753050322662-247060398.png', 'imagen', NULL),
(13, '/uploads/noticias/1753050551422-424959843.jpg', 'imagen', NULL),
(14, '/uploads/noticias/1753050640450-399094011.jpg', 'imagen', NULL),
(15, '/uploads/noticias/1753050691242-427661502.jpg', 'imagen', NULL),
(16, '/uploads/noticias/1753050733602-651695424.jpg', 'imagen', NULL),
(17, '/uploads/noticias/1753716359661-414795977.jpg', 'imagen', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `contenido` text NOT NULL,
  `resumen` varchar(300) NOT NULL,
  `autorTexto` varchar(100) NOT NULL,
  `autorFoto` varchar(100) NOT NULL,
  `destacada` tinyint(4) NOT NULL DEFAULT 0,
  `fecha_publicacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `seccion_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `contenido`, `resumen`, `autorTexto`, `autorFoto`, `destacada`, `fecha_publicacion`, `seccion_id`, `created_at`, `updated_at`) VALUES
(5, 'hola yulian el frito', 'xczxczxczxcdsd', 'sdfasfasfscxzczxczcz', 'asdadasd', 'asdasda', 0, '2025-07-20 21:32:56', 1, '2025-07-20 17:32:56.369822', '2025-07-20 18:25:26.000000'),
(6, '¿Cuáles son los efectos de comer melón diariamente?', 'rtg;,;lklfksdlslkdnlsdknclsc', 'fergrtgrgergergertger', 'asasasxasx', 'asxaxasxaszxza', 1, '2025-07-20 22:21:50', 4, '2025-07-20 18:21:50.464032', '2025-07-20 18:33:50.000000'),
(7, 'skdklajdlkasjda', 'pokpokpo3epoep3imdpo23mdp23omdp23md', 'tyuryutyrty', 'dasdcvvxccxvvcx', 'xcvxcvxc', 0, '2025-07-20 22:22:24', 3, '2025-07-20 18:22:24.941486', '2025-07-20 18:32:47.000000'),
(8, 'hector el padre', 'kpopokpokpokpokpokpok', 'oppokpokpokpok', 'asdasdasdxzbuu', 'popipoipo', 0, '2025-07-20 22:25:22', 2, '2025-07-20 18:25:22.699275', '2025-07-20 18:32:46.000000'),
(9, 'dcsdsdsdlkdflskfldfkds', 'nuonuoinuoinuoiuoiun', 'oinjojnoinuouoiunoi', 'lopoiiuoiuiub', 'uoijninomoimu8998', 1, '2025-07-20 22:29:11', 5, '2025-07-20 18:29:11.459146', '2025-07-20 18:32:52.000000'),
(10, 'aldskjalkdsjlajsdlakjsdlkasd', 'dlmdklskdcmslkdcmspcmsocspcmpsodcmpsodcms', 'dddkndkndkjndo', 'dksfjlskfjslkfjslkfjslkdfj', 'oiwowiwpowipwoip', 0, '2025-07-20 22:30:40', 6, '2025-07-20 18:30:40.473391', '2025-07-28 17:10:23.000000'),
(12, 'ljdlsfjlskfjslkfjslkdf', 'dndpdpidjioddindoidndoibdibdibdoibdoi', 'njdnkdjndkjdnkdjnkdjn', 'sdmnfmsndfmsdf', 'dskjnskdnsdkjdnkjn', 1, '2025-07-20 22:32:13', 7, '2025-07-20 18:32:13.621462', '2025-07-28 17:10:43.000000'),
(13, 'hola yulian el frito', 'dcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcsdcscsvfgbnnynrcsdcs', 'dcscsvfgbnnynrcsdcs', 'asdasd', 'dssdsdsd', 0, '2025-07-28 15:25:59', 8, '2025-07-28 11:25:59.698709', '2025-07-28 16:53:57.000000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticia_media`
--

CREATE TABLE `noticia_media` (
  `noticia_id` int(11) NOT NULL,
  `media_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticia_media`
--

INSERT INTO `noticia_media` (`noticia_id`, `media_id`) VALUES
(5, 9),
(6, 10),
(7, 11),
(8, 12),
(9, 13),
(10, 14),
(12, 16),
(13, 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pdfs`
--

CREATE TABLE `pdfs` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pdfs`
--

INSERT INTO `pdfs` (`id`, `url`, `fecha`, `descripcion`) VALUES
(1, '/uploads/pdf/periodico_julio.pdf', '2025-07-01', 'Edición de julio 2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicidades`
--

CREATE TABLE `publicidades` (
  `id` int(11) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `posicion` varchar(255) NOT NULL,
  `visible` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicidades`
--

INSERT INTO `publicidades` (`id`, `imagen`, `url`, `fecha_inicio`, `fecha_fin`, `descripcion`, `posicion`, `visible`) VALUES
(3, '/uploads/publicidad/1753724808425-745531337.png', '', '2025-07-10', '2025-07-31', 'hoa', 'main-1', 1),
(4, '/uploads/publicidad/1753722727692-900602623.jpg', '', '2025-07-15', '2025-07-31', 'hola', 'main-2', 1),
(5, '/uploads/publicidad/1753723542507-611816901.jpeg', 'https://www.youtube.com/watch?v=UCCCOVKT1MI', '2025-07-04', '2025-07-31', 'xd', 'main-bg', 1),
(7, '/uploads/publicidad/1753724162528-192593218.jpeg', '', '2025-07-01', '2025-07-30', 'xdlol', 'header-bg', 1),
(9, '/uploads/publicidad/1753731978424-863559682.gif', '', '2025-07-24', '2025-07-13', 'evee', 'side-2', 1),
(10, '/uploads/publicidad/1753729655625-704024266.jpg', '', '2025-07-16', '2025-07-31', 'hhgjhg', 'side-3', 1),
(11, '/uploads/publicidad/1753729678173-381624004.jpeg', '', '2025-07-31', '2025-10-01', 'hola', 'side-4', 1),
(12, '/uploads/publicidad/1753729701020-839165570.jpeg', '', '2025-07-14', '2025-07-30', 'nbmnbmn', 'side-5', 1),
(13, '/uploads/publicidad/1753729746491-291609167.jpeg', '', '2025-07-12', '2025-08-10', 'nhb', 'side-6', 1),
(14, '/uploads/publicidad/1753731919051-204323433.jpg', '', '2025-07-02', '2025-07-08', 'xczxczc', 'side-1', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'admin'),
(2, 'admin-dev'),
(3, 'reportero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`id`, `nombre`) VALUES
(6, 'Comunidad'),
(4, 'Cultura'),
(3, 'Deportes'),
(2, 'Municipales'),
(1, 'Gestion'),
(5, 'Produccion'),
(7, 'Seguridad'),
(8, 'Turismo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2b$10$5zfDHVnQNMHkY8fjki9J4.4j1EfNNj3GRQStDLWMMh6Vh9FIG2Oz6', '2025-07-20 16:10:41.528828');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `usuario_id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`usuario_id`, `rol_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `views`
--

CREATE TABLE `views` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tipo` varchar(255) NOT NULL,
  `configuracion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`configuracion`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `views`
--

INSERT INTO `views` (`id`, `nombre`, `descripcion`, `activo`, `created_at`, `updated_at`, `tipo`, `configuracion`) VALUES
(1, 'Vista Principal', 'Vista principal del sitio web', 1, '2025-07-28 17:33:56', '2025-07-28 17:33:56', '', NULL),
(2, 'Vista Noticia', 'Vista detallada de una noticia', 1, '2025-07-28 17:33:56', '2025-07-28 17:33:56', '', NULL),
(3, 'Vista Sección', 'Vista de noticias por sección', 1, '2025-07-28 17:33:56', '2025-07-28 17:33:56', '', NULL),
(4, 'Vista Admin', 'Panel de administración', 1, '2025-07-28 17:33:56', '2025-07-28 17:33:56', '', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_548825266c0e8c7d24ad7c0d0bb` (`seccion_id`);

--
-- Indices de la tabla `noticia_media`
--
ALTER TABLE `noticia_media`
  ADD PRIMARY KEY (`noticia_id`,`media_id`),
  ADD KEY `FK_1268f31ab7974ed360621f0a14a` (`media_id`);

--
-- Indices de la tabla `pdfs`
--
ALTER TABLE `pdfs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `publicidades`
--
ALTER TABLE `publicidades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_a5be7aa67e759e347b1c6464e1` (`nombre`);

--
-- Indices de la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_276cc73dff63883390ada40e3a` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_9f78cfde576fc28f279e2b7a9c` (`username`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`usuario_id`,`rol_id`),
  ADD KEY `FK_ac8911cd54a61461c9926541401` (`rol_id`);

--
-- Indices de la tabla `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `pdfs`
--
ALTER TABLE `pdfs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `publicidades`
--
ALTER TABLE `publicidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `views`
--
ALTER TABLE `views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `FK_548825266c0e8c7d24ad7c0d0bb` FOREIGN KEY (`seccion_id`) REFERENCES `secciones` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `noticia_media`
--
ALTER TABLE `noticia_media`
  ADD CONSTRAINT `FK_1268f31ab7974ed360621f0a14a` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_74ee51d1d7b0fc4a4328c476edc` FOREIGN KEY (`noticia_id`) REFERENCES `noticias` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `FK_29e9a9079c7ba01c1b301cf5555` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ac8911cd54a61461c9926541401` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
