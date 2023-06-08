import { gridViewModule } from '@js/ui/grid_core/ui.grid_core.grid_view';
import treeListCore from './module_core';

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
