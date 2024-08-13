/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/ban-types
interface AbstractType<T> extends Function {
  prototype: T;
}

type Constructor<T, TDeps extends readonly any[]> = new(...deps: TDeps) => T;

interface DIItem<T, TDeps extends readonly any[]> extends Constructor<T, TDeps> {
  dependencies: readonly [...{ [P in keyof TDeps]: AbstractType<TDeps[P]> }];
}

export class DIContext {
  private readonly instances: Map<unknown, unknown> = new Map();

  private readonly fabrics: Map<unknown, unknown> = new Map();

  private readonly antiRecursionSet = new Set();

  public register<TId, TFabric extends TId, TDeps extends readonly any[]>(
    id: AbstractType<TId>,
    fabric: DIItem<TFabric, TDeps>,
  ): void;
  public register<T, TDeps extends readonly any[]>(
    idAndFabric: DIItem<T, TDeps>,
  ): void;
  public register<T, TDeps extends readonly any[]>(
    id: DIItem<T, TDeps>,
    fabric?: DIItem<T, TDeps>,
  ): void {
    // eslint-disable-next-line no-param-reassign
    fabric ??= id;
    this.fabrics.set(id, fabric);
  }

  public registerInstance<T>(
    id: AbstractType<T>,
    instance: T,
  ): void {
    this.instances.set(id, instance);
  }

  public get<T>(
    id: AbstractType<T>,
  ): T {
    if (this.instances.get(id)) {
      return this.instances.get(id) as T;
    }

    const fabric = this.fabrics.get(id);
    if (fabric) {
      const res: T = this.create(fabric as any);
      this.instances.set(id, res);
      return res;
    }

    throw new Error('DI item is not registered');
  }

  public tryGet<T, TDeps extends readonly any[]>(
    id: Constructor<T, TDeps>,
  ): T | null {
    const res = this.instances.get(id);
    return res as T;
  }

  public create<T, TDeps extends readonly any[]>(fabric: DIItem<T, TDeps>): T {
    if (this.antiRecursionSet.has(fabric)) {
      throw new Error('dependency cycle in DI');
    }

    this.antiRecursionSet.add(fabric);

    const args = (fabric.dependencies ?? []).map((dependency) => this.get(dependency));

    this.antiRecursionSet.delete(fabric);

    // eslint-disable-next-line new-cap
    return new fabric(...args as any);
  }
}
