import { gridViewModule } from '@ts/grids/grid_core/views/m_grid_view';

import treeListCore from './m_core';

const GridView = gridViewModule.views.gridView.inherit((function () {
  return {
    _getWidgetAriaLabel() {
      return 'dxTreeList-ariaTreeList';
    },
    _getTableRoleName() {
      return 'treegrid';
    },
  };
})());

treeListCore.registerModule('gridView', {
  defaultOptions: gridViewModule.defaultOptions,
  controllers: gridViewModule.controllers,
  views: {
    gridView: GridView,
  },
  extenders: {
    controllers: {
      resizing: {
        _toggleBestFitMode(isBestFit) {
          this.callBase(isBestFit);

          const $rowsTable = this._rowsView.getTableElement();
          $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
        },
      },
    },
  },
});
