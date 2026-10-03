import { DataTypes, Model } from "sequelize";
import { DatabaseConnection } from "../config/DatabaseConnection.ts";

// 1. Interfaz de atributos
export interface PermissionAttributes {
  id?: number;
  action: string;
}

// 2. Clase Permission
export class Permission
  extends Model<PermissionAttributes>
  implements PermissionAttributes
{
  declare id?: number;
  declare action: string;
}

// 3. Inicialización
Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: DatabaseConnection.getInstance().getSequelize(),
    tableName: "permissions",
    timestamps: true,
  },
);
