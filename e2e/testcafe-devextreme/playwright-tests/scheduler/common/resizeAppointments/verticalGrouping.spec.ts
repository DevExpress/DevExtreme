import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const resourcesData = [{
  fieldExpr: 'priorityId',
  allowMultiple: false,
  dataSource: [
    { text: 'Low Priority', id: 1, color: '#1e90ff' },
    { text: 'High Priority', id: 2, color: '#ff9747' },
  ],
}];

test.describe('Resize appointments in the Scheduler with vertical grouping', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should correctly calculate group resizing area (T1025952)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'first', startDate: new Date(2021, 3, 21, 9, 30), endDate: new Date(2021, 3, 21, 10), priorityId: 1 },
        { text: 'second', startDate: new Date(2021, 3, 21, 9, 30), endDate: new Date(2021, 3, 21, 10), priorityId: 2 },
      ],
      views: [{ type: 'workWeek', groupOrientation: 'vertical' }],
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 21),
      startDayHour: 9,
      endDayHour: 12,
      groups: ['priorityId'],
      resources: resourcesData,
      width: 800,
      height: 600,
    });

    const firstAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'first' });
    const bottomHandle1 = firstAppointment.locator('.dx-resizable-handle-bottom');

    await bottomHandle1.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const height1 = await firstAppointment.evaluate((el) => getComputedStyle(el).height);
    expect(height1).toBe('140.594px');

    const secondAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'second' });
    const bottomHandle2 = secondAppointment.locator('.dx-resizable-handle-bottom');

    await bottomHandle2.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const height2 = await secondAppointment.evaluate((el) => getComputedStyle(el).height);
    expect(height2).toBe('165.922px');
  });

  test('Should correctly calculate group resizing area after scroll (T1041672)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'app', startDate: new Date(2021, 3, 21, 9, 30), endDate: new Date(2021, 3, 21, 10), priorityId: 2 },
      ],
      views: [{ type: 'week', groupOrientation: 'vertical' }],
      currentView: 'week',
      currentDate: new Date(2021, 3, 21),
      height: 400,
      groups: ['priorityId'],
      resources: resourcesData,
      width: 800,
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.scrollTo(new Date(2021, 3, 21, 9, 30), { priorityId: 2 });
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'app' });
    const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');

    await bottomHandle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const height = await appointment.evaluate((el) => getComputedStyle(el).height);
    expect(height).toBe('165.922px');
  });
});
