import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';

fixture.skip`Scheduler: Cells Selection in Virtual Scrolling`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Selection should work correctly with all-day panel appointments', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.getAppointment('Appointment').element, { speed: 0.1 })
    .click(scheduler.getDateTableCell(0, 0), { speed: 0.1 })

    .expect(scheduler.getSelectedCells().count)
    .eql(1);
}).before(async () => createWidget('dxScheduler', {
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 11, 9),
  dataSource: [{
    startDate: new Date(2021, 11, 9),
    endDate: new Date(2021, 11, 9),
    allDay: true,
    text: 'Appointment',
  }],
}, true));
