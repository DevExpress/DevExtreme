"use strict";

var gridCore = require("./ui.data_grid.core"),
    columnsControllerModule = require("../grid_core/ui.grid_core.columns_controller"),
    extend = require("../../core/utils/extend").extend;

gridCore.registerModule("columns", {
    defaultOptions: function() {
        return extend(true, {}, columnsControllerModule.defaultOptions(), {
            /**
            * @name dxDataGridOptions_columns_allowExporting
            * @publicName allowExporting
            * @type boolean
            * @default true
            */
            commonColumnSettings: {
	            allowExporting: true
            }
        });
    },
    controllers: columnsControllerModule.controllers
});
