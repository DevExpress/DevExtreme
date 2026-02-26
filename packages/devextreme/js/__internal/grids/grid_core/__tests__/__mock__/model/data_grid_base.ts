/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';

import { GridCoreModel } from './grid_core';

export abstract class DataGridBaseModel<
  TInstance extends GridBase = GridBase,
> extends GridCoreModel<TInstance> {
  public apiColumnOption(id: string, name?: string, value?: any): any {
    const instance = this.getInstance();

    switch (arguments.length) {
      case 1:
        return instance.columnOption(id);
      case 2:
        return instance.columnOption(id, name);
      default:
        instance.columnOption(id, name as string, value);
        return undefined;
    }
  }

  public async apiRefresh(): Promise<void> {
    await this.getInstance().refresh();
  }
}
