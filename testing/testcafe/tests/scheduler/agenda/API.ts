import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Agenda:API`
  .page(url(__dirname, '../../container.html'));

test('Html elements should be absent in Agenda view', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.element.find('.dx-scheduler-all-day-panel').exists)
    .notOk();

  await t
    .expect(scheduler.element.find('.dx-scheduler-sidebar-scrollable').exists)
    .notOk();

  await t
    .expect(scheduler.workSpace.hasClass('dx-scheduler-work-space-both-scrollbar'))
    .notOk();

  await t
    .expect(scheduler.element.find('.dx-scheduler-date-table-cell').nth(0).textContent)
    .eql('');
  await t
    .expect(scheduler.element.find('.dx-scheduler-date-table-cell').nth(1).textContent)
    .eql('');

  await t
    .expect(scheduler.element.find('.dx-scheduler-fixed-appointments').exists)
    .notOk();

  await t
    .expect(scheduler.element.find('.dx-scheduler-header-panel').exists)
    .notOk();

  await t
    .expect(scheduler.workSpace.getAttribute('tabindex'))
    .notOk();
}).before(async () => {
  const data = [{
    text: 'Website Re-Design Plan',
    ownerId: [4, 1, 2],
    roomId: [1, 2, 3],
    priorityId: 2,
    startDate: new Date('2021-05-24T16:30:00.000Z'),
    endDate: new Date('2021-05-24T18:30:00.000Z'),
    recurrenceRule: 'FREQ=WEEKLY',
    allDay: true,
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    ownerId: 2,
    roomId: 2,
    priorityId: 1,
    startDate: new Date('2021-05-24T19:00:00.000Z'),
    endDate: new Date('2021-05-24T20:00:00.000Z'),
    allDay: true,
  }, {
    text: 'Final Budget Review',
    ownerId: 1,
    roomId: 1,
    priorityId: 1,
    startDate: new Date('2021-05-25T19:00:00.000Z'),
    endDate: new Date('2021-05-25T20:35:00.000Z'),
  }, {
    text: 'New Brochures',
    ownerId: 4,
    roomId: 3,
    priorityId: 2,
    startDate: new Date('2021-05-25T21:30:00.000Z'),
    endDate: new Date('2021-05-25T22:45:00.000Z'),
  }, {
    text: 'Install New Database',
    ownerId: 2,
    roomId: 3,
    priorityId: 1,
    startDate: new Date('2021-05-26T16:45:00.000Z'),
    endDate: new Date('2021-05-26T18:15:00.000Z'),
  }, {
    text: 'Approve New Online Marketing Strategy',
    ownerId: 4,
    roomId: 2,
    priorityId: 1,
    startDate: new Date('2021-05-26T19:00:00.000Z'),
    endDate: new Date('2021-05-26T21:00:00.000Z'),
  }, {
    text: 'Upgrade Personal Computers',
    ownerId: 2,
    roomId: 2,
    priorityId: 2,
    startDate: new Date('2021-05-26T22:15:00.000Z'),
    endDate: new Date('2021-05-26T23:30:00.000Z'),
  }];

  await createWidget('dxScheduler', {
    dataSource: data,
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 4, 25),
    showAllDayPanel: true,
    crossScrollingEnabled: true,
    focusStateEnabled: true,
    height: 600,
  });
});
