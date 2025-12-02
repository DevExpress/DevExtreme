import { isDefined } from '@js/core/utils/type';

export class Cache {
  private readonly cache = new Map();

  get size(): number { return this.cache.size; }

  clear(): void {
    this.cache.clear();
  }

  get<R>(name: string): R | undefined {
    return this.cache.get(name) as R | undefined;
  }

  memo<R>(name: string, valueCallback: () => R): R {
    if (!this.cache.has(name)) {
      const value = valueCallback();

      if (isDefined(value)) {
        this.cache.set(name, value);
      }
    }

    return this.cache.get(name) as R;
  }

  delete(name: string): void {
    this.cache.delete(name);
  }
}

export const globalCache = {
  timezones: new Cache(),
  DST: new Cache(),
};
