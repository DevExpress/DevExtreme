import type { ReadonlySignal, Signal } from '@ts/core/reactive/index';
import { computed, effect, signal } from '@ts/core/reactive/index';
import type { DataObject } from '@ts/grids/new/grid_core/data_controller/types';
import type { HeaderFilterRootOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import { isColumnFilterable, mergeColumnHeaderFilterOptions } from '@ts/grids/new/grid_core/filtering/header_filter/utils';
import type { OptionWithChanges } from '@ts/grids/new/grid_core/options_controller/types';

import { OptionsController } from '../options_controller/options_controller';
import { updateColumnSettings } from './columns_settings/index';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column, ColumnsConfigurationFromData, VisibleColumn } from './types';
import {
  columnOptionUpdate,
  getColumnIndexByName,
  getColumnOptionsFromDataItem,
  normalizeColumns,
  normalizeColumnsVisibleIndexes,
  preNormalizeColumns,
} from './utils';

export class ColumnsController {
  private readonly headerFilterConfiguration: ReadonlySignal<HeaderFilterRootOptions | undefined>;

  private readonly columnsSettings: Signal<PreNormalizedColumn[]>;

  private readonly columnsConfiguration: ReadonlySignal<
    OptionWithChanges<ColumnProperties[] | undefined | null>
  >;

  private readonly columnsConfigurationFromData: Signal<ColumnsConfigurationFromData | null>;

  public readonly columns: ReadonlySignal<Column[]>;

  public readonly filterableColumns: ReadonlySignal<Column[]>;

  public readonly visibleColumns: ReadonlySignal<VisibleColumn[]>;

  public readonly nonVisibleColumns: ReadonlySignal<Column[]>;

  public readonly allowColumnReordering: ReadonlySignal<boolean>;

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    this.columnsConfiguration = this.options.oneWayWithChanges('columns');
    this.headerFilterConfiguration = this.options.oneWay('headerFilter');

    this.columnsSettings = signal([]);
    this.columnsConfigurationFromData = signal<
      ColumnsConfigurationFromData | null
    >(null);

    effect(() => {
      const settings = this.columnsSettings.peek() ?? [];
      const { value: columnsConfigurationFromOptions, changes } = this.columnsConfiguration.value;

      const newSettings = updateColumnSettings(settings, changes);

      if (newSettings.length !== 0) {
        this.columnsSettings.value = newSettings;
        return;
      }

      const columnsConfigurationFromData = this.columnsConfigurationFromData.value?.dataFields;
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

    this.filterableColumns = computed(() => this.columns.value.filter(
      (col) => isColumnFilterable(col),
    ));

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
    { name }: Column,
    // TODO: Fix type -> option may be path with dots in runtime
    //  E.g: 'columnOption('A', 'headerFilter.search.enabled', true)
    option: TProp,
    value: ColumnSettings[TProp],
  ): void {
    const settings = this.columnsSettings.peek();
    const columnIdx = getColumnIndexByName(settings, name);

    this.columnsSettings.value = columnOptionUpdate(
      settings,
      columnIdx,
      option,
      value,
    );
  }

  public updateColumns(func: (columns: PreNormalizedColumn[]) => PreNormalizedColumn[]): void {
    let newColumnSettings = func(this.columnsSettings.peek());
    newColumnSettings = normalizeColumnsVisibleIndexes(newColumnSettings);
    this.columnsSettings.value = newColumnSettings;
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
