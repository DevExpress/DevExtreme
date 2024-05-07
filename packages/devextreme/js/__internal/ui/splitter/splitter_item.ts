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

  get owner(): Splitter {
    return this._owner;
  }

  get resizeHandle(): ResizeHandle | undefined {
    return this._resizeHandle;
  }

  get option(): Item | undefined {
    return this._rawData;
  }

  get index(): number {
    // @ts-expect-error badly typed class
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.owner._getIndexByItemData(this.option);
  }

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
    if (this.option?.visible !== false && !this.isLast()) {
      const id = `dx_${new Guid()}`;

      this._setIdAttr(id);

      const config = this.owner._getResizeHandleConfig(id);
      // @ts-expect-error badly typed base class
      this._resizeHandle = this.owner._createComponent($('<div>'), ResizeHandle, config);

      if (this.resizeHandle && this._$element) {
        $(this.resizeHandle.element()).insertAfter(this._$element);
      }
    }
  }

  _setIdAttr(id: string): void {
    this._$element?.attr('id', id);
  }

  isLast(): boolean {
    return this.owner._isLastVisibleItem(this.index);
  }
}

export default SplitterItem;
