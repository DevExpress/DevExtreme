import {
  ScrollingModeValue,
  TopScrollingPositionValue,
  ViewportSkipValue,
  ViewportTakeValue,
  ItemHeightsValue,
  RowHeightValue,
  CalculateViewportSkipValue,
  CalculateViewportTakeValue,
  AddLoadIndexToVisibleRows,
  CalculateVisibleRowsInViewport,
  CalculateTopVirtualRowHeight,
  CalculateBottomVirtualRowHeight,
  CalculateViewportPageIndex,
  CalculateViewportLoadPageCount,
  ViewportPageIndex,

} from '../plugins';
import {
  VisibleRows, TotalCount,
  DataStateValue,
} from '../../plugins';
import {
  PageSize,
} from '../../paging/plugins';
import { RowsViewHeightValue } from '../../views/table_content';
import { Plugins } from '../../../../../utils/plugin/context';
import { Row } from '../../types';

describe('Plugins', () => {
  let plugins = new Plugins();
  const reinitPlugins = () => {
    plugins = new Plugins();
  };

  describe('CalculateViewportSkipValue', () => {
    beforeEach(reinitPlugins);

    it.each([
      [75, 40, { 0: 35, 1: 35, 2: 35 }, 100, 2],
      [undefined, 40, { 0: 35, 1: 35, 2: 35 }, 100, 0],
      [101, 40, { 0: 35, 1: 35, 2: 35 }, 1, 1],
    ])('viewport skip value', (topScroll, rowHeight, itemHeights, totalCount, result) => {
      plugins.set(TopScrollingPositionValue, topScroll);
      plugins.set(RowHeightValue, rowHeight);
      plugins.set(ItemHeightsValue, itemHeights);
      plugins.set(TotalCount, totalCount);

      expect(plugins.getValue(CalculateViewportSkipValue)).toEqual(result);
    });
  });

  describe('CalculateViewportTakeValue', () => {
    beforeEach(reinitPlugins);

    it.each([
      ['standard', 10, 140, 75, 2, 40, { 0: 35, 1: 35, 2: 35 }, 4],
      ['virtual', 10, 140, 75, 2, 40, { 0: 35, 1: 35, 2: 35 }, 4],
      ['standard', undefined, undefined, undefined, 0, 40, { 0: 35, 1: 35, 2: 35 }, 0],
    ])('viewport take value (mode: %s)', (
      mode, totalCount, rowsViewHeight, topScroll,
      skipValue, rowHeight, itemHeights, result,
    ) => {
      plugins.set(ScrollingModeValue, mode);
      plugins.set(TotalCount, totalCount);
      plugins.set(RowsViewHeightValue, rowsViewHeight);
      plugins.set(TopScrollingPositionValue, topScroll);
      plugins.extend(ViewportSkipValue, -1, () => skipValue);
      plugins.set(RowHeightValue, rowHeight);
      plugins.set(ItemHeightsValue, itemHeights);

      expect(plugins.getValue(CalculateViewportTakeValue)).toEqual(result);
    });
  });

  describe('AddLoadIndexToVisibleRows', () => {
    beforeEach(reinitPlugins);

    it.each([
      [
        { data: [] },
        [
          { data: {}, rowType: 'data', loadIndex: 0 },
          { data: {}, rowType: 'detail', loadIndex: 0 },
          { data: {}, rowType: 'data', loadIndex: 1 },
        ],
      ],
      [
        { data: [], dataOffset: 5 },
        [
          { data: {}, rowType: 'data', loadIndex: 5 },
          { data: {}, rowType: 'detail', loadIndex: 5 },
          { data: {}, rowType: 'data', loadIndex: 6 },
        ],
      ],
    ])('add load index to visible row', (dataState, result) => {
      plugins.extend(VisibleRows, -1, () => [
        { data: {}, rowType: 'data' },
        { data: {}, rowType: 'detail' },
        { data: {}, rowType: 'data' },
      ]);
      plugins.set(DataStateValue, dataState);

      expect(plugins.getValue(AddLoadIndexToVisibleRows)).toEqual(result);
    });
  });

  describe('CalculateVisibleRowsInViewport', () => {
    beforeEach(reinitPlugins);

    it.each([
      [
        [
          { data: {}, rowType: 'data', loadIndex: 0 },
          { data: {}, rowType: 'detail', loadIndex: 0 },
          { data: {}, rowType: 'data', loadIndex: 1 },
          { data: {}, rowType: 'data', loadIndex: 2 },
          { data: {}, rowType: 'detail', loadIndex: 2 },
          { data: {}, rowType: 'data', loadIndex: 3 },
          { data: {}, rowType: 'data', loadIndex: 4 },
          { data: {}, rowType: 'detail', loadIndex: 4 },
          { data: {}, rowType: 'data', loadIndex: 5 },
          { data: {}, rowType: 'data', loadIndex: 6 },
          { data: {}, rowType: 'detail', loadIndex: 6 },
        ],
        [
          { data: {}, rowType: 'data', loadIndex: 2 },
          { data: {}, rowType: 'detail', loadIndex: 2 },
          { data: {}, rowType: 'data', loadIndex: 3 },
          { data: {}, rowType: 'data', loadIndex: 4 },
          { data: {}, rowType: 'detail', loadIndex: 4 },
        ],
      ],
      [
        [
          { data: {}, rowType: 'data' },
          { data: {}, rowType: 'detail' },
          { data: {}, rowType: 'data' },
          { data: {}, rowType: 'data' },
          { data: {}, rowType: 'detail' },
          { data: {}, rowType: 'data' },
        ],
        [],
      ],
    ])('rows in viewport', (visibleRows, result) => {
      plugins.extend(VisibleRows, -1, () => visibleRows as Row[]);
      plugins.extend(ViewportSkipValue, -1, () => 2);
      plugins.extend(ViewportTakeValue, -1, () => 3);

      expect(plugins.getValue(CalculateVisibleRowsInViewport)).toEqual(result);
    });
  });

  describe('CalculateTopVirtualRowHeight', () => {
    beforeEach(reinitPlugins);

    it('top virtual row height', () => {
      plugins.extend(ViewportSkipValue, -1, () => 2);
      plugins.set(RowHeightValue, 20);
      plugins.set(TotalCount, 30);
      plugins.set(ItemHeightsValue, { 1: 30, 2: 30 });

      expect(plugins.getValue(CalculateTopVirtualRowHeight)).toEqual(50);
    });
  });

  describe('CalculateBottomVirtualRowHeight', () => {
    beforeEach(reinitPlugins);

    it('bottom virtual row height', () => {
      plugins.extend(ViewportSkipValue, -1, () => 2);
      plugins.set(RowHeightValue, 20);
      plugins.set(TotalCount, 30);
      plugins.set(ItemHeightsValue, { 1: 30, 2: 30 });
      plugins.extend(VisibleRows, -1, () => [
        { data: {}, rowType: 'data' },
        { data: {}, rowType: 'data' },
        { data: {}, rowType: 'detail' },
        { data: {}, rowType: 'data' },
      ]);

      expect(plugins.getValue(CalculateBottomVirtualRowHeight)).toEqual(500);
    });
  });

  describe('CalculateViewportPageIndex', () => {
    beforeEach(reinitPlugins);

    it('correct value', () => {
      plugins.extend(ViewportSkipValue, -1, () => 35);
      plugins.set(PageSize, 20);
      plugins.set(TotalCount, 100);

      expect(plugins.getValue(CalculateViewportPageIndex)).toEqual(1);
    });
  });

  describe('CalculateViewportLoadPageCount', () => {
    beforeEach(reinitPlugins);

    it.each([
      [10, 15, 20, 0, 2],
      [0, 15, 20, 0, 1],
      [25, 25, 'all', 2, 0],
    ])('correct value', (skip, take, pageSize, viewportPageIndex, result) => {
      plugins.extend(ViewportSkipValue, -1, () => skip);
      plugins.extend(ViewportTakeValue, -1, () => take);
      plugins.set(PageSize, pageSize);
      plugins.extend(ViewportPageIndex, -1, () => viewportPageIndex);

      expect(plugins.getValue(CalculateViewportLoadPageCount)).toEqual(result);
    });
  });
});
