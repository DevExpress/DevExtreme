import { Controller } from '../m_modules';

export class AIColumnCacheController extends Controller {
  private readonly cache: Map<string, Map<PropertyKey, string>> = new Map();

  public clearCache(columnName: string): void {
    this.cache.delete(columnName);
  }

  public getCachedResponse(columnName: string, keys: PropertyKey[]):
  Record<PropertyKey, string> {
    const columnCache = this.cache.get(columnName);
    if (!columnCache) return {};
    return keys.reduce<Record<PropertyKey, string>>((acc, key) => {
      const value = columnCache.get(key);
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
    let columnCache = this.cache.get(columnName);
    if (!columnCache) {
      columnCache = new Map<PropertyKey, string>();
      this.cache.set(columnName, columnCache);
    }
    Object.entries(data).forEach(([key, value]) => {
      columnCache.set(key, value);
    });
  }

  public getCachedString(columnName: string, key: PropertyKey): string | undefined {
    return this.cache.get(columnName)?.get(key);
  }

  public isEmptyCache(columnName: string): boolean {
    return this.cache.get(columnName)?.size === 0;
  }

  public dispose(): void {
    this.cache.clear();
  }
}
