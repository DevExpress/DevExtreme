import type { SortOrder } from '@js/common';
import type { ReadonlySignal } from '@ts/core/reactive/index';
import { batch, computed } from '@ts/core/reactive/index';

import { ColumnsController } from '../columns_controller/index';
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

  public readonly sortedColumns = computed(
    () => this.columnsController.visibleColumns.value
      .filter(
        (column) => column.sortOrder,
      ),
  );

  public readonly orderedSortedColumns: ReadonlySignal<Column[]> = computed(() => {
    const columns = this.sortedColumns.value;
    const mode = this.mode.value;
    const result = columns.sort(sortOrderDelegate);

    if (mode !== 'multiple' && this.areColumnsInitialized) {
      return result;
    }

    if (!this.areColumnsInitialized) {
      this.areColumnsInitialized = true;

      result.forEach((col, idx) => {
        this.columnsController.columnOption(col, 'sortIndex', idx);
      });
    }

    return result;
  });

  public readonly showSortIndexes = computed(() => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _showSortIndexes = this._showSortIndexes.value;
    const sortedColumns = this.sortedColumns.value;
    if (!_showSortIndexes) {
      return _showSortIndexes;
    }
    return sortedColumns.length > 1;
  });

  public readonly sortParameters = computed(() => {
    const columns = this.orderedSortedColumns.value;
    const result: SortOptions[] = [];
    columns.forEach((c) => {
      const sortItem = {
        selector: c.calculateSortValue ?? c.dataField ?? c.selector,
        desc: c.sortOrder === 'desc',
      } as SortOptions;
      if (c.sortingMethod) {
        sortItem.compare = c.sortingMethod.bind(c);
      }
      result.push(sortItem);
    });

    return result;
  });

  public static dependencies = [OptionsController, ColumnsController] as const;

  private areColumnsInitialized = false;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
  ) {
    // TODO: Resolve the nested update issue

    // const updateOrderedSortedColumns = (
    //   orderedSortedColumns: Column[],
    //   mode: SingleMultipleOrNone,
    // ): void => {
    //   const needChanges = !this.areColumnsInitialized || mode === 'multiple';
    //   if (!needChanges) {
    //     return;
    //   }

    //   this.areColumnsInitialized = true;
    //   let counter = 0;
    //   orderedSortedColumns.forEach((c) => {
    //     this.columnsController.columnOption(c, 'sortIndex', counter);
    //     counter += 1;
    //     return c;
    //   });
    // };

    // effect(
    //   updateOrderedSortedColumns,
    //   [this.orderedSortedColumns, this.mode],
    // );
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

  public onSingleModeSortClick(column: Column, e: KeyboardEvent | MouseEvent): void {
    if (!column.allowSorting) {
      return;
    }

    const isCtrl = e.ctrlKey || e.metaKey;
    const isClearSorting = !!column.sortOrder && isCtrl;

    if (isClearSorting) {
      this.clearSorting();
      return;
    }

    const isClearSortingRequired = (!column.sortOrder && !isCtrl)
      || this.sortedColumns.peek().length > 1;
    const nextSortOrder = getNextSortOrder(column.sortOrder, isCtrl);

    this.onSingleModeSortCore(column, isClearSortingRequired, nextSortOrder);
  }

  public onSingleModeSortCore(
    column: Column,
    isClearSortingRequired: boolean,
    nextSortOrder?: SortOrder,
  ): void {
    batch(() => {
      if (isClearSortingRequired) {
        this.clearSorting();
      }

      this.columnsController.columnOption(column, 'sortOrder', nextSortOrder);
    });
  }

  public onMultipleModeSortClick(column: Column, e: KeyboardEvent | MouseEvent): void {
    if (!column.allowSorting) {
      return;
    }

    const isCtrl = e.ctrlKey || e.metaKey;
    const hasNothingToChange = !column.sortOrder && isCtrl && !e.shiftKey;

    if (hasNothingToChange) {
      return;
    }

    const nextSortOrder = getNextSortOrder(column.sortOrder, isCtrl);
    const isClearSortingRequired = !isCtrl && !e.shiftKey;

    this.onMultipleModeSortCore(column, isClearSortingRequired, nextSortOrder);
  }

  public onMultipleModeSortCore(
    column: Column,
    isClearSortingRequired: boolean,
    nextSortOrder?: SortOrder,
  ): void {
    batch(() => {
      if (isClearSortingRequired) {
        this.clearSorting();
      }

      // TODO: Resolve the nested update issue
      // this.columnsController.columnOption(column, 'sortOrder', nextSortOrder);
      this.updateColumnSortOrder(column, nextSortOrder);
    });
  }

  private updateColumnSortOrder(column: Column, nextSortOrder?: SortOrder): void {
    const needChanges = this.mode.peek() === 'multiple';
    if (!needChanges) {
      return;
    }

    this.columnsController.updateColumns((columns) => {
      const newColumns = [...columns];

      let needNormalizing = false;
      const orderedSortedColumns = this.orderedSortedColumns.peek();
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
        let counter = 0;
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
