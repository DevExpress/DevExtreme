import {
  getKeyByDateAndGroup,
  getKeyByGroup,
  addHeightToStyle,
  getIsGroupedAllDayPanel,
  getGroupCellClasses,
  isVerticalGroupOrientation,
} from '../utils';
import { GroupedViewData } from '../types.d';
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
      expect(getKeyByGroup(0))
        .toBe('0');
      expect(getKeyByGroup(1))
        .toBe('1');
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

  describe('getIsGroupedAllDayPanel', () => {
    it('should return false if all-day-panel is a part of the header', () => {
      const viewData: GroupedViewData = {
        groupedData: [{
          dateTable: [[{
            startDate: new Date(2020, 1, 2), endDate: new Date(2020, 1, 2), text: 'test', index: 0, key: '1',
          }]],
          allDayPanel: [{
            startDate: new Date(2020, 1, 1), endDate: new Date(2020, 1, 1), text: 'test1', index: 0, key: '2',
          }],
        }],
        cellCountInGroupRow: 1,
      };

      expect(getIsGroupedAllDayPanel(viewData, 0))
        .toBe(false);
    });

    it('should return true if all-day-panel is a part of the DateTable', () => {
      const viewData: GroupedViewData = {
        groupedData: [{
          dateTable: [[{
            startDate: new Date(2020, 1, 2), endDate: new Date(2020, 1, 2), text: 'test', index: 0, key: '1',
          }]],
          allDayPanel: [{
            startDate: new Date(2020, 1, 1), endDate: new Date(2020, 1, 1), text: 'test1', index: 0, key: '2',
          }],
          isGroupedAllDayPanel: true,
        }, {
          dateTable: [[{
            startDate: new Date(2020, 1, 3), endDate: new Date(2020, 1, 3), text: 'test3', index: 0, key: '3',
          }]],
          allDayPanel: [{
            startDate: new Date(2020, 1, 4), endDate: new Date(2020, 1, 4), text: 'test4', index: 0, key: '4',
          }],
          isGroupedAllDayPanel: true,
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
    [true, false].forEach((isFirstCell) => {
      [true, false].forEach((isLastCell) => {
        ['some-class', undefined].forEach((className) => {
          it(`should return correct classes if isFirstCell: ${isFirstCell}, isLastCell: ${isLastCell}, className: ${className}`, () => {
            const result = getGroupCellClasses(isFirstCell, isLastCell, className).trim();
            const assert = (value: string, not: boolean): void => {
              if (not) {
                expect(result).not.toContain(value);
              } else {
                expect(result).toContain(value);
              }
            };

            assert('dx-scheduler-first-group-cell', !isFirstCell);
            assert('dx-scheduler-last-group-cell', !isLastCell);
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
});
