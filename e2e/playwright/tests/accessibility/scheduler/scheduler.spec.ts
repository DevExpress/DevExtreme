import { expect, test } from '../../../helpers/accessibility/test';
import Scheduler from '../../../models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheckConfig, a11yContext } from './axe_options';

test('Scheduler should have right aria attributes after view changed', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.element).toHaveAttribute('aria-label', /Scheduler\. Month view/);
  await expect(scheduler.getGeneralStatusContainer().first()).toContainText('Scheduler. Month view');

  await expect(scheduler.element).toHaveAttribute('role', 'application');

  await scheduler.option('currentView', 'week');

  await expect(scheduler.element).toHaveAttribute('aria-label', /Scheduler\. Week view/);
  await expect(scheduler.getGeneralStatusContainer().first()).toContainText('Scheduler. Week view');

  await a11yCheck(page, a11yCheckConfig, a11yContext);
});

test('Scheduler table elements have right aria attributes', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });

  const scheduler = new Scheduler(page, '#container');

  const tables = scheduler.element.locator('table');
  await expect(tables).toHaveCount(4);

  for (let i = 0; i < await tables.count(); i += 1) {
    await expect(tables.nth(i)).toHaveAttribute('aria-hidden', 'true');
  }

  await a11yCheck(page, a11yCheckConfig, a11yContext);
});

[
  'agenda', 'day', 'month', 'timelineDay', 'timelineMonth', 'timelineWeek', 'timelineWorkWeek', 'week', 'workWeek',
].forEach((currentView) => {
  test(`Scheduler has no axe errors on view ${currentView}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
        },
      ],
      currentView,
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
    });

    await a11yCheck(page, a11yCheckConfig, a11yContext);
  });
});
