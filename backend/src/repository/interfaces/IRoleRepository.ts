import { Role } from "../../models/Role.ts";

export interface IRoleRepository {
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[] | []>;
}
