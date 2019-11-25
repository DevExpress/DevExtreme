import "common.css!";
import "generic_light.css!";

import { SchedulerTestWrapper, initTestMarkup, createWrapper } from "./helpers.js";

import $ from "jquery";
import devices from "core/devices";
import SchedulerTimezoneEditor from "ui/scheduler/timezones/ui.scheduler.timezone_editor";
import fx from "animation/fx";
import { DataSource } from "data/data_source/data_source";
import resizeCallbacks from "core/utils/resize_callbacks";

import "ui/scheduler/ui.scheduler";
import "ui/switch";

QUnit.testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

QUnit.module("Appointment popup form", moduleConfig, () => {
    const defaultData = [
        {
            text: "recurrent-app",
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule: "FREQ=DAILY;COUNT=5"
        }, {
            text: "common-app",
            startDate: new Date(2017, 4, 9, 9, 30),
            endDate: new Date(2017, 4, 9, 11),
        }
    ];

    const createScheduler = (options = {}) => {
        const defaultOption = {
            dataSource: defaultData,
            views: ["month"],
            currentView: "month",
            currentDate: new Date(2017, 4, 25),
            firstDayOfWeek: 1,
            startDayHour: 9,
            height: 600,
            width: 600
        };

        return createWrapper($.extend(defaultOption, options));
    };

    QUnit.test("onAppointmentFormOpening event should handle e.cancel value", function(assert) {
        const data = [{
            text: "Website Re-Design Plan",
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }];

        const scheduler = createScheduler({ dataSource: data });

        const testCases = [
            {
                expected: true,
                handler: undefined,
                text: "appointment popup should visible in default setting case"
            }, {
                expected: false,
                handler: e => e.cancel = true,
                text: "appointment popup should prevent visible in 'e.cancel = true' case"
            }, {
                expected: true,
                handler: e => e.cancel = false,
                text: "appointment popup should visible in 'e.cancel = false' case"
            }
        ];

        testCases.forEach(({ handler, expected, text }) => {
            scheduler.option("onAppointmentFormOpening", handler);

            scheduler.appointments.dblclick();
            assert.equal(scheduler.appointmentPopup.isRendered(), expected, text + " if call from UI");
            scheduler.instance.getAppointmentPopup().option('visible', false);

            scheduler.instance.showAppointmentPopup(data[0]);
            assert.equal(scheduler.appointmentPopup.isRendered(), expected, text + " if call showAppointmentPopup method");
            scheduler.instance.getAppointmentPopup().option('visible', false);
        });
    });

    QUnit.test("Appointment popup should work properly", function(assert) {
        const NEW_EXPECTED_SUBJECT = "NEW SUBJECT";
        const scheduler = createScheduler();

        assert.notOk(scheduler.appointmentPopup.isRendered(), "Appointment popup should be invisible in on init");

        scheduler.appointments.click(scheduler.appointments.getAppointmentCount() - 1);
        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.form.setSubject(NEW_EXPECTED_SUBJECT);

        assert.ok(scheduler.appointmentPopup.isRendered(), "Appointment popup should be visible after showAppointmentPopup method");
        scheduler.appointmentPopup.clickDoneButton();

        const dataItem = scheduler.instance.option("dataSource")[1];
        assert.equal(Object.keys(dataItem).length, 3, "In appointment properties shouldn't added excess properties");
        assert.equal(dataItem.text, NEW_EXPECTED_SUBJECT, `Text property of appointment should be changed on ${NEW_EXPECTED_SUBJECT}`);

        scheduler.appointments.click(0);
        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditSeries();

        assert.ok(scheduler.appointmentPopup.form.isRecurrenceEditorVisible(), "Recurrence editor should be visible after click on recurrence appointment");
        assert.equal(scheduler.appointmentPopup.form.getSubject(), defaultData[0].text, `Subject in form should equal selected appointment`);

        scheduler.appointmentPopup.clickDoneButton();

        scheduler.appointments.click(); // click on common appointment, due to redrawing its index has changed
        scheduler.tooltip.clickOnItem();

        assert.notOk(scheduler.appointmentPopup.form.isRecurrenceEditorVisible(), "Recurrence editor shouldn't visible on click on common appointment");
        assert.equal(scheduler.appointmentPopup.form.getSubject(), NEW_EXPECTED_SUBJECT, "Subject in form should equal selected common appointment");
    });
});

const createInstance = function(options) {
    const defaultOption = {
        dataSource: [],
        maxAppointmentsPerCell: null
    };
    const instance = $("#scheduler").dxScheduler($.extend(defaultOption, options)).dxScheduler("instance");
    return new SchedulerTestWrapper(instance);
};

const moduleOptions = {
    beforeEach: function() {
        this.instance = $("#scheduler").dxScheduler({
            dataSource: [],
            maxAppointmentsPerCell: null
        }).dxScheduler("instance");
        fx.off = true;
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
    }
};

QUnit.module("Appointment Popup Content", moduleOptions);

QUnit.test("showAppointmentPopup method with passed a recurrence appointment should render popup(T698732)", function(assert) {
    var appointments = [
        {
            text: "TEST_TEXT",
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10"
        }
    ];
    this.instance.option({
        dataSource: appointments,
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
    });

    this.instance.showAppointmentPopup(appointments[0], false);

    var popupChoiceAppointmentEdit = $(".dx-dialog .dx-popup-normal.dx-resizable").not('.dx-state-invisible');
    assert.equal(popupChoiceAppointmentEdit.length, 1, "Popup with choice edit mode is rendered");

    popupChoiceAppointmentEdit.find(".dx-popup-bottom .dx-button:eq(1)").trigger("dxclick");
    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Appointment popup is rendered");

    var form = this.instance.getAppointmentDetailsForm(),
        startDateBox = form.getEditor("startDate"),
        endDateBox = form.getEditor("endDate");

    assert.equal(startDateBox.option("value").valueOf(), appointments[0].startDate.valueOf(), "Value in start dateBox valid");
    assert.equal(endDateBox.option("value").valueOf(), appointments[0].endDate.valueOf(), "Value in end dateBox valid");
});

QUnit.test("showAppointmentPopup should render a popup only once", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Popup is rendered");

    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });
    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Popup is rendered");
});

QUnit.test("showAppointmentPopup should work correctly after scheduler repainting", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Popup is rendered");
    this.instance.repaint();

    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });
    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Popup is rendered");
});

QUnit.test("changing editing should work correctly after showing popup", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });
    this.instance.hideAppointmentPopup(true);

    this.instance.option("editing.allowUpdating", false);
    this.instance.option("editing.allowUpdating", true);

    assert.ok(true, "OK");
});

QUnit.test("hideAppointmentPopup should hide a popup", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Popup is rendered");
    this.instance.hideAppointmentPopup();
    assert.equal($(".dx-scheduler-appointment-popup").length, 1, "Popup is hidden");
});

QUnit.test("hideAppointmentPopup should hide a popup and save changes", function(assert) {
    this.instance.option({
        currentDate: new Date(2016, 9, 10),
        currentView: "month"
    });
    this.instance.showAppointmentPopup({ text: "1", startDate: new Date(2016, 9, 10), endDate: new Date(2016, 9, 11) }, true);

    assert.equal($(".dx-scheduler-appointment-popup").length, 2, "Popup is rendered");
    this.instance.hideAppointmentPopup(true);
    assert.equal($(".dx-scheduler-appointment-popup").length, 1, "Popup is hidden");
    assert.equal($(".dx-scheduler-appointment").length, 1, "appointment is created");
});

QUnit.test("showAppointmentPopup should render a popup form only once", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: "appointment 1" });

    var $form = $(".dx-scheduler-appointment-popup").find(".dx-form");
    assert.equal($form.length, 1, "Form was rendered");

    this.instance.hideAppointmentPopup();
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: "appointment 2" });

    assert.equal($form.find(".dx-textbox").eq(0).dxTextBox("instance").option("text"), "appointment 2", "Form data is correct");
});

QUnit.test("popup should have right height", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: "appointment 1" });

    var popup = this.instance.getAppointmentPopup();

    assert.equal(popup.option("height"), 'auto', "popup has correct height");
    assert.equal(popup.option("maxHeight"), "100%", "popup has correct max-height");
});

QUnit.test("showAppointmentPopup should render a popup content only once", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: "appointment 1" });

    var popup = this.instance.getAppointmentPopup(),
        contentReadyCalled = 0;

    popup.option("onContentReady", function() {
        contentReadyCalled++;
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: "appointment 2" });

    assert.equal(contentReadyCalled, 0, "Content wasn't rerendered");
});

QUnit.test("Popup should contain editors and components with right dx-rtl classes and rtlEnabled option value", function(assert) {
    this.instance = $("#scheduler").dxScheduler({ rtlEnabled: true }).dxScheduler("instance");
    this.instance.showAppointmentPopup({});

    var $innerSwitch = $(".dx-scheduler-appointment-popup .dx-switch").eq(0);

    assert.ok($innerSwitch.hasClass("dx-rtl"), "Inner editor has dx-rtl class");
    assert.equal($innerSwitch.dxSwitch("instance").option("rtlEnabled"), true, "rtlEnabled option value is right");
});

QUnit.test("Popup should contains start datebox with right value", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $dateBox = $popupContent.find(".dx-datebox").eq(0);

    assert.equal($dateBox.length, 1, "Start date box is rendered");
    assert.deepEqual($dateBox.dxDateBox("instance").option("value"), new Date(2015, 1, 1, 1), "value is right");
});

QUnit.test("Calendar of the start datebox should have right firstDayOfWeek value", function(assert) {
    if(devices.current().deviceType === "desktop") {
        this.instance.option("firstDayOfWeek", 4);
        this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

        var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
            startDateBox = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance");

        startDateBox.open();
        var calendar = startDateBox._popup.$content().find(".dx-calendar").dxCalendar("instance");

        assert.equal(calendar.option("firstDayOfWeek"), 4, "firstDayOfWeek is right");
    } else {
        assert.ok(true, "It doesn't make sense on mobile devices");
    }
});

QUnit.test("Popup should contains end datebox with right value", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $dateBox = $popupContent.find(".dx-datebox").eq(1);

    assert.equal($dateBox.length, 1, "End datebox is rendered");
    assert.deepEqual($dateBox.dxDateBox("instance").option("value"), new Date(2015, 1, 1, 2), "value is right");
});

QUnit.test("Calendar of the end datebox should have right firstDayOfWeek value", function(assert) {
    if(devices.current().deviceType === "desktop") {
        this.instance.option("firstDayOfWeek", 4);
        this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

        var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
            endDateBox = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance");

        endDateBox.open();
        var calendar = endDateBox._popup.$content().find(".dx-calendar").dxCalendar("instance");

        assert.equal(calendar.option("firstDayOfWeek"), 4, "firstDayOfWeek is right");
    } else {
        assert.ok(true, "It doesn't make sense on mobile devices");
    }
});

QUnit.test("Changing startDateBox value should change endDateBox value if needed", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 3), text: "caption" });
    var form = this.instance.getAppointmentDetailsForm(),
        startDateBox = form.getEditor("startDate"),
        endDateBox = form.getEditor("endDate");

    startDateBox.option("value", new Date(2015, 1, 4));

    assert.deepEqual(endDateBox.option("value"), new Date(2015, 1, 6), "endDate value is right");

    startDateBox.option("value", new Date(2015, 1, 3));

    assert.deepEqual(endDateBox.option("value"), new Date(2015, 1, 6), "endDate value is right");
});

QUnit.test("Changing startDateBox value should change endDateBox value if needed(when startDate and endDate are strings)", function(assert) {
    this.instance.showAppointmentPopup({ startDate: "1/1/2015", endDate: "1/3/2015", text: "caption" });
    var form = this.instance.getAppointmentDetailsForm(),
        startDateBox = form.getEditor("startDate"),
        endDateBox = form.getEditor("endDate");

    startDateBox.option("value", new Date(2015, 1, 4));

    assert.deepEqual(endDateBox.option("value"), new Date(2015, 1, 6), "endDate value is right");

    startDateBox.option("value", new Date(2015, 1, 3));

    assert.deepEqual(endDateBox.option("value"), new Date(2015, 1, 6), "endDate value is right");
});

QUnit.test("startDateBox value should be valid", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 3), text: "caption" });
    var form = this.instance.getAppointmentDetailsForm(),
        startDateBox = form.getEditor("startDate");

    startDateBox.option("value", undefined);

    assert.deepEqual(startDateBox.option("value"), new Date(2015, 1, 1), "startDate value is initial value");
});

QUnit.test("Changing endDateBox value should change startDateBox value if needed", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 10), endDate: new Date(2015, 1, 13), text: "caption" });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        startDateBox = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance"),
        endDateBox = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance");

    endDateBox.option("value", new Date(2015, 1, 9));

    assert.deepEqual(startDateBox.option("value"), new Date(2015, 1, 6), "startDate value is right");

    endDateBox.option("value", new Date(2015, 1, 10));

    assert.deepEqual(startDateBox.option("value"), new Date(2015, 1, 6), "startDate value is right");
});

QUnit.test("Changing endDateBox value should change startDateBox value if needed(when startDate and endDate are strings)", function(assert) {
    this.instance.showAppointmentPopup({ startDate: "1/10/2015", endDate: "1/13/2015", text: "caption" });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        startDateBox = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance"),
        endDateBox = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance");

    endDateBox.option("value", new Date(2015, 0, 9));

    assert.deepEqual(startDateBox.option("value"), new Date(2015, 0, 6), "startDate value is right");

    endDateBox.option("value", new Date(2015, 0, 10));

    assert.deepEqual(startDateBox.option("value"), new Date(2015, 0, 6), "startDate value is right");
});

QUnit.test("endDateBox value should be valid", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 3), text: "caption" });
    var form = this.instance.getAppointmentDetailsForm(),
        endDateBox = form.getEditor("endDate");

    endDateBox.option("value", undefined);

    assert.deepEqual(endDateBox.option("value"), new Date(2015, 1, 3), "endDate value is initial value");
});

QUnit.test("Popup should contains caption textbox with right value", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    var form = this.instance.getAppointmentDetailsForm(),
        textBox = form.getEditor("text");

    assert.equal(textBox.$element().length, 1, "Caption text is rendered");
    assert.equal(textBox.option("value"), "caption", "value is right");
});

QUnit.test("Confirm dialog should be shown when showAppointmentPopup for recurrence appointment was called", function(assert) {
    var startDate = new Date(2015, 1, 1, 1);

    this.instance.showAppointmentPopup({
        startDate: startDate,
        endDate: new Date(2015, 1, 1, 2),
        text: "caption",
        recurrenceRule: "FREQ=YEARLY"
    });

    assert.ok($(".dx-dialog.dx-overlay-modal").length, "Dialog was shown");
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");
});

QUnit.test("Popup should contain recurrence editor", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule"),
        freqEditor = recurrenceEditor._freqEditor;

    assert.equal(freqEditor.option("value"), "never", "value is right");
});

QUnit.test("Recurrence Editor should have right freq editor value if recurrence rule was set on init", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a", recurrenceRule: "FREQ=WEEKLY" });

    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule"),
        freqEditor = recurrenceEditor._freqEditor;

    assert.equal(freqEditor.option("value"), "weekly", "value is right");
});

QUnit.test("Freq editor should change value if recurrence rule was changed", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a", recurrenceRule: "FREQ=WEEKLY" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule"),
        freqEditor = recurrenceEditor._freqEditor;

    assert.equal(freqEditor.option("value"), "weekly", "value is right");

    freqEditor.option("value", "daily");
    recurrenceEditor.option("value", "FREQ=DAILY");
});

QUnit.test("Recurrence editor container should be visible if recurrence rule was set", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a", recurrenceRule: "FREQ=WEEKLY" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule");

    assert.notEqual(recurrenceEditor._$container.css("display"), "none", "Container is visible");
});

QUnit.test("Recurrence editor container should be visible after changing freq editor value", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule"),
        freqEditor = recurrenceEditor._freqEditor;

    assert.equal(recurrenceEditor._$container.css("display"), "none", "Container is not visible");

    freqEditor.option("value", "daily");

    assert.notEqual(recurrenceEditor._$container.css("display"), "none", "Container is visible");

    freqEditor.option("value", "never");

    assert.equal(recurrenceEditor._$container.css("display"), "none", "Container is not visible");
});

QUnit.test("Recurrence editor container should be visible after changing freq editor value, if recurrenceRule expr is set", function(assert) {
    this.instance.option("recurrenceRuleExpr", "RRule");

    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("RRule"),
        freqEditor = recurrenceEditor._freqEditor;

    assert.equal(recurrenceEditor._$container.css("display"), "none", "Container is not visible");

    freqEditor.option("value", "daily");

    assert.notEqual(recurrenceEditor._$container.css("display"), "none", "Container is visible");
});

QUnit.test("Recurrence editor container should be visible after value option changing", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule");

    assert.equal(recurrenceEditor._$container.css("display"), "none", "Container is not visible");

    recurrenceEditor.option("value", "FREQ=WEEKLY");

    assert.notEqual(recurrenceEditor._$container.css("display"), "none", "Container is visible");
});

QUnit.test("Popup should contain recurrence editor with right config", function(assert) {
    var startDate = new Date(2015, 1, 1, 1);

    this.instance.option("recurrenceEditMode", "series");
    this.instance.option("firstDayOfWeek", 5);

    this.instance.showAppointmentPopup({
        startDate: startDate,
        endDate: new Date(2015, 1, 1, 2),
        text: "caption",
        recurrenceRule: "FREQ=YEARLY;BYMONTHDAY=2;BYMONTH=11"
    });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $recurrenceEditor = $popupContent.find(".dx-recurrence-editor");

    assert.equal($recurrenceEditor.length, 1, "Recurrence editor is rendered");
    assert.equal($recurrenceEditor.dxRecurrenceEditor("instance").option("value"), "FREQ=YEARLY;BYMONTHDAY=2;BYMONTH=11", "value is right");
    assert.deepEqual($recurrenceEditor.dxRecurrenceEditor("instance").option("startDate"), startDate, "startDate value is right");
    assert.equal($recurrenceEditor.dxRecurrenceEditor("instance").option("firstDayOfWeek"), 5, "firstDayOfWeek value is right");
});

QUnit.test("Recurrence editor should have default value if freq editor value changed", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule"),
        freqEditor = recurrenceEditor._freqEditor;

    freqEditor.option("value", "daily");

    assert.equal(recurrenceEditor.option("value"), "FREQ=DAILY", "recEditor has right value");

    freqEditor.option("value", "never");

    assert.equal(recurrenceEditor.option("value"), "", "recEditor has right value");
});

QUnit.test("Popup should not contain recurrence editor, if recurrenceRuleExpr is null", function(assert) {
    var appointment = {
        startDate: new Date(2015, 1, 1, 1),
        endDate: new Date(2015, 1, 1, 2),
        text: "caption",
        recurrenceRule: "FREQ=YEARLY"
    };

    this.instance.option("recurrenceRuleExpr", null);
    this.instance.showAppointmentPopup(appointment);

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $recurrenceEditor = $popupContent.find(".dx-recurrence-editor");

    assert.equal($recurrenceEditor.length, 0, "Recurrence editor was not rendered");

    this.instance.option("recurrenceRuleExpr", "recurrenceRule");

    this.instance.showAppointmentPopup(appointment);
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content");
    $recurrenceEditor = $popupContent.find(".dx-recurrence-editor");

    assert.equal($recurrenceEditor.length, 1, "Recurrence editor was rendered");
});

QUnit.test("Popup should not contain recurrence editor, if recurrenceRuleExpr is ''", function(assert) {
    var appointment = {
        startDate: new Date(2015, 1, 1, 1),
        endDate: new Date(2015, 1, 1, 2),
        text: "caption",
        recurrenceRule: "FREQ=YEARLY"
    };

    this.instance.option("recurrenceRuleExpr", '');
    this.instance.showAppointmentPopup(appointment);

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $recurrenceEditor = $popupContent.find(".dx-recurrence-editor");

    assert.equal($recurrenceEditor.length, 0, "Recurrence editor was not rendered");
});

QUnit.test("Recurrence editor should has right startDate after form items change", function(assert) {
    this.instance.option("onAppointmentFormOpening", function(e) {
        var items = e.form.option("items");

        items.push({
            dataField: "location",
            editorType: "dxTextBox",
            label: {
                text: "Location"
            }
        });

        e.form.option("items", items);
    });

    this.instance.showAppointmentPopup({ startDate: new Date(2016, 5, 4), endDate: new Date(2015, 5, 5) });

    var form = this.instance.getAppointmentDetailsForm(),
        recEditor = form.getEditor("recurrenceRule");

    assert.deepEqual(recEditor.option("startDate"), new Date(2016, 5, 4), "startDate is ok");
});

QUnit.test("Popup should contains description editor", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption", description: "First task of this day" });

    var form = this.instance.getAppointmentDetailsForm(),
        descriptionEditor = form.getEditor("description");

    assert.equal(descriptionEditor.$element().length, 1, "Description editor is rendered");
    assert.equal(descriptionEditor.option("value"), "First task of this day", "value is right");
});

QUnit.test("Popup should contains allDay editor", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption", description: "First task of this day", allDay: true });

    var form = this.instance.getAppointmentDetailsForm(),
        allDayEditor = form.getEditor("allDay");

    assert.equal(allDayEditor.option("value"), true, "value is right");
});

QUnit.test("allDay changing should switch date & type in editors", function(assert) {

    this.instance.option("startDayHour", 5);
    this.instance.showAppointmentPopup({
        startDate: new Date(2015, 1, 1, 6),
        endDate: new Date(2015, 1, 2, 7), text: "caption", description: "First task of this day"
    });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $allDayEditor = $popupContent.find(".dx-switch").eq(0),
        allDayEditor = $allDayEditor.dxSwitch("instance");

    allDayEditor.option("value", true);


    var startDate = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance"),
        endDate = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance");

    assert.deepEqual(startDate.option("value"), new Date(2015, 1, 1), "value is right");
    assert.equal(startDate.option("type"), "date", "type is right");
    assert.deepEqual(endDate.option("value"), new Date(2015, 1, 2), "value is right");
    assert.equal(endDate.option("type"), "date", "type is right");

    allDayEditor.option("value", false);

    assert.equal(startDate.option("type"), "datetime", "type is right after turning off allDay");
    assert.equal(endDate.option("type"), "datetime", "type is right after turning off allDay");
    assert.deepEqual(startDate.option("value"), new Date(2015, 1, 1, 5), "startdate is OK");
    assert.deepEqual(endDate.option("value"), new Date(2015, 1, 1, 5, 30), "enddate is OK");
});

QUnit.test("allDay changing should switch only type in editors, if startDate is undefined", function(assert) {
    this.instance.showAppointmentPopup({
        text: "test appointment",
        allDay: true
    }, true, null);

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $allDayEditor = $popupContent.find(".dx-switch").eq(0),
        allDayEditor = $allDayEditor.dxSwitch("instance");

    allDayEditor.option("value", false);

    var startDate = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance"),
        endDate = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance");

    assert.equal(startDate.option("type"), "datetime", "type is right");
    assert.equal(endDate.option("type"), "datetime", "type is right");
    assert.deepEqual(startDate.option("value"), null, "value is right");
    assert.deepEqual(endDate.option("value"), null, "value is right");

    allDayEditor.option("value", true);

    assert.equal(startDate.option("type"), "date", "type is right after turning off allDay");
    assert.equal(endDate.option("type"), "date", "type is right after turning off allDay");
    assert.deepEqual(startDate.option("value"), null, "startdate is OK");
    assert.deepEqual(endDate.option("value"), null, "enddate is OK");
});

QUnit.test("There are no exceptions when select date on the appointment popup, startDate > endDate", function(assert) {
    var date = new Date();

    this.instance.showAppointmentPopup({
        allDay: true,
        text: "",
        startDate: date,
        endDate: date,
        recurrence: null,
        recurrenceException: null
    });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        startDate = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance"),
        dateToTest = new Date();

    dateToTest.setDate(date.getDate() + 5);

    startDate.option("value", dateToTest);

    assert.ok(true, "There are no exceptions");
});

QUnit.test("There are no exceptions when select date on the appointment popup,startDate < endDate", function(assert) {
    var date = new Date();

    this.instance.showAppointmentPopup({
        allDay: true,
        text: "",
        startDate: date,
        endDate: date,
        recurrence: null,
        recurrenceException: null
    });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        endDate = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance"),
        dateToTest = new Date();

    dateToTest.setDate(date.getDate() - 5);

    endDate.option("value", dateToTest);

    assert.ok(true, "There are no exceptions");
});

QUnit.test("There are no exceptions when select date on the appointment popup,if dates are undefined", function(assert) {
    var date = new Date();

    this.instance.showAppointmentPopup({
        allDay: true,
        text: "",
        recurrence: null,
        recurrenceException: null
    }, true, null);

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        startDate = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance"),
        endDate = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance"),
        dateToTest = new Date();

    dateToTest.setDate(date.getDate() - 5);

    startDate.option("value", date);
    endDate.option("value", dateToTest);

    assert.ok(true, "There are no exceptions");
});

QUnit.test("Popup should not contain startDateTimeZone editor by default", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption", description: "First task of this day", allDay: true });

    var form = this.instance.getAppointmentDetailsForm(),
        startDateTimezoneEditor = form.getEditor("startDateTimeZone");

    assert.notOk(startDateTimezoneEditor, "StartDateTZ editor isn't visible by default");
});

QUnit.test("Popup should not contain endDateTimeZone editor by default", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption", description: "First task of this day", allDay: true });

    var form = this.instance.getAppointmentDetailsForm(),
        endDateTimeZoneEditor = form.getEditor("endDateTimeZone");

    assert.notOk(endDateTimeZoneEditor, "StartDateTZ editor isn't visible by default");
});

QUnit.test("It should be possible to render startDateTimeZone editor on appt form", function(assert) {
    this.instance.option("onAppointmentFormOpening", function(e) {
        e.form.itemOption("startDateTimeZone", { visible: true });
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption", description: "First task of this day", allDay: true });

    var form = this.instance.getAppointmentDetailsForm(),
        startDateTimezoneEditor = form.getEditor("startDateTimeZone");

    assert.ok(startDateTimezoneEditor instanceof SchedulerTimezoneEditor, "Editor is SchedulerTimezoneEditor");
    assert.equal(startDateTimezoneEditor.option("observer"), this.instance, "Observer is defined");
});

QUnit.test("It should be possible to render endDateTimeZone editor on appt form", function(assert) {
    this.instance.option("onAppointmentFormOpening", function(e) {
        e.form.itemOption("endDateTimeZone", { visible: true });
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption", description: "First task of this day", allDay: true });

    var form = this.instance.getAppointmentDetailsForm(),
        endDateTimezoneEditor = form.getEditor("endDateTimeZone");

    assert.ok(endDateTimezoneEditor instanceof SchedulerTimezoneEditor, "Editor is SchedulerTimezoneEditor");
    assert.equal(endDateTimezoneEditor.option("observer"), this.instance, "Observer is defined");
});

QUnit.test("Validate works always before done click", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.instance.option({ dataSource: data });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    var form = this.instance.getAppointmentDetailsForm();
    var validation = sinon.stub(form, "validate");

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    assert.ok(validation.calledOnce);
});

QUnit.test("Done button shouldn't be disabled if validation fail", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.instance.option({ dataSource: data });
    this.instance.option({
        onAppointmentFormOpening: function(data) {
            var form = data.form;

            form.option("items", [{
                name: "description",
                dataField: "description",
                editorType: "dxTextArea",
                validationRules: [{
                    type: "required",
                    message: "Login is required"
                }]
            }]);
        }
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    var doneButton = $(".dx-scheduler-appointment-popup .dx-popup-done.dx-button").dxButton("instance");
    assert.equal(doneButton.option("disabled"), false, "done button is not disabled");
});

QUnit.test("Done button custom configuration should be correct", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.instance.option({ dataSource: data });
    this.instance.option({
        onAppointmentFormOpening: function(e) {
            const popup = e.component.getAppointmentPopup();
            const buttons = popup.option('toolbarItems');
            buttons[0].options = { text: 'Text 1' };
            popup.option('toolbarItems', buttons);
        },
        onAppointmentAdding: function(e) {
            e.cancel = true;
        }
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    var doneButton = $(".dx-scheduler-appointment-popup .dx-popup-done.dx-button").dxButton("instance");

    assert.equal(doneButton.option("disabled"), false, "done button is not disabled");
    assert.equal(doneButton.option("text"), "Text 1", "done button text is ok");
});

QUnit.test("Done button shouldn't be disabled if event validation fail", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.instance.option({ dataSource: data });
    this.instance.option({
        onAppointmentFormAdding: function(e) {
            e.cancel = true;
        }
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    var doneButton = $(".dx-scheduler-appointment-popup .dx-popup-done.dx-button").dxButton("instance");
    assert.equal(doneButton.option("disabled"), false, "done button is not disabled");
});

QUnit.test("Done button shouldn't be disabled at second appointment form opening", function(assert) {
    var task = { startDate: new Date(2017, 1, 1), endDate: new Date(2017, 1, 1, 0, 10), text: "caption" };
    this.instance.option({
        dataSource: [task]
    });

    this.instance.showAppointmentPopup(task);
    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");
    this.instance.showAppointmentPopup(task);
    var doneButton = $(".dx-scheduler-appointment-popup .dx-popup-done.dx-button").dxButton("instance");

    assert.equal(doneButton.option("disabled"), false, "done button is not disabled");
});

QUnit.test("startDateBox & endDateBox should have required validation rules", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" });

    var form = this.instance.getAppointmentDetailsForm();

    assert.deepEqual(form.itemOption("startDate").validationRules, [{ type: "required" }]);
    assert.deepEqual(form.itemOption("endDate").validationRules, [{ type: "required" }]);
});

QUnit.test("Changes shouldn't be saved if form is invalid", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.instance.option({ dataSource: data });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" }, true);

    var form = this.instance.getAppointmentDetailsForm(),
        addingAppointment = sinon.stub(this.instance, "addAppointment");

    sinon.stub(form, "validate").returns({ isValid: false });

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    assert.notOk(addingAppointment.calledOnce);
});

QUnit.module("Appointment Popup", moduleOptions);

QUnit.test("focus is called on popup hiding", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    var spy = sinon.spy(this.instance, "focus");

    $(".dx-scheduler-appointment-popup .dx-overlay-content .dx-popup-cancel").trigger("dxclick");

    assert.ok(spy.calledOnce, "focus is called");
});

QUnit.test("Popup should has close button in mobile theme when allowUpdating: false", function(assert) {
    this.instance.option({
        editing: {
            allowUpdating: false
        }
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    var popup = this.instance.getAppointmentPopup();

    assert.equal(popup.option("showCloseButton"), true, "popup has closeButton");
});

QUnit.test("Popup should has default close button in current mobile theme", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    var popup = this.instance.getAppointmentPopup();
    assert.equal(popup.option("showCloseButton"), popup.initialOption("showCloseButton"), "popup has closeButton");
});

QUnit.test("Clicking on 'Repeat' label should focus freq editor", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    var popup = this.instance.getAppointmentPopup(),
        editorLabel = $(popup.$content()).find(".dx-scheduler-recurrence-rule-item .dx-field-item-label");

    editorLabel.trigger("dxclick");

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $freqEditor = $popupContent.find(".dx-recurrence-selectbox-freq").eq(0);

    assert.ok($freqEditor.hasClass("dx-state-focused"), "freq editor is focused");
});

QUnit.test("Clicking on 'Repeat' label should should focus freq editor, when recurrence part is opening (T722522) ", function(assert) {
    var data = new DataSource({
        store: [{
            startDate: new Date(2017, 4, 25, 10),
            endDate: new Date(2017, 4, 25, 12),
            recurrenceRule: "FREQ=DAILY"
        }]
    });

    this.instance.option({
        startDayHour: 9,
        view: ["week"],
        currentView: "week",
        dataSource: data,
        currentDate: new Date(2017, 4, 25)
    });

    var $appointment = this.instance.$element().find(".dx-scheduler-appointment").eq(1);
    $($appointment).trigger("dxdblclick");
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var popup = this.instance.getAppointmentPopup(),
        editorLabel = $(popup.$content()).find(".dx-scheduler-recurrence-rule-item .dx-field-item-label");

    editorLabel.trigger("dxclick");

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $freqEditor = $popupContent.find(".dx-recurrence-selectbox-freq").eq(0);

    assert.ok($freqEditor.hasClass("dx-state-focused"), "freq editor is focused");
});

QUnit.test("Multiple showing appointment popup for recurrence appointments should work correctly", function(assert) {
    this.instance.showAppointmentPopup({
        text: "Appointment 1",
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11)
    });

    this.instance.hideAppointmentPopup(true);
    this.instance.option("recurrenceEditMode", "series");

    this.instance.showAppointmentPopup({
        text: "Appointment 2",
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10"
    });

    var popup = this.instance.getAppointmentPopup(),
        $checkboxes = $(popup.$content()).find(".dx-checkbox");

    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), true, "Right checkBox was checked");
    assert.equal($checkboxes.eq(4).dxCheckBox("instance").option("value"), true, "Right checkBox was checked");
});

QUnit.test("Appointment popup will render even if no appointmentData is provided (T734413)", function(assert) {
    const scheduler = createInstance();
    scheduler.instance.showAppointmentPopup({}, true);
    scheduler.instance.hideAppointmentPopup(true);
    scheduler.instance.showAppointmentPopup({}, true);
    const { startDate, endDate } = scheduler.appointmentForm.getFormInstance().option('formData');
    const appointmentPopup = scheduler.appointmentPopup;

    assert.equal(startDate, null, "startDate has null in the dxForm");
    assert.equal(endDate, null, "endDate has null in the dxForm");
    assert.ok(appointmentPopup.isRendered(), "Popup is rendered");

    const $popup = appointmentPopup.getPopup();
    const $startDate = $popup.find("input[name='startDate']")[0];
    const $endDate = $popup.find("input[name='endDate']")[0];

    assert.equal($startDate.value, "", "startDate is rendered empty");
    assert.equal($endDate.value, "", "endDate is rendered empty");
});

QUnit.test("Appointment popup will render on showAppointmentPopup with no arguments", function(assert) {
    const scheduler = createInstance();
    scheduler.instance.showAppointmentPopup();
    const { startDate, endDate } = scheduler.appointmentForm.getFormInstance().option('formData');
    const appointmentPopup = scheduler.appointmentPopup;

    assert.equal(startDate, null, "startDate has null in the dxForm");
    assert.equal(endDate, null, "endDate has null in the dxForm");
    assert.ok(appointmentPopup.isRendered(), "Popup is rendered");

    const $popup = appointmentPopup.getPopup();
    const $startDate = $popup.find("input[name='startDate']")[0];
    const $endDate = $popup.find("input[name='endDate']")[0];

    assert.equal($startDate.value, "", "startDate is rendered empty");
    assert.equal($endDate.value, "", "endDate is rendered empty");
});

QUnit.test("Appointment form will have right dates on multiple openings (T727713)", function(assert) {
    const scheduler = createInstance();
    const appointments = [
        {
            text: "Appointment1",
            startDate: new Date(2017, 4, 2, 8, 30),
            endDate: new Date(2017, 4, 2, 11),
        }, {
            text: "Appointment2",
            startDate: new Date(2017, 4, 1, 10),
            endDate: new Date(2017, 4, 1, 11),
        }
    ];
    scheduler.instance.option({
        dataSource: appointments,
        currentView: "week",
        views: ["week"],
        currentDate: new Date(2017, 4, 1),
    });
    scheduler.instance.showAppointmentPopup(appointments[1], false);
    let formData = scheduler.appointmentForm.getFormInstance().option('formData');

    assert.deepEqual(formData.startDate, appointments[1].startDate, "First opening appointment form has right startDate");
    assert.deepEqual(formData.endDate, appointments[1].endDate, "First opening appointment form has right endDate");

    scheduler.instance.hideAppointmentPopup();

    let form = this.instance.getAppointmentDetailsForm();
    let formDataChangedCount = 0;
    form.option("onOptionChanged", (args) => {
        if(args.name === "formData") formDataChangedCount++;
    });

    scheduler.appointments.dblclick(0);
    formData = scheduler.appointmentForm.getFormInstance().option('formData');

    assert.deepEqual(formData.startDate, appointments[0].startDate, "Second opening appointment form has right startDate");
    assert.deepEqual(formData.endDate, appointments[0].endDate, "Second opening appointment form has right endDate");
    assert.equal(formDataChangedCount, 1, 'Form data changed one time');
});

QUnit.test("The vertical scroll bar is shown when an appointment popup fill to a small window's height", function(assert) {
    const scheduler = createInstance({
        currentDate: new Date(2015, 1, 1),
        currentView: "day",
        dataSource: []
    });

    const popup = scheduler.appointmentPopup;
    popup.setInitialPopupSize({ height: 300 });

    scheduler.instance.fire("showAddAppointmentPopup", {
        startDate: new Date(2015, 1, 1),
        endDate: new Date(2015, 1, 1, 1),
        allDay: true
    });

    assert.ok(popup.hasVerticalScroll(), "The popup has the vertical scrolling");
});

QUnit.test("The resize event of appointment popup is triggered the the window is resize", function(assert) {
    const scheduler = createInstance({
        currentDate: new Date(2015, 1, 1),
        currentView: "day",
        dataSource: []
    });

    scheduler.instance.fire("showAddAppointmentPopup", {
        startDate: new Date(2015, 1, 1),
        endDate: new Date(2015, 1, 1, 1),
        allDay: true
    });

    const $popup = scheduler.appointmentPopup.getPopupInstance().$element();
    let isResizeEventTriggered;
    $($popup).on("dxresize", () => {
        isResizeEventTriggered = true;
    });
    resizeCallbacks.fire();
    assert.ok(isResizeEventTriggered, "The resize event of popup is triggered");
});

QUnit.test("Popup should not be closed until the valid value is typed", function(assert) {
    const startDate = new Date(2015, 1, 1, 1),
        validValue = "Test",
        done = assert.async();
    const scheduler = createInstance();
    scheduler.instance.option("onAppointmentFormOpening", function(data) {
        const items = data.form.option("items");
        items[0].validationRules = [
            {
                type: "async",
                validationCallback: function(params) {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(params.value === validValue);
                    }, 10);
                    return d.promise();
                }
            }
        ];

        data.form.option("items", items);
    });

    scheduler.instance.showAppointmentPopup({
        startDate: startDate,
        endDate: new Date(2015, 1, 1, 2),
        text: "caption"
    });

    scheduler.appointmentForm.setSubject("caption1");
    scheduler.appointmentPopup.saveAppointmentData().done(() => {
        assert.equal(scheduler.appointmentForm.getInvalidEditorsCount.call(scheduler), 1, "the only invalid editor is displayed in the form");

        scheduler.appointmentForm.setSubject(validValue);
        scheduler.appointmentPopup.saveAppointmentData().done(() => {
            assert.notOk(scheduler.appointmentPopup.getPopupInstance().option("visible"), "the form is closed");

            done();
        });
    });

    assert.equal(scheduler.appointmentForm.getPendingEditorsCount.call(scheduler), 1, "the only pending editor is displayed in the form");
});

QUnit.test("Popup with form is rendered hidden by first Scheduler rendering (T805804)", function(assert) {
    const appointmentFormOpeningStub = sinon.stub();
    const scheduler = createInstance({
        dataSource: [],
        maxAppointmentsPerCell: null,
        onAppointmentFormOpening: appointmentFormOpeningStub
    });

    assert.notOk(scheduler.appointmentPopup.isRendered(), "popup is rendered");
    assert.notOk(scheduler.appointmentPopup.isVisible(), "popup is hidden");
    assert.equal(appointmentFormOpeningStub.callCount, 0, "the onAppointmentFormOpening event is not called");
    assert.ok(scheduler.appointmentPopup.form.isRendered(), "form is rendered");
});

