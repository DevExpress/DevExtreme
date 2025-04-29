import type { CompatibilityColumnsController } from './columns_controller/compatibility';
import type { CompatibilityDataController } from './data_controller';
import type { CompatibilityFilterSyncController } from './filtering/filter_sync/compatibility';
import type { CompatibilityHeaderFilterController } from './filtering/header_filter/compatibility';
import type { GridCoreNewBase } from './widget';

export class WidgetMock {
  public NAME = 'dxDataGrid';

  private readonly _controllers = {
    data: this.data,
    columns: this.columns,
    headerFilter: this.headerFilter,
    filterSync: this.filterSync,
  };

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly widget: GridCoreNewBase<any>,
    private readonly data: CompatibilityDataController,
    private readonly columns: CompatibilityColumnsController,
    private readonly headerFilter: CompatibilityHeaderFilterController,
    private readonly filterSync: CompatibilityFilterSyncController,
  ) {}

  public option(...args: unknown[]): unknown {
    // @ts-expect-error
    return this.widget.option(...args);
  }

  public columnOption(...args: unknown[]): unknown {
    // @ts-expect-error
    return this.widget.columnOption(...args);
  }

  public _createActionByOption(...args: unknown[]): unknown {
    // @ts-expect-error
    return this.widget._createActionByOption(...args);
  }

  public _createComponent(...args: unknown[]): unknown {
    // @ts-expect-error
    return this.widget._createComponent(...args);
  }
}
