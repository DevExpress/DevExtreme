import { createWidget } from '../../helpers/testHelper';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture `Delete appointments`
    .page(url(__dirname, '../container.html'));

const scheduler = new Scheduler("#container");

test(`Recurrence appointments should be deleted by click on 'delete' button`, async t => {
    await t
        .setTestSpeed(0.5)
        .expect(scheduler.getAppointmentCount()).eql(6)
        .click(scheduler.getAppointment("Text", 3).element)

        .click(scheduler.appointmentTooltip.deleteElement)
        .click(scheduler.getDialog().appointment)

        .expect(scheduler.getAppointmentCount()).eql(5);

    await t
        .click(scheduler.getAppointment("Text", 3).element)

        .click(scheduler.appointmentTooltip.deleteElement)
        .click(scheduler.getDialog().series)

        .expect(scheduler.getAppointmentCount()).eql(0);
}).before(async () => await createScheduler(createRecurrenceData()));

test(`Recurrence appointments should be deleted by press 'delete' key`, async t => {
    await t
        .expect(scheduler.getAppointmentCount()).eql(6)
        .click(scheduler.getAppointment("Text", 3).element)

        .pressKey("delete")
        .click(scheduler.getDialog().appointment)

        .expect(scheduler.getAppointmentCount()).eql(5);

    await t
        .click(scheduler.getAppointment("Text", 3).element)

        .pressKey("delete")
        .click(scheduler.getDialog().series)

        .expect(scheduler.getAppointmentCount()).eql(0);
}).before(async () => await createScheduler(createRecurrenceData()));

test(`Common appointments should be deleted by click on 'delete' button and press 'delete' key`, async t => {
    await t
        .expect(scheduler.getAppointmentCount()).eql(2)
        .click(scheduler.getAppointment("Text").element)
        .click(scheduler.appointmentTooltip.deleteElement)
        .expect(scheduler.getAppointmentCount()).eql(1);

    await t
        .expect(scheduler.getAppointmentCount()).eql(1)
        .click(scheduler.getAppointment("Text2").element)
        .pressKey("delete")
        .expect(scheduler.getAppointmentCount()).eql(0);

}).before(async () => await createScheduler(createSimpleData()));

const createSimpleData = () => [{
    Text: "Text",
    StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
    EndDate: new Date(2017, 4, 22, 2, 30, 0, 0)
}, {
    Text: "Text2",
    StartDate: new Date(2017, 4, 22, 12, 0, 0, 0),
    EndDate: new Date(2017, 4, 22, 13, 0, 0, 0)
},];

const createRecurrenceData = () => [{
    Text: "Text",
    StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
    EndDate: new Date(2017, 4, 22, 2, 30, 0, 0),
    RecurrenceRule: "FREQ=DAILY"
}];

const createScheduler = async (data) => {
    createWidget("dxScheduler", {
        dataSource: data,
        views: ["week"],
        currentView: "week",
        currentDate: new Date(2017, 4, 22),
        textExpr: "Text",
        startDateExpr: "StartDate",
        endDateExpr: "EndDate",
        allDayExpr: "AllDay",
        recurrenceRuleExpr: "RecurrenceRule",
        recurrenceExceptionExpr: "RecurrenceException"
    }, true);
}
