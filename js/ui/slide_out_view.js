"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    noop = require("../core/utils/common").noop,
    fx = require("../animation/fx"),
    clickEvent = require("../events/click"),
    translator = require("../animation/translator"),
    hideTopOverlayCallback = require("../mobile/hide_top_overlay").hideCallback,
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    Widget = require("./widget/ui.widget"),
    Swipeable = require("../events/gesture/swipeable"),
    EmptyTemplate = require("./widget/empty_template"),
    Deferred = require("../core/utils/deferred").Deferred;

var SLIDEOUTVIEW_CLASS = "dx-slideoutview",
    SLIDEOUTVIEW_WRAPPER_CLASS = "dx-slideoutview-wrapper",
    SLIDEOUTVIEW_MENU_CONTENT_CLASS = "dx-slideoutview-menu-content",
    SLIDEOUTVIEW_CONTENT_CLASS = "dx-slideoutview-content",
    SLIDEOUTVIEW_SHIELD_CLASS = "dx-slideoutview-shield",

    INVISIBLE_STATE_CLASS = "dx-state-invisible",

    ANONYMOUS_TEMPLATE_NAME = "content",

    ANIMATION_DURATION = 400;


var animation = {
    moveTo: function($element, position, completeAction) {
        fx.animate($element, {
            type: "slide",
            to: { left: position },
            duration: ANIMATION_DURATION,
            complete: completeAction
        });
    },

    complete: function($element) {
        fx.stop($element, true);
    }
};

/**
* @name dxSlideOutView
* @publicName dxSlideOutView
* @inherits Widget
* @groupName Navigation and Layouting
* @module ui/slide_out_view
* @export default
*/
var SlideOutView = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
            * @name dxSlideOutViewOptions_menuPosition
            * @publicName menuPosition
            * @type string
            * @default "normal"
            * @acceptValues 'normal' | 'inverted'
            */
            menuPosition: "normal",

            /**
            * @name dxSlideOutViewOptions_menuVisible
            * @publicName menuVisible
            * @type boolean
            * @default false
            */
            menuVisible: false,

            /**
            * @name dxSlideOutViewOptions_swipeEnabled
            * @publicName swipeEnabled
            * @type boolean
            * @default true
            */
            swipeEnabled: true,

            /**
            * @name dxSlideOutViewOptions_menuTemplate
            * @publicName menuTemplate
            * @type template
            * @default null
            */
            menuTemplate: "menu",

            /**
            * @name dxSlideOutViewOptions_contentTemplate
            * @publicName contentTemplate
            * @type template
            * @default "content"
            */
            contentTemplate: "content",

            /**
            * @name dxSlideOutViewOptions_contentOffset
            * @publicName contentOffset
            * @hidden
            * @extend_doc
            */
            contentOffset: 45

            /**
            * @name dxSlideOutViewOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxSlideOutViewOptions_accessKey
            * @publicName accessKey
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxSlideOutViewOptions_tabIndex
            * @publicName tabIndex
            * @hidden
            * @extend_doc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: {
                    android: true
                },
                options: {
                    contentOffset: 54
                }
            },
            {
                device: function(device) {
                    return device.platform === "generic" && device.deviceType !== "desktop";
                },
                options: {
                    contentOffset: 56
                }
            },
            {
                device: {
                    win: true,
                    phone: false
                },
                options: {
                    contentOffset: 76
                }
            }
        ]);
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(SLIDEOUTVIEW_CLASS);

        this._deferredAnimate = undefined;
        this._initHideTopOverlayHandler();
    },

    _initHideTopOverlayHandler: function() {
        this._hideMenuHandler = this.hideMenu.bind(this);
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["menu"] = new EmptyTemplate(this);
        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _render: function() {
        this.callBase();

        this._renderShield();
        this._toggleMenuPositionClass();
        this._initSwipeHandlers();
        this._dimensionChanged();
    },

    _renderContentImpl: function() {
        this._renderMarkup();

        var menuTemplate = this._getTemplate(this.option("menuTemplate")),
            contentTemplate = this._getTemplate(this.option("contentTemplate"));

        menuTemplate && menuTemplate.render({
            container: this.menuContent()
        });
        contentTemplate && contentTemplate.render({
            container: this.content(),
            noModel: true
        });
    },

    _renderMarkup: function() {
        var $wrapper = $("<div>").addClass(SLIDEOUTVIEW_WRAPPER_CLASS);
        this._$menu = $("<div>").addClass(SLIDEOUTVIEW_MENU_CONTENT_CLASS);
        this._$container = $("<div>").addClass(SLIDEOUTVIEW_CONTENT_CLASS);

        $wrapper.append(this._$menu);
        $wrapper.append(this._$container);
        this.$element().append($wrapper);

        // NOTE: B251455
        eventsEngine.on(this._$container, "MSPointerDown", noop);
    },

    _renderShield: function() {
        this._$shield = this._$shield || $("<div>").addClass(SLIDEOUTVIEW_SHIELD_CLASS);
        this._$shield.appendTo(this.content());
        eventsEngine.off(this._$shield, clickEvent.name);
        eventsEngine.on(this._$shield, clickEvent.name, this.hideMenu.bind(this));
        this._toggleShieldVisibility(this.option("menuVisible"));
    },

    _initSwipeHandlers: function() {
        this._createComponent(this.content(), Swipeable, {
            disabled: !this.option("swipeEnabled"),
            elastic: false,
            itemSizeFunc: this._getMenuWidth.bind(this),
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this)
        });
    },

    _isRightMenuPosition: function() {
        var invertedPosition = this.option("menuPosition") === "inverted",
            rtl = this.option("rtlEnabled");

        return (rtl && !invertedPosition) || (!rtl && invertedPosition);
    },

    _swipeStartHandler: function(e) {
        animation.complete(this.content());
        var event = e.jQueryEvent,
            menuVisible = this.option("menuVisible"),
            rtl = this._isRightMenuPosition();

        event.maxLeftOffset = +(rtl ? !menuVisible : menuVisible);
        event.maxRightOffset = +(rtl ? menuVisible : !menuVisible);

        this._toggleShieldVisibility(true);
    },

    _swipeUpdateHandler: function(e) {
        var event = e.jQueryEvent,
            offset = this.option("menuVisible") ? event.offset + 1 * this._getRTLSignCorrection() : event.offset;

        offset *= this._getRTLSignCorrection();
        this._renderPosition(offset, false);
    },

    _swipeEndHandler: function(e) {
        var targetOffset = e.jQueryEvent.targetOffset * this._getRTLSignCorrection() + this.option("menuVisible"),
            menuVisible = targetOffset !== 0;

        if(this.option("menuVisible") === menuVisible) {
            this._renderPosition(this.option("menuVisible"), true);
        } else {
            this.option("menuVisible", menuVisible);
        }
    },

    _toggleMenuPositionClass: function() {
        var left = SLIDEOUTVIEW_CLASS + "-left",
            right = SLIDEOUTVIEW_CLASS + "-right",
            menuPosition = this._isRightMenuPosition() ? "right" : "left";

        this._$menu.removeClass(left + " " + right);
        this._$menu.addClass(SLIDEOUTVIEW_CLASS + "-" + menuPosition);
    },

    _renderPosition: function(offset, animate) {
        var pos = this._calculatePixelOffset(offset) * this._getRTLSignCorrection();

        this._toggleHideMenuCallback(offset);

        if(animate) {
            this._toggleShieldVisibility(true);
            animation.moveTo(this.content(), pos, this._animationCompleteHandler.bind(this));
        } else {
            translator.move(this.content(), { left: pos });
        }
    },

    _calculatePixelOffset: function(offset) {
        offset = offset || 0;
        return offset * this._getMenuWidth();
    },

    _getMenuWidth: function() {
        if(!this._menuWidth) {
            var maxMenuWidth = this.$element().width() - this.option("contentOffset");
            this.menuContent().css("maxWidth", maxMenuWidth < 0 ? 0 : maxMenuWidth);
            var currentMenuWidth = this.menuContent().width();

            this._menuWidth = Math.min(currentMenuWidth, maxMenuWidth);
        }

        return this._menuWidth;
    },

    _animationCompleteHandler: function() {
        this._toggleShieldVisibility(this.option("menuVisible"));

        if(this._deferredAnimate) {
            this._deferredAnimate.resolveWith(this);
        }
    },

    _toggleHideMenuCallback: function(subscribe) {
        if(subscribe) {
            hideTopOverlayCallback.add(this._hideMenuHandler);
        } else {
            hideTopOverlayCallback.remove(this._hideMenuHandler);
        }
    },

    _getRTLSignCorrection: function() {
        return this._isRightMenuPosition() ? -1 : 1;
    },

    _dispose: function() {
        animation.complete(this.content());
        this._toggleHideMenuCallback(false);
        this.callBase();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        delete this._menuWidth;
        this._renderPosition(this.option("menuVisible"), false);
    },

    _toggleShieldVisibility: function(visible) {
        this._$shield.toggleClass(INVISIBLE_STATE_CLASS, !visible);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "width":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "contentOffset":
                this._dimensionChanged();
                break;
            case "menuVisible":
                this._renderPosition(args.value, true);
                break;
            case "menuPosition":
                this._renderPosition(this.option("menuVisible"), true);
                this._toggleMenuPositionClass();
                break;
            case "swipeEnabled":
                this._initSwipeHandlers();
                break;
            case "contentTemplate":
            case "menuTemplate":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxSlideOutViewMethods_menuContent
    * @publicName menuContent()
    * @return jQuery
    */
    menuContent: function() {
        return this._$menu;
    },

    /**
    * @name dxSlideOutViewMethods_content
    * @publicName content()
    * @return jQuery
    */
    content: function() {
        return this._$container;
    },

    /**
    * @name dxSlideOutViewMethods_showMenu
    * @publicName showMenu()
    * @return Promise<void>
    */
    showMenu: function() {
        return this.toggleMenuVisibility(true);
    },

    /**
    * @name dxSlideOutViewMethods_hideMenu
    * @publicName hideMenu()
    * @return Promise<void>
    */
    hideMenu: function() {
        return this.toggleMenuVisibility(false);
    },

    /**
    * @name dxSlideOutViewMethods_toggleMenuVisibility
    * @publicName toggleMenuVisibility()
    * @return Promise<void>
    */
    toggleMenuVisibility: function(showing) {
        showing = showing === undefined ? !this.option("menuVisible") : showing;

        this._deferredAnimate = new Deferred();
        this.option("menuVisible", showing);

        return this._deferredAnimate.promise();
    }

    /**
    * @name dxSlideOutViewMethods_registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @extend_doc
    */

    /**
    * @name dxSlideOutViewMethods_focus
    * @publicName focus()
    * @hidden
    * @extend_doc
    */
});

registerComponent("dxSlideOutView", SlideOutView);

module.exports = SlideOutView;

///#DEBUG
module.exports.animation = animation;
///#ENDDEBUG
