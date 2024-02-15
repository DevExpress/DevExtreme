// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import CollectionWidgetItem from '@js/ui/collection/item';
import type { CollectionWidgetItem as Item } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';
import { ResizeEndEvent, ResizeStartEvent } from '@js/ui/resizable';

import Guid from '../../../core/guid';
import eventsEngine from '../../../events/core/events_engine';
import { end as eventEnd, move as eventMove, start as eventStart } from '../../../events/drag';
import { addNamespace } from '../../../events/utils/index';

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_DIRECTION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-splitter-vertical';
const SPLITTER_MODULE_NAMESPACE = 'dxSplitter';

const RESIZE_DIRECTION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

class SplitterItem extends CollectionWidgetItem {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Splitter extends (CollectionWidget as any) {
  _getDefaultOptions(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      direction: RESIZE_DIRECTION.horizontal,
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
    });
  }

  _init(): void {
    super._init();
    const namespace = `${SPLITTER_MODULE_NAMESPACE}${new Guid().toString()}`;
    this.RESIZE_START_EVENT_NAME = addNamespace(eventStart, namespace);
    this.RESIZE_EVENT_NAME = addNamespace(eventMove, namespace);
    this.RESIZE_END_EVENT_NAME = addNamespace(eventEnd, namespace);
  }

  // eslint-disable-next-line class-methods-use-this
  _itemClass(): string {
    return SPLITTER_ITEM_CLASS;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemDataKey(): string {
    return SPLITTER_ITEM_DATA_KEY;
  }

  _initMarkup(): void {
    this.$element().addClass(SPLITTER_CLASS);

    this._toggleDirectionClass();
    super._initMarkup();
  }

  _render(): void {
    super._render();

    this._createResizeStartAction();
    this._createResizeAction();
    this._createResizeEndAction();
    this._attachEventHandlers();
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

  _renderItems(items: Item[]): void {
    super._renderItems(items);
  }

  _renderItemContent(args: object): object {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._renderItemContent(args);
  }

  _itemOptionChanged(item: unknown, property: unknown, value: unknown): void {
    super._itemOptionChanged(item, property, value);
  }

  _isHorizontalDirection(): boolean {
    return this.option('direction') === 'horizontal';
  }

  _toggleDirectionClass(): void {
    this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
    this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
  }

  _createResizeAction(): void {
    this._resizeAction = this._createActionByOption('onResize');
  }

  _createResizeStartAction(): void {
    this._resizeStartAction = this._createActionByOption('onResizeStart');
  }

  _createResizeEndAction(): void {
    this._resizeEndAction = this._createActionByOption('onResizeEnd');
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

  _clean(): void {
    this._detachEventHandlers();
    super._clean();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _optionChanged(args): void {
    switch (args.name) {
      case 'direction':
        this._toggleDirectionClass();
        this._detachEventHandlers();
        this._attachEventHandlers();
        break;
      case 'onResize':
        this._createResizeAction();
        break;
      case 'onResizeStart':
        this._createResizeStartAction();
        break;
      case 'onResizeEnd':
        this._createResizeEndAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

Splitter.ItemClass = SplitterItem;

// @ts-expect-error // temp fix
registerComponent('dxSplitter', Splitter);

export default Splitter;
