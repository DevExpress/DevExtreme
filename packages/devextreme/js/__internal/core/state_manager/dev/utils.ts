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

export function deepCopy<T extends object>(inputObject: T): T {
  function iter(value: unknown, visited: Map<unknown, unknown>): unknown {
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
        arrayCopy[index] = iter(item, visited);
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

  const result = iter(inputObject, new Map<unknown, unknown>());

  return result as T;
}
