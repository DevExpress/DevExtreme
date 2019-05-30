require("common.css!");
require("generic_light.css!");

var $ = require("jquery"),
    devices = require("core/devices"),
    SchedulerTimezoneEditor = require("ui/scheduler/timezones/ui.scheduler.timezone_editor"),
    fx = require("animation/fx"),
    DataSource = require("data/data_source/data_source").DataSource;

require("ui/scheduler/ui.scheduler");
require("ui/switch");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler"></div>');
});

var moduleOptions = {
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

    var popupChoiceAppointmentEdit = $('.dx-popup-normal.dx-resizable').not('.dx-state-invisible');
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

    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: "appointment 2" });

    assert.equal($form.find(".dx-textbox").eq(0).dxTextBox("instance").option("text"), "appointment 2", "Form data is correct");
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
    if(devices.current().generic) {
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
    if(devices.current().generic) {
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

    startDateBox.option("value", null);

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

    endDateBox.option("value", null);

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

QUnit.test("Popup should contain switch to turning on of recurrence editor", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });

    var form = this.instance.getAppointmentDetailsForm(),
        repeatOnEditor = form.getEditor("repeatOnOff");

    assert.equal(repeatOnEditor.option("value"), false, "value is right");
});

QUnit.test("RepeatOn switch should be turned on if recurrence rule was set on init", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a", recurrenceRule: "FREQ=WEEKLY" });

    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        repeatOnEditor = form.getEditor("repeatOnOff");

    assert.equal(repeatOnEditor.option("value"), true, "switch is turned on");
});

QUnit.test("RepeatOn switch should change value if recurrence rule was changed", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a", recurrenceRule: "FREQ=WEEKLY" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        repeatOnEditor = form.getEditor("repeatOnOff");

    assert.equal(repeatOnEditor.option("value"), true, "switch is turned on");

    var recurrenceEditor = form.getEditor("recurrenceRule");
    recurrenceEditor.option("value", "");

    assert.equal(repeatOnEditor.option("value"), true, "switch is turned on");
});

QUnit.test("Recurrence editor container should be visible if recurrence rule was set", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a", recurrenceRule: "FREQ=WEEKLY" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule");

    assert.notEqual(recurrenceEditor._$container.css("display"), "none", "Container is visible");
});

QUnit.test("Recurrence editor container should be visible after turn on switch", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("recurrenceRule");

    assert.equal(recurrenceEditor._$container.css("display"), "none", "Container is not visible");

    var repeatOnEditor = form.getEditor("repeatOnOff");
    repeatOnEditor.option("value", true);

    assert.notEqual(recurrenceEditor._$container.css("display"), "none", "Container is visible");
});

QUnit.test("Recurrence editor container should be visible after turn on switch, if recurrenceRule expr is set", function(assert) {
    this.instance.option("recurrenceRuleExpr", "RRule");

    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceEditor = form.getEditor("RRule");

    assert.equal(recurrenceEditor._$container.css("display"), "none", "Container is not visible");

    var repeatOnEditor = form.getEditor("repeatOnOff");
    repeatOnEditor.option("value", true);

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

QUnit.test("Popup should contain recurrence editor", function(assert) {
    var startDate = new Date(2015, 1, 1, 1);

    this.instance.option("recurrenceEditMode", "series");
    this.instance.option("firstDayOfWeek", 5);

    this.instance.showAppointmentPopup({
        startDate: startDate,
        endDate: new Date(2015, 1, 1, 2),
        text: "caption",
        recurrenceRule: "FREQ=YEARLY"
    });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $recurrenceEditor = $popupContent.find(".dx-recurrence-editor");

    assert.equal($recurrenceEditor.length, 1, "Recurrence editor is rendered");
    assert.equal($recurrenceEditor.dxRecurrenceEditor("instance").option("value"), "FREQ=YEARLY", "value is right");
    assert.deepEqual($recurrenceEditor.dxRecurrenceEditor("instance").option("startDate"), startDate, "startDate value is right");
    assert.equal($recurrenceEditor.dxRecurrenceEditor("instance").option("firstDayOfWeek"), 5, "firstDayOfWeek value is right");
});

QUnit.test("Recurrence editor should have default value if repeatOnOff editor turned on", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: "a" });

    var form = this.instance.getAppointmentDetailsForm(),
        repeatOnEditor = form.getEditor("repeatOnOff");

    repeatOnEditor.option("value", true);

    var recurrenceEditor = form.getEditor("recurrenceRule");

    assert.equal(recurrenceEditor.option("value"), "FREQ=DAILY", "recEditor has right value");

    repeatOnEditor.option("value", false);

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
    assert.deepEqual(startDate.option("value"), undefined, "value is right");
    assert.deepEqual(endDate.option("value"), undefined, "value is right");

    allDayEditor.option("value", true);

    assert.equal(startDate.option("type"), "date", "type is right after turning off allDay");
    assert.equal(endDate.option("type"), "date", "type is right after turning off allDay");
    assert.deepEqual(startDate.option("value"), undefined, "startdate is OK");
    assert.deepEqual(endDate.option("value"), undefined, "enddate is OK");
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

QUnit.test("Scheduler appointment popup should has right content when appointmentPopupTemplate is used", function(assert) {
    var task = { startDate: new Date(2015, 1, 10), endDate: new Date(2015, 1, 13), text: "caption" };

    this.instance.option("appointmentPopupTemplate", function() {
        assert.deepEqual(arguments[0], task, "passed appointment data is right");
        return $("<div>").addClass("new-scheduler-popup-template");
    });

    this.instance.showAppointmentPopup(task);

    var $popup = $(".new-scheduler-popup-template");

    assert.equal($popup.length, 1, "popup with template was shown");
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
            var buttons = e.component._popup.option('toolbarItems');
            buttons[0].options = { text: 'Text 1' };
            e.component._popup.option('toolbarItems', buttons);
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

QUnit.test("Appointment popup should have correct 'fullScreen' option", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    var popup = this.instance.getAppointmentPopup();

    if(!devices.current().generic) {
        assert.ok(popup.option("fullScreen"), "the fullScreen option is OK");
    } else {
        assert.notOk(popup.option("fullScreen"), "the fullScreen option is OK");
    }
});

QUnit.test("Appointment popup should have correct 'maxWidth' option", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    var popup = this.instance.getAppointmentPopup();

    assert.equal(popup.option("maxWidth"), 610, "the maxWidth option is OK");
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

QUnit.test("Clicking on 'Repeat' label should toggle recurrence editor", function(assert) {
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

    var popup = this.instance.getAppointmentPopup(),
        editorLabel = $(popup.$content()).find(".dx-scheduler-recurrence-switch-item .dx-field-item-label");

    editorLabel.trigger("dxclick");

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $recurrenceEditorContainer = $popupContent.find(".dx-recurrence-editor-container").eq(0);

    assert.ok($recurrenceEditorContainer.is(':visible'), "Recurrence editor is visible");

    editorLabel.trigger("dxclick");
    assert.ok($recurrenceEditorContainer.is(':hidden'), "Recurrence editor is hidden");
});

QUnit.test("Clicking on 'Repeat' label should toggle recurrence editor, when recurrence part is opening (T722522) ", function(assert) {
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
        editorLabel = $(popup.$content()).find(".dx-scheduler-recurrence-switch-item .dx-field-item-label");

    editorLabel.trigger("dxclick");

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        $recurrenceEditorContainer = $popupContent.find(".dx-recurrence-editor-container").eq(0);

    assert.ok($recurrenceEditorContainer.is(':visible'), "Recurrence editor is visible");

    editorLabel.trigger("dxclick");
    assert.ok($recurrenceEditorContainer.is(':hidden'), "Recurrence editor is hidden");
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

QUnit.test("Recurrent appointment editing options dialog text is showing right (T726931)", function(assert) {
    this.instance._showRecurrenceChangeConfirm(false);

    const $popup = $('.dx-dialog-wrapper');
    assert.ok($popup.length === 1, 'Dialog is open');

    const popupText = $popup.find(".dx-dialog-message").text();
    const recurrenceChangePopupText = 'Do you want to edit only this appointment or the whole series?';
    assert.equal(popupText, recurrenceChangePopupText, "Text in dialog equals config text");

    const $closeButton = $popup.find(".dx-closebutton");
    assert.ok($closeButton.length === 1, "Dialog has a closeButton in recurrence editing options dialog");

    $closeButton.trigger('dxclick');
    assert.ok($('.dx-dialog-wrapper').length === 0, 'Dialog is closed');
});
