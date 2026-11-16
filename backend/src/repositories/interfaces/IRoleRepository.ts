import { RoleDTO } from '../../types/domain';

export interface IRoleRepository {
  findAll(): Promise<RoleDTO[]>;
  findByName(name: string): Promise<RoleDTO | null>;
}
