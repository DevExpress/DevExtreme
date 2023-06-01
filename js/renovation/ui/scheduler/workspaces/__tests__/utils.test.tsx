import {
  getKeyByDateAndGroup,
  getKeyByGroup,
  addHeightToStyle,
  addWidthToStyle,
  getIsGroupedAllDayPanel,
  getGroupCellClasses,
  isVerticalGroupingApplied,
  isHorizontalGroupingApplied,
  isGroupingByDate,
  addToStyles,
} from '../utils';
import { VERTICAL_GROUP_ORIENTATION, HORIZONTAL_GROUP_ORIENTATION } from '../../consts';

describe('Workspaces utils', () => {
  describe('getKeyByDateAndGroup', () => {
    const testDate = new Date(2020, 6, 13);
    const time = testDate.getTime();

    it('should generate key from date', () => {
      expect(getKeyByDateAndGroup(testDate))
        .toBe(time.toString());
    });

    it('should generate key from date and group', () => {
      const testGroup = 3;
      expect(getKeyByDateAndGroup(testDate, testGroup))
        .toBe(`${time + testGroup}`);
    });
  });

  describe('getKeyByGroup', () => {
    it('should generate key from group', () => {
      expect(getKeyByGroup(0, true))
        .toBe('0');
      expect(getKeyByGroup(1, true))
        .toBe('1');
    });

    it('should return 0 when group orientation is horizontal', () => {
      expect(getKeyByGroup(32, false))
        .toBe('0');
    });

    it('should return "0" when groupIndex is undefined', () => {
      expect(getKeyByGroup(undefined, false))
        .toBe('0');
    });
  });

  describe('addHeightToStyle', () => {
    it('should return an empty object if height is undefined', () => {
      expect(addHeightToStyle(undefined))
        .toEqual({});
    });

    it('should return ucorrect style if height is provided', () => {
      expect(addHeightToStyle(500))
        .toEqual({
          height: '500px',
        });
    });

    it('should spread styles', () => {
      expect(addHeightToStyle(500, { width: '300px' }))
        .toEqual({
          height: '500px',
          width: '300px',
        });
    });

    it('should spread styles when height is defined in restAttributes', () => {
      expect(addHeightToStyle(500, { width: '300px', height: '400px' }))
        .toEqual({
          height: '500px',
          width: '300px',
        });
    });
  });

  describe('addToStyles', () => {
    it('should return correct result', () => {
      expect(addToStyles([{
        attr: 'someAttr',
        value: 'someValue',
      }, {
        attr: 'someAttr1',
        value: 123,
      }]))
        .toEqual({ someAttr: 'someValue', someAttr1: 123 });
    });

    it('should return correct result if default style is presents', () => {
      expect(addToStyles([{
        attr: 'someAttr',
        value: 'someValue',
      }, {
        attr: 'someAttr1',
        value: 123,
      }], { width: '600px' }))
        .toEqual({
          someAttr: 'someValue',
          someAttr1: 123,
          width: '600px',
        });
    });
  });

  describe('addWidthToStyle', () => {
    it('should return an empty obbject if width is undefined', () => {
      expect(addWidthToStyle(undefined))
        .toEqual({});
    });

    it('should return ucorrect style if width is provided', () => {
      expect(addWidthToStyle(500))
        .toEqual({
          width: '500px',
        });
    });

    it('should spread styles', () => {
      expect(addWidthToStyle(500, { height: '300px' }))
        .toEqual({
          height: '300px',
          width: '500px',
        });
    });

    it('should spread styles when width is defined in restAttributes', () => {
      expect(addWidthToStyle(500, { width: '300px', height: '400px' }))
        .toEqual({
          height: '400px',
          width: '500px',
        });
    });
  });

  describe('getIsGroupedAllDayPanel', () => {
    it('should return false if all-day-panel is a part of the header', () => {
      expect(getIsGroupedAllDayPanel(false, false))
        .toBe(false);
      expect(getIsGroupedAllDayPanel(false, true))
        .toBe(false);
    });

    it('should return false in case of horizontal grouping', () => {
      expect(getIsGroupedAllDayPanel(true, false))
        .toBe(false);
    });

    it('should return true if all-day-panel is not a part of the header and vertical grouping is used', () => {
      expect(getIsGroupedAllDayPanel(true, true))
        .toBe(true);
    });
  });

  describe('getGroupCellClasses', () => {
    [true, false].forEach((isFirstGroupCell) => {
      [true, false].forEach((isLastGroupCell) => {
        ['some-class', undefined].forEach((className) => {
          it(`should return correct classes if isFirstGroupCell: ${isFirstGroupCell}, isLastGroupCell: ${isLastGroupCell}, className: ${className}`, () => {
            const result = getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className).trim();
            const assert = (value: string, not: boolean): void => {
              if (not) {
                expect(result).not.toContain(value);
              } else {
                expect(result).toContain(value);
              }
            };

            assert('dx-scheduler-first-group-cell', !isFirstGroupCell);
            assert('dx-scheduler-last-group-cell', !isLastGroupCell);
            assert('some-class', !className);
          });
        });
      });
    });
  });

  describe('isVerticalGroupingApplied', () => {
    const groups = [{
      name: 'groupId',
      items: [{ id: 1 }],
      data: [{ id: 1 }],
    }];

    it('should return true if group orientation is vertical', () => {
      expect(isVerticalGroupingApplied(groups, VERTICAL_GROUP_ORIENTATION))
        .toBe(true);
    });

    it('should return false if group orientation is not vertical', () => {
      expect(isVerticalGroupingApplied(groups, HORIZONTAL_GROUP_ORIENTATION))
        .toBe(false);
      expect(isVerticalGroupingApplied(groups))
        .toBe(false);
    });

    it('should return false if groups are empty', () => {
      expect(isVerticalGroupingApplied([], VERTICAL_GROUP_ORIENTATION))
        .toBe(false);
    });
  });

  describe('isHorizontalGroupingApplied', () => {
    const testGroups = [{}] as any;

    it('should return true if group orientation is horizontal and groups length is more than 0', () => {
      expect(isHorizontalGroupingApplied(testGroups, HORIZONTAL_GROUP_ORIENTATION))
        .toBe(true);
    });

    it('should return false if group orientation is not horizontal', () => {
      expect(isHorizontalGroupingApplied(testGroups, VERTICAL_GROUP_ORIENTATION))
        .toBe(false);
      expect(isHorizontalGroupingApplied(testGroups))
        .toBe(false);
    });

    it('should return false if groups length is 0', () => {
      expect(isHorizontalGroupingApplied([], HORIZONTAL_GROUP_ORIENTATION))
        .toBe(false);
    });
  });

  describe('isGroupingByDate', () => {
    const testGroups = [{}] as any;

    it('should return true if group orientation is horizontal and groupByDate is true', () => {
      expect(isGroupingByDate(testGroups, HORIZONTAL_GROUP_ORIENTATION, true))
        .toBe(true);
    });

    it('should return false if group orientation is horizontal and groupByDate is false', () => {
      expect(isGroupingByDate(testGroups, HORIZONTAL_GROUP_ORIENTATION, false))
        .toBe(false);
    });

    it('should return false if group orientation is vertical', () => {
      expect(isGroupingByDate(testGroups, VERTICAL_GROUP_ORIENTATION, false))
        .toBe(false);
    });
  });
});
