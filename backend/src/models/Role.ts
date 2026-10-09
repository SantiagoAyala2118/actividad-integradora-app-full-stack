import { DataTypes, Model } from "sequelize";
import { DatabaseConnection } from "../config/DatabaseConnection.ts";
import type { Permission } from "./Permission.ts";

// Contrato de atributos para el modelo Role

export interface RoleAttributes {
  id?: number;
  name: string;
}

// clase Role
export class Role extends Model<RoleAttributes> implements RoleAttributes {
  declare id?: number;
  declare name: string;
  declare Permissions?: Permission[];
}

// inicializacion del modelo Role
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: DatabaseConnection.getInstance().getSequelize(),
    tableName: "roles",
    timestamps: true,
  },
);
