import $ from '@js/core/renderer';

import { ColumnChooserView } from '../../grid_core/column_chooser';
import { ColumnsController } from '../../grid_core/columns_controller';
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

  public isColumnDraggable = (column: Column): boolean => {
    const canBeHidden = column.allowHiding && this.columnChooserView.dragModeOpened.value;

    return column.allowReordering || canBeHidden;
  };

  public onColumnMove = (
    column: Column,
    toIndex: number,
    draggingColumnData: DraggingColumnData,
  ): void => {
    const { columnAfter } = draggingColumnData;
    const needPreserveOrder = !column.allowReordering;

    if (needPreserveOrder) {
      this.columnsController.columnOption(column, 'visible', true);
      return;
    }

    if (columnAfter === undefined) {
      const columnsCount = this.columnsController.columns.peek().length;

      this.columnsController.columnOption(column, 'visible', true);
      this.columnsController.columnOption(column, 'visibleIndex', columnsCount);

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

    $placeholderElement.toggleClass(CLASS.hidden, !column.allowReordering);
  };
}
