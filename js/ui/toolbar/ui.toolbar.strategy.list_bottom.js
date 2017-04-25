"use strict";

var $ = require("jquery"),
    ListStrategy = require("./ui.toolbar.strategy.list_base"),
    Swipeable = require("../../events/gesture/swipeable");

var ListBottomStrategy = ListStrategy.inherit({

    NAME: "listBottom",

    _renderWidget: function() {
        this._renderContainerSwipe();
        this.callBase();
        this._toolbar._$toolbarItemsContainer.prependTo(this._listOverlay.content());
    },

    _renderContainerSwipe: function() {
        this._toolbar._createComponent(this._toolbar._$toolbarItemsContainer,
            Swipeable, {
                elastic: false,
                onStart: $.proxy(this._swipeStartHandler, this),
                onUpdated: $.proxy(this._swipeUpdateHandler, this),
                onEnd: $.proxy(this._swipeEndHandler, this),
                itemSizeFunc: $.proxy(this._getListHeight, this),
                direction: "vertical"
            });
    },

    _swipeStartHandler: function(e) {
        e.jQueryEvent.maxTopOffset = this._menuShown ? 0 : 1;
        e.jQueryEvent.maxBottomOffset = this._menuShown ? 1 : 0;
    },

    _swipeUpdateHandler: function(e) {
        var offset = this._menuShown ? e.jQueryEvent.offset : 1 + e.jQueryEvent.offset;
        this._renderMenuPosition(offset, false);
    },

    _swipeEndHandler: function(e) {
        var targetOffset = e.jQueryEvent.targetOffset;

        targetOffset -= this._menuShown - 1;
        this._toggleMenu(targetOffset === 0, true);
    }

});

module.exports = ListBottomStrategy;
