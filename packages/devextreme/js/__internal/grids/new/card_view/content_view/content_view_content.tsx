/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ContentViewContent as BaseContentViewContent } from '@ts/grids/new/grid_core/content_view/content_view_content';
import { View } from '@ts/grids/new/grid_core/core/view';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';

import { EditingController } from '../../grid_core/editing/controller';
import { Card } from './card';

export const CLASSES = {
  content: 'dx-cardview-content',
};

export class ContentViewContent extends View implements BaseContentViewContent {
  private readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.items, this.columnsController.columns],
  );

  public vdom = computed(
    (items, isEditing) => (
      <>
        {items.map((item) => (
          <Card
            row={item}
            isEditing={isEditing}
            onChange={
              (columnName, value): void => this.editing.onChanged(item.key, columnName, value)
            }
          />
        ))}
      </>
    ),
    [
      this.items,
      this.editing.isEditing,
    ],
  );

  public static dependencies = [
    DataController, ColumnsController, EditingController,
  ] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
    private readonly editing: EditingController,
  ) {
    super();
  }
}
