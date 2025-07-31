# Renombrar Publicidad para evitar AdBlockers

## Cambios necesarios en la base de datos:

### 1. Renombrar tabla
```sql
-- Renombrar tabla de publicidad a contenido_destacado
ALTER TABLE "Publicidad" RENAME TO "ContenidoDestacado";
```

### 2. Renombrar campos
```sql
-- Renombrar campos en la tabla
ALTER TABLE "ContenidoDestacado" RENAME COLUMN "imagen" TO "media";
ALTER TABLE "ContenidoDestacado" RENAME COLUMN "descripcion" TO "titulo";
ALTER TABLE "ContenidoDestacado" RENAME COLUMN "posicion" TO "ubicacion";
```

### 3. Nuevos nombres sugeridos:
- `publicidad` → `contenido_destacado`
- `banner` → `imagen_destacada`
- `ad` → `promocion`
- `advertisement` → `contenido_promocional`

## Archivos a modificar:
- `src/routes/content.ts` → `src/routes/contenido.ts`
- `src/middleware/upload.ts` → Cambiar `uploadPublicidad` por `uploadContenido`
- `src/config/cloudinary.ts` → Cambiar `storagePublicidad` por `storageContenido`
- Frontend: Cambiar todas las referencias 