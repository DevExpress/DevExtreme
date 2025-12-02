import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getImageContainer } from '@js/core/utils/icon';
import { isPlainObject } from '@js/core/utils/type';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import type { Properties } from '@js/ui/speed_dial_action';
import { isMaterial } from '@js/ui/themes';
import { render } from '@ts/core/utils/m_ink_ripple';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import Overlay from '@ts/ui/overlay/overlay';

const FAB_CLASS = 'dx-fa-button';
const FAB_ICON_CLASS = 'dx-fa-button-icon';
const FAB_LABEL_CLASS = 'dx-fa-button-label';
const FAB_LABEL_WRAPPER_CLASS = 'dx-fa-button-label-wrapper';
const FAB_CONTENT_REVERSE_CLASS = 'dx-fa-button-content-reverse';
const OVERLAY_CONTENT_SELECTOR = '.dx-overlay-content';

export interface SpeedDialItemProperties extends Omit<Properties,
'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'
> {
  zIndex: number;

  actions?: any[];

  useInkRipple?: boolean;

  shading?: boolean;

  callOverlayRenderShading?: boolean;

  _observeContentResize?: boolean;
}

class SpeedDialItem extends Overlay<SpeedDialItemProperties> {
  // Temporary solution. Move to component level
  public NAME!: string;

  _$label?: dxElementWrapper;

  _currentVisible?: boolean;

  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _inkRipple?: any;

  _$icon?: dxElementWrapper;

  _contentReadyAction?: any;

  _clickAction?: any;

  _getDefaultOptions(): SpeedDialItemProperties {
    return {
      ...super._getDefaultOptions(),
      shading: false,
      useInkRipple: false,
      callOverlayRenderShading: false,
      width: 'auto',
      zIndex: 1500,
      _observeContentResize: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<SpeedDialItemProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          // @ts-expect-error ts-error
          return isMaterial();
        },
        options: {
          useInkRipple: true,
        },
      },
    ]);
  }

  _moveToContainer(): void {
    this._$wrapper.appendTo(this.$element());
    this._$content.appendTo(this._$wrapper);
  }

  _render(): void {
    this.$element().addClass(FAB_CLASS);
    this._renderIcon();
    this._renderLabel();
    super._render();

    if (this.option('useInkRipple')) {
      this._renderInkRipple();
    }
    this._renderClick();
  }

  _renderLabel(): void {
    if (this._$label) {
      this._$label.remove();
    }

    const { label } = this.option();

    if (!label) {
      // @ts-expect-error ts-error
      this._$label = null;
      return;
    }

    const $element = $('<div>').addClass(FAB_LABEL_CLASS);
    const $wrapper = $('<div>').addClass(FAB_LABEL_WRAPPER_CLASS);

    const $content = this.$content();

    if ($content) {
      this._$label = $wrapper
        .prependTo($content)
        .append($element.text(label));

      $content.toggleClass(FAB_CONTENT_REVERSE_CLASS, this._isPositionLeft(this.option('parentPosition')));
    }
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

  _renderButtonIcon($element, icon, iconClass): dxElementWrapper {
    !!$element && $element.remove();

    $element = $('<div>').addClass(iconClass);
    const $iconElement = getImageContainer(icon);

    $element
      .append($iconElement)
      .appendTo(this.$content());

    return $element;
  }

  _renderIcon(): void {
    this._$icon = this._renderButtonIcon(
      this._$icon,
      this._options.silent('icon'),
      FAB_ICON_CLASS,
    );
  }

  _renderWrapper(): void {
    if (this._options.silent('callOverlayRenderShading')) {
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

  _initContentReadyAction(): void {
    this._contentReadyAction = this._getActionComponent()._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly'],
    }, true);
  }

  _fireContentReadyAction(): void {
    this._contentReadyAction({ actionElement: this.$element() });
  }

  _updateZIndexStackPosition(): void {
    const { zIndex } = this.option();

    this._$wrapper.css('zIndex', zIndex);
    this._$content.css('zIndex', zIndex);
  }

  _setClickAction(): void {
    const eventName = addNamespace(clickEventName, this.NAME);
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

  // @ts-expect-error
  _defaultActionArgs(): DefaultActionArgs<SpeedDialItem> {
    return {
      component: this._getActionComponent(),
    };
  }

  _renderClick(): void {
    this._clickAction = this._getActionComponent()._createActionByOption('onClick');
    this._setClickAction();
  }

  _renderInkRipple(): void {
    this._inkRipple = render();
  }

  _getInkRippleContainer(): dxElementWrapper | undefined | null {
    return this._$icon;
  }

  _toggleActiveState(
    $element: dxElementWrapper,
    value: boolean,

    event?: DxEvent<PointerInteractionEvent>,
  ): void {
    super._toggleActiveState($element, value, event);

    if (!this._inkRipple) {
      return;
    }

    const config = {
      element: this._getInkRippleContainer(),
      event,
    };

    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  }

  _optionChanged(args: OptionChanged<SpeedDialItemProperties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
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
        this._currentVisible = previousValue;
        if (value) {
          this._show();
        } else {
          this._hide();
        }
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
