import { Subscription } from "../../models/Subscription.ts";

export interface ISubscriptionRepository {
  create(userId: number, productId: number): Promise<Subscription>;

  delete(userId: number, productId: number): Promise<boolean>;

  find(userId: number, productId: number): Promise<Subscription | null>;

  findByProductId(productId: number): Promise<Subscription[]>;

  findByUserId(userId: number): Promise<Subscription[]>;
}
