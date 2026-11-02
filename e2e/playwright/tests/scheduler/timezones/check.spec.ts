import { expect, test } from '../../../fixtures';
import type { MachineTimezone } from '../../../helpers/timezones';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../helpers/timezones';

type CheckType = [MachineTimezone, string];
const checks: CheckType[] = [
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'Mon Jan 01 2024 10:00:00 GMT-0800 (Pacific Standard Time)'],
  [MACHINE_TIMEZONES.EuropeBerlin, 'Mon Jan 01 2024 10:00:00 GMT+0100 (Central European Standard Time)'],
];

test.describe('Runner machine timezone checks', () => {
  checks.forEach(([timezone, expectedResult]) => {
    getTimezoneTest(timezone)(`${timezone} check`, async ({ page }) => {
      const dateFromBrowser = await page.evaluate(() => new Date(2024, 0, 1, 10).toString());

      expect(dateFromBrowser).toBe(expectedResult);
      // The browser and this process no longer share the machine clock, and the tests build dates
      // on both sides, so both have to be in the timezone of the job.
      expect(new Date(2024, 0, 1, 10).toString()).toBe(expectedResult);
    });
  });
});
