import { DataTypes, Model } from "sequelize";
import { DatabaseConnection } from "../config/DatabaseConnection.ts";

// contrato de atributos de la tabla subscription
interface SubscriptionAttributes {
    id?: number;
    userId: number;
    productId: number;
};

export class Subscription extends Model<SubscriptionAttributes> implements SubscriptionAttributes {
    public id?: number;
    public userId!: number;
    public productId!: number;
};

// inicializar la tabla subscription

Subscription.init(
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
  },
  {
    sequelize: DatabaseConnection.getInstance().getSequelize(),
    tableName: "subscriptions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"], // esto es para evitar que un usuario se suscriba al mismo producto mas de una vez
      },
    ],
  }
);