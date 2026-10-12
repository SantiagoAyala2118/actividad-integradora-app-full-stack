// src/services/ProductService.ts
import type { IProductRepository } from "../repository/interfaces/IProductRepository.ts";
import type { Product, ProductAttributes } from "../models/Product.ts";

export class ProductService {
  private productRepository: IProductRepository;


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
      throw new Error("Producto no encontrado");
    }
    return product;
  }

// Crear un Producto
  async create(data: Omit<ProductAttributes, "id">): Promise<Product> {
    if (data.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (data.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }
    return this.productRepository.create(data);
  }

// Actualizar Producto
  async update(
    id: number,
    data: Partial<Omit<ProductAttributes, "id">>,
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    if (data.price !== undefined && data.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    const updated = await this.productRepository.update(id, data);
    if (!updated) {
      throw new Error("No se pudo actualizar el producto");
    }
    return updated;
  }

//Borrar Producto
  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    await this.productRepository.delete(id);
  }
}