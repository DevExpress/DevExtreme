import { isObject } from '@js/core/utils/type';

import type { GridCoreClass, Mixin } from '../types';
import type { ColumnProperties, ColumnSettings } from './options';
import type { Column, ColumnsControllerPublicMethods } from './types';
import { getColumnByIndexOrName } from './utils';

export function PublicMethods<TBase extends GridCoreClass>(
  GridCore: TBase,
): Mixin<TBase, ColumnsControllerPublicMethods> {
  return class GridCoreWithColumnsController extends GridCore {
    public getVisibleColumns(): Column[] {
      return this.columnsController.visibleColumns.peek();
    }

    public addColumn(column: ColumnProperties): void {
      this.columnsController.addColumn(column);
    }

    public getVisibleColumnIndex(columnNameOrIndex: string | number): number {
      const column = getColumnByIndexOrName(
        this.columnsController.columns.peek(),
        columnNameOrIndex,
      );

      return this.columnsController.visibleColumns.peek()
        .findIndex(
          (c) => c.name === column?.name,
        );
    }

    public deleteColumn(columnNameOrIndex: string | number): void {
      const column = getColumnByIndexOrName(
        this.columnsController.columns.peek(),
        columnNameOrIndex,
      );

      if (!column) {
        return;
      }

      this.columnsController.deleteColumn(column);
    }

    public columnOption(
      columnNameOrIndex: string | number,
    ): Column;
    public columnOption(
      columnNameOrIndex: string | number,
      options: ColumnSettings,
    ): void;
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option: T,
      value: ColumnSettings[T]
    ): void;
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option: T,
      value: ColumnSettings[T]
    ): void;
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option: T
    ): Column[T];
    public columnOption<T extends keyof ColumnSettings>(
      columnNameOrIndex: string | number,
      option?: T | ColumnSettings,
      value?: ColumnSettings[T],
    ): Column | Column[T] | undefined {
      const column = getColumnByIndexOrName(
        this.columnsController.columns.peek(),
        columnNameOrIndex,
      );

      if (!column) {
        return undefined;
      }

      if (arguments.length === 1) {
        return column;
      }

      if (arguments.length === 2) {
        if (isObject(option)) {
          Object.entries(option).forEach(([optionName, optionValue]) => {
            this.columnsController.columnOption(
              column,
              optionName as keyof Column,
              optionValue,
            );
          });
        } else {
          return column[option as T];
        }
      }

      if (arguments.length === 3) {
        this.columnsController.columnOption(column, option as keyof Column, value);
      }

      return undefined;
    }
  };
}
