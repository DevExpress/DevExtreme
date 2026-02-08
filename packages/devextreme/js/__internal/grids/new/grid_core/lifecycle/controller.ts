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

/**
 * Controller which can be used to manage lifecycle events, such as rendering, initializing etc.
 *
 * @remarks
 * Please DON'T USE this controller when you're able not to use it.
 * Its purpose is to schedule some imperative things
 * (creating effects, triggering public API callback etc).
 * 99% that you can omit using it, for example using state signal to provide updated value.
 */
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
