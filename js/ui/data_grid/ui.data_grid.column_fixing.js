"use strict";

var gridCore = require("./ui.data_grid.core"),
    columnFixingModule = require("../grid_core/ui.grid_core.column_fixing");

gridCore.registerModule("columnFixing", columnFixingModule);
