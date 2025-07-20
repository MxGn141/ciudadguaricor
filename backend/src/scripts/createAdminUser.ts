import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

async function createOrUpdateAdmin() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);

  const username = 'admin';
  const password = 'ciudad2025';
  const role = 'admin';

  const hashedPassword = await bcrypt.hash(password, 10);

  // Verifica si ya existe
  let user = await userRepository.findOne({ where: { username } });
  if (user) {
    user.password = hashedPassword;
    user.role = role;
    await userRepository.save(user);
    console.log('Usuario admin actualizado correctamente.');
  } else {
    user = userRepository.create({
      username,
      password: hashedPassword,
      role,
      created_at: new Date()
    });
    await userRepository.save(user);
    console.log('Usuario admin creado correctamente.');
  }
  process.exit(0);
}

createOrUpdateAdmin().catch(e => {
  console.error(e);
  process.exit(1);
}); 