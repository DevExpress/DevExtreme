"use strict";

var $ = require("jquery"),
    translator = require("animation/translator"),
    fx = require("animation/fx"),
    DataSource = require("data/data_source/data_source").DataSource;

require("ui/scheduler/ui.scheduler");

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

QUnit.test("Scheduler should have a right timeline work space", function(assert) {
    this.createInstance({
        views: ["timelineDay", "timelineWeek", "timelineWorkWeek", "timelineMonth"],
        currentView: "timelineDay"
    });
    var $element = this.instance.element();

    assert.ok($element.find(".dx-scheduler-work-space").dxSchedulerTimelineDay("instance"), "Work space is timelineDay on init");

    this.instance.option("currentView", "timelineWeek");
    assert.ok($element.find(".dx-scheduler-work-space").dxSchedulerTimelineWeek("instance"), "Work space is timelineWeek after change option ");

    this.instance.option("currentView", "timelineWorkWeek");
    assert.ok($element.find(".dx-scheduler-work-space").dxSchedulerTimelineWorkWeek("instance"), "Work space is timelineWorkWeek after change option ");

    this.instance.option("currentView", "timelineMonth");
    assert.ok($element.find(".dx-scheduler-work-space").dxSchedulerTimelineMonth("instance"), "Work space is timelineMonth after change option ");
});

QUnit.test("Scheduler should have a right rendering strategy for timeline views", function(assert) {
    this.createInstance({
        views: ["timelineDay", "timelineWeek", "timelineWorkWeek", "timelineMonth"],
        currentView: "timelineDay"
    });

    var appointments = this.instance.getAppointmentsInstance();

    assert.equal(appointments.option("renderingStrategy"), "horizontal", "Strategy is OK");

    this.instance.option("currentView", "timelineWeek");
    assert.equal(appointments.option("renderingStrategy"), "horizontal", "Strategy is OK");

    this.instance.option("currentView", "timelineWorkWeek");
    assert.equal(appointments.option("renderingStrategy"), "horizontal", "Strategy is OK");

    this.instance.option("currentView", "timelineMonth");
    assert.equal(appointments.option("renderingStrategy"), "horizontalMonthLine", "Strategy is OK");
});

QUnit.test("Scheduler should not update scroll position if appointment is visible, timeline day view ", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "timelineDay",
        height: 500
    });

    var appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: "caption" },
        workSpace = this.instance.element().find(".dx-scheduler-work-space").dxSchedulerTimelineDay("instance"),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.notOk(scrollToTimeSpy.calledOnce, "scrollToTime was not called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should not update scroll position if appointment is visible, timeline week view ", function(assert) {
    this.createInstance({
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

    var scrollable = this.instance.element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");
    scrollable.scrollTo({ left: 10000 });

    var appointment = { startDate: new Date(2015, 2, 6, 6), endDate: new Date(2015, 2, 6, 8), text: "caption" },
        workSpace = this.instance.element().find(".dx-scheduler-work-space").dxSchedulerTimelineWeek("instance"),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.notOk(scrollToTimeSpy.calledOnce, "scrollToTime was not called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment is not visible, timeline week view ", function(assert) {
    this.createInstance({
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

    var scrollable = this.instance.element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");
    scrollable.scrollTo({ left: 2000 });

    var appointment = { startDate: new Date(2015, 2, 6, 6), endDate: new Date(2015, 2, 6, 8), text: "caption" },
        workSpace = this.instance.element().find(".dx-scheduler-work-space").dxSchedulerTimelineWeek("instance"),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should not update scroll position if appointment is visible, timeline month view ", function(assert) {
    this.createInstance({
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

    var scrollable = this.instance.element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");
    scrollable.scrollTo({ left: 12000 });

    var appointment = { startDate: new Date(2015, 2, 29, 6), endDate: new Date(2015, 2, 29, 8), text: "caption" },
        workSpace = this.instance.element().find(".dx-scheduler-work-space").dxSchedulerTimelineMonth("instance"),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.notOk(scrollToTimeSpy.calledOnce, "scrollToTime was not called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment is not visible, timeline month view ", function(assert) {
    this.createInstance({
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

    var scrollable = this.instance.element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");
    scrollable.scrollTo({ left: 1000 });

    var appointment = { startDate: new Date(2015, 2, 29, 6), endDate: new Date(2015, 2, 29, 8), text: "caption" },
        workSpace = this.instance.element().find(".dx-scheduler-work-space").dxSchedulerTimelineMonth("instance"),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Appointments should have a right order on timeline month(lots of appts)", function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 2),
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

    var $appointments = this.instance.element().find(".dx-scheduler-appointment");

    assert.roughEqual(translator.locate($appointments.eq(0)).top, 0, 2.001, "Appointment position is OK");
    assert.roughEqual(translator.locate($appointments.eq(1)).top, 100, 2.001, "Appointment position is OK");
    assert.roughEqual(translator.locate($appointments.eq(2)).top, 200, 2.001, "Appointment position is OK");
    assert.roughEqual(translator.locate($appointments.eq(3)).top, 300, 2.001, "Appointment position is OK");
});

QUnit.test("Appointments should have a right order on timeline month", function(assert) {
    this.createInstance({
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

    var $appointments = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointments.eq(0).data("dxItemData").text, "b", "Appointment data is OK");
    assert.equal($appointments.eq(1).data("dxItemData").text, "a", "Appointment data is OK");
});
