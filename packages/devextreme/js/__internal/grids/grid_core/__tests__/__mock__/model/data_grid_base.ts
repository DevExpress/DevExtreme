/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';
import type { DxPromise } from '@js/core/utils/deferred';

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

  public apiCellValue(rowIndex: number, dataField: string, value: unknown): void {
    this.getInstance().cellValue(rowIndex, dataField, value);
  }

  public apiSaveEditData(): DxPromise {
    return this.getInstance().saveEditData();
  }

  public async apiRefresh(): Promise<void> {
    await this.getInstance().refresh();
  }

  public apiAbortAIColumnRequest(columnName: string): void {
    this.getInstance().abortAIColumnRequest(columnName);
  }
}
