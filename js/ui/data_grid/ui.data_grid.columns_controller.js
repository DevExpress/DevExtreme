"use strict";

var gridCore = require("./ui.data_grid.core"),
    columnsControllerModule = require("../grid_core/ui.grid_core.columns_controller");

gridCore.registerModule("columns", columnsControllerModule);
