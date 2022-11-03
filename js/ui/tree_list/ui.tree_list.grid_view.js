import treeListCore from './ui.tree_list.core';
import { gridViewModule } from '../grid_core/ui.grid_core.grid_view';
import { deferRender, deferUpdate } from '../../core/utils/common';

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
                _synchronizeColumns: function() {
                    const wordWrap = this.option('wordWrapEnabled');
                    if(wordWrap) this._toggleContentMinHeight(true);
                    this.callBase(arguments);

                    if(wordWrap) {
                        deferUpdate(() => {
                            deferRender(() => {
                                deferUpdate(() => {
                                    this._toggleContentMinHeight(false);
                                });
                            });
                        });
                    }
                },

                _toggleBestFitMode: function(isBestFit) {
                    this.callBase(isBestFit);

                    const $rowsTable = this._rowsView.getTableElement();
                    $rowsTable.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
                }
            }
        }
    }
});
