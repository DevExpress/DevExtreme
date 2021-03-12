import {
  getKeyByDateAndGroup,
  getKeyByGroup,
  addHeightToStyle,
  addWidthToStyle,
  getIsGroupedAllDayPanel,
  getGroupCellClasses,
  isVerticalGroupOrientation,
  isHorizontalGroupOrientation,
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
      expect(getKeyByGroup(0, VERTICAL_GROUP_ORIENTATION))
        .toBe('0');
      expect(getKeyByGroup(1, VERTICAL_GROUP_ORIENTATION))
        .toBe('1');
    });

    it('should return 0 when group orientation is not provided', () => {
      expect(getKeyByGroup(32, undefined))
        .toBe('0');
    });

    it('should return 0 when group orientation is horizontal', () => {
      expect(getKeyByGroup(32, HORIZONTAL_GROUP_ORIENTATION))
        .toBe('0');
    });
  });

  describe('addHeightToStyle', () => {
    it('should return an empty obbject if height is undefined', () => {
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
      const viewData: any = {
        groupedData: [{
          dateTable: [[{
            startDate: new Date(2020, 1, 2),
            endDate: new Date(2020, 1, 2),
            text: 'test',
            index: 0,
            key: '1',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }]],
          allDayPanel: [{
            startDate: new Date(2020, 1, 1),
            endDate: new Date(2020, 1, 1),
            text: 'test1',
            index: 0,
            key: '2',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }],
          groupIndex: 1,
        }],
        cellCountInGroupRow: 1,
      };

      expect(getIsGroupedAllDayPanel(viewData, 0))
        .toBe(false);
    });

    it('should return true if all-day-panel is a part of the DateTable', () => {
      const viewData: any = {
        groupedData: [{
          dateTable: [[{
            startDate: new Date(2020, 1, 2),
            endDate: new Date(2020, 1, 2),
            text: 'test',
            index: 0,
            key: '1',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }]],
          allDayPanel: [{
            startDate: new Date(2020, 1, 1),
            endDate: new Date(2020, 1, 1),
            text: 'test1',
            index: 0,
            key: '2',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }],
          isGroupedAllDayPanel: true,
          groupIndex: 1,
        }, {
          dateTable: [[{
            startDate: new Date(2020, 1, 3),
            endDate: new Date(2020, 1, 3),
            text: 'test3',
            index: 0,
            key: '3',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }]],
          allDayPanel: [{
            startDate: new Date(2020, 1, 4),
            endDate: new Date(2020, 1, 4),
            text: 'test4',
            index: 0,
            key: '4',
            isFirstGroupCell: false,
            isLastGroupCell: false,
          }],
          isGroupedAllDayPanel: true,
          groupIndex: 2,
        }],
        cellCountInGroupRow: 1,
      };

      expect(getIsGroupedAllDayPanel(viewData, 0))
        .toBe(true);

      expect(getIsGroupedAllDayPanel(viewData, 1))
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

  describe('isVerticalGroupOrientation', () => {
    it('should return true if group orientation is vertical', () => {
      expect(isVerticalGroupOrientation(VERTICAL_GROUP_ORIENTATION))
        .toBe(true);
    });

    it('should return false if group orientation is not vertical', () => {
      expect(isVerticalGroupOrientation(HORIZONTAL_GROUP_ORIENTATION))
        .toBe(false);
      expect(isVerticalGroupOrientation())
        .toBe(false);
    });
  });

  describe('isHorizontalGroupOrientation', () => {
    const testGroups = [{}] as any;

    it('should return true if group orientation is horizontal and groups length is more than 0', () => {
      expect(isHorizontalGroupOrientation(testGroups, HORIZONTAL_GROUP_ORIENTATION))
        .toBe(true);
    });

    it('should return false if group orientation is not horizontal', () => {
      expect(isHorizontalGroupOrientation(testGroups, VERTICAL_GROUP_ORIENTATION))
        .toBe(false);
      expect(isHorizontalGroupOrientation(testGroups))
        .toBe(false);
    });

    it('should return false if groups length is 0', () => {
      expect(isHorizontalGroupOrientation([], HORIZONTAL_GROUP_ORIENTATION))
        .toBe(false);
    });
  });
});
