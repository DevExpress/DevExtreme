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

class SpeedDialItem extends Overlay {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            shading: false,
            useInkRipple: false,
            callOverlayRenderShading: false
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device() {
                    return themes.isMaterial();
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    }

    _render() {
        this.$element().addClass(FAB_CLASS);
        super._render();
        this._renderIcon();
        this.option("useInkRipple") && this._renderInkRipple();
        this._renderClick();
    }

    _renderButtonIcon($element, icon, iconClass) {
        !!$element && $element.remove();

        $element = $("<div>").addClass(iconClass);
        const $iconElement = getImageContainer(icon);

        $element
            .append($iconElement)
            .appendTo(this.$content());

        return $element;
    }

    _renderIcon() {
        this._$icon = this._renderButtonIcon(
            this._$icon,
            this._options.icon,
            FAB_ICON_CLASS);
    }

    _renderShading() {
        if(this._options.callOverlayRenderShading) {
            super._renderShading();
        }
    }

    _getActionComponent() {
        return this.option("actionComponent") || this.option("actions")[0];
    }

    _initContentReadyAction() {
        this._contentReadyAction = this._getActionComponent()._createActionByOption("onContentReady", {
            excludeValidators: ["disabled", "readOnly"]
        }, true);
    }

    _fireContentReadyAction() {
        this._contentReadyAction({ actionElement: this.$element() });
    }

    _fixWrapperPosition() {
        const $wrapper = this._$wrapper;
        const $container = this._getContainer();

        $wrapper.css("position", this._isWindow($container) ? "fixed" : "absolute");
    }

    _setClickAction() {
        const eventName = addNamespace(clickEvent.name, this.NAME);
        const overlayContent = this.$element().find(OVERLAY_CONTENT_SELECTOR);

        eventsEngine.off(overlayContent, eventName);
        eventsEngine.on(overlayContent, eventName, (e) => {
            const clickActionArgs = {
                event: e,
                actionElement: this.element(),
                element: this._getActionComponent().$element()
            };

            this._clickAction(clickActionArgs);
        });
    }

    _defaultActionArgs() {
        return {
            component: this._getActionComponent()
        };
    }

    _renderClick() {
        this._clickAction = this._getActionComponent()._createActionByOption("onClick");
        this._setClickAction();
    }

    _renderInkRipple() {
        this._inkRipple = inkRipple.render();
    }

    _toggleActiveState($element, value, e) {
        super._toggleActiveState.apply(this, arguments);

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
    }

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
                super._optionChanged(args);
        }
    }
}

module.exports = SpeedDialItem;
