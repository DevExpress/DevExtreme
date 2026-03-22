import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Editing recurrent appointment in DST time', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

interface ITestResizeOptions {
  direction: keyof Appointment['resizableHandle'];
  value: number;
}
interface ITestDragNDropOptions {
  rowIdx: number;
  cellIdx: number;
}

const SCREENSHOT_BASE_NAME = 'recurrent-appointment-timezone-dst__editing';
const SCHEDULER_SELECTOR = '#container';
const TEST_APPOINTMENT_TEXT = 'Watercolor Landscape';
const TEST_CURSOR_OPTIONS = { speed: 0.5 };
const APPOINTMENT_DATETIME = {
  winter: {
    start: new Date('2020-11-01T17:30:00.000Z'),
    end: new Date('2020-11-01T19:00:00.000Z'),
  },
  summer: {
    start: new Date('2020-03-08T16:30:00.000Z'),
    end: new Date('2020-03-08T18:00:00.000Z'),
  },
};

async function editingPopupTestFunction(t: TestController, screenshotName: string): Promise<void> {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const screenshotZone = page.locator('.dx-scheduler-work-space');
    const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);
  await (appointmentToEdit.element, TEST_CURSOR_OPTIONS).dblclick();

  const appointmentDialog = new AppointmentDialog();
  await (appointmentDialog.series).click();

  const { appointmentPopup } = scheduler;
  await (appointmentPopup.saveButton.element).click();

  await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, { element: screenshotZone });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}

async function dragAndDropTestFunction(
  t: TestController,
  screenshotName: string,
  { rowIdx, cellIdx }: ITestDragNDropOptions,
): Promise<void> {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const screenshotZone = page.locator('.dx-scheduler-work-space');
    const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);
  const cellToMoveElement = page.locator('.dx-scheduler-date-table-row').nth(rowIdx).locator('.dx-scheduler-date-table-cell').nth(cellIdx);

  await /* TODO: dragToElement(appointmentToEdit.element, cellToMoveElement, TEST_CURSOR_OPTIONS) */;

  const appointmentDialog = new AppointmentDialog();
  await (appointmentDialog.series).click();

  await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, { element: screenshotZone });
  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}

async function resizeTestFunction(
  t: TestController,
  screenshotName: string,
  resizeOptions: ITestResizeOptions,
): Promise<void> {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const screenshotZone = page.locator('.dx-scheduler-work-space');
    const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);

  await t.drag(
    appointmentToEdit.resizableHandle[resizeOptions.direction],
    0,
    resizeOptions.value,
    TEST_CURSOR_OPTIONS,
  );

  const appointmentDialog = new AppointmentDialog();
  await (appointmentDialog.series).click();

  await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, { element: screenshotZone });
  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}

async function configureScheduler({ start, end }: { start: Date; end: Date }) {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      startDate: start,
      endDate: end,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO',
      text: TEST_APPOINTMENT_TEXT,
    }],
    timeZone: 'America/Los_Angeles',
    currentView: 'week',
    currentDate: start,
    startDayHour: 9,
    cellDuration: 30,
    width: 1000,
    height: 585,
  });
}

// === EDITING POPUP ===
test('Editing popup: should have correctly been edited from editing popup. DST - winter time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.winter);
  // --- test ---
await editingPopupTestFunction(t, 'popup__winter-time');
});

test('Editing popup: should have correctly been edited from editing popup. DST - summer time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.summer);
  // --- test ---
await editingPopupTestFunction(t, 'popup__summer-time');
});

// === DRAG_N_DROP ===
test('Drag-n-drop up: should have correctly been edited. DST - winter time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.winter);
  // --- test ---
await dragAndDropTestFunction(t, 'drag-n-drop-up__winter-time', {
    rowIdx: 1,
    cellIdx: 1,
  });
});

test('Drag-n-drop down: should have correctly been edited. DST - winter time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.winter);
  // --- test ---
await dragAndDropTestFunction(t, 'drag-n-drop-down__winter-time', {
    rowIdx: 4,
    cellIdx: 1,
  });
});

test('Drag-n-drop up: should have correctly been edited. DST - summer time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.summer);
  // --- test ---
await dragAndDropTestFunction(t, 'drag-n-drop-up__summer-time', {
    rowIdx: 1,
    cellIdx: 1,
  });
});

test('Drag-n-drop down: should have correctly been edited. DST - summer time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.summer);
  // --- test ---
await dragAndDropTestFunction(t, 'drag-n-drop-down__summer-time', {
    rowIdx: 4,
    cellIdx: 1,
  });
});

// === RESIZE ===
test('Resize top: should have correctly been edited. DST - winter time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.winter);
  // --- test ---
await resizeTestFunction(t, 'resize-top__winter-time', {
    direction: 'top',
    value: 100,
  });
});

test('Resize bottom: should have correctly been edited. DST - winter time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.winter);
  // --- test ---
await resizeTestFunction(t, 'resize-bottom__winter-time', {
    direction: 'bottom',
    value: 100,
  });
});

test('Resize top: should have correctly been edited. DST - summer time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.summer);
  // --- test ---
await resizeTestFunction(t, 'resize-top__summer-time', {
    direction: 'top',
    value: 100,
  });
});

test('Resize bottom: should have correctly been edited. DST - summer time', async ({ page }) => {
  // --- setup ---
await configureScheduler(APPOINTMENT_DATETIME.summer);
  // --- test ---
await resizeTestFunction(t, 'resize-bottom__summer-time', {
    direction: 'bottom',
    value: 100,
  });
});
});
