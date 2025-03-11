/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */

import registerComponent from '@js/core/component_registrator';
import { MainView as MainViewBase } from '@ts/grids/new/grid_core/main_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNew } from '@ts/grids/new/grid_core/widget';

import * as ContentViewModule from './content_view/index';
import * as HeadersViewModule from './headers/index';
import { MainView } from './main_view';
import { defaultOptions } from './options';
import { OptionsController } from './options_controller';

export class DataGridNewBase extends GridCoreNew {
  private contentView!: ContentViewModule.View;

  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(ContentViewModule.View);
    this.diContext.register(HeadersViewModule.View);
    this.diContext.register(MainViewBase, MainView);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }

  protected _initDIContext(): void {
    super._initDIContext();
    this.contentView = this.diContext.get(ContentViewModule.View);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  protected _getDefaultOptions() {
    return {
      ...super._getDefaultOptions(),
      ...defaultOptions,
    };
  }
}

export class DataGridNew extends ContentViewModule.PublicMethods(DataGridNewBase) {}

// @ts-expect-error
registerComponent('dxDataGridNew', DataGridNew);

export default DataGridNew;
