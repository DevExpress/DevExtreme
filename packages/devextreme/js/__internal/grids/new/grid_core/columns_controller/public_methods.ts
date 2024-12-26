/* eslint-disable max-classes-per-file */
/* eslint-disable consistent-return */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { isObject } from '@js/core/utils/type';

import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';
import type { ColumnProperties, ColumnSettings } from './options';
import type { Column } from './types';
import { getColumnByIndexOrName } from './utils';

export function PublicMethods<TBase extends Constructor<GridCoreNewBase>>(GridCore: TBase) {
  return class GridCoreWithColumnsController extends GridCore {
    public getVisibleColumns(): Column[] {
      return this.columnsController.visibleColumns.unreactive_get();
    }

    public addColumn(column: ColumnProperties): void {
      this.columnsController.addColumn(column);
    }

    public getVisibleColumnIndex(columnNameOrIndex: string | number): number {
      const column = getColumnByIndexOrName(
        this.columnsController.columns.unreactive_get(),
        columnNameOrIndex,
      );

      return this.columnsController.visibleColumns.unreactive_get()
        .findIndex(
          (c) => c.name === column?.name,
        );
    }

    public deleteColumn(columnNameOrIndex: string | number): void {
      const column = getColumnByIndexOrName(
        this.columnsController.columns.unreactive_get(),
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
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ): Column | Column[T] | void {
      const column = getColumnByIndexOrName(
        this.columnsController.columns.unreactive_get(),
        columnNameOrIndex,
      );

      if (!column) {
        return;
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
    }
  };
}
