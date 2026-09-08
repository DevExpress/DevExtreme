import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement, finishDrag, startDragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

const DRAGGABLE_ITEM_CLASS = 'dx-card';
const draggingGroupName = 'appointmentsGroup';

test('Scheduler - The \'Cannot read properties of undefined (reading \'getTime\')\' error is thrown on an attempt to drag an outside element if the previous drag operation was canceled', async ({ page }) => {
  const tasks = [
    { text: 'Brochures' },
  ];

  await page.evaluate(() => {
    $('<div>', { id: 'list' }).appendTo('#parentContainer');
  });

  await page.evaluate((items) => {
    items.forEach((task) => {
      $('<div>', {
        class: 'dx-card',
        text: task.text,
      }).appendTo('#list');
    });
  }, tasks);

  await Promise.all(tasks.map((task) => createWidget(page, 'dxDraggable', {
    group: draggingGroupName,
    data: task,
    clone: true,
    onDragStart(e) {
      e.itemData = e.fromData;
    },
  }, `.${DRAGGABLE_ITEM_CLASS}:contains(${task.text})`)));

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
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Book').element;
  const targetCell = scheduler.getDateTableCell(5, 0);
  const draggableItem = page.locator(`.${DRAGGABLE_ITEM_CLASS}`).filter({ hasText: 'Brochures' });

  await expect(scheduler.element).toBeVisible();

  // Escape has to arrive while the mouse is still down, which is what the TestCafe test got by
  // disabling the automation "_mouseup"; the button is released once the drag is already cancelled.
  await startDragToElement(page, draggableAppointment, targetCell);
  await page.keyboard.press('Escape');
  await finishDrag(page);

  await expect(draggableItem).toHaveCount(1);

  await dragToElement(page, draggableItem, targetCell);

  await expect(scheduler.getAppointment('Brochures').element).toHaveCount(1);
});
