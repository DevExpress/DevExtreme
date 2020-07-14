import { getKeyByDateAndGroup, addHeightToStyle } from '../../../../js/renovation/scheduler/workspaces/utils';

describe('Workspaces utils', () => {
  describe('getKeyByDateAndGroup', () => {
    const testDate = new Date(2020, 6, 13);
    it('should generate key from date', () => {
      expect(getKeyByDateAndGroup(testDate))
        .toBe(testDate.toString());
    });

    it('should generate key from date and group', () => {
      const testGroup = {
        resource1: 1,
        resource2: 3,
      };
      expect(getKeyByDateAndGroup(testDate, testGroup))
        .toBe(`${testDate.toString()}_resource1_1_resource2_3`);
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
});
