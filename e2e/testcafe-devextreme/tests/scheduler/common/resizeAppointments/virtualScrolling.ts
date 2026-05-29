import Scheduler from 'devextreme-testcafe-models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Resize appointments with virtual scrolling`
  .page(url(__dirname, '../../../container.html'));

test('T1325041: Appointment resize works with virtual scrolling enabled', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .drag(resizableAppointment.resizableHandle.right, 400, 0)
    .expect(resizableAppointment.size.width).eql('800px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 12:00 PM');
}).before(async () => createScheduler({
  views: [{
    type: 'timelineWorkWeek',
    groupOrientation: 'vertical',
  }],
  currentView: 'timelineWorkWeek',
  dataSource,
  groups: ['resourceId'],
  scrolling: { mode: 'virtual' },
}));
