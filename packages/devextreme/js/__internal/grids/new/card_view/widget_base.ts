/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import registerComponent from '@js/core/component_registrator';
import { Content as ContentBase } from '@ts/grids/new/grid_core/content_view/content';
import { MainView as MainViewBase } from '@ts/grids/new/grid_core/main_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNew } from '@ts/grids/new/grid_core/widget_base';

import { Content } from './content_view/content_view_content';
import { HeadersView } from './headers/view';
import { MainView } from './main_view';
import { OptionsController } from './options_controller';
import type { Properties } from './types';

export class CardView extends GridCoreNew<Properties> {
  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(HeadersView);

    this.diContext.register(ContentBase, Content);
    this.diContext.register(MainViewBase, MainView);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    // @ts-expect-error
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }
}

// @ts-expect-error
registerComponent('dxCardView', CardView);

export default CardView;
