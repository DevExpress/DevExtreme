import { ClientFunction } from 'testcafe';
import { getTimezoneTest, MACHINE_TIMEZONES, MachineTimezonesType } from '../../../helpers/machineTimezones';
import url from '../../../helpers/getPageUrl';

fixture
  .disablePageReloads`Runner machine timezone checks`
  .page(url(__dirname, '../../container.html'));

type CheckType = [MachineTimezonesType, string];
const checks: CheckType[] = [
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'Mon Jan 01 2024 10:00:00 GMT-0800 (Pacific Standard Time)'],
  [MACHINE_TIMEZONES.EuropeBerlin, 'Mon Jan 01 2024 10:00:00 GMT+0100 (Central European Standard Time)'],
];

checks.forEach(([timezone, expectedResult]) => {
  getTimezoneTest([timezone])(`${timezone} check`, async (t) => {
    const dateFromBrowser = await ClientFunction(() => new Date(2024, 0, 1, 10).toString())();
    await t.expect(dateFromBrowser).eql(expectedResult);
  });
});
