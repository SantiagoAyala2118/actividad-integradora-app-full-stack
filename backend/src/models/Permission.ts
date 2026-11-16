import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class PermissionModel extends Model<InferAttributes<PermissionModel>, InferCreationAttributes<PermissionModel>> {
  declare id: CreationOptional<number>;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    PermissionModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(60), allowNull: false, unique: true },
      },
      { sequelize, tableName: 'permissions', timestamps: false },
    );
  }
}
