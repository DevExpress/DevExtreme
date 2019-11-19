import { createWidget } from '../../helpers/testHelper';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture `Week view in adaptive mode`
    .page(url(__dirname, '../container.html'));

const scheduler = new Scheduler("#container");

const roughEqual = (value: number, expected: number) => value >= expected - 1.5 && value <= expected + 1.5;

test(`Compact appointment should be center by vertical alignment`, async t => {
    await t.resizeWindow(350, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(0)
        .expect(scheduler.getAppointmentCollectorCount()).eql(3);

    await t
        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(0).element.getBoundingClientRectProperty("top"), 150)).ok()
        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(0).element.getBoundingClientRectProperty("left"), 101)).ok()

        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(1).element.getBoundingClientRectProperty("top"), 150)).ok()
        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(1).element.getBoundingClientRectProperty("left"), 139)).ok()

        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(2).element.getBoundingClientRectProperty("top"), 450)).ok()
        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(2).element.getBoundingClientRectProperty("left"), 177)).ok()

}).before(async () => await createScheduler(sampleDataNotRoundedMinutes));

test(`With a large browser width, should be visible common appointment instead of a compact`, async t => {
    await t.resizeWindow(350, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(0)
        .expect(scheduler.getAppointmentCollectorCount()).eql(2)

        .expect(roughEqual(await scheduler.getAppointmentCollector("1").element.getBoundingClientRectProperty("top"), 138)).ok()
        .expect(roughEqual(await scheduler.getAppointmentCollector("1").element.getBoundingClientRectProperty("left"), 101)).ok()

        .expect(roughEqual(await scheduler.getAppointmentCollector("2").element.getBoundingClientRectProperty("top"), 250)).ok()
        .expect(roughEqual(await scheduler.getAppointmentCollector("2").element.getBoundingClientRectProperty("left"), 101)).ok();

    await t.resizeWindow(700, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(1)
        .expect(scheduler.getAppointmentCollectorCount()).eql(2)

        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(0).element.getBoundingClientRectProperty("top"), 138)).ok()
        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(0).element.getBoundingClientRectProperty("left"), 215)).ok()

        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(1).element.getBoundingClientRectProperty("top"), 256)).ok()
        .expect(roughEqual(await scheduler.getAppointmentCollectorByIndex(1).element.getBoundingClientRectProperty("left"), 236)).ok();

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
