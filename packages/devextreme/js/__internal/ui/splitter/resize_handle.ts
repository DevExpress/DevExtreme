import type { DragDirection } from '@js/common';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { name as CLICK_EVENT } from '@js/events/click';
import eventsEngine from '@js/events/core/events_engine';
import { end as dragEventEnd, move as dragEventMove, start as dragEventStart } from '@js/events/drag';
import { addNamespace } from '@js/events/utils/index';
import type { ResizeEndEvent, ResizeStartEvent } from '@js/ui/resizable';
import type { ResizeEvent } from '@js/ui/splitter';
import Widget from '@js/ui/widget/ui.widget';

import {
  getActionNameByEventName,
  RESIZE_EVENT,
} from './utils/event';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ResizeHandle extends (Widget as any) {
  _getDefaultOptions(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      direction: RESIZE_DIRECTION.horizontal,
      focusStateEnabled: false,
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
      resizable: true,
      showCollapsePrev: true,
      showCollapseNext: true,
      onCollapsePrevClick: null,
      onCollapseNextClick: null,
      separatorSize: 8,
    });
  }

  _init(): void {
    super._init();
    const namespace = `${RESIZE_HANDLER_MODULE_NAMESPACE}${new Guid()}`;
    this.RESIZE_START_EVENT_NAME = addNamespace(dragEventStart, namespace);
    this.RESIZE_EVENT_NAME = addNamespace(dragEventMove, namespace);
    this.RESIZE_END_EVENT_NAME = addNamespace(dragEventEnd, namespace);
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
    const { separatorSize } = this.option();
    const styleToSet = this._isHorizontalDirection() ? 'width' : 'height';

    this.$element().css({
      width: '',
      height: '',
    });

    this.$element().css(styleToSet, separatorSize);
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

  _resizeStartHandler(e: ResizeStartEvent): void {
    this._getAction(RESIZE_EVENT.onResizeStart)({
      event: e,
    });
  }

  _resizeHandler(e: ResizeEvent): void {
    this._getAction(RESIZE_EVENT.onResize)({
      event: e,
    });
  }

  _resizeEndHandler(e: ResizeEndEvent): void {
    this._getAction(RESIZE_EVENT.onResizeEnd)({
      event: e,
    });
  }

  _getAction(eventName: string): (e) => void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this[getActionNameByEventName(eventName)] ?? this._createActionByOption(eventName);
  }

  _attachEventHandlers(): void {
    const {
      onCollapsePrevClick, onCollapseNextClick, resizable, direction,
    } = this.option();

    const eventData = { direction, immediate: true };

    if (resizable) {
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

    eventsEngine.on(
      this._$collapsePrevButton,
      CLICK_EVENT,
      onCollapsePrevClick,
    );

    eventsEngine.on(
      this._$collapseNextButton,
      CLICK_EVENT,
      onCollapseNextClick,
    );
  }

  _detachEventHandlers(): void {
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_START_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_END_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this._$collapsePrevButton, CLICK_EVENT);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this._$collapseNextButton, CLICK_EVENT);
  }

  _isHorizontalDirection(): boolean {
    return this.option('direction') === RESIZE_DIRECTION.horizontal;
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'direction':
        this._toggleDirectionClass();
        this._detachEventHandlers();
        this._attachEventHandlers();
        this._setResizeHandleSize();
        this._updateIconsClasses();
        break;
      case 'resizable':
        this._setResizeIconVisibility();
        this.$element().toggleClass(RESIZE_HANDLE_RESIZABLE_CLASS, value);
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'separatorSize':
        this._setResizeHandleSize();
        break;
      case 'showCollapsePrev':
      case 'showCollapseNext':
        break;
      case 'onCollapsePrevClick':
      case 'onCollapseNextClick':
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'onResize':
      case 'onResizeStart':
      case 'onResizeEnd':
        this[getActionNameByEventName(name)] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ResizeHandle;
