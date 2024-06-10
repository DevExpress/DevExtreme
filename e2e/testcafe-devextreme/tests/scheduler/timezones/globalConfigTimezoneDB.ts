import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Timezone DB backward compatibility`
  .page(url(__dirname, '../../container.html'));

const setTimezoneOffset = ClientFunction(() => {
  (window as any).DevExpress.config({
    timezones: [
      {
        id: 'Europe/London', untils: 'Infinity', offsets: '5', offsetIndices: '0',
      },
    ],
  });
});
const clearTimezoneOffset = ClientFunction(() => {
  (window as any).DevExpress.config({
    timezones: null,
  });
});

const data = [
  {
    text: 'Prepare 2021 Marketing Plan',
    startDate: '2021-04-26T07:00:00.000Z',
    endDate: '2021-04-26T09:30:00.000Z',
  }];

test('Scheduler should support old timezone DB format', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot(
    'appointments_support_old_timezone_db.png',
    scheduler.workSpace,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setTimezoneOffset();

  await createWidget('dxScheduler', {
    dataSource: data,
    views: ['workWeek'],
    timeZone: 'Europe/London',
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 8,
    height: 600,
  });
}).after(async () => {
  await clearTimezoneOffset();
});
