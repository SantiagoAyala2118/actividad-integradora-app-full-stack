import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/DatabaseConnection.ts";

export interface RoleAttributes {
    id?: number;
    name: string;
};

export class Role extends Model <RoleAttributes> implements RoleAttributes {
    public id?: number;
    public name!: string;
}