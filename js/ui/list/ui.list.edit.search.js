var ListEdit = require("./ui.list.edit"),
    searchBoxMixin = require("../widget/ui.search_box_mixin"),
    extend = require("../../core/utils/extend").extend;

var ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), this._searchBoxMixinDefaultOptions());
    },

    _initMarkup: function() {
        this._searchBoxMixinInitMarkup();

        this.callBase();
    },

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
        var value = this.option("searchValue"),
            expr = this.option("searchExpr"),
            mode = this.option("searchMode");

        this.callBase();

        if(this._dataSource) {
            value && value.length && this._dataSource.searchValue(value);
            mode.length && this._dataSource.searchOperation(searchBoxMixin.getOperationBySearchMode(mode));
            expr && this._dataSource.searchExpr(expr);
        }
    },

    _updateFocusState: function(e, isFocused) {
        this._searchBoxMixinUpdateFocusState(isFocused);

        this.callBase(e, isFocused);
    },

    _focusTarget: function() {
        if(this.option("searchEnabled")) {
            return this._itemContainer();
        }

        return this.callBase();
    },

    _getAreaTarget: function() {
        return this._searchBoxMixinGetAriaTarget();
    },

    focus: function() {
        this.searchBoxMixinFocus();
    },

    _refresh: function() {
        this._searchBoxMixinRefresh();
    },

    _optionChanged: function(args) {
        this._searchBoxMixinOptionChanged(args);

        this.callBase(args);
    }
});

module.exports = ListSearch;
