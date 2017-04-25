"use strict";

var treeListCore = require("./ui.tree_list.core"),
    gridViewModule = require("../grid_core/ui.grid_core.grid_view");

var GridView = gridViewModule.views.gridView.inherit((function() {
    return {
        _getWidgetAriaLabel: function() {
            return "dxTreeList-ariaTreeList";
        }
    };
})());

treeListCore.registerModule("gridView", {
    defaultOptions: gridViewModule.defaultOptions,
    controllers: gridViewModule.controllers,
    views: {
        gridView: GridView
    }
});
