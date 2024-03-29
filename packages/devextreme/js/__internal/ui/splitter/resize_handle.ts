import type { DragDirection } from '@js/common';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { name as CLICK_EVENT } from '@js/events/click';
import eventsEngine from '@js/events/core/events_engine';
import { name as DOUBLE_CLICK_EVENT } from '@js/events/double_click';
import { end as dragEventEnd, move as dragEventMove, start as dragEventStart } from '@js/events/drag';
import { addNamespace, isCommandKeyPressed } from '@js/events/utils/index';
import Widget from '@js/ui/widget/ui.widget';

import {
  COLLAPSE_EVENT,
  getActionNameByEventName,
  RESIZE_EVENT,
} from './utils/event';
import type { ResizeOffset } from './utils/types';

export const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const RESIZE_HANDLE_RESIZABLE_CLASS = 'dx-resize-handle-resizable';
const HORIZONTAL_DIRECTION_CLASS = 'dx-resize-handle-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-resize-handle-vertical';
const RESIZE_HANDLE_ICON_CLASS = 'dx-resize-handle-icon';
const RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = 'dx-resize-handle-collapse-prev-pane';
const RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = 'dx-resize-handle-collapse-next-pane';
const ICON_CLASS = 'dx-icon';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';

const RESIZE_HANDLER_MODULE_NAMESPACE = 'dxResizeHandle';

const RESIZE_DIRECTION: Record<string, DragDirection> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

const KEYBOARD_DELTA = 5;
const INACTIVE_RESIZE_HANDLE_SIZE = 2;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ResizeHandle extends (Widget as any) {
  _supportedKeys(): Record<string, unknown> {
    return extend(super._supportedKeys(), {
      rightArrow(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        const { direction, showCollapseNext } = this.option();

        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.vertical || showCollapseNext === false) {
            return;
          }
          this._collapseNextHandler(e);
        } else {
          this._resizeBy(e, { x: KEYBOARD_DELTA });
        }
      },
      leftArrow(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        const { direction, showCollapsePrev } = this.option();

        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.vertical || showCollapsePrev === false) {
            return;
          }
          this._collapsePrevHandler(e);
        } else {
          this._resizeBy(e, { x: -KEYBOARD_DELTA });
        }
      },
      upArrow(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        const { direction, showCollapsePrev } = this.option();

        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.horizontal || showCollapsePrev === false) {
            return;
          }
          this._collapsePrevHandler(e);
        } else {
          this._resizeBy(e, { y: -KEYBOARD_DELTA });
        }
      },
      downArrow(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        const { direction, showCollapseNext } = this.option();

        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.horizontal || showCollapseNext === false) {
            return;
          }
          this._collapseNextHandler(e);
        } else {
          this._resizeBy(e, { y: KEYBOARD_DELTA });
        }
      },
    }) as Record<string, unknown>;
  }

  _getDefaultOptions(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      direction: RESIZE_DIRECTION.horizontal,
      hoverStateEnabled: true,
      focusStateEnabled: true,
      activeStateEnabled: true,
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
      resizable: true,
      showCollapsePrev: true,
      showCollapseNext: true,
      onCollapsePrev: null,
      onCollapseNext: null,
      separatorSize: 8,
    });
  }

  _init(): void {
    super._init();
    const namespace = `${RESIZE_HANDLER_MODULE_NAMESPACE}${new Guid()}`;
    this.RESIZE_START_EVENT_NAME = addNamespace(dragEventStart, namespace);
    this.RESIZE_EVENT_NAME = addNamespace(dragEventMove, namespace);
    this.RESIZE_END_EVENT_NAME = addNamespace(dragEventEnd, namespace);
    this.CLICK_EVENT_NAME = addNamespace(CLICK_EVENT, namespace);
    this.DOUBLE_CLICK_EVENT_NAME = addNamespace(DOUBLE_CLICK_EVENT, namespace);
  }

  _initMarkup(): void {
    super._initMarkup();

    this._renderResizeHandleContent();

    this._setAriaAttributes();
  }

  _renderResizeHandleContent(): void {
    const { resizable } = this.option();

    this.$element().addClass(RESIZE_HANDLE_CLASS);
    this.$element().toggleClass(RESIZE_HANDLE_RESIZABLE_CLASS, resizable);
    this._toggleDirectionClass();
    this._setResizeHandleSize();

    this._$collapsePrevButton = $('<div>').addClass(this._getIconClass('prev')).appendTo(this.$element());
    this._$resizeHandle = $('<div>').addClass(this._getIconClass('icon')).appendTo(this.$element());
    this._$collapseNextButton = $('<div>').addClass(this._getIconClass('next')).appendTo(this.$element());

    this._setCollapseButtonsVisibility();
    this._setResizeIconVisibility();
  }

  _updateIconsClasses(): void {
    const isHorizontal = this._isHorizontalDirection();

    this._$collapsePrevButton
      .removeClass(this._getCollapseIconClass(false, !isHorizontal))
      .addClass(this._getCollapseIconClass(false, isHorizontal));

    this._$resizeHandle
      .removeClass(this._getResizeIconClass(!isHorizontal))
      .addClass(this._getResizeIconClass(isHorizontal));

    this._$collapseNextButton
      .removeClass(this._getCollapseIconClass(true, !isHorizontal))
      .addClass(this._getCollapseIconClass(true, isHorizontal));
  }

  _setResizeHandleSize(): void {
    const {
      separatorSize, resizable, showCollapseNext, showCollapsePrev,
    } = this.option();
    const isHorizontal = this._isHorizontalDirection();

    const dimension = isHorizontal ? 'width' : 'height';
    const inverseDimension = isHorizontal ? 'height' : 'width';

    if (resizable === false && showCollapseNext === false && showCollapsePrev === false) {
      this.option('disabled', true);
      this.option(dimension, INACTIVE_RESIZE_HANDLE_SIZE);
      this.option(inverseDimension, null);
    } else {
      this.option(dimension, separatorSize);
      this.option(inverseDimension, null);
      this.option('disabled', false);
    }
  }

  _getIconClass(iconType: 'prev' | 'next' | 'icon'): string {
    const isHorizontal = this._isHorizontalDirection();

    switch (iconType) {
      case 'prev':
        return `${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS} ${ICON_CLASS} ${this._getCollapseIconClass(false, isHorizontal)}`;
      case 'next':
        return `${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS} ${ICON_CLASS} ${this._getCollapseIconClass(true, isHorizontal)}`;
      case 'icon':
        return `${RESIZE_HANDLE_ICON_CLASS} ${ICON_CLASS} ${this._getResizeIconClass(isHorizontal)}`;
      default:
        return '';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _getResizeIconClass(isHorizontal: boolean): string {
    return `dx-icon-handle${isHorizontal ? 'vertical' : 'horizontal'}`;
  }

  // eslint-disable-next-line class-methods-use-this
  _getCollapseIconClass(isNextButton: boolean, isHorizontal: boolean): string {
    if (isNextButton) {
      return `dx-icon-triangle${isHorizontal ? 'right' : 'down'}`;
    }

    return `dx-icon-triangle${isHorizontal ? 'left' : 'up'}`;
  }

  _setCollapseButtonsVisibility(): void {
    const { showCollapsePrev, showCollapseNext } = this.option();

    this._$collapsePrevButton.toggleClass(STATE_INVISIBLE_CLASS, !showCollapsePrev);
    this._$collapseNextButton.toggleClass(STATE_INVISIBLE_CLASS, !showCollapseNext);
  }

  _setResizeIconVisibility(): void {
    const { resizable } = this.option();

    this._$resizeHandle.toggleClass(STATE_INVISIBLE_CLASS, !resizable);
  }

  _setAriaAttributes(): void {
    this.setAria({
      role: 'application',
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: 'separator',
      orientation: this._isHorizontalDirection() ? 'vertical' : 'horizontal',
      label: 'Split bar',
    });
  }

  _toggleDirectionClass(): void {
    this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
    this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
  }

  _render(): void {
    super._render();

    this._attachEventHandlers();
  }

  _resizeStartHandler(e: KeyboardEvent | PointerEvent | MouseEvent | TouchEvent): void {
    this._getAction(RESIZE_EVENT.onResizeStart)({
      event: e,
    });
  }

  _resizeHandler(e: KeyboardEvent | PointerEvent | MouseEvent | TouchEvent): void {
    this._getAction(RESIZE_EVENT.onResize)({
      event: e,
    });
  }

  _resizeEndHandler(e: KeyboardEvent | PointerEvent | MouseEvent | TouchEvent): void {
    this._getAction(RESIZE_EVENT.onResizeEnd)({
      event: e,
    });
  }

  _collapsePrevHandler(e: KeyboardEvent | PointerEvent | MouseEvent | TouchEvent): void {
    this._getAction(COLLAPSE_EVENT.onCollapsePrev)({
      event: e,
    });
  }

  _collapseNextHandler(e: KeyboardEvent | PointerEvent | MouseEvent | TouchEvent): void {
    this._getAction(COLLAPSE_EVENT.onCollapseNext)({
      event: e,
    });
  }

  _resizeBy(
    e: KeyboardEvent,
    offset: ResizeOffset = { x: 0, y: 0 },
  ): void {
    const { resizable } = this.option();

    if (resizable === false) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e as any).offset = offset;

    this._resizeStartHandler(e);
    this._resizeHandler(e);
    this._resizeEndHandler(e);
  }

  _createEventAction(eventName: string): void {
    const actionName = getActionNameByEventName(eventName);

    this[actionName] = this._createActionByOption(eventName, {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _getAction(eventName: string): (e) => void {
    const actionName = getActionNameByEventName(eventName);

    if (!this[actionName]) {
      this._createEventAction(eventName);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this[actionName];
  }

  _attachEventHandlers(): void {
    this._attachResizeEventHandlers();
    this._attachPointerEventHandlers();
  }

  _attachResizeEventHandlers(): void {
    const {
      resizable,
      direction,
    } = this.option();

    if (resizable) {
      const eventData = { direction, immediate: true };

      eventsEngine.on(
        this.$element(),
        this.RESIZE_START_EVENT_NAME,
        eventData,
        this._resizeStartHandler.bind(this),
      );

      eventsEngine.on(
        this.$element(),
        this.RESIZE_EVENT_NAME,
        eventData,
        this._resizeHandler.bind(this),
      );

      eventsEngine.on(
        this.$element(),
        this.RESIZE_END_EVENT_NAME,
        eventData,
        this._resizeEndHandler.bind(this),
      );
    }
  }

  _attachPointerEventHandlers(): void {
    const {
      showCollapsePrev,
      showCollapseNext,
    } = this.option();

    if (showCollapsePrev === true || showCollapseNext === true) {
      eventsEngine.on(
        this.$element(),
        this.DOUBLE_CLICK_EVENT_NAME,
        this._doubleClickHandler.bind(this),
      );
    }

    if (showCollapsePrev === true) {
      eventsEngine.on(
        this._$collapsePrevButton,
        this.CLICK_EVENT_NAME,
        this._collapsePrevHandler.bind(this),
      );
    }

    if (showCollapseNext === true) {
      eventsEngine.on(
        this._$collapseNextButton,
        this.CLICK_EVENT_NAME,
        this._collapseNextHandler.bind(this),
      );
    }
  }

  _detachEventHandlers(): void {
    this._detachResizeEventHandlers();
    this._detachPointerEventHandlers();
  }

  _detachResizeEventHandlers(): void {
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_START_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_END_EVENT_NAME);
  }

  _detachPointerEventHandlers(): void {
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.DOUBLE_CLICK_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this._$collapsePrevButton, this.CLICK_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this._$collapseNextButton, this.CLICK_EVENT_NAME);
  }

  _doubleClickHandler(e: PointerEvent | MouseEvent | TouchEvent): void {
    const { showCollapsePrev, showCollapseNext } = this.option();

    if (showCollapsePrev === true) {
      this._collapsePrevHandler(e);
    } else if (showCollapseNext === true) {
      this._collapseNextHandler(e);
    }
  }

  _isHorizontalDirection(): boolean {
    return this.option('direction') === RESIZE_DIRECTION.horizontal;
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'direction':
        this._toggleDirectionClass();
        this._detachResizeEventHandlers();
        this._attachResizeEventHandlers();
        this._setResizeHandleSize();
        this._updateIconsClasses();
        break;
      case 'resizable':
        this._setResizeIconVisibility();
        this.$element().toggleClass(RESIZE_HANDLE_RESIZABLE_CLASS, value);
        this._detachResizeEventHandlers();
        this._attachResizeEventHandlers();
        this._setResizeHandleSize();
        break;
      case 'separatorSize':
        this._setResizeHandleSize();
        break;
      case 'showCollapsePrev':
      case 'showCollapseNext':
        this._setCollapseButtonsVisibility();
        this._setResizeIconVisibility();
        this._setResizeHandleSize();
        this._detachPointerEventHandlers();
        this._attachPointerEventHandlers();
        break;
      case 'onCollapsePrev':
      case 'onCollapseNext':
      case 'onResize':
      case 'onResizeStart':
      case 'onResizeEnd':
        this._createEventAction(name);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ResizeHandle;
