import { AppError } from "../errors/appError.ts";
import type { IProductRepository } from "../repository/interfaces/IProductRepository.ts";
import type { Product, ProductAttributes } from "../models/Product.ts";

export class ProductService {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  // Obtener Todos
  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  // Obtener por ID
  async getById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }
    return product;
  }

  // Crear un Producto
  async create(data: Omit<ProductAttributes, "id">): Promise<Product> {
    if (data.price <= 0) {
      throw new AppError("El precio debe ser mayor a 0", 400);
    }
    if (data.stock < 0) {
      throw new AppError("El stock no puede ser negativo", 400);
    }
    return this.productRepository.create(data);
  }

  // Actualizar Producto (el estado NO se cambia acá: se hace con changeStatus)
  async update(
    id: number,
    data: Partial<Omit<ProductAttributes, "id" | "status">>,
  ): Promise<Product> {
    if (data.price !== undefined && data.price <= 0) {
      throw new AppError("El precio debe ser mayor a 0", 400);
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new AppError("El stock no puede ser negativo", 400);
    }
    const updated = await this.productRepository.update(id, data);
    if (!updated) {
      throw new AppError("Producto no encontrado", 404);
    }
    return updated;
  }

  // Borrar Producto
  async delete(id: number): Promise<void> {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new AppError("Producto no encontrado", 404);
    }
  }
}
