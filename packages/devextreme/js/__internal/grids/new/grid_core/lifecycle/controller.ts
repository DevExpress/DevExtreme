/* eslint-disable max-classes-per-file */
class LifeCycleEvent {
  private readonly callbacks = new Set<() => void>();

  public schedule(cb: () => void): void {
    this.callbacks.add(cb);
  }

  public trigger(): void {
    for (const cb of this.callbacks) {
      cb();
    }

    this.callbacks.clear();
  }
}

export class LifeCycleController {
  private contentReadyCallback?: () => void;

  public readonly contentRendered = new LifeCycleEvent();

  public static dependencies = [] as const;

  public provideContentReadyCallback(cb: () => void): void {
    this.contentReadyCallback = cb;
  }

  public fireContentReady(): void {
    this.contentReadyCallback?.();
  }
}
