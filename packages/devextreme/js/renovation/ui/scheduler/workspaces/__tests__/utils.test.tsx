import {
  getKeyByDateAndGroup,
} from '../utils';

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
});
