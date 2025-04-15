/* eslint-disable spellcheck/spell-checker */
import type { Subscribable, SubsGets, SubsGetsUpd } from '@ts/core/reactive/index';
import {
  computed, interruptableComputed, state,
} from '@ts/core/reactive/index';
import type { HeaderFilterRootOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import headerFilterUtils from '@ts/grids/new/grid_core/filtering/header_filter/utils';

import { OptionsController } from '../options_controller/options_controller';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column, VisibleColumn } from './types';
import {
  getColumnFormat, getColumnIndexByName, getSerializationFormat,
  getValueDataType, normalizeColumns, normalizeVisibleIndexes, preNormalizeColumns,
} from './utils';

export class ColumnsController {
  private readonly columnsConfiguration: Subscribable<ColumnProperties[] | undefined>;

  private readonly headerFilterConfiguration: Subscribable<HeaderFilterRootOptions | undefined>;

  private readonly columnsSettings: SubsGetsUpd<PreNormalizedColumn[]>;

  public readonly columns: SubsGets<Column[]>;

  public readonly visibleColumns: SubsGets<Column[]>;

  public readonly nonVisibleColumns: SubsGets<Column[]>;

  public readonly allowColumnReordering: Subscribable<boolean>;

  public readonly firstItem = state<Record<string, unknown> | null>(null);

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

  public setFirstItem(item: Record<string, unknown> | null): void {
    if (this.firstItem.unreactive_get()) return;
    this.firstItem.update(item);
    this.updateColumnDataType();
  }

  public getFirstItem(): Record<string, unknown> | null {
    return this.firstItem.unreactive_get();
  }

  private updateColumnDataType(): void {
    const columns = this.columns.unreactive_get();
    const columnSettings = this.columnsSettings.unreactive_get();
    const firstItem = this.getFirstItem();

    columns.forEach((column, index) => {
      if (firstItem && column.calculateCellValue) {
        const columnSetting = columnSettings[index];
        const value = column.calculateCellValue(firstItem);
        const dataType = columnSetting.dataType ?? getValueDataType(value);
        const serializationFormat = getSerializationFormat(dataType, value);
        // @ts-expect-error
        const columnFormat = getColumnFormat(column);

        if (dataType && dataType !== column.dataType) {
          this.columnOption(column, 'dataType', dataType);
        }

        if (columnFormat && columnFormat !== column.format) {
          this.columnOption(column, 'format', dataType);
        }

        // @ts-expect-error
        // eslint-disable-next-line @stylistic/max-len
        if (serializationFormat !== undefined && serializationFormat !== column.serializationFormat) {
        // @ts-expect-error
          this.columnOption(column, 'serializationFormat', serializationFormat);
        }
      }
    });
  }
}
