"use strict";

var $ = require("jquery"),
    renderer = require("core/renderer"),
    noop = require("core/utils/common").noop,
    browser = require("core/utils/browser"),
    support = require("core/utils/support"),
    dateUtils = require("core/utils/date"),
    uiDateUtils = require("ui/date_box/ui.date_utils"),
    devices = require("core/devices"),
    DateBox = require("ui/date_box"),
    Box = require("ui/box"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    fx = require("animation/fx"),
    config = require("core/config"),
    dateLocalization = require("localization/date"),
    messageLocalization = require("localization/message"),
    dateSerialization = require("core/utils/date_serialization");

require("../../helpers/l10n/cldrNumberDataDe.js");
require("../../helpers/l10n/cldrCalendarDataDe.js");

require("ui/validator");

QUnit.testStart(function() {
    var markup =
        '<div id="dateBox"></div>\
        <div id="dateBoxWithPicker"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>';

    $("#qunit-fixture").html(markup);
});

require("../../helpers/calendarFixtures.js");

require("common.css!");
require("generic_light.css!");

var currentDate = new Date(2015, 11, 31),
    firstDayOfWeek = 0,
    BOX_CLASS = "dx-box",
    CALENDAR_CLASS = "dx-calendar",
    TIMEVIEW_CLASS = "dx-timeview",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input",

    DATEBOX_CLASS = "dx-datebox",
    DATEBOX_WRAPPER_CLASS = "dx-datebox-wrapper",

    DATEBOX_LIST_POPUP_SELECTOR = ".dx-datebox-wrapper-list .dx-popup-content",
    LIST_ITEM_SELECTOR = ".dx-list-item",
    DATEBOX_LIST_CLASS = "dx-datebox-list",
    DATEBOX_ADAPTIVITY_MODE_CLASS = "dx-datebox-adaptivity-mode",
    LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",

    STATE_FOCUSED_CLASS = "dx-state-focused",
    DX_AUTO_WIDTH_CLASS = "dx-auto-width",

    widgetName = "dxDateBox",

    TAB_KEY_CODE = 9;

var getShortDate = function(date) {
    return dateSerialization.serializeDate(date, dateUtils.getShortDateFormat());
};

var getInstanceWidget = function(instance) {
    return instance._strategy._widget;
};

var moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(new Date().valueOf());

        this.$element = $("#dateBox")[widgetName]({ pickerType: "native" });
        this.instance = this.$element.data(widgetName);
        this.$input = $.proxy(this.instance._input, this.instance);
    },
    afterEach: function() {
        this.clock.restore();
    }
};

var clearInput = function(element, keyboard) {
    while(element.val()) {
        keyboard.press("backspace");
        keyboard.press("del"); // Temporary for IE (keyboardMock: caret setting does not work in IE now)
    }
};

var getExpectedResult = function(date, mode, stringDate) {
    var localizedDate;

    if(uiDateUtils.FORMATS_MAP[mode]) {
        localizedDate = dateLocalization.format(date, uiDateUtils.FORMATS_MAP[mode]);
    } else {
        localizedDate = uiDateUtils.toStandardDateFormat(date, mode);
    }

    return support.inputType(mode) ? stringDate : localizedDate;
};

QUnit.module("datebox tests", moduleConfig);

QUnit.test("attach dxDateBox", function(assert) {
    assert.ok(this.instance instanceof DateBox);
});

QUnit.test("render value", function(assert) {
    var date = new Date(2012, 10, 26, 16, 40, 23),
        mode = this.instance.option("mode");

    this.instance.option("value", date);
    assert.equal(this.$input().val(), getExpectedResult(date, mode, "2012-11-26"));
});

QUnit.test("value is null after reset", function(assert) {
    var date = new Date(2012, 10, 26, 16, 40, 23);

    this.instance.option("value", date);
    this.instance.reset();

    assert.equal(this.instance.option("value"), null, "value is null after reset");
});

QUnit.test("render type", function(assert) {
    var date = new Date(2012, 10, 26, 16, 40, 0);

    this.instance.option({
        value: date,
        type: "datetime"
    });

    assert.equal(!support.inputType("datetime"), this.instance.option("mode") === "datetime-local", "if 'datetime' mode is not supported, it is change to 'datetime-local'");

    assert.equal(uiDateUtils.fromStandardDateFormat(this.$input().val()).getTime(), date.getTime());

    this.instance.option("type", "time");

    var inputValue = $(this.$input()).val(),
        normalizedInputValue = support.inputType(this.instance.option("mode")) ? uiDateUtils.fromStandardDateFormat(inputValue) : dateLocalization.parse(inputValue, uiDateUtils.FORMATS_MAP.time);

    assert.equal(normalizedInputValue.getHours(), date.getHours());
    assert.equal(normalizedInputValue.getMinutes(), date.getMinutes());
});

QUnit.test("render valueChangeEvent", function(assert) {
    this.instance.option({
        type: "date"
    });

    $(this.$input())
        .val("2012-11-26")
        .trigger("change");

    var value = this.instance.option("value");

    assert.equal(this.instance.option("valueChangeEvent"), "change", "T173149");
    assert.equal(value.getFullYear(), 2012);
    assert.equal(value.getMonth(), 10);
    assert.equal(value.getDate(), 26);
});

QUnit.test("render disabled state", function(assert) {
    assert.ok(!this.$input().attr("disabled"));

    this.instance.option("disabled", true);
    assert.ok(this.$input().attr("disabled"));
});

QUnit.test("simulated date picker should not be opened if pickerType is 'native'", function(assert) {
    var originalInputType = support.inputType;
    support.inputType = function() {
        return true;
    };

    var $dateBox = $("#dateBoxWithPicker").dxDateBox({
        pickerType: "native",
        deferRendering: false
    });

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    $($input).trigger("dxclick");

    var $popup = $dateBox.find(".dx-popup");

    assert.equal($popup.dxPopup("option", "visible"), false, "simulated datepicker is closed");
    support.inputType = originalInputType;
});

QUnit.test("simulated datepicker should not be draggable, T231481", function(assert) {
    var $dateBox = $("#dateBoxWithPicker").dxDateBox({
            pickerType: "native",
            deferRendering: false,
            opened: true
        }),
        $popup = $dateBox.find(".dx-popup"),
        popup = $popup.dxPopup("instance");

    assert.ok(!popup.option("dragEnabled"), "popup is not draggable");
});

QUnit.test("T204185 - dxDateBox input should be editable when pickerType is 'calendar'", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar"
        }),
        $input = $dateBox.find(".dx-texteditor-input");

    assert.ok(!$input.prop("readOnly"), "correct readOnly value");
});

QUnit.test("T204179 - dxDateBox should not render dropDownButton only for generic device when pickerType is 'native'", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            pickerType: "native"
        }),
        $dropDownButton = $dateBox.find(".dx-dropdowneditor-button"),
        expectedButtonsNumber = devices.real().platform === "generic" ? 0 : 1;

    assert.equal($dropDownButton.length, expectedButtonsNumber, "correct readOnly value");
});

QUnit.test("Datebox should set min and max attributes to the native input (T258860)", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "native",
            min: new Date(2015, 5, 2),
            max: new Date(2015, 7, 2)
        }),
        dateBox = $dateBox.dxDateBox("instance"),
        $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    assert.equal($input.attr("min"), "2015-06-02", "minimum date initialized correctly");
    assert.equal($input.attr("max"), "2015-08-02", "maximum date initialized correctly");

    dateBox.option({
        min: new Date(2015, 5, 3),
        max: new Date(2015, 7, 3)
    });

    $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    assert.equal($input.attr("min"), "2015-06-03", "minimum date changed correctly");
    assert.equal($input.attr("max"), "2015-08-03", "maximum date changed correctly");
});

QUnit.test("T195971 - popup is not showing after click on the 'clear' button", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "rollers",
            showClearButton: true
        }),
        dateBox = $dateBox.dxDateBox("instance"),
        $clearButton = $dateBox.find(".dx-clear-button-area");

    assert.ok(!dateBox.option("opened"), "popup is closed");
    $($clearButton).trigger("dxclick");
    assert.ok(!dateBox.option("opened"), "popup is still closed after click on clear button");
});

QUnit.test("T209347 - clear button should not be rendered if pickerType is 'native'", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "native",
            showClearButton: true,
            value: new Date()
        }),
        $clearButton = $dateBox.find(".dx-clear-button-area");

    assert.equal($clearButton.length, 0, "no clear buttons are rendered");
});

QUnit.test("invalid value should be cleared after clear button click", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        type: "date",
        pickerType: "calendar",
        showClearButton: true,
        focusStateEnabled: true
    });
    var instance = $dateBox.dxDateBox("instance");
    var $input = $dateBox.find(".dx-texteditor-input");
    var $clearButton = $dateBox.find(".dx-clear-button-area");

    $($input.val("asd")).trigger("change");
    $($clearButton).trigger("dxclick");

    assert.equal(instance.option("text"), "", "dateBox 'text' option is clear");
    assert.equal($input.val(), "", "dateBox input is empty");
});

QUnit.test("out of range value should not be marked as invalid on init", function(assert) {
    var $dateBox = $("#widthRootStyle").dxDateBox({
            value: new Date(2015, 3, 20),
            min: new Date(2014, 3, 20),
            max: new Date(2014, 4, 20)
        }),
        dateBox = $dateBox.dxDateBox("instance");

    assert.ok(dateBox.option("isValid"), "widget is valid");
});

QUnit.test("T252737 - the 'acceptCustomValue' option correct behavior", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        acceptCustomValue: false,
        valueChangeEvent: "change keyup",
        value: null,
        pickerType: "calendar"
    });

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    keyboardMock($input).type("2015/6/10");

    assert.equal($dateBox.dxDateBox("option", "value"), null, "value is not set");
    assert.equal($input.val(), "", "text is not rendered");
});

QUnit.test("T266206 - validation should be correct when max value is chosen", function(assert) {
    var dateBox = $("#dateBox").dxDateBox({
        min: new Date(2015, 6, 10),
        max: new Date(2015, 6, 14),
        value: new Date(2015, 6, 14, 15, 30)
    }).dxDateBox("instance");

    assert.ok(dateBox.option("isValid"), "datebox is valid");
});

QUnit.test("T278148 - picker type should be 'rollers' if the real device is phone in generic theme", function(assert) {
    var realDevice = devices.real();
    devices.real({ platform: "generic", deviceType: "phone" });

    try {
        var dateBox = $("<div>").dxDateBox({
            type: "date"
        }).dxDateBox("instance");
        assert.equal(dateBox.option("pickerType"), "rollers", "the 'pickerType' option is correct");
    } finally {
        devices.real(realDevice);
    }
});

QUnit.test("Customize 'Done' and 'Cancel' buttons", function(assert) {
    var expectedDoneText = "newDoneText";
    var expectedCancelText = "newCancelText";

    var $dateBox = $("#dateBox").dxDateBox({
        applyButtonText: expectedDoneText,
        cancelButtonText: expectedCancelText,
        type: "datetime",
        pickerType: "calendarWithTime",
        opened: true
    });

    var instance = $dateBox.dxDateBox("instance");
    var $popupButtons = instance._popup._$bottom;

    var realDoneText = $popupButtons.find(".dx-popup-done").text();
    var realCancelText = $popupButtons.find(".dx-popup-cancel").text();

    assert.equal(realDoneText, expectedDoneText, "done text customized correctly");
    assert.equal(realCancelText, expectedCancelText, "cancel text customized correctly");
});

QUnit.test("T378630 - the displayFormat should not be changed if the type option is set", function(assert) {
    var displayFormat = "Y",
        instance = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            displayFormat: displayFormat,
            type: "datetime",
            value: new Date(2016, 4, 13)
        }).dxDateBox("instance");

    assert.equal(instance.option("displayFormat"), displayFormat, "the displayFormat option is not changed");
});

QUnit.test("the 'displayFormat' option should accept format objects (T378753)", function(assert) {
    var date = new Date(2016, 4, 13, 22, 5);
    var format = {
        type: "longDate"
    };
    var $element = $("#dateBox").dxDateBox({
        value: date,
        pickerType: "calendar",
        displayFormat: format
    });

    var expectedDisplayValue = dateLocalization.format(date, format);
    assert.equal($element.find("." + TEXTEDITOR_INPUT_CLASS).val(), expectedDisplayValue, "correct display value");
});

QUnit.test("T437211: Custom dxDateBox value formatter is not called if the same value is typed twice", function(assert) {
    var date = new Date(2016, 4, 13, 22, 5);

    var format = {
        type: "longDate"
    };

    var $dateBox = $("#dateBox").dxDateBox({
        value: date,
        pickerType: "calendar",
        displayFormat: format
    });
    var instance = $dateBox.dxDateBox("instance");
    var expectedDisplayValue = dateLocalization.format(new Date(2016, 0, 1), format);

    var $input = $dateBox.find("input");

    $input.val("");
    $input.val("1/01/2016");
    $input.change();
    assert.equal(expectedDisplayValue, instance.option("text"), "input value was formatted");

    $input.val("");
    $input.val("1/01/2016");
    $input.change();

    assert.equal(expectedDisplayValue, instance.option("text"), "input value was formatted");
});


QUnit.module("hidden input");

QUnit.test("a hidden input should be rendered", function(assert) {
    var $element = $("#dateBox").dxDateBox(),
        $hiddenInput = $element.find("input[type='hidden']");

    assert.equal($hiddenInput.length, 1, "hidden input is rendered");
});

QUnit.test("the value should be passed to the hidden input on init", function(assert) {
    var dateValue = new Date(2016, 6, 15),
        type = "date",
        stringValue = uiDateUtils.toStandardDateFormat(dateValue, type),
        $element = $("#dateBox").dxDateBox({
            value: dateValue,
            type: type
        }),
        $hiddenInput = $element.find("input[type='hidden']");

    assert.equal($hiddenInput.val(), stringValue, "input value is correct after init");
});

QUnit.test("the value should be passed to the hidden input in the correct format", function(assert) {
    var dateValue = new Date(2016, 6, 15, 14, 30),
        types = ["datetime", "date", "time"],
        $element = $("#dateBox").dxDateBox({
            value: dateValue
        }),
        instance = $element.dxDateBox("instance");

    $.each(types, function(_, type) {
        var stringValue = uiDateUtils.toStandardDateFormat(dateValue, uiDateUtils.SUBMIT_FORMATS_MAP[type]);
        instance.option("type", type);
        assert.equal($element.find("input[type='hidden']").val(), stringValue, "input value is correct for the '" + type + "' format");
    });
});

QUnit.test("the value should be passed to the hidden input on widget value change", function(assert) {
    var type = "date",
        $element = $("#dateBox").dxDateBox({
            type: type
        }),
        instance = $element.dxDateBox("instance"),
        $hiddenInput = $element.find("input[type='hidden']"),
        expectedDateValue = new Date(2016, 6, 15),
        expectedStringValue = uiDateUtils.toStandardDateFormat(expectedDateValue, type);

    instance.option("value", expectedDateValue);
    assert.equal($hiddenInput.val(), expectedStringValue, "input value is correct after widget value change");
});


QUnit.module("the 'name' option");

QUnit.test("widget hidden input should get the 'name' attribute with a correct value", function(assert) {
    var expectedName = "some_name",
        $element = $("#dateBox").dxDateBox({
            name: expectedName
        }),
        $input = $element.find("input[type='hidden']");

    assert.equal($input.attr("name"), expectedName, "the input 'name' attribute has correct value");
});


QUnit.module("focus policy");

QUnit.test("dateBox should stay focused after value selecting in date strategy", function(assert) {
    assert.expect(1);

    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $dateBox = $("#dateBox").dxDateBox({
        type: "date",
        opened: true,
        focusStateEnabled: true
    });
    var instance = $dateBox.dxDateBox("instance");
    var $popupContent = $(instance._popup.content().parent());

    $($popupContent).on("mousedown", function(e) {
        assert.ok(e.isDefaultPrevented(), "datebox does not lose focus on overlay content clicking");
    });

    // NOTE: why we use not dxpointerdown (T241214)
    $($popupContent).trigger("mousedown");
});

QUnit.test("dateBox should stay focused after value selecting in time strategy", function(assert) {
    assert.expect(1);

    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $dateBox = $("#dateBox").dxDateBox({
            type: "time",
            opened: true,
            focusStateEnabled: true
        }),
        instance = $dateBox.dxDateBox("instance"),
        $popupContent = $(instance._popup.content().parent());

    $($popupContent).on("mousedown", function(e) {
        assert.ok(e.isDefaultPrevented(), "datebox does not lose focus on popup content clicking");
    });

    // NOTE: why we use not dxpointerdown (T241214)
    $($popupContent).trigger("mousedown");
});

QUnit.test("dateBox should stay focused after value selecting in datetime strategy", function(assert) {
    assert.expect(1);

    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            opened: true,
            focusStateEnabled: true
        }),
        instance = $dateBox.dxDateBox("instance"),
        $popupContent = $(instance._popup.content().parent());

    $($popupContent).on("mousedown", function(e) {
        assert.ok(e.isDefaultPrevented(), "datebox does not lose focus on popup content clicking");
    });

    // NOTE: why we use not dxpointerdown (T241214)
    $($popupContent).trigger("mousedown");
});

QUnit.test("calendar in datebox should not have tabIndex attribute", function(assert) {
    assert.expect(1);

    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            opened: true,
            focusStateEnabled: true
        }),
        instance = $dateBox.dxDateBox("instance"),
        $calendar = $(instance._popup.content().find(".dx-calendar"));

    assert.equal($calendar.attr("tabindex"), null, "calendar has not tabindex");
});

QUnit.testInActiveWindow("set focus on 'tab' key from editor to overlay and inversely", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            opened: true,
            focusStateEnabled: true
        }),
        instance = $dateBox.dxDateBox("instance"),
        $input = $dateBox.find(".dx-texteditor-input");

    var keyboard = keyboardMock($input);

    keyboard.keyDown("tab");

    var $hourBox = $(instance._strategy._timeView._hourBox.element()),
        $inputHourBox = instance._strategy._timeView._hourBox._input();
    assert.ok($hourBox.hasClass(STATE_FOCUSED_CLASS), "tab set focus to first input in overlay");

    $($inputHourBox).trigger($.Event("keydown", { which: 9, shiftKey: true }));

    assert.ok($dateBox.hasClass(STATE_FOCUSED_CLASS), "dateBox on focus reset focus to element");
});


QUnit.module("options changed callbacks", moduleConfig);

QUnit.test("value", function(assert) {
    var date = new Date(2012, 10, 26),
        mode = this.instance.option("mode");

    this.instance.option("value", date);
    assert.equal(this.$input().val(), getExpectedResult(date, mode, "2012-11-26"));

    date = new Date(2012, 11, 26);

    this.instance.option("value", date);
    assert.equal(this.$input().val(), getExpectedResult(date, mode, "2012-12-26"));
});

QUnit.test("type", function(assert) {
    var date = new Date(2012, 10, 26, 16, 40, 23);

    this.instance.option({
        value: date,
        type: "date"
    });
    assert.equal(this.$input().val(), getExpectedResult(date, this.instance.option("mode"), "2012-11-26"));

    this.instance.option("type", "time");
    assert.equal(this.$input().val(), getExpectedResult(date, this.instance.option("mode"), "16:40"));
});

QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    this.instance.option("onValueChanged", function() {
        assert.ok(true);
    });
    this.instance.option("value", new Date(2015, 6, 14));
});

QUnit.test("empty class toggle depending on value", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        value: null,
        pickerType: "calendar",
        type: "date"
    });
    var dateBox = $dateBox.dxDateBox("instance");

    assert.ok($dateBox.hasClass("dx-texteditor-empty"), "empty class attached when value is empty");

    dateBox.option("value", new Date());

    assert.ok(!$dateBox.hasClass("dx-texteditor-empty"), "empty class removed when value is not empty");
});

QUnit.test("T188238 - changing of type leads to strategy changing", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            value: new Date(),
            type: "date",
            pickerType: "calendar"
        }),
        dateBox = $dateBox.dxDateBox("instance");

    dateBox.open();
    assert.ok($dateBox.hasClass("dx-datebox-date"), "strategy is correct");
    assert.equal($(".dx-calendar").length, 1, "there is calendar in popup when type is 'date'");
    assert.equal($(".dx-timeview").length, 0, "there is no timeview in popup when type is 'date'");
    dateBox.close();

    dateBox.option("type", "datetime");
    dateBox.open();
    assert.ok($dateBox.hasClass("dx-datebox-datetime"), "strategy is changed");
    assert.equal($(".dx-calendar").length, 1, "there is calendar in popup when type is 'datetime'");
    assert.equal($(".dx-timeview").length, 1, "there is timeview in popup when type is 'datetime'");
});

QUnit.test("dxDateBox calendar popup should be closed after value is changed if applyValueMode='instantly' (T189022)", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        pickerType: "calendar",
        applyValueMode: "instantly"
    });

    var dateBox = $dateBox.dxDateBox("instance");
    dateBox.open();
    $(getInstanceWidget(dateBox).element().find(".dx-calendar-cell:not(.dx-calendar-selected-date)").eq(0)).trigger("dxclick");

    assert.ok(!dateBox.option("opened"), "dateBox popup is closed");
    assert.ok(!dateBox._popup.option("visible"), "popup is not visible");
});

QUnit.test("dxDateBox's value change doesn't lead to strategy's widget value change until popup is opened", function(assert) {
    var firstValue = new Date(2015, 0, 20),
        secondValue = new Date(2014, 4, 15),
        $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "date",
            value: firstValue
        }),
        dateBox = $dateBox.dxDateBox("instance");

    dateBox.open();
    dateBox.close();

    var calendar = getInstanceWidget(dateBox);

    assert.deepEqual(firstValue, calendar.option("value"), "values in datebox and calendar are the same");
    dateBox.option("value", secondValue);
    assert.deepEqual(firstValue, calendar.option("value"), "value in calendar isn't changed");
    dateBox.open();
    assert.deepEqual(secondValue, calendar.option("value"), "value in calendar is changed");
});

QUnit.test("dxDateBox's value change leads to strategy's widget value change if popup is opened", function(assert) {
    var firstValue = new Date(2015, 0, 20),
        secondValue = new Date(2014, 4, 15),
        $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "date",
            value: firstValue
        }),
        dateBox = $dateBox.dxDateBox("instance");

    dateBox.open();

    var calendar = getInstanceWidget(dateBox);

    assert.deepEqual(firstValue, calendar.option("value"), "values in datebox and calendar are the same");

    dateBox.option("value", secondValue);
    dateBox.open();
    assert.deepEqual(secondValue, calendar.option("value"), "value in calendar is changed");
});

QUnit.test("buttons are removed after applyValueMode option is changed", function(assert) {
    var dateBox = $("#dateBox").dxDateBox({
        type: "date",
        applyValueMode: "useButtons",
        pickerType: "calendar",
        value: new Date()
    }).dxDateBox("instance");

    dateBox.open();
    var $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

    assert.equal($buttons.length, 3, "two buttons are rendered");

    dateBox.close();
    dateBox.option("applyValueMode", "instantly");
    dateBox.open();
    $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

    assert.equal($buttons.length, 0, "no buttons are rendered");
});

QUnit.test("closeOnValueChange option still affects on buttons rendering", function(assert) {
    var dateBox = $("#dateBox").dxDateBox({
        type: "date",
        closeOnValueChange: false,
        pickerType: "calendar",
        value: new Date()
    }).dxDateBox("instance");

    dateBox.open();
    var $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

    assert.equal($buttons.length, 3, "two buttons are rendered");

    dateBox.close();
    dateBox.option("closeOnValueChange", true);
    dateBox.open();
    $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

    assert.equal($buttons.length, 0, "no buttons are rendered");
});


QUnit.module("merging dates", moduleConfig);

QUnit.test("incorrect work of mergeDates function (B237850)", function(assert) {
    this.instance.option("type", "date");
    this.instance.option("value", new Date(2000, 6, 31, 1, 1, 1));

    $(this.$input())
        .val("2000-09-10")
        .trigger("change");

    assert.deepEqual(this.instance.option("value"), new Date(2000, 8, 10, 1, 1, 1));
});

QUnit.test("incorrect work of mergeDates function if previous value not valid (Q568689)", function(assert) {
    this.instance.option("type", "time");

    $(this.$input())
        .val("")
        .trigger("change");

    assert.strictEqual(this.instance.option("value"), null);

    $(this.$input())
        .val("12:30")
        .trigger("change");

    var date = new Date(null);
    date.setHours(12, 30, 0);
    assert.deepEqual(this.instance.option("value"), date);
});


QUnit.module("dateView integration", {
    beforeEach: function() {
        fx.off = true;

        this.originalInputType = support.inputType;
        support.inputType = function() {
            return false;
        };
        moduleConfig.beforeEach.apply(this, arguments);
        this.instance.option("pickerType", "rollers");

        this.popup = $.proxy(function() {
            return this._popup;
        }, this.instance);

        this.popupTitle = function() {
            return this.popup()._$title.find(".dx-toolbar-label").text();
        };

        this.instance.open();

        this.dateView = function() {
            return getInstanceWidget(this.instance);
        };
    },
    afterEach: function() {
        moduleConfig.afterEach.apply(this, arguments);
        support.inputType = this.originalInputType;
        fx.off = false;
    }
});

QUnit.test("dateView renders", function(assert) {
    assert.equal(this.popup().content().find(".dx-dateview").length, 1);
});

QUnit.test("readOnly input prop should be always true to prevent keyboard open if simulated dateView is using", function(assert) {
    this.instance.option("readOnly", false);
    assert.ok(this.$element.find("." + TEXTEDITOR_INPUT_CLASS).prop("readOnly"), "readonly prop specified correctly");
});

QUnit.test("dateView shows on field click", function(assert) {
    assert.ok(this.instance.option("openOnFieldClick"));
});

QUnit.test("dateView 'minDate' and 'maxDate' matches dateBox 'min' and 'max' respectively", function(assert) {
    this.instance.option("min", new Date(2000, 1, 1));
    assert.deepEqual(this.dateView().option("minDate"), new Date(2000, 1, 1));

    this.instance.option("max", new Date(2001, 2, 2));
    assert.deepEqual(this.dateView().option("maxDate"), new Date(2001, 2, 2));
});

QUnit.test("dateView 'value' and 'type' matches dateBox 'value' and 'type' respectively", function(assert) {
    this.instance.option("value", new Date(2000, 1, 1));
    this.instance.open();
    assert.deepEqual(this.dateView().option("value"), new Date(2000, 1, 1));
    this.instance.close();

    this.instance.option("value", new Date(2000, 2, 2));
    this.instance.open();
    assert.deepEqual(this.dateView().option("value"), new Date(2000, 2, 2));
});

QUnit.test("dateView 'type' option matches dateBox 'type' option", function(assert) {
    this.instance.option("type", "datetime");
    this.instance.open();
    assert.equal(getInstanceWidget(this.instance).option("type"), "datetime");

    this.instance.option("type", "time");
    this.instance.open();
    assert.equal(getInstanceWidget(this.instance).option("type"), "time");
});

QUnit.test("dateView should not update dateBox value after closing using 'close' method", function(assert) {
    this.instance.option("value", new Date(2000, 1, 1));
    this.instance.open();

    this.dateView().option("value", new Date(2000, 2, 2));
    assert.deepEqual(this.instance.option("value"), new Date(2000, 1, 1));

    this.instance.close();
    assert.deepEqual(this.instance.option("value"), new Date(2000, 1, 1));
});

QUnit.test("render simulated dateView title when using option 'placeholder'", function(assert) {
    this.instance.option({
        placeholder: "test"
    });

    this.dateView().option({
        cancelButton: false
    });

    this.instance.open();
    assert.equal(this.popupTitle(), "test", "title in simulated dateView rendered correctly, when using option 'placeholder' in dateBox");

    this.instance.option("placeholder", "new title");
    assert.equal(this.popupTitle(), "new title", "option changed successfully");
});

QUnit.test("specify dataPicker title, dependent from 'type' option, when 'placeholder' option is not defined", function(assert) {
    this.instance.option({
        type: "date",
        placeholder: ""
    });

    this.dateView().option({
        cancelButton: false
    });

    this.instance.open();

    assert.equal(this.popupTitle(), messageLocalization.format("dxDateBox-simulatedDataPickerTitleDate"), "title set correctly when 'placeholder' option is not defined");

    this.instance.option("type", "time");
    this.instance.open();
    assert.equal(this.popupTitle(), messageLocalization.format("dxDateBox-simulatedDataPickerTitleTime"), "title changed successfully when type set in 'time'");

    this.instance.option("type", "datetime");
    this.instance.open();
    assert.equal(this.popupTitle(), messageLocalization.format("dxDateBox-simulatedDataPickerTitleDate"), "title changed successfully when type set in 'datetime'");

    this.instance.option("type", "date");
    this.instance.open();
    assert.equal(this.popupTitle(), messageLocalization.format("dxDateBox-simulatedDataPickerTitleDate"), "title changed successfully when type set in 'date'");
});

QUnit.test("cancel & done button action", function(assert) {
    var date = new Date(2012, 9, 10),
        minDate = new Date(2000, 1);

    this.instance.option({ min: minDate, value: date });

    var rollers = this.dateView()._rollers;
    rollers.day.option("selectedIndex", 12);
    rollers.month.option("selectedIndex", 10);
    rollers.year.option("selectedIndex", 2);

    $(this.popup().overlayContent()).find(".dx-popup-done.dx-button").trigger("dxclick");
    assert.deepEqual(this.instance.option("value"), new Date(2002, 10, 13));

    this.instance.open();

    rollers = this.dateView()._rollers;
    rollers.day.option("selectedIndex", 10);
    rollers.month.option("selectedIndex", 8);
    rollers.year.option("selectedIndex", 0);

    $(this.popup().overlayContent()).find(".dx-popup-cancel.dx-button").trigger("dxclick");
    assert.deepEqual(this.instance.option("value"), new Date(2002, 10, 13));
});

QUnit.test("specify dataPicker title, independent from 'type' option, when 'placeholder' option is defined", function(assert) {
    this.instance.option({
        type: "date",
        placeholder: "custom title"
    });

    this.instance.open();

    this.instance.option("type", "time");
    this.instance.open();
    assert.equal(this.popupTitle(), "custom title", "custom title set successfully when type has been changed");

    this.instance.option("placeholder", "");
    this.instance.open();
    assert.equal(this.popupTitle(), messageLocalization.format("dxDateBox-simulatedDataPickerTitleTime"), "title set successfully when 'placeholder' option set to ''");
});


QUnit.test("Native datebox should have specific class & button should have pointer-events:none", function(assert) {
    var $element = $("#dateBox").dxDateBox({
        pickerType: "native"
    });

    assert.ok($element.hasClass("dx-datebox-native"), "class is correct");
    assert.equal($element.dxDateBox("instance")._strategy.NAME, "Native", "correct strategy is chosen");

    assert.equal($element.find(".dx-texteditor-buttons-container").css("pointer-events"), "none");
});

QUnit.test("pickerType should be 'rollers' on android < 4.4 (Q588373, Q588012)", function(assert) {
    support.inputType = function() {
        return true;
    };

    var originalDevice;

    try {
        originalDevice = devices.real();
        devices.real({ platform: "android", version: [4, 3], android: true });

        var dateBox = $("#dateBox").dxDateBox().dxDateBox("instance");
        assert.ok(dateBox.option("pickerType") !== "native");
    } finally {
        support.inputType = this.originalInputType;
        devices.real(originalDevice);
    }
});

QUnit.test("pickerType should be 'native' on android >= 4.4 (Q588373, Q588012)", function(assert) {
    support.inputType = function() {
        return true;
    };

    var originalDevice;

    try {
        originalDevice = devices.real();
        devices.real({ platform: "android", deviceType: "phone", version: [4, 4, 2], android: true });

        var dateBox = $("#dateBoxWithPicker").dxDateBox().dxDateBox("instance");
        assert.ok(dateBox.option("pickerType") === "native");
    } finally {
        support.inputType = this.originalInputType;
        devices.real(originalDevice);
    }
});

QUnit.test("pickerType should not be 'native' on Win8", function(assert) {
    support.inputType = function() {
        return true;
    };

    var originalDevice = devices.real();
    devices.real({ platform: "win", win: true });

    var dateBox = $("#dateBox").dxDateBox().dxDateBox("instance");
    assert.ok(dateBox.option("pickerType") !== "native");

    support.inputType = this.originalInputType;
    devices.real(originalDevice);
});

QUnit.test("B230631 - Can not clear datebox field", function(assert) {
    this.instance.option({
        value: new Date(),
        type: "datetime"
    });

    this.instance.open();

    var kb = keyboardMock(this.$input());

    clearInput(this.$input(), kb);

    kb.change();

    assert.equal(this.$input().val(), "");
    assert.equal(this.instance.option("value"), undefined);
});

QUnit.test("B236537 - onValueChanged event does not fire", function(assert) {
    var valueUpdated = false;

    this.instance.option({
        onValueChanged: function() {
            valueUpdated = true;
        }
    });

    assert.ok(!valueUpdated);

    this.instance.option("value", new Date(2012, 10, 26, 16, 40, 23));

    assert.ok(valueUpdated);
});

QUnit.test("B251997 - date picker is shown in spite of 'readOnly' is true", function(assert) {
    var originalSupportInputType = support.inputType;

    support.inputType = function() {
        return false;
    };

    try {
        this.instance.option({
            readOnly: true,
            pickerType: "rollers"
        });

        assert.equal($(".dx-dateview").length, 0, "simulated picker is not created");

        this.instance.option({ readOnly: false });
        this.instance.open();

        assert.equal($(".dx-dateview").length, 1, "simulated picker is created");
        assert.ok(this.popup().content().find(".dx-dateview").is(":visible"), "picker is shown");
    } finally {
        support.inputType = originalSupportInputType;
    }
});

QUnit.test("Q559762 - input does not clear input value Samsung Android 4.1 devices", function(assert) {
    assert.equal(this.$input().attr("autocomplete"), "off");
});

QUnit.test("T170478 - no picker rollers should be chosen after click on 'cancel' button", function(assert) {
    var pointer = pointerMock($(".dx-dateviewroller").eq(0).find(".dx-scrollable-container"));

    assert.equal($(".dx-dateviewroller-current").length, 0, "no rollers are chosen after widget is opened first time");

    pointer.start().down().move(0, -20).up();
    assert.equal($(".dx-dateviewroller-current").length, 1, "one roller is chosen after scrolling");
    $(".dx-popup-cancel").trigger("dxclick");

    this.instance.open();
    assert.equal($(".dx-dateviewroller-current").length, 0, "no rollers are chosen after widget is opened second time");
});

QUnit.test("T207178 - error should not be thrown if value is null", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            value: null,
            pickerType: "rollers"
        }),
        dateBox = $dateBox.dxDateBox("instance");

    try {
        dateBox.open();
        assert.ok(true, "error is not thrown");
    } catch(e) {
        assert.ok(false, "error is thrown");
    }
});

QUnit.test("T319042 - input value should be correct if picker type is 'rollers' and 'type' is 'time'", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            value: new Date(0, 0, 0, 15, 32),
            pickerType: "rollers",
            type: "time"
        }),
        $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    assert.equal($input.val(), "3:32 PM", "input value is correct");
});

QUnit.test("the next value after null should have zero time components when type = 'date' (T407518)", function(assert) {
    var instance = $("#dateBox").dxDateBox({
        value: null,
        pickerType: "rollers",
        type: "date",
        opened: true
    }).dxDateBox("instance");

    $("." + DATEBOX_WRAPPER_CLASS).find(".dx-popup-done.dx-button").trigger("dxclick");

    var value = instance.option("value");
    assert.equal(value.getHours(), 0, "hours component is 0");
    assert.equal(value.getMinutes(), 0, "minutes component is 0");
    assert.equal(value.getSeconds(), 0, "seconds component is 0");
    assert.equal(value.getMilliseconds(), 0, "milliseconds component is 0");
});


QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#dateBox").dxDateBox();

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("component should have special css class when the user set the width option", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            width: 100
        }),
        component = $element.dxDateBox("instance");

    assert.notOk($element.hasClass(DX_AUTO_WIDTH_CLASS), "component has not class");

    component.option("width", undefined);
    assert.ok($element.hasClass(DX_AUTO_WIDTH_CLASS), "component has class");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            pickerType: "rollers",
            width: 400
        }),
        instance = $element.dxDateBox("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxDateBox(),
        instance = $element.dxDateBox("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            pickerType: "rollers"
        }),
        instance = $element.dxDateBox("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});

QUnit.test("dates should be merged correctly", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            value: new Date(2014, 10, 1, 11, 22),
            type: "date",
            pickerType: "native"
        }),
        instance = $element.dxDateBox("instance"),
        $input = $element.find("." + TEXTEDITOR_INPUT_CLASS);

    $input.val("2014-10-31");
    $input.triggerHandler("change");
    assert.equal(instance.option("value").valueOf(), new Date(2014, 9, 31, 11, 22).valueOf(), "date merged correctly");

    $input.val("2014-11-01");
    $input.triggerHandler("change");
    assert.equal(instance.option("value").valueOf(), new Date(2014, 10, 1, 11, 22).valueOf(), "date merged correctly");
});


QUnit.module("datebox and calendar integration");

QUnit.test("default", function(assert) {
    var $element = $("#dateBox").dxDateBox({ pickerType: "calendar" });

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#dateBox").dxDateBox({ pickerType: "calendar", width: 1234 }),
        instance = $element.dxDateBox("instance");

    assert.strictEqual(instance.option("width"), 1234);
    assert.strictEqual($element.outerWidth(), 1234, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxDateBox({ pickerType: "calendar" }),
        instance = $element.dxDateBox("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#dateBox").dxDateBox({ pickerType: "calendar" }),
        instance = $element.dxDateBox("instance"),
        customWidth = 1234;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});

QUnit.test("change input value should change calendar value", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        pickerType: "calendar",
        type: "date",
        value: new Date(2016, 1, 25)
    });
    $($dateBox.find(".dx-dropdowneditor-button")).trigger("dxclick");

    var dateBox = $dateBox.dxDateBox("instance");
    var calendar = $(".dx-calendar").dxCalendar("instance");

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    var dateString = $input.val();
    dateString = dateString.slice(0, -1) + String(new Date().getYear() - 1).slice(-1);

    $input.val("");
    keyboardMock($input).type(dateString);
    $($input).trigger("change");

    assert.deepEqual(calendar.option("value"), dateBox.option("value"), "datebox value and calendar value are equal");
    assert.strictEqual(dateBox.option("isValid"), true, "Editor should be marked as true");
    assert.strictEqual(dateBox.option("validationError"), null, "No validation error should be specified for valid input");
});

QUnit.test("wrong value in input should mark datebox as invalid", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            value: null,
            type: "date",
            pickerType: "calendar"
        }),
        dateBox = $dateBox.dxDateBox("instance"),
        $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    keyboardMock($input).type("blabla");
    $($input).trigger("change");
    assert.equal($input.val(), "blabla", "input value should not be erased");
    assert.strictEqual(dateBox.option("value"), null, "Editor's value should be reset");
    assert.strictEqual(dateBox.option("isValid"), false, "Editor should be marked as invalid");
    var validationError = dateBox.option("validationError");
    assert.ok(validationError, "Validation error should be specified");
    assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
});

QUnit.test("wrong value in input should mark time datebox as invalid", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            value: null,
            type: "time",
            pickerType: "calendar"
        }),
        dateBox = $dateBox.dxDateBox("instance"),
        $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    keyboardMock($input).type("blabla");
    $($input).trigger("change");

    assert.equal($input.val(), "blabla", "input value should not be erased");
    assert.strictEqual(dateBox.option("value"), null, "Editor's value should be reset");
    assert.strictEqual(dateBox.option("isValid"), false, "Editor should be marked as invalid");
    var validationError = dateBox.option("validationError");
    assert.ok(validationError, "Validation error should be specified");
    assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
});

QUnit.test("wrong value in input should mark pre-filled datebox as invalid", function(assert) {
    var value = new Date(2013, 2, 2),
        $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            value: new Date(value),
            pickerType: "calendar"
        }),
        dateBox = $dateBox.dxDateBox("instance"),
        $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    $input.val("");
    keyboardMock($input).type("blabla");
    $($input).trigger("change");

    assert.equal($input.val(), "blabla", "input value should not be erased");
    assert.deepEqual(dateBox.option("value"), value, "Editor's value should not be changed");
    assert.strictEqual(dateBox.option("isValid"), false, "Editor should be marked as invalid");

    var validationError = dateBox.option("validationError");
    assert.ok(validationError, "Validation error should be specified");
    assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
});

QUnit.test("correct value in input should mark datebox as valid but keep text", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            value: null,
            type: "date",
            pickerType: "calendar"
        }),
        dateBox = $dateBox.dxDateBox("instance"),
        $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS),
        keyboard = keyboardMock($input);

    keyboard
        .type("blabla")
        .change();

    $input.val("");
    keyboard
        .type("3/2/2014")
        .change();

    assert.equal($input.val(), "3/2/2014", "input value should not be erased");
    assert.deepEqual(dateBox.option("value"), new Date(2014, 2, 2), "Editor's value should be set");
    assert.strictEqual(dateBox.option("isValid"), true, "Editor should be marked as valid");
    assert.strictEqual(dateBox.option("validationError"), null, "No validation error should be specified for valid input");
});

QUnit.test("calendar picker should be used on generic device by default and 'type' is 'date'", function(assert) {
    var currentDevice = devices.current();
    devices.current({ platform: "generic", deviceType: "desktop" });

    try {
        var $dateBox = $("#dateBox").dxDateBox(),
            instance = $dateBox.dxDateBox("instance");

        assert.equal(instance.option("pickerType"), "calendar");
        assert.equal(instance._strategy.NAME, "Calendar");
    } finally {
        devices.current(currentDevice);
    }
});

QUnit.test("calendar picker should not be used on generic device by default and 'type' is not 'date'", function(assert) {
    var currentDevice = devices.current();
    devices.current({ platform: "generic", deviceType: "desktop" });

    try {
        var $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "time"
        });
        assert.ok(!$dateBox.hasClass(DATEBOX_CLASS + "-calendar"));
    } finally {
        devices.current(currentDevice);
    }
});

QUnit.test("calendar picker should not be used on mobile device by default", function(assert) {
    var currentDevice = devices.current();
    devices.current({ platform: "android" });

    try {
        var $dateBox = $("#dateBox").dxDateBox();
        assert.ok(!$dateBox.hasClass(DATEBOX_CLASS + "-calendar"));
    } finally {
        devices.current(currentDevice);
    }
});

QUnit.test("correct default value for 'minZoomLevel' option", function(assert) {
    var instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            opened: true
        }).dxDateBox("instance"),
        calendar = getInstanceWidget(instance);

    assert.equal(calendar.option("minZoomLevel"), instance.option("minZoomLevel"), "'minZoomLevel' option value is correct");
});

QUnit.test("correct default value for 'maxZoomLevel' option", function(assert) {
    var instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            opened: true
        }).dxDateBox("instance"),
        calendar = getInstanceWidget(instance);

    assert.equal(calendar.option("maxZoomLevel"), instance.option("maxZoomLevel"), "'maxZoomLevel' option value is correct");
});

QUnit.test("DateBox 'minZoomLevel' option should affect on Calendar 'minZoomLevel' option", function(assert) {
    var instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            minZoomLevel: "year",
            opened: true
        }).dxDateBox("instance"),
        calendar = getInstanceWidget(instance);

    assert.equal(calendar.option("minZoomLevel"), instance.option("minZoomLevel"), "calendar 'minZoomLevel' option is correct on init");

    instance.close();
    instance.option("minZoomLevel", "month");
    instance.open();
    calendar = getInstanceWidget(instance);

    assert.equal(calendar.option("minZoomLevel"), instance.option("minZoomLevel"), "calendar 'minZoomLevel' option after dateBox option change");
});

QUnit.test("DateBox 'maxZoomLevel' option should affect on Calendar 'maxZoomLevel' option", function(assert) {
    var instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            maxZoomLevel: "century",
            opened: true
        }).dxDateBox("instance"),
        calendar = getInstanceWidget(instance);

    assert.equal(calendar.option("maxZoomLevel"), instance.option("maxZoomLevel"), "calendar 'maxZoomLevel' option is correct on init");

    instance.close();
    instance.option("maxZoomLevel", "year");
    instance.open();
    calendar = getInstanceWidget(instance);

    assert.equal(calendar.option("maxZoomLevel"), instance.option("maxZoomLevel"), "calendar 'maxZoomLevel' option after dateBox option change");
});

QUnit.test("T208534 - calendar value should depend on datebox text option", function(assert) {
    var instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            valueChangeEvent: "keyup"
        }).dxDateBox("instance"),
        kb = keyboardMock(instance._input());

    kb
        .press('end')
        .press('backspace')
        .type('4');

    instance.open();
    assert.deepEqual(new Date(2014, 4, 12), instance._strategy._widget.option("value"), "calendar value is correct");
});

QUnit.test("calendar value should depend on datebox text option when calendar is opened", function(assert) {
    var instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            valueChangeEvent: 'keyup',
            opened: true
        }).dxDateBox("instance"),
        kb = keyboardMock(instance._input()),
        calendar = instance._strategy._widget;

    kb
        .press('end')
        .press('backspace')
        .type('4');

    assert.deepEqual(new Date(2014, 4, 12), calendar.option("value"), "calendar value is correct");

    kb.press('backspace');
    assert.deepEqual(new Date(2014, 4, 12), calendar.option("value"), "calendar value is correct");

    kb.type('3');
    assert.deepEqual(new Date(2013, 4, 12), calendar.option("value"), "calendar value is correct");
});

QUnit.test("changing 'displayFormat' should update input value", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        value: new Date('03/10/2015'),
        pickerType: 'calendar',
        type: 'date'
    });
    var dateBox = $dateBox.dxDateBox("instance");
    dateBox.option("displayFormat", "shortDateShortTime");

    assert.equal($dateBox.find("." + TEXTEDITOR_INPUT_CLASS).val(), "3/10/2015, 12:00 AM", "input value is updated");
});

QUnit.test("disabledDates correctly displays", function(assert) {

    var instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            disabledDates: [new Date(2015, 4, 13)],
            opened: true
        }).dxDateBox("instance"),
        calendar = getInstanceWidget(instance),
        $disabledCell = calendar.element().find(".dx-calendar-empty-cell");

    assert.equal($disabledCell.length, 1, "There is one disabled cell");
    assert.equal($disabledCell.text(), "13", "Correct cell is disabled");
});

QUnit.test("disabledDates correctly displays after optionChanged", function(assert) {
    var instance = $("#dateBox").dxDateBox({
        type: "date",
        pickerType: "calendar",
        value: new Date(2015, 4, 12),
        disabledDates: [new Date(2015, 4, 13)],
        opened: true
    }).dxDateBox("instance");

    instance.option("disabledDates", function(e) {
        if(e.date.getDate() === 14 && e.date.getMonth() === 3) {
            return true;
        }
    });

    var calendar = getInstanceWidget(instance),
        $disabledCell = calendar.element().find(".dx-calendar-empty-cell");

    assert.equal($disabledCell.length, 1, "There is one disabled cell");
    assert.equal($disabledCell.text(), "14", "Correct cell is disabled");
});

QUnit.test("disabledDates argument contains correct component parameter", function(assert) {
    var stub = sinon.stub();

    $("#dateBox").dxDateBox({
        type: "date",
        pickerType: "calendar",
        value: new Date(2015, 4, 12),
        disabledDates: stub,
        opened: true
    });

    var component = stub.lastCall.args[0].component;
    assert.equal(component.NAME, "dxDateBox", "Correct component");
});


QUnit.module("datebox w/ calendar", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(new Date().valueOf());
        fx.off = true;

        this.fixture = new DevExpress.ui.testing.DateBoxFixture("#dateBox", {
            value: currentDate,
            calendarOptions: {
                currentDate: currentDate,
                firstDayOfWeek: firstDayOfWeek
            },
            pickerType: "calendar"
        });
    },
    reinitFixture: function(options) {
        this.fixture.dispose();
        this.fixture = new DevExpress.ui.testing.DateBoxFixture("#dateBox", options);
    },
    afterEach: function() {
        this.fixture.dispose();
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("DateBox is defined", function(assert) {
    assert.ok(this.fixture.dateBox);
});

QUnit.test("DateBox can be instantiated", function(assert) {
    assert.ok(this.fixture.dateBox instanceof DateBox);
});

QUnit.test("DateBox must render an input", function(assert) {
    assert.ok(this.fixture.input.length);
});

QUnit.test("open must set 'opened' option", function(assert) {
    assert.ok(!this.fixture.dateBox.option("opened"));
    this.fixture.dateBox.open();
    assert.ok(this.fixture.dateBox.option("opened"));
});

QUnit.test("calendarOptions must be passed to dxCalendar on initialization", function(assert) {
    this.fixture.dateBox.open();
    currentDate.setDate(1);
    assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("currentDate"), currentDate);
    assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("firstDayOfWeek"), firstDayOfWeek);
});

QUnit.test("Clicking _calendarContainer must not close dropDown", function(assert) {
    this.fixture.dateBox.open();
    pointerMock(this.fixture.dateBox._calendarContainer).click();
    assert.ok(this.fixture.dateBox.option("opened"));
});

QUnit.test("DateBox must update the input value when the value option changes", function(assert) {
    var date = new Date(2011, 11, 11);
    this.fixture.dateBox.option("value", date);
    assert.deepEqual(this.fixture.input.val(), dateLocalization.format(date, this.fixture.format));
});

QUnit.test("DateBox must immediately display 'value' passed via the constructor on rendering", function(assert) {
    var date = new Date(2010, 10, 10);

    this.reinitFixture({
        value: date,
        calendarOptions: { currentDate: currentDate, firstDayOfWeek: firstDayOfWeek },
        pickerType: "calendar"
    });

    assert.deepEqual(this.fixture.input.val(), dateLocalization.format(date, this.fixture.format));
});

QUnit.test("DateBox must pass value to calendar correctly if value is empty string", function(assert) {


    this.reinitFixture({
        value: '',
        pickerType: 'calendar',
        opened: true
    });

    assert.equal(this.fixture.dateBox._strategy._widget.option("value"), null, "value is correctly");
});

QUnit.test("DateBox must show the calendar with a proper date selected", function(assert) {
    var date = new Date(2011, 11, 11);
    this.fixture.dateBox.option("value", date);
    this.fixture.dateBox.open();
    assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("value"), date);
});

QUnit.test("DateBox must update its value when a date is selected in the calendar when applyValueMode='instantly'", function(assert) {
    var date = new Date(2011, 11, 11);

    this.reinitFixture({
        applyValueMode: "instantly",
        pickerType: "calendar"
    });

    this.fixture.dateBox.open();
    getInstanceWidget(this.fixture.dateBox).option("value", date);
    //this.fixture.dateBox.close();
    assert.strictEqual(this.fixture.dateBox.option("value"), date);
});

QUnit.test("DateBox must update the calendar value when the CalendarPicker.option('value') changes", function(assert) {
    this.reinitFixture({
        applyValueMode: "useButtons",
        pickerType: "calendar",
    });

    var date = new Date(2011, 11, 11);
    this.fixture.dateBox.open();
    this.fixture.dateBox.option("value", date);
    assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("value"), date);
});

QUnit.test("When typing a correct date, dateBox must not make a redundant _setInputValue call", function(assert) {
    var _setInputValueCallCount = 0,
        mockSetInputValue = function() {
            ++_setInputValueCallCount;
        };
    this.fixture.dateBox._setInputValue = mockSetInputValue;
    this.fixture.dateBox.open();
    this.fixture.typeIntoInput("11/11/2011", this.fixture.input);
    assert.strictEqual(_setInputValueCallCount, 0);
});

QUnit.test("Swiping must not close the calendar", function(assert) {
    $(this.fixture.dateBox._input()).focus();
    if(browser.msie && browser.version < 11) {
        $(this.fixture.dateBox._input()).focus();
    }
    this.fixture.dateBox.open();
    pointerMock(this.fixture.dateBox._strategy._calendarContainer).start().swipeStart().swipeEnd(1);
    assert.ok(this.fixture.dateBox._input()[0] === document.activeElement);
});

QUnit.test("Pressing escape must hide the calendar and clean focus", function(assert) {
    var escapeKeyDown = $.Event("keydown", { which: 27 });
    this.fixture.dateBox.option("focusStateEnabled", true);
    this.fixture.dateBox.open();
    $(this.fixture.dateBox._input()).trigger(escapeKeyDown);
    assert.ok(!this.fixture.dateBox.option("opened"));
    assert.ok(!this.fixture.dateBox._input().is(":focus"));
});

QUnit.test("dateBox must show the calendar with proper LTR-RTL mode", function(assert) {
    this.fixture.dateBox.option("rtlEnabled", true);
    this.fixture.dateBox.open();
    assert.ok(getInstanceWidget(this.fixture.dateBox).option("rtlEnabled"));
});

QUnit.test("dateBox should not reposition the calendar icon in RTL mode", function(assert) {
    var iconRepositionCount = 0,
        _repositionCalendarIconMock = function() {
            ++iconRepositionCount;
        };
    this.fixture.dateBox._repositionCalendarIcon = _repositionCalendarIconMock;
    this.fixture.dateBox.option("rtl", true);
    assert.strictEqual(iconRepositionCount, 0);
});

QUnit.test("dateBox must apply the wrapper class with appropriate picker typ\ to the drop-down overlay wrapper", function(assert) {
    var dateBox = this.fixture.dateBox;
    dateBox.open();
    assert.ok(this.fixture.dateBox._popup._wrapper().hasClass(DATEBOX_WRAPPER_CLASS + "-" + dateBox.option("pickerType")));
});

QUnit.test("dateBox must correctly reopen the calendar after refreshing when it was not hidden beforehand", function(assert) {
    this.fixture.dateBox.open();
    this.fixture.dateBox._refresh();
    assert.ok(this.fixture.dateBox._$popup.dxPopup("instance").option("visible"));
});

QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    this.fixture.dateBox.option("onValueChanged", function() {
        assert.ok(true);
    });
    this.fixture.dateBox.option("value", new Date(2015, 6, 14));
});

QUnit.test("ValueChanged action should have jQuery event as a parameter when value was changed by user interaction", function(assert) {
    var valueChangedHandler = sinon.stub();

    this.fixture.dateBox.option({
        onValueChanged: valueChangedHandler,
        opened: true
    });

    $(".dx-calendar-cell").eq(0).trigger("dxclick");

    assert.deepEqual(this.fixture.dateBox.option("value"), new Date(2015, 10, 29), "value has been changed");
    assert.ok(valueChangedHandler.getCall(0).args[0].jQueryEvent, "jQueryEvent is defined");
});

QUnit.test("valueChangeEvent cache should be cleared after the value changing", function(assert) {
    var valueChangedHandler = sinon.stub();

    this.fixture.dateBox.option({
        onValueChanged: valueChangedHandler,
        opened: true
    });

    $(".dx-calendar-cell").eq(0).trigger("dxclick");
    this.fixture.dateBox.option("value", new Date());

    assert.equal(valueChangedHandler.callCount, 2, "valueChangeEventHandler was called 2 times");
    assert.ok(valueChangedHandler.getCall(0).args[0].jQueryEvent, "jqueryEvent exists in first call via user interaction");
    assert.notOk(valueChangedHandler.getCall(1).args[0].jQueryEvent, "jqueryEvent does not exist in second call via api");
});

QUnit.test("dateBox's 'min' and 'max' options equal to undefined (T171537)", function(assert) {
    assert.strictEqual(this.fixture.dateBox.option("min"), undefined);
    assert.strictEqual(this.fixture.dateBox.option("max"), undefined);
});

QUnit.test("dateBox must pass min and max to the created calendar", function(assert) {
    var min = new Date(2010, 9, 10),
        max = new Date(2010, 11, 10);
    this.reinitFixture({
        min: min,
        max: max,
        pickerType: "calendar"
    });
    this.fixture.dateBox.open();
    assert.ok(dateUtils.dateInRange(getInstanceWidget(this.fixture.dateBox).option("currentDate"), min, max));
});

QUnit.test("dateBox should not change value when setting to an earlier date than min; and setting to a later date than max", function(assert) {
    var min = new Date(2010, 10, 5),
        max = new Date(2010, 10, 25),
        earlyDate = new Date(min.getFullYear(), min.getMonth(), min.getDate() - 1),
        lateDate = new Date(max.getFullYear(), max.getMonth(), max.getDate() + 1);

    this.reinitFixture({
        min: min,
        max: max,
        pickerType: "calendar"
    });

    this.fixture.dateBox.option("value", earlyDate);
    assert.deepEqual(this.fixture.dateBox.option("value"), earlyDate);

    this.fixture.dateBox.option("value", lateDate);
    assert.deepEqual(this.fixture.dateBox.option("value"), lateDate);
});

QUnit.test("In dateTime strategy buttons should be placed in popup bottom", function(assert) {
    this.reinitFixture({
        type: "datetime",
        applyValueMode: "useButtons",
        pickerType: "calendar"
    });

    this.fixture.dateBox.open();

    assert.equal($(".dx-popup-bottom .dx-button").length, 3, "two buttons is in popup bottom");
});

QUnit.test("Click on apply button", function(assert) {
    var onValueChangedHandler = sinon.spy(noop),
        newDate = new Date(2010, 10, 10);

    this.reinitFixture({
        onValueChanged: onValueChangedHandler,
        applyValueMode: "useButtons",
        pickerType: "calendar"
    });
    this.fixture.dateBox.open();
    getInstanceWidget(this.fixture.dateBox).option("value", newDate);
    $(".dx-popup-done.dx-button").eq(0).trigger("dxclick");
    assert.equal(this.fixture.dateBox.option("opened"), false);
    assert.deepEqual(this.fixture.dateBox.option("value"), newDate);
    assert.ok(onValueChangedHandler.calledOnce);
});

QUnit.test("Click on cancel button", function(assert) {
    var onValueChangedHandler = sinon.spy(noop),
        oldDate = new Date(2008, 8, 8),
        newDate = new Date(2010, 10, 10);

    this.reinitFixture({
        value: oldDate,
        onValueChanged: onValueChangedHandler,
        applyValueMode: "useButtons",
        pickerType: "calendar"
    });

    this.fixture.dateBox.open();
    getInstanceWidget(this.fixture.dateBox).option("value", newDate);
    $(".dx-popup-cancel.dx-button").eq(0).trigger("dxclick");

    assert.equal(this.fixture.dateBox.option("opened"), false);
    assert.equal(this.fixture.dateBox.option("value"), oldDate);
    assert.ok(!onValueChangedHandler.calledOnce);
});

QUnit.test("calendar does not open on field click (T189394)", function(assert) {
    assert.ok(!this.fixture.dateBox.option("openOnFieldClick"));
});


var getLongestCaptionIndex = uiDateUtils.getLongestCaptionIndex,
    getLongestDate = uiDateUtils.getLongestDate;

QUnit.test("getLongestDate must consider the possibility of overflowing to the next month from its 28th day and thus losing the longest month name when calculating widths for formats containing day and month names", function(assert) {
    var someLanguageMonthNames = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "22", "1", "1"],
        someLanguageDayNames = ["1", "1", "1", "1", "22", "1", "1"],
        longestMonthNameIndex = getLongestCaptionIndex(someLanguageMonthNames),
        longestDate = getLongestDate("D", someLanguageMonthNames, someLanguageDayNames);
    assert.strictEqual(longestDate.getMonth(), longestMonthNameIndex);
});

QUnit.test("Calendar should update it value accordingly 'text' option if it is valid (T189474)", function(assert) {
    var date = new Date(2014, 5, 10);

    this.reinitFixture({
        value: date,
        pickerType: "calendar"
    });

    this.fixture.dateBox.open();

    keyboardMock(this.fixture.input)
        .press("end")
        .press("backspace")
        .type("5");

    this.fixture.input.trigger("change");
    this.fixture.dateBox.open();

    var calendar = getInstanceWidget(this.fixture.dateBox);
    assert.deepEqual(calendar.option("value"), new Date(2015, 5, 10));
});

QUnit.test("Calendar should not be closed after datebox value has been changed by input", function(assert) {
    var date = new Date(2014, 5, 10);

    this.reinitFixture({
        value: date,
        applyValueMode: "useButtons",
        pickerType: "calendar"
    });

    this.fixture.dateBox.open();

    keyboardMock(this.fixture.input)
        .press("end")
        .press("backspace")
        .type("5");

    this.fixture.input.trigger("change");

    var calendar = getInstanceWidget(this.fixture.dateBox);
    assert.deepEqual(calendar.option("value"), new Date(2015, 5, 10));
    assert.ok(this.fixture.dateBox.option("opened"));
});

QUnit.test("Value should be changed only after click on 'Apply' button if the 'applyValueMode' options is changed to 'useButtons'", function(assert) {
    var value = new Date(2015, 0, 20),
        newValue = new Date(2015, 0, 30);

    var dateBox = this.fixture.dateBox;

    dateBox.option("value", value);
    dateBox.open();
    dateBox.close();
    dateBox.option("applyValueMode", "useButtons");

    dateBox.open();
    var calendar = getInstanceWidget(dateBox),
        $applyButton = dateBox._popup._wrapper().find(".dx-popup-done.dx-button").eq(0);

    calendar.option("value", newValue);
    assert.deepEqual(dateBox.option("value"), value, "value is not changed yet");

    $($applyButton).trigger("dxclick");
    assert.deepEqual(dateBox.option("value"), newValue, "value is changed after click");
});

QUnit.test("Value should be changed if it was entered from keyboard and it is out of range", function(assert) {
    var value = new Date(2015, 0, 15),
        min = new Date(2015, 0, 10),
        max = new Date(2015, 0, 20);

    this.reinitFixture({
        value: value,
        min: min,
        max: max,
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox,
        $input = $(dateBox.element().find(".dx-texteditor-input")),
        kb = keyboardMock($input),
        inputValue = "1/5/2015";

    clearInput($input, kb);
    kb.type(inputValue).change();
    assert.equal($input.val(), inputValue, "input value is correct");
    assert.deepEqual(dateBox.option("value"), value, "value has not been changed");
    assert.ok(!dateBox.option("isValid"), "datebox value is invalid");

    var validationError = dateBox.option("validationError");
    assert.ok(validationError, "Validation error should be specified");
    assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
});

QUnit.test("Empty value should not be marked as 'out of range'", function(assert) {
    var value = new Date(2015, 0, 15),
        min = new Date(2015, 0, 10),
        max = new Date(2015, 0, 20);

    this.reinitFixture({
        value: value,
        min: min,
        max: max,
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox,
        $input = $(dateBox.element().find(".dx-texteditor-input")),
        kb = keyboardMock($input);

    clearInput($input, kb);
    kb.change();
    assert.ok(dateBox.option("isValid"), "isValid flag should be set");
    assert.ok(!dateBox.option("validationError"), "validationError should not be set");
});

QUnit.test("Popup should not be hidden after value change using keyboard", function(assert) {
    var value = new Date(2015, 0, 29);

    this.reinitFixture({
        type: "date",
        value: value,
        closeOnValueChange: true,
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox,
        $input = $(dateBox.element().find(".dx-texteditor-input")),
        kb = keyboardMock($input);

    dateBox.open();
    assert.equal($input.val(), "1/29/2015", "correct input value");

    kb
        .press("end")
        .press("backspace")
        .type("6")
        .change();

    assert.equal($input.val(), "1/29/2016", "input value is changed");
    assert.ok(dateBox.option("opened"), "popup is still opened");
});

QUnit.test("T196443 - dxDateBox should not hide popup after erase date in input field", function(assert) {
    var value = new Date(2015, 0, 30);

    this.reinitFixture({
        value: value,
        min: null,
        max: null,
        type: "date",
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox,
        $input = dateBox._input(),
        kb = keyboardMock($input);

    dateBox.open();
    kb.press("end");

    for(var i = 0; i < 10; i++) {
        kb.press("backspace");
    }

    assert.deepEqual(dateBox.option("value"), value, "datebox value is not changed");
    assert.ok(dateBox.option("opened"), "popup is still opened");
});

QUnit.test("T203457 - popup should be closed when selected date is clicked", function(assert) {
    var value = new Date(2015, 1, 1);

    this.reinitFixture({
        value: value,
        min: null,
        max: null,
        type: "date",
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox;
    dateBox.open();
    var $selectedDate = dateBox._popup._wrapper().find(".dx-calendar-selected-date");
    $($selectedDate).trigger("dxclick");

    assert.ok(!dateBox.option("opened"), "popup is closed");
});

QUnit.test("T208825 - tapping on the 'enter' should change value if popup is opened", function(assert) {
    var value = new Date(2015, 2, 13);

    this.reinitFixture({
        value: value,
        focusStateEnabled: true,
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox,
        $input = dateBox._input(),
        kb = keyboardMock($input);

    dateBox.option("valueChangeEvent", "keyup");
    dateBox.open();

    kb
        .press('end')
        .press('backspace')
        .type('4')
        .press('enter');

    assert.deepEqual(dateBox.option("value"), new Date(2014, 2, 13), "value is changed");
});

QUnit.test("Close popup on the 'enter' press after input value is changed", function(assert) {
    var value = new Date(2015, 2, 10);

    this.reinitFixture({
        value: value,
        focusStateEnabled: true,
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox;

    dateBox.open();

    keyboardMock(dateBox._input())
        .press('end')
        .press('backspace')
        .type('4')
        .press('enter');

    assert.equal(dateBox.option("opened"), false, "popup is still opened");
});

QUnit.test("repaint was fired if strategy is fallback", function(assert) {
    this.reinitFixture({
        useNative: false,
        useCalendar: true,
        type: "datetime",
        pickerType: "calendarWithTime",
        opened: true
    });

    var dateBox = this.fixture.dateBox;
    var popup = dateBox.element().find(".dx-popup").dxPopup("instance");
    var repaintSpy = sinon.spy(popup, "repaint");

    this.clock.tick();

    assert.ok(repaintSpy.called, "repaint was fired on opened");
});

QUnit.test("changing type from 'datetime' to 'date' should lead to strategy changing", function(assert) {
    this.reinitFixture({
        type: "datetime",
        pickerType: "calendar"
    });

    var dateBox = this.fixture.dateBox;
    assert.equal(dateBox._strategy.NAME, "CalendarWithTime", "correct strategy for the 'datetime' type");

    dateBox.option("type", "date");
    assert.equal(dateBox._strategy.NAME, "Calendar", "correct strategy for the 'date' type");
});

QUnit.test("T247493 - value is cleared when text is changed to invalid date and popup is opened", function(assert) {
    var date = new Date(2015, 5, 9);

    this.reinitFixture({
        pickerType: "calendar",
        value: date
    });

    var dateBox = this.fixture.dateBox,
        $element = $(dateBox.element()),
        $input = $element.find(".dx-texteditor-input"),
        kb = keyboardMock($input);

    kb
        .press('end')
        .press('backspace');

    dateBox.open();
    assert.deepEqual(dateBox.option("value"), date, "value is correct");
    assert.equal($input.val(), "6/9/201", "input value is correct");
});

QUnit.test("T252170 - date time should be the same with set value after calendar value is changed", function(assert) {
    var date = new Date(2015, 5, 9, 15, 54, 13);

    this.reinitFixture({
        pickerType: "calendar",
        type: "date",
        value: date
    });

    var dateBox = this.fixture.dateBox;
    dateBox.open();
    var calendar = dateBox._strategy._widget,
        $calendar = $(calendar.element());

    $($calendar.find(".dx-calendar-cell[data-value='2015/06/10']")).trigger("dxclick");
    assert.deepEqual(calendar.option("value"), new Date(2015, 5, 10, 15, 54, 13), "new calendar value saves set value time");
    assert.deepEqual(dateBox.option("value"), new Date(2015, 5, 10, 15, 54, 13), "new datebox value saves set value time");
});

QUnit.test("calendar views should be positioned correctly", function(assert) {
    $("#dateBox").dxDateBox({
        type: "date",
        pickerType: "calendar",
        value: new Date(2015, 4, 12),
        opened: true
    });


    var $calendarViews = $(".dx-popup-wrapper .dx-calendar-views-wrapper .dx-widget"),
        viewWidth = $calendarViews.eq(0).width();

    assert.equal($calendarViews.eq(0).position().left, 0, "main view is at 0");
    assert.equal($calendarViews.eq(1).position().left, -viewWidth, "before view is at the left");
    assert.equal($calendarViews.eq(2).position().left, viewWidth, "after view is at the right");
});

QUnit.test("Popup with calendar strategy should be use 'flipfit flip' strategy", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        type: "date",
        pickerType: "calendar",
        value: new Date(),
        deferRendering: true
    });

    $dateBox.dxDateBox("option", "popupPosition", { my: "bottom left" });

    $dateBox.dxDateBox("option", "opened", true);

    var popup = $dateBox.find(".dx-popup").dxPopup("instance");

    assert.equal(popup.option("position").collision, "flipfit flip", "collision set correctly");
    assert.equal(popup.option("position").my, "bottom left", "position is saved");
});

QUnit.test("Popup with calendarWithTime strategy should be use 'flipfit flip' strategy", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        type: "datetime",
        pickerType: "calendar",
        value: new Date(),
        opened: true
    });

    assert.equal($dateBox.find(".dx-popup").dxPopup("option", "position").collision, "flipfit flip", "collision set correctly");
});

QUnit.test("DateBox should not take current date value at the opening if value is null", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        value: null,
        pickerType: "calendar"
    });

    var instance = $dateBox.dxDateBox("instance");
    var $dropDownButton = $dateBox.find(".dx-dropdowneditor-button");

    $($dropDownButton).trigger("dxclick");

    assert.equal(instance.option("value"), null, "value shouldn't be dropped after opening");
});

QUnit.test("time component should not be changed if editing value with the help of keyboard (T398429)", function(assert) {
    this.reinitFixture({
        type: "date",
        pickerType: "calendar",
        value: new Date(2016, 6, 1, 14, 15),
        focusStateEnabled: true
    });

    keyboardMock(this.fixture.rootElement.find("." + TEXTEDITOR_INPUT_CLASS))
        .focus()
        .caret(2)
        .press("del")
        .type("2")
        .change();

    var value = this.fixture.dateBox.option("value");
    assert.equal(value.getHours(), 14, "the 'hours' component has not been changed");
    assert.equal(value.getMinutes(), 15, "the 'minutes' component has not been changed");
});


QUnit.module("datebox with time component", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("date box should contain calendar and time view inside box in large screen", function(assert) {
    var originalWidthFunction = renderer.fn.width;

    try {
        sinon.stub(renderer.fn, 'width').returns(600);

        var $element = $("#dateBox").dxDateBox({
                type: "datetime",
                pickerType: "calendar",
                adaptivityEnabled: true,
                opened: true
            }),
            instance = $element.dxDateBox("instance"),
            $content = $(instance._popup.content()),
            box = Box.getInstance($content.find("." + BOX_CLASS)),
            $clock = $content.find(".dx-timeview-clock");

        assert.equal(box.option("direction"), "row", "correct box direction specified");
        assert.ok(box.itemElements().eq(0).find("." + CALENDAR_CLASS).length, "calendar rendered");
        assert.ok(box.itemElements().eq(1).find("." + TIMEVIEW_CLASS).length, "timeview rendered");
        assert.equal($clock.length, 1, "clock was rendered");
    } finally {
        renderer.fn.width = originalWidthFunction;
    }
});

QUnit.test("date box should contain calendar and time view inside box in small screen", function(assert) {
    var originalWidthFunction = renderer.fn.width;

    try {
        sinon.stub(renderer.fn, 'width').returns(300);

        var $element = $("#dateBox").dxDateBox({
                type: "datetime",
                pickerType: "calendar",
                adaptivityEnabled: true,
                opened: true
            }),
            instance = $element.dxDateBox("instance"),
            $content = $(instance._popup.content()),
            box = Box.getInstance($content.find("." + BOX_CLASS)),
            $clock = $content.find(".dx-timeview-clock");

        assert.equal(box.option("direction"), "row", "correct box direction specified");
        assert.ok(box.itemElements().eq(0).find("." + CALENDAR_CLASS).length, "calendar rendered");
        assert.ok(box.itemElements().eq(0).find("." + TIMEVIEW_CLASS).length, "timeview rendered");
        assert.equal($clock.length, 0, "clock was not rendered");
    } finally {
        renderer.fn.width = originalWidthFunction;
    }
});

QUnit.test("date box wrapper adaptivity class depends on the screen size", function(assert) {
    var LARGE_SCREEN_SIZE = 2000,
        SMALL_SCREEN_SIZE = 300;

    var stub = sinon.stub(renderer.fn, 'width').returns(LARGE_SCREEN_SIZE);

    try {
        var instance = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            adaptivityEnabled: true,
            opened: true
        }).dxDateBox("instance");

        assert.notOk(instance._popup._wrapper().hasClass(DATEBOX_ADAPTIVITY_MODE_CLASS), "there is no adaptivity class for the large screen");

        instance.close();

        stub.restore();
        stub = sinon.stub(renderer.fn, 'width').returns(SMALL_SCREEN_SIZE);

        instance.open();
        assert.ok(instance._popup._wrapper().hasClass(DATEBOX_ADAPTIVITY_MODE_CLASS), "there is the adaptivity class for the small screen");
    } finally {
        stub.restore();
    }
});

QUnit.test("format should be correct", function(assert) {
    var date = new Date($.now());

    var $element = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            value: date
        }),
        formattedValue = dateLocalization.format(date, uiDateUtils.FORMATS_MAP['datetime']);

    assert.equal($element.find("." + TEXTEDITOR_INPUT_CLASS).val(), formattedValue, "correct format");
});

QUnit.test("datebox value is bound to time view value", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            opened: true
        }),
        instance = $element.dxDateBox("instance"),
        $content = $(instance._popup.content()),
        timeView = $content.find("." + TIMEVIEW_CLASS).dxTimeView("instance");

    var date = new Date(2014, 2, 1, 14, 33);
    instance.option("value", date);
    assert.equal(timeView.option("value").getTime(), date.getTime(), "timeView value is set");

    date = new Date(2014, 2, 1, 17, 47);
    timeView.option("value", date);

    $(".dx-popup-done.dx-button").eq(0).trigger("dxclick");

    assert.equal(instance.option("value").toString(), date.toString(), "dateBox value is set");
});

QUnit.test("time value should be updated after select date", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            opened: true
        }),
        dateBox = $element.dxDateBox("instance"),
        $content = $(dateBox._popup.content()),
        calendar = $content.find("." + CALENDAR_CLASS).dxCalendar("instance"),
        timeView = $content.find("." + TIMEVIEW_CLASS).dxTimeView("instance");

    calendar.option("value", new Date(2014, 2, 1, 11, 15));
    timeView.option("value", new Date(2014, 1, 1, 12, 16));

    $(".dx-popup-done.dx-button").eq(0).trigger("dxclick");

    assert.equal(dateBox.option("value").toString(), (new Date(2014, 2, 1, 12, 16)).toString(), "dateBox value is set");
});

QUnit.test("buttons are rendered after 'type' option was changed", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            applyValueMode: "useButtons"
        }),
        dateBox = $element.dxDateBox("instance");

    dateBox.open();

    var $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

    assert.equal($buttons.length, 3, "buttons are rendered");

    dateBox.option("type", "date");
    dateBox.open();
    dateBox.option("type", "datetime");
    dateBox.open();

    $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");
    assert.equal($buttons.length, 3, "buttons are rendered after option was changed");
});

QUnit.test("T208853 - time is reset when calendar value is changed", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            applyValueMode: "useButtons",
            value: new Date(2015, 1, 16, 11, 20)
        }),
        dateBox = $element.dxDateBox("instance");

    dateBox.open();

    var $dateBoxOverlay = $(".dx-datebox-wrapper"),
        $applyButton = $dateBoxOverlay.find(".dx-toolbar .dx-popup-done.dx-button"),
        calendar = $dateBoxOverlay.find(".dx-calendar").dxCalendar("instance");

    calendar.option("value", new Date(2014, 1, 16));
    $($applyButton).trigger("dxclick");

    assert.deepEqual(dateBox.option("value"), new Date(2014, 1, 16, 11, 20), "date and time are correct");
});

QUnit.test("T231015 - widget should set default date or time if only one widget's value is chosen", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            value: null
        }),
        dateBox = $element.dxDateBox("instance");

    dateBox.open();
    var date = new Date();
    dateBox._strategy._widget.option("value", new Date(2015, 3, 21));
    $(dateBox._popup._wrapper()).find(".dx-popup-done").trigger("dxclick");

    date.setFullYear(2015, 3, 21);
    assert.equal(Math.floor(dateBox.option("value").getTime() / 1000 / 10), Math.floor(date.getTime() / 1000 / 10), "value is correct if only calendar value is changed");

    dateBox.option("value", null);
    dateBox._strategy._widget.option("value", null);
    dateBox.open();
    date = new Date();
    dateBox._strategy._timeView.option("value", new Date(2015, 3, 21, 15, 15, 34));
    $(dateBox._popup._wrapper()).find(".dx-popup-done").trigger("dxclick");

    date.setHours(15, 15, 34);
    assert.equal(Math.floor(dateBox.option("value").getTime() / 1000 / 10), Math.floor(date.getTime() / 1000 / 10), "value is correct if only timeView value is changed");
});

QUnit.test("T253298 - widget should set default date and time if value is null and the 'OK' button is clicked", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            value: null
        }),
        dateBox = $element.dxDateBox("instance");

    dateBox.open();
    var date = new Date();
    $(dateBox._popup._wrapper()).find(".dx-popup-done").trigger("dxclick");

    assert.equal(Math.round(dateBox.option("value").getTime() / 1000 / 10), Math.round(date.getTime() / 1000 / 10), "value is correct");
});

QUnit.test("DateBox should have time part when pickerType is rollers", function(assert) {
    var date = new Date(2015, 1, 1, 12, 13, 14);
    var dateBox = $("#dateBox").dxDateBox({
        pickerType: "rollers",
        type: "datetime",
        value: date
    }).dxDateBox("instance");

    var format = uiDateUtils.FORMATS_MAP["datetime"];
    var $input = $(dateBox.element().find("." + TEXTEDITOR_INPUT_CLASS));

    assert.equal($input.val(), dateLocalization.format(date, format), "input value is correct");
});

QUnit.test("DateBox with time should be rendered correctly in IE, templatesRenderAsynchronously=true", function(assert) {
    if(!browser.msie) {
        assert.expect(0);
        return;
    }

    var clock = sinon.useFakeTimers();
    try {
        var dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            value: new Date(),
            templatesRenderAsynchronously: true
        }).dxDateBox("instance");

        dateBox.option("opened", true);
        clock.tick();

        var $content = $(dateBox._popup.content()),
            $timeView = $content.find(".dx-timeview-clock");
        assert.ok($timeView.parent().width() > 100, "Time view was rendered correctly");
    } finally {
        clock.restore();
    }
});

QUnit.module("datebox w/ time list", {
    beforeEach: function() {
        fx.off = true;

        this.$dateBox = $("#dateBox");

        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: "list",
                type: "time"
            })
            .dxDateBox("instance");
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("rendered markup", function(assert) {
    var $dateBox = this.$dateBox;

    assert.ok($dateBox.hasClass(DATEBOX_LIST_CLASS), "TimeBox initialized");

    this.dateBox.option("opened", true);
    assert.ok($(DATEBOX_LIST_POPUP_SELECTOR).length, "Popup has dx-timebox-popup-wrapper class");
});

QUnit.test("rendered popup markup", function(assert) {
    this.dateBox.option("opened", true);

    assert.ok(this.dateBox._popup, "popup exist");
});

QUnit.test("rendered list markup", function(assert) {
    this.dateBox.option("opened", true);

    assert.ok(getInstanceWidget(this.dateBox), "list exist");
    assert.ok(getInstanceWidget(this.dateBox).element().hasClass("dx-list"), "list initialized");
});

QUnit.test("width option test", function(assert) {
    var device = devices.current(),
        extraWidth = 0;

    if(device.platform === "android") {
        extraWidth = 32;
    }

    this.dateBox.option("opened", false);
    this.dateBox.option("width", "auto");
    this.dateBox.option("opened", true);

    var popup = this.$dateBox.find(".dx-popup").dxPopup("instance");

    assert.equal(this.$dateBox.outerWidth() + extraWidth, popup.option("width"), "timebox popup has equal width with timebox with option width 'auto'");

    this.dateBox.option("opened", false);
    this.dateBox.option("width", "153px");
    this.dateBox.option("opened", true);
    assert.equal(this.$dateBox.outerWidth() + extraWidth, popup.option("width"), "timebox popup has equal width with timebox with option width in pixels");
});

QUnit.test("list should contain correct values if min/max does not specified", function(assert) {
    this.dateBox.option({
        min: null,
        max: null
    });

    this.dateBox.option("opened", true);

    var $timeList = $(".dx-list"),
        $listItems = $timeList.find(".dx-list-item-content");

    assert.equal($listItems.first().text(), "12:00 AM", "min value is right");
    assert.equal($listItems.last().text(), "11:30 PM", "max value is right");
});

QUnit.test("min/max option test", function(assert) {
    this.dateBox.option({
        min: new Date(2008, 7, 8, 4, 0),
        max: new Date(2008, 7, 8, 8, 59)
    });

    this.dateBox.option("opened", true);

    var $timeList = $(".dx-list"),
        $listItems = $timeList.find(".dx-list-item-content");

    assert.equal($listItems.first().text(), "4:00 AM", "min value is right");
    assert.equal($listItems.last().text(), "8:30 AM", "max value is right");
});

QUnit.test("min/max overflow test", function(assert) {
    this.dateBox.option({
        min: new Date(2008, 7, 8, 4, 0),
        max: new Date(2008, 7, 9, 9, 0)
    });

    this.dateBox.option("opened", true);

    var $timeList = $(".dx-list"),
        $listItems = $timeList.find(".dx-list-item-content");

    assert.equal($listItems.first().text(), "4:00 AM", "min value is right");
    assert.equal($listItems.last().text(), "3:30 AM", "max value is right");
});

QUnit.test("default field template test", function(assert) {
    this.dateBox.option({
        min: new Date(2008, 7, 8, 4, 0),
        value: new Date(2008, 7, 8, 5, 0),
        max: new Date(2008, 7, 8, 6, 0)
    });

    var $input = this.$dateBox.find(".dx-texteditor-input");

    assert.equal($input.val(), "5:00 AM", "field template is right");
});

QUnit.test("interval option", function(assert) {
    this.dateBox.option({
        min: new Date(2008, 7, 8, 4, 0),
        value: new Date(2008, 7, 8, 5, 0),
        max: new Date(2008, 7, 8, 6, 0),
        interval: 60
    });

    this.dateBox.option("opened", true);

    var $timeList = $(".dx-list");
    var items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 2, "interval option works");

    this.dateBox.option("interval", 120);
    this.dateBox.option("opened", true);

    $timeList = $(".dx-list");
    items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 1, "interval option works");
});

QUnit.test("T240639 - correct list item should be highlighted if appropriate datebox value is set", function(assert) {
    this.dateBox.option({
        type: "time",
        pickerType: "list",
        value: new Date(0, 0, 0, 12, 30),
        opened: true
    });

    var list = this.dateBox._strategy._widget;

    assert.deepEqual(list.option("selectedIndex"), 25, "selectedIndex item is correct");
    assert.deepEqual(list.option("selectedItem"), new Date(0, 0, 0, 12, 30), "selected list item is correct");

    this.dateBox.option("value", new Date(2016, 1, 1, 12, 20));

    assert.equal(list.option("selectedIndex"), -1, "there is no selected list item");
    assert.equal(list.option("selectedItem"), null, "there is no selected list item");
});

QUnit.test("T351678 - the date is reset after item click", function(assert) {
    this.dateBox.option({
        type: "time",
        pickerType: "list",
        value: new Date(2020, 4, 13, 12, 17),
        opened: true
    });

    var $list = $(this.dateBox._strategy._widget.element());
    $($list.find(".dx-list-item").eq(3)).trigger("dxclick");

    assert.deepEqual(this.dateBox.option("value"), new Date(2020, 4, 13, 1, 30), "date is correct");
});

QUnit.test("list should have items if the 'min' option is specified (T395529)", function(assert) {
    this.dateBox.option({
        min: new Date(2016, 5, 20),
        opened: true
    });

    var list = $(".dx-list").dxList("instance");
    assert.ok(list.option("items").length > 0, "list is not empty");
});

QUnit.test("the value's date part should not be changed if editing input's text by keyboard (T395685)", function(assert) {
    this.dateBox.option({
        focusStateEnabled: true,
        value: new Date(2016, 5, 25, 14, 22)
    });

    var $input = this.$dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    keyboardMock($input)
        .focus()
        .caret($input.val().length - 3)
        .press("backspace")
        .press("backspace")
        .type("44")
        .change();

    assert.deepEqual(this.dateBox.option("value"), new Date(2016, 5, 25, 14, 44), "value is correct");
});

QUnit.test("List of items should be refreshed after value is changed", function(assert) {
    this.dateBox.option({
        min: new Date(2016, 1, 1, 10, 0),
        value: new Date(2016, 1, 2, 14, 45),
        interval: 60,
        opened: true
    });

    var $timeList = $(".dx-list");
    var items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 24, "24 items should be find");

    this.dateBox.option("value", new Date(2016, 1, 1));

    items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 14, "14 items should be find from min to finish of day");
});

QUnit.test("All items in list should be present if value and min options are belong to different days", function(assert) {
    this.dateBox.option({
        min: new Date(2016, 1, 1, 13, 45),
        value: new Date(2016, 1, 1, 14, 45),
        interval: 60,
        opened: true
    });

    var $timeList = $(".dx-list");
    var items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 11, "interval option works");

    this.dateBox.option("value", new Date(2016, 1, 2, 13, 45));

    items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 24, "interval is correct");
    assert.equal(items.eq(0).text(), "12:45 AM", "start time is correct");
});

QUnit.test("The situation when value and max options are belong to one day", function(assert) {
    this.dateBox.option({
        value: new Date(2016, 1, 1, 13, 45),
        max: new Date(2016, 1, 1, 15, 0),
        interval: 60,
        opened: true
    });

    var $timeList = $(".dx-list");
    var items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 15, "list should be contain right count of items");
});

QUnit.test("value and max are belong to one day", function(assert) {
    this.dateBox.option({
        min: new Date(2016, 1, 1, 0, 11),
        value: new Date(2016, 1, 3, 14, 45),
        max: new Date(2016, 1, 3, 18, 22),
        interval: 60,
        opened: true
    });

    var $timeList = $(".dx-list");
    var items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.length, 19, "list should be contain right count of items");
    assert.equal(items.eq(0).text(), "12:11 AM", "first item in list is correct");
    assert.equal(items.eq(items.length - 1).text(), "6:11 PM", "last item in list is correct");
});

QUnit.test("List items should be started with minimal possible value", function(assert) {
    this.dateBox.option({
        min: new Date(2016, 1, 1, 0, 17),
        value: new Date(2016, 1, 3, 14, 45),
        interval: 15,
        opened: true
    });

    var $timeList = $(".dx-list");
    var items = $timeList.find(LIST_ITEM_SELECTOR);

    assert.equal(items.eq(0).text(), "12:02 AM", "first item in list is correct");
    assert.equal(items.eq(items.length - 1).text(), "11:47 PM", "last item in list is correct");
});

QUnit.test("dxDateBox with list strategy automatically scrolls to selected item on opening", function(assert) {
    this.dateBox.option({
        value: new Date(2016, 1, 3, 14, 45),
        interval: 15,
        opened: true
    });

    this.dateBox.option("opened", true);

    var $popupContent = $(".dx-popup-content");
    var $selectedItem = $popupContent.find("." + LIST_ITEM_SELECTED_CLASS);

    assert.ok($popupContent.offset().top + $popupContent.height() > $selectedItem.offset().top, "selected item is visible");
});

QUnit.test("min/max settings should be work if value option is null", function(assert) {
    this.dateBox.option({
        value: null,
        min: new Date(2008, 7, 8, 8, 0),
        max: new Date(2008, 7, 8, 20, 0)
    });

    this.dateBox.option("opened", true);

    var $timeList = $(".dx-list"),
        $listItems = $timeList.find(".dx-list-item-content");

    assert.equal($listItems.first().text(), "8:00 AM", "min value is right");
    assert.equal($listItems.last().text(), "7:30 PM", "max value is right");
});

QUnit.test("min/max settings should be work if value option is undefined", function(assert) {
    this.dateBox.option({
        value: undefined,
        min: new Date(2008, 7, 8, 8, 0),
        max: new Date(2008, 7, 8, 20, 0)
    });

    this.dateBox.option("opened", true);

    var $timeList = $(".dx-list"),
        $listItems = $timeList.find(".dx-list-item-content");

    assert.equal($listItems.first().text(), "8:00 AM", "min value is right");
    assert.equal($listItems.last().text(), "7:30 PM", "max value is right");
});


QUnit.module("native datebox", {
    beforeEach: function() {
        this.$dateBox = $("#dateBox");

        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: "native"
            })
            .dxDateBox("instance");
    },
    afterEach: function() {
    }
});

QUnit.test("it should work and not fall", function(assert) {
    assert.ok(this.dateBox, "Instance of native datepicker should work for each platform");
    assert.equal(this.dateBox._strategy.NAME, "Native", "correct strategy is chosen");
});


QUnit.module("keyboard navigation", {
    beforeEach: function() {
        fx.off = true;

        this.$dateBox = $("#dateBox");

        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: "calendar",
                type: "time",
                focusStateEnabled: true,
                min: new Date(2008, 7, 8, 4, 30),
                value: new Date(2008, 7, 8, 5, 0),
                max: new Date(2008, 7, 8, 6, 0)
            })
            .dxDateBox("instance");

        this.$input = this.$dateBox.find(".dx-texteditor-input");
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.testInActiveWindow("popup hides on tab", function(assert) {
    this.$input.focusin();
    assert.ok(this.$dateBox.hasClass(STATE_FOCUSED_CLASS), "element is focused");
    this.dateBox.option("opened", true);
    this.keyboard.keyDown("tab");
    assert.ok(this.$dateBox.hasClass(STATE_FOCUSED_CLASS), "element is focused");

    assert.equal(this.dateBox.option("opened"), false, "popup is hidden");
});

QUnit.testInActiveWindow("home/end should not be handled", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    this.$input.focusin();
    this.dateBox.option("opened", true);
    var $timeList = $(".dx-list");

    this.keyboard.keyDown("down");
    this.keyboard.keyDown("end");
    assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "element is not focused");
    this.keyboard.keyDown("home");
    assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "element is not focused");
});

QUnit.testInActiveWindow("arrow keys control", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    this.$input.focusin();
    this.dateBox.option("opened", true);
    this.keyboard.keyDown("down");

    var $timeList = $(".dx-list");

    assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "the first item is not focused");

    this.keyboard.keyDown("down");
    assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "the first item is focused");

    this.keyboard.keyDown("down");
    assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(1).hasClass(STATE_FOCUSED_CLASS), "the second item is focused");

    this.keyboard.keyDown("up");
    assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "the first item is focused");

    this.keyboard.keyDown("enter");
    assert.equal(this.dateBox.option("opened"), false, "popup is hidden");

    var selectedDate = this.dateBox.option("value");
    assert.equal(selectedDate.getHours(), 4, "hours is right");
    assert.equal(selectedDate.getMinutes(), 30, "minutes is right");
});

QUnit.test("apply contoured date on enter for date and datetime mode", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    this.dateBox = this.$dateBox
        .dxDateBox({
            pickerType: "calendar",
            type: "date",
            applyValueMode: "useButtons",
            focusStateEnabled: true,
            min: new Date(2008, 6, 8, 4, 30),
            value: new Date(2008, 7, 8, 5, 0),
            max: new Date(2008, 9, 8, 6, 0),
            opened: true
        })
        .dxDateBox("instance");

    var $input = this.$dateBox.find(".dx-texteditor-input");

    $($input).trigger($.Event("keydown", { which: 38 }));
    $($input).trigger($.Event("keydown", { which: 40 }));
    $($input).trigger($.Event("keydown", { which: 38 }));
    $($input).trigger($.Event("keydown", { which: 13 }));

    assert.equal(this.dateBox.option("opened"), false, "popup is hidden");

    var selectedDate = this.dateBox.option("value");
    assert.equal(selectedDate.getDate(), 1, "day is right");
});

QUnit.testInActiveWindow("valueChangeEvent should have jQueryEvent when enter key was pressed", function(assert) {
    var $dateBox;

    try {
        var valueChangedHandler = sinon.stub();

        $dateBox = $("<div>").appendTo("body").dxDateBox({
            pickerType: "calendar",
            focusStateEnabled: true,
            onValueChanged: valueChangedHandler,
            opened: true
        });

        var $input = $dateBox.find(".dx-texteditor-input"),
            kb = keyboardMock($input);

        $input.focusin();
        kb.press("enter");

        assert.ok(valueChangedHandler.getCall(0).args[0].jQueryEvent, "jqueryEvent exists");
    } finally {
        $dateBox.remove();
    }
});

QUnit.testInActiveWindow("onValueChanged fires after clearing and enter key press", function(assert) {
    var valueChanged = sinon.stub();

    this.dateBox = this.$dateBox
        .dxDateBox({
            value: null,
            pickerType: "calendar",
            type: "date",
            focusStateEnabled: true,
            opened: true,
            onValueChanged: valueChanged
        }).dxDateBox("instance");

    var $input = this.$dateBox.find(".dx-texteditor-input");

    $input.focusin();

    $(".dx-calendar .dx-calendar-cell").eq(12).trigger("dxclick");

    //attempt to simulate real clearing
    $input.val("");
    this.dateBox.option("text", "");

    $($input).trigger($.Event("keydown", { which: 13 }));

    assert.equal(valueChanged.callCount, 2, "valueChanged is called");
});

QUnit.test("Enter key press prevents default when popup in opened", function(assert) {
    assert.expect(1);

    var prevented = 0,
        $dateBox = $("<div>").appendTo("body").dxDateBox({
            pickerType: "calendar",
            focusStateEnabled: true,
            value: new Date(2015, 5, 13),
            opened: true
        }),
        $input = $dateBox.find(".dx-texteditor-input"),
        keyboard = keyboardMock($input);

    try {
        $($dateBox).on("keydown", function(e) {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        keyboard.keyDown("enter");
        assert.equal(prevented, 1, "defaults prevented on enter key press");

    } finally {
        $dateBox.remove();
    }
});

QUnit.testInActiveWindow("the 'shift+tab' key press leads to the cancel button focus if the input is focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "desktop specific test");
        return;
    }

    this.dateBox.option({
        pickerType: "calendar",
        type: "datetime",
        opened: true,
        applyValueMode: "useButtons"
    });

    var $input = this.$dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    $input
        .focus()
        .trigger($.Event("keydown", {
            which: TAB_KEY_CODE,
            shiftKey: true
        }));

    var $cancelButton = this.dateBox._popup._wrapper().find(".dx-button.dx-popup-cancel");
    assert.ok($cancelButton.hasClass("dx-state-focused"), "cancel button is focused");
});


QUnit.module("aria accessibility");

QUnit.test("aria-activedescendant on combobox should point to the active list item (date view)", function(assert) {
    var isGeneric = devices.real().platform === "generic";

    if(isGeneric) {
        var $element = $("#dateBox").dxDateBox({
                value: new Date(2008, 7, 8, 5, 0),
                opened: true,
                pickerType: "calendar"
            }),
            keyboard = keyboardMock($element.find("." + TEXTEDITOR_INPUT_CLASS)),
            $input = $element.find(".dx-texteditor-input");

        keyboard.keyDown("right");

        var $contouredCell = $(".dx-calendar-contoured-date");

        assert.notEqual($input.attr("aria-activedescendant"), undefined, "aria-activedescendant exists");
        assert.equal($input.attr("aria-activedescendant"), $contouredCell.attr("id"), "aria-activedescendant equals contoured cell's id");
    } else {
        assert.ok(true, "skip test on devices");
    }
});

QUnit.test("aria-activedescendant on combobox should point to the active list item (time view)", function(assert) {
    var isGeneric = devices.real().platform === "generic";

    if(isGeneric) {
        var $element = $("#dateBox").dxDateBox({
                type: "time",
                pickerType: "list",
                value: new Date(2008, 7, 8, 5, 0),
                opened: true
            }),
            keyboard = keyboardMock($element.find("." + TEXTEDITOR_INPUT_CLASS)),
            $input = $element.find(".dx-texteditor-input");

        keyboard.keyDown("down");

        var $activeItem = $(".dx-state-focused");

        assert.notEqual($input.attr("aria-activedescendant"), undefined, "aria-activedescendant exists");
        assert.equal($input.attr("aria-activedescendant"), $activeItem.attr("id"), "aria-activedescendant equals contoured cell's id");
    } else {
        assert.ok(true, "skip test on devices");
    }
});


QUnit.module("pickerType");

QUnit.test("correct behavior for the 'calendar' value", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            value: new Date(),
            pickerType: "calendar",
            type: "date"
        }),
        instance = $element.dxDateBox("instance");

    assert.equal(instance._strategy.NAME, "Calendar", "strategy is correct for the 'date' type");

    instance.option("type", "datetime");
    assert.equal(instance._strategy.NAME, "CalendarWithTime", "strategy is correct for the 'datetime' type");
});

QUnit.test("correct behavior for the 'list' value", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            value: new Date(),
            pickerType: "list",
            type: "time"
        }),
        instance = $element.dxDateBox("instance");

    assert.equal(instance._strategy.NAME, "List", "strategy is correct");
});

QUnit.test("correct behavior for the 'rollers' value", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            value: new Date(),
            pickerType: "rollers",
            type: "date"
        }),
        instance = $element.dxDateBox("instance");

    assert.equal(instance._strategy.NAME, "DateView", "strategy is correct");
});

QUnit.test("correct behavior for the 'native' value", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            value: new Date(),
            pickerType: "native",
            type: "date"
        }),
        instance = $element.dxDateBox("instance");

    assert.equal(instance._strategy.NAME, "Native", "strategy is correct");
});

QUnit.test("T319039 - classes on DateBox should be correct after the 'pickerType' option changed", function(assert) {
    var pickerTypes = ["rollers", "calendar", "native", "list"],
        $dateBox = $("#dateBox").dxDateBox(),
        dateBox = $dateBox.dxDateBox("instance");

    var areClassesCorrect = function(currentPickerType) {
        for(var i = 0, n = pickerTypes.length; i < n; i++) {
            var pickerType = pickerTypes[i],
                className = DATEBOX_CLASS + "-" + pickerType;

            if(currentPickerType === pickerType ^ $dateBox.hasClass(className)) {
                return false;
            }
        }

        return true;
    };

    for(var i = 0, n = pickerTypes.length; i < n; i++) {
        var pickerType = pickerTypes[i],
            type = pickerType === "list" ? "time" : "date";

        dateBox.option({
            type: type,
            pickerType: pickerType,
        });

        assert.ok(areClassesCorrect(pickerType), "classes for " + pickerType + " are correct");
    }
});


QUnit.module("'useNative' deprecated options");

QUnit.test("the 'pickerType' option should depend on the 'useNative' and 'useCalendar' options", function(assert) {
    var $element = $("#dateBox").dxDateBox({
            useNative: false,
            useCalendar: true,
            type: "date"
        }),
        instance = $element.dxDateBox("instance");

    instance.option("type", "time");
    assert.equal(instance._strategy.NAME, "List", "pickerType is correct when type is changed to 'time'");

    instance.option("useCalendar", false);
    assert.equal(instance._strategy.NAME, "DateView", "pickerType is correct when useCalendar: false, useNative: false");

    instance.option("useNative", true);
    assert.equal(instance._strategy.NAME, "Native", "pickerType is correct when useNative: true");
});

QUnit.test("the 'calendar' strategy should be used if the 'useCalendar' is true and the 'useNative' is false", function(assert) {
    var $element = $("#dateBox").dxDateBox({ useCalendar: true, useNative: false }),
        instance = $element.dxDateBox("instance");
    assert.equal(instance._strategy.NAME, "Calendar", "strategy is correct");
});

QUnit.test("useCalendar = true and type = time should use time list (T248089)", function(assert) {
    var currentDevice = devices.real();
    devices.real({ platform: "android" });

    try {
        var $element = $("#dateBox").dxDateBox({
                type: 'time',
                useCalendar: true
            }),
            instance = $element.dxDateBox("instance");

        assert.equal(instance._strategy.NAME, "List", "strategy is correct");
    } finally {
        devices.real(currentDevice);
    }
});


QUnit.module("datebox validation");

QUnit.test("widget is still valid after drop down is opened", function(assert) {
    var startDate = new Date(2015, 1, 1, 8, 12);

    var $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            value: startDate,
            pickerType: "calendar",
            applyValueMode: "instantly"
        }).dxValidator({
            validationRules: [
                { type: 'required' },
                { type: 'range', min: new Date(2016, 0, 1) }
            ]
        }),
        dateBox = $dateBox.dxDateBox("instance");

    assert.equal(dateBox.option("value"), startDate, "start value is correct");
    assert.ok(dateBox.option("isValid"), "value is valid");

    dateBox.option("opened", true);

    assert.ok(dateBox.option("isValid"), "value is still valid after drop down is opened");
    assert.equal(dateBox.option("value"), startDate, "start value is correct");

    dateBox.option("value", new Date(2017, 1, 1));
    assert.ok(dateBox.option("isValid"), "value is valid too");
});

QUnit.test("datebox with 'date' type should ignore time in min\max options", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        value: new Date(2015, 0, 31, 10),
        focusStateEnabled: true,
        min: new Date(2015, 0, 31, 12)
    });

    assert.ok(!$dateBox.hasClass("dx-invalid"), "datebox should stay valid");
});

QUnit.test("time works correct when value is invalid", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        type: "time",
        pickerType: "list",
        valueChangeEvent: "change"
    });

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    var $button = $dateBox.find(".dx-dropdowneditor-button");

    $input.val("");
    $($input).trigger("change");
    $($button).trigger("dxclick");

    var popup = $dateBox.find(".dx-popup").dxPopup("instance");

    assert.ok(popup.option("visible"), "popup is opened");
});

QUnit.test("invalidDateMessage", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.expect(0);
        return;
    }

    var $dateBox = $("#dateBox").dxDateBox({
        invalidDateMessage: "A lorem ipsum..."
    });

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    $input.val("ips");
    $($input).trigger("change");

    var validationError = $dateBox.dxDateBox("instance").option("validationError").message;
    assert.equal(validationError, "A lorem ipsum...", "validation message is correct");
});

QUnit.test("dateOutOfRangeMessage", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        dateOutOfRangeMessage: "A lorem ipsum...",
        min: new Date(2015, 5, 5),
        max: new Date(2016, 5, 5),
        value: new Date(2017, 5, 5)
    });

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    $($input).trigger("change");

    var validationError = $dateBox.dxDateBox("instance").option("validationError").message;
    assert.equal(validationError, "A lorem ipsum...", "validation message is correct");
});

QUnit.test("year is too big", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        displayFormat: "d/M/y",
        valueChangeEvent: "change",
        mode: "text"
    });

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    $input.val("01/01/999999999");
    $($input).trigger("change");

    assert.equal($dateBox.dxDateBox("option", "isValid"), false, "datebox has invalid state");
    assert.equal($input.val(), "01/01/999999999", "value is not changed");
});

QUnit.test("datebox should not ignore the time component in validation when it is changed by timeview (T394206)", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            value: new Date(2016, 6, 8, 8, 34),
            max: new Date(2016, 6, 8, 9, 15),
            opened: true
        }),
        $dateBoxWrapper = $("." + DATEBOX_WRAPPER_CLASS),
        $hoursInput = $dateBoxWrapper.find(".dx-numberbox").eq(0).find("." + TEXTEDITOR_INPUT_CLASS);

    $hoursInput
        .val(9)
        .trigger("change");

    $dateBoxWrapper.find(".dx-button.dx-popup-done")
        .trigger("dxclick");

    assert.ok($dateBox.hasClass("dx-invalid"), "datebox should be marked as invalid");
});

QUnit.test("datebox should be valid if value was changed in the onValueChanged handle(T413553)", function(assert) {
    var date = new Date();

    var $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2016, 1, 1),
            onValueChanged: function(e) {
                if(!e.value) {
                    e.component.option("value", date);
                }
            },
        }),
        $input = $dateBox.find("input");

    $input.val("");
    $($input).trigger("change");

    assert.equal(date, $dateBox.dxDateBox("instance").option("value"), "value set correctly");
    assert.ok(!$dateBox.hasClass("dx-invalid"), "datebox should be marked as valid");
});

QUnit.test("custom validation should be more important than internal", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2016, 1, 1)
        }).dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback: function(options) {
                    return false;
                }
            }]
        }),
        dateBox = $dateBox.dxDateBox("instance");

    dateBox.option("value", new Date());

    assert.notOk(dateBox.option("isValid"), "dateBox is invalid");
    assert.ok($dateBox.hasClass("dx-invalid"), "datebox should be marked as invalid");
});

QUnit.test("Internal validation should be valid when null value was set to null", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        value: new Date(2016, 1, 1)
    });

    var dateBox = $dateBox.dxDateBox("instance");

    dateBox.option("value", null);

    assert.ok(!$dateBox.hasClass("dx-invalid"), "datebox should not be marked as invalid");
});

QUnit.test("Internal validation shouldn't be reset value if localization return null for invalid value", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        pickerType: "calendar",
        value: new Date(2016, 1, 1)
    });
    var dateBox = $dateBox.dxDateBox("instance");

    var $input = $dateBox.find(".dx-texteditor-input");
    var keyboard = keyboardMock($input);

    keyboard
        .type("abc")
        .change();

    assert.equal($dateBox.hasClass("dx-invalid"), 1, "datebox should be marked as invalid");
    assert.equal(dateBox.option("text"), "abc2/1/2016", "text option shouldn't be reset");
});

QUnit.test("Validation should be correct when year of the value less than 100", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
            min: new Date(2015, 6, 10),
            max: new Date(2015, 6, 14),
            value: new Date(2015, 6, 12),
            valueChangeEvent: "change",
            pickerType: "calendar"
        }),
        dateBox = $dateBox.dxDateBox("instance");

    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
    $input.val("1/1/99");
    $input.change();

    assert.notOk(dateBox.option("isValid"), "datebox is invalid");
    var validationError = dateBox.option("validationError").message;
    assert.equal(validationError, "Value is out of range", "validation message is correct");
});

QUnit.test("dxDateBox should validate value after change 'max' option", function(assert) {
    var dateBox = $("#dateBox").dxDateBox({
        max: new Date(2015, 6, 14),
        value: new Date(2015, 6, 12),
        pickerType: "calendar"
    }).dxDateBox("instance");

    dateBox.option("value", new Date(2015, 6, 20));
    dateBox.option("max", new Date(2015, 6, 25));

    assert.ok(dateBox.option("isValid"), "datebox is valid");
});

QUnit.test("dxDateBox should validate value after change 'min' option", function(assert) {
    var dateBox = $("#dateBox").dxDateBox({
        min: new Date(2015, 6, 14),
        value: new Date(2015, 6, 18),
        pickerType: "calendar"
    }).dxDateBox("instance");

    dateBox.option("value", new Date(2015, 6, 10));
    dateBox.option("min", new Date(2015, 6, 5));

    assert.ok(dateBox.option("isValid"), "datebox is valid");
});


QUnit.module("DateBox number and string value support", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("string value should be supported", function(assert) {
    assert.expect(1);

    $("#dateBox").dxDateBox({
        value: "2015/08/09",
        onContentReady: function() {
            assert.ok(true, "widget is rendered without errors");
        }
    });
});

QUnit.test("number value should be supported", function(assert) {
    assert.expect(1);

    var date = new Date(2015, 7, 7);
    $("#dateBox").dxDateBox({
        value: date.valueOf(),
        onContentReady: function() {
            assert.ok(true, "widget is rendered without errors");
        }
    });
});

QUnit.test("date should be displayed correctly", function(assert) {
    var date = new Date(2015, 7, 14);
    var $dateBox = $("#dateBox").dxDateBox({
        type: "date",
        value: new Date(date)
    });
    var instance = $dateBox.dxDateBox("instance");
    var $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

    var expectedText = $input.text();

    instance.option("value", date.valueOf());
    assert.equal($input.text(), expectedText, "date is displayed correctly when specified by number");

    instance.option("value", dateLocalization.format(date, instance.option("displayFormat")));
    assert.equal($input.text(), expectedText, "date is displayed correctly when specified by string");
});

QUnit.test("value should save its type after picker was used (type = 'date')", function(assert) {
    var date = new Date(2015, 7, 9);
    var dateString = "2015/08/09";
    var newDate = new Date(2015, 7, 21);
    var newDateString = "2015/08/21";

    var $dateBox = $("#dateBox").dxDateBox({
        value: dateString,
        type: "date",
        pickerType: "calendar",
        applyValueMode: "instantly",
        opened: true
    });
    var instance = $dateBox.dxDateBox("instance");

    $("td[data-value='" + getShortDate(newDate) + "']").trigger("dxclick");
    assert.equal(typeof instance.option("value"), "string", "value type is saved");
    assert.equal(instance.option("value"), newDateString, "value is correct");

    instance.option("value", date.valueOf());
    instance.open();

    $("td[data-value='" + getShortDate(newDate) + "']").trigger("dxclick");
    assert.equal(typeof instance.option("value"), "number", "value type is saved");
    assert.equal(instance.option("value"), newDate.valueOf(), "value is correct");
});

QUnit.test("value should remain correct after picker was used (type = 'datetime')", function(assert) {
    var dateString = "2015/08/09 18:33:00";
    var newDate = new Date(2015, 7, 21, 18, 33);

    var $dateBox = $("#dateBox").dxDateBox({
        pickerType: "calendar",
        applyValueMode: "instantly",
        type: "datetime",
        value: dateString,
        opened: true
    });
    var instance = $dateBox.dxDateBox("instance");

    $("td[data-value='" + getShortDate(newDate) + "']").trigger("dxclick");

    assert.deepEqual(new Date(instance.option("value")), newDate, "value is correct");
});

QUnit.test("value should remain correct after picker was used (type = 'time')", function(assert) {
    var $dateBox = $("#dateBox").dxDateBox({
        pickerType: "calendar",
        applyValueMode: "instantly",
        type: "time",
        value: dateLocalization.format(new Date(2015, 7, 9, 18, 33), "yyyy/MM/dd HH:mm:ss"),
        opened: true
    });
    var instance = $dateBox.dxDateBox("instance");

    $(".dx-list-item").eq(37).trigger("dxclick");

    var time = dateLocalization.format(new Date(instance.option("value")), "longtime");
    var expectedTime = dateLocalization.format(new Date(2015, 7, 9, 18, 30), "longtime");

    assert.equal(time, expectedTime, "value is correct");
});

QUnit.test("string value for the 'min' option should be supported", function(assert) {
    assert.expect(1);

    $("#dateBox").dxDateBox({
        value: "2015/08/09",
        min: "2015/05/09",
        onContentReady: function() {
            assert.ok(true, "widget is rendered without errors");
        }
    });
});

QUnit.test("number value for the 'min' option should be supported", function(assert) {
    assert.expect(1);

    $("#dateBox").dxDateBox({
        value: new Date(2015, 7, 7).valueOf(),
        min: new Date(2015, 4, 7).valueOf(),
        onContentReady: function() {
            assert.ok(true, "widget is rendered without errors");
        }
    });
});

QUnit.test("string value for the 'max' option should be supported", function(assert) {
    assert.expect(1);

    $("#dateBox").dxDateBox({
        value: "2015/08/09",
        max: "2015/10/09",
        onContentReady: function() {
            assert.ok(true, "widget is rendered without errors");
        }
    });
});

QUnit.test("number value for the 'max' option should be supported", function(assert) {
    assert.expect(1);

    $("#dateBox").dxDateBox({
        value: new Date(2015, 7, 7).valueOf(),
        max: new Date(2015, 9, 7).valueOf(),
        onContentReady: function() {
            assert.ok(true, "widget is rendered without errors");
        }
    });
});

QUnit.test("ISO strings support", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = true;

    try {
        $("#dateBox").dxDateBox({
            value: "2016-01-11T12:00:00",
            min: "2016-01-10T17:29:00",
            max: "2016-01-13T17:29:00",
            mode: "text"
        });

        var $input = $("#dateBox").find(".dx-texteditor-input");
        assert.equal($input.val(), "1/11/2016", "text is correct");

        $($input.val("1/12/2016")).trigger("change");

        assert.equal($("#dateBox").dxDateBox("option", "value"), "2016-01-12T12:00:00", "value is correct");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("ISO strings support dateSerializationFormat", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = true;

    try {
        $("#dateBox").dxDateBox({
            value: "2016-01-11T00:00:00Z",
            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssZ",
            mode: "text"
        });

        var serializeUTCDate = function(year, month, day) {
            return dateSerialization.serializeDate(new Date(Date.UTC(year, month, day)), "M/d/y");
        };

        var $input = $("#dateBox").find(".dx-texteditor-input");
        assert.equal($input.val(), serializeUTCDate(2016, 0, 11), "text is correct");

        $($input.val(serializeUTCDate(2016, 0, 12))).trigger("change");
        assert.equal($("#dateBox").dxDateBox("option", "value"), "2016-01-12T00:00:00Z", "value is correct");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

//T506146
QUnit.test("enter value with big year if dateSerializationFormat is defined", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = true;

    try {
        $("#dateBox").dxDateBox({
            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
            mode: "text"
        });

        var $input = $("#dateBox").find(".dx-texteditor-input");

        $($input.val("1/12/21016")).trigger("change");

        assert.equal($("#dateBox").dxDateBox("option", "value"), "21016-01-12T00:00:00", "value is correct");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("enter value with big year if dateSerializationFormat is defined and forceIsoDateParsing is disabled", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = false;

    try {
        $("#dateBox").dxDateBox({
            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
            mode: "text"
        });

        var $input = $("#dateBox").find(".dx-texteditor-input");

        $($input.val("1/12/21016")).trigger("change");

        assert.deepEqual($("#dateBox").dxDateBox("option", "value"), new Date(21016, 0, 12), "value is correct and it is not serialized");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("onValueChanged should not be fired when on popup opening", function(assert) {
    var isValueChangedCalled = false,
        dateBox = $("#dateBox").dxDateBox({
            value: undefined,
            mode: "text",
            onValueChanged: function() {
                isValueChangedCalled = true;
            }
        }).dxDateBox("instance");

    //act
    dateBox.option("opened", true);

    //assert
    assert.ok(!isValueChangedCalled, "onValueChanged is not called");
});

