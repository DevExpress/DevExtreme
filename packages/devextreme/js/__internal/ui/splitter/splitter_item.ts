import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import CollectionWidgetItem from '@js/ui/collection/item';
import type { Item } from '@js/ui/splitter';

import ResizeHandle from './resize_handle';
import type Splitter from './splitter';

class SplitterItem extends CollectionWidgetItem {
  private readonly _$element?: dxElementWrapper;

  _owner: Splitter;

  _rawData?: Item;

  _resizeHandle?: ResizeHandle;

  constructor(
    $element: dxElementWrapper,
    options: {
      owner: Splitter;
    },
    rawData: Item,
  ) {
    super($element, options, rawData);

    this._owner = options.owner;
  }

  _renderResizeHandle(): void {
    if (this._rawData?.visible !== false && !this.isLast()) {
      const id = `dx_${new Guid()}`;

      this._setIdAttr(id);

      const config = this._owner._getResizeHandleConfig(id);

      // @ts-expect-error ts-error
      this._resizeHandle = this._owner._createComponent($('<div>'), ResizeHandle, config);

      if (this._resizeHandle && this._$element) {
        $(this._resizeHandle.element()).insertAfter(this._$element);
      }
    }
  }

  _setIdAttr(id: string): void {
    this._$element?.attr('id', id);
  }

  getIndex(): number {
    return this._owner._getIndexByItemData(this._rawData);
  }

  getResizeHandle(): ResizeHandle | undefined {
    return this._resizeHandle;
  }

  isLast(): boolean {
    return this._owner._isLastVisibleItem(this.getIndex());
  }
}

export default SplitterItem;
