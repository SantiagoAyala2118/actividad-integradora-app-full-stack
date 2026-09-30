import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/DatabaseConnection.ts";

// 1. esta es la interfaz con los atributos del usuario
export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
};


export class User extends Model<UserAttributes> implements UserAttributes {
    public id?: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public roleId!: number;
};

User.init(
    {
        id: {
            type: DataTypes.INTERGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: "User",
    }
)