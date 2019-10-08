import $ from "jquery";

QUnit.testStart(() => {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

import "common.css!";
import "generic_light.css!";

import translator from "animation/translator";
import fx from "animation/fx";
import { DataSource } from "data/data_source/data_source";

import "ui/scheduler/ui.scheduler";
import { SchedulerTestWrapper } from './helpers.js';

const createInstance = options => {
    const instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
    return new SchedulerTestWrapper(instance);
};

QUnit.module("Integration: Timeline", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Special classes should be applied in grouped timeline", assert => {
    let $style = $("<style>").text('#scheduler .dx-scheduler-cell-sizes-vertical {height: 100px } ');

    try {
        $style.appendTo("head");

        let resourcesData = [
            { text: "One", id: 2 },
            { text: "Two", id: 3 },
            { text: "Three", id: 4 },
            { text: "Four", id: 5 },
            { text: "Five", id: 6 }
        ];

        let scheduler = createInstance({
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            crossScrollingEnabled: true,
            groups: ["ownerId"],
            resources: [{
                fieldExpr: "ownerId",
                dataSource: resourcesData
            }],
            height: 500
        });

        assert.roughEqual(scheduler.grouping.getGroupHeaderHeight(), 100, 3.001, "Cell height is OK");
    } finally {
        $style.remove();
    }
});

QUnit.test("Scheduler should have a right timeline work space", assert => {
    let scheduler = createInstance({
        views: ["timelineDay", "timelineWeek", "timelineWorkWeek", "timelineMonth"],
        currentView: "timelineDay"
    });

    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineDay("instance"), "Work space is timelineDay on init");

    scheduler.instance.option("currentView", "timelineWeek");
    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWeek("instance"), "Work space is timelineWeek after change option ");

    scheduler.instance.option("currentView", "timelineWorkWeek");
    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWorkWeek("instance"), "Work space is timelineWorkWeek after change option ");

    scheduler.instance.option("currentView", "timelineMonth");
    assert.ok(scheduler.workSpace.getWorkSpace().dxSchedulerTimelineMonth("instance"), "Work space is timelineMonth after change option ");
});

QUnit.test("Scheduler should not update scroll position if appointment is visible, timeline day view ", assert => {
    let scheduler = createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "timelineDay",
        height: 500
    });

    const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: "caption" }, workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineDay("instance"), scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scrollToTimeSpy.calledOnce, "scrollToTime was not called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should not update scroll position if appointment is visible, timeline week view ", assert => {
    let scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ["timelineWeek", "timelineWorkWeek"],
        currentView: "timelineWeek",
        height: 500,
        cellDuration: 120
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable("instance");
    scrollable.scrollTo({ left: 10000 });

    const appointment = { startDate: new Date(2015, 2, 6, 6), endDate: new Date(2015, 2, 6, 8), text: "caption" }, workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWeek("instance"), scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scrollToTimeSpy.calledOnce, "scrollToTime was not called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment is not visible, timeline week view ", assert => {
    let scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ["timelineWeek", "timelineWorkWeek"],
        currentView: "timelineWeek",
        height: 500,
        cellDuration: 120
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable("instance");
    scrollable.scrollTo({ left: 2000 });

    const appointment = { startDate: new Date(2015, 2, 6, 6), endDate: new Date(2015, 2, 6, 8), text: "caption" }, workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineWeek("instance"), scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("getEndViewDate should return correct value on timelineMonth view DST date (T720694)", assert => {
    let scheduler = createInstance({
        currentDate: new Date(2019, 2, 5),
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        dataSource: []
    });

    const workSpace = scheduler.instance.getWorkSpace();

    assert.deepEqual(workSpace.getEndViewDate(), new Date(2019, 2, 31, 23, 59), "End view date is OK");
});

QUnit.test("Scheduler should not update scroll position if appointment is visible, timeline month view ", assert => {
    let scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        height: 500,
        cellDuration: 120
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable("instance");
    scrollable.scrollTo({ left: 12000 });

    const appointment = { startDate: new Date(2015, 2, 29, 6), endDate: new Date(2015, 2, 29, 8), text: "caption" }, workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineMonth("instance"), scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scrollToTimeSpy.calledOnce, "scrollToTime was not called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment is not visible, timeline month view ", assert => {
    let scheduler = createInstance({
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 2),
        dataSource: new DataSource({
            store: []
        }),
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        height: 500,
        cellDuration: 120
    });

    const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable("instance");
    scrollable.scrollTo({ left: 1000 });

    const appointment = { startDate: new Date(2015, 2, 29, 6), endDate: new Date(2015, 2, 29, 8), text: "caption" }, workSpace = scheduler.workSpace.getWorkSpace().dxSchedulerTimelineMonth("instance"), scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        scheduler.instance.showAppointmentPopup(appointment);
        scheduler.appointmentPopup.clickDoneButton();

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Appointments should have a right order on timeline month(lots of appts)", assert => {
    let scheduler = createInstance({
        currentDate: new Date(2016, 1, 2),
        maxAppointmentsPerCell: null,
        dataSource: new DataSource([
            {
                "text": "Google AdWords Strategy",
                "startDate": new Date(2016, 1, 1, 9, 0),
                "endDate": new Date(2016, 1, 1, 10, 30)
            }, {
                "text": "New Brochures",
                "startDate": new Date(2016, 1, 1, 11, 30),
                "endDate": new Date(2016, 1, 1, 14, 15)
            }, {
                "text": "Brochure Design Review",
                "startDate": new Date(2016, 1, 1, 15, 15),
                "endDate": new Date(2016, 1, 1, 17, 15)
            }, {
                "text": "Website Re-Design Plan",
                "startDate": new Date(2016, 1, 1, 18, 45),
                "endDate": new Date(2016, 1, 1, 20, 15)
            }, {
                "text": "Rollout of New Website and Marketing Brochures",
                "startDate": new Date(2016, 1, 2, 8, 15),
                "endDate": new Date(2016, 1, 2, 10, 45)
            }, {
                "text": "Update Sales Strategy Documents",
                "startDate": new Date(2016, 1, 2, 12, 0),
                "endDate": new Date(2016, 1, 2, 13, 45)
            }, {
                "text": "Direct vs Online Sales Comparison Report",
                "startDate": new Date(2016, 1, 2, 15, 30),
                "endDate": new Date(2016, 1, 2, 17, 30)
            }, {
                "text": "Non-Compete Agreements",
                "startDate": new Date(2016, 1, 3, 8, 15),
                "endDate": new Date(2016, 1, 3, 9, 0)
            }, {
                "text": "Approve Hiring of John Jeffers",
                "startDate": new Date(2016, 1, 3, 10, 0),
                "endDate": new Date(2016, 1, 3, 11, 15)
            }, {
                "text": "Update NDA Agreement",
                "startDate": new Date(2016, 1, 3, 11, 45),
                "endDate": new Date(2016, 1, 3, 13, 45)
            }, {
                "text": "Update Employee Files with New NDA",
                "startDate": new Date(2016, 1, 3, 14, 0),
                "endDate": new Date(2016, 1, 3, 16, 45)
            }
        ]),
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        height: 800,
        startDayHour: 8,
        endDayHour: 20,
        cellDuration: 60,
        firstDayOfWeek: 0,
        width: 800
    });

    assert.roughEqual(translator.locate(scheduler.appointments.getAppointment(0)).top, 0, 2.001, "Appointment position is OK");
    assert.roughEqual(translator.locate(scheduler.appointments.getAppointment(1)).top, 100, 2.001, "Appointment position is OK");
    assert.roughEqual(translator.locate(scheduler.appointments.getAppointment(2)).top, 200, 2.001, "Appointment position is OK");
    assert.roughEqual(translator.locate(scheduler.appointments.getAppointment(3)).top, 300, 2.001, "Appointment position is OK");
});

QUnit.test("Appointments should have a right order on timeline month", assert => {
    let scheduler = createInstance({
        currentDate: new Date(2016, 1, 2),
        dataSource: new DataSource([
            {
                "text": "a",
                "startDate": new Date(2016, 1, 1, 11, 30),
                "endDate": new Date(2016, 1, 1, 14, 15)
            }, {
                "text": "b",
                "startDate": new Date(2016, 1, 1, 9, 0),
                "endDate": new Date(2016, 1, 1, 10, 30)
            },
        ]),
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        height: 800,
        width: 800
    });

    let $appointments = scheduler.instance.$element().find(".dx-scheduler-appointment");

    assert.equal($appointments.eq(0).data("dxItemData").text, "b", "Appointment data is OK");
    assert.equal($appointments.eq(1).data("dxItemData").text, "a", "Appointment data is OK");
});

QUnit.test("Scheduler timeline dateTable should have right height after changing size if crossScrollingEnabled = true (T644407)", assert => {
    const resourcesData = [
        { text: "One", id: 2 },
        { text: "Two", id: 3 },
        { text: "Three", id: 4 },
        { text: "Four", id: 5 },
        { text: "Five", id: 6 }
    ];

    let scheduler = createInstance({
        dataSource: [],
        views: ["timelineDay"],
        currentView: "timelineDay",
        currentDate: new Date(2017, 4, 1),
        crossScrollingEnabled: true,
        groups: ["ownerId"],
        resources: [{
            fieldExpr: "ownerId",
            allowMultiple: true,
            dataSource: resourcesData,
            label: "Owner",
            useColorAsDefault: true
        }]
    });

    const $firstRowCell = scheduler.workSpace.getCell(0), cellHeight = $firstRowCell.height();

    scheduler.instance.option("width", 500);
    scheduler.instance.option("width", 1000);

    assert.equal(scheduler.workSpace.getCell(0).height(), cellHeight, "Cells has correct height");
});

QUnit.test("Scheduler timeline groupTable should have right height if widget has auto-height", assert => {
    const resourcesData = [
        { text: "One", id: 2 },
        { text: "Two", id: 3 },
        { text: "Three", id: 4 },
        { text: "Four", id: 5 },
        { text: "Five", id: 6 }
    ];

    let scheduler = createInstance({
        dataSource: [],
        views: ["timelineDay"],
        currentView: "timelineDay",
        currentDate: new Date(2017, 4, 1),
        crossScrollingEnabled: false,
        groups: ["ownerId"],
        resources: [{
            fieldExpr: "ownerId",
            allowMultiple: true,
            dataSource: resourcesData,
            label: "Owner",
            useColorAsDefault: true
        }]
    });

    const groupHeight = scheduler.grouping.getGroupTableHeight(), dateTableHeight = scheduler.workSpace.getDateTableHeight();

    assert.roughEqual(groupHeight, dateTableHeight, 1.5, "Group table has correct height");
});

QUnit.test("Appointment has correct render with timelineWeek view & endHour outside of view bounds", function(assert) {
    var data = [{
        startDate: new Date("2014-07-14T09:00:00.000Z"),
        endDate: new Date("2014-07-14T23:01:00.000Z"),
        text: "blah",
    }, {
        startDate: new Date("2014-07-17T00:00:00.000Z"),
        endDate: new Date("2014-07-18T00:00:00.000Z"),
        text: "blah",
    }];

    let scheduler = createInstance({
        dataSource: data,
        views: [{
            type: "timelineWeek",
            cellDuration: 660,
            startDayHour: 7,
            endDayHour: 18
        }],
        currentView: "timelineWeek",
        firstDayOfWeek: 1,
        currentDate: new Date(2014, 6, 14),
        crossScrollingEnabled: true,
        width: 1500,
    });

    assert.ok(scheduler.appointments.getAppointmentCount() > 0, "Appointments are rendered");
});
