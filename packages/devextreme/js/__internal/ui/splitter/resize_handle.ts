import type { DragDirection } from '@js/common';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { name as CLICK_EVENT } from '@js/events/click';
import eventsEngine from '@js/events/core/events_engine';
import { name as DOUBLE_CLICK_EVENT } from '@js/events/double_click';
import { end as dragEventEnd, move as dragEventMove, start as dragEventStart } from '@js/events/drag';
import { addNamespace, isCommandKeyPressed } from '@js/events/utils/index';
import messageLocalization from '@js/localization/message';
import Widget from '@js/ui/widget/ui.widget';

import {
  COLLAPSE_EVENT,
  getActionNameByEventName,
  RESIZE_EVENT,
} from './utils/event';
import type {
  CollapseEvents, InteractionEvent, ResizeEvents, ResizeHandleOptions, ResizeOffset,
} from './utils/types';

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
const DEFAULT_RESIZE_HANDLE_SIZE = 8;
const INACTIVE_RESIZE_HANDLE_SIZE = 2;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ResizeHandle extends Widget<ResizeHandleOptions> {
  private _$collapsePrevButton!: dxElementWrapper;

  private _$resizeHandle!: dxElementWrapper;

  private _$collapseNextButton!: dxElementWrapper;

  _supportedKeys(): Record<string, unknown> {
    // @ts-expect-error badly typed base class
    return extend(super._supportedKeys(), {
      rightArrow(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        const {
          direction, showCollapseNext, showCollapsePrev, rtlEnabled,
        } = this.option();

        const forbidCollapseNext = rtlEnabled
          ? showCollapsePrev === false
          : showCollapseNext === false;

        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.vertical || forbidCollapseNext) {
            return;
          }

          if (rtlEnabled) {
            this._collapsePrevHandler(e);
          } else {
            this._collapseNextHandler(e);
          }
        } else {
          this._resizeBy(e, { x: KEYBOARD_DELTA });
        }
      },
      leftArrow(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        const {
          direction, showCollapsePrev, showCollapseNext, rtlEnabled,
        } = this.option();

        const forbidCollapsePrev = rtlEnabled
          ? showCollapseNext === false
          : showCollapsePrev === false;

        if (isCommandKeyPressed(e)) {
          if (direction === RESIZE_DIRECTION.vertical || forbidCollapsePrev) {
            return;
          }
          if (rtlEnabled) {
            this._collapseNextHandler(e);
          } else {
            this._collapsePrevHandler(e);
          }
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
    // @ts-expect-error badly typed base class
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
      separatorSize: DEFAULT_RESIZE_HANDLE_SIZE,
    });
  }

  _init(): void {
    // @ts-expect-error badly typed base class
    super._init();
    const namespace = `${RESIZE_HANDLER_MODULE_NAMESPACE}${new Guid()}`;
    // @ts-expect-error todo
    this.RESIZE_START_EVENT_NAME = addNamespace(dragEventStart, namespace);
    // @ts-expect-error todo
    this.RESIZE_EVENT_NAME = addNamespace(dragEventMove, namespace);
    // @ts-expect-error todo
    this.RESIZE_END_EVENT_NAME = addNamespace(dragEventEnd, namespace);
    // @ts-expect-error todo
    this.CLICK_EVENT_NAME = addNamespace(CLICK_EVENT, namespace);
    // @ts-expect-error todo
    this.DOUBLE_CLICK_EVENT_NAME = addNamespace(DOUBLE_CLICK_EVENT, namespace);
  }

  _initMarkup(): void {
    // @ts-expect-error badly typed base class
    super._initMarkup();

    this._renderResizeHandleContent();

    this._setAriaAttributes();
  }

  _renderResizeHandleContent(): void {
    const { resizable } = this.option();

    // @ts-expect-error badly typed DomComponent class
    this.$element().addClass(RESIZE_HANDLE_CLASS);
    // @ts-expect-error badly typed DomComponent class
    this.$element().toggleClass(RESIZE_HANDLE_RESIZABLE_CLASS, resizable);
    this._toggleDirectionClass();
    this._updateDimensions();

    this._$collapsePrevButton = $('<div>').addClass(this._getIconClass('prev')).appendTo(this.$element());
    this._$resizeHandle = $('<div>').addClass(this._getIconClass('icon')).appendTo(this.$element());
    this._$collapseNextButton = $('<div>').addClass(this._getIconClass('next')).appendTo(this.$element());

    this._setCollapseButtonsVisibility();
    this._setResizeIconVisibility();
  }

  _updateIconsClasses(): void {
    const isHorizontal = this._isHorizontalDirection();
    const rtlEnabled = this.option('rtlEnabled');

    this._$collapsePrevButton
      .removeClass(this._getCollapseIconClass(false, !isHorizontal, !!rtlEnabled))
      .addClass(this._getCollapseIconClass(false, isHorizontal, !!rtlEnabled));

    this._$resizeHandle
      .removeClass(this._getResizeIconClass(!isHorizontal))
      .addClass(this._getResizeIconClass(isHorizontal));

    this._$collapseNextButton
      .removeClass(this._getCollapseIconClass(true, !isHorizontal, !!rtlEnabled))
      .addClass(this._getCollapseIconClass(true, isHorizontal, !!rtlEnabled));
  }

  _updateDimensions(): void {
    const isHorizontal = this._isHorizontalDirection();

    const dimension = isHorizontal ? 'width' : 'height';
    const inverseDimension = isHorizontal ? 'height' : 'width';

    // @ts-expect-error todo
    this.option(inverseDimension, null);
    this.option(dimension, this.getSize());
  }

  _isInactive(): boolean {
    const { resizable, showCollapseNext, showCollapsePrev } = this.option();

    return resizable === false
      && showCollapseNext === false
      && showCollapsePrev === false;
  }

  _getIconClass(iconType: 'prev' | 'next' | 'icon'): string {
    const isHorizontal = this._isHorizontalDirection();
    const rtlEnabled = this.option('rtlEnabled');

    switch (iconType) {
      case 'prev':
        return `${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS} ${ICON_CLASS} ${this._getCollapseIconClass(false, isHorizontal, !!rtlEnabled)}`;
      case 'next':
        return `${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS} ${ICON_CLASS} ${this._getCollapseIconClass(true, isHorizontal, !!rtlEnabled)}`;
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
  _getCollapseIconClass(isNextButton: boolean, isHorizontal: boolean, rtlEnabled: boolean): string {
    const horizontalDirection = isNextButton === rtlEnabled ? 'left' : 'right';
    const verticalDirection = isNextButton ? 'down' : 'up';

    return `dx-icon-triangle${isHorizontal ? horizontalDirection : verticalDirection}`;
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
    // @ts-expect-error todo: badly typed base class
    this.setAria({
      role: 'application',
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: 'separator',
      label: messageLocalization.format('dxSplitter-resizeHandleAriaLabel'),
    });
  }

  _toggleDirectionClass(): void {
    // @ts-expect-error badly typed DomComponent class
    this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
    // @ts-expect-error badly typed DomComponent class
    this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
  }

  _render(): void {
    // @ts-expect-error todo: badly typed base class
    super._render();

    this._attachEventHandlers();
  }

  _resizeStartHandler(e: InteractionEvent): void {
    this._getAction(RESIZE_EVENT.onResizeStart)({
      event: e,
    });
  }

  _resizeHandler(e: InteractionEvent): void {
    this._getAction(RESIZE_EVENT.onResize)({
      event: e,
    });
  }

  _resizeEndHandler(e: InteractionEvent): void {
    this._getAction(RESIZE_EVENT.onResizeEnd)({
      event: e,
    });
  }

  _collapsePrevHandler(e: InteractionEvent): void {
    this._getAction(COLLAPSE_EVENT.onCollapsePrev)({
      event: e,
    });
  }

  _collapseNextHandler(e: InteractionEvent): void {
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

    // @ts-expect-error todo: badly typed base class
    this[actionName] = this._createActionByOption(eventName, {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _getAction(eventName: ResizeEvents | CollapseEvents): (e) => void {
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
        // @ts-expect-error todo: todo
        this.RESIZE_START_EVENT_NAME,
        eventData,
        this._resizeStartHandler.bind(this),
      );

      eventsEngine.on(
        this.$element(),
        // @ts-expect-error todo: todo
        this.RESIZE_EVENT_NAME,
        eventData,
        this._resizeHandler.bind(this),
      );

      eventsEngine.on(
        this.$element(),
        // @ts-expect-error todo: todo
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
        // @ts-expect-error todo: todo
        this.DOUBLE_CLICK_EVENT_NAME,
        this._doubleClickHandler.bind(this),
      );
    }

    if (showCollapsePrev === true) {
      eventsEngine.on(

        this._$collapsePrevButton,
        // @ts-expect-error todo: todo
        this.CLICK_EVENT_NAME,
        this._collapsePrevHandler.bind(this),
      );
    }

    if (showCollapseNext === true) {
      eventsEngine.on(
        this._$collapseNextButton,
        // @ts-expect-error todo: todo
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

  _clean(): void {
    this._detachResizeEventHandlers();
    this._detachPointerEventHandlers();

    // @ts-expect-error badly typed base class
    super._clean();
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'direction':
        this._toggleDirectionClass();
        this._detachResizeEventHandlers();
        this._attachResizeEventHandlers();
        this._updateDimensions();
        this._updateIconsClasses();
        break;
      case 'resizable':
        this._setResizeIconVisibility();
        // @ts-expect-error badly typed DomComponent class
        this.$element().toggleClass(RESIZE_HANDLE_RESIZABLE_CLASS, value);
        this._detachResizeEventHandlers();
        this._attachResizeEventHandlers();
        this._updateDimensions();
        break;
      case 'separatorSize':
        this._updateDimensions();
        break;
      case 'showCollapsePrev':
      case 'showCollapseNext':
        this._setCollapseButtonsVisibility();
        this._setResizeIconVisibility();
        this._updateDimensions();
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
        // @ts-expect-error badly typed base class
        super._optionChanged(args);
    }
  }

  getSize(): number {
    const { separatorSize } = this.option();

    if (this._isInactive()) {
      return INACTIVE_RESIZE_HANDLE_SIZE;
    }

    // @ts-expect-error todo: todo
    return Number.isFinite(separatorSize) && separatorSize >= 0
      ? separatorSize as number
      : DEFAULT_RESIZE_HANDLE_SIZE;
  }

  isInactive(): boolean {
    return this._isInactive();
  }
}

export default ResizeHandle;
