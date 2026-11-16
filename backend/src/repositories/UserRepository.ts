import { PermissionModel, RoleModel, UserModel } from '../models';
import { CreateUserData, UserDTO, UserWithPassword } from '../types/domain';
import { IUserRepository } from './interfaces/IUserRepository';

const withRoleAndPermissions = [
  {
    model: RoleModel,
    as: 'role',
    include: [{ model: PermissionModel, as: 'permissions', through: { attributes: [] } }],
  },
];

export class UserRepository implements IUserRepository {
  async findAll(): Promise<UserDTO[]> {
    const users = await UserModel.findAll({ include: withRoleAndPermissions, order: [['id', 'ASC']] });
    return users.map((u) => this.toDTO(u));
  }

  async findById(id: number): Promise<UserDTO | null> {
    const user = await UserModel.findByPk(id, { include: withRoleAndPermissions });
    return user ? this.toDTO(user) : null;
  }

  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    const user = await UserModel.findOne({ where: { email }, include: withRoleAndPermissions });
    return user ? { ...this.toDTO(user), passwordHash: user.passwordHash } : null;
  }

  async create(data: CreateUserData): Promise<UserDTO> {
    const created = await UserModel.create(data);
    const user = await this.findById(created.id);
    if (!user) throw new Error('No se pudo recuperar el usuario creado');
    return user;
  }

  async updateRole(userId: number, roleId: number): Promise<UserDTO | null> {
    const [affected] = await UserModel.update({ roleId }, { where: { id: userId } });
    if (affected === 0) return null;
    return this.findById(userId);
  }

  private toDTO(user: UserModel): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name ?? '',
      permissions: user.role?.permissions?.map((p) => p.name) ?? [],
    };
  }
}
