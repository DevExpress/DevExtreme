import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const DRAGGABLE_ITEM_CLASS = 'dx-card';
const draggingGroupName = 'appointmentsGroup';

test.describe('Scheduler Drag-and-Drop Fix', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Scheduler - The \'Cannot read properties of undefined (reading \'getTime\')\' error is thrown on an attempt to drag an outside element if the previous drag operation was canceled', async ({ page }) => {
    const tasks = [{ text: 'Brochures' }];

    await page.evaluate(() => {
      $('<div>', { id: 'list' }).appendTo('#parentContainer');
    });

    await page.evaluate((tasksArr) => {
      tasksArr.forEach((task: any) => {
        $('<div>', {
          class: 'dx-card',
          text: task.text,
        }).appendTo('#list');
      });
    }, tasks);

    for (const task of tasks) {
      await createWidget(page, 'dxDraggable', {
        group: draggingGroupName,
        data: task,
        clone: true,
        onDragStart: new Function('e', 'e.itemData = e.fromData;') as any,
      }, `.${DRAGGABLE_ITEM_CLASS}:contains(${task.text})`);
    }

    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Book',
          startDate: new Date('2021-04-26T19:00:00.000Z'),
          endDate: new Date('2021-04-26T20:00:00.000Z'),
        },
      ],
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      height: 600,
      editing: true,
      appointmentDragging: {
        group: draggingGroupName,
        onDragEnd: new Function('e', 'e.cancel = e.event.ctrlKey;') as any,
        onRemove: new Function('e', 'e.component.deleteAppointment(e.itemData);') as any,
        onAdd: new Function('e', 'e.component.addAppointment(e.itemData);') as any,
      },
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Book' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(5).locator('.dx-scheduler-date-table-cell').nth(0);
    const draggableItem = page.locator(`.${DRAGGABLE_ITEM_CLASS}`).filter({ hasText: 'Brochures' });

    await expect(page.locator('.dx-scheduler')).toBeVisible();

    // TODO: This test requires disabling mouseup events during drag, then pressing escape.
    const targetBox = await targetCell.boundingBox();
    await draggableAppointment.hover();
    await page.mouse.down();
    await page.mouse.move(targetBox!.x + targetBox!.width / 2, targetBox!.y + targetBox!.height / 2, { steps: 10 });
    await page.keyboard.press('Escape');
    await page.mouse.up();

    await expect(draggableItem).toBeVisible();

    await draggableItem.dragTo(targetCell);

    const newAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochures' });
    await expect(newAppointment).toBeVisible();
  });
});
