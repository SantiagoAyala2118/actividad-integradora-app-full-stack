import { AppError } from "../errors/appError.ts";
import type { IUserRepository } from "../repository/interfaces/IUserRepository.ts";
import type { IRoleRepository } from "../repository/interfaces/IRoleRepository.ts";
import type { User } from "../models/User.ts";
import type { PublicUser } from "../types/index.ts";
import { toPublicUser } from "./toPublicUser.ts";

export class UserService {
  private readonly userRepository: IUserRepository;
  private readonly roleRepository: IRoleRepository;

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository,
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  // Listar todos los usuarios (el repository ya excluye la contraseña)
  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  // Buscar uno por id
  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }
    return user;
  }

  // Cambiar el rol de un usuario (recibiendo el nombre del rol)
  async changeRole(userId: number, roleName: string): Promise<PublicUser> {
    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw new AppError(`El rol "${roleName}" no existe`, 400);
    }

    const updated = await this.userRepository.updateRole(userId, role.id!);
    if (!updated) {
      throw new AppError("Usuario no encontrado", 404);
    }
    return toPublicUser(updated);
  }
}
