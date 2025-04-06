/* eslint-disable spellcheck/spell-checker */
import type { Subscribable, SubsGets, SubsGetsUpd } from '@ts/core/reactive/index';
import {
  computed, interruptableComputed,
} from '@ts/core/reactive/index';
import { getPathParts } from '@ts/core/utils/m_data';

import { OptionsController } from '../options_controller/options_controller';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column, VisibleColumn } from './types';
import {
  getColumnIndexByName, normalizeColumns, normalizeVisibleIndexes, preNormalizeColumns,
} from './utils';

export class ColumnsController {
  private readonly columnsConfiguration: Subscribable<ColumnProperties[] | undefined>;

  private readonly columnsSettings: SubsGetsUpd<PreNormalizedColumn[]>;

  public readonly columns: SubsGets<Column[]>;

  public readonly visibleColumns: SubsGets<Column[]>;

  public readonly nonVisibleColumns: SubsGets<Column[]>;

  public readonly allowColumnReordering: Subscribable<boolean>;

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    this.columnsConfiguration = this.options.oneWay('columns');

    this.columnsSettings = interruptableComputed(
      (columnsConfiguration) => preNormalizeColumns(columnsConfiguration ?? []),
      [
        this.columnsConfiguration,
      ],
    );

    this.columns = computed(
      (columnsSettings) => normalizeColumns(
        columnsSettings ?? [],
        this.options.normalizeTemplate.bind(this.options),
      ),
      [
        this.columnsSettings,
      ],
    );

    this.visibleColumns = computed(
      (columns) => columns
        .filter((column): column is VisibleColumn => column.visible)
        .sort((a, b) => a.visibleIndex - b.visibleIndex),
      [this.columns],
    );

    this.nonVisibleColumns = computed(
      (columns) => columns.filter((column) => !column.visible),
      [this.columns],
    );

    this.allowColumnReordering = this.options.oneWay('allowColumnReordering');

    this.options.addSpecialCaseHanler((e) => {
      const pathParts = getPathParts(e.fullName);

      switch (true) {
        case pathParts[0] !== 'columns':
        case pathParts.length === 1:
          return 'not_processed';
        case pathParts.length === 2: {
          const index = +pathParts[1];
          const column = this.columns.unreactive_get()[index];
          Object.entries(e.value).forEach(([key, value]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.columnOption(column, key as any, value);
          });
          return 'processed';
        }
        default: {
          const index = +pathParts[1];
          const propName = pathParts[2];
          const column = this.columns.unreactive_get()[index];
          this.columnOption(column, propName, e.value);
          return 'processed';
        }
      }
    });
  }

  public addColumn(columnProps: ColumnProperties): void {
    this.columnsSettings.updateFunc((columns) => preNormalizeColumns([
      ...columns,
      columnProps,
    ]));
  }

  public deleteColumn(column: Column): void {
    this.columnsSettings.updateFunc(
      (columns) => columns.filter((c) => c.name !== column.name),
    );
  }

  public columnOption<TProp extends keyof ColumnSettings>(
    column: Column,
    option: TProp,
    value: ColumnSettings[TProp],
  ): void {
    this.columnsSettings.updateFunc((columns) => {
      const index = getColumnIndexByName(columns, column.name);

      if (columns[index][option] === value) {
        return columns;
      }

      let newColumns = [...columns];

      newColumns[index] = {
        ...newColumns[index],
        [option]: value,
      };

      newColumns = this.normalizeColumnsVisibleIndexes(newColumns, index);

      return newColumns;
    });
  }

  public updateColumns(func: (columns: PreNormalizedColumn[]) => PreNormalizedColumn[]): void {
    this.columnsSettings.updateFunc((columns) => {
      let newColumns = func(columns);

      newColumns = this.normalizeColumnsVisibleIndexes(newColumns);

      return newColumns;
    });
  }

  private normalizeColumnsVisibleIndexes(
    columns: PreNormalizedColumn[],
    forceIndex?: number,
  ): PreNormalizedColumn[] {
    const result = [...columns];

    const visibleIndexes = normalizeVisibleIndexes(columns.map((c) => c.visibleIndex), forceIndex);

    visibleIndexes.forEach((visibleIndex, i) => {
      if (columns[i].visibleIndex !== visibleIndex) {
        result[i].visibleIndex = visibleIndex;
      }
    });

    return result;
  }
}
