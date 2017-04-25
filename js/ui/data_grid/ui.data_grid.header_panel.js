"use strict";

var gridCore = require("./ui.data_grid.core"),
    headerPanelModule = require("../grid_core/ui.grid_core.header_panel");

exports.HeaderPanel = headerPanelModule.views.headerPanel;

gridCore.registerModule("headerPanel", headerPanelModule);
