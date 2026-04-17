import { test, expect } from '@playwright/test';
import { setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;
type MachineTimezonesType = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

type CheckType = [MachineTimezonesType, string];
const checks: CheckType[] = [
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'Mon Jan 01 2024 10:00:00 GMT-0800 (Pacific Standard Time)'],
  [MACHINE_TIMEZONES.EuropeBerlin, 'Mon Jan 01 2024 10:00:00 GMT+0100 (Central European Standard Time)'],
];

test.describe('Runner machine timezone checks', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  checks.forEach(([timezone, expectedResult]) => {
    test.describe(`timezone: ${timezone}`, () => {
      test.use({ timezoneId: timezone });

      test(`${timezone} check`, async ({ page }) => {
        const dateFromBrowser = await page.evaluate(
          () => new Date(2024, 0, 1, 10).toString(),
        );
        expect(dateFromBrowser).toBe(expectedResult);
      });
    });
  });
});
