import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const hasWarningCode = (message: string) => message.startsWith('W1023');

test.describe('Agenda:KeyField', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['week', 'agenda'].forEach((currentView) => {
    test(`Warning should be thrown in console in case currentView='${currentView}'(T1100758)`, async ({ page }) => {
      const consoleMessages: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          consoleMessages.push(msg.text());
        }
      });

      await createWidget(page, 'dxScheduler', {
        dataSource: [],
        views: ['week', 'agenda'],
        currentView,
        currentDate: new Date(2021, 2, 28),
        height: 600,
      });

      const isWarningExist = consoleMessages.some(hasWarningCode);
      expect(isWarningExist).toBeTruthy();
    });
  });

  test('Wrong behavior: editing recurrence appointment does not affect to appointment data source(T1100758)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Test',
        startDate: new Date('2021-03-29T16:30:00.000Z'),
        endDate: new Date('2021-03-29T18:30:00.000Z'),
        recurrenceRule: 'FREQ=WEEKLY',
      }],
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 2, 28),
      recurrenceEditMode: 'series',
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' });
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const subjectInput = popup.locator('.dx-texteditor-input').first();
    await subjectInput.fill('Updated');

    const doneButton = popup.locator('.dx-popup-done.dx-button');
    await doneButton.click();

    const updatedAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Updated' });
    await expect(updatedAppointment.first()).toBeVisible();
  });
});
