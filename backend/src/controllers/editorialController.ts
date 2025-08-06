import { Request, Response } from 'express';
import { getPrismaClient } from '../config/prisma';

export class EditorialController {
  // Obtener todos los editoriales
  static async getAll(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const editoriales = await prisma.editorial.findMany({
        include: { media: true },
        orderBy: { fecha: 'desc' }
      });
      res.json(editoriales);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener editoriales' });
    }
  }

  // Obtener un editorial por ID
  static async getById(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      const editorial = await prisma.editorial.findUnique({
        where: { id },
        include: { media: true }
      });
      if (!editorial) return res.status(404).json({ message: 'Editorial no encontrado' });
      res.json(editorial);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener editorial' });
    }
  }

  // Crear editorial
  static async create(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const { titulo, contenido, fecha, autor, mediaIds } = req.body;
      const editorial = await prisma.editorial.create({
        data: {
          titulo,
          contenido,
          fecha: fecha ? new Date(fecha) : undefined,
          autor,
          media: mediaIds && Array.isArray(mediaIds)
            ? { connect: mediaIds.map((id: number) => ({ id })) }
            : undefined
        },
        include: { media: true }
      });
      res.status(201).json(editorial);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear editorial' });
    }
  }

  // Actualizar editorial
  static async update(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      const { titulo, contenido, fecha, autor, mediaIds } = req.body;
      const editorial = await prisma.editorial.update({
        where: { id },
        data: {
          titulo,
          contenido,
          fecha: fecha ? new Date(fecha) : undefined,
          autor,
          media: mediaIds && Array.isArray(mediaIds)
            ? { set: mediaIds.map((id: number) => ({ id })) }
            : undefined
        },
        include: { media: true }
      });
      res.json(editorial);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar editorial' });
    }
  }

  // Eliminar editorial
  static async delete(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      await prisma.editorial.delete({ where: { id } });
      res.json({ message: 'Editorial eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar editorial' });
    }
  }
}
