/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import registerComponent from '@js/core/component_registrator';
import * as DataControllerModule from '@ts/grids/new/grid_core/data_controller';
import { MainView as MainViewBase } from '@ts/grids/new/grid_core/main_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNewBase } from '@ts/grids/new/grid_core/widget_base';

import { ContentView } from './content_view/view';
import { HeadersView } from './headers/view';
import { MainView } from './main_view';
import { OptionsController } from './options_controller';

export class CardViewBase extends GridCoreNewBase {
  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(HeadersView);

    this.diContext.register(ContentView);
    this.diContext.register(MainViewBase, MainView);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    // @ts-expect-error
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }
}

export class CardView extends DataControllerModule.PublicMethods(CardViewBase) {}

// @ts-expect-error
registerComponent('dxCardView', CardView);

export default CardView;
