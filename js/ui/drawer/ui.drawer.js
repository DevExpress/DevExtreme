import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import typeUtils from "../../core/utils/type";
import clickEvent from "../../events/click";
import translator from "../../animation/translator";
import { getPublicElement } from "../../core/utils/dom";
import { hideCallback } from "../../mobile/hide_top_overlay";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import Widget from "../widget/ui.widget";
import EmptyTemplate from "../widget/empty_template";
import { Deferred } from "../../core/utils/deferred";
import windowUtils from "../../core/utils/window";
import PushStrategy from "./ui.drawer.rendering.strategy.push";
import PersistentStrategy from "./ui.drawer.rendering.strategy.persistent";
import TemporaryStrategy from "./ui.drawer.rendering.strategy.temporary";
import { animation } from "./ui.drawer.rendering.strategy";

const DRAWER_CLASS = "dx-drawer";
const DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper";
const DRAWER_MENU_CONTENT_CLASS = "dx-drawer-menu-content";
const DRAWER_CONTENT_CLASS = "dx-drawer-content";
const DRAWER_SHADER_CLASS = "dx-drawer-shader";
const INVISIBLE_STATE_CLASS = "dx-state-invisible";
const OPENED_STATE_CLASS = "dx-drawer-opened";
const ANONYMOUS_TEMPLATE_NAME = "content";


const Drawer = Widget.inherit({

    _getDefaultOptions() {
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

    _getAnonymousTemplateName() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _init() {
        this.callBase();

        this._initStrategy();

        this.$element().addClass(DRAWER_CLASS);

        this._animations = [];
        this._deferredAnimate = undefined;
        this._initHideTopOverlayHandler();
    },

    _initStrategy() {
        const mode = this.option("mode");
        let Strategy;

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

    _initHideTopOverlayHandler() {
        this._hideMenuHandler = this.hide.bind(this);
    },

    _initTemplates() {
        this.callBase();

        this._defaultTemplates["menu"] = new EmptyTemplate(this);
        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _initMarkup() {
        this.callBase();

        this._togglePositionClass(this.option("menuVisible"));
        this._renderMarkup();

        this._refreshModeClass();
        this._refreshShowModeClass();

        const menuTemplate = this._getTemplate(this.option("menuTemplate"));

        menuTemplate && menuTemplate.render({
            container: this.content()
        });

        const contentTemplateOption = this.option("contentTemplate"),
            contentTemplate = this._getTemplate(contentTemplateOption),
            transclude = this._getAnonymousTemplateName() === contentTemplateOption;

        contentTemplate && contentTemplate.render({
            container: this.viewContent(),
            noModel: true,
            transclude
        });

        this._initWidth();

        this._renderShader();
        this._toggleMenuPositionClass();
    },

    _render() {
        this.callBase();

        this._dimensionChanged();
    },

    _renderMarkup() {
        const $wrapper = $("<div>").addClass(DRAWER_WRAPPER_CLASS);
        this._$menu = $("<div>").addClass(DRAWER_MENU_CONTENT_CLASS);
        this._$contentWrapper = $("<div>").addClass(DRAWER_CONTENT_CLASS);

        $wrapper.append(this._$menu);
        $wrapper.append(this._$contentWrapper);
        this.$element().append($wrapper);
    },

    _refreshModeClass(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("mode"));
    },

    _refreshShowModeClass(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("showMode"));
    },

    _renderShader() {
        this._$shader = this._$shader || $("<div>").addClass(DRAWER_SHADER_CLASS);
        this._$shader.appendTo(this.viewContent());
        eventsEngine.off(this._$shader, clickEvent.name);
        eventsEngine.on(this._$shader, clickEvent.name, this.hide.bind(this));
        this._toggleShaderVisibility(this.option("menuVisible"));
    },

    _initWidth() {
        this._minWidth = this.option("minWidth") || 0;
        this._maxWidth = this.option("maxWidth") || this.getRealMenuWidth();
    },

    getMaxWidth() {
        return this._maxWidth;
    },

    getMinWidth() {
        return this._minWidth;
    },

    getRealMenuWidth() {
        const $menu = this._$menu;
        return $menu.get(0).hasChildNodes() ? $menu.get(0).childNodes[0].getBoundingClientRect().width : $menu.get(0).getBoundingClientRect().width;
    },

    _isRightMenuPosition() {
        const invertedPosition = this.option("menuPosition") === "right";
        const rtl = this.option("rtlEnabled");

        return (rtl && !invertedPosition) || (!rtl && invertedPosition);
    },

    _toggleMenuPositionClass() {
        const menuPosition = this.option("menuPosition");

        this._$menu.removeClass(DRAWER_CLASS + "-left");
        this._$menu.removeClass(DRAWER_CLASS + "-right");
        this._$menu.removeClass(DRAWER_CLASS + "-top");

        this._$menu.addClass(DRAWER_CLASS + "-" + menuPosition);
    },

    _renderPosition(offset, animate) {
        this._animations = [];

        animate = typeUtils.isDefined(animate) ? animate && this.option("animationEnabled") : this.option("animationEnabled");

        if(!windowUtils.hasWindow()) return;

        const duration = this.option("animationDuration");

        this._toggleHideMenuCallback(offset);

        offset && this._toggleShaderVisibility(offset);

        this._strategy.renderPosition(offset, animate);

        this._strategy.renderShaderVisibility(offset, animate, duration);
    },

    _animationCompleteHandler() {
        if(this._deferredAnimate) {
            this._deferredAnimate.resolveWith(this);
            this._animations = [];
        }
    },

    _toggleHideMenuCallback(subscribe) {
        if(subscribe) {
            hideCallback.add(this._hideMenuHandler);
        } else {
            hideCallback.remove(this._hideMenuHandler);
        }
    },

    _getPositionCorrection() {
        return this._isRightMenuPosition() ? -1 : 1;
    },

    _dispose() {
        animation.complete($(this.viewContent()));
        this._toggleHideMenuCallback(false);
        this.callBase();
    },

    _visibilityChanged(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged() {
        delete this._menuWidth;
        this._renderPosition(this.option("menuVisible"), false);
    },

    _toggleShaderVisibility(visible) {
        if(this.option("showShader")) {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, !visible);
        } else {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, true);
        }
    },

    _togglePositionClass(menuVisible) {
        this.$element().toggleClass(OPENED_STATE_CLASS, menuVisible);
    },


    _optionChanged(args) {
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
    * @name dxDrawerMethods.content
    * @publicName content()
    * @return dxElement
    */
    content() {
        return getPublicElement(this._$menu);
    },

    /**
    * @name dxDrawerMethods.viewContent
    * @publicName viewContent()
    * @return dxElement
    */
    viewContent() {
        return getPublicElement(this._$contentWrapper);
    },

    /**
    * @name dxDrawerMethods.show
    * @publicName show()
    * @return Promise<void>
    */
    show() {
        return this.toggle(true);
    },

    /**
    * @name dxDrawerMethods.hide
    * @publicName hide()
    * @return Promise<void>
    */
    hide() {
        return this.toggle(false);
    },

    /**
    * @name dxDrawerMethods.toggle
    * @publicName toggle()
    * @return Promise<void>
    */
    toggle(showing) {
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


