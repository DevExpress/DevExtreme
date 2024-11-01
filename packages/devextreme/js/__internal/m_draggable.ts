import positionUtils from '@js/common/core/animation/position';
import { locate, move } from '@js/common/core/animation/translator';
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
import domAdapter from '@js/core/dom_adapter';
import DOMComponent from '@js/core/dom_component';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
// @ts-expect-error
import { noop, splitPair } from '@js/core/utils/common';
// @ts-expect-error
import { Deferred, fromPromise, when } from '@js/core/utils/deferred';
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

import Animator from './ui/scroll_view/m_animator';

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

let targetDraggable;
let sourceDraggable;

const ANONYMOUS_TEMPLATE_NAME = 'content';

const getMousePosition = (event) => ({
  // @ts-expect-error
  x: event.pageX - $(window).scrollLeft(),
  // @ts-expect-error
  y: event.pageY - $(window).scrollTop(),
});

const GESTURE_COVER_CLASS = 'dx-gesture-cover';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';

interface Offset {
  left: number;
  top: number;
}

class ScrollHelper {
  private _preventScroll: boolean;

  private readonly _component: any;

  private readonly _scrollValue: string;

  private readonly _overFlowAttr: string;

  private readonly _sizeAttr: string;

  private readonly _scrollSizeProp: string;

  private readonly _clientSizeProp: string;

  private readonly _limitProps: { start: string; end: string };

  private _$scrollableAtPointer: dxElementWrapper | null = null;

  private _scrollSpeed: number | undefined;

  constructor(orientation, component) {
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

  updateScrollable(elements, mousePosition) {
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

  isScrolling() {
    return !!this._scrollSpeed;
  }

  isScrollable($element) {
    return ($element.css(this._overFlowAttr) === 'auto' || $element.hasClass('dx-scrollable-container'))
            && $element.prop(this._scrollSizeProp) > Math.ceil(this._sizeAttr === 'width' ? getWidth($element) : getHeight($element));
  }

  _trySetScrollable(element, mousePosition) {
    const that = this;
    const $element = $(element);
    let distanceToBorders;
    const sensitivity = that._component.option('scrollSensitivity');
    let isScrollable = that.isScrollable($element);

    if (isScrollable) {
      distanceToBorders = that._calculateDistanceToBorders($element, mousePosition);

      if (sensitivity > distanceToBorders[that._limitProps.start]) {
        if (!that._preventScroll) {
          that._scrollSpeed = -that._calculateScrollSpeed(distanceToBorders[that._limitProps.start]);
          that._$scrollableAtPointer = $element;
        }
      } else if (sensitivity > distanceToBorders[that._limitProps.end]) {
        if (!that._preventScroll) {
          that._scrollSpeed = that._calculateScrollSpeed(distanceToBorders[that._limitProps.end]);
          that._$scrollableAtPointer = $element;
        }
      } else {
        isScrollable = false;
        that._preventScroll = false;
      }
    }

    return isScrollable;
  }

  _calculateDistanceToBorders($area, mousePosition) {
    const area = $area.get(0);
    let areaBoundingRect;

    if (area) {
      areaBoundingRect = getBoundingRect(area);

      return {
        left: mousePosition.x - areaBoundingRect.left,
        top: mousePosition.y - areaBoundingRect.top,
        right: areaBoundingRect.right - mousePosition.x,
        bottom: areaBoundingRect.bottom - mousePosition.y,
      };
    }
    return {};
  }

  _calculateScrollSpeed(distance) {
    const component = this._component;
    const sensitivity = component.option('scrollSensitivity');
    const maxSpeed = component.option('scrollSpeed');

    return Math.ceil(((sensitivity - distance) / sensitivity) ** 2 * maxSpeed);
  }

  scrollByStep() {
    const that = this;

    if (that._$scrollableAtPointer && that._scrollSpeed) {
      if (that._$scrollableAtPointer.hasClass('dx-scrollable-container')) {
        const $scrollable = that._$scrollableAtPointer.closest('.dx-scrollable');
        const scrollableInstance: any = $scrollable.data('dxScrollable') || $scrollable.data('dxScrollView');

        if (scrollableInstance) {
          const nextScrollPosition = scrollableInstance.scrollOffset()[that._limitProps.start] + that._scrollSpeed;

          scrollableInstance.scrollTo({ [that._limitProps.start]: nextScrollPosition });
        }
      } else {
        const nextScrollPosition = that._$scrollableAtPointer[that._scrollValue]() + that._scrollSpeed;

        that._$scrollableAtPointer[that._scrollValue](nextScrollPosition);
      }

      const dragMoveArgs = that._component._dragMoveArgs;
      if (dragMoveArgs) {
        that._component._dragMoveHandler(dragMoveArgs);
      }
    }
  }

  reset() {
    this._$scrollableAtPointer = null;
    this._scrollSpeed = 0;
    this._preventScroll = true;
  }

  isOutsideScrollable($scrollable, event) {
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

const ScrollAnimator = Animator.inherit({

  ctor(strategy) {
    this.callBase();

    this._strategy = strategy;
  },

  _step() {
    const horizontalScrollHelper = this._strategy._horizontalScrollHelper;
    const verticalScrollHelper = this._strategy._verticalScrollHelper;

    horizontalScrollHelper && horizontalScrollHelper.scrollByStep();
    verticalScrollHelper && verticalScrollHelper.scrollByStep();
  },
});

const Draggable = (DOMComponent as any).inherit({
  reset: noop,

  dragMove: noop,

  dragEnter: noop,

  dragLeave: noop,

  dragEnd(sourceEvent) {
    const sourceDraggable = this._getSourceDraggable();

    sourceDraggable._fireRemoveEvent(sourceEvent);

    return Deferred().resolve();
  },

  _fireRemoveEvent: noop,

  _getDefaultOptions() {
    return extend(this.callBase(), {
      onDragStart: null,
      onDragMove: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragLeave: null,
      onDragCancel: null,
      onCancelByEsc: false,
      onDrop: null,
      immediate: true,
      dragDirection: 'both',
      boundary: undefined,
      boundOffset: 0,
      allowMoveByClick: false,
      itemData: null,
      container: undefined,
      dragTemplate: undefined,
      contentTemplate: 'content',
      handle: '',
      filter: '',
      clone: false,
      autoScroll: true,
      scrollSpeed: 30,
      scrollSensitivity: 60,
      group: undefined,
      data: undefined,
    });
  },

  _setOptionsByReference() {
    this.callBase.apply(this, arguments);

    extend(this._optionsByReference, {
      component: true,
      group: true,
      itemData: true,
      data: true,
    });
  },

  _init() {
    this.callBase();
    this._attachEventHandlers();

    this._scrollAnimator = new ScrollAnimator(this);

    this._horizontalScrollHelper = new ScrollHelper('horizontal', this);
    this._verticalScrollHelper = new ScrollHelper('vertical', this);

    this._initScrollTop = 0;
    this._initScrollLeft = 0;
  },

  _normalizeCursorOffset(offset) {
    if (isObject(offset)) {
      offset = {
        h: (offset as any).x,
        v: (offset as any).y,
      };
    }
    offset = splitPair(offset).map((value) => parseFloat(value));

    return {
      left: offset[0],
      top: offset.length === 1 ? offset[0] : offset[1],
    };
  },

  _getNormalizedCursorOffset(offset, options) {
    if (isFunction(offset)) {
      offset = offset.call(this, options);
    }

    return this._normalizeCursorOffset(offset);
  },

  _calculateElementOffset(options) {
    let elementOffset;
    let dragElementOffset;
    const { event } = options;
    const $element = $(options.itemElement);
    const $dragElement = $(options.dragElement);
    const isCloned = this._dragElementIsCloned();
    const cursorOffset = this.option('cursorOffset');
    let normalizedCursorOffset = { left: 0, top: 0 };
    const currentLocate = this._initialLocate = locate($dragElement);

    if (isCloned || options.initialOffset || cursorOffset) {
      elementOffset = options.initialOffset || $element.offset();

      if (cursorOffset) {
        normalizedCursorOffset = this._getNormalizedCursorOffset(cursorOffset, options);

        if (isFinite(normalizedCursorOffset.left)) {
          elementOffset.left = event.pageX;
        }

        if (isFinite(normalizedCursorOffset.top)) {
          elementOffset.top = event.pageY;
        }
      }

      dragElementOffset = $dragElement.offset();
      elementOffset.top -= dragElementOffset.top + (normalizedCursorOffset.top || 0) - currentLocate.top;
      elementOffset.left -= dragElementOffset.left + (normalizedCursorOffset.left || 0) - currentLocate.left;
    }

    return elementOffset;
  },

  _initPosition(options) {
    const $dragElement = $(options.dragElement);
    const elementOffset = this._calculateElementOffset(options);

    if (elementOffset) {
      this._move(elementOffset, $dragElement);
    }

    this._startPosition = locate($dragElement);
  },

  _startAnimator() {
    if (!this._scrollAnimator.inProgress()) {
      this._scrollAnimator.start();
    }
  },

  _stopAnimator() {
    this._scrollAnimator.stop();
  },

  _addWidgetPrefix(className) {
    const componentName = this.NAME;

    return dasherize(componentName) + (className ? `-${className}` : '');
  },

  _getItemsSelector() {
    return this.option('filter') || '';
  },

  _$content() {
    const $element = this.$element();
    const $wrapper = $element.children('.dx-template-wrapper');

    return $wrapper.length ? $wrapper : $element;
  },

  _attachEventHandlers() {
    if (this.option('disabled')) {
      return;
    }

    let $element = this._$content();
    let itemsSelector = this._getItemsSelector();
    const allowMoveByClick = this.option('allowMoveByClick');
    const data = {
      direction: this.option('dragDirection'),
      immediate: this.option('immediate'),
      checkDropTarget: ($target, event) => {
        const targetGroup = this.option('group');
        const sourceGroup = this._getSourceDraggable().option('group');
        const $scrollable = this._getScrollable($target);

        if (this._verticalScrollHelper.isOutsideScrollable($scrollable, event) || this._horizontalScrollHelper.isOutsideScrollable($scrollable, event)) {
          return false;
        }

        return sourceGroup && sourceGroup === targetGroup;
      },
    };

    if (allowMoveByClick) {
      $element = this._getArea();
      eventsEngine.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this));
    }

    if (itemsSelector[0] === '>') {
      itemsSelector = itemsSelector.slice(1);
    }
    // @ts-expect-error
    eventsEngine.on($element, DRAGSTART_EVENT_NAME, itemsSelector, data, this._dragStartHandler.bind(this));
    eventsEngine.on($element, DRAG_EVENT_NAME, data, this._dragMoveHandler.bind(this));
    eventsEngine.on($element, DRAGEND_EVENT_NAME, data, this._dragEndHandler.bind(this));
    eventsEngine.on($element, DRAG_ENTER_EVENT_NAME, data, this._dragEnterHandler.bind(this));
    eventsEngine.on($element, DRAGEND_LEAVE_EVENT_NAME, data, this._dragLeaveHandler.bind(this));

    if (this.option('onCancelByEsc')) {
      eventsEngine.on($element, KEYDOWN_EVENT_NAME, this._keydownHandler.bind(this));
    }
  },

  _dragElementIsCloned() {
    return this._$dragElement && this._$dragElement.hasClass(this._addWidgetPrefix(CLONE_CLASS));
  },

  _getDragTemplateArgs($element, $container) {
    return {
      container: getPublicElement($container),
      model: {
        itemData: this.option('itemData'),
        itemElement: getPublicElement($element),
      },
    };
  },

  _createDragElement($element) {
    let result = $element;
    const clone = this.option('clone');
    const $container = this._getContainer();
    let template = this.option('dragTemplate');

    if (template) {
      template = this._getTemplate(template);
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
      .toggleClass('dx-rtl', this.option('rtlEnabled'));
  },

  _resetDragElement() {
    if (this._dragElementIsCloned()) {
      this._$dragElement.remove();
    } else {
      this._toggleDraggingClass(false);
    }
    this._$dragElement = null;
  },

  _resetSourceElement() {
    this._toggleDragSourceClass(false);
    this._$sourceElement = null;
  },

  _detachEventHandlers() {
    eventsEngine.off(this._$content(), `.${DRAGGABLE}`);
    eventsEngine.off(this._getArea(), `.${DRAGGABLE}`);
  },

  _move(position, $element) {
    move($element || this._$dragElement, position);
  },

  _getDraggableElement(e) {
    const $sourceElement = this._getSourceElement();

    if ($sourceElement) {
      return $sourceElement;
    }

    const allowMoveByClick = this.option('allowMoveByClick');
    if (allowMoveByClick) {
      return this.$element();
    }

    let $target = $(e && e.target);
    const itemsSelector = this._getItemsSelector();

    if (itemsSelector[0] === '>') {
      const $items = this._$content().find(itemsSelector);
      if (!$items.is($target)) {
        $target = $target.closest($items);
      }
    }
    return $target;
  },

  _getSourceElement() {
    const draggable = this._getSourceDraggable();

    return draggable._$sourceElement;
  },

  _pointerDownHandler(e) {
    if (needSkipEvent(e)) {
      return;
    }

    const position: any = {};
    const $element = this.$element();
    const dragDirection = this.option('dragDirection');

    if (dragDirection === 'horizontal' || dragDirection === 'both') {
      position.left = e.pageX - $element.offset().left + locate($element).left - getWidth($element) / 2;
    }

    if (dragDirection === 'vertical' || dragDirection === 'both') {
      position.top = e.pageY - $element.offset().top + locate($element).top - getHeight($element) / 2;
    }

    this._move(position, $element);
    this._getAction('onDragMove')(this._getEventArgs(e));
  },

  _isValidElement(event, $element) {
    const handle = this.option('handle');
    const $target = $(event.originalEvent && event.originalEvent.target);

    if (handle && !$target.closest(handle).length) {
      return false;
    }

    if (!$element.length) {
      return false;
    }

    return !$element.is('.dx-state-disabled, .dx-state-disabled *');
  },

  _dragStartHandler(e) {
    const $element = this._getDraggableElement(e);
    this.dragInProgress = true;

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

    this.option('itemData', dragStartArgs.itemData);
    this._setSourceDraggable();

    this._$sourceElement = $element;
    let initialOffset = $element.offset();

    if (!this._hasClonedDraggable() && this.option('autoScroll')) {
      this._initScrollTop = this._getScrollableScrollTop();
      this._initScrollLeft = this._getScrollableScrollLeft();
      initialOffset = this._getDraggableElementOffset(initialOffset.left, initialOffset.top);
    }

    const $dragElement = this._$dragElement = this._createDragElement($element);

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
      left: $dragElement.offset().left - areaOffset.left,
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
  },

  _getAreaOffset($area) {
    const offset = $area && (positionUtils as any).offset($area);
    return offset || { left: 0, top: 0 };
  },

  _toggleDraggingClass(value) {
    this._$dragElement && this._$dragElement.toggleClass(this._addWidgetPrefix('dragging'), value);
  },

  _toggleDragSourceClass(value, $element) {
    const $sourceElement = $element || this._$sourceElement;
    $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix('source'), value);
  },

  _setGestureCoverCursor($element) {
    $(`.${GESTURE_COVER_CLASS}`).css('cursor', $element.css('cursor'));
  },

  _getBoundOffset() {
    let boundOffset = this.option('boundOffset');

    if (isFunction(boundOffset)) {
      boundOffset = boundOffset.call(this);
    }

    return quadToObject(boundOffset);
  },

  _getArea() {
    let area = this.option('boundary');

    if (isFunction(area)) {
      area = area.call(this);
    }
    return $(area);
  },

  _getContainer() {
    let container = this.option('container');

    if (container === undefined) {
      container = viewPort();
    }

    return $(container);
  },

  _getDraggableElementOffset(initialOffsetX: number, initialOffsetY: number): Offset {
    const initScrollTop = this._initScrollTop;
    const initScrollLeft = this._initScrollLeft;

    const scrollTop = this._getScrollableScrollTop();
    const scrollLeft = this._getScrollableScrollLeft();

    const elementPosition = ($(this.element()) as any).css('position');
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
  },

  _hasClonedDraggable() {
    return this.option('clone') || this.option('dragTemplate');
  },

  _dragMoveHandler(e) {
    this._dragMoveArgs = e;
    if (!this._$dragElement) {
      e.cancel = true;
      return;
    }

    const offset = this._getDraggableElementOffset(e.offset.x, e.offset.y);

    this._move(offset);
    this._updateScrollable(e);

    const eventArgs = this._getEventArgs(e);
    this._getAction('onDragMove')(eventArgs);

    if (eventArgs.cancel === true) {
      return;
    }

    const targetDraggable = this._getTargetDraggable();
    targetDraggable.dragMove(e, scrollBy);
  },

  _updateScrollable(e) {
    const that = this;

    if (that.option('autoScroll')) {
      const mousePosition = getMousePosition(e);
      const allObjects = (domAdapter as any).elementsFromPoint(mousePosition.x, mousePosition.y, this.$element().get(0));

      that._verticalScrollHelper.updateScrollable(allObjects, mousePosition);
      that._horizontalScrollHelper.updateScrollable(allObjects, mousePosition);
    }
  },

  _getScrollable($element) {
    let $scrollable;

    $element.parents().toArray().some((parent) => {
      const $parent = $(parent);

      if (this._horizontalScrollHelper.isScrollable($parent) || this._verticalScrollHelper.isScrollable($parent)) {
        $scrollable = $parent;

        return true;
      }

      return false;
    });

    return $scrollable;
  },

  _getScrollableScrollTop() {
    return this._getScrollable($(this.element()))?.scrollTop() ?? 0;
  },

  _getScrollableScrollLeft() {
    return this._getScrollable($(this.element()))?.scrollLeft() ?? 0;
  },

  _defaultActionArgs() {
    const args = this.callBase.apply(this, arguments);
    const component = this.option('component');

    if (component) {
      args.component = component;
      args.element = component.element();
    }

    return args;
  },

  _getEventArgs(e) {
    const sourceDraggable = this._getSourceDraggable();
    const targetDraggable = this._getTargetDraggable();

    return {
      event: e,
      itemData: sourceDraggable.option('itemData'),
      itemElement: getPublicElement(sourceDraggable._$sourceElement),
      fromComponent: sourceDraggable.option('component') || sourceDraggable,
      toComponent: targetDraggable.option('component') || targetDraggable,
      fromData: sourceDraggable.option('data'),
      toData: targetDraggable.option('data'),
    };
  },

  _getDragStartArgs(e, $itemElement) {
    const args = this._getEventArgs(e);

    return {
      event: args.event,
      itemData: args.itemData,
      itemElement: $itemElement,
      fromData: args.fromData,
    };
  },

  _revertItemToInitialPosition() {
    !this._dragElementIsCloned() && this._move(this._initialLocate, this._$sourceElement);
  },

  _dragEndHandler(e) {
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
  },

  _isTargetOverAnotherDraggable(e) {
    const sourceDraggable = this._getSourceDraggable();

    if (this === sourceDraggable) {
      return false;
    }

    const $dragElement = sourceDraggable._$dragElement;
    const $sourceDraggableElement = sourceDraggable.$element();
    const $targetDraggableElement = this.$element();

    const mousePosition = getMousePosition(e);
    const elements = (domAdapter as any).elementsFromPoint(mousePosition.x, mousePosition.y, this.element());
    const firstWidgetElement = elements.filter((element) => {
      const $element = $(element);

      if ($element.hasClass(this._addWidgetPrefix())) {
        return !$element.closest($dragElement).length;
      }

      return false;
    })[0];

    const $sourceElement = this._getSourceElement();
    const isTargetOverItself = firstWidgetElement === $sourceDraggableElement.get(0);
    const isTargetOverNestedDraggable = $(firstWidgetElement).closest($sourceElement).length;

    return !firstWidgetElement || firstWidgetElement === $targetDraggableElement.get(0) && !isTargetOverItself && !isTargetOverNestedDraggable;
  },

  _dragEnterHandler(e) {
    this._fireDragEnterEvent(e);

    if (this._isTargetOverAnotherDraggable(e)) {
      this._setTargetDraggable();
    }

    const sourceDraggable = this._getSourceDraggable();
    sourceDraggable.dragEnter(e);
  },

  _dragLeaveHandler(e) {
    this._fireDragLeaveEvent(e);

    this._resetTargetDraggable();

    if (this !== this._getSourceDraggable()) {
      this.reset();
    }

    const sourceDraggable = this._getSourceDraggable();
    sourceDraggable.dragLeave(e);
  },

  _keydownHandler(e) {
    if (this.dragInProgress && e.key === 'Escape') {
      this._keydownEscapeHandler(e);
    }
  },

  _keydownEscapeHandler(e) {
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
    sourceDraggable?._toggleDraggingClass(false);
    this._detachEventHandlers();
    this._revertItemToInitialPosition();
    const targetDraggable = this._getTargetDraggable();
    this._resetDragOptions(targetDraggable);
    this._attachEventHandlers();
  },

  _getAction(name) {
    return this[`_${name}Action`] || this._createActionByOption(name);
  },

  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },

  _initTemplates() {
    if (!this.option('contentTemplate')) return;

    this._templateManager.addDefaultTemplates({
      content: new EmptyTemplate(),
    });
    this.callBase.apply(this, arguments);
  },

  _render() {
    this.callBase();
    this.$element().addClass(this._addWidgetPrefix());

    const transclude = this._templateManager.anonymousTemplateName === this.option('contentTemplate');
    const template = this._getTemplateByOption('contentTemplate');

    if (template) {
      $(template.render({
        container: this.element(),
        transclude,
      }));
    }
  },

  _optionChanged(args) {
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
        this._keydownHandler();
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
        this.callBase(args);
    }
  },

  _getTargetDraggable() {
    return targetDraggable || this;
  },

  _getSourceDraggable() {
    return sourceDraggable || this;
  },

  _setTargetDraggable() {
    const currentGroup = this.option('group');
    const sourceDraggable = this._getSourceDraggable();

    if (currentGroup && currentGroup === sourceDraggable.option('group')) {
      targetDraggable = this;
    }
  },

  _setSourceDraggable() {
    sourceDraggable = this;
  },

  _resetSourceDraggable() {
    sourceDraggable = null;
  },

  _resetTargetDraggable() {
    targetDraggable = null;
  },

  _resetDragOptions(targetDraggable) {
    this.reset();
    targetDraggable.reset();
    this._stopAnimator();
    this._horizontalScrollHelper.reset();
    this._verticalScrollHelper.reset();

    this._resetDragElement();
    this._resetSourceElement();

    this._resetTargetDraggable();
    this._resetSourceDraggable();
  },

  _dispose() {
    this.callBase();
    this._detachEventHandlers();
    this._resetDragElement();
    this._resetTargetDraggable();
    this._resetSourceDraggable();
    this._$sourceElement = null;
    this._stopAnimator();
  },

  _fireDragEnterEvent(sourceEvent) {
    const args = this._getEventArgs(sourceEvent);

    this._getAction('onDragEnter')(args);
  },

  _fireDragLeaveEvent(sourceEvent) {
    const args = this._getEventArgs(sourceEvent);

    this._getAction('onDragLeave')(args);
  },
});

registerComponent(DRAGGABLE, Draggable);

export default Draggable;
