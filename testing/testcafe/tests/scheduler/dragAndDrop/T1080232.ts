import { Selector } from 'testcafe';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Appointment (T1080232)`
  .page(url(__dirname, './pages/T1080232.html'));

test('it should correctly drag external item to the appointment after drag appointment', async (t) => {
  const scheduler = new Scheduler('#container');
  const dragItem = Selector('.drag-item');
  const cell01 = scheduler.getDateTableCell(1, 0);
  const appt01 = scheduler.getAppointment('Appt-01');
  const appt02 = scheduler.getAppointment('Appt-02');

  await t
    .dragToElement(appt01.element, cell01)
    .expect(appt01.element.getBoundingClientRectProperty('top'))
    .within(108, 109)
    .dragToElement(dragItem, appt02.element)
    .expect(appt02.element.innerText)
    .eql('Added');
}).before(async () => createScheduler({
  dataSource: [{
    text: 'Appt-01',
    startDate: new Date(2021, 3, 26, 10),
    endDate: new Date(2021, 3, 26, 11),
  }, {
    text: 'Appt-02',
    startDate: new Date(2021, 3, 26, 12),
    endDate: new Date(2021, 3, 26, 13),
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 3, 26),
  startDayHour: 9,
  width: 800,
  height: 600,
  appointmentTemplate(e, _, element) {
    const newData = e.appointmentData;

    return element
      .text(newData.text)
      .dxSortable({
        group: 'resourceGroup',
        data: [newData],
        onAdd: () => {
          element.text('Added');
        },
      });
  },
}));
