import { computed } from '@ts/core/reactive';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { ContentStatusView } from '@ts/grids/new/grid_core/content_view/content_status_view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';

import { OptionsController } from '../options_controller';
import { Card } from './card';

export const CLASSES = {
  content: 'dx-cardview-content',
};

export class ContentView extends View {
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
    (items) => {
      const ContentStatus = this.contentStatus.asInferno();
      return <>
        <div className={CLASSES.content} tabIndex={0}>
          <ContentStatus/>
          {items.map((item) => (
            <Card row={item}></Card>
          ))}
        </div>
      </>;
    },
    [
      this.items,
    ],
  );

  static dependencies = [
    DataController, ColumnsController, OptionsController, ContentStatusView,
  ] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly contentStatus: ContentStatusView,
  ) {
    super();
  }
}
