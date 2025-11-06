import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: take into account start and end day hour`
  .page(url(__dirname, '../../../container.html'));

test('Should show appointment in month view', async (t) => {
  const scheduler = new Scheduler('#container');
  await t.expect(scheduler.getAppointment('test').element.exists).ok();
}).before(async () => createWidget('dxScheduler', {
  dataSource: [
    {
      startDate: '2024-01-01T11:00:00',
      endDate: '2024-01-01T12:00:00',
      text: 'test',
    },
  ],
  startDayHour: 11,
  endDayHour: 22,
  currentDate: '2024-01-01',
  views: [
    'month',
    'timelineMonth',
  ],
  currentView: 'month',
}));

test('Shouldn\'t show appointment in month view', async (t) => {
  const scheduler = new Scheduler('#container');
  await t.expect(scheduler.getAppointment('test').element.exists).notOk();
}).before(async () => createWidget('dxScheduler', {
  dataSource: [
    {
      startDate: '2024-01-01T11:00:00',
      endDate: '2024-01-01T12:00:00',
      text: 'test',
    },
  ],
  startDayHour: 13,
  endDayHour: 22,
  currentDate: '2024-01-01',
  views: [
    'month',
    'timelineMonth',
  ],
  currentView: 'month',
}));
