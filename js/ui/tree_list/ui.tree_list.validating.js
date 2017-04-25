"use strict";

var extend = require("../../core/utils/extend").extend,
    treeListCore = require("./ui.tree_list.core"),
    validatingModule = require("../grid_core/ui.grid_core.validating");

var EditingControllerExtender = extend({}, validatingModule.extenders.controllers.editing);
delete EditingControllerExtender.processItems;
delete EditingControllerExtender.processDataItem;

treeListCore.registerModule("validating", {
    defaultOptions: validatingModule.defaultOptions,
    controllers: validatingModule.controllers,
    extenders: {
        controllers: {
            editing: EditingControllerExtender,
            editorFactory: validatingModule.extenders.controllers.editorFactory
        },
        views: validatingModule.extenders.views
    }
});
