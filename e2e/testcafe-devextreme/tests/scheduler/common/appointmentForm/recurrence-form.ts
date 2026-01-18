import { ClientFunction, Selector } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { SELECTORS } from 'devextreme-testcafe-models/scheduler/appointment/popup';
import SelectBox from 'devextreme-testcafe-models/selectBox';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Appointment Form: Recurrence Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

test('Recurrence start date editor should have focus after opening recurrence settings', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await appointmentPopup.openRecurrenceSettings(t);

  await t
    .expect(appointmentPopup.recurrence.startDateInput.focused)
    .ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });
});

test('FrequencyEditor should not be focused when value is changed via API', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await appointmentPopup.openRecurrenceSettings(t);

  const frequencyEditor = new SelectBox(Selector(SELECTORS.recurrenceFrequencyEditor));
  const { getInstance } = frequencyEditor;

  const changeFrequencyValue = ClientFunction(
    () => {
      const instance = getInstance();
      if (instance) {
        (instance as any).option('value', 'yearly');
      }
    },
    { dependencies: { getInstance } },
  );

  await changeFrequencyValue();

  await t
    .expect(frequencyEditor.getInput().focused)
    .notOk();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });
});

test('FrequencyEditor should be focused when value is changed via mouse', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await appointmentPopup.openRecurrenceSettings(t);

  const frequencyEditor = new SelectBox(Selector(SELECTORS.recurrenceFrequencyEditor));
  await t.click(frequencyEditor.element);

  const yearlyOption = Selector(SELECTORS.listOption).withText('Year(s)');
  await t.click(yearlyOption);

  await t
    .expect(frequencyEditor.getInput().focused)
    .ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });
});

test('FrequencyEditor should be focused when value is changed via keyboard', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await appointmentPopup.openRecurrenceSettings(t);

  const frequencyEditor = new SelectBox(Selector(SELECTORS.recurrenceFrequencyEditor));

  await t.doubleClick(frequencyEditor.element);

  await t.pressKey('down');

  await t
    .expect(frequencyEditor.getInput().focused)
    .ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });
});
