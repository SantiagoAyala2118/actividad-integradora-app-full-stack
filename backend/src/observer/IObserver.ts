export interface IObserver<TEvent> {
  update(event: TEvent): Promise<void>;
}
