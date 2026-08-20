import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isFunction } from '@js/core/utils/type';

type InjectionStore = Record<string, unknown>;

type InjectedMethod = (...args: unknown[]) => unknown;

interface CallBaseHolder {
  callBase?: unknown;
}

export type Injection<T> = {
  [K in keyof T]?: T[K] extends (...args: infer TArgs) => infer TResult
    ? (this: Injectable<T> & { callBase: T[K] }, ...args: TArgs) => TResult
    : T[K];
} & {
  // Invoked once when the injection is applied (and again on every later inject call
  // while this injection stays the topmost one that declares a ctor).
  ctor?: (this: T) => void;
};

export type Injectable<T> = T & {
  inject: (injectionObject: Injection<T>) => void;
  resetInjection: () => void;
};

function isInjectedMethod(value: unknown): value is InjectedMethod {
  return isFunction(value);
}

function wrapOverridden(
  base: InjectionStore,
  methodName: string,
  method: InjectedMethod,
): InjectedMethod {
  return function overriddenMethod(this: CallBaseHolder, ...args: unknown[]): unknown {
    const prevCallBase = this.callBase;

    this.callBase = base[methodName];

    try {
      return method.apply(this, args);
    } finally {
      this.callBase = prevCallBase;
    }
  };
}

function injector<T extends object>(object: T): Injectable<T> {
  const facade = object as InjectionStore;
  const initialFields: InjectionStore = {};
  const baseInstance: InjectionStore = {};

  each(facade, (key: string): void => {
    baseInstance[key] = facade[key];
  });

  let instance = baseInstance;

  const invokeConstructor = (...args: unknown[]): void => {
    const { ctor } = instance;

    if (isInjectedMethod(ctor)) {
      ctor.apply(instance, args);
    }
  };

  const injectFields = (injectionObject: object, initial?: boolean): void => {
    each(injectionObject, (key: string): void => {
      if (isFunction(instance[key])) {
        if (initial || !facade[key]) {
          facade[key] = (...args: unknown[]): unknown => {
            const method = instance[key] as InjectedMethod;

            return method.apply(facade, args);
          };
        }
      } else {
        if (initial) {
          initialFields[key] = facade[key];
        }
        facade[key] = instance[key];
      }
    });
  };

  invokeConstructor(object);
  injectFields(facade, true);

  facade.inject = (injectionObject: Injection<T>): void => {
    const overriddenInstance: InjectionStore = Object.create(instance);

    each(injectionObject, (key: string, member: unknown): void => {
      overriddenInstance[key] = isFunction(instance[key]) && isInjectedMethod(member)
        ? wrapOverridden(instance, key, member)
        : member;
    });

    instance = overriddenInstance;

    invokeConstructor();
    injectFields(injectionObject);
  };

  facade.resetInjection = (): void => {
    extend(facade, initialFields);
    instance = baseInstance;
    invokeConstructor();
  };

  return object as Injectable<T>;
}

export { injector };
