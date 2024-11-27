/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget_base';
import { ColumnsController } from './columns_controller';
import type { Column } from './types';

export function PublicMethods<T extends Constructor<GridCoreNewBase>>(GridCore: T) {
  return class GridCoreWithColumnsController extends GridCore {
    public getVisibleColumns(): Column[] {
      return this.diContext.get(ColumnsController).visibleColumns.unreactive_get();
    }
  };
}
