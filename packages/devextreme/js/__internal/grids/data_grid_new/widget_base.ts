import registerComponent from '@js/core/component_registrator';
import type { Properties } from '@js/ui/card_view';
import { ContentView as ContentViewBase } from '@ts/grids/grid_core_new/content_view/content_view';
import { OptionsController as OptionsControllerBase } from '@ts/grids/grid_core_new/options_controller/options_controller';
import { GridCoreNew } from '@ts/grids/grid_core_new/widget_base';

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
