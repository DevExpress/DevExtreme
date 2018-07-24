"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    clickEvent = require("../../events/click"),
    translator = require("../../animation/translator"),
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    hideTopOverlayCallback = require("../../mobile/hide_top_overlay").hideCallback,
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    Widget = require("../widget/ui.widget"),
    EmptyTemplate = require("../widget/empty_template"),
    Deferred = require("../../core/utils/deferred").Deferred,
    windowUtils = require("../../core/utils/window"),
    PushStrategy = require("./ui.drawer.strategy.push"),
    PersistentStrategy = require("./ui.drawer.strategy.persistent"),
    TemporaryStrategy = require("./ui.drawer.strategy.temporary"),
    animation = require("./ui.drawer.strategy").animation;


var DRAWER_CLASS = "dx-drawer",
    DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper",
    DRAWER_MENU_CONTENT_CLASS = "dx-drawer-menu-content",
    DRAWER_CONTENT_CLASS = "dx-drawer-content",
    DRAWER_SHADER_CLASS = "dx-drawer-shader",

    INVISIBLE_STATE_CLASS = "dx-state-invisible",

    OPENED_STATE_CLASS = "dx-drawer-opened",

    ANONYMOUS_TEMPLATE_NAME = "content";

/**
* @name dxDrawer
* @inherits Widget
* @module ui/drawer
* @export default
*/
var Drawer = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
            * @name dxDrawerOptions.menuPosition
            * @type Enums.DrawerMenuPosition
            * @default "left"
            */
            menuPosition: "left",

            /**
            * @name dxDrawerOptions.menuVisible
            * @type boolean
            * @default false
            */
            menuVisible: false,

            /**
             * @name dxDrawerOptions.minWidth
             * @type number
             * @default null
             */
            minWidth: null,

            /**
             * @name dxDrawerOptions.maxWidth
             * @type number
             * @default null
             */
            maxWidth: null,

            /**
            * @name dxDrawerOptions.showShader
            * @type boolean
            * @default true
            */
            showShader: true,

            /**
            * @name dxDrawerOptions.menuTemplate
            * @type_function_param1 menuElement:dxElement
            * @type template|function
            * @default null
            */
            menuTemplate: "menu",

            /**
            * @name dxDrawerOptions.contentTemplate
            * @type_function_param1 contentElement:dxElement
            * @type template|function
            * @default "content"
            */
            contentTemplate: "content",

            /**
            * @name dxDrawerOptions.mode
            * @type Enums.DrawerMode
            * @default "push"
            */
            mode: "push",

            /**
            * @name dxDrawerOptions.showMode
            * @type Enums.DrawerMode
            * @default "slide"
            */
            showMode: "slide",

            /**
            * @name dxDrawerOptions.animationEnabled
            * @type boolean
            * @default true
            */
            animationEnabled: true,

            /**
            * @name dxDrawerOptions.animationDuration
            * @type number
            * @default 400
            */
            animationDuration: 400,

            /**
            * @name dxDrawerOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
            * @name dxDrawerOptions.focusStateEnabled
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxDrawerOptions.accessKey
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxDrawerOptions.tabIndex
            * @hidden
            * @inheritdoc
            */
        });
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _init: function() {
        this.callBase();

        this._initStrategy();

        this.$element().addClass(DRAWER_CLASS);

        this._animations = [];
        this._deferredAnimate = undefined;
        this._initHideTopOverlayHandler();
    },

    _initStrategy: function() {
        var mode = this.option("mode"),
            Strategy;

        if(mode === "push") {
            Strategy = PushStrategy;
        }
        if(mode === "persistent") {
            Strategy = PersistentStrategy;
        }
        if(mode === "temporary") {
            Strategy = TemporaryStrategy;
        }

        this._strategy = new Strategy(this);
    },

    _initHideTopOverlayHandler: function() {
        this._hideMenuHandler = this.hideMenu.bind(this);
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["menu"] = new EmptyTemplate(this);
        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _initMarkup: function() {
        this.callBase();

        this._togglePositionClass(this.option("menuVisible"));
        this._renderMarkup();

        this._refreshModeClass();
        this._refreshShowModeClass();

        var menuTemplate = this._getTemplate(this.option("menuTemplate")),
            contentTemplate = this._getTemplate(this.option("contentTemplate"));

        menuTemplate && menuTemplate.render({
            container: this.menuContent()
        });
        contentTemplate && contentTemplate.render({
            container: this.content(),
            noModel: true
        });

        this._initWidth();

        this._renderShader();
        this._toggleMenuPositionClass();
    },

    _render: function() {
        this.callBase();

        this._dimensionChanged();
    },

    _renderMarkup: function() {
        var $wrapper = $("<div>").addClass(DRAWER_WRAPPER_CLASS);
        this._$menu = $("<div>").addClass(DRAWER_MENU_CONTENT_CLASS);
        this._$container = $("<div>").addClass(DRAWER_CONTENT_CLASS);

        $wrapper.append(this._$menu);
        $wrapper.append(this._$container);
        this.$element().append($wrapper);

        // NOTE: B251455
        eventsEngine.on(this._$container, "MSPointerDown", noop);
    },

    _refreshModeClass: function(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("mode"));
    },

    _refreshShowModeClass: function(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("showMode"));
    },

    _renderShader: function() {
        this._$shader = this._$shader || $("<div>").addClass(DRAWER_SHADER_CLASS);
        this._$shader.appendTo(this.content());
        eventsEngine.off(this._$shader, clickEvent.name);
        eventsEngine.on(this._$shader, clickEvent.name, this.hideMenu.bind(this));
        this._toggleShaderVisibility(this.option("menuVisible"));
    },

    _initWidth: function() {
        this._minWidth = this.option("minWidth") || 0;
        this._maxWidth = this.option("maxWidth") || this.getRealMenuWidth();
    },

    getMaxWidth: function() {
        return this._maxWidth;
    },

    getMinWidth: function() {
        return this._minWidth;
    },

    getRealMenuWidth: function() {
        var $menu = this._$menu;
        return $menu.get(0).hasChildNodes() ? $menu.get(0).childNodes[0].getBoundingClientRect().width : $menu.get(0).getBoundingClientRect().width;
    },

    _isRightMenuPosition: function() {
        var invertedPosition = this.option("menuPosition") === "inverted",
            rtl = this.option("rtlEnabled");

        return (rtl && !invertedPosition) || (!rtl && invertedPosition);
    },

    _toggleMenuPositionClass: function() {
        var menuPosition = this.option("menuPosition");

        this._$menu.removeClass(DRAWER_CLASS + "-left");
        this._$menu.removeClass(DRAWER_CLASS + "-right");
        this._$menu.removeClass(DRAWER_CLASS + "-top");

        this._$menu.addClass(DRAWER_CLASS + "-" + menuPosition);
    },

    _renderPosition: function(offset, animate) {
        this._animations = [];

        animate = typeUtils.isDefined(animate) ? animate && this.option("animationEnabled") : this.option("animationEnabled");

        if(!windowUtils.hasWindow()) return;

        var duration = this.option("animationDuration");

        this._toggleHideMenuCallback(offset);

        offset && this._toggleShaderVisibility(offset);

        this._strategy.renderPosition(offset, animate);

        this._renderShaderVisibility(offset, animate, duration);
    },

    _renderShaderVisibility: function(offset, animate, duration) {
        var shaderAnimation = new Deferred();

        this._animations.push(shaderAnimation);

        var fadeConfig = this._getFadeConfig(offset);

        if(animate) {
            animation.fade($(this._$shader), fadeConfig, duration, function() {
                shaderAnimation.resolve();
            });
        } else {
            this._$shader.css("opacity", fadeConfig.to);
        }
    },

    _getFadeConfig: function(offset) {
        if(offset) {
            return {
                to: 0.5,
                from: 0
            };
        } else {
            return {
                to: 0,
                from: 0.5
            };
        }
    },

    _animationCompleteHandler: function() {
        if(this._deferredAnimate) {
            this._deferredAnimate.resolveWith(this);
            this._animations = [];
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
        animation.complete($(this.content()));
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

    _toggleShaderVisibility: function(visible) {
        if(this.option("showShader")) {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, !visible);
        } else {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, true);
        }
    },

    _togglePositionClass: function(menuVisible) {
        this.$element().toggleClass(OPENED_STATE_CLASS, menuVisible);
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
                this._renderPosition(args.value);
                this._togglePositionClass(args.value);
                break;
            case "menuPosition":
                this._toggleMenuPositionClass();
                this._renderPosition(this.option("menuVisible"));
                break;
            case "contentTemplate":
            case "menuTemplate":
                this._invalidate();
                break;
            case "mode":
                this._initStrategy();
                translator.move(this._$menu, { left: 0 });
                this._refreshModeClass(args.previousValue);
                this._renderPosition(this.option("menuVisible"));

                // NOTE: temporary fix
                this.repaint();
                break;
            case "minWidth":
            case "maxWidth":
                this._initWidth();
                translator.move(this._$menu, { left: 0 });
                this._renderPosition(this.option("menuVisible"));

                // NOTE: temporary fix
                this.repaint();
                break;
            case "showMode":
                this._refreshShowModeClass(args.previousValue);

                // NOTE: temporary fix
                this.repaint();
                break;
            case "showShader":
                this._refreshModeClass(args.previousValue);
                break;
            case "animationEnabled":
            case "animationDuration":
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxDrawerMethods.menuContent
    * @publicName menuContent()
    * @return dxElement
    */
    menuContent: function() {
        return getPublicElement(this._$menu);
    },

    /**
    * @name dxDrawerMethods.content
    * @publicName content()
    * @return dxElement
    */
    content: function() {
        return getPublicElement(this._$container);
    },

    /**
    * @name dxDrawerMethods.showMenu
    * @publicName showMenu()
    * @return Promise<void>
    */
    showMenu: function() {
        return this.toggleMenuVisibility(true);
    },

    /**
    * @name dxDrawerMethods.hideMenu
    * @publicName hideMenu()
    * @return Promise<void>
    */
    hideMenu: function() {
        return this.toggleMenuVisibility(false);
    },

    /**
    * @name dxDrawerMethods.toggleMenuVisibility
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
    * @name dxDrawerMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @inheritdoc
    */

    /**
    * @name dxDrawerMethods.focus
    * @publicName focus()
    * @hidden
    * @inheritdoc
    */
});

registerComponent("dxDrawer", Drawer);

module.exports = Drawer;
module.exports.animation = animation;

