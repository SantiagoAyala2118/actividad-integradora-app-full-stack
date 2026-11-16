import {
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import { PermissionModel } from './Permission';

export class RoleModel extends Model<InferAttributes<RoleModel>, InferCreationAttributes<RoleModel>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare permissions?: NonAttribute<PermissionModel[]>;

  declare setPermissions: BelongsToManySetAssociationsMixin<PermissionModel, number>;

  static initModel(sequelize: Sequelize): void {
    RoleModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(40), allowNull: false, unique: true },
      },
      { sequelize, tableName: 'roles', timestamps: false },
    );
  }
}
