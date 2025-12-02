import { jest } from '@jest/globals';

export default function wrapInstance<T extends object>(instance: T): T {
  const proto = Object.getPrototypeOf(instance);

  (Object.getOwnPropertyNames(proto) as (keyof T)[]).forEach((key): void => {
    const originalValue = instance[key];
    if (typeof originalValue === 'function' && key !== 'constructor') {
      const originalMethod = originalValue as (...a: unknown[]) => unknown;

      instance[key] = jest.fn(originalMethod.bind(instance)) as T[typeof key];
    }
  });

  return instance;
}
