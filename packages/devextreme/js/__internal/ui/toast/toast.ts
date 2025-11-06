import type { PositionAlignment } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import type { DeepPartial } from '@js/core';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { isString } from '@js/core/utils/type';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import Overlay from '@js/ui/overlay/ui.overlay';
import { current, isMaterialBased } from '@js/ui/themes';
import type { Properties } from '@js/ui/toast';
import type { OptionChanged } from '@ts/core/widget/types';
import type { OverlayProperties } from '@ts/ui/overlay/overlay';

const ready = readyCallbacks.add;

export const TOAST_CLASS = 'dx-toast';
const TOAST_WRAPPER_CLASS = 'dx-toast-wrapper';
const TOAST_CONTENT_CLASS = 'dx-toast-content';
const TOAST_MESSAGE_CLASS = 'dx-toast-message';
const TOAST_ICON_CLASS = 'dx-toast-icon';

const WIDGET_NAME = 'dxToast';
const toastTypes = ['info', 'warning', 'error', 'success'];

const TOAST_STACK: Toast[] = [];
const FIRST_Z_INDEX_OFFSET = 8000;

const POSITION_ALIASES = {
  top: {
    my: 'top', at: 'top', of: null, offset: '0 0',
  },
  bottom: {
    my: 'bottom', at: 'bottom', of: null, offset: '0 -20',
  },
  center: {
    my: 'center', at: 'center', of: null, offset: '0 0',
  },
  right: {
    my: 'center right', at: 'center right', of: null, offset: '0 0',
  },
  left: {
    my: 'center left', at: 'center left', of: null, offset: '0 0',
  },
};

const DEFAULT_BOUNDARY_OFFSET = { h: 0, v: 0 };
const DEFAULT_MARGIN = 20;

ready(() => {
  const element = domAdapter.getDocument();

  const callback = (e: DxEvent<PointerInteractionEvent>): void => {
    for (let i = TOAST_STACK.length - 1; i >= 0; i -= 1) {
      if (!TOAST_STACK[i]._proxiedDocumentDownHandler?.(e)) {
        return;
      }
    }
  };

  // @ts-expect-error subscribeGlobal should be described in .d.ts
  eventsEngine.subscribeGlobal(
    element,
    pointerEvents.down,
    callback,
  );
});

interface ToastProperties extends Properties {
  container: OverlayProperties['container'];
}

class Toast<
  TProperties extends ToastProperties = ToastProperties,
> extends Overlay<TProperties> {
  _message?: dxElementWrapper;

  // eslint-disable-next-line no-restricted-globals
  _hideTimeout?: ReturnType<typeof setTimeout>;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      message: '',
      type: 'info',
      displayTime: 2000,
      position: 'bottom center',
      animation: {
        show: {
          type: 'fade',
          duration: 400,
          from: 0,
          to: 1,
        },
        hide: {
          type: 'fade',
          duration: 400,
          from: 1,
          to: 0,
        },
      },
      shading: false,
      height: 'auto',
      hideTopOverlayHandler: null,
      preventScrollEvents: false,
      closeOnSwipe: true,
      closeOnClick: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    const tabletAndMobileAnimation = {
      show: {
        type: 'fade',
        duration: 200,
        from: 0,
        to: 1,
      },
      hide: {
        type: 'fade',
        duration: 200,
        from: 1,
        to: 0,
      },
    };

    const tabletAndMobileCommonOptions = {
      displayTime: isMaterialBased(current()) ? 4000 : 2000,
      hideOnOutsideClick: true,
      animation: tabletAndMobileAnimation,
    };

    const toastRules: DefaultOptionsRule<TProperties>[] = [
      {
        device(device): boolean {
          return device.deviceType === 'phone';
        },
        options: {
          width: `calc(100vw - ${DEFAULT_MARGIN * 2}px)`,
          ...tabletAndMobileCommonOptions,
        } as DeepPartial<TProperties>,
      },
      {
        device(device): boolean {
          return device.deviceType === 'tablet';
        },
        options: {
          width: 'auto',
          maxWidth: '80vw',
          ...tabletAndMobileCommonOptions,
        } as DeepPartial<TProperties>,
      },
      {
        device(device): boolean {
          return isMaterialBased(current()) && device.deviceType === 'desktop';
        },
        options: {
          minWidth: 344,
          maxWidth: 568,
          displayTime: 4000,
        } as DeepPartial<TProperties>,
      },
    ];

    const rules = [
      ...super._defaultOptionsRules(),
      ...toastRules,
    ];

    return rules;
  }

  _init(): void {
    super._init();

    this._posStringToObject();
  }

  _renderContentImpl(): Promise<void> {
    const { message, type } = this.option();

    this._message = $('<div>')
      .addClass(TOAST_MESSAGE_CLASS)
      .text(message ?? '')
      .appendTo(this.$content());

    this.setAria('role', 'alert', this._message);

    if (type && toastTypes.includes(type.toLowerCase())) {
      this.$content().prepend($('<div>').addClass(TOAST_ICON_CLASS));
    }

    return super._renderContentImpl();
  }

  _render(): void {
    super._render();

    this.$element().addClass(TOAST_CLASS);
    this.$wrapper().addClass(TOAST_WRAPPER_CLASS);

    const { type } = this.option();

    if (type) {
      this.$content().addClass(`${TOAST_CLASS}-${type.toLowerCase()}`);
    }

    this.$content().addClass(TOAST_CONTENT_CLASS);

    this._toggleCloseEvents('Swipe');
    this._toggleCloseEvents('Click');
  }

  _toggleCloseEvents(event: 'Swipe' | 'Click'): void {
    const dxEvent = `dx${event.toLowerCase()}`;

    eventsEngine.off(this.$content(), dxEvent);

    const optionName = `closeOn${event}`;
    const optionValue = this.option(optionName);

    if (optionValue) {
      eventsEngine.on(this.$content(), dxEvent, this.hide.bind(this));
    }
  }

  _posStringToObject(): void {
    const { position } = this.option();

    if (!isString(position)) {
      return;
    }

    const verticalPosition = position.split(' ')[0];
    const horizontalPosition = position.split(' ')[1];

    const newPosition = {
      boundaryOffset: DEFAULT_BOUNDARY_OFFSET,
      ...POSITION_ALIASES[verticalPosition],
    };

    this.option('position', newPosition);

    switch (horizontalPosition) {
      case 'center':
      case 'left':
      case 'right': {
        if (newPosition && typeof newPosition === 'object') {
          const at = `${newPosition.at as PositionAlignment} ${horizontalPosition}`;
          const my = `${newPosition.my as PositionAlignment} ${horizontalPosition}`;

          this.option('position.at', at);
          this.option('position.my', my);
        }
        break;
      }
      default:
        break;
    }
  }

  _show(): DeferredObj<unknown> | Promise<unknown> {
    const callback = (): void => {
      clearTimeout(this._hideTimeout);

      const { displayTime } = this.option();

      // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-restricted-globals
      this._hideTimeout = setTimeout(this.hide.bind(this), displayTime);
    };

    const promise = super._show() as DeferredObj<unknown>;

    promise.always(callback);

    return promise;
  }

  // @ts-expect-error Violation of the Principle of Liskov Substitutability

  _overlayStack(): Toast[] {
    return TOAST_STACK;
  }

  _zIndexInitValue(): number {
    return super._zIndexInitValue() + FIRST_Z_INDEX_OFFSET;
  }

  _dispose(): void {
    clearTimeout(this._hideTimeout);
    super._dispose();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'type':
        this.$content().removeClass(`${TOAST_CLASS}-${previousValue}`);

        if (value) {
          this.$content().addClass(`${TOAST_CLASS}-${String(value).toLowerCase()}`);
        }
        break;
      case 'message':
        if (this._message) {
          // @ts-expect-error ts-error
          this._message.text(value);
        }
        break;
      case 'closeOnSwipe':
        this._toggleCloseEvents('Swipe');
        break;
      case 'closeOnClick':
        this._toggleCloseEvents('Click');
        break;
      case 'displayTime':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent(WIDGET_NAME, Toast);

export default Toast;
