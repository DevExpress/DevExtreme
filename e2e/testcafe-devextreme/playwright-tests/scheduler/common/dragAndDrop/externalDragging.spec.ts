import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, appendElementTo } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const defaultSchedulerOptions = {
  views: ['day'],
  dataSource: [],
  resources: [{
    fieldExpr: 'resourceId',
    dataSource: [{ id: 0, color: '#e01e38' }, { id: 1, color: '#f98322' }, { id: 2, color: '#1e65e8' }],
    label: 'Color',
  }],
  width: 1666,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
};

test.describe('Drag-n-drop from another draggable area', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Drag-n-drop an appointment when "cellDuration" changes dynamically', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', { id: 'drag-area' });

    await page.evaluate(() => {
      $('<div id="group">').text('New Brochures').addClass('item').appendTo('#drag-area');
    });

    await appendElementTo(page, '#container', 'div', { id: 'scheduler' });

    await createWidget(page, 'dxDraggable', {
      group: 'draggableGroup',
      data: { text: 'New Brochures' },
      onDragStart: new Function('e', 'e.itemData = e.fromData;') as any,
    }, '#group');

    await createWidget(page, 'dxDraggable', { group: 'draggableGroup' }, '#drag-area');

    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      appointmentDragging: {
        group: 'draggableGroup',
        onAdd: new Function('e', 'e.component.addAppointment(e.itemData); e.itemElement.remove();') as any,
      },
    }, '#scheduler');

    await page.evaluate(() => {
      ($('#scheduler') as any).dxScheduler('instance').option('cellDuration', 10);
    });

    const dragItem = page.locator('.item');
    const targetCell = page.locator('#scheduler .dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

    await dragItem.dragTo(targetCell);

    const appointment = page.locator('#scheduler .dx-scheduler-appointment').first();
    const timeText = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('9:00 AM - 9:10 AM');
  });
});
