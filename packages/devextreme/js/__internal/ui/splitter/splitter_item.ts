import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/splitter';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

import ResizeHandle from './resize_handle';
import type Splitter from './splitter';

class SplitterItem extends CollectionWidgetItem<Item> {
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
    // @ts-expect-error
    super($element, options, rawData);

    this._owner = options.owner;
  }

  _renderResizeHandle(): void {
    if (this._shouldHaveResizeHandle()) {
      const id = `dx_${new Guid()}`;

      this._setIdAttr(id);

      const config = this._owner._getResizeHandleConfig(id);

      this._resizeHandle = this._owner._createComponent($('<div>'), ResizeHandle, config);

      if (this._resizeHandle && this._$element) {
        $(this._resizeHandle.element()).insertAfter(this._$element);
      }
    }
  }

  _shouldHaveResizeHandle(): boolean {
    return this._rawData?.visible !== false && !this.isLast();
  }

  updateResizeHandle(): void {
    if (this._shouldHaveResizeHandle()) {
      if (this.getResizeHandle()) return;
      this._renderResizeHandle();
    } else {
      this._removeIdAttr();
      this._removeResizeHandle();
    }
  }

  _setIdAttr(id: string): void {
    this._$element.attr('id', id);
  }

  _removeIdAttr(): void {
    this._$element.attr('id', null);
  }

  getIndex(): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._owner._getIndexByItemData(this._rawData);
  }

  getResizeHandle(): ResizeHandle | undefined {
    return this._resizeHandle;
  }

  _removeResizeHandle(): void {
    this.getResizeHandle()?.$element().remove();
    delete this._resizeHandle;
  }

  isLast(): boolean {
    return this._owner._isLastVisibleItem(this.getIndex());
  }
}

export default SplitterItem;
