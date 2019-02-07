import treeListCore from './ui.tree_list.core';
import { extend } from '../../core/utils/extend';
import stateStoringModule from '../grid_core/ui.grid_core.state_storing';
var origApplyState = stateStoringModule.extenders.controllers.stateStoring.applyState;

treeListCore.registerModule("stateStoring", extend(true, {}, stateStoringModule, {
    extenders: {
        controllers: {
            stateStoring: {
                applyState: function(state) {
                    origApplyState.apply(this, arguments);
                    if(state.hasOwnProperty("expandedRowKeys")) {
                        this.option("expandedRowKeys", state.expandedRowKeys);
                    }
                }
            },
            data: {
                getUserState: function() {
                    var state = this.callBase.apply(this, arguments);

                    if(!this.option("autoExpandAll")) {
                        state.expandedRowKeys = this.option("expandedRowKeys");
                    }

                    return state;
                }
            }
        }
    }
}));
