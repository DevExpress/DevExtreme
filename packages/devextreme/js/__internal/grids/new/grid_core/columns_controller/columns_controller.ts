import type { ReadonlySignal, Signal } from '@preact/signals-core';
import { computed, effect, signal } from '@preact/signals-core';
import type { DataObject } from '@ts/grids/new/grid_core/data_controller/types';
import type { HeaderFilterRootOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import { mergeColumnHeaderFilterOptions } from '@ts/grids/new/grid_core/filtering/header_filter/utils';

import { OptionsController } from '../options_controller/options_controller';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column, ColumnsConfigurationFromData, VisibleColumn } from './types';
import {
  getColumnIndexByName,
  getColumnOptionsFromDataItem,
  normalizeColumns,
  normalizeVisibleIndexes,
  preNormalizeColumns,
} from './utils';

export class ColumnsController {
  private readonly columnsConfiguration: ReadonlySignal<ColumnProperties[] | undefined | null>;

  private readonly headerFilterConfiguration: ReadonlySignal<HeaderFilterRootOptions | undefined>;

  private readonly columnsSettings: Signal<PreNormalizedColumn[]>;

  private readonly columnsConfigurationFromData: Signal<ColumnsConfigurationFromData | null>;

  public readonly columns: ReadonlySignal<Column[]>;

  public readonly visibleColumns: ReadonlySignal<VisibleColumn[]>;

  public readonly nonVisibleColumns: ReadonlySignal<Column[]>;

  public readonly allowColumnReordering: ReadonlySignal<boolean>;

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    this.columnsConfiguration = this.options.oneWay('columns');
    this.headerFilterConfiguration = this.options.oneWay('headerFilter');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.columnsSettings = signal(undefined as any);
    this.columnsConfigurationFromData = signal<
      ColumnsConfigurationFromData | null
    >(null);

    effect(() => {
      const columnsConfigurationFromOptions = this.columnsConfiguration.value;
      const columnsConfigurationFromData = this.columnsConfigurationFromData.value?.dateFields;
      const columnsConfiguration = columnsConfigurationFromOptions
        ?? columnsConfigurationFromData
        ?? [];

      this.columnsSettings.value = preNormalizeColumns(columnsConfiguration);
    });

    this.columns = computed(() => {
      const columnsSettings = this.columnsSettings.value;
      const headerFilterRootOptions = this.headerFilterConfiguration.value;
      const columnsFromDataOptions = this.columnsConfigurationFromData.value?.columns;

      return normalizeColumns(
        columnsSettings ?? [],
        (template) => (
          template
            ? this.options.normalizeTemplate(template)
            : undefined
        ),
        columnsFromDataOptions,
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

  public setColumnOptionsFromDataItem(
    item: DataObject,
  ): void {
    if (this.columnsConfigurationFromData.value) {
      return;
    }

    this.columnsConfigurationFromData.value = getColumnOptionsFromDataItem(item);
  }

  public resetColumnOptionsFromDataItem(): void {
    this.columnsConfigurationFromData.value = null;
  }
}
