import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const router = Router();

router.post('/login', [
  body('username').notEmpty(),
  body('password').notEmpty()
], async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Busca el usuario en la base de datos
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Verifica la contraseña
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Genera el token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );
  res.json({ token });
});

export default router;