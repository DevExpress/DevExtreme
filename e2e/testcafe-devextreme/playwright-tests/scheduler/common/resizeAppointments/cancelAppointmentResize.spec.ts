import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const defaultSetupOptions = {
  timeZone: 'Etc/GMT',
  width: 400,
  currentDate: '2021-06-01T00:00:00Z',
  dataSource: [{
    text: 'Test Resize',
    startDate: '2021-06-01T01:00:00Z',
    endDate: '2021-06-01T20:00:00Z',
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  startDayHour: 0,
  cellDuration: 1440,
};

test.describe.skip('Cancel appointment Resizing', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('onAppointmentUpdating - newDate should be correct after cancel appointment resize and cellDuration=24h (T1070565)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSetupOptions,
      onAppointmentUpdating: ((e: any) => {
        (window as any).newEndDate = e.newData.endDate;
        e.cancel = true;
      }) as any,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test Resize' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');
    const etalonEndDateIso = '2021-06-03T00:00:00Z';

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(200, 0, { steps: 5 });
    await page.mouse.up();

    const timeText1 = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText1).toContain('1:00 AM - 8:00 PM');

    const newEndDate1 = await page.evaluate(() => (window as any).newEndDate);
    expect(newEndDate1).toBe(etalonEndDateIso);

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(200, 0, { steps: 5 });
    await page.mouse.up();

    const timeText2 = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText2).toContain('1:00 AM - 8:00 PM');

    const newEndDate2 = await page.evaluate(() => (window as any).newEndDate);
    expect(newEndDate2).toBe(etalonEndDateIso);
  });

  test("on escape - date should not changed when it's pressed after resize (T1125615)", async ({ page }) => {
    await createWidget(page, 'dxScheduler', defaultSetupOptions);

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test Resize' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(50, 0, { steps: 5 });
    await page.mouse.up();

    const timeText1 = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText1).toContain('1:00 AM - 12:00 AM');

    await appointment.click();
    await page.keyboard.press('Escape');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(150, 0, { steps: 5 });
    await page.mouse.up();

    const timeText2 = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText2).toContain('1:00 AM - 12:00 AM');
  });

  test("on escape - date should not changed when it's pressed during resize (T1125615)", async ({ page }) => {
    await createWidget(page, 'dxScheduler', defaultSetupOptions);

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test Resize' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(150, 0, { steps: 5 });
    await page.keyboard.press('Escape');
    await page.mouse.up();

    const timeText = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('1:00 AM - 8:00 PM');
  });
});
