import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Agenda:KeyField`
  .page(url(__dirname, '../../container.html'));

['week', 'agenda'].forEach((currentView) => {
  test(`Waring should be throw in console in case currentView='${currentView}'`, async (t) => {
    const consoleMessages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!consoleMessages.warn.find((message) => message.startsWith('W1023'));
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

  test(`Waring shouldn't be throw in console in case currentView='${currentView}' if keyField exists`, async (t) => {
    const consoleMessages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!consoleMessages.warn.find((message) => message.startsWith('W1023'));
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
        currentView,
        currentDate: new Date(2021, 2, 28),
        height: 600,
      };
    });
  });

  test(`Waring should be throw in console in case currentView='${currentView}' if keyField not set in Store`, async (t) => {
    const consoleMessages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!consoleMessages.warn.find((message) => message.startsWith('W1023'));
    await t.expect(isWarningExist).ok();
  }).before(async () => {
    await createWidget('dxScheduler', () => {
      const store = new (window as any).DevExpress.data.CustomStore({
        load: () => [],
      });

      return {
        dataSource: store,
        views: ['week', 'agenda'],
        currentView,
        currentDate: new Date(2021, 2, 28),
        height: 600,
      };
    });
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
