import $ from '@js/core/renderer';
import type { ResizeEndEvent, ResizeStartEvent } from '@js/ui/resizable';

import Guid from '../../../core/guid';
import { extend } from '../../../core/utils/extend';
import eventsEngine from '../../../events/core/events_engine';
import { end as dragEventEnd, move as dragEventMove, start as dragEventStart } from '../../../events/drag';
import { addNamespace } from '../../../events/utils/index';
import Widget from '../../../ui/widget/ui.widget';
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

const CLICK_EVENT = 'dxclick';

const RESIZE_DIRECTION = {
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

    this._$collapsePrevButton = $('<div>').appendTo(this.$element());
    this._$resizeHandle = $('<div>').appendTo(this.$element());
    this._$collapseNextButton = $('<div>').appendTo(this.$element());

    this._updateResizeHandleContentClasses();
  }

  _updateResizeHandleContentClasses(): void {
    this._$collapsePrevButton.removeClass().addClass(this._getIconClass('prev'));
    this._$resizeHandle.removeClass().addClass(this._getIconClass('icon'));
    this._$collapseNextButton.removeClass().addClass(this._getIconClass('next'));

    this._setCollapseButtonsVisibility();
    this._setResizeIconVisibility();
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
    switch (iconType) {
      case 'prev':
        return `${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS} ${ICON_CLASS} ${this._getCollapseIconClass(false)}`;
      case 'next':
        return `${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS} ${ICON_CLASS} ${this._getCollapseIconClass(true)}`;
      case 'icon':
        return `${RESIZE_HANDLE_ICON_CLASS} ${ICON_CLASS} ${this._getResizeIconClass()}`;
      default:
        return '';
    }
  }

  _getResizeIconClass(): string {
    const isHorizontal = this._isHorizontalDirection();

    return `dx-icon-handle${isHorizontal ? 'vertical' : 'horizontal'}`;
  }

  _getCollapseIconClass(isNextButton: boolean): string {
    const isHorizontal = this._isHorizontalDirection();

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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _resizeHandler(e): void {
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
    const eventData = { direction: this.option('direction'), immediate: true };
    const { onCollapsePrevClick, onCollapseNextClick, resizable } = this.option();

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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _optionChanged(args): void {
    const { name, value } = args;

    switch (name) {
      case 'direction':
        this._toggleDirectionClass();
        this._detachEventHandlers();
        this._attachEventHandlers();
        this._setResizeHandleSize();
        this._updateResizeHandleContentClasses();
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
