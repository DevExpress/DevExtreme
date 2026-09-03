import type { Page } from '@playwright/test';
import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { dragToElement, dragToOffset } from '../../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../../helpers/screenshots';
import type Appointment from '../../../../../models/scheduler/appointment';
import Scheduler from '../../../../../models/scheduler';

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

async function editingPopupTestFunction(page: Page, screenshotName: string): Promise<void> {
  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const screenshotZone = scheduler.workSpace;

  const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);
  await appointmentToEdit.element.dblclick();

  await Scheduler.getEditRecurrenceDialog(page).series.click();

  const { appointmentPopup } = scheduler;
  await appointmentPopup.saveButton.element.click();

  await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, { element: screenshotZone });
}

async function dragAndDropTestFunction(
  page: Page,
  screenshotName: string,
  { rowIdx, cellIdx }: ITestDragNDropOptions,
): Promise<void> {
  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const screenshotZone = scheduler.workSpace;

  const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);
  const cellToMoveElement = scheduler.getDateTableCell(rowIdx, cellIdx);

  await dragToElement(page, appointmentToEdit.element, cellToMoveElement);

  await Scheduler.getEditRecurrenceDialog(page).series.click();

  await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, { element: screenshotZone });
}

async function resizeTestFunction(
  page: Page,
  screenshotName: string,
  resizeOptions: ITestResizeOptions,
): Promise<void> {
  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const screenshotZone = scheduler.workSpace;

  const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);

  await dragToOffset(
    page,
    appointmentToEdit.resizableHandle[resizeOptions.direction],
    0,
    resizeOptions.value,
  );

  await Scheduler.getEditRecurrenceDialog(page).series.click();

  await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, { element: screenshotZone });
}

async function configureScheduler(
  page: Page,
  { start, end }: { start: Date; end: Date },
): Promise<void> {
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
  await configureScheduler(page, APPOINTMENT_DATETIME.winter);

  await editingPopupTestFunction(page, 'popup__winter-time');
});

test('Editing popup: should have correctly been edited from editing popup. DST - summer time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.summer);

  await editingPopupTestFunction(page, 'popup__summer-time');
});

// === DRAG_N_DROP ===
test('Drag-n-drop up: should have correctly been edited. DST - winter time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.winter);

  await dragAndDropTestFunction(page, 'drag-n-drop-up__winter-time', {
    rowIdx: 1,
    cellIdx: 1,
  });
});

test('Drag-n-drop down: should have correctly been edited. DST - winter time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.winter);

  await dragAndDropTestFunction(page, 'drag-n-drop-down__winter-time', {
    rowIdx: 4,
    cellIdx: 1,
  });
});

test('Drag-n-drop up: should have correctly been edited. DST - summer time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.summer);

  await dragAndDropTestFunction(page, 'drag-n-drop-up__summer-time', {
    rowIdx: 1,
    cellIdx: 1,
  });
});

test('Drag-n-drop down: should have correctly been edited. DST - summer time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.summer);

  await dragAndDropTestFunction(page, 'drag-n-drop-down__summer-time', {
    rowIdx: 4,
    cellIdx: 1,
  });
});

// === RESIZE ===
test('Resize top: should have correctly been edited. DST - winter time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.winter);

  await resizeTestFunction(page, 'resize-top__winter-time', {
    direction: 'top',
    value: 100,
  });
});

test('Resize bottom: should have correctly been edited. DST - winter time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.winter);

  await resizeTestFunction(page, 'resize-bottom__winter-time', {
    direction: 'bottom',
    value: 100,
  });
});

test('Resize top: should have correctly been edited. DST - summer time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.summer);

  await resizeTestFunction(page, 'resize-top__summer-time', {
    direction: 'top',
    value: 100,
  });
});

test('Resize bottom: should have correctly been edited. DST - summer time', async ({ page }) => {
  await configureScheduler(page, APPOINTMENT_DATETIME.summer);

  await resizeTestFunction(page, 'resize-bottom__summer-time', {
    direction: 'bottom',
    value: 100,
  });
});
