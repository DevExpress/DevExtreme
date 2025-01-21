import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/splitter';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

import ResizeHandle from './resize_handle';
import type Splitter from './splitter';

// @ts-expect-error dxClass inheritance issue
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
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
