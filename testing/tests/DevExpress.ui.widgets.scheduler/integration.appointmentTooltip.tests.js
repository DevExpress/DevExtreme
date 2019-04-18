import $ from "jquery";
import dateSerialization from "core/utils/date_serialization";
import Tooltip from "ui/tooltip";
import tooltip from "ui/tooltip/ui.tooltip";
import resizeCallbacks from "core/utils/resize_callbacks";
import fx from "animation/fx";
import dateLocalization from "localization/date";
import messageLocalization from "localization/message";
import { DataSource } from "data/data_source/data_source";
import keyboardMock from "../../helpers/keyboardMock.js";
import devices from "core/devices";
import dataUtils from "core/element_data";
import { SchedulerTestWrapper, tooltipHelper, appointmentsHelper, appointmentPopupHelper } from './helpers.js';
import { getSimpleDataArray } from './data.js';

import "common.css!";
import "generic_light.css!";
import "ui/scheduler/ui.scheduler";

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

const getDeltaTz = (schedulerTz, date) => schedulerTz * 3600000 + date.getTimezoneOffset() * 60000;

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
    },

    checkAppointmentDataInTooltipTemplate: function(assert, dataSource, currentDate) {
        this.createInstance({
            dataSource: dataSource,
            height: 600,
            currentDate: currentDate,
            currentView: "month",
            views: ["month"],
            appointmentTooltipTemplate: appointmentData => {
                assert.equal(dataSource.indexOf(appointmentData), 0, "appointment data contains in the data source");
            }
        });

        appointmentsHelper.click(0);
        this.clock.tick(300);
    }
});

QUnit.test("There is no need to check recurring appointment if editing.allowUpdating is false", function(assert) {
    this.createInstance({
        editing: {
            allowUpdating: false
        },
        currentDate: new Date(2015, 5, 15),
        firstDayOfWeek: 1,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 5, 15, 10),
            endDate: new Date(2015, 5, 15, 10, 30),
            recurrenceRule: "FREQ=MONTHLY"
        }]
    });

    const $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").first()),
        itemData = dataUtils.data($appointment[0], "dxItemData");

    this.instance.showAppointmentTooltip(itemData, $appointment);

    tooltipHelper.clickOnItem();
    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Popup is rendered instead of recurrence tooltip");
});

QUnit.test("Delete button should not exist if editing.allowUpdating is false", function(assert) {
    this.createInstance({
        editing: {
            allowDeleting: false
        },
        currentDate: new Date(2015, 5, 15),
        firstDayOfWeek: 1,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 5, 15, 10),
            endDate: new Date(2015, 5, 15, 10, 30)
        }]
    });

    const $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").first()),
        itemData = dataUtils.data($appointment[0], "dxItemData");

    this.instance.showAppointmentTooltip(itemData, $appointment);
    assert.notOk(tooltipHelper.hasDeleteButton(), "Delete button should not exist");
});

QUnit.test("Click on appointment should call scheduler.showAppointmentTooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    var stub = sinon.stub(this.instance, "showAppointmentTooltip");

    appointmentsHelper.click(1);
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

    appointmentsHelper.click(0);
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

    appointmentsHelper.click(1);
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

    appointmentsHelper.click(1);
    this.clock.tick(300);

    assert.equal(Tooltip.getInstance($(".dx-tooltip")).option("rtlEnabled"), true, "rtlEnabled for tooltip was set to true");

    tooltip.hide();
});

QUnit.test("Scheduler appointment tooltip should has right content", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    appointmentsHelper.click(1);
    this.clock.tick(300);

    assert.ok(tooltipHelper.getContentElement().length, 1, "one tooltip was shown");
    assert.equal(tooltipHelper.getTitleText(), "Task 2", "tooltip title is correct");
    assert.equal(tooltipHelper.getDateElement().length, 1, "dates container was rendered");
    assert.equal(tooltipHelper.hasDeleteButton(), 1, "buttons container was rendered");
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

    appointmentsHelper.click(1);
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

    appointmentsHelper.click(1);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), "11:00 AM - 12:00 PM", "dates and time were displayed correctly");
});

QUnit.test("Scheduler tooltip should be closed after call hideAppointmentTooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: "day" });

    appointmentsHelper.click(1);
    this.clock.tick(300);

    assert.ok(tooltipHelper.isVisible(), "tooltip is shown");

    this.instance.hideAppointmentTooltip();

    this.clock.tick(300);
    assert.notOk(tooltipHelper.isVisible(), "tooltip is hidden");
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

    appointmentsHelper.click(0);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), "October 5, 11:30 PM - October 6, 1:00 AM", "dates and time were displayed correctly");
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

    appointmentsHelper.click(0);
    this.clock.tick(300);

    const expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), "shorttime"),
        expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), "shorttime");

    assert.equal(tooltipHelper.getDateText(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");
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

    const expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), "shorttime"),
        expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), "shorttime");

    assert.equal(tooltipHelper.getDateText(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");
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

    const expectedStartDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(),
        expectedEndDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(2).text();

    assert.equal(tooltipHelper.getDateText(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");
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

    const expectedStartDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(),
        expectedEndDate = $appointment.find(".dx-scheduler-appointment-content-date").eq(2).text();

    assert.equal(tooltipHelper.getDateText(), expectedStartDate + " - " + expectedEndDate, "dates and time were displayed correctly");
});

QUnit.test("Scheduler appointment tooltip dates are displayed with right format, month view", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: "month", maxAppointmentsPerCell: null });

    appointmentsHelper.click(1);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), "February 9, 11:00 AM - 12:00 PM", "dates and time were displayed correctly");
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

    appointmentsHelper.click(1);
    this.clock.tick(300);

    tooltipHelper.clickOnItem();

    var args = stub.getCall(0).args;

    assert.deepEqual(args[0], {
        startDate: new Date(2015, 1, 9, 11, 0),
        endDate: new Date(2015, 1, 9, 12, 0),
        text: "Task 2"
    },
    "showAppointmentPopup has a right appointment data arg");

    assert.equal(args[1], false, "showAppointmentPopup has a right 'createNewAppointment' arg");

    assert.notOk(tooltipHelper.isVisible(), "tooltip was hidden");
});

QUnit.test("Click on tooltip-remove button should call scheduler.deleteAppointment and hide tooltip", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    var stub = sinon.stub(this.instance, "deleteAppointment");

    appointmentsHelper.click(1);
    this.clock.tick(300);

    tooltipHelper.clickOnDeleteButton();

    assert.deepEqual(stub.getCall(0).args[0],
        {
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0),
            text: "Task 2"
        },
        "deleteAppointment has a right arguments");

    assert.notOk(tooltipHelper.isVisible(), "tooltip was hidden");
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

    appointmentsHelper.click(1);
    this.clock.tick(300);

    tooltipHelper.clickOnDeleteButton();

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

    assert.notOk(tooltipHelper.isVisible(), "tooltip was hidden");

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

    assert.ok(tooltipHelper.isVisible(), "Appointment tooltip is shown");
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

    appointmentsHelper.click(0);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), dateLocalization.format(startDate, "monthAndDay") + " - " + dateLocalization.format(endDate, "monthAndDay"), "dates were displayed correctly");
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

    appointmentsHelper.click(0);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), dateLocalization.format(startDate, "monthAndDay"), "date was displayed correctly");
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

    appointmentsHelper.click(0);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), dateLocalization.format(startDate, "mediumdatemediumtime") + " - " + dateLocalization.format(endDate, "mediumdatemediumtime"), "dates were displayed correctly");
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

    appointmentsHelper.click(0);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), dateLocalization.format(startDate, "mediumdatemediumtime") + " - " + dateLocalization.format(endDate, "mediumdatemediumtime"), "dates were displayed correctly");
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

    appointmentsHelper.click(1);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), dateLocalization.format(startDate, "mediumdatemediumtime") + " - " + dateLocalization.format(endDate, "mediumdatemediumtime"), "dates were displayed correctly");
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

    appointmentsHelper.click(2);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), "May 30, 11:00 PM - May 31, 1:15 AM", "dates were displayed correctly");
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

    appointmentsHelper.click(1);
    this.clock.tick(300);

    assert.equal(tooltipHelper.getDateText(), "February 6, 11:00 AM - 12:00 PM", "dates and time were displayed correctly");
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

    appointmentsHelper.click();
    this.clock.tick(300);

    assert.ok(tooltipHelper.isVisible(), "tooltip was shown");
    resizeCallbacks.fire();
    assert.notOk(tooltipHelper.isVisible(), "tooltip was hidden");
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

QUnit.test("Tooltip should has right boundary in timeline view if appointment is allDay", function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: new Date(2018, 8, 24),
            endDate: new Date(2018, 8, 25)
        }],
        currentView: "timelineDay",
        currentDate: new Date(2018, 8, 24)
    });

    appointmentsHelper.click(0);
    this.clock.tick(300);

    var tooltip = Tooltip.getInstance($(".dx-tooltip")),
        tooltipBoundary = tooltip.option("position").boundary.get(0),
        containerBoundary = this.instance.getWorkSpaceScrollableContainer().get(0);

    assert.deepEqual(tooltipBoundary, containerBoundary, "tooltip has right boundary");
});

QUnit.test("the targetedAppointmentData parameter appends to arguments of the appointment tooltip template for a recurrence rule", function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: new Date(2015, 4, 24, 9),
            endDate: new Date(2015, 4, 24, 11),
            allDay: true,
            recurrenceRule: "FREQ=DAILY;COUNT=3",
            text: "Task 2"
        }],
        height: 600,
        currentDate: new Date(2015, 4, 24),
        currentView: "month",
        views: ["month"],
        appointmentTooltipTemplate: function(data, index, targetedAppointmentData) {
            assert.deepEqual(targetedAppointmentData, {
                allDay: true,
                endDate: new Date(2015, 4, 25, 11),
                recurrenceRule: "FREQ=DAILY;COUNT=3",
                startDate: new Date(2015, 4, 25, 9),
                text: "Task 2"
            });
        }
    });

    appointmentsHelper.click(1);
    this.clock.tick(300);
});

QUnit.test("the targetedAppointmentData parameter appends to arguments of the appointment tooltip template for a non-recurrence rule", function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: new Date(2015, 4, 24, 9),
            endDate: new Date(2015, 4, 24, 11),
            text: "Task 1"
        }],
        height: 600,
        currentDate: new Date(2015, 4, 24),
        currentView: "month",
        views: ["month"],
        appointmentTooltipTemplate: function(data, index, targetedAppointmentData) {
            assert.deepEqual(targetedAppointmentData, {
                startDate: new Date(2015, 4, 24, 9),
                endDate: new Date(2015, 4, 24, 11),
                text: "Task 1"
            });
        }
    });

    appointmentsHelper.click(0);
    this.clock.tick(300);
});

QUnit.test("The appointmentData argument of the appointment tooltip template is should be instance of the data source", function(assert) {
    this.checkAppointmentDataInTooltipTemplate(assert, this.tasks, new Date(2015, 1, 9));
});

QUnit.test("The appointmentData argument of the appointment tooltip template is should be instance of the data source for recurrence rule", function(assert) {
    var dataSource = [{
        startDate: new Date(2015, 4, 24, 9),
        endDate: new Date(2015, 4, 24, 11),
        recurrenceRule: "FREQ=DAILY;COUNT=3",
        allDay: true,
        text: "Task 1"
    }, {
        startDate: new Date(2015, 4, 24, 19),
        endDate: new Date(2015, 4, 24, 31),
        allDay: true,
        recurrenceRule: "FREQ=DAILY;COUNT=2",
        text: "Task 2"
    }];

    this.checkAppointmentDataInTooltipTemplate(assert, dataSource, new Date(2015, 4, 24));
});


const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        this.createInstance = function(options) {
            this.data = getSimpleDataArray();
            const defaultOption = {
                dataSource: this.data,
                views: ["agenda", "day", "week", "workWeek", "month"],
                currentView: "month",
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                height: 600,
            };
            this.instance = $("#scheduler").dxScheduler($.extend(defaultOption, options)).dxScheduler("instance");
            this.scheduler = new SchedulerTestWrapper(this.instance);
        };

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    },
};

QUnit.module("New common tooltip for compact and cell appointments", moduleConfig, function() {
    QUnit.test("Title in tooltip should equals title of cell appointments in month view", function(assert) {
        this.createInstance();
        assert.notOk(tooltipHelper.isVisible(), "On page load tooltip should be invisible");

        for(let i = 0; i < appointmentsHelper.getAppointmentCount(); i++) {
            appointmentsHelper.click(i);
            assert.equal(tooltipHelper.getTitleText(), appointmentsHelper.getTitleText(i), "Title in tooltip should be equal with appointment");
        }

        const compactAppointmentSample = [
            ["Install New Router in Dev Room"],
            ["New Brochures"],
            ["Upgrade Personal Computers"],
            ["Brochure Design Review"],
            ["Upgrade Server Hardware", "Submit New Website Design"]
        ];

        for(let i = 0; i < appointmentsHelper.compact.getButtonCount(); i++) {
            const compactAppointmentSampleItem = compactAppointmentSample[i];
            appointmentsHelper.compact.click(i);

            assert.equal(appointmentsHelper.compact.getButtonText(i), `${compactAppointmentSampleItem.length} more`, "Count of compact appointments in button is match of count real appointments");

            compactAppointmentSampleItem.forEach((sampleTitle, index) => {
                assert.equal(tooltipHelper.getTitleText(index), sampleTitle, "Title in tooltip should be equal with sample data");
            });
        }
    });

    QUnit.test("Title in tooltip should equals title of cell appointments in other views", function(assert) {
        this.createInstance();
        assert.notOk(tooltipHelper.isVisible(), "On page load tooltip should be invisible");

        const views = ["week", "day", "workWeek", "agenda"];
        const testTitles = () => {
            for(let i = 0; i < appointmentsHelper.getAppointmentCount(); i++) {
                appointmentsHelper.click(i);
                assert.equal(tooltipHelper.getTitleText(), appointmentsHelper.getTitleText(i), "Title in tooltip should be equal with appointment");
            }
        };

        views.forEach(viewValue => {
            this.instance.option("currentView", viewValue);
            testTitles();
        });
    });

    QUnit.test("Delete button in tooltip shouldn't render if editing = false", function(assert) {
        this.createInstance({
            editing: false
        });

        for(let i = 0; i < appointmentsHelper.getAppointmentCount(); i++) {
            appointmentsHelper.click(i);
            assert.notOk(tooltipHelper.hasDeleteButton(), "Delete button shouldn't render");
        }

        for(let i = 0; i < appointmentsHelper.compact.getButtonCount(); i++) {
            appointmentsHelper.compact.click(i);
            assert.notOk(tooltipHelper.hasDeleteButton(), "Delete button shouldn't render for compact appointments");
        }

        this.instance.option("editing", true);

        for(let i = 0; i < appointmentsHelper.getAppointmentCount(); i++) {
            appointmentsHelper.click(i);
            assert.ok(tooltipHelper.hasDeleteButton(), "Delete button should be render");
        }
    });

    QUnit.test("Compact button should hide or show after change in data source", function(assert) {
        this.createInstance();

        assert.equal(appointmentsHelper.compact.getButtonText(), "1 more", "Value on init should be correct");
        assert.equal(appointmentsHelper.compact.getButtonCount(), 5, "Count of compact buttons on init should be correct");

        this.instance.deleteAppointment(this.data[0]);
        assert.equal(appointmentsHelper.compact.getButtonCount(), 4, "Count of compact buttons should be reduce after delete appointment");

        this.instance.addAppointment({
            text: "Temp appointment",
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        });
        assert.equal(appointmentsHelper.compact.getButtonText(), "1 more", "Count of compact buttons should be increase after add appointment");
        assert.equal(appointmentsHelper.compact.getButtonCount(), 5, "Count of compact buttons should be increase after add appointment");

        this.instance.addAppointment({
            text: "Temp appointment 2",
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        });
        assert.equal(appointmentsHelper.compact.getButtonText(), "2 more", "Count of compact buttons should be increase after add appointment");
        assert.equal(appointmentsHelper.compact.getButtonCount(), 5, "Count of compact buttons shouldn't change");
    });

    QUnit.test("Tooltip should hide after perform action", function(assert) {
        this.createInstance();

        appointmentsHelper.click();
        assert.ok(tooltipHelper.isVisible(), "Tooltip should visible");

        tooltipHelper.clickOnItem();
        assert.notOk(tooltipHelper.isVisible(), "Tooltip shouldn't visible");

        appointmentPopupHelper.hide();

        appointmentsHelper.compact.click(appointmentsHelper.compact.getButtonCount() - 1);
        assert.ok(tooltipHelper.isVisible(), "Tooltip should visible");

        tooltipHelper.clickOnItem(1);
        assert.notOk(tooltipHelper.isVisible(), "Tooltip shouldn't visible");

        appointmentPopupHelper.hide();

        appointmentsHelper.compact.click(appointmentsHelper.compact.getButtonCount() - 1);
        assert.equal(tooltipHelper.getItemCount(), 2, "Count of items in tooltip should be equal 2");

        tooltipHelper.clickOnDeleteButton(1);
        assert.notOk(tooltipHelper.isVisible(), "Tooltip shouldn't visible");

        appointmentsHelper.compact.click(appointmentsHelper.compact.getButtonCount() - 1);
        assert.equal(tooltipHelper.getItemCount(), 1, "Count of items in tooltip should be equal 1");

        tooltipHelper.clickOnDeleteButton();
        assert.notOk(tooltipHelper.isVisible(), "Tooltip shouldn't visible");
    });

    QUnit.test("Tooltip should work correct in week view", function(assert) {
        const DEFAULT_TEXT = "Temp appointment";
        this.createInstance({
            currentView: "week",
            width: 600
        });

        assert.equal(appointmentsHelper.compact.getButtonCount(), 0, "Compact button shouldn't render on init");

        this.instance.addAppointment({
            text: DEFAULT_TEXT,
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        });

        assert.equal(appointmentsHelper.compact.getButtonCount(), 1, "Compact button should render");
        appointmentsHelper.compact.click();
        assert.equal(tooltipHelper.getTitleText(), DEFAULT_TEXT, "Title in tooltip should equal text in appointment cell");

        tooltipHelper.clickOnDeleteButton();
        assert.equal(appointmentsHelper.compact.getButtonCount(), 0, "Compact button shouldn't render after click delete button");
    });

    QUnit.test("Templates should valid markup", function(assert) {
        const TOOLTIP_TEMPLATE_MARKER_CLASS_NAME = "appointment-tooltip-template-marker";
        const DROP_DOWN_APPOINTMENT_TEMPLATE_CLASS_NAME = "drop-down-appointment-template";

        const hasElementInTooltipItem = (className) => {
            return tooltipHelper.getItemElement().html().indexOf(`<div class="${className}">`) !== -1;
        };

        this.createInstance({
            appointmentTooltipTemplate: () => $('<div />').addClass(TOOLTIP_TEMPLATE_MARKER_CLASS_NAME)
        });

        appointmentsHelper.click();
        assert.ok(hasElementInTooltipItem(TOOLTIP_TEMPLATE_MARKER_CLASS_NAME), "'appointmentTooltipTemplate' should render for cell appointment");

        appointmentsHelper.compact.click();
        assert.ok(hasElementInTooltipItem(TOOLTIP_TEMPLATE_MARKER_CLASS_NAME), "'appointmentTooltipTemplate' should render for compact appointment");

        this.instance.option("dropDownAppointmentTemplate", () => $('<div />').addClass(DROP_DOWN_APPOINTMENT_TEMPLATE_CLASS_NAME));

        appointmentsHelper.click();
        assert.notOk(hasElementInTooltipItem(DROP_DOWN_APPOINTMENT_TEMPLATE_CLASS_NAME), "'dropDownAppointmentTemplate' shouldn't render for cell appointment");

        appointmentsHelper.compact.click();
        assert.ok(hasElementInTooltipItem(DROP_DOWN_APPOINTMENT_TEMPLATE_CLASS_NAME), "'dropDownAppointmentTemplate' should render for compact appointment");
    });

    QUnit.test("appointmentTooltipTemplate method should pass valid arguments", function(assert) {
        let templateCallCount = 0;
        this.createInstance({
            appointmentTooltipTemplate: (appointmentData, contentElement, targetedAppointmentData, index) => {
                assert.ok($(contentElement).hasClass("dx-list-item-content"), "Content element should be list item");
                assert.equal(targetedAppointmentData.text, appointmentData.text, "targetedAppointmentData should be not empty");
                assert.equal(index, templateCallCount, "Index should be correct pass in template callback");

                templateCallCount++;
                return $('<div />').text(`template item index - ${index}`);
            }
        });

        this.scheduler.appointments.click();
        this.clock.tick(300);
        assert.ok(this.scheduler.tooltip.checkItemElementHtml(0, `template item index - ${0}`), `Template should render content contains ${0} item index`);

        templateCallCount = 0;

        const buttonCount = this.scheduler.appointments.compact.getButtonCount();
        this.scheduler.appointments.compact.click(buttonCount - 1);
        this.clock.tick(300);

        assert.ok(this.scheduler.tooltip.checkItemElementHtml(0, `template item index - ${0}`), `Template should render content contains ${0} item index. Compact appointments`);
        assert.ok(this.scheduler.tooltip.checkItemElementHtml(1, `template item index - ${1}`), `Template should render content contains ${1} item index. Compact appointments`);
    });

    if(devices.current().deviceType === "desktop") {
        QUnit.test("Keyboard navigation in tooltip", function(assert) {
            this.createInstance();
            const ITEM_FOCUSED_STATE_CLASS_NAME = "dx-state-focused";

            const checkFocusedState = index => this.scheduler.tooltip.getItemElement(index).hasClass(ITEM_FOCUSED_STATE_CLASS_NAME);

            this.scheduler.appointments.click();

            assert.notOk(checkFocusedState(0), "On first show tooltip, list item shouldn't focused");

            const keyboard = keyboardMock(this.scheduler.tooltip.getContentElement());
            keyboard.keyDown("down");

            assert.ok(checkFocusedState(0), "After press key down, list item should focused");

            const buttonCount = this.scheduler.appointments.compact.getButtonCount();
            this.scheduler.appointments.compact.click(buttonCount - 1);

            assert.notOk(checkFocusedState(0), "After tooltip showed, list item shouldn't focused");

            keyboard.keyDown("down");
            assert.ok(checkFocusedState(0), "After press key down, first list item should focused");

            keyboard.keyDown("down");
            assert.ok(checkFocusedState(1), "After press key down, second list item should focused");
        });
    }

    QUnit.test("Tooltip should crop list, if list has many items", function(assert) {
        this.createInstance({
            dataSource: [
                {
                    text: "Prepare 2015 Marketing Plan",
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: "Prepare 2015 Marketing Plan",
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: "Prepare 2015 Marketing Plan",
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: "Prepare 2015 Marketing Plan",
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: "Prepare 2015 Marketing Plan",
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: "Prepare 2015 Marketing Plan",
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }
            ]
        });

        const { getItemCount, getItemElement, getDesktopOverlayContentElement } = this.scheduler.tooltip;

        this.scheduler.appointments.compact.click();
        assert.equal(getItemCount(), 4, "Tooltip should render 4 items");

        assert.ok(getItemElement().outerHeight() * 4 > getDesktopOverlayContentElement().outerHeight(), "Tooltip height should less then list height");

        this.scheduler.instance.option("dataSource", [
            {
                text: "Prepare 2015 Marketing Plan",
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 13, 30)
            }, {
                text: "Prepare 2015 Marketing Plan",
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 13, 30)
            }, {
                text: "Prepare 2015 Marketing Plan",
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 13, 30)
            }
        ]);

        this.scheduler.appointments.compact.click();
        assert.equal(getItemCount(), 1, "Tooltip should render 1 item");
        assert.roughEqual(getItemElement().outerHeight(), getDesktopOverlayContentElement().outerHeight(), 10, "Tooltip height should equals then list height");
    });
});
