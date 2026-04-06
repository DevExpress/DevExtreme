import positionUtils from '@js/common/core/animation/position';
import { move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { fitIntoRange } from '@js/core/utils/math';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight, getWidth, setHeight, setWidth,
} from '@js/core/utils/size';
import { isObject, isString } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { Properties } from '@js/ui/popover';
import { isMaterial, isMaterialBased } from '@js/ui/themes';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';
import Popup from '@ts/ui/popup/m_popup';

import type {
  PopoverControllerElements,
  PopoverControllerProperties,
  PopoverPositionControllerConstructor,
} from './popover_position_controller';
import {
  POPOVER_POSITION_ALIASES,
  PopoverPositionController,
} from './popover_position_controller';

// STYLE popover

const POPOVER_CLASS = 'dx-popover';
const POPOVER_WRAPPER_CLASS = 'dx-popover-wrapper';
const POPOVER_ARROW_CLASS = 'dx-popover-arrow';
const POPOVER_WITHOUT_TITLE_CLASS = 'dx-popover-without-title';

const POSITION_FLIP_MAP = {
  left: 'right',
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  center: 'center',
};

const HOVER_EVENT_PAIRS: Record<string, string> = {
  // eslint-disable-next-line spellcheck/spell-checker
  mouseleave: 'mouseenter',
  // eslint-disable-next-line spellcheck/spell-checker
  mouseout: 'mouseover',
  // eslint-disable-next-line spellcheck/spell-checker
  pointerleave: 'pointerenter',
  // eslint-disable-next-line spellcheck/spell-checker
  dxhoverend: 'dxhoverstart',
};

const HOVER_HIDE_EVENTS = Object.keys(HOVER_EVENT_PAIRS);
const HOVER_HIDE_DELAY = 50;

const ESC_KEY_NAME = 'escape';

type PopoverTarget = string | dxElementWrapper | Element | undefined;
type PopoverEventOption = 'showEvent' | 'hideEvent';

export interface PopoverProperties extends Omit<Properties,
'onTitleRendered' | 'onHidden' | 'onHiding' | 'onShowing' | 'onShown'
| 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
  useDefaultToolbarButtons?: boolean;

  useFlatToolbarButtons?: boolean;

  arrowOffset: number;

  arrowPosition?: string;

  preventScrollEvents?: boolean;
}
class Popover<
  TProperties extends PopoverProperties = PopoverProperties,
> extends Popup<TProperties> {
  // @ts-expect-error ts-error
  _positionController!: PopoverPositionController;

  _$arrow!: dxElementWrapper;

  _documentEscapeKeyHandler!: (e: KeyboardEvent) => void;

  _timeouts!: Record<string, ReturnType<typeof setTimeout>>;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      shading: false,
      position: extend({}, POPOVER_POSITION_ALIASES.bottom),
      hideOnOutsideClick: true,
      animation: {
        show: {
          type: 'fade',
          from: 0,
          to: 1,
        },
        hide: {
          type: 'fade',
          from: 1,
          to: 0,
        },
      },
      showTitle: false,
      width: 'auto',
      height: 'auto',
      dragEnabled: false,
      resizeEnabled: false,
      fullScreen: false,
      hideOnParentScroll: true,
      arrowPosition: '',
      arrowOffset: 0,

      _fixWrapperPosition: true,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return [
      {
        device: { platform: 'ios' },
        // @ts-expect-error ts-error
        options: {
          arrowPosition: {
            boundaryOffset: { h: 20, v: -10 },
            collision: 'fit',
          },
        },
      }, {
        device(): boolean {
          return !hasWindow();
        },
        // @ts-expect-error ts-error
        options: {
          animation: null,
        },
      },
      {
        device(): boolean {
          // @ts-expect-error ts-error
          return isMaterialBased();
        },
        // @ts-expect-error ts-error
        options: {
          useFlatToolbarButtons: true,
        },
      },
      {
        device(): boolean {
          // @ts-expect-error ts-error
          return isMaterial();
        },
        // @ts-expect-error ts-error
        options: {
          useDefaultToolbarButtons: true,
          showCloseButton: false,
        },
      },
    ];
  }

  _init(): void {
    super._init();

    this._renderArrow();
    this._initEscapeKeyHandler();
    this._timeouts = {};

    this.$element().addClass(POPOVER_CLASS);
    this.$wrapper()?.addClass(POPOVER_WRAPPER_CLASS);

    const { toolbarItems, visible } = this.option();

    const isInteractive = toolbarItems?.length;
    this.setAria('role', isInteractive ? 'dialog' : 'tooltip');

    if (visible) {
      this._attachEscapeKeyHandler();
    }
  }

  _initEscapeKeyHandler(): void {
    this._documentEscapeKeyHandler = (e: KeyboardEvent): void => {
      const { visible } = this.option();

      const overlayStack = this._overlayStack();
      // @ts-ignore this
      const isTopOverlay = overlayStack[overlayStack.length - 1] === this;

      if (normalizeKeyName(e) === ESC_KEY_NAME && visible && isTopOverlay) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.hide();
      }
    };
  }

  _attachEscapeKeyHandler(): void {
    const eventName = addNamespace('keydown', this.NAME as string);

    eventsEngine.off(domAdapter.getDocument(), eventName, this._documentEscapeKeyHandler);
    eventsEngine.on(domAdapter.getDocument(), eventName, this._documentEscapeKeyHandler);
  }

  _detachEscapeKeyHandler(): void {
    const eventName = addNamespace('keydown', this.NAME as string);

    eventsEngine.off(domAdapter.getDocument(), eventName, this._documentEscapeKeyHandler);
  }

  _render(): void {
    // @ts-expect-error ts-error
    super._render.apply(this, arguments);
    this._detachEvents(this.option('target'));
    this._attachEvents();
    this._detachHoverableOverlay();
    this._attachHoverableOverlay();
  }

  _detachEvents(target): void {
    this._detachEvent(target, 'show');
    this._detachEvent(target, 'hide');
  }

  _attachEvents(): void {
    this._attachEvent('show');
    this._attachEvent('hide');
  }

  _scheduleHoverHide(): void {
    this._clearEventsTimeouts();
    const hideDelay = this._getEventDelay('hideEvent');

    if (hideDelay) {
      // eslint-disable-next-line no-restricted-globals
      this._timeouts.hide = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.hide();
      }, hideDelay);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.hide();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _isHoverHideEventName(eventName: string): boolean {
    return HOVER_HIDE_EVENTS.some((hoverEvent) => eventName.split(/\s+/).includes(hoverEvent));
  }

  _attachHoverableOverlay(): void {
    const hideEventName = this._getEventName('hideEvent');
    if (!hideEventName || !this._isHoverHideEventName(hideEventName)) {
      return;
    }
    const $overlayContent = this.$overlayContent();
    if (!$overlayContent.length) {
      return;
    }

    const namespace = `${this.NAME as string}Hoverable`;
    const activeHideEvents = hideEventName.split(/\s+/).filter((eventName: string) => eventName in HOVER_EVENT_PAIRS);

    const hoverInEventName = activeHideEvents
      .map((eventName: string) => addNamespace(HOVER_EVENT_PAIRS[eventName], namespace))
      .join(' ');
    const hoverOutEventName = activeHideEvents
      .map((eventName: string) => addNamespace(eventName, namespace))
      .join(' ');

    eventsEngine.off($overlayContent, hoverInEventName);
    eventsEngine.on($overlayContent, hoverInEventName, () => {
      this._clearEventsTimeouts();
    });

    eventsEngine.off($overlayContent, hoverOutEventName);
    eventsEngine.on($overlayContent, hoverOutEventName, (e: PointerEvent | MouseEvent) => {
      const { target } = this.option();
      const { relatedTarget } = e;

      if (target && relatedTarget instanceof Element && $(relatedTarget).closest(target).length) {
        return;
      }

      this._scheduleHoverHide();
    });
  }

  _detachHoverableOverlay(): void {
    const $overlayContent = this.$overlayContent();
    if (!$overlayContent.length) {
      return;
    }
    const namespace = `${this.NAME as string}Hoverable`;
    const allEventNames = [
      ...Object.keys(HOVER_EVENT_PAIRS),
      ...Object.values(HOVER_EVENT_PAIRS),
    ].map((e) => addNamespace(e, namespace)).join(' ');
    eventsEngine.off($overlayContent, allEventNames);
  }

  _createEventHandler(name: string) {
    const action = this._createAction(() => {
      const explicitDelay = this._getEventDelay(`${name}Event` as PopoverEventOption);
      this._clearEventsTimeouts();

      const hideEventName = name === 'hide' ? this._getEventName('hideEvent') : null;
      const isHoverHide = hideEventName && this._isHoverHideEventName(hideEventName);
      const delay = explicitDelay ?? (isHoverHide ? HOVER_HIDE_DELAY : 0);

      if (delay) {
        this._timeouts[name] = setTimeout(() => {
          this[name]();
        }, delay);
      } else {
        this[name]();
      }
    }, { validatingTargetName: 'target' });

    return (e): void => {
      action({ event: e, target: $(e.currentTarget) });
    };
  }

  _attachEvent(name: string): void {
    const {
      target, shading, disabled, hideEvent,
    } = this.option();

    const shouldIgnoreHideEvent = shading && name === 'hide';
    if (shouldIgnoreHideEvent && hideEvent) {
      errors.log('W1020');
    }

    const event = shouldIgnoreHideEvent ? null : this._getEventName(`${name}Event`);
    if (!event || disabled) {
      return;
    }

    const EVENT_HANDLER_NAME = this._getEventHandlerName(name);
    this[EVENT_HANDLER_NAME] = this._createEventHandler(name);

    const eventName = addNamespace(event, this.NAME!);

    const isSelector = isString(target);
    if (isSelector) {
      eventsEngine.on(domAdapter.getDocument(), eventName, target, this[EVENT_HANDLER_NAME]);
    } else {
      eventsEngine.on(getPublicElement($(target)), eventName, this[EVENT_HANDLER_NAME]);
    }
  }

  _detachEvent(target: PopoverTarget, name: string, event?: unknown) {
    let eventName: string = event || this._getEventName(`${name}Event`);

    if (!eventName) {
      return;
    }

    eventName = addNamespace(eventName, this.NAME!);

    const EVENT_HANDLER_NAME = this._getEventHandlerName(name);

    const isSelector = isString(target);
    if (isSelector) {
      // @ts-expect-error ts-error
      eventsEngine.off(domAdapter.getDocument(), eventName, target, this[EVENT_HANDLER_NAME]);
    } else {
      eventsEngine.off(getPublicElement($(target)), eventName, this[EVENT_HANDLER_NAME]);
    }
  }

  _getEventHandlerName(name: string): string {
    return `_${name}EventHandler`;
  }

  _getEventNameByOption(optionValue) {
    // @ts-expect-error
    return isObject(optionValue) ? optionValue.name : optionValue;
  }

  _getEventName(optionName) {
    const optionValue = this.option(optionName);

    return this._getEventNameByOption(optionValue);
  }

  _getEventDelay(optionName: PopoverEventOption): number | undefined {
    const { [optionName]: optionValue } = this.option();

    return isObject(optionValue) ? (optionValue.delay) : undefined;
  }

  _renderArrow(): void {
    this._$arrow = $('<div>')
      .addClass(POPOVER_ARROW_CLASS)
      .prependTo(this.$overlayContent());
  }

  _documentDownHandler(e): boolean {
    if (this._isOutsideClick(e)) {
      return super._documentDownHandler(e);
    }

    return true;
  }

  _isOutsideClick(e): boolean {
    const { target } = this.option();
    // @ts-expect-error ts-error
    return !$(e.target).closest(target).length;
  }

  _animate(animation): void {
    if (animation?.to && typeof animation.to === 'object') {
      extend(animation.to, {
        position: this._getContainerPosition(),
      });
    }
    // @ts-expect-error ts-error
    super._animate.apply(this, arguments);
  }

  _stopAnimation(): void {
    // @ts-expect-error ts-error
    super._stopAnimation.apply(this, arguments);
  }

  _renderTopToolbar(): void {
    this.$wrapper()?.toggleClass(POPOVER_WITHOUT_TITLE_CLASS, !this.option('showTitle'));
    super._renderTopToolbar();
  }

  _renderPosition(shouldUpdateDimensions = true): void {
    super._renderPosition();
    this._renderOverlayPosition(shouldUpdateDimensions);

    // @ts-expect-error should provide event
    this._actions?.onPositioned?.();
  }

  _renderOverlayPosition(shouldUpdateDimensions: boolean): void {
    this._resetOverlayPosition(shouldUpdateDimensions);
    this._updateContentSize(shouldUpdateDimensions);

    const contentPosition = this._getContainerPosition();
    const resultLocation = positionUtils.setup(this.$overlayContent(), contentPosition);

    const positionSide = this._getSideByLocation(resultLocation);

    this._togglePositionClass(`dx-position-${positionSide}`);
    this._toggleFlippedClass(resultLocation.h.flip, resultLocation.v.flip);

    const isArrowVisible = this._isHorizontalSide() || this._isVerticalSide();

    if (isArrowVisible) {
      this._renderArrowPosition(positionSide);
    }
  }

  _resetOverlayPosition(shouldUpdateDimensions): void {
    this._setContentHeight(shouldUpdateDimensions);
    this._togglePositionClass(`dx-position-${this._positionController._positionSide}`);

    move(this.$overlayContent(), { left: 0, top: 0 });

    this._$arrow.css({
      top: 'auto', right: 'auto', bottom: 'auto', left: 'auto',
    });
  }

  _updateContentSize(shouldUpdateDimensions) {
    if (!this.$content() || !shouldUpdateDimensions) {
      return;
    }
    const containerLocation = positionUtils.calculate(this.$overlayContent(), this._getContainerPosition());

    if ((containerLocation.h.oversize > 0) && this._isHorizontalSide() && !containerLocation.h.fit) {
      const newContainerWidth = getWidth(this.$overlayContent()) - containerLocation.h.oversize;

      setWidth(this.$overlayContent(), newContainerWidth);
    }

    if ((containerLocation.v.oversize > 0) && this._isVerticalSide() && !containerLocation.v.fit) {
      const newOverlayContentHeight = getHeight(this.$overlayContent()) - containerLocation.v.oversize;
      const newPopupContentHeight = getHeight(this.$content()) - containerLocation.v.oversize;

      setHeight(this.$overlayContent(), newOverlayContentHeight);
      setHeight(this.$content(), newPopupContentHeight);
    }
  }

  _getContainerPosition() {
    return this._positionController._getContainerPosition();
  }

  _getHideOnParentScrollTarget(): dxElementWrapper {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return $(this._positionController._position?.of || super._getHideOnParentScrollTarget());
  }

  _getSideByLocation(location) {
    const isFlippedByVertical = location.v.flip;
    const isFlippedByHorizontal = location.h.flip;

    const isVertical = this._isVerticalSide() && isFlippedByVertical;
    const isHorizontal = this._isHorizontalSide() && isFlippedByHorizontal;
    const isInside = this._isPopoverInside();

    const condition = isVertical || isHorizontal || isInside;
    const positionSide = this._positionController._positionSide;

    if (condition && positionSide) {
      return POSITION_FLIP_MAP[positionSide];
    }

    if (positionSide) {
      return positionSide;
    }

    return undefined;
  }

  _togglePositionClass(positionClass) {
    this.$wrapper()
      ?.removeClass('dx-position-left dx-position-right dx-position-top dx-position-bottom')
      .addClass(positionClass);
  }

  _toggleFlippedClass(isFlippedHorizontal, isFlippedVertical) {
    this.$wrapper()
      ?.toggleClass('dx-popover-flipped-horizontal', isFlippedHorizontal)
      .toggleClass('dx-popover-flipped-vertical', isFlippedVertical);
  }

  _renderArrowPosition(side) {
    const arrowRect = getBoundingRect(this._$arrow.get(0));
    const arrowFlip = -(this._isVerticalSide(side) ? arrowRect.height : arrowRect.width);

    this._$arrow.css(POSITION_FLIP_MAP[side], arrowFlip);

    const axis = this._isVerticalSide(side) ? 'left' : 'top';
    const sizeProperty = this._isVerticalSide(side) ? 'width' : 'height';
    const $target = $(this._positionController._position?.of);
    const targetOffset = positionUtils.offset($target) ?? { top: 0, left: 0 };
    const contentOffset = positionUtils.offset(this.$overlayContent());

    const arrowSize = arrowRect[sizeProperty];
    const contentLocation = contentOffset?.[axis];
    const contentSize = getBoundingRect(this.$overlayContent().get(0))[sizeProperty];
    const targetLocation = targetOffset[axis];
    const targetElement = $target.get(0);
    // @ts-expect-error ts-error
    const targetSize = targetElement && !targetElement.preventDefault
      ? getBoundingRect(targetElement)[sizeProperty]
      : 0;

    const min = Math.max(contentLocation, targetLocation);
    const max = Math.min(contentLocation + contentSize, targetLocation + targetSize);

    let arrowLocation;

    const { arrowPosition } = this.option();

    if (arrowPosition === 'start') {
      arrowLocation = min - contentLocation;
    } else if (arrowPosition === 'end') {
      arrowLocation = max - contentLocation - arrowSize;
    } else {
      arrowLocation = (min + max) / 2 - contentLocation - arrowSize / 2;
    }

    const borderWidth = this._positionController._getContentBorderWidth(side);

    const { arrowOffset } = this.option();

    const finalArrowLocation = fitIntoRange(
      arrowLocation - borderWidth + arrowOffset,
      borderWidth,
      contentSize - arrowSize - borderWidth * 2,
    );

    this._$arrow.css(axis, finalArrowLocation);
  }

  _isPopoverInside(): boolean {
    return this._positionController._isPopoverInside();
  }

  _setContentHeight(fullUpdate?: boolean): void {
    if (fullUpdate) {
      super._setContentHeight();
    }
  }

  // @ts-expect-error Override parent method with more specific type
  _getPositionControllerConfig(): PopoverPositionControllerConstructor {
    const superConfiguration = super._getPositionControllerConfig();

    const { shading, target } = this.option();

    const properties: PopoverControllerProperties = {
      ...superConfiguration.properties,
      target,
      shading,
    };

    const elements: PopoverControllerElements = {
      ...superConfiguration.elements,
      $arrow: this._$arrow,
    };

    const configuration: PopoverPositionControllerConstructor = {
      properties,
      elements,
    };

    return configuration;
  }

  _initPositionController() {
    this._positionController = new PopoverPositionController(
      this._getPositionControllerConfig(),
    );
  }

  _renderWrapperDimensions() {
    if (this.option('shading')) {
      this.$wrapper()?.css({
        width: '100%',
        height: '100%',
      });
    }
  }

  _isVerticalSide(side?): boolean {
    return this._positionController._isVerticalSide(side);
  }

  _isHorizontalSide(side?): boolean {
    return this._positionController._isHorizontalSide(side);
  }

  _clearEventTimeout(name): void {
    clearTimeout(this._timeouts[name]);
  }

  _clearEventsTimeouts(): void {
    this._clearEventTimeout('show');
    this._clearEventTimeout('hide');
  }

  _clean(): void {
    this._detachEscapeKeyHandler();
    this._detachEvents(this.option('target'));
    this._detachHoverableOverlay();
    // @ts-expect-error ts-error
    super._clean.apply(this, arguments);
  }

  _dispose(): void {
    this._detachEscapeKeyHandler();
    super._dispose();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value, previousValue } = args;
    switch (name) {
      case 'arrowPosition':
      case 'arrowOffset':
        this._renderGeometry();
        break;
      case 'fullScreen':
        if (value) {
          this.option('fullScreen', false);
        }
        break;
      case 'target':
        if (previousValue) {
          this._detachEvents(previousValue);
        }
        this._positionController.updateTarget(value as TProperties['target']);
        this._invalidate();
        break;
      case 'showEvent':
      case 'hideEvent': {
        const eventName = name.substring(0, 4);
        const event = this._getEventNameByOption(previousValue);

        this.hide();
        const { target } = this.option();
        this._detachEvent(target, eventName, event);
        this._attachEvent(eventName);

        if (name === 'hideEvent') {
          this._detachHoverableOverlay();
          this._attachHoverableOverlay();
        }
        break;
      }
      case 'visible':
        if (value) {
          this._attachEscapeKeyHandler();
        } else {
          this._detachEscapeKeyHandler();
        }
        this._clearEventTimeout(value ? 'show' : 'hide');
        super._optionChanged(args);
        break;
      case 'disabled':
        this._detachEvents(this.option('target'));
        this._attachEvents();
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  show(target?): Promise<boolean> {
    if (target) {
      this.option('target', target);
    }

    return super.show();
  }
}

registerComponent('dxPopover', Popover);

export default Popover;
