import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { UserRole } from '../models/UserRole';
import bcrypt from 'bcrypt';

async function createOrUpdateAdmin() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);
  const roleRepository = AppDataSource.getRepository(Role);
  const userRoleRepository = AppDataSource.getRepository(UserRole);

  const username = 'admin';
  const password = 'ciudad2025';
  const roleName = 'admin';

  const hashedPassword = await bcrypt.hash(password, 10);

  // Busca el rol admin
  const role = await roleRepository.findOne({ where: { nombre: roleName } });
  if (!role) {
    console.error('No existe el rol admin en la base de datos.');
    process.exit(1);
  }

  // Verifica si ya existe
  let user = await userRepository.findOne({ where: { username } });
  if (user) {
    user.password = hashedPassword;
    await userRepository.save(user);
    // Asigna el rol admin si no lo tiene
    let userRole = await userRoleRepository.findOne({ where: { usuario_id: user.id, rol_id: role.id } });
    if (!userRole) {
      userRole = userRoleRepository.create({ usuario_id: user.id, rol_id: role.id });
      await userRoleRepository.save(userRole);
    }
    console.log('Usuario admin actualizado correctamente.');
  } else {
    user = userRepository.create({
      username,
      password: hashedPassword,
      created_at: new Date()
    });
    await userRepository.save(user);
    // Asigna el rol admin
    const userRole = userRoleRepository.create({ usuario_id: user.id, rol_id: role.id });
    await userRoleRepository.save(userRole);
    console.log('Usuario admin creado correctamente.');
  }
  process.exit(0);
}

createOrUpdateAdmin().catch(e => {
  console.error(e);
  process.exit(1);
}); 