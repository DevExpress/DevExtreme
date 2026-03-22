import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe('Outlook dragging base tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Basic drag-n-drop movements in groups', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 26, 8, 30),
        endDate: new Date(2021, 2, 26, 11, 0),
        priorityId: 1,
      }],
      groups: ['priorityId'],
      resources: [{
        fieldExpr: 'priorityId',
        allowMultiple: false,
        dataSource: [
          { text: 'Low Priority', id: 1, color: '#1e90ff' },
          { text: 'High Priority', id: 2, color: '#ff9747' },
        ],
        label: 'Priority',
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 26),
      startDayHour: 8,
      height: 600,
      width: 1000,
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
    const workSpace = page.locator('.dx-scheduler-work-space');

    let box = await draggableAppointment.boundingBox();
    await draggableAppointment.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 330, box!.y + box!.height / 2 + 70, { steps: 15 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-orange-group.png', { element: workSpace });

    box = await draggableAppointment.boundingBox();
    await draggableAppointment.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 - 330, box!.y + box!.height / 2 + 70, { steps: 15 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-blue-group.png', { element: workSpace });
  });

  test('Basic drag-n-drop movements', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 22, 10),
        endDate: new Date(2021, 2, 22, 12, 30),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 22),
      startDayHour: 9,
      height: 600,
      width: 1000,
    });

    const appt = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
    const ws = page.locator('.dx-scheduler-work-space');

    let box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-right.png', { element: ws });

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 - 100, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-left.png', { element: ws });

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 + 100, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-bottom.png', { element: ws });

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 - 100, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-top.png', { element: ws });
  });

  ['timelineWeek', 'timelineMonth'].forEach((currentView) => {
    const dataSource = currentView === 'timelineWeek'
      ? [{ text: 'Website Re-Design Plan', startDate: new Date(2021, 2, 21, 9, 30), endDate: new Date(2021, 2, 21, 10, 45) }]
      : [{ text: 'Website Re-Design Plan', startDate: new Date(2021, 2, 2, 9, 30), endDate: new Date(2021, 2, 3, 11, 0) }];

    test(`Basic drag-n-drop movements in ${currentView} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource,
        views: ['timelineWeek', 'timelineMonth'],
        currentView,
        currentDate: new Date(2021, 2, 21),
        startDayHour: 9,
        height: 600,
        width: 1000,
      });

      const appt = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
      const ws = page.locator('.dx-scheduler-work-space');

      let box = await appt.boundingBox();
      await appt.hover();
      await page.mouse.down();
      await page.mouse.move(box!.x + box!.width / 2 + 250, box!.y + box!.height / 2, { steps: 10 });
      await page.mouse.up();
      await testScreenshot(page, `drag-n-drop-${currentView}-to-right.png`, { element: ws });

      box = await appt.boundingBox();
      await appt.hover();
      await page.mouse.down();
      await page.mouse.move(box!.x + box!.width / 2 - 250, box!.y + box!.height / 2, { steps: 10 });
      await page.mouse.up();
      await testScreenshot(page, `drag-n-drop-${currentView}-to-left.png`, { element: ws });
    });
  });

  test('Narrow appointment dragging on minimal distance should be expected(1171520)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Test',
        startDate: new Date(2021, 1, 2),
        endDate: new Date(2021, 1, 2, 1),
      }],
      views: ['timelineWeek'],
      currentView: 'timelineWeek',
      currentDate: new Date(2021, 1, 2),
      cellDuration: 1440,
      height: 300,
    });

    const ws = page.locator('.dx-scheduler-work-space');
    const appt = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' });

    let box = await appt.boundingBox();
    await page.mouse.move(box!.x + 10, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + 10 - 10, box!.y + box!.height / 2, { steps: 5 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-short-app-min-dist-to-left.png', { element: ws });

    box = await appt.boundingBox();
    await page.mouse.move(box!.x + 10, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + 10 + 195, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-short-app-to-right.png', { element: ws });

    box = await appt.boundingBox();
    await page.mouse.move(box!.x + 10, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + 10 + 200, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-short-app-to-right-on-next-cell.png', { element: ws });
  });
});
