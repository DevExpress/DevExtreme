import type { FilterDescriptor } from '@js/data';
import type DataSource from '@js/data/data_source';
import { keysEqual } from '@ts/data/utils';

import type { GridCoreClass, Mixin } from '../types';
import type { DataControllerPublicMethods, DataObject, Key } from './types';

export function PublicMethods<T extends GridCoreClass>(
  GridCore: T,
): Mixin<T, DataControllerPublicMethods> {
  return class GridCoreWithDataController extends GridCore {
    public getDataSource(): DataSource {
      return this.dataController.dataSource.peek();
    }

    public byKey(key: Key): Promise<DataObject> | undefined {
      const items = this.getDataSource().items();
      const store = this.getDataSource().store();
      const keyExpr = store.key();

      const foundItem = items.find(
        (item) => keysEqual(keyExpr, key, this.keyOf(item)),
      );

      if (foundItem) {
        return Promise.resolve(foundItem);
      }

      return store.byKey(key);
    }

    public getCombinedFilter(): FilterDescriptor | FilterDescriptor[] {
      return this.dataController.getCombinedFilter();
    }

    public keyOf(obj: DataObject): Key {
      return this.dataController.getDataKey(obj);
    }

    public pageCount(): number {
      return this.dataController.pageCount.peek();
    }

    public pageSize(): number;
    public pageSize(value: number): void;
    public pageSize(value?: number): number | undefined {
      if (value === undefined) {
        return this.dataController.pageSize.peek();
      }
      this.dataController.pageSize.value = value;
      return undefined;
    }

    public pageIndex(): number;
    public pageIndex(newIndex: number): Promise<void>;
    public pageIndex(newIndex?: number): number | Promise<void> {
      if (newIndex === undefined) {
        return this.dataController.pageIndex.peek();
      }

      this.dataController.pageIndex.value = newIndex;

      return this.dataController.waitLoaded();
    }

    public totalCount(): number {
      return this.dataController.totalCount.peek();
    }
  };
}
