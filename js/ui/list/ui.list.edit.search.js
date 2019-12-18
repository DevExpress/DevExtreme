var ListEdit = require('./ui.list.edit'),
    searchBoxMixin = require('../widget/ui.search_box_mixin');

var ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
    _addWidgetPrefix: function(className) {
        return 'dx-list-' + className;
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
        var value = this.option('searchValue'),
            expr = this.option('searchExpr'),
            mode = this.option('searchMode');

        this.callBase();

        if(this._dataSource) {
            value && value.length && this._dataSource.searchValue(value);
            mode.length && this._dataSource.searchOperation(searchBoxMixin.getOperationBySearchMode(mode));
            expr && this._dataSource.searchExpr(expr);
        }
    }
});

module.exports = ListSearch;
