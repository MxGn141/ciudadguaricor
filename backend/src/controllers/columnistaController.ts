import { Request, Response } from 'express';
import { getPrismaClient } from '../config/prisma';

export class ColumnistaController {
  // Obtener todos los columnistas
  static async getAll(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const columnistas = await prisma.columnista.findMany({
        include: { opiniones: true },
        orderBy: { nombre: 'asc' }
      });
      res.json(columnistas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener columnistas' });
    }
  }

  // Obtener un columnista por ID
  static async getById(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      const columnista = await prisma.columnista.findUnique({
        where: { id },
        include: { opiniones: true }
      });
      if (!columnista) return res.status(404).json({ message: 'Columnista no encontrado' });
      res.json(columnista);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener columnista' });
    }
  }

  // Crear columnista
  static async create(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const { nombre, bio, fotoUrl, redes } = req.body;
      const columnista = await prisma.columnista.create({
        data: {
          nombre,
          bio,
          fotoUrl,
          redes: redes ? JSON.parse(redes) : undefined
        }
      });
      res.status(201).json(columnista);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear columnista' });
    }
  }

  // Actualizar columnista
  static async update(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      const { nombre, bio, fotoUrl, redes } = req.body;
      const columnista = await prisma.columnista.update({
        where: { id },
        data: {
          nombre,
          bio,
          fotoUrl,
          redes: redes ? JSON.parse(redes) : undefined
        }
      });
      res.json(columnista);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar columnista' });
    }
  }

  // Eliminar columnista
  static async delete(req: Request, res: Response) {
    try {
      const prisma = getPrismaClient();
      const id = parseInt(req.params.id);
      await prisma.columnista.delete({ where: { id } });
      res.json({ message: 'Columnista eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar columnista' });
    }
  }
}
