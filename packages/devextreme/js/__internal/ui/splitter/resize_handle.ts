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
const HORIZONTAL_DIRECTION_CLASS = 'dx-resize-handle-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-resize-handle-vertical';
const RESIZE_HANDLE_ICON_CLASS = 'dx-resize-handle-icon';
const RESIZE_HANDLE_COLLAPSE_PREV_BUTTON_CLASS = 'dx-resize-handle-collapse-prev-button';
const RESIZE_HANDLE_COLLAPSE_NEXT_BUTTON_CLASS = 'dx-resize-handle-collapse-next-button';
const RESIZE_HANDLE_HIDDEN_BUTTON = 'dx-resize-handle-hidden-button';
const ICON_CLASS = 'dx-icon';

const RESIZE_HANDLER_MODULE_NAMESPACE = 'dxResizeHandle';

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
      showResizableIcon: true,
      showCollapsePrev: true,
      showCollapseNext: true,
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
    this.$element().addClass(RESIZE_HANDLE_CLASS);
    this._toggleDirectionClass();

    this._$collapsePrevButton = $('<div>').addClass(this._getCollapseIconClass(false)).appendTo(this.$element());
    this._$resizeHandle = $('<div>').addClass(RESIZE_HANDLE_ICON_CLASS).appendTo(this.$element());
    this._$collapseNextButton = $('<div>').addClass(this._getCollapseIconClass(true)).appendTo(this.$element());

    this._setResizeHandleContentVisibility();
  }

  _getCollapseIconClass(isNextButton: boolean): string {
    const isHorizontal = this._isHorizontalDirection();
    let classList = `${isNextButton ? RESIZE_HANDLE_COLLAPSE_NEXT_BUTTON_CLASS : RESIZE_HANDLE_COLLAPSE_PREV_BUTTON_CLASS} ${ICON_CLASS}`;
    if (isNextButton) {
      classList += ` dx-icon-spin${isHorizontal ? 'right' : 'down'}`;
    } else {
      classList += ` dx-icon-spin${isHorizontal ? 'left' : 'up'}`;
    }

    return classList;
  }

  _setResizeHandleContentVisibility(): void {
    const { showCollapsePrev, showCollapseNext, resizable } = this.option();

    this._$collapsePrevButton.toggleClass(RESIZE_HANDLE_HIDDEN_BUTTON, !showCollapsePrev);
    this._$resizeHandle.toggleClass(RESIZE_HANDLE_HIDDEN_BUTTON, !resizable);
    this._$collapseNextButton.toggleClass(RESIZE_HANDLE_HIDDEN_BUTTON, !showCollapseNext);
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

  _detachEventHandlers(): void {
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_START_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_EVENT_NAME);
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.RESIZE_END_EVENT_NAME);
  }

  _isHorizontalDirection(): boolean {
    return this.option('direction') === RESIZE_DIRECTION.horizontal;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _optionChanged(args): void {
    const { name } = args;

    switch (name) {
      case 'direction':
        this._toggleDirectionClass();
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
