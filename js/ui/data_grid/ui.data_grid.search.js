"use strict";

var gridCore = require("./ui.data_grid.core"),
    searchModule = require("../grid_core/ui.grid_core.search");

gridCore.registerModule("search", searchModule);
