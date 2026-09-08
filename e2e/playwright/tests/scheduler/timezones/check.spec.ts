import { expect } from '../../../fixtures';
import type { MachineTimezonesType } from '../../../helpers/machineTimezones';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../helpers/machineTimezones';

type CheckType = [MachineTimezonesType, string];

const checks: CheckType[] = [
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'Mon Jan 01 2024 10:00:00 GMT-0800 (Pacific Standard Time)'],
  [MACHINE_TIMEZONES.EuropeBerlin, 'Mon Jan 01 2024 10:00:00 GMT+0100 (Central European Standard Time)'],
];

checks.forEach(([timezone, expectedResult]) => {
  getTimezoneTest([timezone])(`${timezone} check`, async ({ page }) => {
    const dateFromBrowser = await page.evaluate(() => new Date(2024, 0, 1, 10).toString());

    expect(dateFromBrowser).toBe(expectedResult);
  });
});
