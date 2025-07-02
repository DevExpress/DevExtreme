import { ColumnsController } from './columns_controller';
import type { Column } from './types';
import { addDataFieldToComputedColumns } from './utils';

export class CompatibilityColumnsController {
  public static dependencies = [ColumnsController] as const;

  constructor(
    private readonly realColumnsController: ColumnsController,
  ) {}

  public getColumns(): Column[] {
    return this.realColumnsController.columns.peek();
  }

  public getFilteringColumns(): Column[] {
    return addDataFieldToComputedColumns(
      this.realColumnsController.filterableColumns.peek(),
    );
  }
}
