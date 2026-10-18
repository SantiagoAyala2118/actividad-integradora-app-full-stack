import type { ProductStatusChangedEvent } from "../../types/index.ts";

export interface IObserver {
  update(event: ProductStatusChangedEvent): Promise<void>;
}
