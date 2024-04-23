import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import AppointmentPopup from 'devextreme-testcafe-models/scheduler/appointment/popup';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Appointment Form: recurrence editor`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const fillRecurrenceForm = async (t: TestController, popup: AppointmentPopup): Promise<void> => {
  await t.click(popup.recurrenceTypeElement);
  await t.click(popup.getRecurrenceTypeSelectItem(2));
  await t.typeText(popup.repeatEveryElement, '10', { replace: true });
  await t.click(popup.getEndRepeatRadioButton(1));
  await t.typeText(popup.endRepeatDateElement, '01/01/2024', { replace: true });
};

test('Should not reset the recurrence editor value after the repeat toggling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.appointmentPopup;
  const cell = scheduler.getDateTableCell(0, 0);

  await t.doubleClick(cell);
  await t.click(popup.recurrenceElement);
  await fillRecurrenceForm(t, popup);
  await t.click(popup.recurrenceElement);
  await t.click(popup.recurrenceElement);

  await takeScreenshot('recurrence-editor_after-hide.png', popup.form);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
  });
});

test('Should reset the recurrence editor value after the popup reopening', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.appointmentPopup;
  const cell = scheduler.getDateTableCell(0, 0);

  await t.doubleClick(cell);
  await t.click(popup.recurrenceElement);
  await fillRecurrenceForm(t, popup);
  await t.click(popup.cancelButton);
  await t.doubleClick(cell);
  await t.click(popup.recurrenceElement);

  await takeScreenshot('recurrence-editor_after-popup-reopen.png', popup.form);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
  });
});

test('Should correctly create usual appointment after repeat toggling', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.appointmentPopup;
  const cell = scheduler.getDateTableCell(0, 0);

  await t.doubleClick(cell);
  await t.click(popup.recurrenceElement);
  await t.click(popup.recurrenceElement);
  await t.click(popup.doneButton);

  await t.expect(scheduler.getAppointmentCount()).eql(1);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
  });
});

test('Should correctly create recurrent appointment', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.appointmentPopup;
  const cell = scheduler.getDateTableCell(0, 0);

  await t.doubleClick(cell);
  await t.click(popup.recurrenceElement);
  await t.click(popup.doneButton);

  await t.expect(scheduler.getAppointmentCount()).eql(7);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
  });
});

test('Should correctly create recurrent appointment after repeat toggle', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.appointmentPopup;
  const cell = scheduler.getDateTableCell(0, 0);

  await t.doubleClick(cell);
  await t.click(popup.recurrenceElement);
  await t.click(popup.recurrenceElement);
  await t.click(popup.recurrenceElement);
  await t.click(popup.doneButton);

  await t.expect(scheduler.getAppointmentCount()).eql(7);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
  });
});
