import { createWidget } from '../../helpers/testHelper';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture `Week view in adaptive mode`
    .page(url(__dirname, '../container.html'));

const scheduler = new Scheduler("#container");

test(`Compact appointment should be center by vertical alignment`, async t => {
    await t.resizeWindow(350, 600);


    await t
        .expect(scheduler.getAppointmentCount()).eql(0)
        .expect(scheduler.getAppointmentCollectorCount()).eql(3);

    await t
        .expect(scheduler.getAppointmentCollectorByIndex(0).element.getBoundingClientRectProperty("top")).eql(150)
        .expect(scheduler.getAppointmentCollectorByIndex(0).element.getBoundingClientRectProperty("left")).eql(100.5)

        .expect(scheduler.getAppointmentCollectorByIndex(1).element.getBoundingClientRectProperty("top")).eql(150)
        .expect(scheduler.getAppointmentCollectorByIndex(1).element.getBoundingClientRectProperty("left")).eql(138.5)

        .expect(scheduler.getAppointmentCollectorByIndex(2).element.getBoundingClientRectProperty("top")).eql(450)
        .expect(scheduler.getAppointmentCollectorByIndex(2).element.getBoundingClientRectProperty("left")).eql(176.5)

}).before(async () => await createScheduler(sampleDataNotRoundedMinutes));

test(`With a large browser width, should be visible common appointment instead of a compact`, async t => {
    const EXPECTED_TOP_POSITION = 250;

    await t.debug();

    await t.resizeWindow(350, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(0)
        .expect(scheduler.getAppointmentCollectorCount()).eql(1)
        .expect(await scheduler.getAppointmentCollectorByIndex().element.getBoundingClientRectProperty("top")).eql(EXPECTED_TOP_POSITION);

    await t.resizeWindow(700, 600);

    await t
        .expect(scheduler.getAppointmentCount()).eql(1)
        .expect(scheduler.getAppointmentCollectorCount()).eql(1)
        .expect(await scheduler.getAppointmentCollectorByIndex().element.getBoundingClientRectProperty("top")).eql(EXPECTED_TOP_POSITION);

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
