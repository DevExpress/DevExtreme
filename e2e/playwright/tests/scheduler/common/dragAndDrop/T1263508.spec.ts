import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement, finishDrag, startDragToElement } from '../../../../helpers/dragUtils';
import { textMatcher } from '../../../../models/internal/textMatcher';
import Scheduler from '../../../../models/scheduler';

const DRAGGABLE_ITEM_CLASS = 'dx-card';
const draggingGroupName = 'appointmentsGroup';

interface Task { text: string }

const initList = (page: Page): Promise<void> => page.evaluate(() => {
  $('<div>', { id: 'list' }).appendTo('#parentContainer');
});

const addTasksToList = (page: Page, tasks: Task[]): Promise<void> => page.evaluate((items) => {
  items.forEach((task) => {
    $('<div>', {
      class: 'dx-card',
      text: task.text,
    }).appendTo('#list');
  });
}, tasks);

const createItemElement = async (page: Page, task: Task): Promise<void> => {
  await createWidget(page, 'dxDraggable', ({ group, data }: { group: string; data: Task }) => ({
    group,
    data,
    clone: true,
    onDragStart(e) {
      e.itemData = e.fromData;
    },
  }), `.${DRAGGABLE_ITEM_CLASS}:contains(${task.text})`, { arg: { group: draggingGroupName, data: task } });
};

test.describe('Scheduler Drag-and-Drop Fix', () => {
  test('Scheduler - The \'Cannot read properties of undefined (reading \'getTime\')\' error is thrown on an attempt to drag an outside element if the previous drag operation was canceled', async ({ page }) => {
    const tasks = [
      { text: 'Brochures' },
    ];

    await initList(page);
    await addTasksToList(page, tasks);
    await Promise.all(tasks.map((task) => createItemElement(page, task)));
    await createWidget(page, 'dxScheduler', ({ group, options }: { group: string; options: Record<string, unknown> }) => ({
      ...options,
      appointmentDragging: {
        group,
        onDragEnd(e) {
          e.cancel = e.event.ctrlKey;
        },
        onRemove(e) {
          e.component.deleteAppointment(e.itemData);
        },
        onAdd(e) {
          e.component.addAppointment(e.itemData);
        },
      },
    }), '#container', {
      arg: {
        group: draggingGroupName,
        options: {
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
        },
      },
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Book').element;
    const targetCell = scheduler.getDateTableCell(5, 0);
    const draggableItem = page.locator(`.${DRAGGABLE_ITEM_CLASS}`).filter({ hasText: textMatcher('Brochures') });

    await expect(scheduler.element).toBeAttached();

    await startDragToElement(page, draggableAppointment, targetCell);
    await page.keyboard.press('Escape');

    await finishDrag(page);

    await expect(draggableItem).toBeAttached();
    await dragToElement(page, draggableItem, targetCell);

    const newAppointment = scheduler.getAppointment('Brochures');

    await expect(newAppointment.element).toBeAttached();
  });
});
