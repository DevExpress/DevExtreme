"use strict";

var gridCore = require("./ui.tree_list.core"),
    dataSourceAdapter = require("./ui.tree_list.data_source_adapter"),
    virtualScrollingModule = require("../grid_core/ui.grid_core.virtual_scrolling"),
    extend = require("../../core/utils/extend").extend;

var oldDefaultOptions = virtualScrollingModule.defaultOptions;

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
