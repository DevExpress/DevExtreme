import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import Scheduler from '../../../../model/scheduler';
import AppointmentDialog from '../../../../model/scheduler/appointment/dialog';
import Appointment from '../../../../model/scheduler/appointment';

fixture`Editing recurrent appointment in DST time`
  .page(url(__dirname, '../../../container.html'));

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
  const screenshotZone = scheduler.workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);
  await t.doubleClick(appointmentToEdit.element, TEST_CURSOR_OPTIONS);

  const appointmentDialog = new AppointmentDialog();
  await t.click(appointmentDialog.series, TEST_CURSOR_OPTIONS);

  const { appointmentPopup } = scheduler;
  await t.click(appointmentPopup.doneButton, TEST_CURSOR_OPTIONS);

  await takeScreenshot(`${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, screenshotZone);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}

async function dragAndDropTestFunction(t: TestController,
  screenshotName: string,
  { rowIdx, cellIdx }: ITestDragNDropOptions): Promise<void> {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const screenshotZone = scheduler.workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);
  const cellToMoveElement = scheduler.getDateTableCell(rowIdx, cellIdx);

  await t.dragToElement(appointmentToEdit.element, cellToMoveElement, TEST_CURSOR_OPTIONS);

  const appointmentDialog = new AppointmentDialog();
  await t.click(appointmentDialog.series, TEST_CURSOR_OPTIONS);

  await takeScreenshot(`${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, screenshotZone);
  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}

async function resizeTestFunction(t: TestController,
  screenshotName: string,
  resizeOptions: ITestResizeOptions): Promise<void> {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const screenshotZone = scheduler.workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);

  await t.drag(appointmentToEdit.resizableHandle[resizeOptions.direction],
    0,
    resizeOptions.value,
    TEST_CURSOR_OPTIONS);

  const appointmentDialog = new AppointmentDialog();
  await t.click(appointmentDialog.series, TEST_CURSOR_OPTIONS);

  await takeScreenshot(`${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, screenshotZone);
  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}

async function configureScheduler({ start, end }: { start: Date; end: Date }) {
  await createWidget('dxScheduler', {
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
safeSizeTest('Editing popup: should have correctly been edited from editing popup. DST - winter time', async (t) => {
  await editingPopupTestFunction(t, 'popup__winter-time');
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.winter);
});

safeSizeTest('Editing popup: should have correctly been edited from editing popup. DST - summer time', async (t) => {
  await editingPopupTestFunction(t, 'popup__summer-time');
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.summer);
});

// === DRAG_N_DROP ===
safeSizeTest('Drag-n-drop up: should have correctly been edited. DST - winter time', async (t) => {
  await dragAndDropTestFunction(t, 'drag-n-drop-up__winter-time', {
    rowIdx: 1,
    cellIdx: 1,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.winter);
});

safeSizeTest('Drag-n-drop down: should have correctly been edited. DST - winter time', async (t) => {
  await dragAndDropTestFunction(t, 'drag-n-drop-down__winter-time', {
    rowIdx: 4,
    cellIdx: 1,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.winter);
});

safeSizeTest('Drag-n-drop up: should have correctly been edited. DST - summer time', async (t) => {
  await dragAndDropTestFunction(t, 'drag-n-drop-up__summer-time', {
    rowIdx: 1,
    cellIdx: 1,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.summer);
});

safeSizeTest('Drag-n-drop down: should have correctly been edited. DST - summer time', async (t) => {
  await dragAndDropTestFunction(t, 'drag-n-drop-down__summer-time', {
    rowIdx: 4,
    cellIdx: 1,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.summer);
});

// === RESIZE ===
safeSizeTest('Resize top: should have correctly been edited. DST - winter time', async (t) => {
  await resizeTestFunction(t, 'resize-top__winter-time', {
    direction: 'top',
    value: 100,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.winter);
});

safeSizeTest('Resize bottom: should have correctly been edited. DST - winter time', async (t) => {
  await resizeTestFunction(t, 'resize-bottom__winter-time', {
    direction: 'bottom',
    value: 100,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.winter);
});

safeSizeTest('Resize top: should have correctly been edited. DST - summer time', async (t) => {
  await resizeTestFunction(t, 'resize-top__summer-time', {
    direction: 'top',
    value: 100,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.summer);
});

safeSizeTest('Resize bottom: should have correctly been edited. DST - summer time', async (t) => {
  await resizeTestFunction(t, 'resize-bottom__summer-time', {
    direction: 'bottom',
    value: 100,
  });
}).before(async () => {
  await configureScheduler(APPOINTMENT_DATETIME.summer);
});
