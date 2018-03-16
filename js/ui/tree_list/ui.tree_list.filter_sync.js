"use strict";

var treeListCore = require("./ui.tree_list.core"),
    filterSyncModule = require("../grid_core/ui.grid_core.filter_sync");

treeListCore.registerModule("filterSync", filterSyncModule);
