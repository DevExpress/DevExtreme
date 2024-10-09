import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';

import type { Column } from '../../grid_core/columns_controller/types';
import type { ContentViewProps } from '../../grid_core/content_view2/content_view';
import { ContentView as ContentViewBase } from '../../grid_core/content_view2/view';
import { ContentView as ContentViewComponent } from './content_view';

export class ContentView extends ContentViewBase {
  protected component = ContentViewComponent;

  private readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.items, this.columnsController.visibleColumns],
  );

  protected getProps(): SubsGets<ContentViewProps> {
    return computed(
      (baseProps) => {

      },
      [super.getProps()],
    );
  }
}
