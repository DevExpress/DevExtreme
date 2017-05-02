"use strict";

var gridCore = require("./ui.data_grid.core"),
    editorFactoryModule = require("../grid_core/ui.grid_core.editor_factory");

gridCore.registerModule("editorFactory", editorFactoryModule);
