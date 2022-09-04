import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler - DataSource loading`
  .page(url(__dirname, '../../container.html'));

test('it should correctly load items with post processing', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment0 = scheduler.getAppointment('appt-0');

  await t
    .expect(scheduler.getAppointmentCount())
    .eql(1)
    .expect(appointment0.element.exists)
    .ok();
}).before(async () => createWidget(
  'dxScheduler',
  {
    dataSource: {
      store: [
        {
          text: 'appt-0',
          startDate: new Date(2021, 3, 26, 9, 30),
          endDate: new Date(2021, 3, 26, 11, 30),
        }, {
          text: 'appt-1',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 11, 30),
        }, {
          text: 'appt-2',
          startDate: new Date(2021, 3, 28, 9, 30),
          endDate: new Date(2021, 3, 28, 11, 30),
        },
      ],
      postProcess: (items) => [items[0]],
    },
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    width: 800,
  },
  true,
));

test('it should have start and end date in load options', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointmentByIndex(0).element)

    .expect(appointmentPopup.startDateElement.value)
    .eql('5/9/2021, 12:00 AM')

    .expect(appointmentPopup.endDateElement.value)
    .eql('5/15/2021, 2:59 AM');
}).before(async () => createWidget(
  'dxScheduler',
  {
    dataSource: {
      load: (loadOptions) => {
        const { startDate, endDate } = loadOptions;
        return [{
          text: 'test',
          startDate,
          endDate,
        }];
      },
    },
    currentDate: new Date(2021, 4, 11),
    width: 700,
    height: 500,
    startDayHour: 0,
    endDayHour: 3,
    groupByDate: true,
    views: ['week'],
    currentView: 'week',
  },
  true,
));
