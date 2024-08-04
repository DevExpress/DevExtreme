/* eslint-disable spellcheck/spell-checker */
import { computed, iif } from '@ts/core/reactive';

import { DataController } from '../data_controller/data_controller';
import { OptionsController } from '../options_controller/options_controller';
import type { Column, DataRow } from './types';
import { normalizeColumn } from './utils';

export class ColumnsController {
  private readonly columnsConfiguration = this.options.oneWay('columns');

  private readonly columnsFromDataSource = computed(
    (items: unknown[]) => {
      if (!items.length) {
        return [];
      }

      return Object.keys(items[0] as any);
    },
    [this.dataController.items],
  );

  public readonly columns = computed(
    (columnsConfiguration) => (columnsConfiguration ?? []).map(normalizeColumn),
    [
      iif(
        computed((columnsConfiguration) => !!columnsConfiguration, [this.columnsConfiguration]),
        this.columnsConfiguration,
        this.columnsFromDataSource,
      ),
    ],
  );

  static dependencies = [OptionsController, DataController] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
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
