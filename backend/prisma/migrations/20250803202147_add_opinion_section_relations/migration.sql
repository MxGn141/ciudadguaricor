-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "editorialId" INTEGER,
ADD COLUMN     "opinionId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Columnista" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "redes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Columnista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Editorial" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autor" TEXT,

    CONSTRAINT "Editorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Opinion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "columnistaId" INTEGER NOT NULL,
    "destacado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Opinion" ADD CONSTRAINT "Opinion_columnistaId_fkey" FOREIGN KEY ("columnistaId") REFERENCES "public"."Columnista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_editorialId_fkey" FOREIGN KEY ("editorialId") REFERENCES "public"."Editorial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_opinionId_fkey" FOREIGN KEY ("opinionId") REFERENCES "public"."Opinion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
