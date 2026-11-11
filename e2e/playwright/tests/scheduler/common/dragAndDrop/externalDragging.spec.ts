import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { appendElementTo } from '../../../../helpers/domUtils';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

test.describe('Drag-n-drop from another draggable area', () => {
  test('Drag-n-drop an appointment when "cellDuration" changes dynamically', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'drag-area');

    await page.evaluate(() => {
      $('<div id=\'group\'>')
        .text('New Brochures')
        .addClass('item')
        .appendTo('#drag-area');
    });

    await appendElementTo(page, '#container', 'div', 'scheduler');

    await createWidget(page, 'dxDraggable', () => ({
      group: 'draggableGroup',
      data: { text: 'New Brochures' },
      onDragStart(e) {
        e.itemData = e.fromData;
      },
    }), '#group');

    await createWidget(page, 'dxDraggable', {
      group: 'draggableGroup',
    }, '#drag-area');

    await createScheduler(page, {
      views: ['week'],
      currentView: 'week',
    }, '#scheduler', (options) => ({
      ...options,
      appointmentDragging: {
        group: 'draggableGroup',
        onAdd(e) {
          e.component.addAppointment(e.itemData);
          e.itemElement.remove();
        },
      },
    }));

    const scheduler = new Scheduler(page, '#scheduler');

    await scheduler.option('cellDuration', 10);

    await dragToElement(page, page.locator('.item'), scheduler.getDateTableCell(0, 0));
    await expect(scheduler.getAppointmentByIndex(0).date).toHaveText('9:00 AM - 9:10 AM');
  });
});
