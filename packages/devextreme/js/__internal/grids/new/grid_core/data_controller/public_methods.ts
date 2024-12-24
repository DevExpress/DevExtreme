/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type DataSource from '@js/data/data_source';

import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';
import { DataController } from './data_controller';
import { Deferred } from '@js/core/utils/deferred';
import { FilterDescriptor } from '@js/data';

export function PublicMethods<T extends Constructor<GridCoreNewBase>>(GridCore: T) {
  return class GridCoreWithDataController extends GridCore {
    public getDataSource(): DataSource {
      return this.diContext.get(DataController).dataSource.unreactive_get();
    }

    public byKey(key: object): Promise<object> | undefined {
      const store = this.getDataSource().store();
      const cardIndex = this.diContext.get(DataController).getCardIndexByKey(key);
      let result = undefined;

      if (!store) return;

      if (cardIndex >= 0) {
        // @ts-expect-error
        result = new Deferred().resolve(this.getDataSource().items()[cardIndex].data);
      }

      return result || store.byKey(key);
    }

    public getFilter(): FilterDescriptor | Array<FilterDescriptor> {
      return this.getDataSource().filter();
    }

    public keyOf(obj: object) {
      return this.diContext.get(DataController).getDataKey(obj);
    }

    public pageCount(): number {
      return this.diContext.get(DataController).pageCount.unreactive_get();
    }

    public pageSize(): number;
    public pageSize(value: number):void;
    public pageSize(value?: number):number | void {
      if(value === undefined) {
        return this.diContext.get(DataController).pageSize.unreactive_get();
      }
      this.diContext.get(DataController).pageSize.update(value);
    }

    public pageIndex(): number;
    public pageIndex(newIndex: number): void;
    public pageIndex(newIndex?: number): number | void { 
      if(newIndex === undefined) {
        return this.diContext.get(DataController).pageIndex.unreactive_get();
      }
      // TODO: Promise<void> (jQuery or native)
      return this.diContext.get(DataController).pageIndex.update(newIndex);
    }

    public totalCount(): number {
      return this.diContext.get(DataController).totalCount.unreactive_get();
    }
  };
}
