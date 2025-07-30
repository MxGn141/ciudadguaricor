import { getPrismaClient } from '../config/prisma';
import bcrypt from 'bcrypt';

async function createOrUpdateAdmin() {
  try {
    const prisma = getPrismaClient();
    
    const username = 'admin';
    const password = 'ciudad2025';
    const roleName = 'admin';

    const hashedPassword = await bcrypt.hash(password, 10);

    // Busca o crea el rol admin
    let role = await prisma.rol.findUnique({
      where: { nombre: roleName }
    });
    
    if (!role) {
      role = await prisma.rol.create({
        data: { nombre: roleName }
      });
      console.log('Rol admin creado.');
    }

    // Verifica si ya existe el usuario
    let user = await prisma.usuario.findUnique({
      where: { username },
      include: {
        usuarioRoles: {
          include: {
            rol: true
          }
        }
      }
    });

    if (user) {
      // Actualiza la contraseña
      await prisma.usuario.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      
      // Verifica si ya tiene el rol admin
      const hasAdminRole = user.usuarioRoles.some(ur => ur.rol.nombre === roleName);
      if (!hasAdminRole) {
        await prisma.usuarioRol.create({
          data: {
            usuarioId: user.id,
            rolId: role.id
          }
        });
      }
      console.log('Usuario admin actualizado correctamente.');
    } else {
      // Crea el usuario
      const newUser = await prisma.usuario.create({
        data: {
          username,
          password: hashedPassword,
          usuarioRoles: {
            create: {
              rolId: role.id
            }
          }
        },
        include: {
          usuarioRoles: {
            include: {
              rol: true
            }
          }
        }
      });
      user = newUser;
      console.log('Usuario admin creado correctamente.');
    }

    console.log('Credenciales de admin:');
    console.log('Usuario: admin');
    console.log('Contraseña: ciudad2025');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
    process.exit(1);
  }
}

createOrUpdateAdmin(); 