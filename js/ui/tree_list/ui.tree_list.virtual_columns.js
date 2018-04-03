"use strict";

var treeListCore = require("./ui.tree_list.core"),
    virtualColumnsModule = require("../grid_core/ui.grid_core.virtual_columns");

treeListCore.registerModule("virtualColumns", virtualColumnsModule);
