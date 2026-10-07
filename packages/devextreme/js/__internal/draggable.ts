/* eslint-disable max-classes-per-file */
import positionUtils from '@js/common/core/animation/position';
import { locate, move } from '@js/common/core/animation/translator';
import type { Cancelable } from '@js/common/core/events';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  end as dragEventEnd,
  enter as dragEventEnter,
  leave as dragEventLeave,
  move as dragEventMove,
  start as dragEventStart,
} from '@js/common/core/events/drag';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, needSkipEvent } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import type { DxElement } from '@js/core/element';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { dasherize } from '@js/core/utils/inflector';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight, getOuterHeight,
  getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { quadToObject } from '@js/core/utils/string';
import { isFunction, isNumeric, isObject } from '@js/core/utils/type';
import { value as viewPort } from '@js/core/utils/view_port';
import { getWindow } from '@js/core/utils/window';
import type { DraggableBaseOptions, Properties } from '@js/ui/draggable';
import { domAdapter } from '@ts/core/dom_adapter';
import { splitPair } from '@ts/core/utils/m_common';
import { fromPromise } from '@ts/core/utils/m_deferred';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import Animator from './ui/scroll_view/animator';

type BoundOffset = number | string | { h?: number; v?: number };

type DragHandler = ((e: never) => void) | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DraggableBaseProperties<TComponent = any> extends Omit<DraggableBaseOptions<TComponent>, 'boundary' | 'onDisposing' | 'onInitialized' | 'onOptionChanged'> {
  scrollSensitivity: number;

  scrollSpeed: number;

  allowMoveByClick?: boolean;

  boundOffset?: BoundOffset | (() => BoundOffset);

  boundary?: DraggableBaseOptions<TComponent>['boundary'] | dxElementWrapper;

  component?: unknown;

  contentTemplate?: string | null;

  clone?: boolean;

  dragTemplate?: Properties['dragTemplate'];

  filter?: string;

  immediate?: boolean;

  itemData?: unknown;

  onCancelByEsc?: boolean;

  onDragCancel?: DragHandler;

  onDragEnd?: DragHandler;

  onDragEnter?: DragHandler;

  onDragLeave?: DragHandler;

  onDragMove?: DragHandler;

  onDragStart?: DragHandler;

  onDraggableElementShown?: DragHandler;

  onDrop?: DragHandler;
}

export interface DraggableProperties extends Omit<Properties, 'boundary' | 'onDisposing' | 'onInitialized' | 'onOptionChanged'> {
  scrollSensitivity: number;

  scrollSpeed: number;

  allowMoveByClick?: boolean;

  boundOffset?: BoundOffset | (() => BoundOffset);

  boundary?: Properties['boundary'] | dxElementWrapper;

  component?: unknown;

  contentTemplate?: string | null;

  filter?: string;

  immediate?: boolean;

  itemData?: unknown;

  onCancelByEsc?: boolean;

  onDragCancel?: (e: DragEventArgs) => void;

  onDragEnter?: (e: DragEventArgs) => void;

  onDragLeave?: (e: DragEventArgs) => void;

  onDraggableElementShown?: (e: DragElementShownArgs) => void;

  onDrop?: (e: DragEventArgs) => void;
}

const window = getWindow();
const KEYDOWN_EVENT = 'keydown';

const DRAGGABLE = 'dxDraggable';
const DRAGSTART_EVENT_NAME = addNamespace(dragEventStart, DRAGGABLE);
const DRAG_EVENT_NAME = addNamespace(dragEventMove, DRAGGABLE);
const DRAGEND_EVENT_NAME = addNamespace(dragEventEnd, DRAGGABLE);
const DRAG_ENTER_EVENT_NAME = addNamespace(dragEventEnter, DRAGGABLE);
const DRAGEND_LEAVE_EVENT_NAME = addNamespace(dragEventLeave, DRAGGABLE);
const POINTERDOWN_EVENT_NAME = addNamespace(pointerEvents.down, DRAGGABLE);
const KEYDOWN_EVENT_NAME = addNamespace(KEYDOWN_EVENT, DRAGGABLE);

const CLONE_CLASS = 'clone';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDraggable = Draggable<any>;

let activeTargetDraggable: AnyDraggable | null = null;
let activeSourceDraggable: AnyDraggable | null = null;

const ANONYMOUS_TEMPLATE_NAME = 'content';

interface MousePosition {
  x: number;
  y: number;
}

const getMousePosition = (event: { pageX: number; pageY: number }): MousePosition => ({
  // @ts-expect-error scrollLeft is declared to return the wrapper
  x: event.pageX - $(window).scrollLeft(),
  // @ts-expect-error scrollTop is declared to return the wrapper
  y: event.pageY - $(window).scrollTop(),
});

const GESTURE_COVER_CLASS = 'dx-gesture-cover';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';

interface Offset {
  left: number;
  top: number;
}

interface DragEventOffset {
  x: number;
  y: number;
}

export type DragEvent = Cancelable & {
  type: string;
  target: Element;
  pageX: number;
  pageY: number;
  key?: string;
  originalEvent?: { target?: Element };
  offset?: DragEventOffset;
  maxLeftOffset?: number;
  maxRightOffset?: number;
  maxTopOffset?: number;
  maxBottomOffset?: number;
  _cancelPreventDefault?: boolean;
};

export type DragEventArgs = Cancelable & {
  event: DragEvent;
  itemData: unknown;
  itemElement: DxElement;
  fromComponent: unknown;
  toComponent: unknown;
  fromData: unknown;
  toData: unknown;
};

export type DragStartArgs = Cancelable & {
  event: DragEvent;
  itemData: unknown;
  itemElement: dxElementWrapper;
  fromData: unknown;
};

export type DragElementShownArgs = DragStartArgs & { dragElement: dxElementWrapper };

type CursorOffset = DraggableBaseOptions<unknown>['cursorOffset'];

type ElementOffsetOptions = DragStartArgs & {
  dragElement: Element | undefined;
  initialOffset?: Offset | false;
};

type CursorOffsetCallback = (options: ElementOffsetOptions) => CursorOffset;

interface BoundOffsetQuad {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface DragTemplateArgs {
  container: DxElement;
  model: {
    itemData: unknown;
    itemElement: DxElement;
    fromIndex?: number;
  };
}

type ActionFn = (args?: object) => void;

type ScrollOrientation = 'vertical' | 'horizontal';

interface ScrollableInstance {
  scrollOffset: () => Record<string, number>;
  scrollTo: (position: Record<string, number>) => void;
}

interface ScrollHelperOwner {
  option: () => { scrollSensitivity: number; scrollSpeed: number };
  _dragMoveEvent?: DragEvent;
  dragMoveHandler: (e: DragEvent) => void;
}

class ScrollHelper {
  private _preventScroll: boolean;

  private readonly _component: ScrollHelperOwner;

  private readonly _scrollValue: 'scrollTop' | 'scrollLeft';

  private readonly _overFlowAttr: 'overflowY' | 'overflowX';

  private readonly _sizeAttr: 'height' | 'width';

  private readonly _scrollSizeProp: 'scrollHeight' | 'scrollWidth';

  private readonly _clientSizeProp: 'clientHeight' | 'clientWidth';

  private readonly _limitProps: { start: 'top' | 'left'; end: 'bottom' | 'right' };

  private _$scrollableAtPointer: dxElementWrapper | null = null;

  private _scrollSpeed: number | undefined;

  constructor(orientation: ScrollOrientation, component: ScrollHelperOwner) {
    this._preventScroll = true;
    this._component = component;

    if (orientation === 'vertical') {
      this._scrollValue = 'scrollTop';
      this._overFlowAttr = 'overflowY';
      this._sizeAttr = 'height';
      this._scrollSizeProp = 'scrollHeight';
      this._clientSizeProp = 'clientHeight';
      this._limitProps = {
        start: 'top',
        end: 'bottom',
      };
    } else {
      this._scrollValue = 'scrollLeft';
      this._overFlowAttr = 'overflowX';
      this._sizeAttr = 'width';
      this._scrollSizeProp = 'scrollWidth';
      this._clientSizeProp = 'clientWidth';
      this._limitProps = {
        start: 'left',
        end: 'right',
      };
    }
  }

  updateScrollable(elements: Element[], mousePosition: MousePosition): void {
    let isScrollableFound = false;

    elements.some((element) => {
      const $element = $(element);
      const isTargetOverOverlayWrapper = $element.hasClass(OVERLAY_WRAPPER_CLASS);
      const isTargetOverOverlayContent = $element.hasClass(OVERLAY_CONTENT_CLASS);
      if (isTargetOverOverlayWrapper || isTargetOverOverlayContent) {
        return true;
      }

      isScrollableFound = this._trySetScrollable(element, mousePosition);

      return isScrollableFound;
    });

    if (!isScrollableFound) {
      this._$scrollableAtPointer = null;
      this._scrollSpeed = 0;
    }
  }

  isScrolling(): boolean {
    return !!this._scrollSpeed;
  }

  isScrollable($element: dxElementWrapper): boolean {
    return ($element.css(this._overFlowAttr) === 'auto' || $element.hasClass('dx-scrollable-container'))
            // @ts-expect-error prop is declared without the getter form
            && $element.prop(this._scrollSizeProp) > Math.ceil(this._sizeAttr === 'width' ? getWidth($element) : getHeight($element));
  }

  _trySetScrollable(element: Element, mousePosition: MousePosition): boolean {
    const $element = $(element);
    const { scrollSensitivity: sensitivity } = this._component.option();
    let isScrollable = this.isScrollable($element);

    if (isScrollable) {
      const distanceToBorders = this._calculateDistanceToBorders($element, mousePosition);
      const { start, end } = this._limitProps;

      if (sensitivity > distanceToBorders[start]) {
        if (!this._preventScroll) {
          this._scrollSpeed = -this._calculateScrollSpeed(distanceToBorders[start]);
          this._$scrollableAtPointer = $element;
        }
      } else if (sensitivity > distanceToBorders[end]) {
        if (!this._preventScroll) {
          this._scrollSpeed = this._calculateScrollSpeed(distanceToBorders[end]);
          this._$scrollableAtPointer = $element;
        }
      } else {
        isScrollable = false;
        this._preventScroll = false;
      }
    }

    return isScrollable;
  }

  _calculateDistanceToBorders(
    $area: dxElementWrapper,
    mousePosition: MousePosition,
  ): Record<string, number> {
    const area = $area.get(0);

    if (area) {
      const areaBoundingRect: DOMRect = getBoundingRect(area);

      return {
        left: mousePosition.x - areaBoundingRect.left,
        top: mousePosition.y - areaBoundingRect.top,
        right: areaBoundingRect.right - mousePosition.x,
        bottom: areaBoundingRect.bottom - mousePosition.y,
      };
    }
    return {};
  }

  _calculateScrollSpeed(distance: number): number {
    const { scrollSensitivity: sensitivity, scrollSpeed: maxSpeed } = this._component.option();

    return Math.ceil(((sensitivity - distance) / sensitivity) ** 2 * maxSpeed);
  }

  scrollByStep(): void {
    if (this._$scrollableAtPointer && this._scrollSpeed) {
      if (this._$scrollableAtPointer.hasClass('dx-scrollable-container')) {
        const $scrollable = this._$scrollableAtPointer.closest('.dx-scrollable');
        // @ts-expect-error data is declared without the getter form
        const scrollableInstance: ScrollableInstance | undefined = $scrollable.data('dxScrollable') || $scrollable.data('dxScrollView');

        if (scrollableInstance) {
          const nextScrollPosition = scrollableInstance
            .scrollOffset()[this._limitProps.start] + this._scrollSpeed;

          scrollableInstance.scrollTo({ [this._limitProps.start]: nextScrollPosition });
        }
      } else {
        // @ts-expect-error scrollTop and scrollLeft are declared to return the wrapper
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const nextScrollPosition = this._$scrollableAtPointer[this._scrollValue]()
          + this._scrollSpeed;

        this._$scrollableAtPointer[this._scrollValue](nextScrollPosition);
      }

      const dragMoveEvent = this._component._dragMoveEvent;

      if (dragMoveEvent) {
        this._component.dragMoveHandler(dragMoveEvent);
      }
    }
  }

  reset(): void {
    this._$scrollableAtPointer = null;
    this._scrollSpeed = 0;
    this._preventScroll = true;
  }

  isOutsideScrollable($scrollable: dxElementWrapper | undefined, event: DragEvent): boolean {
    if (!$scrollable) {
      return false;
    }

    const scrollableSize = getBoundingRect($scrollable.get(0));
    const start = scrollableSize[this._limitProps.start];
    const size = scrollableSize[this._sizeAttr];
    const mousePosition = getMousePosition(event);
    const location = this._sizeAttr === 'width' ? mousePosition.x : mousePosition.y;

    return location < start || location > (start + size);
  }
}

interface ScrollAnimatorOwner {
  _horizontalScrollHelper: ScrollHelper;
  _verticalScrollHelper: ScrollHelper;
}

class ScrollAnimator extends Animator {
  _strategy: ScrollAnimatorOwner;

  constructor(strategy: ScrollAnimatorOwner) {
    super();
    this._strategy = strategy;
  }

  _step(): void {
    const horizontalScrollHelper = this._strategy._horizontalScrollHelper;
    const verticalScrollHelper = this._strategy._verticalScrollHelper;

    horizontalScrollHelper?.scrollByStep();
    verticalScrollHelper?.scrollByStep();
  }
}

class Draggable<
  TProperties extends DraggableBaseProperties = DraggableProperties,
> extends DOMComponent<Draggable<TProperties>, TProperties> {
  _$sourceElement?: dxElementWrapper | null;

  _initScrollTop!: number;

  _initScrollLeft!: number;

  _verticalScrollHelper!: ScrollHelper;

  _horizontalScrollHelper!: ScrollHelper;

  _$dragElement?: dxElementWrapper | null;

  dragInProgress?: boolean;

  _dragMoveEvent?: DragEvent;

  _scrollAnimator!: ScrollAnimator;

  _initialLocate?: { left: number; top: number };

  _startPosition?: { left: number; top: number };

  reset(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dragMove(e: DragEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dragEnter(e?: DragEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dragLeave(e?: DragEvent): void {}

  dragEnd(sourceEvent: DragEventArgs): DeferredObj<unknown> | PromiseLike<void> {
    const sourceDraggable = this._getSourceDraggable();

    sourceDraggable._fireRemoveEvent(sourceEvent.event);

    return Deferred().resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _fireRemoveEvent(sourceEvent?: DragEvent): void {}

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      onDragStart: undefined,
      onDragMove: undefined,
      onDragEnd: undefined,
      onDragEnter: undefined,
      onDragLeave: undefined,
      onDragCancel: undefined,
      onDrop: undefined,
      onCancelByEsc: false,
      immediate: true,
      dragDirection: 'both',
      boundOffset: 0,
      allowMoveByClick: false,
      itemData: null,
      contentTemplate: 'content',
      handle: '',
      filter: '',
      clone: false,
      autoScroll: true,
      scrollSpeed: 30,
      scrollSensitivity: 60,
    };
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      component: true,
      group: true,
      itemData: true,
      data: true,
    });
  }

  _init(): void {
    super._init();
    this._attachEventHandlers();
    this._scrollAnimator = new ScrollAnimator(this);

    this._horizontalScrollHelper = new ScrollHelper('horizontal', this);
    this._verticalScrollHelper = new ScrollHelper('vertical', this);

    this._initScrollTop = 0;
    this._initScrollLeft = 0;
  }

  _normalizeCursorOffset(offset: CursorOffset): Offset {
    let normalizedOffset: CursorOffset | { h?: number; v?: number } = offset;

    if (isObject(offset)) {
      normalizedOffset = {
        h: offset.x,
        v: offset.y,
      };
    }
    const pair = splitPair(normalizedOffset).map((value) => parseFloat(value));

    return {
      left: pair[0],
      top: pair.length === 1 ? pair[0] : pair[1],
    };
  }

  _getNormalizedCursorOffset(
    offset: CursorOffset | CursorOffsetCallback,
    options: ElementOffsetOptions,
  ): Offset {
    let cursorOffset = offset;

    if (isFunction(cursorOffset)) {
      cursorOffset = cursorOffset.call(this, options);
    }

    return this._normalizeCursorOffset(cursorOffset);
  }

  _calculateElementOffset(options: ElementOffsetOptions): Offset | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let elementOffset: Offset | undefined;
    const { event } = options;
    const $element = $(options.itemElement);
    const $dragElement = $(options.dragElement);
    const isCloned = this._dragElementIsCloned();
    const cursorOffset = this.option('cursorOffset');
    let normalizedCursorOffset = { left: 0, top: 0 };
    this._initialLocate = locate($dragElement);
    const currentLocate = this._initialLocate;

    if (isCloned || options.initialOffset || cursorOffset) {
      elementOffset = options.initialOffset || $element.offset();

      if (cursorOffset) {
        normalizedCursorOffset = this._getNormalizedCursorOffset(cursorOffset, options);

        if (isFinite(normalizedCursorOffset.left)) {
          // @ts-expect-error offset can be undefined
          elementOffset.left = event.pageX;
        }

        if (isFinite(normalizedCursorOffset.top)) {
          // @ts-expect-error offset can be undefined
          elementOffset.top = event.pageY;
        }
      }

      const dragElementOffset = $dragElement.offset();
      // @ts-expect-error offset can be undefined
      elementOffset.top -= dragElementOffset.top
        + (normalizedCursorOffset.top || 0) - currentLocate.top;
      // @ts-expect-error offset can be undefined
      elementOffset.left -= dragElementOffset.left
        + (normalizedCursorOffset.left || 0) - currentLocate.left;
    }

    return elementOffset;
  }

  _initPosition(options: ElementOffsetOptions): void {
    const $dragElement = $(options.dragElement);
    const elementOffset = this._calculateElementOffset(options);

    if (elementOffset) {
      this._move(elementOffset, $dragElement);
    }

    this._startPosition = locate($dragElement);
  }

  _startAnimator(): void {
    if (!this._scrollAnimator.inProgress()) {
      this._scrollAnimator.start();
    }
  }

  _stopAnimator(): void {
    this._scrollAnimator?.stop();
  }

  _addWidgetPrefix(className?: string): string {
    const componentName = this.NAME;

    return dasherize(componentName) + (className ? `-${className}` : '');
  }

  _getItemsSelector(): string {
    const { filter } = this.option();

    return filter || '';
  }

  _$content(): dxElementWrapper {
    const $element = this.$element();
    const $wrapper = $element.children('.dx-template-wrapper');

    return $wrapper.length ? $wrapper : $element;
  }

  _attachEventHandlers(): void {
    if (this.option('disabled')) {
      return;
    }

    const $element = this._getEventsTarget();
    let itemsSelector = this._getItemsSelector();
    const allowMoveByClick = this.option('allowMoveByClick');
    const data = {
      direction: this.option('dragDirection'),
      immediate: this.option('immediate'),
      checkDropTarget: (
        $target: dxElementWrapper,
        event: DragEvent,
      ): boolean | string | undefined => {
        const targetGroup = this.option('group');
        const sourceGroup: string | undefined = this._getSourceDraggable().option('group');
        const $scrollable = this._getScrollable($target);

        if (
          this._verticalScrollHelper.isOutsideScrollable($scrollable, event)
          || this._horizontalScrollHelper.isOutsideScrollable($scrollable, event)
        ) {
          return false;
        }

        return sourceGroup && sourceGroup === targetGroup;
      },
    };

    if (allowMoveByClick) {
      eventsEngine.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this));
    }

    if (itemsSelector.startsWith('>')) {
      itemsSelector = itemsSelector.slice(1);
    }
    eventsEngine.on(
      $element,
      DRAGSTART_EVENT_NAME,
      itemsSelector,
      data,
      // @ts-expect-error eventsEngine is badly typed
      this._dragStartHandler.bind(this),
    );
    eventsEngine.on($element, DRAG_EVENT_NAME, data, this.dragMoveHandler.bind(this));
    eventsEngine.on($element, DRAGEND_EVENT_NAME, data, this._dragEndHandler.bind(this));
    eventsEngine.on($element, DRAG_ENTER_EVENT_NAME, data, this._dragEnterHandler.bind(this));
    eventsEngine.on($element, DRAGEND_LEAVE_EVENT_NAME, data, this._dragLeaveHandler.bind(this));

    this._subscribeKeydownHandler($element);
  }

  _getEventsTarget(): dxElementWrapper {
    return this.option('allowMoveByClick') ? this._getArea() : this._$content();
  }

  _subscribeKeydownHandler($element: dxElementWrapper): void {
    eventsEngine.off($element, KEYDOWN_EVENT_NAME);

    if (this.option('onCancelByEsc')) {
      eventsEngine.on($element, KEYDOWN_EVENT_NAME, this._keydownHandler.bind(this));
    }
  }

  _dragElementIsCloned(): boolean | undefined {
    return this._$dragElement?.hasClass(this._addWidgetPrefix(CLONE_CLASS));
  }

  _getDragTemplateArgs($element: dxElementWrapper, $container: dxElementWrapper): DragTemplateArgs {
    return {
      container: getPublicElement($container),
      model: {
        itemData: this.option('itemData'),
        itemElement: getPublicElement($element),
      },
    };
  }

  _createDragElement($element: dxElementWrapper): dxElementWrapper {
    let result = $element;
    const $container = this._getContainer();
    const { clone, dragTemplate } = this.option();

    if (dragTemplate) {
      const template = this._getTemplate(dragTemplate);
      result = $('<div>').appendTo($container);
      template.render(this._getDragTemplateArgs($element, result));
    } else if (clone) {
      result = $('<div>').appendTo($container);
      $element.clone().css({
        width: $element.css('width'),
        height: $element.css('height'),
      }).appendTo(result);
    }

    return result
      .toggleClass(this._addWidgetPrefix(CLONE_CLASS), result.get(0) !== $element.get(0))
      .toggleClass('dx-rtl', this.option().rtlEnabled);
  }

  _resetDragElement(): void {
    if (this._dragElementIsCloned()) {
      this._$dragElement?.remove();
    } else {
      this._toggleDraggingClass(false);
    }
    this._$dragElement = null;
  }

  _resetSourceElement(): void {
    this._toggleDragSourceClass(false);
    this._$sourceElement = null;
  }

  _detachEventHandlers(): void {
    eventsEngine.off(this._$content(), `.${DRAGGABLE}`);
    eventsEngine.off(this._getArea(), `.${DRAGGABLE}`);
  }

  _move(position: Partial<Offset>, $element?: dxElementWrapper | null): void {
    // @ts-expect-error the drag element can be null
    move($element || this._$dragElement, position);
  }

  _getDraggableElement(e?: DragEvent): dxElementWrapper {
    const $sourceElement = this._getSourceElement();

    if ($sourceElement) {
      return $sourceElement;
    }

    const allowMoveByClick = this.option('allowMoveByClick');
    if (allowMoveByClick) {
      return this.$element();
    }

    let $target = $(e?.target);
    const itemsSelector = this._getItemsSelector();

    if (itemsSelector.startsWith('>')) {
      const $items = this._$content().find(itemsSelector);
      if (!$items.is($target)) {
        $target = $target.closest($items);
      }
    }
    return $target;
  }

  _getSourceElement(): dxElementWrapper | null | undefined {
    const draggable = this._getSourceDraggable();

    return draggable._$sourceElement;
  }

  _pointerDownHandler(e: DragEvent): void {
    if (needSkipEvent(e)) {
      return;
    }

    const position: Partial<Offset> = {};
    const $element = this.$element();
    const { dragDirection } = this.option();

    if (dragDirection === 'horizontal' || dragDirection === 'both') {
      // @ts-expect-error offset can be undefined
      position.left = e.pageX - $element.offset().left
        + locate($element).left - getWidth($element) / 2;
    }

    if (dragDirection === 'vertical' || dragDirection === 'both') {
      // @ts-expect-error offset can be undefined
      position.top = e.pageY - $element.offset().top
        + locate($element).top - getHeight($element) / 2;
    }

    this._move(position, $element);
    this._getAction('onDragMove')(this._getEventArgs(e));
  }

  _isValidElement(event: DragEvent, $element: dxElementWrapper): boolean {
    const { handle } = this.option();
    const $target = $(event.originalEvent?.target);

    if (handle && !$target.closest(handle).length) {
      return false;
    }

    if (!$element.length) {
      return false;
    }

    return !$element.is('.dx-state-disabled, .dx-state-disabled *');
  }

  _dragStartHandler(e: DragEvent): void {
    const $element = this._getDraggableElement(e);

    if (!this._isValidElement(e, $element)) {
      e.cancel = true;
      return;
    }
    if (this._$sourceElement) {
      return;
    }

    const dragStartArgs = this._getDragStartArgs(e, $element);
    this._getAction('onDragStart')(dragStartArgs);
    if (dragStartArgs.cancel) {
      e.cancel = true;
      return;
    }

    this.dragInProgress = true;
    this.option('itemData', dragStartArgs.itemData);
    this._setSourceDraggable();

    this._$sourceElement = $element;
    let initialOffset = $element.offset();

    if (!this._hasClonedDraggable() && this.option('autoScroll')) {
      this._initScrollTop = this._getScrollableScrollTop();
      this._initScrollLeft = this._getScrollableScrollLeft();
      // @ts-expect-error offset can be undefined
      initialOffset = this._getDraggableElementOffset(initialOffset.left, initialOffset.top);
    }

    this._$dragElement = this._createDragElement($element);
    const $dragElement = this._$dragElement;

    this._toggleDraggingClass(true);
    this._toggleDragSourceClass(true);
    this._setGestureCoverCursor($dragElement.children());
    const isFixedPosition = $dragElement.css('position') === 'fixed';

    this._initPosition(extend({}, dragStartArgs, {
      dragElement: $dragElement.get(0),
      initialOffset: isFixedPosition && initialOffset,
    }));

    this._getAction('onDraggableElementShown')({
      ...dragStartArgs,
      dragElement: $dragElement,
    });

    const $area = this._getArea();
    const areaOffset = this._getAreaOffset($area);
    const boundOffset = this._getBoundOffset();
    const areaWidth = getOuterWidth($area);
    const areaHeight = getOuterHeight($area);
    const elementWidth = getWidth($dragElement);
    const elementHeight = getHeight($dragElement);

    const startOffset = {
      // @ts-expect-error offset can be undefined
      left: $dragElement.offset().left - areaOffset.left,
      // @ts-expect-error offset can be undefined
      top: $dragElement.offset().top - areaOffset.top,
    };
    if ($area.length) {
      e.maxLeftOffset = startOffset.left - boundOffset.left;
      e.maxRightOffset = areaWidth - startOffset.left - elementWidth - boundOffset.right;
      e.maxTopOffset = startOffset.top - boundOffset.top;
      e.maxBottomOffset = areaHeight - startOffset.top - elementHeight - boundOffset.bottom;
    }

    if (this.option('autoScroll')) {
      this._startAnimator();
    }
  }

  _getAreaOffset($area: dxElementWrapper): Offset {
    const offset = $area && positionUtils.offset($area);
    return offset || { left: 0, top: 0 };
  }

  _toggleDraggingClass(value: boolean): void {
    this._$dragElement?.toggleClass(this._addWidgetPrefix('dragging'), value);
  }

  _toggleDragSourceClass(value: boolean, $element?: dxElementWrapper | null): void {
    const $sourceElement = $element || this._$sourceElement;
    $sourceElement?.toggleClass(this._addWidgetPrefix('source'), value);
  }

  _setGestureCoverCursor($element: dxElementWrapper): void {
    // @ts-expect-error css value can be undefined
    $(`.${GESTURE_COVER_CLASS}`).css('cursor', $element.css('cursor'));
  }

  _getBoundOffset(): BoundOffsetQuad {
    let { boundOffset } = this.option();

    if (isFunction(boundOffset)) {
      boundOffset = boundOffset.call(this);
    }

    return quadToObject(boundOffset);
  }

  _getArea(): dxElementWrapper {
    let { boundary: area } = this.option();

    if (isFunction(area)) {
      area = area.call(this);
    }
    return $(area);
  }

  _getContainer(): dxElementWrapper {
    let { container } = this.option();

    if (container === undefined) {
      container = viewPort();
    }

    return $(container);
  }

  _getDraggableElementOffset(initialOffsetX: number, initialOffsetY: number): Offset {
    const initScrollTop = this._initScrollTop;
    const initScrollLeft = this._initScrollLeft;

    const scrollTop = this._getScrollableScrollTop();
    const scrollLeft = this._getScrollableScrollLeft();

    const elementPosition = $(this.element()).css('position');
    const isFixedPosition = elementPosition === 'fixed';

    const result: Offset = {
      left: (this._startPosition?.left ?? 0) + initialOffsetX,
      top: (this._startPosition?.top ?? 0) + initialOffsetY,
    };

    if (isFixedPosition || this._hasClonedDraggable()) {
      return result;
    }

    return {
      left: isNumeric(scrollLeft)
        ? result.left + scrollLeft - initScrollLeft
        : result.left,
      top: isNumeric(scrollTop)
        ? result.top + scrollTop - initScrollTop
        : result.top,
    };
  }

  _hasClonedDraggable(): boolean | Properties['dragTemplate'] {
    const { clone, dragTemplate } = this.option();

    return clone || dragTemplate;
  }

  public dragMoveHandler(e: DragEvent): void {
    this._allowNativeScrollingWhenNotDragging(e);
    this._dragMoveEvent = e;

    if (!this._$dragElement) {
      e.cancel = true;
      return;
    }

    this._moveDragElement(e);
    this._updateScrollable(e);

    const eventArgs = this._getEventArgs(e);
    this._getAction('onDragMove')(eventArgs);

    if (eventArgs.cancel === true) {
      return;
    }

    this._getTargetDraggable().dragMove(e);
  }

  // Without an active drag the gesture emitter must not call preventDefault on the
  // move event, otherwise native scrolling is blocked on touch devices (T1329643).
  private _allowNativeScrollingWhenNotDragging(e: DragEvent): void {
    if (!this.dragInProgress) {
      e._cancelPreventDefault = true;
    }
  }

  private _moveDragElement(e: DragEvent): void {
    const offset = this._getDraggableElementOffset(e.offset?.x ?? 0, e.offset?.y ?? 0);

    this._move(offset);
  }

  private _updateScrollable(e: DragEvent): void {
    if (this.option('autoScroll')) {
      const mousePosition = getMousePosition(e);
      const allObjects = domAdapter.elementsFromPoint(
        mousePosition.x,
        mousePosition.y,
        // @ts-expect-error get is declared to return Element
        this.$element().get(0),
      );

      this._verticalScrollHelper.updateScrollable(allObjects, mousePosition);
      this._horizontalScrollHelper.updateScrollable(allObjects, mousePosition);
    }
  }

  _getScrollable($element: dxElementWrapper): dxElementWrapper | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let $scrollable: dxElementWrapper | undefined;

    $element.parents().toArray().some((parent) => {
      const $parent = $(parent);

      if (
        this._horizontalScrollHelper.isScrollable($parent)
        || this._verticalScrollHelper.isScrollable($parent)
      ) {
        $scrollable = $parent;

        return true;
      }

      return false;
    });

    return $scrollable;
  }

  _getScrollableScrollTop(): number {
    // @ts-expect-error scrollTop is declared to return the wrapper
    return this._getScrollable($(this.element()))?.scrollTop() ?? 0;
  }

  _getScrollableScrollLeft(): number {
    // @ts-expect-error scrollLeft is declared to return the wrapper
    return this._getScrollable($(this.element()))?.scrollLeft() ?? 0;
  }

  _defaultActionArgs(): DefaultActionArgs<unknown> {
    const args = super._defaultActionArgs();
    const component = this.option('component');

    if (component) {
      args.component = component;
      // @ts-expect-error component is unknown
      args.element = component.element();
    }

    return args;
  }

  _getEventArgs(e: DragEvent): DragEventArgs {
    const sourceDraggable = this._getSourceDraggable();
    const targetDraggable = this._getTargetDraggable();

    return {
      event: e,
      itemData: sourceDraggable.option('itemData'),
      // @ts-expect-error the source element can be null
      itemElement: getPublicElement<HTMLElement>(sourceDraggable._$sourceElement),
      fromComponent: sourceDraggable.option('component') || sourceDraggable,
      toComponent: targetDraggable.option('component') || targetDraggable,
      fromData: sourceDraggable.option('data'),
      toData: targetDraggable.option('data'),
    };
  }

  _getDragStartArgs(e: DragEvent, $itemElement: dxElementWrapper): DragStartArgs {
    const args = this._getEventArgs(e);

    return {
      event: args.event,
      itemData: args.itemData,
      itemElement: $itemElement,
      fromData: args.fromData,
    };
  }

  _revertItemToInitialPosition(): void {
    if (!this._dragElementIsCloned()) {
      // @ts-expect-error _initialLocate is set when the drag starts
      this._move(this._initialLocate, this._$sourceElement);
    }
  }

  _dragEndHandler(e: DragEvent): void {
    const d = Deferred();
    const dragEndEventArgs = this._getEventArgs(e);
    const dropEventArgs = this._getEventArgs(e);
    const targetDraggable = this._getTargetDraggable();
    let needRevertPosition = true;
    this.dragInProgress = false;

    try {
      this._getAction('onDragEnd')(dragEndEventArgs);
    } finally {
      when(fromPromise(dragEndEventArgs.cancel))
        .done((cancel) => {
          if (!cancel) {
            if (targetDraggable !== this) {
              targetDraggable._getAction('onDrop')(dropEventArgs);
            }

            if (!dropEventArgs.cancel) {
              needRevertPosition = false;
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              when(fromPromise(targetDraggable.dragEnd(dragEndEventArgs))).always(d.resolve);
              return;
            }
          }
          d.resolve();
        })
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .fail(d.resolve);

      d.done(() => {
        if (needRevertPosition) {
          this._revertItemToInitialPosition();
        }

        this._resetDragOptions(targetDraggable);
      });
    }
  }

  _isTargetOverAnotherDraggable(e: DragEvent): boolean {
    const sourceDraggable = this._getSourceDraggable();

    if (this === sourceDraggable) {
      return false;
    }

    const $dragElement = sourceDraggable._$dragElement;
    const $sourceDraggableElement = sourceDraggable.$element();
    const $targetDraggableElement = this.$element();

    const mousePosition = getMousePosition(e);
    const elements = domAdapter.elementsFromPoint(mousePosition.x, mousePosition.y, this.element());
    const firstWidgetElement = elements.filter((element) => {
      const $element = $(element);

      if ($element.hasClass(this._addWidgetPrefix())) {
        // @ts-expect-error $dragElement can be null
        return !$element.closest($dragElement).length;
      }

      return false;
    })[0];

    const $sourceElement = this._getSourceElement();
    const isTargetOverItself = firstWidgetElement === $sourceDraggableElement.get(0);
    // @ts-expect-error $sourceElement can be null
    const isTargetOverNestedDraggable = $(firstWidgetElement).closest($sourceElement).length;

    return !firstWidgetElement || (
      firstWidgetElement === $targetDraggableElement.get(0)
      && !isTargetOverItself
      && !isTargetOverNestedDraggable
    );
  }

  _dragEnterHandler(e: DragEvent): void {
    this._fireDragEnterEvent(e);

    if (this._isTargetOverAnotherDraggable(e)) {
      this._setTargetDraggable();
    }

    const sourceDraggable = this._getSourceDraggable();
    sourceDraggable.dragEnter(e);
  }

  _dragLeaveHandler(e: DragEvent): void {
    this._fireDragLeaveEvent(e);

    this._resetTargetDraggable();

    if (this !== this._getSourceDraggable()) {
      this.reset();
    }

    const sourceDraggable = this._getSourceDraggable();
    sourceDraggable.dragLeave(e);
  }

  _keydownHandler(e: DragEvent): void {
    if (this.dragInProgress && e.key === 'Escape') {
      this._keydownEscapeHandler(e);
    }
  }

  _keydownEscapeHandler(e: DragEvent): void {
    const $sourceElement = this._getSourceElement();
    if (!$sourceElement) {
      return;
    }

    const dragCancelEventArgs = this._getEventArgs(e);
    this._getAction('onDragCancel')(dragCancelEventArgs);

    if (dragCancelEventArgs.cancel) {
      return;
    }

    this.dragInProgress = false;
    activeSourceDraggable?._toggleDraggingClass(false);
    this._detachEventHandlers();
    this._revertItemToInitialPosition();
    const targetDraggable = this._getTargetDraggable();
    this._resetDragOptions(targetDraggable);
    this._attachEventHandlers();
  }

  _getAction(name: string): ActionFn {
    const action: ActionFn | undefined = this[`_${name}Action`];

    return action || this._createActionByOption(name);
  }

  _getAnonymousTemplateName(): string {
    return ANONYMOUS_TEMPLATE_NAME;
  }

  _initTemplates(): void {
    if (!this.option('contentTemplate')) return;

    this._templateManager.addDefaultTemplates({
      content: new EmptyTemplate(),
    });
    super._initTemplates();
  }

  _render(): void {
    super._render();
    this.$element().addClass(this._addWidgetPrefix());

    const transclude = this._templateManager.anonymousTemplateName === this.option('contentTemplate');
    const template = this._getTemplateByOption('contentTemplate');

    if (template) {
      $(template.render({
        container: this.element(),
        transclude,
      }));
    }
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name } = args;

    switch (name) {
      case 'onDragStart':
      case 'onDragMove':
      case 'onDragEnd':
      case 'onDrop':
      case 'onDragEnter':
      case 'onDragLeave':
      case 'onDragCancel':
      case 'onDraggableElementShown':
        // @ts-expect-error the action properties are not declared
        this[`_${name}Action`] = this._createActionByOption(name);
        break;
      case 'dragTemplate':
      case 'contentTemplate':
      case 'container':
      case 'clone':
        break;
      case 'allowMoveByClick':
      case 'dragDirection':
      case 'disabled':
      case 'boundary':
      case 'filter':
      case 'immediate':
        this._resetDragElement();
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'onCancelByEsc':
        if (!this.option('disabled')) {
          this._subscribeKeydownHandler(this._getEventsTarget());
        }
        break;
      case 'autoScroll':
        this._verticalScrollHelper.reset();
        this._horizontalScrollHelper.reset();
        break;
      case 'scrollSensitivity':
      case 'scrollSpeed':
      case 'boundOffset':
      case 'handle':
      case 'group':
      case 'data':
      case 'itemData':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _getTargetDraggable(): AnyDraggable {
    return activeTargetDraggable || this;
  }

  _getSourceDraggable(): AnyDraggable {
    return activeSourceDraggable || this;
  }

  _setTargetDraggable(): void {
    const currentGroup = this.option('group');
    const sourceDraggable = this._getSourceDraggable();

    if (currentGroup && currentGroup === sourceDraggable.option('group')) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      activeTargetDraggable = this;
    }
  }

  _setSourceDraggable(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeSourceDraggable = this;
  }

  _resetSourceDraggable(): void {
    activeSourceDraggable = null;
  }

  _resetTargetDraggable(): void {
    activeTargetDraggable = null;
  }

  _resetDragOptions(targetDraggable: AnyDraggable): void {
    this.reset();
    targetDraggable.reset();
    this._stopAnimator();
    this._horizontalScrollHelper.reset();
    this._verticalScrollHelper.reset();

    this._resetDragElement();
    this._resetSourceElement();

    this._resetTargetDraggable();
    this._resetSourceDraggable();
  }

  _dispose(): void {
    super._dispose();
    this._detachEventHandlers();
    this._resetDragElement();
    this._resetTargetDraggable();
    this._resetSourceDraggable();
    this._$sourceElement = null;
    this._stopAnimator();
  }

  /// #DEBUG
  // Test-only accessor, removed from production builds.
  getDragInProgress(): boolean {
    return !!this.dragInProgress;
  }
  /// #ENDDEBUG

  _fireDragEnterEvent(sourceEvent: DragEvent): void {
    const args = this._getEventArgs(sourceEvent);

    this._getAction('onDragEnter')(args);
  }

  _fireDragLeaveEvent(sourceEvent: DragEvent): void {
    const args = this._getEventArgs(sourceEvent);

    this._getAction('onDragLeave')(args);
  }
}

registerComponent(DRAGGABLE, Draggable);

export default Draggable;
