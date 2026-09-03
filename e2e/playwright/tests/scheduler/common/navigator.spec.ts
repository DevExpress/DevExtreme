import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Scheduler from '../../../models/scheduler';

const DISABLED_CLASS = 'dx-state-disabled';

const createScheduler = async (page: Page, options = {}): Promise<void> => createWidget(page, 'dxScheduler', {
  dataSource: [],
  currentDate: new Date(2017, 4, 18),
  firstDayOfWeek: 1,
  height: 600,
  views: ['week', 'month'],
  ...options,
});

[
  {
    boundary: 'max' as const,
    view: 'week',
    options: { max: new Date(2017, 4, 24), currentView: 'week' },
  },
  {
    boundary: 'min' as const,
    view: 'week',
    options: { min: new Date(2017, 4, 13), currentView: 'week' },
  },
  {
    boundary: 'max' as const,
    view: 'month',
    options: { max: new Date(2017, 5, 15), currentView: 'month' },
  },
  {
    boundary: 'min' as const,
    view: 'month',
    options: { min: new Date(2017, 3, 28), currentView: 'month' },
  },
].forEach(({ boundary, view, options }) => {
  test(`Navigator can change ${view} when current date interval is more than diff between current date and \`${boundary}\` (T830754)`, async ({ page }) => {
    await createScheduler(page, options);

    const { toolbar } = new Scheduler(page, '#container');
    const button = boundary === 'max'
      ? toolbar.navigator.nextButton
      : toolbar.navigator.prevButton;

    // The navigation must be enabled by default and turn disabled one step from the boundary.
    await expect(button).not.toHaveClass(new RegExp(DISABLED_CLASS));

    await button.click();

    await expect(button).toHaveClass(new RegExp(DISABLED_CLASS));
  });
});
