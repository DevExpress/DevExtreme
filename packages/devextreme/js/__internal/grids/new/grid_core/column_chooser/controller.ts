import type { Item as TreeViewItemProperties, SelectionChangedEvent } from '@js/ui/tree_view';
import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { sortColumns } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';

import { ColumnsController } from '../columns_controller/columns_controller';
import type { Column } from '../columns_controller/types';
import { getColumnIndexByName } from '../columns_controller/utils';
import { OptionsController } from '../options_controller/options_controller';

export class ColumnChooserController {
  public static dependencies = [ColumnsController, OptionsController] as const;

  public readonly chooserColumns: SubsGets<Column[]>;

  public readonly items: SubsGets<TreeViewItemProperties[]>;

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
  ) {
    this.chooserColumns = computed(
      (columns, sortOrder) => {
        let chooserColumns = columns.filter((column) => column.showInColumnChooser);
        chooserColumns = sortColumns(chooserColumns, sortOrder);

        return chooserColumns;
      },
      [
        this.columnsController.columns,
        this.options.oneWay('columnChooser.sortOrder'),
      ],
    );

    this.items = computed(
      (chooserColumns) => chooserColumns.map((column, index) => ({
        id: index,
        columnName: column.name,
        selected: column.visible,
        text: column.caption,
        disabled: !column.allowHiding,
      }) as TreeViewItemProperties),
      [this.chooserColumns],
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
          columns[columnIndex].visible = node.selected;
        }
      }

      return [...columns];
    });
  }
}
