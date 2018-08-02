var $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend,
    Deferred = require("../../core/utils/deferred").Deferred,
    ToolbarStrategy = require("./ui.toolbar.strategy"),
    translator = require("../../animation/translator"),
    hideTopOverlayCallback = require("../../mobile/hide_top_overlay").hideCallback,
    fx = require("../../animation/fx"),
    Overlay = require("../overlay"),
    List = require("../list/ui.list.base");

var TOOLBAR_LIST_VISIBLE_CLASS = "dx-toolbar-list-visible",

    SUBMENU_ANIMATION_EASING = "easeOutCubic",
    SUBMENU_HIDE_DURATION = 200,
    SUBMENU_SHOW_DURATION = 400;

var ListStrategy = ToolbarStrategy.inherit({

    render: function() {
        this._renderListOverlay();
        this.callBase();
        this._changeListVisible(this._toolbar.option("visible"));
    },

    _renderWidget: function() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this.callBase();
    },

    _menuWidgetClass: function() {
        return List;
    },

    _menuContainer: function() {
        return this._listOverlay.$content();
    },

    _menuButtonOptions: function() {
        return extend({}, this.callBase(), {
            activeStateEnabled: false,
            text: "..."
        });
    },

    _widgetOptions: function() {
        return extend({}, this.callBase(), {
            width: "100%",
            indicateLoading: false
        });
    },

    _renderListOverlay: function() {
        var $listOverlay = $("<div>").appendTo(this._toolbar.$element());
        this._listOverlay = this._toolbar._createComponent($listOverlay, Overlay, this._listOverlayConfig());
    },

    _listOverlayConfig: function() {
        return {
            container: false,
            deferRendering: false,
            shading: false,
            height: "auto",
            width: "100%",
            showTitle: false,
            closeOnOutsideClick: this._listOutsideClickHandler.bind(this),
            position: null,
            animation: null,
            closeOnBackButton: false
        };
    },

    _listOutsideClickHandler: function(e) {
        if(!$(e.target).closest(this._listOverlay.$content()).length) {
            this._toggleMenu(false, true);
        }
    },

    _getListHeight: function() {
        var listHeight = this._listOverlay.$content().find(".dx-list").height(),
            semiHiddenHeight = this._toolbar._$toolbarItemsContainer.height() - this._toolbar.$element().height();

        return listHeight + semiHiddenHeight;
    },

    _hideTopOverlayHandler: function() {
        this._toggleMenu(false, true);
    },

    _toggleHideTopOverlayCallback: function() {
        if(this._closeCallback) {
            hideTopOverlayCallback.remove(this._closeCallback);
        }

        if(this._menuShown) {
            this._closeCallback = this._hideTopOverlayHandler.bind(this);
            hideTopOverlayCallback.add(this._closeCallback);
        }
    },

    // TODO: make offset int -> boolean
    _calculatePixelOffset: function(offset) {
        offset = (offset || 0) - 1;
        var maxOffset = this._getListHeight();

        return offset * maxOffset;
    },

    _renderMenuPosition: function(offset, animate) {
        var pos = this._calculatePixelOffset(offset),
            element = this._listOverlay.$content();

        if(animate) {
            return this._animateMenuToggling(element, pos, this._menuShown);
        }

        translator.move(element, { top: pos });
        return new Deferred().resolve().promise();
    },

    _animateMenuToggling: function($element, position, isShowAnimation) {
        var duration = isShowAnimation ? SUBMENU_SHOW_DURATION : SUBMENU_HIDE_DURATION;
        return fx.animate($element, {
            type: "slide",
            to: { top: position },
            easing: SUBMENU_ANIMATION_EASING,
            duration: duration
        });
    },

    _toggleMenu: function(visible, animate) {
        this.callBase.apply(this, arguments);

        this._toggleHideTopOverlayCallback();

        this._renderMenuPosition(this._menuShown ? 0 : 1, animate).done((function() {
            this._toolbar.$element().toggleClass(TOOLBAR_LIST_VISIBLE_CLASS, visible);
        }).bind(this));
    },

    _changeListVisible: function(value) {
        if(this._listOverlay) {
            this._listOverlay.option("visible", value);
            this._toggleMenu(false, false);
        }
    },

    handleToolbarVisibilityChange: function(value) {
        this._changeListVisible(value);
    }

});

module.exports = ListStrategy;
