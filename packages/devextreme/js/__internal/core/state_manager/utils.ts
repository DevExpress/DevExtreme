export function joinStatePath(stateId: string, propertyName: string, separator = '.'): string {
  return [stateId, propertyName].join(separator);
}

export function splitStatePath(statePath: string, separator = '.'): string[] {
  return statePath.split(separator).filter(Boolean);
}

export function isValidStatePath(statePath: string): boolean {
  const parts = splitStatePath(statePath);
  return parts.length >= 2;
}

export function areEqual(inputA: unknown, inputB: unknown): boolean {
  function iter(a: unknown, b: unknown, visited = new WeakMap()): boolean {
    if (a === b) return true;

    if (a === null || b === null || a === undefined || b === undefined) {
      return a === b;
    }

    if (typeof a !== 'object' || typeof b !== 'object') {
      return a === b;
    }

    const visitedA = visited.get(a);
    if (visitedA) {
      return visitedA === b;
    }

    visited.set(a, b);

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    if (a instanceof RegExp && b instanceof RegExp) {
      return a.toString() === b.toString();
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;

      return a.every((item, index) => iter(item, b[index], visited));
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => Object.prototype.hasOwnProperty.call(b, key)
             && iter(a[key], b[key], visited));
  }

  return iter(inputA, inputB);
}

export function deepCopy<T extends object>(inputObject: T): T {
  function iter(value: unknown, visited = new WeakMap<object, unknown>()): unknown {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (visited.has(value)) {
      return visited.get(value);
    }

    if (value instanceof Date) {
      const dateCopy = new Date(value.getTime());
      visited.set(value, dateCopy);
      return dateCopy;
    }

    if (value instanceof RegExp) {
      const regExpCopy = new RegExp(value.source, value.flags);
      visited.set(value, regExpCopy);
      return regExpCopy;
    }

    if (Array.isArray(value)) {
      const arrayCopy: unknown[] = [];

      visited.set(value, arrayCopy);

      value.forEach((item, index) => {
        arrayCopy[index] = iter(item);
      });
      return arrayCopy;
    }

    const objectCopy: Record<string, unknown> = {};
    visited.set(value, objectCopy);

    Object.keys(value).forEach((key) => {
      const propertyValue = value[key];
      objectCopy[key] = iter(propertyValue, visited);
    });

    return objectCopy;
  }

  const result = iter(inputObject);

  return result as T;
}
