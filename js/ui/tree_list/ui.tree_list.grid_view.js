import treeListCore from './ui.tree_list.core';
import gridViewModule from '../grid_core/ui.grid_core.grid_view';

const GridView = gridViewModule.views.gridView.inherit((function() {
    return {
        _getWidgetAriaLabel: function() {
            return 'dxTreeList-ariaTreeList';
        },
        _getTableRoleName: function() {
            return 'treegrid';
        }
    };
})());

treeListCore.registerModule('gridView', {
    defaultOptions: gridViewModule.defaultOptions,
    controllers: gridViewModule.controllers,
    views: {
        gridView: GridView
    },
    extenders: {
        controllers: {
            resizing: {
                _toggleBestFitMode: function(isBestFit) {
                    this.callBase(isBestFit);
                    if(!this.option('legacyRendering')) {
                        const $rowsTable = this._rowsView.getTableElement();
                        $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
                    }
                }
            }
        }
    }
});
