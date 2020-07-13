import { getKeyByDateAndGroup } from './utils';

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
});
