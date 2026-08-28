import { fx } from '@js/common/core/animation';
import { name as clickEventName } from '@js/common/core/events/click';
import { lock } from '@js/common/core/events/core/emitter.feedback';
import eventsEngine from '@js/common/core/events/core/events_engine';
import Swipeable from '@js/common/core/events/gesture/swipeable';
import { addNamespace } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterWidth } from '@js/core/utils/size';
import type { NativeEventInfo } from '@js/events';
import type { Properties } from '@js/ui/switch';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { SwipeEndEvent, SwipeStartEvent, SwipeUpdateEvent } from '@ts/events/m_swipe';
import Editor from '@ts/ui/editor/editor';

const SWITCH_CLASS = 'dx-switch';
const SWITCH_WRAPPER_CLASS = `${SWITCH_CLASS}-wrapper`;
const SWITCH_CONTAINER_CLASS = `${SWITCH_CLASS}-container`;
const SWITCH_INNER_CLASS = `${SWITCH_CLASS}-inner`;
const SWITCH_HANDLE_CLASS = `${SWITCH_CLASS}-handle`;
const SWITCH_ON_VALUE_CLASS = `${SWITCH_CLASS}-on-value`;
const SWITCH_ON_CLASS = `${SWITCH_CLASS}-on`;
const SWITCH_OFF_CLASS = `${SWITCH_CLASS}-off`;

const SWITCH_ANIMATION_DURATION = 100;

class Switch extends Editor<Properties> {
  _$switchWrapper!: dxElementWrapper;

  _$switchContainer!: dxElementWrapper;

  _$switchInner!: dxElementWrapper;

  _$handle!: dxElementWrapper;

  _$labelOn?: dxElementWrapper;

  _$labelOff?: dxElementWrapper;

  _animating?: boolean;

  _swiping?: boolean;

  _feedbackDeferred?: DeferredObj<unknown>;

  _$submitElement!: dxElementWrapper;

  _clickAction?: (event?: Record<string, unknown>) => void;

  protected _feedbackHideTimeout(): number {
    return 0;
  }

  _supportedKeys(): SupportedKeys {
    const { rtlEnabled } = this.option();

    const click = (e: Event): void => {
      e.preventDefault();
      this._clickAction?.({ event: e });
    };

    const move = (value: boolean, e: KeyboardEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      this._saveValueChangeEvent(e);
      this._animateValue(value);
    };

    return {
      ...super._supportedKeys(),
      space: click,
      enter: click,
      leftArrow: (e): void => { move(Boolean(rtlEnabled), e); },
      rightArrow: (e): void => { move(!rtlEnabled, e); },
    };
  }

  _useTemplates(): boolean {
    return false;
  }

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: true,
      activeStateEnabled: true,
      switchedOnText: messageLocalization.format('dxSwitch-switchedOnText'),
      switchedOffText: messageLocalization.format('dxSwitch-switchedOffText'),
      value: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this._animating = false;
  }

  _initMarkup(): void {
    this._renderContainers();

    this.$element()
      .addClass(SWITCH_CLASS)
      .append(this._$switchWrapper);

    this._renderSubmitElement();

    this._renderClick();

    this.setAria('role', 'switch');

    this._renderSwipeable();

    super._initMarkup();

    this._renderSwitchInner();
    this._renderLabels();
    this._renderValue();
  }

  _getInnerOffset(value: boolean, offset: number): string {
    const ratio = (offset - this._offsetDirection() * Number(!value)) / 2;
    return `${100 * ratio}%`;
  }

  _getHandleOffset(value: boolean, offset: number): string {
    const { rtlEnabled } = this.option();

    const valueWithRtl = rtlEnabled ? !value : value;

    if (valueWithRtl) {
      const calcValue = -100 + 100 * -offset;
      return `${calcValue}%`;
    }

    return `${100 * -offset}%`;
  }

  _renderSwitchInner(): void {
    this._$switchInner = $('<div>')
      .addClass(SWITCH_INNER_CLASS)
      .appendTo(this._$switchContainer);

    this._$handle = $('<div>')
      .addClass(SWITCH_HANDLE_CLASS)
      .appendTo(this._$switchInner);
  }

  _renderLabels(): void {
    this._$labelOn = $('<div>')
      .addClass(SWITCH_ON_CLASS)
      .prependTo(this._$switchInner);

    this._$labelOff = $('<div>')
      .addClass(SWITCH_OFF_CLASS)
      .appendTo(this._$switchInner);

    this._setLabelsText();
  }

  _renderContainers(): void {
    this._$switchContainer = $('<div>')
      .addClass(SWITCH_CONTAINER_CLASS);

    this._$switchWrapper = $('<div>')
      .addClass(SWITCH_WRAPPER_CLASS)
      .append(this._$switchContainer);
  }

  _renderSwipeable(): void {
    this._createComponent(this.$element(), Swipeable, {
      elastic: false,
      immediate: true,
      onStart: (e): void => {
        this._swipeStartHandler(e.event);
      },
      onUpdated: (e): void => {
        this._swipeUpdateHandler(e.event);
      },
      onEnd: (e): void => {
        this._swipeEndHandler(e.event);
      },
      itemSizeFunc: () => this._getItemSizeFunc(),
    });
  }

  _getItemSizeFunc(): number {
    return getOuterWidth(this._$switchContainer, true)
    - getBoundingRect(this._$handle.get(0)).width;
  }

  _renderSubmitElement(): void {
    this._$submitElement = $('<input>')
      .attr('type', 'hidden')
      .appendTo(this.$element());
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$submitElement;
  }

  _offsetDirection(): number {
    const { rtlEnabled } = this.option();
    return rtlEnabled ? -1 : 1;
  }

  _renderPosition(state: boolean, swipeOffset: number): void {
    const innerOffset = this._getInnerOffset(state, swipeOffset);
    const handleOffset = this._getHandleOffset(state, swipeOffset);

    this._$switchInner.css('transform', ` translateX(${innerOffset})`);
    this._$handle.css('transform', ` translateX(${handleOffset})`);
  }

  _validateValue(): void {
    const { value: check } = this.option();
    if (typeof check !== 'boolean') {
      this._options.silent('value', !!check);
    }
  }

  _renderClick(): void {
    const eventName = addNamespace(clickEventName, this.NAME ?? '');
    const $element = this.$element();
    this._clickAction = this._createAction(this._clickHandler.bind(this));

    eventsEngine.off($element, eventName);
    eventsEngine.on($element, eventName, (e: Event): void => {
      this._clickAction?.({ event: e });
    });
  }

  _clickHandler(args: NativeEventInfo<Switch, MouseEvent | PointerEvent>): void {
    const { event } = args;

    this._saveValueChangeEvent(event);

    if (this._animating || this._swiping) {
      return;
    }

    const { value } = this.option();

    this._animateValue(!value);
  }

  _animateValue(newValue: boolean): void {
    const { value } = this.option();
    const startValue = Boolean(value);
    const endValue = newValue;

    if (startValue === endValue) {
      return;
    }

    this._animating = true;

    const fromInnerOffset = this._getInnerOffset(startValue, 0);
    const toInnerOffset = this._getInnerOffset(endValue, 0);
    const fromHandleOffset = this._getHandleOffset(startValue, 0);
    const toHandleOffset = this._getHandleOffset(endValue, 0);

    const fromInnerConfig = { transform: ` translateX(${fromInnerOffset})` };
    const toInnerConfig = { transform: ` translateX(${toInnerOffset})` };
    const fromHandleConfig = { transform: ` translateX(${fromHandleOffset})` };
    const toHandlerConfig = { transform: ` translateX(${toHandleOffset})` };

    this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, endValue);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate(this._$handle.get(0), {
      // @ts-expect-error AnimationState type should be extended
      from: fromHandleConfig,
      // @ts-expect-error AnimationState type should be extended
      to: toHandlerConfig,
      duration: SWITCH_ANIMATION_DURATION,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate(this._$switchInner.get(0), {
      // @ts-expect-error AnimationState type should be extended
      from: fromInnerConfig,
      // @ts-expect-error AnimationState type should be extended
      to: toInnerConfig,
      duration: SWITCH_ANIMATION_DURATION,
      complete: () => {
        this._animating = false;
        this.option({ value: endValue });
      },
    });
  }

  _swipeStartHandler(event: SwipeStartEvent): void {
    const { value: state, rtlEnabled, activeStateEnabled } = this.option();
    const maxOffOffset = rtlEnabled ? 0 : 1;
    const maxOnOffset = rtlEnabled ? 1 : 0;

    event.maxLeftOffset = state ? maxOffOffset : maxOnOffset;
    event.maxRightOffset = state ? maxOnOffset : maxOffOffset;

    this._swiping = true;

    this._feedbackDeferred = Deferred();
    lock(this._feedbackDeferred);

    this._toggleActiveState(this.$element(), Boolean(activeStateEnabled));
  }

  _swipeUpdateHandler(event: SwipeUpdateEvent): void {
    const { value } = this.option();
    this._renderPosition(Boolean(value), event.offset);
  }

  _swipeEndHandler(event: SwipeEndEvent): void {
    const { value } = this.option();

    const offsetDirection = this._offsetDirection();

    const innerOffset = this._getInnerOffset(Boolean(value), event.targetOffset);
    const handleOffset = this._getHandleOffset(Boolean(value), event.targetOffset);

    const toInnerConfig = { transform: ` translateX(${innerOffset})` };
    const toHandleConfig = { transform: ` translateX(${handleOffset})` };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate(this._$handle.get(0), {
      // @ts-expect-error AnimationState type should be extended
      to: toHandleConfig,
      duration: SWITCH_ANIMATION_DURATION,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate(this._$switchInner.get(0), {
      // @ts-expect-error AnimationState type should be extended
      to: toInnerConfig,
      duration: SWITCH_ANIMATION_DURATION,
      complete: () => {
        this._swiping = false;
        const pos = Number(value) + offsetDirection * event.targetOffset;
        this._saveValueChangeEvent(event);
        this.option({ value: Boolean(pos) });
        this._feedbackDeferred?.resolve();
        this._toggleActiveState(this.$element(), false);
      },
    });
  }

  _renderValue(): void {
    this._validateValue();

    const { value, switchedOnText, switchedOffText } = this.option();

    this._renderPosition(Boolean(value), 0);

    this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, value);

    this._getSubmitElement().val(String(value ?? ''));
    this.setAria({
      checked: value,
      label: value ? switchedOnText : switchedOffText,
    });
  }

  _setLabelsText(): void {
    const { switchedOnText = '', switchedOffText = '' } = this.option();

    this._$labelOn?.text(switchedOnText);
    this._$labelOff?.text(switchedOffText);
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this.repaint();
    }
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    switch (args.name) {
      case 'width':
        this._refresh();
        break;
      case 'switchedOnText':
      case 'switchedOffText':
        this._setLabelsText();
        break;
      case 'value':
        this._renderValue();
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxSwitch', Switch);

export default Switch;
