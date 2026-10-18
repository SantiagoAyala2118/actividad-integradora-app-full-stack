import type { Subscription } from "../models/Subscription.ts";
import type { SubscriptionRepository } from "../repository/SubscriptionRepository.ts";
import type { ISubscriptionRepository } from "../repository/interfaces/ISubscriptionRepository.ts";
import type { IProductRepository } from "../repository/interfaces/IProductRepository.ts";
import { AppError } from "../errors/appError.ts";

export class SubscriptionService {
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly productRepository: IProductRepository;

  constructor(
    subscriptionRepository: ISubscriptionRepository,
    productRepository: IProductRepository,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.productRepository = productRepository;
  }

  async subscribe(userId: number, productId: number): Promise<Subscription> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new AppError("Producto no encontrado", 404);
    const subscription = await this.subscriptionRepository.find(
      userId,
      productId,
    );
    if (subscription)
      throw new AppError("Ya esta suscrito a este producto", 409);

    return this.subscriptionRepository.create(userId, productId);
  }

  async unsubscribe(userId: number, productId: number): Promise<void> {
    const deleted = await this.subscriptionRepository.delete(userId, productId);
    if (!deleted) {
      throw new AppError("No se encuentra suscrito a este producto", 404);
    }
  }

  async getMine(userId: number): Promise<Subscription[]> {
    return this.subscriptionRepository.findByUserId(userId);
  }
}
