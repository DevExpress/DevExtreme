"use strict";

var ListEdit = require("./ui.list.edit"),
    searchBoxMixin = require("../widget/ui.search_box_mixin");

/**
* @name dxList
* @publicName dxList
* @type object
* @inherits CollectionWidget
* @groupName Collection Widgets
*/

var ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
    _addWidgetPrefix: function(className) {
        return "dx-list-" + className;
    }
});

module.exports = ListSearch;
