import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import CollectionWidgetItem from '@js/ui/collection/item';
import type { Item } from '@js/ui/splitter';

import ResizeHandle from './resize_handle';
import type Splitter from './splitter';

class SplitterItem extends CollectionWidgetItem {
  private readonly _$element!: dxElementWrapper;

  constructor(
    $element: dxElementWrapper,
    options: { _id: string },
    rawData: Item,
  ) {
    options._id = `dx_${new Guid()}`;

    super($element, options, rawData);
  }

  get owner(): Splitter {
    // @ts-expect-error badly typed base class
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options.owner;
  }

  get resizeHandle(): ResizeHandle {
    // @ts-expect-error badly typed base class
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options._resizeHandle;
  }

  get option(): Item {
    // @ts-expect-error badly typed base class
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._rawData;
  }

  get index(): number {
    // @ts-expect-error badly typed base class
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.owner._getIndexByItemData(this.option);
  }

  _renderResizeHandle(): void {
    if (this.option.visible !== false && !this.isLast()) {
      this._setIdAttr();
      // @ts-expect-error badly typed base class
      const config = this.owner._getResizeHandleConfig(this._options._id);
      // @ts-expect-error badly typed base class
      this._options._resizeHandle = this.owner._createComponent($('<div>'), ResizeHandle, config);

      $(this.resizeHandle.element()).insertAfter(this._$element);
    }
  }

  _setIdAttr(): void {
    // @ts-expect-error ts-error
    this._$element.attr('id', this._options._id);
  }

  isLast(): boolean {
    return this.owner._isLastVisibleItem(this.index);
  }
}

export default SplitterItem;
