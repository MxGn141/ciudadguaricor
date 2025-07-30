import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getPrismaClient } from '../config/prisma';

const router = Router();

router.post('/login', [
  body('username').notEmpty(),
  body('password').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const prisma = getPrismaClient();

    // Busca el usuario en Supabase usando Prisma
    const user = await prisma.usuario.findUnique({
      where: { username },
      include: {
        usuarioRoles: {
          include: {
            rol: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verifica la contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Obtiene los roles del usuario
    const roles = user.usuarioRoles.map(ur => ur.rol.nombre);

    // Genera el token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        roles: roles
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        roles: roles
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;