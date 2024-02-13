import { ResizeEndEvent, ResizeStartEvent } from '@js/ui/resizable';

import Guid from '../../../core/guid';
import { extend } from '../../../core/utils/extend';
import eventsEngine from '../../../events/core/events_engine';
import { end as dragEventEnd, move as dragEventMove, start as dragEventStart } from '../../../events/drag';
import { addNamespace } from '../../../events/utils/index';
import Widget from '../../../ui/widget/ui.widget';

const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const HORIZONTAL_DIRECTION_CLASS = 'dx-resize-handle-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-resize-handle-vertical';
const RESIZE_HANDLER_MODULE_NAMESPACE = 'dxResizeHandle';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ResizeHandle extends (Widget as any) {
  _getDefaultOptions(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      direction: 'horizontal',
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
    });
  }

  _init(): void {
    super._init();
    const namespace = `${RESIZE_HANDLER_MODULE_NAMESPACE}${new Guid().toString()}`;
    this.RESIZE_START_EVENT_NAME = addNamespace(dragEventStart, namespace);
    this.RESIZE_EVENT_NAME = addNamespace(dragEventMove, namespace);
    this.RESIZE_END_EVENT_NAME = addNamespace(dragEventEnd, namespace);
    this.handlers = {};
  }

  _initMarkup(): void {
    super._initMarkup();

    this._toggleDirection();
    this.$element().addClass(RESIZE_HANDLE_CLASS);
  }

  _toggleDirection(): void {
    this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
    this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
  }

  _render(): void {
    super._render();

    this._attachEventHandlers();
    this._renderActions();
  }

  _resizeStartHandler(e: ResizeStartEvent): void {
    this._resizeStartAction({
      event: e,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _resizeHandler(e): void {
    this._resizeAction({
      event: e,
    });
  }

  _resizeEndHandler(e: ResizeEndEvent): void {
    this._resizeEndAction({
      event: e,
    });
  }

  _renderActions(): void {
    this._resizeStartAction = this._createActionByOption('onResizeStart');
    this._resizeEndAction = this._createActionByOption('onResizeEnd');
    this._resizeAction = this._createActionByOption('onResize');
  }

  _attachEventHandlers(): void {
    this.handlers[this.RESIZE_START_EVENT_NAME] = this._resizeStartHandler.bind(this);
    this.handlers[this.RESIZE_EVENT_NAME] = this._resizeHandler.bind(this);
    this.handlers[this.RESIZE_END_EVENT_NAME] = this._resizeEndHandler.bind(this);

    eventsEngine.on(this.$element(), this.handlers, {
      direction: this.option('direction'),
      immediate: true,
    });
  }

  _detachEventHandlers(): void {
    // @ts-expect-error todo: make optional parameters for eventsEngine
    eventsEngine.off(this.$element(), this.handlers);
  }

  _isHorizontalDirection(): boolean {
    return this.option('direction') === 'horizontal';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _optionChanged(args): void {
    switch (args.name) {
      case 'direction':
        this._toggleDirection();
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'onResize':
      case 'onResizeStart':
      case 'onResizeEnd':
        this._renderActions();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ResizeHandle;
