import { isDefined } from '../../core/utils/type';
import treeListCore from './ui.tree_list.core';
import columnsControllerModule from '../grid_core/ui.grid_core.columns_controller';

exports.ColumnsController = columnsControllerModule.controllers.columns.inherit((function() {
    return {
        _getFirstItems: function(dataSourceAdapter) {
            return this.callBase(dataSourceAdapter).map(function(node) {
                return node.data;
            });
        },
        getFirstDataColumnIndex: function() {
            const visibleColumns = this.getVisibleColumns();
            const visibleColumnsLength = visibleColumns.length;
            let firstDataColumnIndex = 0;

            for(let i = 0; i <= visibleColumnsLength - 1; i++) {
                if(!isDefined(visibleColumns[i].command)) {
                    firstDataColumnIndex = visibleColumns[i].index;
                    break;
                }
            }

            return firstDataColumnIndex;
        },
    };
})());

treeListCore.registerModule('columns', {
    defaultOptions: columnsControllerModule.defaultOptions,
    controllers: {
        columns: exports.ColumnsController
    }
});

