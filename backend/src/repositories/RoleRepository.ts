import { PermissionModel, RoleModel } from '../models';
import { RoleDTO } from '../types/domain';
import { IRoleRepository } from './interfaces/IRoleRepository';

export class RoleRepository implements IRoleRepository {
  async findAll(): Promise<RoleDTO[]> {
    const roles = await RoleModel.findAll({
      include: [{ model: PermissionModel, as: 'permissions', through: { attributes: [] } }],
      order: [['id', 'ASC']],
    });
    return roles.map((r) => this.toDTO(r));
  }

  async findByName(name: string): Promise<RoleDTO | null> {
    const role = await RoleModel.findOne({
      where: { name },
      include: [{ model: PermissionModel, as: 'permissions', through: { attributes: [] } }],
    });
    return role ? this.toDTO(role) : null;
  }

  private toDTO(role: RoleModel): RoleDTO {
    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions?.map((p) => p.name) ?? [],
    };
  }
}
