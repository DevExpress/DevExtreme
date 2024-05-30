import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { ClientFunction } from 'testcafe';

fixture.disablePageReloads`Timezone DB backward compatibility`
  .page(url(__dirname, '../../container.html'));

  const setGlobalConfig = ClientFunction(() => {
    (window as any).DevExpress.config({
      timezones: [
        { id: 'Europe/London', untils: 'Infinity', offsets: '5', offsetIndices: '0' },
      ]
    });
  });

test('Scheduler should support old timezone DB format', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);


  await takeScreenshot(
    `appointments support old timezone db.png`,
    scheduler.workSpace,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const currentDate = new Date(2021, 3, 27);
  await setGlobalConfig();         
  
  await createWidget('dxScheduler', {
      dataSource: data,
      views: ['workWeek'],
      timeZone: 'Europe/London',
      currentView: 'workWeek',
      currentDate,
      startDayHour: 8,
      height: 600,
  })
});

const data = [
  {
    text: 'Stand-up meeting',
    startDate: '2021-04-26T15:30:00.000Z',
    endDate: '2021-04-26T15:45:00.000Z',
    recurrenceRule: 'FREQ=DAILY',
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: '2021-04-28T18:00:00.000Z',
    endDate: '2021-04-28T19:00:00.000Z',
  }, {
    text: 'New Brochures',
    startDate: '2021-04-30T18:30:00.000Z',
    endDate: '2021-04-30T18:45:00.000Z',
  }, {
    text: 'Website Re-Design Plan',
    startDate: '2021-04-27T12:30:00.000Z',
    endDate: '2021-04-27T13:30:00.000Z',
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: '2021-04-28T16:00:00.000Z',
    endDate: '2021-04-28T15:00:00.000Z',
  }, {
    text: 'Prepare 2021 Marketing Plan',
    startDate: '2021-04-26T07:00:00.000Z',
    endDate: '2021-04-26T09:30:00.000Z',
  }, {
    text: 'Launch New Website',
    startDate: '2021-04-28T08:00:00.000Z',
    endDate: '2021-04-28T10:00:00.000Z',
  }, {
    text: 'Submit New Website Design',
    startDate: '2021-04-29T09:30:00.000Z',
    endDate: '2021-04-29T11:00:00.000Z',
  }, {
    text: 'Upgrade Server Hardware',
    startDate: '2021-04-30T06:30:00.000Z',
    endDate: '2021-04-30T08:00:00.000Z',
  }, {
    text: 'Approve New Online Marketing Strategy',
    startDate: '2021-04-30T11:00:00.000Z',
    endDate: '2021-04-30T12:30:00.000Z',
  }, {
    text: 'Final Budget Review',
    startDate: '2021-04-27T09:00:00.000Z',
    endDate: '2021-04-27T10:35:00.000Z',
  }];
