import $ from '@js/core/renderer';
import type * as SortableTypes from '@js/ui/sortable_types';
import type { Item as TreeViewItemProperties, SelectionChangedEvent } from '@js/ui/tree_view';
import { computed, type ReadonlySignal, signal } from '@ts/core/reactive/index';
import { sortColumns } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';

import type { DraggingColumnData } from '../../card_view/header_panel/column_sortable';
import { ColumnsController } from '../columns_controller/columns_controller';
import type { Column } from '../columns_controller/types';
import { getColumnIndexByName } from '../columns_controller/utils';
import { OptionsController } from '../options_controller/options_controller';

const CLASS = {
  hidden: 'dx-hidden',
};

export class ColumnChooserController {
  public static dependencies = [ColumnsController, OptionsController] as const;

  public readonly chooserColumns: ReadonlySignal<Column[]>;

  public readonly items: ReadonlySignal<TreeViewItemProperties[]>;

  public readonly draggingItem = signal<DraggingColumnData | null>(null);

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
  ) {
    this.chooserColumns = computed(
      () => {
        const sortOrder = this.options.oneWay('columnChooser.sortOrder').value;
        const mode = this.options.oneWay('columnChooser.mode').value;
        let chooserColumns = this.columnsController.columns.value;

        if (mode === 'dragAndDrop') {
          chooserColumns = chooserColumns.filter((column) => !column.visible);
        }

        chooserColumns = chooserColumns.filter((column: Column) => column.showInColumnChooser);
        chooserColumns = sortColumns(chooserColumns, sortOrder) as Column[];

        return chooserColumns;
      },
    );

    this.items = computed(
      () => this.chooserColumns.value.map((column, index) => ({
        id: index,
        columnName: column.name,
        selected: column.visible,
        text: column.caption,
        disabled: !column.allowHiding,
        column,
      }) as TreeViewItemProperties),
    );
  }

  public onSelectionChanged(e: SelectionChangedEvent): void {
    const nodes = e.component.getNodes();

    this.columnsController.updateColumns((columns) => {
      for (const node of nodes) {
        const columnIndex = getColumnIndexByName(columns, node.itemData?.columnName);
        const canHide = columns[columnIndex].allowHiding ?? true;
        // in case when allowHiding=false and node.selected=false, we do not hide column
        const skip = !canHide && !node.selected;

        if (!skip) {
          columns[columnIndex] = {
            ...columns[columnIndex],
            visible: node.selected,
          };
        }
      }

      return [...columns];
    });
  }

  public onColumnMove = (column: Column): void => {
    this.columnsController.columnOption(column, 'visible', false);
  };

  public onDragStart = (e: SortableTypes.DragStartEvent): void => {
    this.draggingItem.value = e.itemData as DraggingColumnData;
  };

  public onDragEnd = (): void => {
    this.draggingItem.value = null;
  };

  public isColumnDraggable = (column: Column): boolean => column.allowHiding;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onPlaceholderPrepared = (e): void => {
    const $placeholderElement = $(e.placeholderElement);

    $placeholderElement.addClass(CLASS.hidden);
  };
}
