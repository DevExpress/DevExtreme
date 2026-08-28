import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

test('Long all day appointment should be render, if him ended on next view day in currentView: \'day\'(T1021963)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      allDay: true,
      startDate: new Date(2021, 2, 28),
      endDate: new Date(2021, 2, 29),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 28),
    startDayHour: 9,
    width: 400,
    height: 600,
  });

  const { workSpace, toolbar } = new Scheduler(page, '#container');

  await toolbar.navigator.prevButton.click();

  await testScreenshot(page, '27-march-day-view.png', { element: workSpace });

  await toolbar.navigator.nextButton.click();

  await testScreenshot(page, '28-march-day-view.png', { element: workSpace });

  await toolbar.navigator.nextButton.click();

  await testScreenshot(page, '29-march-day-view.png', { element: workSpace });

  await toolbar.navigator.nextButton.click();

  await testScreenshot(page, '30-march-day-view.png', { element: workSpace });
});

test('Long all day appointment should be render, if him ended on next view day in currentView:', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      allDay: true,
      startDate: new Date(2021, 2, 27),
      endDate: new Date(2021, 3, 4),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    startDayHour: 9,
    width: 600,
    height: 600,
  });

  const { workSpace, toolbar } = new Scheduler(page, '#container');

  await toolbar.navigator.prevButton.click();

  await testScreenshot(page, '21-27-march-week-view.png', { element: workSpace });

  await toolbar.navigator.nextButton.click();

  await testScreenshot(page, '28-march-3-apr-week-view.png', { element: workSpace });

  await toolbar.navigator.nextButton.click();

  await testScreenshot(page, '4-10-apr-week-view.png', { element: workSpace });
});
