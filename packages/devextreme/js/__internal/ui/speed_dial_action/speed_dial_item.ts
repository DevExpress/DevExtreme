import type { FloatingActionButtonDirection, GlobalConfig } from '@js/common';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { DeepPartial } from '@js/core';
import type Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getImageContainer } from '@js/core/utils/icon';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import type { Properties } from '@js/ui/speed_dial_action';
import { current, isMaterial } from '@js/ui/themes';
import type { InkRipple, InkRippleWaveConfig } from '@ts/core/utils/ink_ripple';
import { render } from '@ts/core/utils/ink_ripple';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { OverlayProperties } from '@ts/ui/overlay/overlay';
import Overlay from '@ts/ui/overlay/overlay';

import type SpeedDialAction from './speed_dial_action';

const FAB_CLASS = 'dx-fa-button';
const FAB_ICON_CLASS = 'dx-fa-button-icon';
const FAB_LABEL_CLASS = 'dx-fa-button-label';
const FAB_LABEL_WRAPPER_CLASS = 'dx-fa-button-label-wrapper';
const FAB_CONTENT_REVERSE_CLASS = 'dx-fa-button-content-reverse';
const OVERLAY_CONTENT_SELECTOR = '.dx-overlay-content';

export type FloatingActionButtonPosition = NonNullable<
  GlobalConfig['floatingActionButtonConfig']
>['position'];

export interface SpeedDialItemProperties extends
  Omit<OverlayProperties, 'onInitialized' | 'onDisposing' | 'onContentReady' | 'position' | 'elementAttr'>,
  Omit<Properties, 'onInitialized' | 'onDisposing' | 'onOptionChanged' | 'onContentReady' | 'width' | 'height'> {
  position?: FloatingActionButtonPosition;

  parentPosition?: FloatingActionButtonPosition;

  direction?: FloatingActionButtonDirection;

  zIndex: number;

  id?: Guid;

  actions?: SpeedDialAction[];

  actionComponent?: SpeedDialAction;

  actionVisible?: boolean;

  useInkRipple?: boolean;

  callOverlayRenderShading?: boolean;

  _observeContentResize?: boolean;
}

class SpeedDialItem<
  TProperties extends SpeedDialItemProperties = SpeedDialItemProperties,
> extends Overlay<TProperties> {
  public NAME!: string;

  _$label?: dxElementWrapper | null;

  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _inkRipple?: InkRipple;

  _$icon?: dxElementWrapper;

  _clickAction!: (event?: unknown) => void;

  _getDefaultOptions(): TProperties {
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

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return isMaterial(current());
        },
        options: {
          useInkRipple: true,
        } as DeepPartial<TProperties>,
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

    const { useInkRipple } = this.option();

    if (useInkRipple) {
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

      const { parentPosition } = this.option();

      $content.toggleClass(FAB_CONTENT_REVERSE_CLASS, this._isPositionLeft(parentPosition));
    }
  }

  _isPositionLeft(position: FloatingActionButtonPosition | undefined): boolean {
    let currentLocation = '';

    if (position) {
      if (typeof position === 'string') {
        currentLocation = position;
      } else if (typeof position !== 'function' && position.at) {
        const { at } = position;

        if (typeof at !== 'string' && at.x) {
          currentLocation = at.x;
        } else if (typeof at === 'string') {
          currentLocation = at;
        }
      }
    }

    return currentLocation.split(' ')[0] === 'left';
  }

  _renderButtonIcon(
    $element: dxElementWrapper | undefined,
    icon: string | undefined,
    iconClass: string,
  ): dxElementWrapper {
    $element?.remove();

    const $updatedElement = $('<div>').addClass(iconClass);
    const $iconElement = getImageContainer(icon);

    if ($iconElement) {
      $updatedElement.append($iconElement);
    }

    const $content = this.$content();

    if ($content) {
      $updatedElement.appendTo($content);
    }

    return $updatedElement;
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

  _getVisibleActions(actions?: SpeedDialAction[]): SpeedDialAction[] {
    const { actions: ownActions } = this.option();
    const currentActions = actions ?? ownActions ?? [];

    return currentActions.filter((action) => {
      const { visible = false } = action.option();

      return visible;
    });
  }

  _getActionComponent(): SpeedDialAction {
    const visibleActions = this._getVisibleActions();

    if (visibleActions.length === 1) {
      return visibleActions[0];
    }

    const { actionComponent, actions = [] } = this.option();

    return actionComponent ?? actions[0];
  }

  _initContentReadyAction(): void {
    this._contentReadyAction = this._getActionComponent()._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _fireContentReadyAction(): void {
    this._contentReadyAction?.({ actionElement: this.$element() });
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

  _defaultActionArgs(): DefaultActionArgs<SpeedDialAction> {
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

  _getInkRippleContainer(): dxElementWrapper | null | undefined {
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

    const config: InkRippleWaveConfig = {
      element: this._getInkRippleContainer(),
      event,
    };

    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
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
        this._currentVisible = previousValue as boolean | undefined;
        if (value) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this._show();
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
