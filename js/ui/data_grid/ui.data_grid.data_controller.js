"use strict";

var gridCore = require("./ui.data_grid.core"),
    dataSourceAdapterProvider = require("./ui.data_grid.data_source_adapter"),
    dataControllerModule = require("../grid_core/ui.grid_core.data_controller");

exports.DataController = dataControllerModule.controllers.data.inherit((function() {
    return {
        _getDataSourceAdapter: function() {
            return dataSourceAdapterProvider;
        }
    };
})());

gridCore.registerModule("data", {
    /**
    * @name dxDataGridOptions_keyExpr
    * @publicName keyExpr
    * @type string|Array<string>
    * @default undefined
    */
    defaultOptions: dataControllerModule.defaultOptions,
    controllers: {
        data: exports.DataController
    }
});
