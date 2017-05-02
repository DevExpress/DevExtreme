"use strict";

var gridCore = require("./ui.data_grid.core"),
    dataSourceAdapter = require("./ui.data_grid.data_source_adapter"),
    virtualScrollingModule = require("../grid_core/ui.grid_core.virtual_scrolling");

gridCore.registerModule("virtualScrolling", virtualScrollingModule);

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
