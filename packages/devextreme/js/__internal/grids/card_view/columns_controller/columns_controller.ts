import { computed } from '@ts/core/reactive';

import { OptionsController } from '../options_controller/options_controller';
import type { Column, DataRow } from './types';
import { normalizeColumn } from './utils';

export class ColumnsController {
  private readonly columnsConfiguration = this.options.oneWay('columns');

  public readonly columns = computed(
    // @ts-expect-error
    (columnsConfiguration) => (columnsConfiguration ?? []).map(normalizeColumn),
    [this.columnsConfiguration],
  );

  static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {}

  public createDataRow(dataObject: unknown, columns: Column[]): DataRow {
    return {
      cells: columns.map((c) => ({
        column: c,
        value: c.calculateCellValue(dataObject),
      })),
    };
  }
}
