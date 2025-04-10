/* eslint-disable spellcheck/spell-checker */
import type { Subscribable, SubsGets, SubsGetsUpd } from '@ts/core/reactive/index';
import {
  computed, interruptableComputed,
} from '@ts/core/reactive/index';
import type { HeaderFilterRootOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import headerFilterUtils from '@ts/grids/new/grid_core/filtering/header_filter/utils';

import { OptionsController } from '../options_controller/options_controller';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column, VisibleColumn } from './types';
import {
  getColumnIndexByName, normalizeColumns, normalizeVisibleIndexes, preNormalizeColumns,
} from './utils';

export class ColumnsController {
  private readonly columnsConfiguration: Subscribable<ColumnProperties[] | undefined>;

  private readonly headerFilterConfiguration: Subscribable<HeaderFilterRootOptions | undefined>;

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
    this.headerFilterConfiguration = this.options.oneWay('headerFilter');

    this.columnsSettings = interruptableComputed(
      (columnsConfiguration) => preNormalizeColumns(columnsConfiguration ?? []),
      [
        this.columnsConfiguration,
      ],
    );

    this.columns = computed(
      (
        columnsSettings,
        headerFilterRootOptions,
      ) => normalizeColumns(
        columnsSettings ?? [],
        this.options.normalizeTemplate.bind(this.options),
      ).map((column) => headerFilterUtils
        .mergeColumnHeaderFilterOptions(column, headerFilterRootOptions)),
      [
        this.columnsSettings,
        this.headerFilterConfiguration,
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

  private updateColumnProps(column: Column, updatedProps: Partial<PreNormalizedColumn>): void {
    this.columnsSettings.updateFunc((columns) => {
      const index = getColumnIndexByName(columns, column.name);
      if (index === -1) return columns;

      const existing = columns[index];

      const isChanged = Object.entries(updatedProps).some(
        ([key, value]) => existing[key] !== value,
      );

      if (!isChanged) {
        return columns;
      }

      const updated = {
        ...existing,
        ...updatedProps,
      };

      let newColumns = [...columns];
      newColumns[index] = updated;
      newColumns = this.normalizeColumnsVisibleIndexes(newColumns, index);
      return newColumns;
    });
  }

  public updateColumnDataType(column: Column, value: unknown): unknown {
    let newColumn = column;
    let newValue = value;

    if (column.dataType === 'date') {
      if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        newValue = new Date(value);
      } else if (!(value instanceof Date)) {
        // @ts-expect-error
        newValue = new Date(value);
      }
    } else if (typeof value === 'number') {
      newColumn = { ...column, dataType: 'number' };
      newValue = Number(value);
      this.updateColumnProps(column, { dataType: 'number' });
    } else if (typeof value === 'string') {
      if (!isNaN(Number(value))) {
        newColumn = { ...column, dataType: 'number' };
        this.updateColumnProps(column, { dataType: 'number' });
      } else {
        const parsed = Date.parse(value);
        if (!isNaN(parsed)) {
          const hasTime = /[T\s]\d{2}:\d{2}/.test(value);
          const dataType = hasTime ? 'datetime' : 'date';
          newColumn = { ...column, dataType };
          newValue = new Date(parsed);
          this.updateColumnProps(column, { dataType });
        }
      }
    }

    return { column: newColumn, value: newValue };
  }
}
