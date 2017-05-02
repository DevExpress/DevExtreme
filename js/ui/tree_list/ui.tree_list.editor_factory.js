"use strict";

var treeListCore = require("./ui.tree_list.core"),
    editorFactoryModule = require("../grid_core/ui.grid_core.editor_factory");

treeListCore.registerModule("editorFactory", editorFactoryModule);
