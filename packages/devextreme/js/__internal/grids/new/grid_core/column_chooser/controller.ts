/* eslint-disable spellcheck/spell-checker */
import { equalByValue } from '@js/core/utils/common';
import type dxTreeView from '@js/ui/tree_view';
import type { Item as TreeViewItemProperties, SelectionChangedEvent } from '@js/ui/tree_view';
import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { sortColumns } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import { createRef } from 'inferno';

import { ColumnsController } from '../columns_controller/columns_controller';
import type { Column } from '../columns_controller/types';
import { getColumnIndexByName } from '../columns_controller/utils';
import { OptionsController } from '../options_controller/options_controller';

export class ColumnChooserController {
  public static dependencies = [ColumnsController, OptionsController] as const;

  public readonly items: SubsGets<TreeViewItemProperties[]>;

  public readonly treeViewRef = createRef<dxTreeView>();

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
  ) {
    this.items = computed(
      (columns, sortOrder) => {
        let chooserColumns = columns.filter((c) => c.showInColumnChooser);
        chooserColumns = sortColumns(chooserColumns, sortOrder) as Column[];

        const newItems = chooserColumns.map((c, index) => ({
          id: index,
          columnName: c.name,
          selected: c.visible,
          text: c.caption,
          disabled: !c.allowHiding,
        }) as TreeViewItemProperties);

        const items = this.items?.unreactive_get();

        if (items?.length === chooserColumns.length) {
          for (let i = 0; i < chooserColumns.length; i += 1) {
            items[i].selected = chooserColumns[i].visible;
          }

          // if only column visibility changed, then we don't
          // create new items, but just update selection
          if (equalByValue(items, newItems)) {
            this.updateSelection();
            return items;
          }
        }

        return newItems;
      },
      [
        this.columnsController.columns,
        this.options.oneWay('columnChooser.sortOrder'),
      ],
    );
  }

  public onSelectionChanged(e: SelectionChangedEvent): void {
    const nodes = e.component.getNodes();

    this.columnsController.updateColumns((columns) => {
      for (const node of nodes) {
        const columnIndex = getColumnIndexByName(columns, node.itemData?.columnName);
        const canHide = columns[columnIndex].allowHiding ?? true;
        // to handle case when allowHiding=false and node.selected=false
        const skip = !canHide && !node.selected;

        if (!skip) {
          columns[columnIndex].visible = node.selected;
        }
      }

      return [...columns];
    });
  }

  private updateSelection(): void {
    const treeView = this.treeViewRef.current;

    if (!treeView) {
      return;
    }

    const columns = this.columnsController.columns.unreactive_get();
    const selectedKeys = treeView.getSelectedNodeKeys();

    treeView.beginUpdate();

    columns.forEach((column, index) => {
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
