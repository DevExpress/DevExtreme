interface SearchUICallbacks {
  focusSearchTextBox?: () => void;
}

export class SearchUIController {
  public static dependencies = [] as const;

  private readonly callbacks: SearchUICallbacks = {};

  public registerCallback<T extends keyof SearchUICallbacks>(
    name: T,
    callback: SearchUICallbacks[T],
  ): void {
    this.callbacks[name] = callback;
  }

  public doUIAction<T extends keyof SearchUICallbacks>(
    name: T,
  ): void {
    this.callbacks[name]?.();
  }
}
