import treeListCore from './ui.tree_list.core';
import masterDetailModule from '../grid_core/ui.grid_core.master_detail';
import { extend } from '../../core/utils/extend';

treeListCore.registerModule('masterDetail', extend(true, {}, masterDetailModule, {
    extenders: {
        controllers: {
            data: {
                isRowExpanded: function() {
                    return this.callBase.apply(this, arguments);
                },
                _processItems: function() {
                    return this.callBase.apply(this, arguments);
                },
                _processDataItem: function() {
                    return this.callBase.apply(this, arguments);
                }
            }
        }
    }
}));
