import { NotFoundError } from '../errors/AppError';
import { IRoleRepository } from '../repositories/interfaces/IRoleRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { RoleDTO, UserDTO } from '../types/domain';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  listUsers(): Promise<UserDTO[]> {
    return this.userRepository.findAll();
  }

  listRoles(): Promise<RoleDTO[]> {
    return this.roleRepository.findAll();
  }

  async assignRole(userId: number, roleName: string): Promise<UserDTO> {
    const role = await this.roleRepository.findByName(roleName);
    if (!role) throw new NotFoundError(`El rol "${roleName}" no existe`);

    const user = await this.userRepository.updateRole(userId, role.id);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    return user;
  }
}
