/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import registerComponent from '@js/core/component_registrator';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { ContentView as ContentViewBase } from '@ts/grids/new/grid_core/content_view/content_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNew } from '@ts/grids/new/grid_core/widget_base';

import { ContentView } from './content_view/content_view';
import { OptionsController } from './options_controller';
import type { Properties } from './types';

class CardView extends GridCoreNew<Properties> {
  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(ContentViewBase, ContentView);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    // @ts-expect-error
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }

  public getScrollable(): dxScrollable {
    return this.diContext.get(ContentView).scrollableRef.current!;
  }
}

// @ts-expect-error
registerComponent('dxCardView', CardView);

export default CardView;
