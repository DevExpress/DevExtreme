"use strict";

var gridCore = require("./ui.data_grid.core"),
    masterDetailModule = require("../grid_core/ui.grid_core.master_detail");

gridCore.registerModule("masterDetail", masterDetailModule);
