"use strict";

var gridCore = require("./ui.tree_list.core"),
    dataSourceAdapter = require("./ui.tree_list.data_source_adapter"),
    virtualScrollingModule = require("../grid_core/ui.grid_core.virtual_scrolling"),
    extend = require("../../core/utils/extend").extend,
    equalByValue = require("../../core/utils/common").equalByValue;

var oldDefaultOptions = virtualScrollingModule.defaultOptions,
    originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data;

virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
    optionChanged: function(args) {
        var dataSource = this.dataSource(),
            virtualScrollController = dataSource && dataSource._virtualScrollController;

        if(args.name === "expandedRowKeys" && dataSource && !dataSource._isNodesInitializing && !equalByValue(args.value, args.previousValue)) {
            virtualScrollController && virtualScrollController.reset();
        }

        this.callBase(args);
    }
});

gridCore.registerModule("virtualScrolling", extend({}, virtualScrollingModule, {
    defaultOptions: function() {
        return extend(true, oldDefaultOptions(), {
            scrolling: {
                /**
                 * @name dxTreeListOptions_scrolling_mode
                 * @publicName mode
                 * @type string
                 * @acceptValues "standard" | "virtual"
                 * @default "virtual"
                 */
                mode: "virtual"
            }
        });
    }
}));

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
