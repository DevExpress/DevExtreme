import { expect, test } from '../../../../fixtures';
import FocusableElement from '../../../../models/internal/focusable';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

['week', 'month'].forEach((view) => {
  test(`Navigate between appointments in the "${view}" view (Tab/Shift+Tab)`, async ({ page }) => {
    await createScheduler(page, { views: [view], currentView: view, dataSource });

    const scheduler = new Scheduler(page, '#container');
    const firstAppointment = scheduler.getAppointment('Website Re-Design Plan');
    const secondAppointment = scheduler.getAppointment('Book Flights to San Fran for Sales Trip');

    await firstAppointment.element.click();

    expect(await firstAppointment.isFocused()).toBe(true);

    await page.keyboard.press('Tab');

    expect(await firstAppointment.isFocused()).toBe(false);
    expect(await secondAppointment.isFocused()).toBe(true);

    await page.keyboard.press('Shift+Tab');

    expect(await secondAppointment.isFocused()).toBe(false);
    expect(await firstAppointment.isFocused()).toBe(true);
  });

  test(`Remove appointment in the "${view}" view (Del)`, async ({ page }) => {
    await createScheduler(page, { views: [view], currentView: view, dataSource });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Website Re-Design Plan');

    await appointment.element.click();

    expect(await appointment.isFocused()).toBe(true);

    await page.keyboard.press('Delete');

    await expect(appointment.element).toHaveCount(0);
  });

  test(`Show appointment popup in the "${view}" view (Enter)`, async ({ page }) => {
    await createScheduler(page, { views: [view], currentView: view, dataSource });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Website Re-Design Plan');
    const { appointmentPopup } = scheduler;

    await appointment.element.click();

    expect(await appointment.isFocused()).toBe(true);

    await page.keyboard.press('Enter');

    await expect(appointmentPopup.contentElement).toBeVisible();
  });

  test(`Navigate between tooltip appointments in the "${view}" view (Up/Down)`, async ({ page }) => {
    await createScheduler(page, { views: [view], currentView: view, dataSource });

    const scheduler = new Scheduler(page, '#container');
    const collector = scheduler.collectors.find('3');
    const { appointmentPopup, appointmentTooltip } = scheduler;

    await collector.element.click();

    await expect(appointmentTooltip.wrapper).toBeVisible();

    await page.keyboard.press('ArrowDown');

    expect(await appointmentTooltip.getListItem('New Brochures').isFocused()).toBe(true);

    await page.keyboard.press('ArrowUp');

    expect(await appointmentTooltip
      .getListItem('Approve New Online Marketing Strategy')
      .isFocused()).toBe(true);

    await page.keyboard.press('Enter');

    await expect(appointmentTooltip.wrapper).toBeHidden();
    await expect(appointmentPopup.contentElement).toBeVisible();
  });
});

test('Navigate between toolbar items', async ({ page }) => {
  await createScheduler(page, {
    views: ['day', 'week'],
    currentView: 'day',
    toolbar: {
      allowKeyboardNavigation: false,
    },
  });

  const { toolbar } = new Scheduler(page, '#container');
  const { navigator, viewSwitcher } = toolbar;

  const prevDuration = new FocusableElement(navigator.prevButton);
  const caption = new FocusableElement(navigator.caption);
  const nextDuration = new FocusableElement(navigator.nextButton);

  await toolbar.element.click();
  await page.keyboard.press('Tab');

  expect(await prevDuration.hasFocusedState()).toBe(true);

  await page.keyboard.press('ArrowRight');

  expect(await nextDuration.hasFocusedState()).toBe(true);

  await page.keyboard.press('ArrowRight');

  expect(await caption.hasFocusedState()).toBe(true);

  await page.keyboard.press('Tab');

  expect(await viewSwitcher.getButton('Day').hasFocusedState()).toBe(true);

  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  expect(await viewSwitcher.getButton('Week').hasFocusedState()).toBe(true);
});

test('Navigate between custom toolbar items', async ({ page }) => {
  await createScheduler(page, {
    views: ['day', 'week'],
    currentView: 'day',
    toolbar: {
      items: [
        {
          location: 'before',
          name: 'viewSwitcher',
        },
        {
          location: 'before',
          widget: 'dxButton',
          options: {
            text: 'Today',
          },
        },
        {
          location: 'after',
          name: 'dateNavigator',
        },
      ],
      allowKeyboardNavigation: false,
    },
  });

  const { toolbar } = new Scheduler(page, '#container');
  const { navigator, viewSwitcher } = toolbar;

  const prevDuration = new FocusableElement(navigator.prevButton);
  const caption = new FocusableElement(navigator.caption);
  const nextDuration = new FocusableElement(navigator.nextButton);
  const todayButton = new FocusableElement(
    toolbar.element.locator('.dx-button').filter({ hasText: 'Today' }),
  );

  await toolbar.element.click();
  await page.keyboard.press('Tab');

  expect(await viewSwitcher.getButton('Day').hasFocusedState()).toBe(true);

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  expect(await viewSwitcher.getButton('Week').hasFocusedState()).toBe(true);

  await page.keyboard.press('Tab');

  expect(await todayButton.hasFocusedState()).toBe(true);

  await page.keyboard.press('Tab');

  expect(await prevDuration.hasFocusedState()).toBe(true);

  await page.keyboard.press('ArrowRight');

  expect(await nextDuration.hasFocusedState()).toBe(true);

  await page.keyboard.press('ArrowRight');

  expect(await caption.hasFocusedState()).toBe(true);
});
