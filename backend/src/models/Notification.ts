import { DataTypes, Model } from "sequelize";
import { DatabaseConnection } from "../config/DatabaseConnection.ts";

// interface para los atributos de la tabla notification
export interface NotificationAttributes {
  id?: number;
  userId: number;
  productId: number;
  message: string;
  read: boolean;
}

// definicion de la clase notification que extiende de model y implementa la interfaz NotificationAttributes
export class Notification
  extends Model<NotificationAttributes>
  implements NotificationAttributes
{
  declare id?: number;
  declare userId: number;
  declare productId: number;
  declare message: string;
  declare read: boolean;
}

// 3. Inicialización
Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: DatabaseConnection.getInstance().getSequelize(),
    tableName: "notifications",
    timestamps: true,
  },
);
