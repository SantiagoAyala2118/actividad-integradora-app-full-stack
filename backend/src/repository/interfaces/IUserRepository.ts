import { User } from "../../models/User.ts";
import type { UserAttributes } from "../../models/User.ts";

export interface IUserRepository {
  findAll(): Promise<User[] | []>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<UserAttributes, "id">): Promise<User>;
  updateRole(userId: number, roleId: number): Promise<User | null>;
}
