import $ from '@js/core/renderer';
import {
  normalizeStyleProp, styleProp,
} from '@js/core/utils/style';

const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

const FLEX_PROPERTY_NAME = 'flexGrow';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const DEFAULT_RESIZE_HANDLE_SIZE = 8;

export default class SplitterLayoutHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly items: any;

  private readonly orientation: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly $element: any;

  private layoutState: number[];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(items: unknown, orientation: string, $element) {
    this.items = items;
    this.$element = $element;
    this.layoutState = [];
    this.orientation = orientation;
  }

  initializeState(): void {
    this.layoutState = [];

    this.items.each((index, splitterItem) => {
      // @ts-expect-error todo: fix error
      this.layoutState.push(parseFloat($(splitterItem).css(FLEX_PROPERTY_NAME)));
      //
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  applyNewLayout(e): void {
    const newLayoutState = this._getNewLayout(e);

    this.items.each((index, item) => {
      this._setFlexProp(item, FLEX_PROPERTY_NAME, newLayoutState[index]);
    });
  }

  layoutItems(): void {
    // NOTE: temporarily evenly distributed
    const splitterItemRatio = 100 / this.items.length;

    this.items.each((index, item) => {
      this._setFlexProp(item, FLEX_PROPERTY_NAME, splitterItemRatio);
    });
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, class-methods-use-this
  _setFlexProp(element, prop, value): void {
    const normalizedProp = normalizeStyleProp(prop, value);
    element.style[styleProp(prop)] = normalizedProp;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _getOffset(e): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.orientation === ORIENTATION.horizontal ? e.offset.x : e.offset.y;
  }

  _getSplitterItemsSizeSum(): number {
    const splitterSize = this.$element.get(0).getBoundingClientRect();
    const size: number = this.orientation === ORIENTATION.horizontal
      ? splitterSize.width : splitterSize.height;

    const handlesCount = this.$element.find(`.${RESIZE_HANDLE_CLASS}`).length;
    const handlesSizeSum = handlesCount * DEFAULT_RESIZE_HANDLE_SIZE;

    return size - handlesSizeSum;
  }

  // _getSplitterItemsSizeSum(): number {
  //   const itemSizesSum = this.items.toArray().reduce((total, item) => {
  //     const itemRect = item.getBoundingClientRect();
  //     const itemSize = this.orientation === ORIENTATION.horizontal
  //       ? itemRect.width : itemRect.height;

  //     // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  //     const result = total + itemSize;
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     return result;
  //   }, 0);

  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //   return itemSizesSum;
  // }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _getNewLayout(e): number[] {
    const delta = (this._getOffset(e) / this._getSplitterItemsSizeSum()) * 100;

    const newLayoutState = [...this.layoutState];

    // @ts-expect-error todo: fix error
    const firstItemIndex: number = $(e.target).prev().data().dxItemIndex;
    const secondItemIndex = firstItemIndex + 1;

    const decreasingItemIndex = delta < 0 ? firstItemIndex : secondItemIndex;
    const currentSize = this.layoutState[decreasingItemIndex];
    const actualDelta: number = Math.min(Math.abs(delta), currentSize);
    newLayoutState[decreasingItemIndex] = currentSize - actualDelta;

    const increasingItemIndex = delta < 0 ? secondItemIndex : firstItemIndex;
    newLayoutState[increasingItemIndex] = this.layoutState[increasingItemIndex] + actualDelta;

    return newLayoutState;
  }
}
