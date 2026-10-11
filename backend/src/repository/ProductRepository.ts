import { Product } from "../models/index.ts";
import type { ProductAttributes } from "../models/Product.ts";
import type { IProductRepository } from "./interfaces/IProductRepository.ts";

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    return Product.findAll();
  }

  async findById(id: number): Promise<Product | null> {
    return Product.findByPk(id);
  }

  async create(data: Omit<ProductAttributes, "id">): Promise<Product> {
    return Product.create(data);
  }

  async update(
    id: number,
    data: Partial<Omit<ProductAttributes, "id">>,
  ): Promise<Product | null> {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await Product.destroy({ where: { id } });
    return deletedRows > 0;
  }
}
