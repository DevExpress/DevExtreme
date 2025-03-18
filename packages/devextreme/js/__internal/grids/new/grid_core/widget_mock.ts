import type { CompatibilityColumnsController } from './columns_controller/compatibility';
import type { CompatibilityDataController } from './data_controller';
import type { GridCoreNewBase } from './widget';

export class WidgetMock {
  public NAME = 'dxDataGrid';

  private readonly _controllers = {
    data: this.data,
    columns: this.columns,
    filterSync: {
      getCustomFilterOperations(): unknown[] {
        return [];
      },
    },
  };

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly widget: GridCoreNewBase<any>,
    private readonly data: CompatibilityDataController,
    private readonly columns: CompatibilityColumnsController,
  ) {}

  public option(...args: unknown[]): unknown {
    // @ts-expect-error
    return this.widget.option(...args);
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
