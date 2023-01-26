import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Agenda:Tooltip`
  .page(url(__dirname, '../../container.html'));

test('Tooltip\'s date should be equal to date of current appointment(T1037028)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointmentName = 'Text';

  for (let index = 0; index < 5; index += 1) {
    await scheduler.hideAppointmentTooltip();

    await t.click(scheduler.getAppointment(appointmentName, index).element);

    const tooltipDate = await scheduler.appointmentTooltip
      .getListItem(appointmentName, 0).date.innerText;
    const expectedDate = await scheduler.getAppointment(appointmentName, index).date.time;

    await t.expect(tooltipDate).eql(expectedDate);
  }
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'Text',
      startDate: new Date(2021, 1, 1, 12),
      endDate: new Date(2021, 1, 1, 13),
      recurrenceRule: 'FREQ=HOURLY;COUNT=5',
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 1, 1),
    height: 600,
  });
});
