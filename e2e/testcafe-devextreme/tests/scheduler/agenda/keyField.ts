import { ClientFunction } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

// TODO fixture.disablePageReloads lead to fail random test in current file
fixture`Agenda:KeyField`
  .page(url(__dirname, '../../container.html'));

const hasWarningCode = (message) => message.startsWith('W1023');

['week', 'agenda'].forEach((currentView) => {
  test(`Warning should be thrown in console in case currentView='${currentView}'(T1100758)`, async (t) => {
    const messages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!messages.warn.find(hasWarningCode);
    await t.expect(isWarningExist).ok();
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [],
      views: ['week', 'agenda'],
      currentView,
      currentDate: new Date(2021, 2, 28),
      height: 600,
    });
  });
});

test('Warning should be thrown in console after set new views(T1100758)', async (t) => {
  const messages = await t.getBrowserConsoleMessages();
  const isWarningExist = !!messages.warn.find(hasWarningCode);
  await t.expect(isWarningExist).notOk();

  const scheduler = new Scheduler('#container');
  await scheduler.option('views', ['week', 'agenda']);

  const messagesAfterChangeViews = await t.getBrowserConsoleMessages();
  const isWarningExistAfterChangeViews = !!messagesAfterChangeViews.warn.find(hasWarningCode);
  await t.expect(isWarningExistAfterChangeViews).ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    height: 600,
  });
});

// TODO
// The matrix test to split, so it was not possible to achieve a working state matrix test

test('Warning shouldn\'t be thrown in console in case currentView=\'week\' if keyField exists(T1100758)', async (t) => {
  const messages = await t.getBrowserConsoleMessages();

  const isWarningExist = !!messages.warn.find(hasWarningCode);
  await t.expect(isWarningExist).notOk();
}).before(async () => {
  await createWidget('dxScheduler', () => {
    const store = new (window as any).DevExpress.data.CustomStore({
      key: 'id',
      load: () => [],
    });

    return {
      dataSource: store,
      views: ['week', 'agenda'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      height: 600,
    };
  });
});

test('Warning shouldn\'t be thrown in console in case currentView=\'agenda\' if keyField exists(T1100758)', async (t) => {
  const messages = await t.getBrowserConsoleMessages();

  const isWarningExist = !!messages.warn.find(hasWarningCode);
  await t.expect(isWarningExist).notOk();
}).before(async () => {
  await createWidget('dxScheduler', () => {
    const store = new (window as any).DevExpress.data.CustomStore({
      key: 'id',
      load: () => [],
    });

    return {
      dataSource: store,
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 2, 28),
      height: 600,
    };
  });
});

//

['week', 'agenda'].forEach((currentView) => {
  test(`Warning should be thrown in console in case currentView='${currentView}' if keyField not set in Store(T1100758)`, async (t) => {
    const messages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!messages.warn.find(hasWarningCode);
    await t.expect(isWarningExist).ok();
  }).before(async () => {
    await createWidget('dxScheduler', ClientFunction(() => ({
      dataSource: new (window as any).DevExpress.data.CustomStore({
        load: () => [],
      }),
      views: ['week', 'agenda'],
      currentView,
      currentDate: new Date(2021, 2, 28),
      height: 600,
    }), { dependencies: { currentView } }));
  });
});

// TODO: In this test fixed incorrect behavior, after fixing it, test should be fall.
// TODO: More details in T1100758 ticket
test('Wrong behavior: editing recurrence appointment does not affect to appointment\'s data source(T1100758)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointment('Test').element);
  await t
    .typeText(scheduler.appointmentPopup.subjectElement, 'Updated', { replace: true })
    .click(scheduler.appointmentPopup.doneButton);

  await t.expect(scheduler.getAppointment('Updated').element.exists).notOk();
  // TODO: In correct behavior, expected assert is ok()
  // TODO: await t.expect(scheduler.getAppointment('Updated').element.exists).ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'Test',
      startDate: new Date('2021-03-29T16:30:00.000Z'),
      endDate: new Date('2021-03-29T18:30:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY',
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 2, 28),
    recurrenceEditMode: 'series',
    height: 600,
  }, '#container', { disableFxAnimation: true });
});
