import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import typeUtils from "../../core/utils/type";
import { getPublicElement } from "../../core/utils/dom";
import { hideCallback } from "../../mobile/hide_top_overlay";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import Widget from "../widget/ui.widget";
import EmptyTemplate from "../widget/empty_template";
import windowUtils from "../../core/utils/window";
import PushStrategy from "./ui.drawer.rendering.strategy.push";
import ShrinkStrategy from "./ui.drawer.rendering.strategy.shrink";
import OverlapStrategy from "./ui.drawer.rendering.strategy.overlap";
import { animation } from "./ui.drawer.rendering.strategy";
import pointerEvents from "../../events/pointer";

const DRAWER_CLASS = "dx-drawer";
const DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper";
const DRAWER_PANEL_CONTENT_CLASS = "dx-drawer-panel-content";
const DRAWER_CONTENT_CLASS = "dx-drawer-content";
const DRAWER_SHADER_CLASS = "dx-drawer-shader";
const INVISIBLE_STATE_CLASS = "dx-state-invisible";
const OPENED_STATE_CLASS = "dx-drawer-opened";
const ANONYMOUS_TEMPLATE_NAME = "content";


const Drawer = Widget.inherit({

    _getDefaultOptions() {
        return extend(this.callBase(), {

            /**
            * @name dxDrawerOptions.position
            * @type Enums.DrawerPosition
            * @default "left"
            */
            position: "left",

            /**
            * @name dxDrawerOptions.opened
            * @type boolean
            * @default false
            */
            opened: false,

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
            * @name dxDrawerOptions.shading
            * @type boolean
            * @default true
            */
            shading: true,

            /**
            * @name dxDrawerOptions.template
            * @type_function_param1 Element:dxElement
            * @type template|function
            * @default null
            */
            template: "panel",

            /**
            * @name dxDrawerOptions.openedStateMode
            * @type Enums.DrawerOpenedStateMode
            * @default "push"
            */
            openedStateMode: "push",

            /**
            * @name dxDrawerOptions.revealMode
            * @type Enums.DrawerRevealMode
            * @default "slide"
            */
            revealMode: "slide",

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
            * @name dxDrawerOptions.closeOnOutsideClick
            * @type boolean|function
            * @default false
            * @type_function_param1 event:event
            * @type_function_return Boolean
            */
            closeOnOutsideClick: false,

            /**
            * @name dxDrawerOptions.contentTemplate
            * @type_function_param1 contentElement:dxElement
            * @type template|function
            * @hidden
            * @default "content"
            */
            contentTemplate: "content",

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
        this._animationPromise = undefined;

        this._initHideTopOverlayHandler();
    },

    _initStrategy() {
        const mode = this.option("openedStateMode");
        let Strategy = this._getDefaultStrategy();

        if(mode === "push") {
            Strategy = PushStrategy;
        }
        if(mode === "shrink") {
            Strategy = ShrinkStrategy;
        }
        if(mode === "overlap") {
            Strategy = OverlapStrategy;
        }

        this._strategy = new Strategy(this);
    },

    _getDefaultStrategy() {
        return PushStrategy;
    },

    _initHideTopOverlayHandler() {
        this._hideMenuHandler = this.hide.bind(this);
    },

    _initTemplates() {
        this.callBase();

        this._defaultTemplates["panel"] = new EmptyTemplate(this);
        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _initCloseOnOutsideClickHandler() {
        eventsEngine.off(this._$contentWrapper, pointerEvents.down);
        eventsEngine.on(this._$contentWrapper, pointerEvents.down, this._pointerDownHandler.bind(this));
    },

    _pointerDownHandler(e) {
        this._strategy._stopAnimations();

        var closeOnOutsideClick = this.option("closeOnOutsideClick");

        if(typeUtils.isFunction(closeOnOutsideClick)) {
            closeOnOutsideClick = closeOnOutsideClick(e);
        }

        if(closeOnOutsideClick && this.option("opened")) {
            if(this.option("shading")) {
                e.preventDefault();
            }

            this.hide();
        }
    },

    _initMarkup() {
        this.callBase();

        this._toggleVisibleClass(this.option("opened"));
        this._renderMarkup();

        this._refreshModeClass();
        this._refreshRevealModeClass();

        const panelTemplate = this._getTemplate(this.option("template"));

        panelTemplate && panelTemplate.render({
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

        this._renderShader();
        this._initCloseOnOutsideClickHandler();
        this._togglePositionClass();
    },

    _render() {
        this._initWidth();

        this.callBase();

        this._dimensionChanged();
    },

    _renderMarkup() {
        this._$wrapper = $("<div>").addClass(DRAWER_WRAPPER_CLASS);
        this._$panel = $("<div>").addClass(DRAWER_PANEL_CONTENT_CLASS);
        this._$contentWrapper = $("<div>").addClass(DRAWER_CONTENT_CLASS);

        this._$wrapper.append(this._$panel);
        this._$wrapper.append(this._$contentWrapper);
        this.$element().append(this._$wrapper);
    },

    _refreshModeClass(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("openedStateMode"));
    },

    _refreshRevealModeClass(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("revealMode"));
    },

    _renderShader() {
        this._$shader = this._$shader || $("<div>").addClass(DRAWER_SHADER_CLASS);
        this._$shader.appendTo(this.viewContent());

        this._toggleShaderVisibility(this.option("opened"));
    },

    _initWidth() {
        this._minWidth = this.option("minWidth") || 0;
        this._maxWidth = this.option("maxWidth") || this.getRealPanelWidth();
    },

    getMaxWidth() {
        return this._maxWidth;
    },

    getMinWidth() {
        return this._minWidth;
    },

    getRealPanelWidth() {
        if(windowUtils.hasWindow()) {
            const $panel = this._$panel;
            return $panel.get(0).hasChildNodes() ? $panel.get(0).childNodes[0].getBoundingClientRect().width : $panel.get(0).getBoundingClientRect().width;
        } else {
            return 0;
        }
    },

    _isRightPosition() {
        const invertedPosition = this.option("position") === "right";
        const rtl = this.option("rtlEnabled");

        return (rtl && !invertedPosition) || (!rtl && invertedPosition);
    },

    _togglePositionClass() {
        const position = this.option("position");

        this._$panel.removeClass(DRAWER_CLASS + "-left");
        this._$panel.removeClass(DRAWER_CLASS + "-right");
        this._$panel.removeClass(DRAWER_CLASS + "-top");

        this._$panel.addClass(DRAWER_CLASS + "-" + position);

        if(position === "right") {
            this._reverseElements();
        }
    },

    _reverseElements() {
        this._$wrapper.prepend(this._$contentWrapper);
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
        if(this._animationPromise) {
            this._toggleResolve();
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
        return this._isRightPosition() ? -1 : 1;
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
        delete this._panelWidth;
        this._renderPosition(this.option("opened"), false);
    },

    _toggleShaderVisibility(visible) {
        if(this.option("shading")) {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, !visible);
        } else {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, true);
        }
    },

    _toggleVisibleClass(opened) {
        this.$element().toggleClass(OPENED_STATE_CLASS, opened);
    },


    _optionChanged(args) {
        switch(args.name) {
            case "width":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "opened":
                this._renderPosition(args.value);
                this._toggleVisibleClass(args.value);
                break;
            case "position":
                this._togglePositionClass();
                this._renderPosition(this.option("opened"));
                break;
            case "contentTemplate":
            case "template":
                this._invalidate();
                break;
            case "openedStateMode":
                this._initStrategy();
                this._$panel.css("left", 0);
                this._refreshModeClass(args.previousValue);
                this._renderPosition(this.option("opened"));

                // NOTE: temporary fix
                this.repaint();
                break;
            case "minWidth":
            case "maxWidth":
                this._initWidth();
                this._$panel.css("left", 0);
                this._renderPosition(this.option("opened"));

                // NOTE: temporary fix
                this.repaint();
                break;
            case "revealMode":
                this._refreshRevealModeClass(args.previousValue);

                // NOTE: temporary fix
                this.repaint();
                break;
            case "shading":
                this._refreshModeClass(args.previousValue);
                break;
            case "animationEnabled":
            case "animationDuration":
            case "closeOnOutsideClick":
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
        return getPublicElement(this._$panel);
    },

    /**
    * @name dxDrawerMethods.viewContent
    * @publicName viewContent()
    * @return dxElement
    * @hidden
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
        showing = showing === undefined ? !this.option("opened") : showing;

        this._animationPromise = new Promise((resolve) => {
            this._toggleResolve = resolve;
        });
        this.option("opened", showing);

        return this._animationPromise;
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


