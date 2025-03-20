import { equalByValue } from '@js/core/utils/common';
import type dxTreeView from '@js/ui/tree_view';
import type { Item as TreeViewItemProperties, SelectionChangedEvent } from '@js/ui/tree_view';
import type { SubsGets } from '@ts/core/reactive/index';
import { computed, state } from '@ts/core/reactive/index';
import { sortColumns } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import { createRef } from 'inferno';

import { ColumnsController } from '../columns_controller/columns_controller';
import type { Column } from '../columns_controller/types';
import { getColumnIndexByName } from '../columns_controller/utils';
import { OptionsController } from '../options_controller/options_controller';

export class ColumnChooserController {
  public static dependencies = [ColumnsController, OptionsController] as const;

  public readonly chooserColumns: SubsGets<Column[]>;

  public readonly items = state<TreeViewItemProperties[]>([]);

  public readonly treeViewRef = createRef<dxTreeView>();

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
  ) {
    this.chooserColumns = computed(
      (columns, sortOrder) => {
        let chooserColumns = columns.filter((c) => c.showInColumnChooser);
        chooserColumns = sortColumns(chooserColumns, sortOrder);

        return chooserColumns;
      },
      [
        this.columnsController.columns,
        this.options.oneWay('columnChooser.sortOrder'),
      ],
    );

    this.chooserColumns.subscribe((columns) => {
      let onlyVisibleChanged = false;

      this.items.updateFunc((oldItems) => {
        const newItems = columns.map((c, index) => ({
          id: index,
          columnName: c.name,
          selected: c.visible,
          text: c.caption,
          disabled: !c.allowHiding,
        }) as TreeViewItemProperties);

        if (oldItems.length === columns.length) {
          for (let i = 0; i < columns.length; i += 1) {
            oldItems[i].selected = columns[i].visible;
          }

          if (equalByValue(oldItems, newItems)) {
            onlyVisibleChanged = true;
            return oldItems;
          }
        }

        return newItems;
      });

      // if only column visibility changed, then we don't
      // create new items, but just update selection
      if (onlyVisibleChanged) {
        this.updateSelection(columns);
      }
    });
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
          columns[columnIndex].visible = node.selected;
        }
      }

      return [...columns];
    });
  }

  private updateSelection(chooserColumns: Column[]): void {
    const treeView = this.treeViewRef.current;

    if (!treeView) {
      return;
    }

    const selectedKeys = treeView.getSelectedNodeKeys();

    treeView.beginUpdate();

    chooserColumns.forEach((column, index) => {
      const isSelected = selectedKeys.includes(index);

      if (column.visible && !isSelected) {
        treeView.selectItem(index);
      }
      if (!column.visible && isSelected) {
        treeView.unselectItem(index);
      }
    });

    treeView.endUpdate();
  }
}
