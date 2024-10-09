/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type DataSource from '@js/data/data_source';

import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget_base';
import { DataController } from './data_controller';

export function DataControllerPublicMethods<T extends Constructor<GridCoreNewBase>>(GridCore: T) {
  return class GridCoreWithDataController extends GridCore {
    public getDataSource(): DataSource {
      return this.diContext.get(DataController).dataSource.unreactive_get();
    }
  };
}
