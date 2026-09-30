import { DataTypes, Model } from "sequelize";
import { DatabaseConnection } from "../config/DatabaseConnection.ts";

// interfaz de atributos del producto

export type ProductStatus = "DISPONIBLE" | "SIN_STOCK" | "DISCONTINUADO";

// contrato de atributos para el modelo Producto
export interface ProductAttributes {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
}

// clase Product
export class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id?: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public status!: ProductStatus;
}

// inicializacion del modelo Product

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("DISPONIBLE", "SIN_STOCK", "DISCONTINUADO"),
      allowNull: false,
      defaultValue: "DISPONIBLE",
    },
  },
  {
    sequelize: DatabaseConnection.getInstance().getSequelize(),
    tableName: "products",
    timestamps: true,
  }
);