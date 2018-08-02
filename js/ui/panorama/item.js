var $ = require("../../core/renderer"),
    CollectionWidgetItem = require("../collection/item");

var PANORAMA_ITEM_TITLE_CLASS = "dx-panorama-item-title";

var PanoramaItem = CollectionWidgetItem.inherit({

    _renderWatchers: function() {
        this.callBase();

        this._startWatcher("title", this._renderTitle.bind(this));
    },

    _renderTitle: function(title) {
        this._$element.children("." + PANORAMA_ITEM_TITLE_CLASS).remove();

        if(!title) {
            return;
        }

        var $header = $("<div>").addClass(PANORAMA_ITEM_TITLE_CLASS).text(title);
        this._$element.prepend($header);
    }

});

module.exports = PanoramaItem;
