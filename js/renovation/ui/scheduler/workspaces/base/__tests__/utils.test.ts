import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { Group } from '../../types';
import {
  createCellElementMetaData,
  getDateForHeaderText,
  getHiddenInterval,
  getRowCountWithAllDayRow,
  getTotalCellCount,
  getTotalRowCount,
} from '../utils';

describe('Workspace base utils', () => {
  const groups: Group[] = [{
    name: 'Group',
    items: [{
      id: 1,
      text: '1',
    }, {
      id: 2,
      text: '2',
    }],
    data: [{
      id: 1,
      text: '1',
    }, {
      id: 2,
      text: '2',
    }],
  }];

  describe('getTotalRowCount', () => {
    it('should work correctly without grouping', () => {
      expect(getTotalRowCount(5, HORIZONTAL_GROUP_ORIENTATION, [], false))
        .toBe(5);
    });

    it('should work correctly with horizontal grouping', () => {
      expect(getTotalRowCount(5, HORIZONTAL_GROUP_ORIENTATION, groups, false))
        .toBe(5);
    });

    it('should work correctly with vertical grouping', () => {
      expect(getTotalRowCount(5, VERTICAL_GROUP_ORIENTATION, groups, false))
        .toBe(10);
    });

    it('should work correctly with vertical grouping when all-day panel is visible', () => {
      expect(getTotalRowCount(5, VERTICAL_GROUP_ORIENTATION, groups, true))
        .toBe(12);
    });
  });

  describe('getTotalCellCount', () => {
    it('should work correctly without grouping', () => {
      expect(getTotalCellCount(5, HORIZONTAL_GROUP_ORIENTATION, []))
        .toBe(5);
    });

    it('should work correctly with horizontal grouping', () => {
      expect(getTotalCellCount(5, HORIZONTAL_GROUP_ORIENTATION, groups))
        .toBe(10);
    });

    it('should work correctly with vertical grouping', () => {
      expect(getTotalCellCount(5, VERTICAL_GROUP_ORIENTATION, groups))
        .toBe(5);
    });
  });

  describe('getRowCountWithAllDayRow', () => {
    it('should work correctly without all-day panel', () => {
      expect(getRowCountWithAllDayRow(5, false))
        .toBe(5);
    });

    it('should work correctly with all-day panel', () => {
      expect(getRowCountWithAllDayRow(5, true))
        .toBe(6);
    });
  });

  describe('getHiddenInterval', () => {
    it('should return a value depending on hoursInterval and cellCountInDay', () => {
      expect(getHiddenInterval(1, 5))
        .toBe(19 * 60 * 60 * 1000);

      expect(getHiddenInterval(3, 5))
        .toBe(9 * 60 * 60 * 1000);
    });
  });

  describe('createCellElementMetaData', () => {
    it('should update cellRect based on tableRect (DOMRect fields are getters)', () => {
      const cellRect = {
        get x() { return 1; },
        get y() { return 2; },
        get left() { return 150; },
        get top() { return 350; },
        get width() { return 5; },
        get height() { return 6; },
        get bottom() { return 7; },
        get right() { return 8; },
      };

      const tableRect = {
        get x() { return 9; },
        get y() { return 10; },
        get left() { return 100; },
        get top() { return 200; },
        get width() { return 13; },
        get height() { return 14; },
        get bottom() { return 15; },
        get right() { return 16; },
      };

      expect(createCellElementMetaData(
        tableRect as any,
        cellRect as any,
      ))
        .toEqual({
          x: 1,
          y: 2,
          left: 50,
          top: 150,
          width: 5,
          height: 6,
          bottom: 7,
          right: 8,
        });
    });
  });

  describe('getDateForHeaderText', () => {
    it('should return date', () => {
      const date = new Date(2021, 8, 11);

      expect(getDateForHeaderText(1, date, {} as any))
        .toBe(date);
    });
  });
});
