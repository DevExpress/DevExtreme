import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import { addNamespace } from "../../events/utils";
import clickEvent from "../../events/click";
import { getImageContainer } from "../../core/utils/icon";
import Overlay from "../overlay";
import inkRipple from "../widget/utils.ink_ripple";
import themes from "../themes";

const FAB_CLASS = "dx-fa-button";
const FAB_ICON_CLASS = "dx-fa-button-icon";
const OVERLAY_CONTENT_SELECTOR = ".dx-overlay-content";

const SpeedDialItem = Overlay.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            shading: false,
            useInkRipple: false,
            callOverlayRenderShading: false
        });
    },

    _defaultOptionsRules() {
        return this.callBase().concat([
            {
                device() {
                    return themes.isMaterial();
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    },

    _render() {
        this.$element().addClass(FAB_CLASS);
        this.callBase();
        this._renderIcon();
        this.option("useInkRipple") && this._renderInkRipple();
        this._renderClick();
    },

    _renderButtonIcon($element, icon, iconClass) {
        !!$element && $element.remove();

        $element = $("<div>").addClass(iconClass);
        const $iconElement = getImageContainer(icon);

        $element
            .append($iconElement)
            .appendTo(this.$content());

        return $element;
    },

    _renderIcon() {
        this._$icon = this._renderButtonIcon(
            this._$icon,
            this._options.icon,
            FAB_ICON_CLASS);
    },

    _renderShading() {
        if(this._options.callOverlayRenderShading) {
            this.callBase();
        }
    },

    _fixWrapperPosition() {
        const $wrapper = this._$wrapper;
        const $container = this._getContainer();

        $wrapper.css("position", this._isWindow($container) ? "fixed" : "absolute");
    },

    _setClickAction() {
        const eventName = addNamespace(clickEvent.name, this.NAME);
        const overlayContent = this.$element().find(OVERLAY_CONTENT_SELECTOR);

        eventsEngine.off(overlayContent, eventName);
        eventsEngine.on(overlayContent, eventName, (e) => {
            this._clickAction({ event: e, element: this.$element() });
        });
    },

    _defaultActionArgs() {
        return {
            component: this.option('actionComponent')
        };
    },

    _renderClick() {
        this._clickAction = this._createActionByOption("onClick");
        this._setClickAction();
    },

    _renderInkRipple() {
        this._inkRipple = inkRipple.render();
    },

    _toggleActiveState($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: this.$content(),
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _optionChanged(args) {
        switch(args.name) {
            case "icon":
                this._renderIcon();
                break;
            case "onClick":
                this._renderClick();
                break;
            case "useInkRipple":
                this._render();
                break;
            default:
                this.callBase(args);
        }
    }
});

module.exports = SpeedDialItem;
