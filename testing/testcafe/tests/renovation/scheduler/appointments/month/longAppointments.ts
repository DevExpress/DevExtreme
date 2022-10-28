import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.skip('Scheduler: long appointments in month view');

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
    test(`Long appointment should display valid on month view(rtl='${rtlEnabled}', text='${appointment.text}')`, async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`month-long-appointment(rtl=${rtlEnabled}, text=${appointment.text}).png`, scheduler.workSpace, screenshotComparerOptions))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    })
      .before(async (t, { platform }) => {
        await t.resizeWindow(1200, 800);

        return createWidget(platform, 'dxScheduler', {
          dataSource: [appointment],
          views: ['month'],
          currentView: 'month',
          rtlEnabled,
          currentDate: new Date(2020, 0, 1),
        });
      });
  });
});

[false, true].forEach((rtlEnabled) => {
  test(`Long appointment(several months) should display valid on month view(rtl='${rtlEnabled})`, async (t, { screenshotComparerOptions }) => {
    const { toolbar, workSpace } = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`month-long-appointment-several-months-january(rtl=${rtlEnabled}).png`, workSpace, screenshotComparerOptions)).ok();

    await t
      .click(toolbar.navigator.nextButton)
      .expect(await takeScreenshot(`month-long-appointment-several-months-february(rtl=${rtlEnabled}).png`, workSpace, screenshotComparerOptions)).ok();

    await t
      .click(toolbar.navigator.nextButton)
      .expect(await takeScreenshot(`month-long-appointment-several-months-march(rtl=${rtlEnabled}).png`, workSpace, screenshotComparerOptions)).ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t, { platform }) => {
    await t.resizeWindow(1200, 800);

    return createWidget(platform, 'dxScheduler', {
      dataSource: [{
        text: 'Text',
        startDate: new Date(2020, 0, 6),
        endDate: new Date(2020, 2, 10),
      }],
      views: ['month'],
      currentView: 'month',
      rtlEnabled,
      currentDate: new Date(2020, 0, 1),
    });
  });
});

test('Long recurrence appointment should display valid on month view', async (t, { screenshotComparerOptions }) => {
  const { toolbar, workSpace } = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('month-long-recurrence-appointment-several-months-january.png', workSpace, screenshotComparerOptions)).ok();

  await t
    .click(toolbar.navigator.nextButton)
    .expect(await takeScreenshot('month-long-recurrence-appointment-several-months-february.png', workSpace, screenshotComparerOptions)).ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t, { platform }) => {
  await t.resizeWindow(1200, 800);

  return createWidget(platform, 'dxScheduler', {
    dataSource: [{
      text: 'Text',
      startDate: new Date(2020, 0, 6),
      endDate: new Date(2020, 0, 10),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=5',
    }],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 0, 1),
  });
});
