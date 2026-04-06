import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';

fixture.disablePageReloads`Layout:Appointments:narrowAppointmentFluent`
  .page(url(__dirname, '../../../../container.html'));

test('Very narrow appointment in horizontal timeline should hide the appointment strip in Fluent theme', async (t) => {
  const scheduler = new Scheduler('#container');
  const strip = scheduler
    .getAppointment('short')
    .element.find('.dx-scheduler-appointment-strip');

  await t
    .expect(strip.exists)
    .ok()
    .expect(strip.getStyleProperty('display'))
    .eql('none');
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2016, 1, 2),
  dataSource: [
    {
      text: 'short',
      startDate: new Date(2016, 1, 2, 12, 0),
      endDate: new Date(2016, 1, 2, 12, 1),
    },
  ],
  views: ['timelineWeek'],
  currentView: 'timelineWeek',
  maxAppointmentsPerCell: 'unlimited',
  height: 505,
  width: 800,
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  firstDayOfWeek: 0,
}));
