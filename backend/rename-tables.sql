-- Script para renombrar tablas y evitar adblockers
-- Ejecutar en Supabase SQL Editor

-- 1. Renombrar tabla Publicidad a ContenidoDestacado
ALTER TABLE "Publicidad" RENAME TO "ContenidoDestacado";

-- 2. Renombrar campos en la tabla
ALTER TABLE "ContenidoDestacado" RENAME COLUMN "imagen" TO "media";
ALTER TABLE "ContenidoDestacado" RENAME COLUMN "descripcion" TO "titulo";
ALTER TABLE "ContenidoDestacado" RENAME COLUMN "posicion" TO "ubicacion";

-- 3. Verificar cambios
SELECT * FROM "ContenidoDestacado" LIMIT 5;

-- 4. Si necesitas revertir (opcional):
-- ALTER TABLE "ContenidoDestacado" RENAME TO "Publicidad";
-- ALTER TABLE "Publicidad" RENAME COLUMN "media" TO "imagen";
-- ALTER TABLE "Publicidad" RENAME COLUMN "titulo" TO "descripcion";
-- ALTER TABLE "Publicidad" RENAME COLUMN "ubicacion" TO "posicion"; 