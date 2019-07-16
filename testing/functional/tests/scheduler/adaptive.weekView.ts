import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import SchedulerTestHelper from '../../helpers/scheduler.test.helper';

fixture `Week view in adaptive mode`
    .page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");

test(`Compact appointment should be center by vertical alignment`, async t => {
    await t.resizeWindow(350, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(0)
        .expect(scheduler.getCompactAppointmentCount()).eql(3);

    await t
        .expect(scheduler.getCompactAppointment(0).getBoundingClientRectProperty("top")).eql(150)
        .expect(scheduler.getCompactAppointment(1).getBoundingClientRectProperty("top")).eql(150)
        .expect(scheduler.getCompactAppointment(2).getBoundingClientRectProperty("top")).eql(450)

}).before(async () => await createScheduler(sampleDataNotRoundedMinutes));

test(`With a large browser width, should be visible common appointment instead of a compact`, async t => {
    const EXPECTED_TOP_POSITION = 250;

    await t.resizeWindow(350, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(0)
        .expect(scheduler.getCompactAppointmentCount()).eql(1)
        .expect(await scheduler.getCompactAppointment().getBoundingClientRectProperty("top")).eql(EXPECTED_TOP_POSITION);

    await t.resizeWindow(700, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(1)
        .expect(scheduler.getCompactAppointmentCount()).eql(1)
        .expect(await scheduler.getCompactAppointment().getBoundingClientRectProperty("top")).eql(EXPECTED_TOP_POSITION);

}).before(async () => await createScheduler(sampleData));

const createScheduler = async (data) => {
    createWidget("dxScheduler", {
        dataSource: data,
        views: ["week"],
        currentView: "week",
        adaptivityEnabled: true,
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
        height: 600,
        width: "100%"
    }, true);
}

const sampleData = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 11, 30)
    }, {
        text: "Website Re-Design Plan",
        startDate: new Date(2017, 4, 22, 9, 40),
        endDate: new Date(2017, 4, 22, 11, 40)
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date(2017, 4, 22, 12, 0),
        endDate: new Date(2017, 4, 22, 13, 0),
        allDay: true
    }
];

const sampleDataNotRoundedMinutes= [
    {
        text: "Website Re-Design Plan",
        startDate: new Date(2017, 4, 22, 9, 10),
        endDate: new Date(2017, 4, 22, 11, 30)
    }, {
        text: "Website Re-Design Plan",
        startDate: new Date(2017, 4, 23, 9, 5),
        endDate: new Date(2017, 4, 23, 11, 40)
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date(2017, 4, 24, 12, 12),
        endDate: new Date(2017, 4, 24, 13, 30)
    }
];
