"use strict";

var ListEdit = require("./ui.list.edit"),
    searchBoxMixin = require("../widget/ui.search_box_mixin");

var ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
    _addWidgetPrefix: function(className) {
        return "dx-list-" + className;
    },

    _getCombinedFilter: function() {
        var filter,
            storeLoadOptions,
            dataSource = this._dataSource;

        if(dataSource) {
            storeLoadOptions = { filter: dataSource.filter() };
            dataSource._addSearchFilter(storeLoadOptions);
            filter = storeLoadOptions.filter;
        }

        return filter;
    }
});

module.exports = ListSearch;
