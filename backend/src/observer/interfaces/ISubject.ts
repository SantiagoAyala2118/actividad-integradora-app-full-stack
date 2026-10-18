import type { IObserver } from "./IObserver.ts";
import type { ProductStatusChangedEvent } from "../../types/index.ts";

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(event: ProductStatusChangedEvent): Promise<void>;
}
