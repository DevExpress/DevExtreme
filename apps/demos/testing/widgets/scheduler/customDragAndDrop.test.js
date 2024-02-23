import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const LIST_SELECTOR = '#list.dx-draggable';
const LIST_ITEM_SELECTOR = '.dx-card.dx-draggable';
const DATE_TABLE_CELL_SELECTOR = '.dx-scheduler-date-table .dx-scheduler-date-table-cell';
const ALL_DAY_PANEL_CELL_SELECTOR = '.dx-scheduler-all-day-table .dx-scheduler-all-day-table-cell';
const DATE_TABLE_APPOINTMENT_SELECTOR = '.dx-scheduler-date-table-container .dx-scheduler-appointment';
const ALL_DAY_PANEL_APPOINTMENT_SELECTOR = '.dx-scheduler-all-day-panel .dx-scheduler-appointment';

const DRAG_MOUSE_OPTIONS = { speed: 0.5 };

fixture('Scheduler.CustomDragAndDrop')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

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
  runManualTest('Scheduler', 'CustomDragAndDrop', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
    test(`Should drag-and-drop from ${fromName} to ${toName}`, async (t) => {
      const {
        takeScreenshot,
        compareResults,
      } = createScreenshotsComparer(t);

      await t.dragToElement(fromSelector, toSelector, DRAG_MOUSE_OPTIONS);
      await testScreenshot(t, takeScreenshot, `scheduler_custom-dnd_${fromName}_${toName}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    });
  });
});
