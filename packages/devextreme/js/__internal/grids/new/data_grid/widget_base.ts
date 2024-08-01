import registerComponent from '@js/core/component_registrator';
import type { Properties } from '@js/ui/card_view';
import { ContentView as ContentViewBase } from '@ts/grids/new/grid_core/content_view/content_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { GridCoreNew } from '@ts/grids/new/grid_core/widget_base';

import { ContentView } from './content_view/content_view';
import { OptionsController } from './options_controller';

class DataGridNew extends GridCoreNew<Properties> {
  protected _registerDIContext(): void {
    super._registerDIContext();
    this.diContext.register(ContentViewBase, ContentView);

    const optionsController = new OptionsController(this);
    this.diContext.registerInstance(OptionsController, optionsController);
    // @ts-expect-error
    this.diContext.registerInstance(OptionsControllerBase, optionsController);
  }
}

// @ts-expect-error
registerComponent('dxDataGridNew', DataGridNew);

export default DataGridNew;
