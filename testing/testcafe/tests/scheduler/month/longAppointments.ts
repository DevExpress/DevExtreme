import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Scheduler: long appointments in month view`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  [
    {
      text: 'Appointment spans 3 rows',
      startDate: new Date(2020, 0, 6),
      endDate: new Date(2020, 0, 24),
    }, {
      text: 'Appointment spans all rows',
      startDate: new Date(2019, 11, 29),
      endDate: new Date(2020, 1, 8, 15),
    }, {
      text: 'Appointment spans 2 rows',
      startDate: new Date(2020, 0, 17),
      endDate: new Date(2020, 0, 20),
    },
  ].forEach((appointment) => {
    test(`Long appointment should display valid on month view(rtl='${rtlEnabled}', text='${appointment.text}')`, async (t) => {
      const scheduler = new Scheduler('#container');
      await t.expect(await compareScreenshot(t, `month-long-appointment(rtl=${rtlEnabled}, text=${appointment.text}).png`, scheduler.workSpace)).ok();
    }).before(async () => createWidget('dxScheduler', {
      dataSource: [appointment],
      views: ['month'],
      currentView: 'month',
      rtlEnabled,
      currentDate: new Date(2020, 0, 1),
    }));
  });
});

[false, true].forEach((rtlEnabled) => {
  test(`Long appointment(several months) should display valid on month view(rtl='${rtlEnabled})`, async (t) => {
    const scheduler = new Scheduler('#container');

    await t
      .expect(await compareScreenshot(t, `month-long-appointment-several-months-january(rtl=${rtlEnabled}).png`, scheduler.workSpace)).ok();

    await t
      .click(scheduler.getNavigator().nextDuration)
      .expect(await compareScreenshot(t, `month-long-appointment-several-months-february(rtl=${rtlEnabled}).png`, scheduler.workSpace)).ok();

    await t
      .click(scheduler.getNavigator().nextDuration)
      .expect(await compareScreenshot(t, `month-long-appointment-several-months-march(rtl=${rtlEnabled}).png`, scheduler.workSpace)).ok();
  }).before(async () => createWidget('dxScheduler', {
    dataSource: [{
      text: 'Text',
      startDate: new Date(2020, 0, 6),
      endDate: new Date(2020, 2, 10),
    }],
    views: ['month'],
    currentView: 'month',
    rtlEnabled,
    currentDate: new Date(2020, 0, 1),
  }));
});

test('Long recurrence appointment should display valid on month view', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(await compareScreenshot(t, 'month-long-recurrence-appointment-several-months-january.png', scheduler.workSpace)).ok();

  await t
    .click(scheduler.getNavigator().nextDuration)
    .expect(await compareScreenshot(t, 'month-long-recurrence-appointment-several-months-february.png', scheduler.workSpace)).ok();
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Text',
    startDate: new Date(2020, 0, 6),
    endDate: new Date(2020, 0, 10),
    recurrenceRule: 'FREQ=DAILY;INTERVAL=5',
  }],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2020, 0, 1),
}));
