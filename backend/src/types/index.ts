import type { UserAttributes } from "../models/User.ts";
import type { ProductStatus } from "../models/Product.ts";

// Lo que viaja dentro del JWT y queda en req.user
export interface AuthUser {
  userId: number;
  role: string;
  permissions: string[];
}

// Lo que publica ProductService cuando cambia un estado (Observer)
export interface ProductStatusChangedEvent {
  productId: number;
  productName: string;
  oldStatus: ProductStatus;
  newStatus: ProductStatus;
}

// Lo que recibe cada canal (INotifier). Es la "Notification" de la consigna;
// se llama NotificationData para no chocar con el modelo Notification de Sequelize.
export interface NotificationData {
  userId: number;
  productId: number;
  productName: string;
  oldStatus: ProductStatus;
  newStatus: ProductStatus;
}

export type PublicUser = Omit<UserAttributes, "password">;
