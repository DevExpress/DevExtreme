import $ from '@js/core/renderer';

import { ColumnChooserView } from '../../grid_core/column_chooser/index';
import { ColumnsController } from '../../grid_core/columns_controller/index';
import type { Column } from '../../grid_core/columns_controller/types';
import type { DraggingColumnData } from './column_sortable';

const CLASS = {
  hidden: 'dx-hidden',
};

export class HeaderPanelController {
  public static dependencies = [ColumnsController, ColumnChooserView] as const;

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly columnChooserView: ColumnChooserView,
  ) { }

  private canReorder(column: Column): boolean {
    const allowColumnReordering = this.columnsController.allowColumnReordering.peek();

    return allowColumnReordering && column.allowReordering;
  }

  public isColumnDraggable = (column: Column): boolean => {
    const canHide = column.allowHiding && this.columnChooserView.dragModeOpened.peek();
    const canReorder = this.canReorder(column);

    return canReorder || canHide;
  };

  public onColumnMove = (
    column: Column,
    toIndex: number,
    draggingColumnData: DraggingColumnData,
  ): void => {
    const { columnAfter } = draggingColumnData;
    const needPreserveOrder = !this.canReorder(column);

    if (needPreserveOrder) {
      this.columnsController.columnOption(column, 'visible', true);
      return;
    }

    if (columnAfter === undefined) {
      const columnsCount = this.columnsController.columns.peek().length;

      this.columnsController.columnOption(column, 'visible', true);
      this.columnsController.columnOption(column, 'visibleIndex', columnsCount - 1);

      return;
    }

    this.columnsController.updateColumns((columns) => {
      const newColumns = [...columns];

      newColumns.forEach((oldColumn, index) => {
        const updatedColumn = { ...oldColumn };

        if (oldColumn.name === column.name) {
          updatedColumn.visibleIndex = columnAfter.visibleIndex;
          updatedColumn.visible = true;
        } else if (oldColumn.visibleIndex >= columnAfter.visibleIndex) {
          updatedColumn.visibleIndex = oldColumn.visibleIndex + 1;
        }

        newColumns[index] = updatedColumn;
      });

      return newColumns;
    });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onPlaceholderPrepared = (e): void => {
    const $placeholderElement = $(e.placeholderElement);

    const { column } = e.itemData as DraggingColumnData;
    const canReorder = this.canReorder(column);

    $placeholderElement.toggleClass(CLASS.hidden, !canReorder);
  };
}
