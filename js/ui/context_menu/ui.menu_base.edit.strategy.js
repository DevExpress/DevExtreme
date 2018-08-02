var $ = require("../../core/renderer"),
    map = require("../../core/utils/iterator").map,
    PlainEditStrategy = require("../collection/ui.collection_widget.edit.strategy.plain");

var MenuBaseEditStrategy = PlainEditStrategy.inherit({
    _getPlainItems: function() {
        return map(this._collectionWidget.option("items"), function getMenuItems(item) {
            return (item.items ? [item].concat(map(item.items, getMenuItems)) : item);
        });
    },

    _stringifyItem: function(item) {
        var that = this;

        return JSON.stringify(item, function(key, value) {
            if(key === "template") {
                return that._getTemplateString(value);
            }
            return value;
        });
    },

    _getTemplateString: function(template) {
        var result;

        if(typeof (template) === "object") {
            result = $(template).text();
        } else {
            result = template.toString();
        }

        return result;
    }
});

module.exports = MenuBaseEditStrategy;
