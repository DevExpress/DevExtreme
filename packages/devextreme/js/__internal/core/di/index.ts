/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface AbstractType<T> extends Function {
  prototype: T;
}

type Constructor<T, TDeps extends readonly any[]> = new(...deps: TDeps) => T;

interface DIItem<T, TDeps extends readonly any[]> extends Constructor<T, TDeps> {
  dependencies: readonly [...{ [P in keyof TDeps]: AbstractType<TDeps[P]> }];
}

export type DecoratorFunction<T = any> = (instance: T) => T;

export class DIContext {
  private readonly instances: Map<unknown, unknown> = new Map();

  private readonly fabrics: Map<unknown, unknown> = new Map();

  private readonly aliases: Map<unknown, unknown> = new Map();

  private readonly antiRecursionSet = new Set();

  private readonly globalDecorators: DecoratorFunction[] = [];

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
    const decoratedInstance = this.applyGlobalDecorators(instance);

    this.instances.set(id, decoratedInstance);
  }

  public get<T>(
    id: AbstractType<T>,
  ): T {
    const instance = this.tryGet(id);

    if (instance) {
      return instance;
    }

    throw new Error(`DI item is not registered: ${id}`);
  }

  public tryGet<T>(
    id: AbstractType<T>,
  ): T | null {
    // eslint-disable-next-line no-param-reassign
    id = this.resolveAlias(id);

    if (this.instances.get(id)) {
      return this.instances.get(id) as T;
    }

    const fabric = this.fabrics.get(id);
    if (fabric) {
      const instance: T = this.create(fabric as any);

      const decoratedInstance = this.applyGlobalDecorators(instance);

      this.instances.set(id, decoratedInstance);
      this.instances.set(fabric, decoratedInstance);
      return instance;
    }

    return null;
  }

  public decorator<T>(decoratorFn: DecoratorFunction<T>): void {
    if (this.hasInitiatedInstances) {
      throw new Error('Cannot add decorator: decorators must be registered before any instances are created or retrieved from the DI container.');
    }

    this.globalDecorators.push(decoratorFn);
  }

  private get hasInitiatedInstances(): boolean {
    return this.instances.size > 0;
  }

  private applyGlobalDecorators<T>(instance: T): T {
    return this.globalDecorators.reduce(
      (currentInstance, currentDecorator) => currentDecorator(currentInstance),
      instance,
    );
  }

  private create<T, TDeps extends readonly any[]>(fabric: DIItem<T, TDeps>): T {
    if (this.antiRecursionSet.has(fabric)) {
      throw new Error('dependency cycle in DI');
    }

    this.antiRecursionSet.add(fabric);

    const args = fabric.dependencies.map((dependency) => this.get(dependency));

    this.antiRecursionSet.delete(fabric);

    // eslint-disable-next-line new-cap
    return new fabric(...args as any);
  }

  public addAlias<TAlias, TID extends TAlias>(
    aliasId: AbstractType<TAlias>,
    id: AbstractType<TID>,
  ): void {
    this.aliases.set(aliasId, id);
  }

  public resolveAlias<T>(aliasId: AbstractType<T>): AbstractType<T> {
    let result = aliasId;

    /*
      NOTE: cycle it here for case when some alias resolves to another alias.
      e.g. A -> B -> C
      We need to resolve until we get class without aliases
    */
    while (this.aliases.has(result)) {
      result = this.aliases.get(result) as AbstractType<T>;
    }

    return result;
  }
}
