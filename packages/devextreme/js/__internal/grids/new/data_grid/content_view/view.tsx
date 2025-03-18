/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { combined } from '@ts/core/reactive/index';
import type { OptionsController } from '@ts/grids/new/card_view/options_controller';

import { ContentView as ContentViewBase } from '../../grid_core/content_view/view';
import type { ContentViewProps } from './content_view';
import { ContentView as ContentViewComponent } from './content_view';

export class ContentView extends ContentViewBase<ContentViewProps> {
  // @ts-expect-error
  protected options: OptionsController;

  protected override component = ContentViewComponent;

  protected override getProps() {
    return combined({
      ...this.getBaseProps(),
      contentProps: combined({
        items: this.itemsController.items,
      }),
      virtualScrollingProps: combined({
        heightUp: 0,
        heightDown: 0,
      }),
    });
  }
}
