// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import CollectionWidgetItem from '@js/ui/collection/item';
import type { CollectionWidgetItem as Item } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';
import { ResizeEndEvent, ResizeStartEvent } from '@js/ui/resizable';

import ResizeHandle from './resize_handle';

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';

const ORIENTATION = {
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
      orientation: ORIENTATION.horizontal,
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

    this._toggleOrientationClass();
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

  _renderItems(items: Item[]): void {
    super._renderItems(items);
  }

  _itemsCount() {
    return this.option('items').length;
  }

  _isLastItem(index: number) {
    return index === this._itemsCount() - 1;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _renderItem(index, itemData, $container, $itemToReplace) {
    const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);

    if (!this._isLastItem(index)) {
      this._renderResizeHandle();
    }

    return $itemFrame;
  }

  _renderResizeHandle() {
    const $resizeHandle = $('<div>').appendTo(this.$element());

    this._createComponent($resizeHandle, ResizeHandle, this._getResizeHandleConfig());
  }

  _getResizeHandleConfig() {
    return {
      direction: this.option('orientation') === ORIENTATION.vertical ? 'horizontal' : 'vertical',
      onResizeStart: (e) => {
        this._actions.onResizeStart({
          event: e,
        });
      },
      onResize: (e) => {
        this._actions.onResize({
          event: e,
        });
      },
      onResizeEnd: (e) => {
        this._actions.onResizeEnd({
          event: e,
        });
      },
    };
  }

  _renderItemContent(args: object): object {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._renderItemContent(args);
  }

  _itemOptionChanged(item: unknown, property: unknown, value: unknown): void {
    super._itemOptionChanged(item, property, value);
  }

  _isHorizontalOrientation(): boolean {
    return this.option('orientation') === 'horizontal';
  }

  _toggleOrientationClass(): void {
    this.$element().toggleClass(HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation());
    this.$element().toggleClass(VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _optionChanged(args): void {
    switch (args.name) {
      case 'direction':
        this._toggleOrientationClass();
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
