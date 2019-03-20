var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    positionUtils = require("../../animation/position"),
    extend = require("../../core/utils/extend").extend,
    ContextMenu = require("../context_menu");

var DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = "dx-context-menu-content-delimiter",
    DX_SUBMENU_CLASS = "dx-submenu";

var Submenu = ContextMenu.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            orientation: "horizontal",
            tabIndex: null,
            onHoverStart: noop
        });
    },

    _initDataAdapter: function() {
        this._dataAdapter = this.option("_dataAdapter");
        if(!this._dataAdapter) {
            this.callBase();
        }
    },

    _renderContentImpl: function() {
        this._renderContextMenuOverlay();
        this.callBase();

        var node = this._dataAdapter.getNodeByKey(this.option("_parentKey"));
        node && this._renderItems(this._getChildNodes(node));
        this._renderDelimiter();
    },

    _renderDelimiter: function() {
        this.$contentDelimiter = $("<div>")
            .appendTo(this._itemContainer())
            .addClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS);
    },

    _getOverlayOptions: function() {
        return extend(this.callBase(), {
            onPositioned: this._overlayPositionedActionHandler.bind(this)
        });
    },

    _overlayPositionedActionHandler: function(arg) {
        this._showDelimiter(arg);
    },

    _hoverEndHandler: function(e) {
        this.callBase(e);
        this._toggleFocusClass(false, e.currentTarget);
    },

    _isMenuHorizontal: function() {
        return this.option("orientation") === "horizontal";
    },

    _hoverStartHandler: function(e) {
        var hoverStartAction = this.option("onHoverStart");
        hoverStartAction(e);

        this.callBase(e);
        this._toggleFocusClass(true, e.currentTarget);
    },

    _drawSubmenu: function($rootItem) {
        this._actions.onShowing({
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
        this.callBase($rootItem);
        this._actions.onShown({
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
    },

    _hideSubmenu: function($rootItem) {
        this._actions.onHiding({
            cancel: true,
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
        this.callBase($rootItem);
        this._actions.onHidden({
            rootItem: getPublicElement($rootItem),
            submenu: this
        });
    },

    // TODO: try to simplify it
    _showDelimiter: function(arg) {
        if(!this.$contentDelimiter) {
            return;
        }

        var $submenu = this._itemContainer().children("." + DX_SUBMENU_CLASS).eq(0),
            $rootItem = this.option("position").of,
            position = {
                of: $submenu
            },
            containerOffset = arg.position,
            vLocation = containerOffset.v.location,
            hLocation = containerOffset.h.location,
            rootOffset = $rootItem.offset(),
            offsetLeft = Math.round(rootOffset.left),
            offsetTop = Math.round(rootOffset.top),
            rootWidth = $rootItem.width(),
            rootHeight = $rootItem.height(),
            submenuWidth = $submenu.width(),
            submenuHeight = $submenu.height();

        this.$contentDelimiter.css("display", "block");
        this.$contentDelimiter.width(this._isMenuHorizontal() ? (rootWidth < submenuWidth ? rootWidth - 2 : submenuWidth) : 2);
        this.$contentDelimiter.height(this._isMenuHorizontal() ? 2 : (rootHeight < submenuHeight ? rootHeight - 2 : submenuHeight));

        if(this._isMenuHorizontal()) {
            if(vLocation > offsetTop) {
                if(Math.round(hLocation) === offsetLeft) {
                    position.offset = "1 -1";
                    position.at = position.my = "left top";
                } else {
                    position.offset = "-1 -1";
                    position.at = position.my = "right top";
                }
            } else {
                this.$contentDelimiter.height(5);
                if(Math.round(hLocation) === offsetLeft) {
                    position.offset = "1 4";
                    position.at = position.my = "left bottom";
                } else {
                    position.offset = "-1 2";
                    position.at = position.my = "right bottom";
                }
            }
        } else {
            if(hLocation > offsetLeft) {
                if(Math.round(vLocation) === offsetTop) {
                    position.offset = "-1 1";
                    position.at = position.my = "left top";
                } else {
                    position.offset = "-1 -1";
                    position.at = position.my = "left bottom";
                }
            } else {
                if(Math.round(vLocation) === offsetTop) {
                    position.offset = "1 1";
                    position.at = position.my = "right top";
                } else {
                    position.offset = "1 -1";
                    position.at = position.my = "right bottom";
                }
            }
        }
        positionUtils.setup(this.$contentDelimiter, position);
    },

    _getContextMenuPosition: function() {
        return this.option("position");
    },

    isOverlayVisible: function() {
        return this._overlay.option("visible");
    },

    getOverlayContent: function() {
        return this._overlay.$content();
    }
});

module.exports = Submenu;
