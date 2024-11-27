/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import * as DataControllerModule from '@ts/grids/new/grid_core/data_controller';
import { MainView as MainViewBase } from '@ts/grids/new/grid_core/main_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNewBase } from '@ts/grids/new/grid_core/widget_base';

import { ContentView } from './content_view/view';
import { HeaderPanelView } from './header_panel/view';
import { MainView } from './main_view';
import { OptionsController } from './options_controller';

export class CardViewBase extends GridCoreNewBase {
  contentView!: ContentView;

  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(HeaderPanelView);

    this.diContext.register(ContentView);
    this.diContext.register(MainViewBase, MainView);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    // @ts-expect-error
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }

  protected _initMarkup(): void {
    super._initMarkup();
    $(this.$element()).addClass('dx-cardview');
  }

  protected _initDIContext(): void {
    super._initDIContext();
    this.contentView = this.diContext.get(ContentView);
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected _getDefaultOptions() {
    return {
      ...super._getDefaultOptions(),
      cardsPerRow: 3,
    };
  }
}

export class CardView extends DataControllerModule.PublicMethods(CardViewBase) {}

// @ts-expect-error
registerComponent('dxCardView', CardView);

export default CardView;
