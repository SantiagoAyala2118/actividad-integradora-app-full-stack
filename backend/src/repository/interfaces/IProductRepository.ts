import type { Product, ProductAttributes } from "../../models/Product.ts";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(data: Omit<ProductAttributes, "id">): Promise<Product>;
  update(
    id: number,
    data: Partial<Omit<ProductAttributes, "id">>,
  ): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}
