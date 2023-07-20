import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';

fixture.disablePageReloads`T697037`
  .page(url(__dirname, '../../container.html'));

test('Recurrence exception date should equal date of appointment, which excluded from recurrence(T697037)', async (t) => {
  const scheduler = new Scheduler('#container');
  const targetCell = scheduler.getDateTableCell(3, 3);
  const appointment = scheduler.getAppointment('Test', 2);

  await t
    .dragToElement(appointment.element, targetCell, { speed: 0.5 });

  await t
    .expect(ClientFunction(() => (window as any).recurrenceException)())
    .eql('20181128T020000Z');
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Test',
    startDate: '2018-11-26T02:00:00Z',
    endDate: '2018-11-26T02:15:00Z',
    recurrenceRule: 'FREQ=DAILY;COUNT=5',
    recurrenceException: '',
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2018, 10, 26),
  dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
  timeZone: 'Etc/UTC',
  showAllDayPanel: false,
  recurrenceEditMode: 'occurrence',
  onAppointmentUpdating(e) {
    (window as any).recurrenceException = e.newData.recurrenceException;
  },
}));
