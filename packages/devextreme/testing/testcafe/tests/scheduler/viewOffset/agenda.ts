import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Offset: Agenda`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';

[
  0,
  -240,
  240,
].forEach((offset) => {
  test('Agenda view should not be affected by root offset option', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await takeScreenshot(`offset_agenda-not-affected_offset-${offset}.png`, scheduler.workSpace);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [
        {
          startDate: '2023-09-04T00:00:00',
          endDate: '2023-09-04T02:00:00',
          text: '#0 04: 00 -> 02',
        },
        {
          startDate: '2023-09-04T10:00:00',
          endDate: '2023-09-04T12:00:00',
          text: '#1 04: 10 -> 12',
        },
        {
          startDate: '2023-09-04T23:00:00',
          endDate: '2023-09-05T01:00:00',
          text: '#2 04: 22 -> 01',
        },
      ],
      currentView: 'agenda',
      currentDate: '2023-09-03',
      height: 800,
      offset,
    });
  });
});
