/* eslint-disable spellcheck/spell-checker */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { computed } from '@ts/core/reactive';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { ContentStatusView } from '@ts/grids/new/grid_core/content_view/content_status_view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';
import { createRef } from 'inferno';

import { EditingController } from '../../grid_core/editing/controller';
import { Scrollable } from '../../grid_core/inferno_wrappers/scrollable';
import { OptionsController } from '../options_controller';
import { Card } from './card';

export const CLASSES = {
  content: 'dx-cardview-content',
};

export class ContentView extends View {
  public readonly scrollableRef = createRef<dxScrollable>();

  private readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.itemsWithChanges, this.columnsController.columns],
  );

  public vdom = computed(
    (items, isEditing) => {
      const ContentStatus = this.contentStatus.asInferno();
      return <>
        <Scrollable componentRef={this.scrollableRef}>
          <div className={CLASSES.content} tabIndex={0}>
            <ContentStatus/>
            {items.map((item) => (
              <Card
                row={item}
                isEditing={isEditing}
                onChange={
                  (columnName, value): void => this.editing.onChanged(item.key, columnName, value)
                }
              />
            ))}
          </div>
        </Scrollable>
      </>;
    },
    [
      this.items,
      this.editing.isEditing,
    ],
  );

  static dependencies = [
    DataController, ColumnsController, OptionsController, ContentStatusView, EditingController,
  ] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly contentStatus: ContentStatusView,
    private readonly editing: EditingController,
  ) {
    super();
  }
}
