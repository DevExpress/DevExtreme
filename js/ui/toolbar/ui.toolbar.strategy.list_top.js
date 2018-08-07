var $ = require("../../core/renderer"),
    ListStrategy = require("./ui.toolbar.strategy.list_base"),
    extend = require("../../core/utils/extend").extend,
    translator = require("../../animation/translator");

var ListTopStrategy = ListStrategy.inherit({

    NAME: "listTop",

    _listOverlayConfig: function() {
        var config = this.callBase();

        return extend({}, config, {
            onContentReady: this._setItemsContainerZIndex.bind(this)
        });
    },

    _setItemsContainerZIndex: function(e) {
        var overlayZIndex = e.component.$content().css("zIndex");
        this._toolbar._$toolbarItemsContainer.css("zIndex", overlayZIndex + 1);
    },

    _renderMenuPosition: function(offset, animate) {
        var $element = this._toolbar._$toolbarItemsContainer;
        var pos = this._calculateItemsContainerOffset(offset);

        if(animate) {
            this._animateMenuToggling($element, pos, this._menuShown);
        } else {
            translator.move($element, { top: pos });
        }

        return this.callBase(offset, animate);
    },

    _calculateItemsContainerOffset: function(offset) {
        offset = (offset || 0) - 1;
        var maxOffset = this._getItemsContainerHeight();

        return offset * maxOffset;
    },

    _getItemsContainerHeight: function() {
        var semiHiddenHeight = this._toolbar._$toolbarItemsContainer.height() - this._toolbar.$element().height();
        return semiHiddenHeight;
    },

    _listOutsideClickHandler: function(e) {
        var $target = $(e.target);
        var isOverlayClick = $target.closest(this._listOverlay.$content()).length > 0;
        var isItemsContainerClick = $target.closest(this._toolbar._$toolbarItemsContainer).length > 0;

        if(!isOverlayClick && !isItemsContainerClick) {
            this._toggleMenu(false, true);
        }
    }

});

module.exports = ListTopStrategy;
