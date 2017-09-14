"use strict";

var ListEdit = require("./ui.list.edit"),
    searchBoxMixin = require("../widget/ui.search_box_mixin");

var ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
    _addWidgetPrefix: function(className) {
        return "dx-list-" + className;
    }
});

module.exports = ListSearch;
