import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Drag-n-drop from another draggable area', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Drag-n-drop an appointment when "cellDuration" changes dynamically', async ({ page }) => {
  // --- setup ---
await appendElementTo('#container', 'div', 'drag-area');

  await ClientFunction(() => {
    $('<div id=\'group\'>')
      .text('New Brochures')
      .addClass('item')
      .appendTo('#drag-area');
  })();

  await appendElementTo('#container', 'div', 'scheduler');

  await createWidget(page, 'dxDraggable', {
    group: 'draggableGroup',
    data: { text: 'New Brochures' },
    onDragStart(e) {
      e.itemData = e.fromData;
    },
  }, '#group');

  await createWidget(page, 'dxDraggable', {
    group: 'draggableGroup',
  }, '#drag-area');

  return createScheduler({
    views: ['week'],
    currentView: 'week',
    appointmentDragging: {
      group: 'draggableGroup',
      onAdd(e) {
        e.component.addAppointment(e.itemData);
        e.itemElement.remove();
      },
    },
  }, '#scheduler');
  // --- test ---
// Scheduler on '#scheduler'

  await scheduler.option('cellDuration', 10);

  await t
    .dragToElement(Selector('.item'), page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0))
    .expect(page.locator('.dx-scheduler-appointment').nth(0).date.time)
    .eql('9:00 AM - 9:10 AM');
});
});
