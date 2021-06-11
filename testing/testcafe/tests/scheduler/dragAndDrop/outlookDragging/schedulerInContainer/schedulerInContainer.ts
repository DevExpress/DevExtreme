import { ClientFunction } from 'testcafe';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { createScreenshotsComparer } from '../../../../../helpers/screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';

fixture`Outlook dragging, for case scheduler in container`
  .page(url(__dirname, '../../../../container.html'));

test('Dragging should be work right in case dxScheduler placed in dxTabPanel', async (t) => {
  const scheduler = new Scheduler('.dx-scheduler');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await t
    .drag(draggableAppointment.element, 0, 120, { speed: 0.1 })
    .expect(await takeScreenshot('dxScheduler-placed-in-dxTabPanel-drag-to-bottom.png'))
    .ok()

    .drag(draggableAppointment.element, 0, -170, { speed: 0.1 })
    .expect(await takeScreenshot('dxScheduler-placed-in-dxTabPanel-drag-to-top.png'))
    .ok()

    .drag(draggableAppointment.element, 100, 0, { speed: 0.1 })
    .expect(await takeScreenshot('dxScheduler-placed-in-dxTabPanel-drag-to-right.png'))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxTabPanel', {
    items: [{
      title: 'Info',
      text: 'This is Info Tab',
    }, {
      title: 'Contacts',
      text: 'This is Contacts Tab',
      disabled: true,
    }],
    itemTemplate: ClientFunction(() => ($('<div />') as any).dxScheduler({
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 30, 11),
        endDate: new Date(2021, 2, 30, 12),
      }],
      views: ['week', 'month'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      startDayHour: 9,
      height: 600,
    })),
  });
});
