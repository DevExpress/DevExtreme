/* eslint-disable spellcheck/spell-checker */
import { ColumnsController } from './columns_controller';
import type { Column } from './types';

export class CompatibilityColumnsController {
  public static dependencies = [ColumnsController] as const;

  constructor(
    private readonly realColumnsController: ColumnsController,
  ) {}

  public getColumns(): Column[] {
    return this.realColumnsController.columns.unreactive_get();
  }

  public getFilteringColumns(): Column[] {
    return this.realColumnsController.columns.unreactive_get();
  }
}
