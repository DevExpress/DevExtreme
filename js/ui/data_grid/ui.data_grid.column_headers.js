"use strict";

var gridCore = require("./ui.data_grid.core"),
    columnHeadersViewModule = require("../grid_core/ui.grid_core.column_headers");

exports.ColumnHeadersView = columnHeadersViewModule.views.columnHeadersView;

gridCore.registerModule("columnHeaders", columnHeadersViewModule);
