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
    },

    _initDataSource: function() {
        this.callBase();

        if(this._dataSource) {
            this.option("searchValue").length && this._dataSource.searchValue(this.option("searchValue"));
            this.option("searchMode") !== "contains" && this._dataSource.searchOperation(this.option("searchMode"));
            this.option("searchExpr") && this._dataSource.searchExpr(this.option("searchExpr"));
        }
    }
});

module.exports = ListSearch;
