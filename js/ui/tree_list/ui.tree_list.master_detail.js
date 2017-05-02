"use strict";

var treeListCore = require("./ui.tree_list.core"),
    masterDetailModule = require("../grid_core/ui.grid_core.master_detail"),
    extend = require("../../core/utils/extend").extend;

treeListCore.registerModule("masterDetail", extend(true, {}, masterDetailModule, {
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
