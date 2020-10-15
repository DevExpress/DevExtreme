import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import eventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils/index';
import { name as clickEventName } from '../../events/click';
import { getImageContainer } from '../../core/utils/icon';
import Overlay from '../overlay';
import { render } from '../widget/utils.ink_ripple';
import { isMaterial } from '../themes';

const FAB_CLASS = 'dx-fa-button';
const FAB_ICON_CLASS = 'dx-fa-button-icon';
const FAB_LABEL_CLASS = 'dx-fa-button-label';
const FAB_LABEL_WRAPPER_CLASS = 'dx-fa-button-label-wrapper';
const FAB_CONTENT_REVERSE_CLASS = 'dx-fa-button-content-reverse';
const OVERLAY_CONTENT_SELECTOR = '.dx-overlay-content';

class SpeedDialItem extends Overlay {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            shading: false,
            useInkRipple: false,
            callOverlayRenderShading: false,
            width: 'auto',
            zIndex: 1500
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device() {
                    return isMaterial();
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    }

    _render() {
        this.$element().addClass(FAB_CLASS);
        this._renderIcon();
        this._renderLabel();
        super._render();
        this.option('useInkRipple') && this._renderInkRipple();
        this._renderClick();
    }

    _renderLabel() {
        !!this._$label && this._$label.remove();

        const labelText = this.option('label');

        if(!labelText) {
            this._$label = null;
            return;
        }

        const $element = $('<div>').addClass(FAB_LABEL_CLASS);
        const $wrapper = $('<div>').addClass(FAB_LABEL_WRAPPER_CLASS);

        this._$label = $wrapper
            .prependTo(this.$content())
            .append($element.text(labelText));

        this.$content().toggleClass(FAB_CONTENT_REVERSE_CLASS, this._isPositionLeft(this.option('parentPosition')));
    }

    _isPositionLeft(position) {
        const currentLocation = position ?
            (position.at ?
                (position.at.x ? position.at.x : position.at) :
                (typeof position === 'string' ? position : '')) :
            '';

        return currentLocation.split(' ')[0] === 'left';
    }

    _renderButtonIcon($element, icon, iconClass) {
        !!$element && $element.remove();

        $element = $('<div>').addClass(iconClass);
        const $iconElement = getImageContainer(icon);

        $element
            .append($iconElement)
            .appendTo(this.$content());

        return $element;
    }

    _renderIcon() {
        this._$icon = this._renderButtonIcon(
            this._$icon,
            this._options.silent('icon'),
            FAB_ICON_CLASS);
    }

    _renderWrapper() {
        if(this._options.silent('callOverlayRenderShading')) {
            super._renderWrapper();
        }
    }

    _getVisibleActions(actions) {
        const currentActions = actions || this.option('actions') || [];

        return currentActions.filter((action) => action.option('visible'));
    }

    _getActionComponent() {
        if(this._getVisibleActions().length === 1) {
            return this._getVisibleActions()[0];
        } else {
            return this.option('actionComponent') || this.option('actions')[0];
        }
    }

    _initContentReadyAction() {
        this._contentReadyAction = this._getActionComponent()._createActionByOption('onContentReady', {
            excludeValidators: ['disabled', 'readOnly']
        }, true);
    }

    _fireContentReadyAction() {
        this._contentReadyAction({ actionElement: this.$element() });
    }

    _updateZIndexStackPosition() {
        const zIndex = this.option('zIndex');

        this._$wrapper.css('zIndex', zIndex);
        this._$content.css('zIndex', zIndex);
    }

    _fixWrapperPosition() {
        const $wrapper = this._$wrapper;
        const $container = this._getContainer();

        $wrapper.css('position', this._isWindow($container) ? 'fixed' : 'absolute');
    }

    _setClickAction() {
        const eventName = addNamespace(clickEventName, this.NAME);
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
        this._clickAction = this._getActionComponent()._createActionByOption('onClick');
        this._setClickAction();
    }

    _renderInkRipple() {
        this._inkRipple = render();
    }

    _getInkRippleContainer() {
        return this._$icon;
    }

    _toggleActiveState($element, value, e) {
        super._toggleActiveState.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: this._getInkRippleContainer(),
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
            case 'icon':
                this._renderIcon();
                break;
            case 'onClick':
                this._renderClick();
                break;
            case 'label':
                this._renderLabel();
                break;
            case 'visible':
                this._currentVisible = args.previousValue;
                args.value ?
                    this._show() :
                    this._hide();
                break;
            case 'useInkRipple':
                this._render();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

export default SpeedDialItem;
