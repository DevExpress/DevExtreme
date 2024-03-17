/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface DIItem<T, TDeps extends readonly any[]> {
  dependencies?: readonly [...{ [P in keyof TDeps]: DIItem<TDeps[P], readonly any[]> }];

  new(...deps: TDeps): T;
}

export class DIContext {
  private readonly instances: Map<unknown, unknown> = new Map();

  private readonly antiRecursionSet = new Set();

  public register<T, TDeps extends readonly any[]>(
    id: DIItem<T, TDeps>,
    fabric?: DIItem<T, TDeps>,
  ): void {
    // eslint-disable-next-line no-param-reassign
    fabric ??= id;
    this.instances.set(id, this.create(fabric));
  }

  public get<T, TDeps extends readonly any[]>(
    id: DIItem<T, TDeps>,
  ): T {
    const res = this.instances.get(id);
    if (!res) {
      throw new Error('DI item is not registered');
    }
    return res as T;
  }

  public tryGet<T, TDeps extends readonly any[]>(
    id: DIItem<T, TDeps>,
  ): T | null {
    const res = this.instances.get(id);
    return res as T;
  }

  public create<T, TDeps extends readonly any[]>(fabric: DIItem<T, TDeps>): T {
    if (this.antiRecursionSet.has(fabric)) {
      throw new Error('dependency cycle in DI');
    }

    this.antiRecursionSet.add(fabric);

    const args = (fabric.dependencies ?? []).map((dependency) => this.create(dependency));

    this.antiRecursionSet.delete(fabric);

    // eslint-disable-next-line new-cap
    return new fabric(...args as any);
  }
}
