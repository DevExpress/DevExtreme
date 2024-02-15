// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import CollectionWidgetItem from '@js/ui/collection/item';
import type { CollectionWidgetItem as Item } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';
import { ResizeEndEvent, ResizeStartEvent } from '@js/ui/resizable';

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_DIRECTION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-splitter-vertical';

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

  _createActions(): void {
    this._actions = {
      onResize: this._createActionByOption('onResize'),
      onResizeStart: this._createActionByOption('onResizeStart'),
      onResizeEnd: this._createActionByOption('onResizeEnd'),
    };
  }

  _render(): void {
    super._render();
    this._createActions();
  }

  _resizeStartHandler(e: ResizeStartEvent): void {
    this._actions.onResizeStart({
      event: e,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _resizeHandler(e): void {
    this._actions.onResize({
      event: e,
    });
  }

  _resizeEndHandler(e: ResizeEndEvent): void {
    this._actions.onResizeEnd({
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _optionChanged(args): void {
    switch (args.name) {
      case 'direction':
        this._toggleDirectionClass();
        break;
      case 'onResizeStart':
      case 'onResizeEnd':
      case 'onResize':
        this._actions[args.name] = this._createActionByOption(args.name);
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
