import { test } from '@playwright/test';
import { describeManualTest, dragToElement, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const LIST_SELECTOR = '#list.dx-draggable';
const LIST_ITEM_SELECTOR = '.dx-card.dx-draggable';
const DATE_TABLE_CELL_SELECTOR = '.dx-scheduler-date-table .dx-scheduler-date-table-cell';
const ALL_DAY_PANEL_CELL_SELECTOR = '.dx-scheduler-all-day-table .dx-scheduler-all-day-table-cell';
const DATE_TABLE_APPOINTMENT_SELECTOR = '.dx-scheduler-date-table-container .dx-scheduler-appointment';
const ALL_DAY_PANEL_APPOINTMENT_SELECTOR = '.dx-scheduler-all-day-panel .dx-scheduler-appointment';

describeManualTest('Scheduler', 'DragAndDrop', { width: 900, height: 600 }, () => {
  [
    [LIST_ITEM_SELECTOR, DATE_TABLE_CELL_SELECTOR, 'list', 'date-table'],
    [DATE_TABLE_APPOINTMENT_SELECTOR, LIST_SELECTOR, 'date-table', 'list'],
    [LIST_ITEM_SELECTOR, ALL_DAY_PANEL_CELL_SELECTOR, 'list', 'all-day-panel'],
    [ALL_DAY_PANEL_APPOINTMENT_SELECTOR, LIST_SELECTOR, 'all-day-panel', 'list'],
  ].forEach(([
    fromSelector,
    toSelector,
    fromName,
    toName,
  ]) => {
    test(`Should drag-and-drop from ${fromName} to ${toName}`, async ({ page }) => {
      await dragToElement(page, page.locator(fromSelector).first(), page.locator(toSelector).first());
      await testScreenshot(page, `scheduler_custom-dnd_${fromName}_${toName}.png`);
    });
  });
});
