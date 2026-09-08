import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { getThemeName } from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';

test('cellDuration (T1076138)', { tag: ['@generic.light'] }, async ({ page }) => {
  // The TestCafe test named a theme to run in, and the runner dropped it everywhere else: the
  // expected height is the one the generic theme lays out.
  test.skip(getThemeName() !== 'generic', 'the expected height is the generic one');

  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'test-appt',
      startDate: new Date(2021, 3, 27, 10),
      endDate: new Date(2021, 3, 27, 11, 20),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 18,
    width: 600,
    height: 600,
    cellDuration: 20,
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('test-appt');

  await scheduler.option('cellDuration', 30);

  await expect(appointment.element).toBeVisible();

  const height = await appointment.element.evaluate((element) => element.clientHeight);

  expect(height).toBeGreaterThanOrEqual(132);
  expect(height).toBeLessThanOrEqual(133);
});
