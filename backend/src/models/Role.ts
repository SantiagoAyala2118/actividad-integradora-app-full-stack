import { DataTypes, Model } from "sequelize";
import { DatabaseConnection } from "../config/DatabaseConnection.ts";

//1. Interfaz de atributos del rol

export interface RoleAttributes {
    id?: number;
    name: string;
};

// 2. Clase Role
export class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id?: number;
  public name!: string;
}

// 3. Inicialización
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
  }
);