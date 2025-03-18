/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { MainView as MainViewBase } from '@ts/grids/new/grid_core/main_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNew } from '@ts/grids/new/grid_core/widget';

import * as ContentViewModule from './content_view/index';
import { HeaderPanelView } from './header_panel/view';
import { MainView } from './main_view';
import { defaultOptions } from './options';
import { OptionsController } from './options_controller';

export class CardViewBase extends GridCoreNew {
  contentView!: ContentViewModule.View;

  headerPanel!: HeaderPanelView;

  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(HeaderPanelView);

    this.diContext.register(ContentViewModule.View);
    this.diContext.register(MainViewBase, MainView);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }

  protected _initMarkup(): void {
    super._initMarkup();
    $(this.$element()).addClass('dx-cardview');
  }

  protected _initDIContext(): void {
    super._initDIContext();
    this.contentView = this.diContext.get(ContentViewModule.View);
    this.headerPanel = this.diContext.get(HeaderPanelView);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  protected _getDefaultOptions() {
    return {
      ...super._getDefaultOptions(),
      ...extend(true, {}, defaultOptions) as typeof defaultOptions,
    };
  }
}

export class CardView extends ContentViewModule.PublicMethods(CardViewBase) {}

// @ts-expect-error
registerComponent('dxCardView', CardView);

export default CardView;
