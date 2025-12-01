import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { isString } from '@js/core/utils/type';
import Overlay from '@js/ui/overlay/ui.overlay';
import { isMaterialBased } from '@js/ui/themes';
import type { Properties } from '@js/ui/toast';
import type { OptionChanged } from '@ts/core/widget/types';

const ready = readyCallbacks.add;

const TOAST_CLASS = 'dx-toast';
const TOAST_CLASS_PREFIX = `${TOAST_CLASS}-`;
const TOAST_WRAPPER_CLASS = `${TOAST_CLASS_PREFIX}wrapper`;
const TOAST_CONTENT_CLASS = `${TOAST_CLASS_PREFIX}content`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS_PREFIX}message`;
const TOAST_ICON_CLASS = `${TOAST_CLASS_PREFIX}icon`;

const WIDGET_NAME = 'dxToast';
const toastTypes = ['info', 'warning', 'error', 'success'];

const TOAST_STACK = [];
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
  // @ts-expect-error ts-error
  eventsEngine.subscribeGlobal(domAdapter.getDocument(), pointerEvents.down, (e) => {
    for (let i = TOAST_STACK.length - 1; i >= 0; i--) {
      // @ts-expect-error ts-error
      if (!TOAST_STACK[i]._proxiedDocumentDownHandler(e)) {
        return;
      }
    }
  });
});

interface ToastProperties extends Properties {}

class Toast<
TProperties extends ToastProperties = ToastProperties,
> extends Overlay<TProperties> {
  _message?: dxElementWrapper;

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
      // @ts-expect-error ts-error
      displayTime: isMaterialBased() ? 4000 : 2000,
      hideOnOutsideClick: true,
      animation: tabletAndMobileAnimation,
    };
    // @ts-expect-error ts-error
    return super._defaultOptionsRules().concat([
      {
        device(device): boolean {
          return device.deviceType === 'phone';
        },
        options: {
          width: `calc(100vw - ${DEFAULT_MARGIN * 2}px)`,
          ...tabletAndMobileCommonOptions,
        },
      },
      {
        device(device): boolean {
          return device.deviceType === 'tablet';
        },
        options: {
          width: 'auto',
          maxWidth: '80vw',
          ...tabletAndMobileCommonOptions,
        },
      },
      {
        device(device): boolean {
          // @ts-expect-error ts-error
          return isMaterialBased() && device.deviceType === 'desktop';
        },
        options: {
          minWidth: 344,
          maxWidth: 568,
          displayTime: 4000,
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this._posStringToObject();
  }

  // @ts-expect-error ts-error
  _renderContentImpl() {
    const { message, type } = this.option();

    const $content = this.$content();

    if ($content) {
      this._message = $('<div>')
        .addClass(TOAST_MESSAGE_CLASS)
        .text(message ?? '')
        .appendTo($content);
    }

    this.setAria('role', 'alert', this._message);
    // @ts-expect-error ts-error
    if (toastTypes.includes(type.toLowerCase())) {
      $content?.prepend($('<div>').addClass(TOAST_ICON_CLASS));
    }

    super._renderContentImpl();
  }

  _render(): void {
    super._render();

    this.$element()?.addClass(TOAST_CLASS);
    this.$wrapper()?.addClass(TOAST_WRAPPER_CLASS);

    const { type } = this.option();
    this.$content()?.addClass(TOAST_CLASS_PREFIX + String(type).toLowerCase());
    this.$content()?.addClass(TOAST_CONTENT_CLASS);

    this._toggleCloseEvents('Swipe');
    this._toggleCloseEvents('Click');
  }

  _toggleCloseEvents(event): void {
    const dxEvent = `dx${event.toLowerCase()}`;

    eventsEngine.off(this.$content(), dxEvent);
    this.option(`closeOn${event}`) && eventsEngine.on(this.$content(), dxEvent, this.hide.bind(this));
  }

  _posStringToObject(): void {
    const { position } = this.option();

    if (!isString(position)) return;

    const verticalPosition = position.split(' ')[0];
    const horizontalPosition = position.split(' ')[1];

    this.option('position', extend({ boundaryOffset: DEFAULT_BOUNDARY_OFFSET }, POSITION_ALIASES[verticalPosition]));

    // eslint-disable-next-line default-case
    switch (horizontalPosition) {
      case 'center':
      case 'left':
      case 'right':
        // @ts-expect-error ts-error
        this.option('position').at += ` ${horizontalPosition}`;
        // @ts-expect-error ts-error
        this.option('position').my += ` ${horizontalPosition}`;
        break;
    }
  }

  _show(): DeferredObj<unknown> {
    // @ts-expect-error ts-error
    return super._show.apply(this, arguments).always(() => {
      clearTimeout(this._hideTimeout);

      const { displayTime } = this.option();

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._hideTimeout = setTimeout(this.hide.bind(this), displayTime);
    });
  }

  // @ts-expect-error ts-error
  // eslint-disable-next-line class-methods-use-this
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
        this.$content()?.removeClass(TOAST_CLASS_PREFIX + previousValue);
        this.$content()?.addClass(TOAST_CLASS_PREFIX + String(value).toLowerCase());
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
