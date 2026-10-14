import { Role } from "../models/Role.ts";
import { User, type UserAttributes } from "../models/User.ts";
import type { IUserRepository } from "./interfaces/IUserRepository.ts";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[] | []> {
    return User.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id, { attributes: { exclude: ["password"] } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
      include: [{ model: Role, include: ["Permission"] }],
    });
  }

  async create(data: Omit<UserAttributes, "id">): Promise<User> {
    return User.create(data);
  }

  async updateRole(userId: number, roleId: number): Promise<User | null> {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return user.update({ roleId });
  }
}
