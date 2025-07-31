/*
  Warnings:

  - You are about to drop the `Publicidad` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Publicidad";

-- CreateTable
CREATE TABLE "public"."ContenidoDestacado" (
    "id" SERIAL NOT NULL,
    "media" TEXT NOT NULL,
    "url" TEXT,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "titulo" TEXT,
    "ubicacion" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContenidoDestacado_pkey" PRIMARY KEY ("id")
);
