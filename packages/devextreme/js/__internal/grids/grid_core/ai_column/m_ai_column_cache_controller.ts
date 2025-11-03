import { Controller } from '../m_modules';

export class AIColumnCacheController extends Controller {
  private readonly cache: Record<string, Record<PropertyKey, string>> = {};

  public clearCache(columnName: string): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.cache[columnName];
  }

  public getCachedResponse(columnName: string, keys: PropertyKey[]):
  Record<PropertyKey, string> {
    const columnCache = this.cache[columnName];
    if (!columnCache) return {};
    return keys.reduce<Record<PropertyKey, string>>((acc, key) => {
      const value = columnCache[key];
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  public setCachedResponse(
    columnName: string,
    data: Record<PropertyKey, string>,
  ): void {
    let columnCache = this.cache[columnName];
    if (!columnCache) {
      columnCache = {};
      this.cache[columnName] = columnCache;
    }
    Object.entries(data).forEach(([key, value]) => {
      columnCache[key] = value;
    });
  }

  public getCachedString(columnName: string, key: PropertyKey): string | undefined {
    return this.cache[columnName]?.[key];
  }

  public isEmptyCache(columnName: string): boolean {
    return Object.keys(this.cache[columnName] || {}).length === 0;
  }
}
