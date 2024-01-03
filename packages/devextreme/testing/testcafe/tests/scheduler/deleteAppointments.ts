import disposeWidget from '../../helpers/disposeWidget';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture.disablePageReloads`Delete appointments`
  .page(url(__dirname, '../container.html'));

const createRecurrenceData = (): Record<string, unknown>[] => [{
  Text: 'Text',
  StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
  EndDate: new Date(2017, 4, 22, 2, 30, 0, 0),
  RecurrenceRule: 'FREQ=DAILY',
}];

const createScheduler = async (data): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: data,
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2017, 4, 22),
    textExpr: 'Text',
    startDateExpr: 'StartDate',
    endDateExpr: 'EndDate',
    allDayExpr: 'AllDay',
    recurrenceRuleExpr: 'RecurrenceRule',
    recurrenceExceptionExpr: 'RecurrenceException',
  });
};

const createSimpleData = (): Record<string, unknown>[] => [{
  Text: 'Text',
  StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
  EndDate: new Date(2017, 4, 22, 2, 30, 0, 0),
}, {
  Text: 'Text2',
  StartDate: new Date(2017, 4, 22, 12, 0, 0, 0),
  EndDate: new Date(2017, 4, 22, 13, 0, 0, 0),
}];

test('Recurrence appointments should be deleted by click on \'delete\' button', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount()).eql(6)
    .click(scheduler.getAppointment('Text', 3).element)

    .expect(scheduler.appointmentTooltip.element.exists)
    .ok()
    .click(scheduler.appointmentTooltip.deleteButton)
    .click(Scheduler.getDeleteRecurrenceDialog().appointment)

    .expect(scheduler.getAppointmentCount())
    .eql(5);

  await t
    .click(scheduler.getAppointment('Text', 3).element)

    .click(scheduler.appointmentTooltip.deleteButton)
    .click(Scheduler.getDeleteRecurrenceDialog().series)

    .expect(scheduler.getAppointmentCount())
    .eql(0);
}).before(async () => createScheduler(createRecurrenceData()));

test('Recurrence appointments should be deleted by press \'delete\' key', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount()).eql(6)
    .click(scheduler.getAppointment('Text', 3).element)

    .pressKey('delete')
    .click(Scheduler.getDeleteRecurrenceDialog().appointment)

    .expect(scheduler.getAppointmentCount())
    .eql(5);

  await t
    .click(scheduler.getAppointment('Text', 3).element)

    .pressKey('delete')
    .click(Scheduler.getDeleteRecurrenceDialog().series)

    .expect(scheduler.getAppointmentCount())
    .eql(0);
}).before(async () => createScheduler(createRecurrenceData())).after(async () => {
  await disposeWidget('dxScheduler');
});

test('Common appointments should be deleted by click on \'delete\' button and press \'delete\' key', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount()).eql(2)
    .click(scheduler.getAppointment('Text').element)
    .click(scheduler.appointmentTooltip.deleteButton)
    .expect(scheduler.getAppointmentCount())
    .eql(1);

  await t
    .expect(scheduler.getAppointmentCount()).eql(1)
    .click(scheduler.getAppointment('Text2').element)
    .pressKey('delete')
    .expect(scheduler.getAppointmentCount())
    .eql(0);
}).before(async () => createScheduler(createSimpleData()));
