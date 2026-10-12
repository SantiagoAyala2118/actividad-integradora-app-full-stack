// src/services/UserService.ts
import type { IUserRepository } from "../repository/interfaces/IUserRepository.ts";
import type { IRoleRepository } from "../repository/interfaces/IRoleRepository.ts";
import type { User, UserAttributes } from "../models/User.ts";

export class UserService {
  private userRepository: IUserRepository;
  private roleRepository: IRoleRepository;

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository,
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  // Listar todos los usuarios
  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  // Buscar uno por id
  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  // Registrar usuario 
  async register(data: Omit<UserAttributes, "id">): Promise<User> {
    if (data.name.trim() === "") {
      throw new Error("El nombre es obligatorio");
    }
    if (!data.email.includes("@")) {
      throw new Error("El email no es válido");
    }
    if (data.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Ya existe un usuario con ese email");
    }

    // Validamos que el rol exista
    const role = await this.roleRepository.findAll();
    const roleExists = role.some((r) => r.id === data.roleId);
    if (!roleExists) {
      throw new Error("El rol especificado no existe");
    }

    return this.userRepository.create(data);
  }

  // Cambiar el rol de un usuario (recibiendo el nombre del rol)
  async changeRole(userId: number, roleName: string): Promise<User> {
    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw new Error(`El rol "${roleName}" no existe`);
    }

    const updated = await this.userRepository.updateRole(userId, role.id!);
    if (!updated) {
      throw new Error("Usuario no encontrado");
    }
    return updated;
  }
}