import { expect, test } from '../../fixtures';
import { createWidget } from '../../helpers/createWidget';
import Scheduler from '../../models/scheduler';

// Keeps the ported page object honest while the Scheduler tests themselves are still on TestCafe.
test('Scheduler page object reaches the toolbar, the work space and the appointments', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Website Re-Design Plan',
      startDate: new Date(2021, 3, 26, 9, 30),
      endDate: new Date(2021, 3, 26, 11, 30),
    }],
    views: ['day', 'week'],
    currentView: 'week',
    currentDate: new Date(2021, 3, 26),
    toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  expect(await scheduler.checkViewType('week')).toBe(true);
  expect(await scheduler.checkViewType('day')).toBe(false);

  await expect(scheduler.toolbar.element).toBeVisible();
  await expect(scheduler.toolbar.navigator.element).toBeVisible();
  await expect(scheduler.toolbar.todayButton).toHaveCount(1);
  expect(await scheduler.toolbar.isInvisible()).toBe(false);

  await expect(scheduler.toolbar.viewSwitcher.getButton('Week').element).toHaveCount(1);

  expect(await scheduler.getAppointmentCount()).toBe(1);

  const appointment = scheduler.getAppointment('Website Re-Design Plan');

  await expect(appointment.element).toBeVisible();
  await expect(appointment.title).toHaveText('Website Re-Design Plan');
  expect(await appointment.isAllDay()).toBe(false);
  expect((await appointment.getSize()).height).not.toBe('0px');

  await expect(scheduler.headerPanel.headerCells).toHaveCount(7);
  await expect(scheduler.getDateTableCell(0, 0)).toBeVisible();

  expect(await scheduler.appointmentTooltip.exists()).toBe(false);

  await appointment.element.click();

  await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();
  await expect(scheduler.appointmentTooltip.getListItem().subject)
    .toHaveText('Website Re-Design Plan');

  await scheduler.hideAppointmentTooltip();

  const scrollBefore = (await scheduler.getWorkSpaceScroll()).top;

  await scheduler.scrollTo(new Date(2021, 3, 26, 20, 0));

  expect((await scheduler.getWorkSpaceScroll()).top).not.toBe(scrollBefore);
});
