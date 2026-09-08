import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

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
    test(`Long appointment should display valid on month view(rtl='${rtlEnabled}', text='${appointment.text}')`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [appointment],
        views: ['month'],
        currentView: 'month',
        rtlEnabled,
        currentDate: new Date(2020, 0, 1),
      });

      const scheduler = new Scheduler(page, '#container');

      await testScreenshot(
        page,
        `month-long-appointment(rtl=${rtlEnabled}, text=${appointment.text}).png`,
        { element: scheduler.workSpace },
      );
    });
  });
});

[false, true].forEach((rtlEnabled) => {
  test(`Long appointment(several months) should display valid on month view(rtl='${rtlEnabled})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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

    const { toolbar, workSpace } = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `month-long-appointment-several-months-january(rtl=${rtlEnabled}).png`,
      { element: workSpace },
    );

    await toolbar.navigator.nextButton.click();

    await testScreenshot(
      page,
      `month-long-appointment-several-months-february(rtl=${rtlEnabled}).png`,
      { element: workSpace },
    );

    await toolbar.navigator.nextButton.click();

    await testScreenshot(
      page,
      `month-long-appointment-several-months-march(rtl=${rtlEnabled}).png`,
      { element: workSpace },
    );
  });
});

test('Long recurrence appointment should display valid on month view', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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

  const { toolbar, workSpace } = new Scheduler(page, '#container');

  await testScreenshot(
    page,
    'month-long-recurrence-appointment-several-months-january.png',
    { element: workSpace },
  );

  await toolbar.navigator.nextButton.click();

  await testScreenshot(
    page,
    'month-long-recurrence-appointment-several-months-february.png',
    { element: workSpace },
  );
});
