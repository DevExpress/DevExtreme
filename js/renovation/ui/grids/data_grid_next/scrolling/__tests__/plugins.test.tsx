import {
  ScrollingModeValue,
  ScrollingPositionValue,
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
} from '../plugins';
import {
  VisibleRows, TotalCount,
  DataStateValue,
} from '../../plugins';
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

    it('viewport skip value', () => {
      plugins.set(ScrollingPositionValue, { top: 75, left: 0 });
      plugins.set(RowHeightValue, 40);
      plugins.set(ItemHeightsValue, { 0: 35, 1: 35, 2: 35 });

      expect(plugins.getValue(CalculateViewportSkipValue)).toEqual(2);
    });
  });

  describe('CalculateViewportTakeValue', () => {
    beforeEach(reinitPlugins);

    it.each([
      ['standard', 4],
      ['virtual', 4],
    ])('viewport take value (mode: %s)', (mode, result) => {
      plugins.set(ScrollingModeValue, mode);
      plugins.set(TotalCount, 10);
      plugins.set(RowsViewHeightValue, 140);
      plugins.set(ScrollingPositionValue, { top: 75, left: 0 });
      plugins.extend(ViewportSkipValue, -1, () => 2);
      plugins.set(RowHeightValue, 40);
      plugins.set(ItemHeightsValue, { 0: 35, 1: 35, 2: 35 });

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
});
