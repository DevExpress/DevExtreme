import Scheduler from 'devextreme-testcafe-models/scheduler';
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getDocumentScrollTop } from '../../../../helpers/domUtils';

fixture.disablePageReloads`KeyboardNavigation.DocumentScrollPrevented`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

test('Document should not scroll on \'End\' press when appointment is focused', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t.click(scheduler.getAppointment('Appointment 1').element);

  const expectedScrollTop = await getDocumentScrollTop();

  await t
    .pressKey('End')
    .expect(getDocumentScrollTop()).eql(expectedScrollTop);
}).before(async () => {
  await ClientFunction(() => {
    document.body.style.height = '2000px';
  })();

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
  await ClientFunction(() => {
    document.body.style.height = '';
  })();
});

test('Document should not scroll on \'Home\' press when appointment is focused', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t
    .scroll(0, 100)
    .click(scheduler.getAppointment('Appointment 1').element);

  const expectedScrollTop = await getDocumentScrollTop();

  await t
    .pressKey('Home')
    .expect(getDocumentScrollTop()).eql(expectedScrollTop);
}).before(async () => {
  await ClientFunction(() => {
    document.body.style.height = '2000px';
  })();

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
  await ClientFunction(() => {
    document.body.style.height = '';
  })();
});
