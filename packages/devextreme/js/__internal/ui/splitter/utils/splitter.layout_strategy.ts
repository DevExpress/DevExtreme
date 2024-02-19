// @ts-nocheck

import $ from '@js/core/renderer';
import {
  normalizeStyleProp, styleProp,
} from '@js/core/utils/style';

const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export default class SplitterLayoutStrategy {
  private readonly items: unknown;

  private readonly orientation: string;

  private layoutState: number[];

  constructor(items: unknown, orientation: string) {
    this.items = items;
    this.orientation = orientation;
  }

  initializeState(): void {
    this.layoutState = [];
    this.items.each((index, splitterItem) => {
      this.layoutState.push(parseFloat($(splitterItem).css('flex-grow')));
    });
  }

  applyNewLayout(e: unknown): void {
    const newLayoutState = this._getNewLayout(e);

    this.items.each((index, item) => {
      this._setFlexProp(item, 'flexGrow', newLayoutState[index]);
    });
  }

  layoutItems(): void {
    // NOTE: temporarily evenly distributed
    const splitterItemRatio = 100 / this.items.length;

    this.items.each((index, item) => {
      this._setFlexProp(item, 'flexGrow', splitterItemRatio);
    });
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, class-methods-use-this
  _setFlexProp(element, prop, value): void {
    const normalizedProp = normalizeStyleProp(prop, value);
    element.style[styleProp(prop)] = normalizedProp;
  }

  _getOffset(e: unknown): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.orientation === ORIENTATION.horizontal ? e.offset.x : e.offset.y;
  }

  _getSplitterItemsSizeSum(): number {
    const itemSizesSum = this.items.toArray().reduce((total, item) => {
      const itemRect = item.getBoundingClientRect();
      const itemSize = this.orientation === ORIENTATION.horizontal
        ? itemRect.width : itemRect.height;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return total + itemSize;
    }, 0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemSizesSum;
  }

  _getNewLayout(e: undefined): unknown {
    const delta = (this._getOffset(e) / this._getSplitterItemsSizeSum()) * 100;

    const newLayoutState = [...this.layoutState];

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
