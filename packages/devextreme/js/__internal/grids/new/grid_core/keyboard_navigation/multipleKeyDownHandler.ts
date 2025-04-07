export class MultipleKeyDownHandler {
  private readonly trackedKeysSet: Set<KeyboardEvent['key']>;

  private readonly pressedKeysSet: Set<KeyboardEvent['key']>;

  constructor(
    trackedKeys: KeyboardEvent['key'][],
  ) {
    this.trackedKeysSet = new Set(trackedKeys.map((key) => key.toLowerCase()));
    this.pressedKeysSet = new Set();
  }

  public readonly onKeyDownHandler = (
    event: KeyboardEvent,
    callback: (event: KeyboardEvent) => void,
  ): void => {
    const normalizedKey = event.key.toLowerCase();

    if (!this.trackedKeysSet.has(normalizedKey)) {
      return;
    }

    this.pressedKeysSet.add(normalizedKey);

    if (this.trackedKeysSet.size !== this.pressedKeysSet.size) {
      return;
    }

    callback(event);
  };

  public readonly onKeyUpHandler = (event: KeyboardEvent): void => {
    const normalizedKey = event.key.toLowerCase();

    if (!this.trackedKeysSet.has(normalizedKey)) {
      return;
    }

    this.pressedKeysSet.delete(normalizedKey);
  };
}
