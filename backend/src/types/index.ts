export enum ProductStatus {
  DISPONIBLE = "DISPONIBLE",
  SIN_STOCK = "SIN_STOCK",
  DISCONTINUADO = "DISCONTINUADO",
}

// Lo que viaja dentro del JWT y queda en req.user
export interface AuthUser { userId: number; role: string; permissions: string[]; }

// Lo que publica ProductService cuando cambia un estado (Observer)
export interface ProductStatusChangedEvent {
  productId: number; productName: string;
  oldStatus: ProductStatus; newStatus: ProductStatus;
}

// Lo que recibe cada canal (INotifier). Es la "Notification" de la consigna;
// se llama NotificationData para no chocar con el modelo Notification de Sequelize.
export interface NotificationData {
  userId: number; userEmail: string;
  productId: number; productName: string;
  oldStatus: ProductStatus; newStatus: ProductStatus;
}
