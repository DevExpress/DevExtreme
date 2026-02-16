import type { ScrollDirection } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import scrollEvents from '@js/common/core/events/gesture/emitter.gesture.scroll';
import { addNamespace } from '@js/common/core/events/utils';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { ensureDefined, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { ScrollEvent } from '@js/ui/scroll_view';
import type { dxScrollableOptions } from '@js/ui/scroll_view/ui.scrollable';
import supportUtils from '@ts/core/utils/m_support';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import {
  SCROLLABLE_CLASS,
  SCROLLABLE_CONTAINER_CLASS,
  SCROLLABLE_CONTENT_CLASS,
  SCROLLABLE_DISABLED_CLASS,
  SCROLLABLE_WRAPPER_CLASS,
} from '@ts/ui/scroll_view/consts';
import { deviceDependentOptions } from '@ts/ui/scroll_view/scrollable.device';
import NativeStrategy from '@ts/ui/scroll_view/scrollable.native';
import { SimulatedStrategy } from '@ts/ui/scroll_view/scrollable.simulated';
import type {
  DxMouseEvent,
  ElementOffset,
  ScrollOffset,
} from '@ts/ui/scroll_view/types';
import { getElementLocationInternal } from '@ts/ui/scroll_view/utils/get_element_location_internal';

const SCROLLABLE = 'dxScrollable';
const SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';
const BOTH = 'both';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ScrollableProperties extends DOMComponentProperties<any>, Omit<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dxScrollableOptions<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyof DOMComponentProperties<any>
> {
  _onVisibilityChanged?: (data: unknown) => void;
  useSimulatedScrollbar?: boolean;
  useKeyboard?: boolean;
  updateManually?: boolean;
  inertiaEnabled?: boolean;
  onStart?: ((e) => void) | null;
  onEnd?: ((e) => void) | null;
  onBounce?: ((e) => void) | null;
}

class Scrollable<
  TProperties extends ScrollableProperties = ScrollableProperties,
> extends DOMComponent<Scrollable<TProperties>, TProperties> {
  _locked!: boolean;

  _$container!: dxElementWrapper;

  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _allowedDirectionValue!: ScrollDirection | null;

  _strategy!: NativeStrategy<TProperties> | SimulatedStrategy<TProperties>;

  _savedScrollOffset?: {
    top?: number;
    left?: number;
  };

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      disabled: false,
      onScroll: null,
      direction: VERTICAL,
      showScrollbar: 'onScroll',
      useNative: true,
      bounceEnabled: true,
      scrollByContent: true,
      scrollByThumb: false,
      onUpdated: null,
      onStart: null,
      onEnd: null,
      onBounce: null,
      useSimulatedScrollbar: false,
      useKeyboard: true,
      inertiaEnabled: true,
      updateManually: false,
      _onVisibilityChanged: noop,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat(
      deviceDependentOptions() as DefaultOptionsRule<TProperties>[],
      [
        {
          device(): boolean {
            return !!(supportUtils.nativeScrolling
              && devices.real().platform === 'android'
              && !browser.mozilla);
          },
          // @ts-expect-error ts-error
          options: {
            useSimulatedScrollbar: true,
          },
        },
      ],
    );
  }

  _initOptions(options: TProperties): void {
    super._initOptions(options);
    if (!('useSimulatedScrollbar' in options)) {
      this._setUseSimulatedScrollbar();
    }
  }

  _setUseSimulatedScrollbar(): void {
    if (!this.initialOption('useSimulatedScrollbar')) {
      this.option('useSimulatedScrollbar', !this.option('useNative'));
    }
  }

  _init(): void {
    super._init();
    this._initScrollableMarkup();
    this._locked = false;
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this.update();
      this._updateRtlPosition();
      if (this._savedScrollOffset) {
        this.scrollTo(this._savedScrollOffset);
      }
      delete this._savedScrollOffset;

      const { _onVisibilityChanged: onVisibilityChanged } = this.option();
      onVisibilityChanged?.(this);
    } else {
      this._savedScrollOffset = this.scrollOffset();
    }
  }

  _initScrollableMarkup(): void {
    const $element = this.$element().addClass(SCROLLABLE_CLASS);
    const $container = $('<div>')
      .addClass(SCROLLABLE_CONTAINER_CLASS);
    const $wrapper = $('<div>')
      .addClass(SCROLLABLE_WRAPPER_CLASS);
    const $content = $('<div>')
      .addClass(SCROLLABLE_CONTENT_CLASS);

    this._$container = $container;
    this._$wrapper = $wrapper;
    this._$content = $content;

    $content.append($element.contents()).appendTo($container);
    $container.appendTo($wrapper);
    $wrapper.appendTo($element);
  }

  _dimensionChanged(): void {
    this.update();
    this._updateRtlPosition();
  }

  _initMarkup(): void {
    super._initMarkup();
    this._renderDirection();
  }

  _render(): void {
    this._renderStrategy();

    this._attachEventHandlers();
    this._renderDisabledState();
    this._createActions();
    this.update();

    super._render();

    this._updateRtlPosition(true);
  }

  _updateRtlPosition(needInitializeRtlConfig?: boolean): void {
    this._strategy.updateRtlPosition(needInitializeRtlConfig);
  }

  _getMaxOffset(): { top: number; left: number } {
    const {
      scrollWidth, clientWidth, scrollHeight, clientHeight,
    } = $(this.container()).get(0);

    return {
      left: scrollWidth - clientWidth,
      top: scrollHeight - clientHeight,
    };
  }

  _attachEventHandlers(): void {
    const strategy = this._strategy;

    const initEventData = {
      getDirection: strategy.getDirection.bind(strategy),
      validate: this._validate.bind(this),
      isNative: this.option('useNative'),
      scrollTarget: this._$container,
    };

    eventsEngine.off(this._$wrapper, `.${SCROLLABLE}`);
    eventsEngine.on(
      this._$wrapper,
      addNamespace(scrollEvents.init, SCROLLABLE),
      initEventData,
      this._initHandler.bind(this),
    );
    eventsEngine.on(
      this._$wrapper,
      addNamespace(scrollEvents.start, SCROLLABLE),
      strategy.handleStart.bind(strategy),
    );
    eventsEngine.on(
      this._$wrapper,
      addNamespace(scrollEvents.move, SCROLLABLE),
      strategy.handleMove.bind(strategy),
    );
    eventsEngine.on(
      this._$wrapper,
      addNamespace(scrollEvents.end, SCROLLABLE),
      strategy.handleEnd.bind(strategy),
    );
    eventsEngine.on(
      this._$wrapper,
      addNamespace(scrollEvents.cancel, SCROLLABLE),
      strategy.handleCancel.bind(strategy),
    );
    eventsEngine.on(
      this._$wrapper,
      addNamespace(scrollEvents.stop, SCROLLABLE),
      strategy.handleStop.bind(strategy),
    );

    eventsEngine.off(this._$container, `.${SCROLLABLE}`);
    eventsEngine.on(this._$container, addNamespace('scroll', SCROLLABLE), strategy.handleScroll.bind(strategy));
  }

  _validate(e: DxMouseEvent): boolean {
    if (this._isLocked()) {
      return false;
    }

    this._updateIfNeed();

    return this._moveIsAllowed(e);
  }

  _moveIsAllowed(e: DxMouseEvent): boolean {
    const result = this._strategy.validate(e);
    return Boolean(result);
  }

  handleMove(e: DxMouseEvent): void {
    this._strategy.handleMove(e);
  }

  _prepareDirections(value: boolean): void {
    this._strategy._prepareDirections(value);
  }

  _initHandler(e: ScrollEvent): void {
    this._strategy.handleInit(e);
  }

  _renderDisabledState(): void {
    const { disabled } = this.option();
    this.$element().toggleClass(SCROLLABLE_DISABLED_CLASS, disabled);

    if (this.option('disabled')) {
      this._lock();
    } else {
      this._unlock();
    }
  }

  _renderDirection(): void {
    const { direction } = this.option();

    this.$element()
      .removeClass(`dx-scrollable-${HORIZONTAL}`)
      .removeClass(`dx-scrollable-${VERTICAL}`)
      .removeClass(`dx-scrollable-${BOTH}`)
      .addClass(`dx-scrollable-${direction}`);
  }

  _renderStrategy(): void {
    this._createStrategy();
    this._strategy.render();
    this.$element().data(SCROLLABLE_STRATEGY, this._strategy);
  }

  _createStrategy(): void {
    const { useNative } = this.option();

    this._strategy = useNative
      ? new NativeStrategy<TProperties>(this)
      : new SimulatedStrategy<TProperties>(this);
  }

  _createActions(): void {
    this._strategy?.createActions();
  }

  _clean(): void {
    this._strategy?.dispose();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'onStart':
      case 'onEnd':
      case 'onUpdated':
      case 'onScroll':
      case 'onBounce':
        this._createActions();
        break;
      case 'direction':
        this._resetInactiveDirection();
        this._invalidate();
        break;
      case 'useNative':
        this._setUseSimulatedScrollbar();
        this._invalidate();
        break;
      case 'inertiaEnabled':
      case 'scrollByThumb':
      case 'bounceEnabled':
      case 'useKeyboard':
      case 'showScrollbar':
      case 'useSimulatedScrollbar':
        this._invalidate();
        break;
      case 'disabled':
        this._renderDisabledState();
        this._strategy?.disabledChanged();
        break;
      case 'updateManually':
      case 'scrollByContent':
      case '_onVisibilityChanged':
        break;
      case 'width':
        super._optionChanged(args);
        this._updateRtlPosition();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _resetInactiveDirection(): void {
    const inactiveProp = this._getInactiveProp();
    if (!inactiveProp || !hasWindow()) {
      return;
    }

    const scrollOffset = this.scrollOffset();
    scrollOffset[inactiveProp] = 0;
    this.scrollTo(scrollOffset);
  }

  _getInactiveProp(): 'left' | 'top' {
    const { direction } = this.option();
    if (direction === VERTICAL) {
      return 'left';
    }
    return 'top';
  }

  _location(): ScrollOffset {
    return this._strategy.location();
  }

  _normalizeLocation(location: Partial<ScrollOffset & {
    x?: number;
    y?: number;
  }> | number): Partial<ScrollOffset> {
    if (isPlainObject(location)) {
      const left = ensureDefined(location.left, location.x);
      const top = ensureDefined(location.top, location.y);
      return {
        left: isDefined(left) ? -left : undefined,
        top: isDefined(top) ? -top : undefined,
      };
    }
    const { direction } = this.option();
    return {
      left: direction !== VERTICAL ? -location : undefined,
      top: direction !== HORIZONTAL ? -location : undefined,
    };
  }

  _isLocked(): boolean {
    return this._locked;
  }

  _lock(): void {
    this._locked = true;
  }

  _unlock(): void {
    if (!this.option('disabled')) {
      this._locked = false;
    }
  }

  _isDirection(direction: ScrollDirection): boolean {
    const { direction: current } = this.option();
    if (direction === VERTICAL) {
      return current !== HORIZONTAL;
    }
    if (direction === HORIZONTAL) {
      return current !== VERTICAL;
    }
    return current === direction;
  }

  _updateAllowedDirection(): void {
    const allowedDirections = this._strategy._allowedDirections();

    if (this._isDirection(BOTH) && allowedDirections.vertical && allowedDirections.horizontal) {
      this._allowedDirectionValue = BOTH;
    } else if (this._isDirection(HORIZONTAL) && allowedDirections.horizontal) {
      this._allowedDirectionValue = HORIZONTAL;
    } else if (this._isDirection(VERTICAL) && allowedDirections.vertical) {
      this._allowedDirectionValue = VERTICAL;
    } else {
      this._allowedDirectionValue = null;
    }
  }

  _allowedDirection(): ScrollDirection | null {
    return this._allowedDirectionValue;
  }

  $content(): dxElementWrapper {
    return this._$content;
  }

  content(): Element {
    return getPublicElement(this._$content);
  }

  container(): Element {
    return getPublicElement(this._$container);
  }

  scrollOffset(): ScrollOffset {
    return this._strategy._getScrollOffset();
  }

  _isRtlNativeStrategy(): boolean | undefined {
    const { useNative, rtlEnabled } = this.option();

    return useNative && rtlEnabled;
  }

  scrollTop(): number {
    return this.scrollOffset().top;
  }

  scrollLeft(): number {
    return this.scrollOffset().left;
  }

  clientHeight(): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getHeight(this._$container);
  }

  scrollHeight(): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getOuterHeight(this.$content());
  }

  clientWidth(): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getWidth(this._$container);
  }

  scrollWidth(): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getOuterWidth(this.$content());
  }

  update(): DeferredObj<unknown> {
    if (!this._strategy) {
      return Deferred().resolve();
    }

    return when(this._strategy.update()).done(() => {
      this._updateAllowedDirection();
    });
  }

  scrollBy(distance: Partial<ScrollOffset> | number): void {
    const normalizedDistance = this._normalizeLocation(distance);

    if (!normalizedDistance.top && !normalizedDistance.left) {
      return;
    }

    this._updateIfNeed();
    this._strategy.scrollBy(normalizedDistance);
  }

  scrollTo(targetLocation: Partial<ScrollOffset> | number): void {
    if (!hasWindow()) {
      return;
    }

    let normalizedLocation = this._normalizeLocation(targetLocation);

    this._updateIfNeed();

    let location = this._location();

    const { useNative } = this.option();
    if (!useNative) {
      const strategy = this._strategy as SimulatedStrategy<TProperties>;

      normalizedLocation = strategy._applyScaleRatio(normalizedLocation);
      location = strategy._applyScaleRatio(location) as ScrollOffset;
    }

    if (this._isRtlNativeStrategy()) {
      location.left -= this._getMaxOffset().left;
    }

    const distance = this._normalizeLocation({
      left: location.left - ensureDefined(normalizedLocation.left, location.left),
      top: location.top - ensureDefined(normalizedLocation.top, location.top),
    });

    if (!distance.top && !distance.left) {
      return;
    }

    this._strategy.scrollBy(distance);
  }

  scrollToElement(element: Element | dxElementWrapper, offset?: ElementOffset): void {
    const $element = $(element);
    const elementInsideContent = this.$content().find(element).length;
    const elementIsInsideContent = ($element.parents(`.${SCROLLABLE_CLASS}`).length - $element.parents(`.${SCROLLABLE_CONTENT_CLASS}`).length) === 0;
    if (!elementInsideContent || !elementIsInsideContent) {
      return;
    }

    const scrollPosition = { top: 0, left: 0 };
    const { direction } = this.option();

    if (direction !== VERTICAL) {
      scrollPosition.left = this.getScrollElementPosition($element, HORIZONTAL, offset);
    }
    if (direction !== HORIZONTAL) {
      scrollPosition.top = this.getScrollElementPosition($element, VERTICAL, offset);
    }

    this.scrollTo(scrollPosition);
  }

  getScrollElementPosition(
    $element: dxElementWrapper,
    direction: ScrollDirection,
    offset?: ElementOffset,
  ): number {
    const scrollOffset = this.scrollOffset();

    return getElementLocationInternal(
      $element[0],
      direction,
      $(this.container())[0],
      scrollOffset,
      offset,
    );
  }

  _updateIfNeed(): void {
    if (!this.option('updateManually')) {
      this.update();
    }
  }

  _useTemplates(): boolean {
    return false;
  }
}

registerComponent(SCROLLABLE, Scrollable);

export default Scrollable;
