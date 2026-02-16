import Scheduler from 'devextreme-testcafe-models/scheduler';
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`KeyboardNavigation.Appointments`
  .page(url(__dirname, '../../../container.html'));

const PARENT_SELECTOR = '#parentContainer';
const SCHEDULER_SELECTOR = '#container';

test('Document should not scroll on \'End\' press when appointment is focused', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t
    .click(scheduler.getAppointment('Appointment 1').element)
    .pressKey('End');

  const scrollTop = await ClientFunction(() => document.documentElement.scrollTop)();

  await t.expect(scrollTop).eql(0);
}).before(async () => {
  ClientFunction((selector) => {
    const parent = document.querySelector(selector) as HTMLElement;
    parent.style.height = '2000px';
  })(PARENT_SELECTOR);

  await createWidget('dxScheduler', {
    dataSource: [
      {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      },
      {
        text: 'Appointment 2',
        startDate: new Date(2015, 1, 9, 10),
        endDate: new Date(2015, 1, 9, 11),
      },
      {
        text: 'Appointment 3',
        startDate: new Date(2015, 1, 9, 12),
        endDate: new Date(2015, 1, 9, 13),
      },
    ],
    height: 300,
    currentView: 'day',
    currentDate: new Date(2015, 1, 9),
  });
}).after(async () => {
  ClientFunction((selector) => {
    const parent = document.querySelector(selector) as HTMLElement;
    parent.style.height = '';
  })(PARENT_SELECTOR);
});

test('Document should not scroll on \'Home\' press when appointment is focused', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const initialScrollTop = 100;

  await t
    .scroll(0, initialScrollTop)
    .click(scheduler.getAppointment('Appointment 1').element)
    .pressKey('Home');

  const scrollTop = await ClientFunction(() => document.documentElement.scrollTop)();

  await t.expect(scrollTop).eql(initialScrollTop);
}).before(async () => {
  ClientFunction((selector) => {
    const parent = document.querySelector(selector) as HTMLElement;
    parent.style.height = '2000px';
  })(PARENT_SELECTOR);

  await createWidget('dxScheduler', {
    dataSource: [
      {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      },
      {
        text: 'Appointment 2',
        startDate: new Date(2015, 1, 9, 10),
        endDate: new Date(2015, 1, 9, 11),
      },
      {
        text: 'Appointment 3',
        startDate: new Date(2015, 1, 9, 12),
        endDate: new Date(2015, 1, 9, 13),
      },
    ],
    height: 300,
    currentView: 'day',
    currentDate: new Date(2015, 1, 9),
  });
}).after(async () => {
  ClientFunction((selector) => {
    const parent = document.querySelector(selector) as HTMLElement;
    parent.style.height = '';
  })(PARENT_SELECTOR);
});
