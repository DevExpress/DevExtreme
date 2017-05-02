"use strict";

var gridCore = require("./ui.data_grid.core"),
    columnChooserModule = require("../grid_core/ui.grid_core.column_chooser");

exports.ColumnChooserController = columnChooserModule.controllers.columnChooser;
exports.ColumnChooserView = columnChooserModule.views.columnChooserView;

gridCore.registerModule("columnChooser", columnChooserModule);
