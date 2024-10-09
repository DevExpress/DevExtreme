/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable spellcheck/spell-checker */
import type { SubsGets, SubsGetsUpd } from '@ts/core/reactive/index';
import { computed, iif, interruptableComputed } from '@ts/core/reactive/index';

import { DataController } from '../data_controller/index';
import { OptionsController } from '../options_controller/options_controller';
import type { Column, DataRow } from './types';
import { normalizeColumn } from './utils';

export class ColumnsController {
  public readonly columns: SubsGetsUpd<Column[]>;

  public readonly visibleColumns: SubsGets<Column[]>;

  public readonly nonVisibleColumns: SubsGets<Column[]>;

  public static dependencies = [OptionsController, DataController] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
  ) {
    const columnsConfiguration = this.options.oneWay('columns');

    const columnsFromDataSource = computed(
      (items: unknown[]) => {
        if (!items.length) {
          return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.keys(items[0] as any);
      },
      [this.dataController.items],
    );

    this.columns = interruptableComputed(
      (columnsConfiguration) => (columnsConfiguration ?? []).map(normalizeColumn),
      [
        iif(
          computed((columnsConfiguration) => !!columnsConfiguration, [columnsConfiguration]),
          columnsConfiguration,
          columnsFromDataSource,
        ),
      ],
    );

    this.visibleColumns = computed(
      (columns) => columns.filter((column) => column.visible),
      [this.columns],
    );

    this.nonVisibleColumns = computed(
      (columns) => columns.filter((column) => !column.visible),
      [this.columns],
    );
  }

  public createDataRow(data: unknown, columns: Column[]): DataRow {
    return {
      cells: columns.map((c) => ({
        column: c,
        value: c.calculateCellValue(data),
      })),
      key: this.dataController.getDataKey(data),
    };
  }
}
