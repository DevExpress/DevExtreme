"use strict";

var gridCore = require("./ui.tree_list.core"),
    dataSourceAdapter = require("./ui.tree_list.data_source_adapter"),
    virtualScrollingModule = require("../grid_core/ui.grid_core.virtual_scrolling"),
    extend = require("../../core/utils/extend").extend;

var oldDefaultOptions = virtualScrollingModule.defaultOptions,
    originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data,
    originalDataSourceAdapterExtender = virtualScrollingModule.extenders.dataSourceAdapter;

virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
    _loadOnOptionChange: function() {
        var virtualScrollController = this._dataSource && this._dataSource._virtualScrollController;

        virtualScrollController && virtualScrollController.reset();
        this.callBase();
    }
});

virtualScrollingModule.extenders.dataSourceAdapter = extend({}, originalDataSourceAdapterExtender, {
    changeRowExpand: function() {
        return this.callBase.apply(this, arguments).done(() => {
            var viewportItemIndex = this.getViewportItemIndex();

            viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
        });
    }
});

gridCore.registerModule("virtualScrolling", extend({}, virtualScrollingModule, {
    defaultOptions: function() {
        return extend(true, oldDefaultOptions(), {
            scrolling: {
                /**
                 * @name dxTreeListOptions.scrolling.mode
                 * @type Enums.TreeListScrollingMode
                 * @default "virtual"
                 */
                mode: "virtual"
            }
        });
    }
}));

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
