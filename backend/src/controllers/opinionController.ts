import { Request, Response } from 'express';
import { getPrismaClient } from '../config/prisma';

export class OpinionController {
  // Obtener todas las opiniones
  static async getAll(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const opiniones = await prisma.opinion.findMany({
        include: { media: true, columnista: true },
        orderBy: { fecha: 'desc' }
      });
      res.json(opiniones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener opiniones' });
    }
  }

  // Obtener una opinión por ID
  static async getById(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      const opinion = await prisma.opinion.findUnique({
        where: { id },
        include: { media: true, columnista: true }
      });
      if (!opinion) return res.status(404).json({ message: 'Opinión no encontrada' });
      res.json(opinion);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener opinión' });
    }
  }

  // Crear opinión
  static async create(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const { titulo, contenido, fecha, columnistaId, destacado, mediaIds } = req.body;
      const opinion = await prisma.opinion.create({
        data: {
          titulo,
          contenido,
          fecha: fecha ? new Date(fecha) : undefined,
          columnistaId: parseInt(columnistaId),
          destacado: destacado === 'true' || destacado === true,
          media: mediaIds && Array.isArray(mediaIds)
            ? { connect: mediaIds.map((id: number) => ({ id })) }
            : undefined
        },
        include: { media: true, columnista: true }
      });
      res.status(201).json(opinion);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear opinión' });
    }
  }

  // Actualizar opinión
  static async update(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      const { titulo, contenido, fecha, columnistaId, destacado, mediaIds } = req.body;
      const opinion = await prisma.opinion.update({
        where: { id },
        data: {
          titulo,
          contenido,
          fecha: fecha ? new Date(fecha) : undefined,
          columnistaId: parseInt(columnistaId),
          destacado: destacado === 'true' || destacado === true,
          media: mediaIds && Array.isArray(mediaIds)
            ? { set: mediaIds.map((id: number) => ({ id })) }
            : undefined
        },
        include: { media: true, columnista: true }
      });
      res.json(opinion);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar opinión' });
    }
  }

  // Eliminar opinión
  static async delete(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      await prisma.opinion.delete({ where: { id } });
      res.json({ message: 'Opinión eliminada' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar opinión' });
    }
  }
}
