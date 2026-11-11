import { expect, test } from '../../../../fixtures';
import Button from '../../../../models/button';
import { textMatcher } from '../../../../models/internal/textMatcher';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

test.describe('Hotkeys for appointments update and navigation', () => {
  ['week', 'month'].forEach((view) => {
    test(`Navigate between appointments in the "${view}" view (Tab/Shift+Tab)`, async ({ page }) => {
      await createScheduler(page, {
        views: [view],
        currentView: view,
        dataSource,
      });

      const scheduler = new Scheduler(page, '#container');
      const firstAppointment = scheduler.getAppointment('Website Re-Design Plan');
      const secondAppointment = scheduler.getAppointment('Book Flights to San Fran for Sales Trip');

      await firstAppointment.element.click();
      await firstAppointment.expectState('focused');

      await page.keyboard.press('Tab');
      await firstAppointment.expectState('focused', false);
      await secondAppointment.expectState('focused');

      await page.keyboard.press('Shift+Tab');
      await secondAppointment.expectState('focused', false);
      await firstAppointment.expectState('focused');
    });

    test(`Remove appointment in the "${view}" view (Del)`, async ({ page }) => {
      await createScheduler(page, {
        views: [view],
        currentView: view,
        dataSource,
      });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Website Re-Design Plan');

      await appointment.element.click();
      await appointment.expectState('focused');

      await page.keyboard.press('Delete');
      await expect(appointment.element).toHaveCount(0);
    });

    test(`Show appointment popup in the "${view}" view (Enter)`, async ({ page }) => {
      await createScheduler(page, {
        views: [view],
        currentView: view,
        dataSource,
      });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Website Re-Design Plan');
      const { appointmentPopup } = scheduler;

      await appointment.element.click();
      await appointment.expectState('focused');

      await page.keyboard.press('Enter');
      await expect.poll(() => appointmentPopup.popup.isVisible()).toBe(true);
    });

    test(`Navigate between tooltip appointments in the "${view}" view (Up/Down)`, async ({ page }) => {
      await createScheduler(page, {
        views: [view],
        currentView: view,
        dataSource,
      });

      const scheduler = new Scheduler(page, '#container');
      const collector = scheduler.collectors.find('3');
      const { appointmentPopup, appointmentTooltip } = scheduler;

      await collector.click();

      await appointmentTooltip.expectVisible();

      await page.keyboard.press('ArrowDown');
      await appointmentTooltip.getListItem('New Brochures').expectFocused();

      await page.keyboard.press('ArrowUp');
      await appointmentTooltip.getListItem('Approve New Online Marketing Strategy').expectFocused();

      await page.keyboard.press('Enter');
      await appointmentTooltip.expectVisible(false);
      await expect.poll(() => appointmentPopup.popup.isVisible()).toBe(true);
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

    const prevDuration = new Button(page, navigator.prevButton);
    const caption = new Button(page, navigator.caption);
    const nextDuration = new Button(page, navigator.nextButton);

    await toolbar.element.click();
    await page.keyboard.press('Tab');
    await prevDuration.expectFocused();

    await page.keyboard.press('ArrowRight');
    await nextDuration.expectFocused();

    await page.keyboard.press('ArrowRight');
    await caption.expectFocused();

    await page.keyboard.press('Tab');
    await viewSwitcher.getButton('Day').expectFocused();

    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await viewSwitcher.getButton('Week').expectFocused();
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

    const prevDuration = new Button(page, navigator.prevButton);
    const caption = new Button(page, navigator.caption);
    const nextDuration = new Button(page, navigator.nextButton);
    const todayButton = new Button(
      page,
      toolbar.element.locator('.dx-button').filter({ hasText: textMatcher('Today') }),
    );

    await toolbar.element.click();
    await page.keyboard.press('Tab');
    await viewSwitcher.getButton('Day').expectFocused();

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await viewSwitcher.getButton('Week').expectFocused();

    await page.keyboard.press('Tab');
    await todayButton.expectFocused();

    await page.keyboard.press('Tab');
    await prevDuration.expectFocused();

    await page.keyboard.press('ArrowRight');
    await nextDuration.expectFocused();

    await page.keyboard.press('ArrowRight');
    await caption.expectFocused();
  });
});
