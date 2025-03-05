/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable spellcheck/spell-checker */
import formatHelper from '@js/format_helper';
import type { Subscribable, SubsGets, SubsGetsUpd } from '@ts/core/reactive/index';
import {
  computed, iif, interruptableComputed,
} from '@ts/core/reactive/index';

import { DataController } from '../data_controller/index';
import type { DataObject } from '../data_controller/types';
import { OptionsController } from '../options_controller/options_controller';
import type { ColumnProperties, ColumnSettings, PreNormalizedColumn } from './options';
import type { Column, DataRow, VisibleColumn } from './types';
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

  private readonly dateSerializationFormat: Subscribable<string | undefined>;

  public static dependencies = [OptionsController, DataController] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
  ) {
    this.columnsConfiguration = this.options.oneWay('columns');

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

    this.columnsSettings = interruptableComputed(
      (columnsConfiguration) => preNormalizeColumns(columnsConfiguration ?? []),
      [
        iif(
          computed((columnsConfiguration) => !!columnsConfiguration, [this.columnsConfiguration]),
          this.columnsConfiguration,
          columnsFromDataSource,
        ),
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
    this.dateSerializationFormat = this.options.oneWay('dateSerializationFormat');
  }

  public createDataRow(data: DataObject, columns: Column[]): DataRow {
    return {
      cells: columns.map((c) => {
        const displayValue = c.calculateDisplayValue(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let text = formatHelper.format(displayValue as any, c.format);

        if (c.customizeText) {
          text = c.customizeText({
            value: displayValue,
            valueText: text,
          });
        }

        return {
          column: c,
          value: c.calculateCellValue(data),
          displayValue,
          text,
        };
      }),
      key: this.dataController.getDataKey(data),
      data,
    };
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

  // eslint-disable-next-line max-len
  public updateColumns(updateFunc: (oldValue: PreNormalizedColumn[]) => PreNormalizedColumn[]): void {
    this.columnsSettings.updateFunc(updateFunc);
  }

  public columnOption<TProp extends keyof ColumnSettings>(
    column: Column,
    option: TProp,
    value: ColumnSettings[TProp],
  ): void {
    this.columnsSettings.updateFunc((columns) => {
      const index = getColumnIndexByName(columns, column.name);
      const newColumns = [...columns];

      if (columns[index][option] === value) {
        return columns;
      }

      newColumns[index] = {
        ...newColumns[index],
        [option]: value,
      };

      const visibleIndexes = normalizeVisibleIndexes(
        newColumns.map((c) => c.visibleIndex),
        index,
      );

      visibleIndexes.forEach((visibleIndex, i) => {
        if (newColumns[i].visibleIndex !== visibleIndex) {
          newColumns[i] = {
            ...newColumns[i],
            visibleIndex,
          };
        }
      });

      return newColumns;
    });
  }
}
