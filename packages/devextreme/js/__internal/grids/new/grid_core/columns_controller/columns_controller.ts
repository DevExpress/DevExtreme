/* eslint-disable spellcheck/spell-checker */
import type { Subscribable, SubsGets, SubsGetsUpd } from '@ts/core/reactive/index';
import {
  computed, interruptableComputed,
} from '@ts/core/reactive/index';
import type { HeaderFilterRootOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import headerFilterUtils from '@ts/grids/new/grid_core/filtering/header_filter/utils';

import { OptionsController } from '../options_controller/options_controller';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column } from './types';
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

  private readonly dateSerializationFormat: Subscribable<string | undefined>;

  public static dependencies = [OptionsController] as const;

  public columnsInitialized = false;

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
        .filter((column) => column.visible)
        .sort((a, b) => a.visibleIndex - b.visibleIndex),
      [this.columns],
    );

    this.nonVisibleColumns = computed(
      (columns) => columns.filter((column) => !column.visible),
      [this.columns],
    );

    // @ts-expect-error
    this.columnsInitialized = !!this.columns.value.length;

    this.allowColumnReordering = this.options.oneWay('allowColumnReordering');
    this.dateSerializationFormat = this.options.oneWay('dateSerializationFormat');
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

  public inferColumnsFromFirstItem(firstItem: Record<string, unknown>): void {
    if (this.columnsInitialized
      // @ts-expect-error
      || (this.columns.value?.length ?? 0) > 0
      || !firstItem) return;

    const generatedColumns: PreNormalizedColumn[] = Object.keys(firstItem).map((key, index) => ({
      name: key,
      dataField: key,
      visible: true,
      visibleIndex: index,
    }));

    this.columnsSettings.update(generatedColumns);
    this.columnsInitialized = true;
  }
}
