// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error

// eslint-disable-next-line no-multi-assign
const disposableSymbol: unique symbol = Symbol.dispose ??= Symbol('dispose');

export interface Disposable {
  [disposableSymbol]: () => void;
}

export class DisposableStack {
  private _disposed = false;

  private stack: Disposable[] = [];

  public get disposed(): boolean {
    return this._disposed;
  }

  public dispose(): void {
    if (this._disposed) {
      return;
    }

    this.stack.forEach((disposable) => {
      disposable[disposableSymbol]();
    });

    this._disposed = true;
    this.stack = [];
  }

  public use<T extends Disposable | null | undefined>(value: T): T {
    if (value) {
      // @ts-expect-error todo: remove once ts is updated
      this.stack.push(value);
    }
    return value;
  }

  public adopt<T>(value: T, onDispose: (value: T) => void): T {
    this.stack.push({
      [disposableSymbol]: () => onDispose(value),
    });
    return value;
  }

  public defer(onDispose: () => void): void {
    this.stack.push({
      [disposableSymbol]: onDispose,
    });
  }

  public move(): DisposableStack {
    const stack = new DisposableStack();
    stack.stack = this.stack;
    this.stack = [];
    return stack;
  }

  public [Symbol.dispose](): void {
    this.dispose();
  }
}
