import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { Group } from '../../types';
import {
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
});
