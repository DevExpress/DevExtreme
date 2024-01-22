import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

fixture`Appointment (T1080232)`
  .page(url(__dirname, '../../container.html'));

test('it should correctly drag external item to the appointment after drag appointment', async (t) => {
  const scheduler = new Scheduler('#scheduler');
  const dragItem = Selector('.drag-item');
  const cell01 = scheduler.getDateTableCell(1, 0);
  const appt01 = scheduler.getAppointment('Appt-01');
  const appt02 = scheduler.getAppointment('Appt-02');

  await t
    .dragToElement(appt01.element, cell01, { speed: 0.5 })
    .expect((await appt01.element.boundingClientRect).top)
    .eql(208)
    .dragToElement(dragItem, appt02.element, { speed: 0.5 })
    .expect(appt02.element.innerText)
    .eql('Added');
}).before(async () => {
  await appendElementTo('#container', 'div', 'list');

  await ClientFunction(() => {
    $('#list').append('<div>drag-item</div>').addClass('drag-item');
  })();

  await appendElementTo('#container', 'div', 'scheduler');

  await createWidget('dxSortable', {
    group: 'resourceGroup',
  }, '#list');

  return createWidget('dxScheduler', {
    resources: [
      {
        fieldExpr: 'resourceId',
        dataSource: [
          { id: 0, color: '#e01e38' },
          { id: 1, color: '#f98322' },
          { id: 2, color: '#1e65e8' },
        ],
        label: 'Color',
      },
    ],
    firstDayOfWeek: 1,
    maxAppointmentsPerCell: 5,
    currentView: 'day',
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
  }, '#scheduler');
});
