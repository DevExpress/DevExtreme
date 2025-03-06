/* eslint-disable spellcheck/spell-checker */

import type { SortDescriptor } from '@js/data';
import type {
  SubsGets,
  SubsGetsUpd,
} from '@ts/core/reactive/index';
import {
  computed, effect, interruptableComputed,
} from '@ts/core/reactive/index';

import { ColumnsController } from '../columns_controller';
import type { Column } from '../columns_controller/types';
import { getColumnIndexByName } from '../columns_controller/utils';
import { OptionsController } from '../options_controller/options_controller';
import type { SortOptions } from './types';
import { getNextSortOrder, sortOrderDelegate } from './utils';

export class SortingController {
  public readonly ascendingText = this.options.oneWay('sorting.ascendingText');
  public readonly clearText = this.options.oneWay('sorting.clearText');
  public readonly descendingText = this.options.oneWay('sorting.descendingText');
  public readonly mode = this.options.oneWay('sorting.mode');
  private readonly _showSortIndexes = this.options.oneWay('sorting.showSortIndexes');

  public readonly sortedColumns: SubsGets<Column[]>;
  public readonly orderedSortedColumns: SubsGetsUpd<Column[]>;

  public readonly showSortIndexes: SubsGets<boolean>;

  // eslint-disable-next-line max-len
  public readonly sortParameters: SubsGets<SortDescriptor<unknown> | SortDescriptor<unknown>[] | undefined>;

  public static dependencies = [OptionsController, ColumnsController] as const;

  private areColumnsInitialized = false;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
  ) {
    this.sortedColumns = computed(
      (columns) => columns.filter((column) => column.sortOrder),
      [this.columnsController.visibleColumns],
    );

    this.orderedSortedColumns = interruptableComputed(
      (columns, mode) => {
        if (mode !== 'multiple') {
          return columns;
        }
        return columns.sort(sortOrderDelegate);
      },
      [this.sortedColumns, this.mode],
    );

    this.sortParameters = computed(
      (columns) => {
        const result: SortOptions[] = [];
        columns.forEach((c) => {
          const sortItem = {
            selector: c.dataField,
            desc: c.sortOrder === 'desc',
          } as SortOptions;
          if (c.sortingMethod) {
            sortItem.compare = c.sortingMethod.bind(c);
          }
          result.push(sortItem);
        });

        return result;
      },
      [this.orderedSortedColumns],
    );

    this.showSortIndexes = computed(
      (_showSortIndexes, sortedColumns) => {
        if (!_showSortIndexes) {
          return _showSortIndexes;
        }
        return sortedColumns.length > 1;
      },
      [this._showSortIndexes, this.sortedColumns],
    );

    effect(
      (params) => {
        this.options.sortParameters.update(params);
      },
      [this.sortParameters],
    );
  }

  public clearSorting(): void {
    this.columnsController.updateColumns(
      (columns) => columns.map((c) => {
        delete c.sortOrder;
        delete c.sortIndex;
        return c;
      }),
    );
  }

  public onSingleModeSortClick(column: Column, e: MouseEvent): void {
    if (!column.allowSorting) {
      return;
    }

    const isClearSorting = !!column.sortOrder && e.ctrlKey;
    if (isClearSorting) {
      this.clearSorting();
      return;
    }

    const isClearSortingRequired = (!column.sortOrder && !e.ctrlKey)
    || this.sortedColumns.unreactive_get().length > 1;
    if (isClearSortingRequired) {
      this.clearSorting();
    }

    const nextSortOrder = getNextSortOrder(column.sortOrder, e.ctrlKey);
    this.columnsController.columnOption(column, 'sortOrder', nextSortOrder);
  }

  public onMultipleModeSortClick(column: Column, e: MouseEvent): void {
    if (!column.allowSorting) {
      return;
    }

    const hasNothingToChange = !column.sortOrder && e.ctrlKey && !e.shiftKey;
    if (hasNothingToChange) {
      return;
    }

    const nextSortOrder = getNextSortOrder(column.sortOrder, e.ctrlKey);
    const isClearSortingRequired = !e.ctrlKey && !e.shiftKey;
    if (isClearSortingRequired) {
      this.clearSorting();
    }

    // this.columnsController.columnOption(column, 'sortOrder', nextSortOrder);
    this.updateColumnSortOrder(column, nextSortOrder);
  }

  private updateColumnSortOrder(column, nextSortOrder): void {
    const needChanges = !this.areColumnsInitialized || this.mode.unreactive_get() === 'multiple';
    if (!needChanges) {
      return;
    }
    this.areColumnsInitialized = true;

    this.columnsController.updateColumns((columns) => {
      const newColumns = [...columns];

      let needNormalizing = false;
      const orderedSortedColumns = this.orderedSortedColumns.unreactive_get();
      const orderedIndex = getColumnIndexByName(orderedSortedColumns, column.name);
      const commonIndex = getColumnIndexByName(newColumns, column.name);

      newColumns[commonIndex].sortOrder = nextSortOrder;
      if (!!nextSortOrder && orderedIndex === -1) {
        orderedSortedColumns.push(newColumns[commonIndex] as Column);
        needNormalizing = true;
      }
      if (!nextSortOrder && orderedIndex > -1) {
        delete newColumns[commonIndex].sortOrder;
        delete newColumns[commonIndex].sortIndex;
        orderedSortedColumns.splice(orderedIndex, 1);
        needNormalizing = true;
      }

      if (needNormalizing) {
        let counter = 1;
        orderedSortedColumns.forEach((c) => {
          const index = getColumnIndexByName(newColumns, c.name);
          if (newColumns[index].sortIndex !== counter) {
            newColumns[index] = {
              ...newColumns[index],
              sortIndex: counter,
            };
          }
          counter += 1;
        });
      }

      return newColumns;
    });
  }
}
