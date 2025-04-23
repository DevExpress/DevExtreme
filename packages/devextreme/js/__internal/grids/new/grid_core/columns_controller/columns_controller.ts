import type { DataType, Format } from '@js/common';
import type { ReadonlySignal, Signal } from '@preact/signals-core';
import { computed, effect, signal } from '@preact/signals-core';
import type { HeaderFilterRootOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import { mergeColumnHeaderFilterOptions } from '@ts/grids/new/grid_core/filtering/header_filter/utils';

import { OptionsController } from '../options_controller/options_controller';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column, VisibleColumn } from './types';
import {
  generateColumns,
  getColumnFormat, getColumnIndexByName,
  getValueDataType, normalizeColumns, normalizeVisibleIndexes, preNormalizeColumns,
} from './utils';

export class ColumnsController {
  private readonly columnsConfiguration: ReadonlySignal<ColumnProperties[] | undefined>;

  private readonly headerFilterConfiguration: ReadonlySignal<HeaderFilterRootOptions | undefined>;

  private readonly columnsSettings: Signal<PreNormalizedColumn[]>;

  public readonly columns: ReadonlySignal<Column[]>;

  public readonly visibleColumns: ReadonlySignal<VisibleColumn[]>;

  public readonly nonVisibleColumns: ReadonlySignal<Column[]>;

  public readonly allowColumnReordering: ReadonlySignal<boolean>;

  public readonly firstItems = signal<Record<string, unknown> | null>(null);

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    this.columnsConfiguration = this.options.oneWay('columns');
    this.headerFilterConfiguration = this.options.oneWay('headerFilter');

    const firstItemsDataTypes = computed(
      () => {
        const firstItems = this.firstItems.value;

        if (!firstItems) return null;

        const types: Record<string, { dataType: DataType; format: Format | undefined }> = {};

        for (const [field, value] of Object.entries(firstItems)) {
          const dataType = getValueDataType(value);
          const format = getColumnFormat({ dataType });
          types[field] = { dataType, format };
        }

        return types;
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.columnsSettings = signal(undefined as any);
    effect(() => {
      const columnsConfiguration = this.columnsConfiguration.value;
      const firstItems = this.firstItems.value;
      this.columnsSettings.value = preNormalizeColumns(
        columnsConfiguration
        ?? generateColumns(firstItems as never),
      );
    });

    this.columns = computed(() => {
      const columnsSettings = this.columnsSettings.value;
      const headerFilterRootOptions = this.headerFilterConfiguration.value;
      const firstItemDataTypes = firstItemsDataTypes.value;

      return normalizeColumns(
        columnsSettings ?? [],
        (template) => (template ? this.options.normalizeTemplate(template) : undefined),
        firstItemDataTypes,
      ).map(
        (column) => mergeColumnHeaderFilterOptions(column, headerFilterRootOptions),
      );
    });

    this.visibleColumns = computed(
      () => this.columns.value
        .filter((column) => column.visible)
        .sort((a, b) => a.visibleIndex - b.visibleIndex)
        .map((column, index) => ({ ...column, headerPanelIndex: index } as VisibleColumn)),
    );

    this.nonVisibleColumns = computed(
      () => this.columns.value
        .filter((column) => !column.visible),
    );

    this.allowColumnReordering = this.options.oneWay('allowColumnReordering');
  }

  public addColumn(columnProps: ColumnProperties): void {
    this.columnsSettings.value = preNormalizeColumns([
      ...this.columnsSettings.peek(),
      columnProps,
    ]);
  }

  public deleteColumn(column: Column): void {
    this.columnsSettings.value = this.columnsSettings.peek()
      .filter((c) => c.name !== column.name);
  }

  public columnOption<TProp extends keyof ColumnSettings>(
    column: Column,
    option: TProp,
    value: ColumnSettings[TProp],
  ): void {
    const columns = this.columnsSettings.peek();
    const index = getColumnIndexByName(columns, column.name);

    if (columns[index][option] === value) {
      this.columnsSettings.value = columns;
      return;
    }

    let newColumns = [...columns];

    newColumns[index] = {
      ...newColumns[index],
      [option]: value,
    };

    newColumns = this.normalizeColumnsVisibleIndexes(newColumns, index);

    this.columnsSettings.value = newColumns;
  }

  public updateColumns(func: (columns: PreNormalizedColumn[]) => PreNormalizedColumn[]): void {
    let newColumnSettings = func(this.columnsSettings.peek());
    newColumnSettings = this.normalizeColumnsVisibleIndexes(newColumnSettings);
    this.columnsSettings.value = newColumnSettings;
  }

  private normalizeColumnsVisibleIndexes(
    columns: PreNormalizedColumn[],
    forceIndex?: number,
  ): PreNormalizedColumn[] {
    const result = [...columns];

    const visibleIndexes = normalizeVisibleIndexes(
      columns.map((c) => c.visibleIndex),
      forceIndex,
    );

    visibleIndexes.forEach((visibleIndex, i) => {
      result[i].visibleIndex = visibleIndex;
    });

    return result;
  }

  public setFirstItems(item: Record<string, unknown> | null): void {
    if (this.firstItems.value) { return; }
    this.firstItems.value = item;
  }

  public getFirstItems(): Record<string, unknown> | null {
    return this.firstItems.peek();
  }
}
