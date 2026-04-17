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

  test('Warning should be thrown in console after set new views(T1100758)', async ({ page }) => {
    const warnMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') {
        warnMessages.push(msg.text());
      }
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      height: 600,
    });

    const isWarningBeforeChange = warnMessages.some(hasWarningCode);
    expect(isWarningBeforeChange).toBeFalsy();

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').option('views', ['week', 'agenda']);
    });

    const isWarningAfterChange = warnMessages.some(hasWarningCode);
    expect(isWarningAfterChange).toBeTruthy();
  });

  ["Warning shouldn't be thrown in console in case currentView='week' if keyField exists(T1100758)", "Warning shouldn't be thrown in console in case currentView='agenda' if keyField exists(T1100758)"].forEach((testName) => {
    const currentView = testName.includes("'week'") ? 'week' : 'agenda';
    test(testName, async ({ page }) => {
      const warnMessages: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          warnMessages.push(msg.text());
        }
      });

      await page.evaluate((view) => {
        const store = new (window as any).DevExpress.data.CustomStore({
          key: 'id',
          load: () => [],
        });
        ($('#container') as any).dxScheduler({
          dataSource: store,
          views: ['week', 'agenda'],
          currentView: view,
          currentDate: new Date(2021, 2, 28),
          height: 600,
        });
      }, currentView);

      await page.waitForTimeout(300);
      const isWarningExist = warnMessages.some(hasWarningCode);
      expect(isWarningExist).toBeFalsy();
    });
  });

  ['week', 'agenda'].forEach((currentView) => {
    test(`Warning should be thrown in console in case currentView='${currentView}' if keyField not set in Store(T1100758)`, async ({ page }) => {
      const warnMessages: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          warnMessages.push(msg.text());
        }
      });

      await page.evaluate((view) => {
        const store = new (window as any).DevExpress.data.CustomStore({
          load: () => [],
        });
        ($('#container') as any).dxScheduler({
          dataSource: store,
          views: ['week', 'agenda'],
          currentView: view,
          currentDate: new Date(2021, 2, 28),
          height: 600,
        });
      }, currentView);

      await page.waitForTimeout(300);
      const isWarningExist = warnMessages.some(hasWarningCode);
      expect(isWarningExist).toBeTruthy();
    });
  });

  test("Wrong behavior: editing recurrence appointment does not affect to appointment's data source(T1100758)", async ({ page }) => {
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
