var $ = require("jquery"),
    themes = require("ui/themes"),
    dateSerialization = require("core/utils/date_serialization");

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require("common.css!");
require("generic_light.css!");


var Tooltip = require("ui/tooltip"),
    tooltip = require("ui/tooltip/ui.tooltip"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    fx = require("animation/fx"),
    dateLocalization = require("localization/date"),
    messageLocalization = require("localization/message"),
    DataSource = require("data/data_source/data_source").DataSource,
    appointmentTooltip = require("ui/scheduler/ui.scheduler.appointment_tooltip"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    dataUtils = require("core/element_data");

require("ui/scheduler/ui.scheduler");

function getDeltaTz(schedulerTz, date) {
    var defaultTz = date.getTimezoneOffset() * 60000;
    return schedulerTz * 3600000 + defaultTz;
}

QUnit.module("Integration: Appointment tooltip", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler($.extend(options, { height: 600 })).dxScheduler("instance");
        };

        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
        tooltip.hide();
        this.clock.restore();
    }
});

QUnit.test("Click on appointment should call scheduler.showAppointmentTooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    var stub = sinon.stub(this.instance, "showAppointmentTooltip");

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    assert.deepEqual(stub.getCall(0).args[0],
        {
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0),
            text: "Task 2"
        },
        "showAppointmentTooltip has a right arguments");

    tooltip.hide();
});

QUnit.test("Click on disabled appointment should not call scheduler.showAppointmentTooltip", function(assert) {
    var data = new DataSource({
        store: [{
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0),
            text: "Task 2",
            disabled: true
        }]
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    var stub = sinon.stub(this.instance, "showAppointmentTooltip");

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    assert.notOk(stub.called, "showAppointmentTooltip doesn't called");

    tooltip.hide();
});


QUnit.test("Click on appointment should not call scheduler.showAppointmentTooltip for disabled mode", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, disabled: true });
    var stub = sinon.stub(this.instance, "showAppointmentTooltip");

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    assert.equal(stub.calledOnce, false, "Observer was not notified");
});

QUnit.test("Shown tooltip should have right boundary", function(assert) {
    var tasks = [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 11, 0, 30),
                allDay: true
            }
        ],
        data = new DataSource({
            store: tasks
        });
    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    var $firstAppointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1),
        firstItemData = dataUtils.data($firstAppointment[0], "dxItemData");

    this.instance.showAppointmentTooltip(firstItemData, $firstAppointment);
    assert.deepEqual(Tooltip.getInstance($(".dx-tooltip")).option("position").boundary.get(0), this.instance.getWorkSpace().$element().find(".dx-scrollable-container").get(0), "Boundary is correct");

    var $secondAppointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        secondItemData = dataUtils.data($secondAppointment[0], "dxItemData");

    this.instance.showAppointmentTooltip(secondItemData, $secondAppointment);
    assert.deepEqual(Tooltip.getInstance($(".dx-tooltip")).option("position").boundary.get(0), $(this.instance.$element()).get(0), "Boundary of allDay appointment is correct");
});

QUnit.test("'rtlEnabled' option value should be passed to appointmentTooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, rtlEnabled: true });
    this.clock.tick();

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    assert.equal(Tooltip.getInstance($(".dx-tooltip")).option("rtlEnabled"), true, "rtlEnabled for tooltip was set to true");

    tooltip.hide();
});

QUnit.test("Scheduler appointment tooltip should has right content", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip");

    assert.equal($tooltip.length, 1, "one tooltip was shown");

    assert.equal($tooltip.find(".dx-scheduler-appointment-tooltip-title").text(), "Task 2", "tooltip title is correct");

    var $dates = $tooltip.find(".dx-scheduler-appointment-tooltip-date");
    assert.equal($dates.length, 1, "dates container was rendered");

    var $buttons = $tooltip.find(".dx-scheduler-appointment-tooltip-buttons");
    assert.equal($buttons.length, 1, "buttons container was rendered");

    tooltip.hide();
});

QUnit.test("Scheduler appointment tooltip should has right content when appointmentTooltipTemplate is used", function(assert) {
    var tasks = this.tasks;
    var data = new DataSource({
        store: tasks
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        appointmentTooltipTemplate: function() {
            assert.deepEqual(arguments[0], tasks[1], "data is right");
            return $("<div>").addClass("new-scheduler-tooltip-template");
        }
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".new-scheduler-tooltip-template");

    assert.equal($tooltip.length, 1, "one tooltip with template was shown");

    tooltip.hide();
});

QUnit.test("Scheduler appointment tooltip dates are displayed with right format, date/week views", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: "day" });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), "11:00 AM - 12:00 PM", "dates and time were displayed correctly");
    tooltip.hide();
});

QUnit.test("Scheduler tooltip should be closed after call hideAppointmentTooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: "day" });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    assert.equal($(".dx-scheduler-appointment-tooltip").length, 1, "tooltip is shown");
    this.instance.hideAppointmentTooltip();
    assert.equal($(".dx-scheduler-appointment-tooltip").length, 0, "tooltip is hidden");
});

QUnit.test("Appointment Tooltip on Day view should have a right dates", function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: new Date(2016, 9, 5, 23, 30),
            endDate: new Date(2016, 9, 6, 1),
            text: "new Date sample"
        }],
        currentDate: new Date(2016, 9, 6),
        views: ["day"],
        currentView: "day",
        cellDuration: 60
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), "October 5, 11:30 PM - October 6, 1:00 AM", "dates and time were displayed correctly");
    tooltip.hide();
});

QUnit.test("Scheduler appointment tooltip dates should be correct, when custom timeZone is set", function(assert) {
    var startDate = new Date(2015, 1, 9, 11),
        endDate = new Date(2015, 1, 9, 12),
        data = new DataSource({
            store: [{
                text: "Task 2",
                startDate: startDate,
                endDate: endDate
            }]
        });

    var deltaTz = getDeltaTz(5, startDate);
    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: "week", timeZone: 5 });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date"),
        expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), "shorttime"),
        expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), "shorttime");

    assert.equal($date.text(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");
});

QUnit.test("Scheduler appointment tooltip dates should be correct, when custom timeZone is set as string", function(assert) {
    var startDate = new Date(2015, 1, 9, 11),
        endDate = new Date(2015, 1, 9, 12),
        appointment = {
            text: "Task 2",
            startDate: startDate,
            endDate: endDate
        };

    var data = new DataSource({
        store: [appointment]
    });
    var deltaTz = getDeltaTz(5, startDate);
    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: "week", timeZone: "Asia/Ashkhabad" });

    this.instance.showAppointmentTooltip(appointment, ".dx-scheduler-appointment");

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date"),
        expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), "shorttime"),
        expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), "shorttime");

    assert.equal($date.text(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");
});

QUnit.test("Scheduler appointment tooltip dates should be correct, when appointment timeZone is set", function(assert) {
    var appointment = {
        text: "Task",
        startDate: new Date(2015, 1, 9, 11),
        endDate: new Date(2015, 1, 9, 12),
        startDateTimeZone: 'Asia/Ashkhabad', // +5
        endDateTimeZone: 'Asia/Bishkek', // +6
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [appointment],
        currentView: "week"
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0);

    this.instance.showAppointmentTooltip(appointment, $appointment);
    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date"),
        expectedStartDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(),
        expectedEndDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(2).text();

    assert.equal($date.text(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");
    tooltip.hide();
});

QUnit.test("Scheduler appointment tooltip dates should be correct, when appointment timeZone and scheduler timeZone was set", function(assert) {
    var appointment = {
        text: "Task",
        startDate: new Date(2015, 1, 9, 11),
        endDate: new Date(2015, 1, 9, 12),
        Timezone: "Asia/Ashkhabad"
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [appointment],
        currentView: "week",
        startDateTimezoneExpr: "Timezone",
        timeZone: "Asia/Qyzylorda"
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0);
    this.instance.showAppointmentTooltip(appointment, $appointment);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date"),
        expectedStartDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(),
        expectedEndDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(2).text();

    assert.equal($date.text(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");

});

QUnit.test("Scheduler appointment tooltip dates are displayed with right format, month view", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: "month", maxAppointmentsPerCell: null });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), "February 9, 11:00 AM - 12:00 PM", "dates and time were displayed correctly");
    tooltip.hide();
});

QUnit.test("Click on tooltip-edit button should call scheduler.showAppointmentPopup and hide tooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data
    });

    var stub = sinon.stub(this.instance, "showAppointmentPopup");

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip");
    $tooltip.find(".dx-scheduler-appointment-tooltip-buttons").find(".dx-button").eq(1).trigger("dxclick");

    var args = stub.getCall(0).args;

    assert.deepEqual(args[0], {
        startDate: new Date(2015, 1, 9, 11, 0),
        endDate: new Date(2015, 1, 9, 12, 0),
        text: "Task 2"
    },
    "showAppointmentPopup has a right appointment data arg");

    assert.equal(args[1], false, "showAppointmentPopup has a right 'createNewAppointment' arg");

    assert.equal($(".dx-scheduler-appointment-tooltip").length, 0, "tooltip was hidden");
});

QUnit.test("Click on tooltip-remove button should call scheduler.deleteAppointment and hide tooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    var stub = sinon.stub(this.instance, "deleteAppointment");

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip");
    $tooltip.find(".dx-scheduler-appointment-tooltip-buttons").find(".dx-button").eq(0).trigger("dxclick");

    assert.deepEqual(stub.getCall(0).args[0],
        {
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0),
            text: "Task 2"
        },
        "deleteAppointment has a right arguments");

    assert.equal($(".dx-scheduler-appointment-tooltip").length, 0, "tooltip was hidden");

});

QUnit.test("Click on tooltip-remove button should call scheduler.updateAppointment and hide tooltip, if recurrenceRuleExpr and recurrenceExceptionExpr is set", function(assert) {
    this.createInstance({
        currentDate: new Date(2018, 6, 30),
        currentView: "month",
        views: ["month"],
        recurrenceRuleExpr: "SC_RecurrenceRule",
        recurrenceExceptionExpr: "SC_RecurrenceException",
        recurrenceEditMode: "occurrence",
        dataSource: [{
            text: "Meeting of Instructors",
            startDate: new Date(2018, 6, 30, 10, 0),
            endDate: new Date(2018, 6, 30, 11, 0),
            SC_RecurrenceRule: "FREQ=DAILY;COUNT=3",
            SC_RecurrenceException: "20170626T100000Z"
        }
        ]
    });
    var stub = sinon.stub(this.instance, "_updateAppointment");

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip");
    $tooltip.find(".dx-scheduler-appointment-tooltip-buttons").find(".dx-button").eq(0).trigger("dxclick");

    var exceptionDate = new Date(2018, 6, 31, 10, 0, 0, 0),
        exceptionString = dateSerialization.serializeDate(exceptionDate, "yyyyMMddTHHmmssZ");

    assert.deepEqual(stub.getCall(0).args[1],
        {
            startDate: new Date(2018, 6, 30, 10, 0),
            endDate: new Date(2018, 6, 30, 11, 0),
            text: "Meeting of Instructors",
            SC_RecurrenceRule: "FREQ=DAILY;COUNT=3",
            SC_RecurrenceException: "20170626T100000Z," + exceptionString
        },
        "updateAppointment has a right arguments");

    assert.equal($(".dx-scheduler-appointment-tooltip").length, 0, "tooltip was hidden");

});

QUnit.test("Tooltip should appear if mouse is over arrow icon", function(assert) {
    var endDate = new Date(2015, 9, 12);

    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        views: ["month"],
        currentView: "month",
        firstDayOfWeek: 1,
        dataSource: [{ startDate: new Date(2015, 4, 10), endDate: endDate }]
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment"),
        $arrowIcon = $appointment.find(".dx-scheduler-appointment-reduced-icon");

    $arrowIcon.trigger("dxpointerenter");

    var $tooltip = $(".dx-tooltip");

    assert.equal($tooltip.length, 1, "Tooltip has appeared");
    assert.equal(Tooltip.getInstance($tooltip).$content().text(), messageLocalization.format("dxScheduler-editorLabelEndDate") + ": October 12, 2015");

    $arrowIcon.trigger("dxpointerleave");
    assert.equal($(".dx-tooltip").length, 0, "Tooltip has disappeared");

    tooltip.hide();
});

QUnit.test("showAppointmentTooltip should be called after click on arrow icon and doesn't hide after pointerleave", function(assert) {
    var endDate = new Date(2015, 9, 12);

    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        views: ["month"],
        currentView: "month",
        firstDayOfWeek: 1,
        dataSource: [{ startDate: new Date(2015, 4, 10), endDate: endDate }]
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment"),
        $arrowIcon = $appointment.find(".dx-scheduler-appointment-reduced-icon");

    $arrowIcon.trigger("dxpointerenter");
    $arrowIcon.eq(0).trigger("dxclick");
    this.clock.tick(300);
    $arrowIcon.trigger("dxpointerleave");

    var $tooltip = $(".dx-scheduler-appointment-tooltip");
    assert.equal($tooltip.length, 1, "Appointment tooltip is shown");

    tooltip.hide();
});

QUnit.test("Tooltip of allDay appointment should display right dates", function(assert) {
    var startDate = new Date(2015, 2, 5, 6),
        endDate = new Date(2015, 2, 6, 7);

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "week",
        dataSource: [{
            text: "a",
            allDay: true,
            startDate: startDate,
            endDate: endDate
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), dateLocalization.format(startDate, "monthAndDay") + " - " + dateLocalization.format(endDate, "monthAndDay"), "dates were displayed correctly");
    tooltip.hide();
});

QUnit.test("Tooltip of allDay appointment with startDate = endDate should display right date", function(assert) {
    var startDate = new Date(2015, 2, 5, 6),
        endDate = new Date(2015, 2, 5, 10);

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "week",
        dataSource: [{
            text: "a",
            allDay: true,
            startDate: startDate,
            endDate: endDate
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), dateLocalization.format(startDate, "monthAndDay"), "date was displayed correctly");
    tooltip.hide();
});

QUnit.test("Tooltip of multiday appointment should display date & time for usual view", function(assert) {
    var startDate = new Date(2015, 2, 5, 6),
        endDate = new Date(2015, 2, 6, 8);

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: startDate,
            endDate: endDate
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), dateLocalization.format(startDate, "mediumdatemediumtime") + " - " + dateLocalization.format(endDate, "mediumdatemediumtime"), "dates were displayed correctly");
    tooltip.hide();
});

QUnit.test("Tooltip of multiday appointment should display date & time for month view", function(assert) {
    var startDate = new Date(2015, 2, 5, 6),
        endDate = new Date(2015, 2, 6, 8);

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "month",
        dataSource: [{
            text: "a",
            startDate: startDate,
            endDate: endDate
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), dateLocalization.format(startDate, "mediumdatemediumtime") + " - " + dateLocalization.format(endDate, "mediumdatemediumtime"), "dates were displayed correctly");
    tooltip.hide();
});

QUnit.test("Tooltip of appointment part after midnight should display right date & time", function(assert) {
    var startDate = new Date(2015, 4, 25, 23, 0),
        endDate = new Date(2015, 4, 26, 1, 15);

    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: startDate,
            endDate: endDate
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), dateLocalization.format(startDate, "mediumdatemediumtime") + " - " + dateLocalization.format(endDate, "mediumdatemediumtime"), "dates were displayed correctly");
    tooltip.hide();
});

QUnit.test("Tooltip of recurrence appointment part after midnight should display right date & time", function(assert) {
    var startDate = new Date(2015, 4, 25, 23, 0),
        endDate = new Date(2015, 4, 26, 1, 15);

    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        currentView: "month",
        dataSource: [{
            text: "a",
            startDate: startDate,
            endDate: endDate,
            recurrenceRule: "FREQ=DAILY;INTERVAL=5"
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(2).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), "May 30, 11:00 PM - May 31, 1:15 AM", "dates were displayed correctly");
    tooltip.hide();
});

QUnit.test("Tooltip for recurrence appointment should display right dates(T384181)", function(assert) {
    var startDate = new Date(2015, 1, 5, 11),
        endDate = new Date(2015, 1, 5, 12);

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["month"],
        currentView: "month",
        dataSource: [{
            text: "a",
            startDate: startDate,
            endDate: endDate,
            recurrenceRule: "FREQ=DAILY"
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");

    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip"),
        $date = $tooltip.find(".dx-scheduler-appointment-tooltip-date");

    assert.equal($date.text(), "February 6, 11:00 AM - 12:00 PM", "dates and time were displayed correctly");
    tooltip.hide();
});


QUnit.test("Tooltip should hide when window was resized", function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 11),
        currentView: "week",
        dataSource: [{
            text: "a",
            allDay: true,
            startDate: new Date(2016, 1, 11, 10),
            endDate: new Date(2016, 1, 11, 15)
        }]
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip");
    assert.equal($tooltip.length, 1, "tooltip was shown");

    resizeCallbacks.fire();
    $tooltip = $(".dx-scheduler-appointment-tooltip");
    assert.equal($tooltip.length, 0, "tooltip was hidden");
});

QUnit.test("Tooltip for the same appointment should not be rendered twice if it already exists", function(assert) {
    var appt1 = {
            text: "a",
            allDay: true,
            startDate: new Date(2016, 1, 11, 10),
            endDate: new Date(2016, 1, 11, 15)
        }, appt2 = {
            text: "b",
            allDay: true,
            startDate: new Date(2016, 1, 11, 10),
            endDate: new Date(2016, 1, 11, 15)
        };
    this.createInstance({
        currentDate: new Date(2016, 1, 11),
        currentView: "week",
        dataSource: [appt1, appt2]
    });

    var $appt1 = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        $appt2 = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1);

    this.instance.showAppointmentTooltip(appt1, $appt1);
    var tooltip = appointmentTooltip._tooltip;
    this.instance.showAppointmentTooltip(appt1, $appt1);

    assert.equal(tooltip, appointmentTooltip._tooltip);

    this.instance.showAppointmentTooltip(appt2, $appt2);
    assert.notEqual(tooltip, appointmentTooltip._tooltip);
});

QUnit.test("Appointment tooltip should be hidden after immediately delete key pressing", function(assert) {
    var appt = {
        text: "a",
        allDay: true,
        startDate: new Date(2016, 1, 11, 10),
        endDate: new Date(2016, 1, 11, 15)
    };

    this.createInstance({
        currentDate: new Date(2016, 1, 11),
        currentView: "week",
        dataSource: [appt],
        focusStateEnabled: true
    });

    var $appt1 = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        keyboard = keyboardMock($appt1),
        notifyStub = sinon.spy(this.instance.getAppointmentsInstance(), "notifyObserver");

    $appt1.trigger("dxclick");
    keyboard.keyDown("del");
    this.clock.tick(300);

    assert.ok(notifyStub.called, "notify is called");
    assert.ok(notifyStub.withArgs("deleteAppointment").called, "deleteAppointment is called");
    assert.notOk(notifyStub.withArgs("showAppointmentTooltip").called, "showAppointmentTooltip isn't called");
});


QUnit.test("Scheduler appointment tooltip should has right content in Material theme", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltip = $(".dx-scheduler-appointment-tooltip");

    var $buttons = $tooltip.find(".dx-scheduler-appointment-tooltip-buttons");
    assert.equal($buttons.length, 1, "buttons container was rendered");

    var $openButton = $tooltip.find(".dx-scheduler-appointment-tooltip-open-button");
    assert.equal($openButton.length, 1, "open button was rendered");

    var $closeButton = $tooltip.find(".dx-scheduler-appointment-tooltip-close-button");
    assert.equal($closeButton.length, 1, "open button was rendered");

    var $deleteButton = $tooltip.find(".dx-scheduler-appointment-tooltip-delete-button");
    assert.equal($deleteButton.length, 1, "open button was rendered");

    var $tooltipContainers = $(".dx-scheduler-appointment-tooltip > div");
    assert.ok($tooltipContainers.eq(0).hasClass("dx-scheduler-appointment-tooltip-buttons"), "first container - buttons container");
    assert.ok($tooltipContainers.eq(1).hasClass("dx-scheduler-appointment-tooltip-title"), "second container - title container");
    assert.ok($tooltipContainers.eq(2).hasClass("dx-scheduler-appointment-tooltip-date"), "third container - date container");

    tooltip.hide();

    themes.isMaterial = origIsMaterial;
});


QUnit.test("Scheduler appointment tooltip should has buttons at the bottom in generic theme", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    var $tooltipContainers = $(".dx-scheduler-appointment-tooltip > div");
    assert.ok($tooltipContainers.eq(0).hasClass("dx-scheduler-appointment-tooltip-title"), "first container - title container");
    assert.ok($tooltipContainers.eq(1).hasClass("dx-scheduler-appointment-tooltip-date"), "second container - date container");
    assert.ok($tooltipContainers.eq(2).hasClass("dx-scheduler-appointment-tooltip-buttons"), "third container - buttons container");

    tooltip.hide();
});

QUnit.test("Tooltip should has right boundary in timeline view if appointment is allDay", function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: new Date(2018, 8, 24),
            endDate: new Date(2018, 8, 25)
        }],
        currentView: "timelineDay",
        currentDate: new Date(2018, 8, 24)
    });

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var tooltip = Tooltip.getInstance($(".dx-tooltip")),
        tooltipBoundary = tooltip.option("position").boundary.get(0),
        containerBoundary = this.instance.getWorkSpaceScrollableContainer().get(0);

    assert.deepEqual(tooltipBoundary, containerBoundary, "tooltip has right boundary");
});
