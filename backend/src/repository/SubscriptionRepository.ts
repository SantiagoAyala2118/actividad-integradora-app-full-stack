import { Subscription } from "../models/Subscription.ts";
import type { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository.ts";
import { Product } from "../models/Product.ts";

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(userId: number, productId: number): Promise<Subscription> {
    return Subscription.create({ userId, productId });
  }

  async delete(userId: number, productId: number): Promise<boolean> {
    const delSubs = await Subscription.destroy({
      where: { userId, productId },
    });
    return delSubs > 0;
  }

  async find(userId: number, productId: number): Promise<Subscription | null> {
    return Subscription.findOne({ where: { userId, productId } });
  }

  async findByProductId(productId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { productId } });
  }

  async findByUserId(userId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { userId }, include: [Product] });
  }
}
