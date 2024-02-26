import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';
import { gridViewModule } from '@ts/grids/grid_core/views/m_grid_view';

import treeListCore from './m_core';

const resizing = (Base: ModuleType<ResizingController>) => class TreeListResizingControllerExtender extends Base {
  _getWidgetAriaLabel() {
    return 'dxTreeList-ariaTreeList';
  }

  _toggleBestFitMode(isBestFit) {
    super._toggleBestFitMode(isBestFit);

    const $rowsTable = this._rowsView.getTableElement();
    $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
  }
};

treeListCore.registerModule('gridView', {
  defaultOptions: gridViewModule.defaultOptions,
  controllers: {
    ...gridViewModule.controllers,
    resizing,
  },
  views: gridViewModule.views,
});
