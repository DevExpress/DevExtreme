import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import typeUtils from "../../core/utils/type";
import { getPublicElement } from "../../core/utils/dom";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import Widget from "../widget/ui.widget";
import { EmptyTemplate } from "../../core/templates/empty_template";
import { hasWindow } from "../../core/utils/window";
import PushStrategy from "./ui.drawer.rendering.strategy.push";
import ShrinkStrategy from "./ui.drawer.rendering.strategy.shrink";
import OverlapStrategy from "./ui.drawer.rendering.strategy.overlap";
import { animation } from "./ui.drawer.rendering.strategy";
import clickEvent from "../../events/click";
import fx from "../../animation/fx";
import { Deferred } from "../../core/utils/deferred";
import { triggerResizeEvent } from "../../core/utils/dom";

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
            * @fires dxDrawerOptions.onOptionChanged
            * @default false
            */
            opened: false,

            /**
             * @name dxDrawerOptions.minSize
             * @type number
             * @default null
             */
            minSize: null,

            /**
             * @name dxDrawerOptions.maxSize
             * @type number
             * @default null
             */
            maxSize: null,

            /**
            * @name dxDrawerOptions.shading
            * @type boolean
            * @default false
            */
            shading: false,

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
            * @default "shrink"
            */
            openedStateMode: "shrink",

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
            * @name dxDrawerOptions.target
            * @type string|Node|jQuery
            */
            target: undefined,

            /**
            * @name dxDrawerOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
            * @name dxDrawerOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxDrawerOptions.accessKey
            * @hidden
            */

            /**
            * @name dxDrawerOptions.tabIndex
            * @hidden
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
        this._whenPanelRendered = undefined;
        this._whenPanelRefreshed = undefined;

        this._initHideTopOverlayHandler();

        this._initContentMarkup();
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

    _initContentMarkup() {
        this._$wrapper = $("<div>").addClass(DRAWER_WRAPPER_CLASS);

        this._$contentWrapper = $("<div>").addClass(DRAWER_CONTENT_CLASS);
        this._$wrapper.append(this._$contentWrapper);
        this.$element().append(this._$wrapper);
    },

    _getDefaultStrategy() {
        return PushStrategy;
    },

    _initHideTopOverlayHandler() {
        this._hideMenuHandler = this.hide.bind(this);
    },

    _initTemplates() {
        this.callBase();

        this._templateManager.addDefaultTemplate({
            ["panel"]: new EmptyTemplate(),
            ["content"]: new EmptyTemplate()
        });
    },

    _initCloseOnOutsideClickHandler() {
        eventsEngine.off(this._$contentWrapper, clickEvent.name);
        eventsEngine.on(this._$contentWrapper, clickEvent.name, this._outsideClickHandler.bind(this));
    },

    _outsideClickHandler(e) {
        var closeOnOutsideClick = this.option("closeOnOutsideClick");

        if(typeUtils.isFunction(closeOnOutsideClick)) {
            closeOnOutsideClick = closeOnOutsideClick(e);
        }

        if(closeOnOutsideClick && this.option("opened")) {
            this.stopAnimations();

            if(this.option("shading")) {
                e.preventDefault();
            }

            this.hide();
            this._toggleShaderVisibility(false);
        }
    },

    _initMarkup() {
        this.callBase();

        this._toggleVisibleClass(this.option("opened"));
        this._renderPanelElement();

        this._refreshModeClass();
        this._refreshRevealModeClass();
        this._renderShader();

        this._whenPanelRendered = new Deferred();
        this._strategy.renderPanel(this._getTemplate(this.option("template")), this._whenPanelRendered);

        const contentTemplateOption = this.option("contentTemplate"),
            contentTemplate = this._getTemplate(contentTemplateOption),
            transclude = this._getAnonymousTemplateName() === contentTemplateOption;

        contentTemplate && contentTemplate.render({
            container: this.viewContent(),
            noModel: true,
            transclude
        });

        this._initCloseOnOutsideClickHandler();
        this._refreshPositionClass();
    },

    _render() {
        this._initSize();

        this.callBase();

        this._whenPanelRendered.always(() => {
            this._initSize();
            this._strategy.setPanelSize(this.option("revealMode") === "slide" || !this.isHorizontalDirection());

            this._renderPosition(this.option("opened"), false);
        });
    },

    _renderPanelElement() {
        this._$panel = $("<div>").addClass(DRAWER_PANEL_CONTENT_CLASS);
        this._$wrapper.append(this._$panel);
    },

    _refreshModeClass(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("openedStateMode"));
    },

    _refreshPositionClass(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        const position = this.getDrawerPosition();

        this.$element().addClass(DRAWER_CLASS + "-" + position);

        this._orderContent(position);
    },

    _orderContent(position) {
        if(this._strategy.needOrderContent(position, this.option("rtlEnabled"))) {
            this._$wrapper.prepend(this._$contentWrapper);
        } else {
            this._$wrapper.prepend(this._$panel);
        }
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

    _initSize() {
        const realPanelSize = this.isHorizontalDirection() ? this.getRealPanelWidth() : this.getRealPanelHeight();

        this._maxSize = this.option("maxSize") || realPanelSize;
        this._minSize = this.option("minSize") || 0;
    },

    getDrawerPosition() {
        const position = this.option("position");
        const rtl = this.option("rtlEnabled");

        if(position === "before") {
            return rtl ? "right" : "left";
        }

        if(position === "after") {
            return rtl ? "left" : "right";
        }

        return position;
    },

    getOverlayTarget() {
        return this.option("target") || this._$wrapper;
    },

    getOverlay() {
        return this._overlay;
    },

    getMaxSize() {
        return this._maxSize;
    },

    getMinSize() {
        return this._minSize;
    },

    getRealPanelWidth() {
        if(hasWindow()) {
            if(typeUtils.isDefined(this.option("templateSize"))) {
                return this.option("templateSize"); // number is expected
            } else {
                return this.getElementWidth(this._strategy.getPanelContent());
            }
        } else {
            return 0;
        }
    },

    getElementWidth($element) {
        var $children = $element.children();

        return $children.length ? $children.eq(0).get(0).getBoundingClientRect().width : $element.get(0).getBoundingClientRect().width;
    },

    getRealPanelHeight() {
        if(hasWindow()) {
            if(typeUtils.isDefined(this.option("templateSize"))) {
                return this.option("templateSize"); // number is expected
            } else {
                return this.getElementHeight(this._strategy.getPanelContent());
            }
        } else {
            return 0;
        }
    },

    getElementHeight($element) {
        var $children = $element.children();

        return $children.length ? $children.eq(0).get(0).getBoundingClientRect().height : $element.get(0).getBoundingClientRect().height;
    },

    isHorizontalDirection() {
        const position = this.getDrawerPosition();

        return position === "left" || position === "right";
    },

    stopAnimations(jumpToEnd) {
        fx.stop(this._$shader, jumpToEnd);
        fx.stop($(this.content()), jumpToEnd);
        fx.stop($(this.viewContent()), jumpToEnd);

        const overlay = this.getOverlay();
        overlay && fx.stop($(overlay.$content()), jumpToEnd);
    },

    setZIndex(zIndex) {
        this._$shader.css("zIndex", zIndex - 1);
        this._$panel.css("zIndex", zIndex);
    },

    resizeContent() {
        triggerResizeEvent(this.viewContent());
    },

    _isInvertedPosition() {
        const position = this.getDrawerPosition();

        return position === "right" || position === "bottom";
    },

    _renderPosition(offset, animate, jumpToEnd) {
        this.stopAnimations(jumpToEnd);

        this._animations = [];

        animate = typeUtils.isDefined(animate) ? animate && this.option("animationEnabled") : this.option("animationEnabled");

        if(!hasWindow()) return;

        const duration = this.option("animationDuration");

        offset && this._toggleShaderVisibility(offset);

        this._strategy.renderPosition(offset, animate);

        this._strategy.renderShaderVisibility(offset, animate, duration);
    },

    _animationCompleteHandler() {
        this.resizeContent();

        if(this._animationPromise) {
            this._animationPromise.resolve();
            this._animations = [];
        }
    },

    _getPositionCorrection() {
        return this._isInvertedPosition() ? -1 : 1;
    },

    _dispose() {
        animation.complete($(this.viewContent()));
        this.callBase();
    },

    _visibilityChanged(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged() {
        this._initSize();
        this._strategy.setPanelSize(this.option("revealMode") === "slide");
    },

    _toggleShaderVisibility(visible) {
        if(this.option("shading")) {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, !visible);
            this._$shader.css("visibility", visible ? "visible" : "hidden");
        } else {
            this._$shader.toggleClass(INVISIBLE_STATE_CLASS, true);
        }
    },

    _toggleVisibleClass(opened) {
        this.$element().toggleClass(OPENED_STATE_CLASS, opened);
    },

    _refreshPanel() {
        this._setInitialViewContentPosition();
        this._cleanPanel();

        this._renderPanelElement();
        this._orderContent(this.getDrawerPosition());

        this._whenPanelRefreshed = new Deferred();
        this._strategy.renderPanel(this._getTemplate(this.option("template")), this._whenPanelRefreshed);

        hasWindow() && this._whenPanelRefreshed.always(() => {
            this._strategy.setPanelSize(this.option("revealMode") === "slide");
            this._renderPosition(this.option("opened"), false, true);
        });
    },

    _setInitialViewContentPosition() {
        $(this.viewContent()).css("paddingLeft", 0);
        $(this.viewContent()).css("left", 0);
        $(this.viewContent()).css("transform", "translate(0px, 0px)");
    },

    _clean() {
        this._cleanFocusState();

        this._cleanPanel();
    },

    _cleanPanel() {
        if(this._$panel) {
            this._$panel.remove();
        }

        if(this._overlay) {
            this._overlay.dispose();
            delete this._overlay;
            delete this._$panel;
        }
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
                this._refreshPositionClass(args.previousValue);
                this._invalidate();
                break;
            case "contentTemplate":
            case "template":
                this._invalidate();
                break;
            case "openedStateMode":
            case "target":
                this._initStrategy();
                this._refreshModeClass(args.previousValue);

                this._refreshPanel();
                break;
            case "minSize":
            case "maxSize":
                this._initSize();
                this._renderPosition(this.option("opened"), false);
                break;
            case "revealMode":
                this._refreshRevealModeClass(args.previousValue);

                this._refreshPanel();
                break;
            case "shading":
                this._toggleShaderVisibility(this.option("opened"));
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

        this._animationPromise = new Deferred();
        this.option("opened", showing);

        return this._animationPromise.promise();
    }

    /**
    * @name dxDrawerMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxDrawerMethods.focus
    * @publicName focus()
    * @hidden
    */
});

registerComponent("dxDrawer", Drawer);

module.exports = Drawer;


