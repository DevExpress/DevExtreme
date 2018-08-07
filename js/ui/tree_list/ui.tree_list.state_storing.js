var treeListCore = require("./ui.tree_list.core"),
    extend = require("../../core/utils/extend").extend,
    stateStoringModule = require("../grid_core/ui.grid_core.state_storing"),
    origApplyState = stateStoringModule.extenders.controllers.stateStoring.applyState;

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
