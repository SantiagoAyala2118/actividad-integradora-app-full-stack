import { CreateUserData, UserDTO, UserWithPassword } from '../../types/domain';

export interface IUserRepository {
  findAll(): Promise<UserDTO[]>;
  findById(id: number): Promise<UserDTO | null>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
  create(data: CreateUserData): Promise<UserDTO>;
  updateRole(userId: number, roleId: number): Promise<UserDTO | null>;
}
