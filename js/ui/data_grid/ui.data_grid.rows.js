"use strict";

var gridCore = require("./ui.data_grid.core"),
    rowsViewModule = require("../grid_core/ui.grid_core.rows");

exports.RowsView = rowsViewModule.views.rowsView;

gridCore.registerModule("rows", rowsViewModule);
