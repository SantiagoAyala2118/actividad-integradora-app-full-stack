import { Subscription } from "../models/Subscription.ts";
import type { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository.ts";

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

  async find(): Promise<Subscription[] | []> {
    return Subscription.findAll();
  }

  async findByProductId(productId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { productId } });
  }

  async findByUserId(userId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { userId } });
  }
}
