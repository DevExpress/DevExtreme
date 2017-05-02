"use strict";

require("./ui.data_grid.editor_factory");

var gridCore = require("./ui.data_grid.core"),
    editingModule = require("../grid_core/ui.grid_core.editing");

gridCore.registerModule("editing", editingModule);
