import { Role } from "../models/Role.ts";
import type { IRoleRepository } from "./interfaces/IRoleRepository.ts";

export class RoleRepository implements IRoleRepository {
  async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  }

  async findAll(): Promise<Role[] | []> {
    return Role.findAll();
  }
}
