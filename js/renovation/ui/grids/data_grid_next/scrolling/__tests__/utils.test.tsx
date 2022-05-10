import {
  calculateRowHeight, DEFAULT_ROW_HEIGHT, calculateItemHeights,
  calculateViewportItemIndex, getVirtualContentOffset,
  getNormalizedPageSize, calculatePageIndexByItemIndex,
  getTopScrollPosition,
} from '../utils';
import { Row, VirtualContentType } from '../../types';

describe('Utils', () => {
  describe('calculateRowHeight', () => {
    it.each`
          visibleRowHeights    | itemHeights                 | result
          ${[30, 30, 30]}      | ${{}}                       | ${30}
          ${[]}                | ${{ 0: 50, 1: 30, 2: 40 }}  | ${40}
          ${[30]}              | ${{ 0: 50 }}                | ${30}
          ${[]}                | ${{}}}                      | ${DEFAULT_ROW_HEIGHT}
      `('visibleRowHeights: $visibleRowHeights, itemHeights: $itemHeights, result: $result', ({
      visibleRowHeights, itemHeights, result,
    }) => {
      expect(calculateRowHeight(visibleRowHeights, itemHeights)).toEqual(result);
    });
  });

  describe('calculateItemHeights', () => {
    it.each([
      [
        [
          {
            key: 1, data: {}, rowType: 'data', loadIndex: 0,
          },
          {
            key: 2, data: {}, rowType: 'data', loadIndex: 1,
          },
          {
            key: 3, data: {}, rowType: 'data', loadIndex: 2,
          },
        ] as Row[],
        [30, 40, 35],
        [30, 40, 35],
      ],
      [
        [
          {
            key: 1, data: {}, rowType: 'data', loadIndex: 0,
          },
          {
            key: 1, data: {}, rowType: 'detail', loadIndex: 0,
          },
          {
            key: 2, data: {}, rowType: 'data', loadIndex: 1,
          },
        ] as Row[],
        [30, 40, 35],
        [70, 35],
      ],
      [
        [
          {
            key: 1, data: {}, rowType: 'data', loadIndex: 0,
          },
          {
            key: 2, data: {}, rowType: 'data', loadIndex: 1,
          },
          {
            key: 3, data: {}, rowType: 'data', loadIndex: 2,
          },
        ] as Row[],
        [30, 40, 35, 35],
        [30, 40, 35],
      ],
    ])('row heights', (visibleRows: Row[], rowHeights, result) => {
      expect(calculateItemHeights(visibleRows, rowHeights)).toEqual(result);
    });
  });

  describe('calculateViewportItemIndex', () => {
    it.each([
      [5, 25, { 0: 35, 1: 35, 2: 35 }, 0.14],
      [0, 25, { 0: 35, 1: 35, 2: 35 }, 0],
      [40, 25, { 0: 35, 1: 35, 2: 35 }, 1.14],
      [75, 25, { 0: 35, 1: 35, 2: 35 }, 2.14],
      [150, 25, { 0: 35, 1: 35, 2: 35 }, 4.8],
    ])('item index', (topPosition, rowHeight, itemHeights, result) => {
      expect(calculateViewportItemIndex(topPosition, rowHeight, itemHeights)).toEqual(result);
    });
  });

  describe('getVirtualContentOffset', () => {
    it.each([
      ['top', 5, 20, { 0: 35, 1: 35, 2: 35 }, 10, 125],
      ['top', 5, 20, {
        0: 35, 1: 35, 2: 35, 3: 35, 4: 35,
      }, 10, 175],
      ['top', 5, 20, {}, 10, 50],
      ['bottom', 5, 20, { 0: 35, 1: 35, 2: 35 }, 10, 50],
      ['bottom', 15, 20, {
        15: 35, 16: 35, 17: 35, 18: 35, 19: 35,
      }, 10, 275],
      ['bottom', 15, 20, {}, 10, 150],
      ['bottom', 3, 20, {
        15: 35, 16: 35, 17: 35, 18: 35, 19: 35,
      }, 10, 105],
      ['bottom', 0, 20, {
        15: 35, 16: 35, 17: 35, 18: 35, 19: 35,
      }, 10, 0],
      ['bottom', 1, 2, { 0: 35, 1: 35, 2: 35 }, 10, 35],
    ])('virtual content offset', (type, itemIndex, totalCount, itemHeights, rowHeight, result) => {
      const contentType = type as VirtualContentType;
      expect(getVirtualContentOffset(contentType, itemIndex, totalCount, itemHeights, rowHeight))
        .toEqual(result);
    });
  });

  describe('getTopScrollPosition', () => {
    it.each([
      [1, 20, { 0: 30, 2: 30, 3: 30 }, 30, 600],
      [1, 20, {}, 30, 600],
      [1, 20, { 0: 30, 2: 50, 3: 30 }, 30, 620],
      [1, 20, { 50: 30 }, 30, 600],
    ])('correct top scroll position', (pageIndex, pageSize, itemHeights, rowHeight, result) => {
      expect(getTopScrollPosition(pageIndex, pageSize, itemHeights, rowHeight)).toEqual(result);
    });
  });

  describe('getNormalizedPageSize', () => {
    it.each([
      ['all', 0],
      [10, 10],
    ])('correct pageSize', (pageSize, result) => {
      expect(getNormalizedPageSize(pageSize as number | 'all')).toEqual(result);
    });
  });

  describe('calculatePageIndexByItemIndex', () => {
    it.each([
      [0, 20, 100, 0],
      [10, 20, 100, 0],
      [25, 20, 100, 1],
      [10, 0, 100, 0],
    ])('correct pageIndex', (itemIndex, pageSize, totalCount, result) => {
      expect(calculatePageIndexByItemIndex(itemIndex, pageSize, totalCount)).toEqual(result);
    });
  });
});
