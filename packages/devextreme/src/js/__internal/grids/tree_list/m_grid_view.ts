import { gridViewModule } from '@ts/grids/grid_core/views/m_grid_view';

import treeListCore from './m_core';

const ResizingController = gridViewModule.controllers.resizing.inherit({
  _getWidgetAriaLabel() {
    return 'dxTreeList-ariaTreeList';
  },

  _toggleBestFitMode(isBestFit) {
    this.callBase(isBestFit);

    const $rowsTable = this._rowsView.getTableElement();
    $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
  },
});

treeListCore.registerModule('gridView', {
  defaultOptions: gridViewModule.defaultOptions,
  controllers: {
    ...gridViewModule.controllers,
    resizing: ResizingController,
  },
  views: gridViewModule.views,
});
