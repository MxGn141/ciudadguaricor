import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Role } from './Role';

@Entity('usuario_rol')
export class UserRole {
  @PrimaryColumn()
  usuario_id!: number;

  @PrimaryColumn()
  rol_id!: number;

  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: User;

  @ManyToOne(() => Role, role => role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rol_id' })
  rol!: Role;
} 