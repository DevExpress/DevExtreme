import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import { isPlainObject } from '@js/core/utils/type';
import Overlay from '@js/ui/overlay/ui.overlay';
import type { Properties as PublicProperties } from '@js/ui/speed_dial_action';
import { isMaterial } from '@js/ui/themes';
import { render } from '@js/ui/widget/utils.ink_ripple';

const FAB_CLASS = 'dx-fa-button';
const FAB_ICON_CLASS = 'dx-fa-button-icon';
const FAB_LABEL_CLASS = 'dx-fa-button-label';
const FAB_LABEL_WRAPPER_CLASS = 'dx-fa-button-label-wrapper';
const FAB_CONTENT_REVERSE_CLASS = 'dx-fa-button-content-reverse';
const OVERLAY_CONTENT_SELECTOR = '.dx-overlay-content';

export interface Properties extends PublicProperties {
  zIndex: number;

  actions?: any;
}

class SpeedDialItem extends Overlay<Properties> {
  // Temporary solution. Move to component level
  public NAME!: string;

  _$label?: dxElementWrapper;

  _currentVisible?: boolean;

  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _inkRipple?: any;

  _$icon?: dxElementWrapper;

  _options?: any;

  _contentReadyAction?: any;

  _clickAction?: any;

  _getDefaultOptions() {
    // @ts-expect-error
    return extend(super._getDefaultOptions(), {
      shading: false,
      useInkRipple: false,
      callOverlayRenderShading: false,
      width: 'auto',
      zIndex: 1500,
      _observeContentResize: false,
    });
  }

  _defaultOptionsRules() {
    // @ts-expect-error
    return super._defaultOptionsRules().concat([
      {
        device() {
          // @ts-expect-error
          return isMaterial();
        },
        options: {
          useInkRipple: true,
        },
      },
    ]);
  }

  _moveToContainer() {
    this._$wrapper.appendTo(this.$element());
    this._$content.appendTo(this._$wrapper);
  }

  _render(): void {
    // @ts-expect-error
    this.$element().addClass(FAB_CLASS);
    this._renderIcon();
    this._renderLabel();
    // @ts-expect-error
    super._render();
    this.option('useInkRipple') && this._renderInkRipple();
    this._renderClick();
  }

  _renderLabel() {
    !!this._$label && this._$label.remove();

    const labelText = this.option('label');

    if (!labelText) {
      // @ts-expect-error
      this._$label = null;
      return;
    }

    const $element = $('<div>').addClass(FAB_LABEL_CLASS);
    const $wrapper = $('<div>').addClass(FAB_LABEL_WRAPPER_CLASS);

    this._$label = $wrapper
    // @ts-expect-error
      .prependTo(this.$content())
      .append($element.text(labelText));

    // @ts-expect-error
    this.$content().toggleClass(FAB_CONTENT_REVERSE_CLASS, this._isPositionLeft(this.option('parentPosition')));
  }

  _isPositionLeft(position) {
    let currentLocation = '';

    if (position) {
      if (isPlainObject(position) && position.at) {
        if (position.at.x) {
          currentLocation = position.at.x;
        } else {
          currentLocation = position.at;
        }
      } else if (typeof position === 'string') {
        currentLocation = position;
      }
    }

    return currentLocation.split(' ')[0] === 'left';
  }

  _renderButtonIcon($element, icon, iconClass) {
    !!$element && $element.remove();

    $element = $('<div>').addClass(iconClass);
    const $iconElement = getImageContainer(icon);

    $element
      .append($iconElement)
      // @ts-expect-error
      .appendTo(this.$content());

    return $element;
  }

  _renderIcon() {
    this._$icon = this._renderButtonIcon(
      this._$icon,
      this._options.silent('icon'),
      FAB_ICON_CLASS,
    );
  }

  _renderWrapper() {
    if (this._options.silent('callOverlayRenderShading')) {
      // @ts-expect-error
      super._renderWrapper();
    }
  }

  _getVisibleActions(actions) {
    const currentActions = actions || this.option('actions') || [];

    return currentActions.filter((action) => action.option('visible'));
  }

  _getActionComponent() {
    // @ts-expect-error
    if (this._getVisibleActions().length === 1) {
      // @ts-expect-error
      return this._getVisibleActions()[0];
    }
    return this.option('actionComponent') || this.option('actions')[0];
  }

  _initContentReadyAction() {
    this._contentReadyAction = this._getActionComponent()._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly'],
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

  _setClickAction(): void {
    const eventName = addNamespace(clickEventName, this.NAME);
    // @ts-expect-error
    const overlayContent = this.$element().find(OVERLAY_CONTENT_SELECTOR);

    eventsEngine.off(overlayContent, eventName);
    eventsEngine.on(overlayContent, eventName, (e) => {
      const clickActionArgs = {
        event: e,
        actionElement: this.element(),
        element: this._getActionComponent().$element(),
      };

      this._clickAction(clickActionArgs);
    });
  }

  _defaultActionArgs() {
    return {
      component: this._getActionComponent(),
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
    // @ts-expect-error
    super._toggleActiveState.apply(this, arguments);

    if (!this._inkRipple) {
      return;
    }

    const config = {
      element: this._getInkRippleContainer(),
      event: e,
    };

    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  }

  _optionChanged(args) {
    switch (args.name) {
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
        args.value
          // @ts-expect-error
          ? this._show()
          // @ts-expect-error
          : this._hide();
        break;
      case 'useInkRipple':
        this._render();
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }
}

export default SpeedDialItem;
