/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '../m_modules';

export class AiColumnCacheController extends Controller {
  public clearCache(columnName: string): void {

  }

  public getCachedResponse(columnName: string, keys: PropertyKey[]):
    Record<PropertyKey, string> | null {
    return null;
  }

  public getCachedString(columnName: string, key: PropertyKey): string | null {
    return null;
  }

  public isEmptyCache(columnName: string): boolean {
    return true;
  }
}
