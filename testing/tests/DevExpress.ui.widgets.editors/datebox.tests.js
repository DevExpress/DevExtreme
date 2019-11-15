import $ from "jquery";
import Box from "ui/box";
import Calendar from "ui/calendar";
import DateBox from "ui/date_box";
import browser from "core/utils/browser";
import config from "core/config";
import dateLocalization from "localization/date";
import dateSerialization from "core/utils/date_serialization";
import dateUtils from "core/utils/date";
import devices from "core/devices";
import fx from "animation/fx";
import keyboardMock from "../../helpers/keyboardMock.js";
import messageLocalization from "localization/message";
import pointerMock from "../../helpers/pointerMock.js";
import renderer from "core/renderer";
import support from "core/utils/support";
import typeUtils from "core/utils/type";
import uiDateUtils from "ui/date_box/ui.date_utils";
import { noop } from "core/utils/common";

import "../../helpers/l10n/cldrNumberDataDe.js";
import "../../helpers/l10n/cldrCalendarDataDe.js";
import "../../helpers/calendarFixtures.js";

import "ui/validator";
import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    const markup =
        '<style>\
            #containerWithWidth {\
                width: 100px;\
            }\
        </style>\
        <div id="parent-div"></div>\
        <div id="dateBox"></div>\
        <div id="dateBoxWithPicker"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="containerWithWidth"><div id="innerDateBox"></div></div';

    $("#qunit-fixture").html(markup);
});

const currentDate = new Date(2015, 11, 31);
const firstDayOfWeek = 0;
const BOX_CLASS = "dx-box";
const CALENDAR_CLASS = "dx-calendar";
const TIMEVIEW_CLASS = "dx-timeview";
const TIMEVIEW_CLOCK_CLASS = "dx-timeview-clock";
const TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";
const DATEBOX_CLASS = "dx-datebox";
const DATEBOX_WRAPPER_CLASS = "dx-datebox-wrapper";
const DATEBOX_LIST_POPUP_SELECTOR = ".dx-datebox-wrapper-list .dx-popup-content";
const LIST_ITEM_SELECTOR = ".dx-list-item";
const DATEBOX_ADAPTIVITY_MODE_CLASS = "dx-datebox-adaptivity-mode";
const LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected";
const STATE_FOCUSED_CLASS = "dx-state-focused";
const BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container";
const TODAY_CELL_CLASS = "dx-calendar-today";
const GESTURE_COVER_CLASS = "dx-gesture-cover";
const DROP_DOWN_BUTTON_CLASS = "dx-dropdowneditor-button";

const CALENDAR_APPLY_BUTTON_SELECTOR = ".dx-popup-done.dx-button";

const widgetName = "dxDateBox";

const getShortDate = date => {
    return dateSerialization.serializeDate(date, dateUtils.getShortDateFormat());
};

const getInstanceWidget = instance => {
    return instance._strategy._widget;
};

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers(new Date().valueOf());

        this.$element = $("#dateBox")[widgetName]({ pickerType: "native" });
        this.instance = this.$element[widgetName]("instance");
        this.$input = $.proxy(this.instance._input, this.instance);
    },
    afterEach: () => {
        this.clock.restore();
    }
};

const clearInput = (element, keyboard) => {
    while(element.val()) {
        keyboard.press("backspace");
        keyboard.press("del"); // Temporary for IE (keyboardMock: caret setting does not work in IE now)
    }
};

const getExpectedResult = (date, mode, stringDate) => {
    let localizedDate;

    if(uiDateUtils.FORMATS_MAP[mode]) {
        localizedDate = dateLocalization.format(date, uiDateUtils.FORMATS_MAP[mode]);
    } else {
        localizedDate = uiDateUtils.toStandardDateFormat(date, mode);
    }

    return support.inputType(mode) ? stringDate : localizedDate;
};

QUnit.module("datebox tests", moduleConfig, () => {
    QUnit.test("value is null after reset", (assert) => {
        const date = new Date(2012, 10, 26, 16, 40, 23);

        this.instance.option("value", date);
        this.instance.reset();

        assert.equal(this.instance.option("value"), null, "value is null after reset");
    });

    QUnit.test("render valueChangeEvent", (assert) => {
        this.instance.option({
            type: "date"
        });

        $(this.$input())
            .val("2012-11-26")
            .trigger("change");

        const value = this.instance.option("value");

        assert.equal(this.instance.option("valueChangeEvent"), "change", "T173149");
        assert.equal(value.getFullYear(), 2012);
        assert.equal(value.getMonth(), 10);
        assert.equal(value.getDate(), 26);
    });

    QUnit.test("simulated date picker should not be opened if pickerType is 'native'", assert => {
        const originalInputType = support.inputType;
        support.inputType = () => {
            return true;
        };

        const $dateBox = $("#dateBoxWithPicker").dxDateBox({
            pickerType: "native",
            deferRendering: false
        });

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        $($input).trigger("dxclick");

        const $popup = $dateBox.find(".dx-popup");

        assert.equal($popup.dxPopup("option", "visible"), false, "simulated datepicker is closed");
        support.inputType = originalInputType;
    });

    QUnit.test("simulated datepicker should not be draggable, T231481", assert => {
        const $dateBox = $("#dateBoxWithPicker").dxDateBox({
            pickerType: "native",
            deferRendering: false,
            opened: true
        });

        const $popup = $dateBox.find(".dx-popup");
        const popup = $popup.dxPopup("instance");

        assert.ok(!popup.option("dragEnabled"), "popup is not draggable");
    });

    QUnit.test("T204185 - dxDateBox input should be editable when pickerType is 'calendar'", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar"
        });

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.ok(!$input.prop("readOnly"), "correct readOnly value");
    });

    QUnit.test("readonly property should not be applied to the native picker on real ios", assert => {
        const deviceStub = sinon.stub(devices, "real").returns({
            deviceType: "mobile",
            version: [],
            platform: "ios"
        });

        try {
            const $dateBox = $("#dateBox").dxDateBox({
                pickerType: "native",
                acceptCustomValue: false
            });

            const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            assert.ok(!$input.prop("readOnly"), "correct readOnly value");
        } finally {
            deviceStub.restore();
        }
    });

    QUnit.test("dateBox with readOnly option enabled should not raise exception", assert => {
        try {
            $("#dateBox").dxDateBox({
                type: "date",
                readOnly: true,
                showClearButton: true
            });

            assert.ok(true);
        } catch(e) {
            assert.ok(false, "exception raised: " + e.message);
        }
    });

    QUnit.test("T204179 - dxDateBox should not render dropDownButton only for generic device when pickerType is 'native'", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "native"
        });

        const $dropDownButton = $dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`);
        const expectedButtonsNumber = devices.real().deviceType === "desktop" ? 0 : 1;

        assert.equal($dropDownButton.length, expectedButtonsNumber, "correct readOnly value");
    });

    QUnit.test("Datebox should set min and max attributes to the native input (T258860) after option changed", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "native",
            min: new Date(2015, 5, 2),
            max: new Date(2015, 7, 2)
        });

        const dateBox = $dateBox.dxDateBox("instance");
        let $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        dateBox.option({
            min: new Date(2015, 5, 3),
            max: new Date(2015, 7, 3)
        });

        $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        assert.equal($input.attr("min"), "2015-06-03", "minimum date changed correctly");
        assert.equal($input.attr("max"), "2015-08-03", "maximum date changed correctly");
    });

    QUnit.test("T195971 - popup is not showing after click on the 'clear' button", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "rollers",
            showClearButton: true
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $clearButton = $dateBox.find(".dx-clear-button-area");

        assert.ok(!dateBox.option("opened"), "popup is closed");
        $($clearButton).trigger("dxclick");
        assert.ok(!dateBox.option("opened"), "popup is still closed after click on clear button");
    });

    QUnit.test("invalid value should be cleared after clear button click", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            showClearButton: true,
            focusStateEnabled: true
        });
        const instance = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $clearButton = $dateBox.find(".dx-clear-button-area");

        $($input.val("asd")).trigger("change");
        $($clearButton).trigger("dxclick");

        assert.equal(instance.option("text"), "", "dateBox 'text' option is clear");
        assert.equal($input.val(), "", "dateBox input is empty");
    });

    QUnit.test("clear button press should save value change event", assert => {
        const onValueChanged = sinon.spy();

        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            showClearButton: true,
            onValueChanged,
            value: new Date()
        });

        const clearButton = $dateBox.find(".dx-clear-button-area");

        $(clearButton).trigger("dxclick");

        assert.equal(onValueChanged.callCount, 2, "value changed event was fired twice");
        assert.ok(onValueChanged.getCall(1).args[0].event, "event was saved");
    });

    QUnit.test("out of range value should not be marked as invalid on init", assert => {
        const $dateBox = $("#widthRootStyle").dxDateBox({
            value: new Date(2015, 3, 20),
            min: new Date(2014, 3, 20),
            max: new Date(2014, 4, 20)
        });

        const dateBox = $dateBox.dxDateBox("instance");

        assert.ok(dateBox.option("isValid"), "widget is valid on init");
    });

    QUnit.test("it shouild be impossible to set out of range time to dxDateBox using ui (T394206)", assert => {
        const $dateBox = $("#widthRootStyle").dxDateBox({
            opened: true,
            type: "datetime",
            pickerType: "calendarWithTime",
            value: new Date(2015, 3, 20, 15, 0, 0),
            min: new Date(2015, 3, 20, 15, 0, 0),
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $done = $(dateBox.content()).parent().find(CALENDAR_APPLY_BUTTON_SELECTOR);
        const $hourDown = $(dateBox.content()).parent().find(".dx-numberbox-spin-down").eq(0);

        $hourDown.trigger("dxpointerdown");
        $done.trigger("dxclick");

        assert.notOk(dateBox.option("isValid"), "widget is invalid");
    });

    QUnit.test("clear button should change validation state to valid", assert => {
        const $dateBox = $("#widthRootStyle").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            showClearButton: true,
            value: null
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const $clearButton = $dateBox.find(".dx-clear-button-area");

        keyboard.type("123").press("enter");
        assert.notOk(dateBox.option("isValid"), "widget is invalid");

        $clearButton.trigger("dxclick");
        assert.ok(dateBox.option("isValid"), "widget is valid");
    });

    QUnit.test("T252737 - the 'acceptCustomValue' option correct behavior", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            acceptCustomValue: false,
            valueChangeEvent: "change keyup",
            value: null,
            pickerType: "calendar"
        });

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        keyboardMock($input).type("2015/6/10");

        assert.equal($dateBox.dxDateBox("option", "value"), null, "value is not set");
        assert.equal($input.val(), "", "text is not rendered");
    });

    QUnit.test("T278148 - picker type should be 'rollers' if the real device is phone in generic theme", assert => {
        const realDevice = devices.real();
        const currentDevice = devices.current();

        devices.real({ deviceType: "phone", platform: "android", version: [4, 3] });
        devices.current({ platform: "generic" });

        try {
            const dateBox = $("<div>").dxDateBox({
                type: "date"
            }).dxDateBox("instance");
            assert.equal(dateBox.option("pickerType"), "rollers", "the 'pickerType' option is correct");
        } finally {
            devices.real(realDevice);
            devices.current(currentDevice);
        }
    });

    QUnit.test("Customize 'Done' and 'Cancel' buttons", assert => {
        const expectedDoneText = "newDoneText";
        const expectedCancelText = "newCancelText";

        const $dateBox = $("#dateBox").dxDateBox({
            applyButtonText: expectedDoneText,
            cancelButtonText: expectedCancelText,
            type: "datetime",
            pickerType: "calendarWithTime",
            opened: true
        });

        const instance = $dateBox.dxDateBox("instance");
        const $popupButtons = instance._popup._$bottom;

        const realDoneText = $popupButtons.find(".dx-popup-done").text();
        const realCancelText = $popupButtons.find(".dx-popup-cancel").text();

        assert.equal(realDoneText, expectedDoneText, "done text customized correctly");
        assert.equal(realCancelText, expectedCancelText, "cancel text customized correctly");
    });

    QUnit.test("T378630 - the displayFormat should not be changed if the type option is set", assert => {
        const displayFormat = "Y";

        const instance = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            displayFormat,
            type: "datetime",
            value: new Date(2016, 4, 13)
        }).dxDateBox("instance");

        assert.equal(instance.option("displayFormat"), displayFormat, "the displayFormat option is not changed");
    });

    QUnit.test("set maxWidth for time view when fallback strategy is used", assert => {
        if(!browser.msie) {
            assert.ok(true);
            return;
        }

        const dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendarWithTime",
            value: new Date()
        }).dxDateBox("instance");

        dateBox.option("opened", true);

        const maxWidth = $("." + TIMEVIEW_CLASS).css("maxWidth");
        assert.ok(typeUtils.isDefined(maxWidth), "maxWidth is defined");
        assert.equal(maxWidth, $("." + TIMEVIEW_CLOCK_CLASS).css("minWidth"), "minWidth of time view clock should be equal maxWidth");
    });

    QUnit.test("the 'displayFormat' option should accept format objects (T378753)", assert => {
        const date = new Date(2016, 4, 13, 22, 5);
        const format = {
            type: "longDate"
        };
        const $element = $("#dateBox").dxDateBox({
            value: date,
            pickerType: "calendar",
            displayFormat: format
        });

        const expectedDisplayValue = dateLocalization.format(date, format);
        assert.equal($element.find("." + TEXTEDITOR_INPUT_CLASS).val(), expectedDisplayValue, "correct display value");
    });

    QUnit.test("T437211: Custom dxDateBox value formatter is not called if the same value is typed twice", assert => {
        const date = new Date(2016, 4, 13, 22, 5);

        const format = {
            type: "longDate"
        };

        const $dateBox = $("#dateBox").dxDateBox({
            value: date,
            pickerType: "calendar",
            displayFormat: format
        });
        const instance = $dateBox.dxDateBox("instance");
        const expectedDisplayValue = dateLocalization.format(new Date(2016, 0, 1), format);

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input.val("");
        $input.val("1/01/2016");
        $input.change();
        assert.equal(instance.option("text"), expectedDisplayValue, "input value was formatted");

        $input.val("");
        $input.val("1/01/2016");
        $input.change();

        assert.equal(instance.option("text"), expectedDisplayValue, "input value was formatted");
    });

    QUnit.test("onPopupInitialized handler calls with the calendar picker type", assert => {
        assert.expect(1);

        $("#dateBoxWithPicker").dxDateBox({
            pickerType: "calendar",
            onPopupInitialized(e) {
                assert.equal(e.popup.NAME, "dxPopup", "initialized event is fired for popup");
            },
            opened: true
        });

    });

    QUnit.test("onPopupInitialized handler calls with the rollers picker type", assert => {
        assert.expect(1);

        $("#dateBoxWithPicker").dxDateBox({
            pickerType: "rollers",
            onPopupInitialized(e) {
                assert.equal(e.popup.NAME, "dxPopup", "initialized event is fired for popup");
            },
            opened: true
        });

    });

    QUnit.test("onPopupInitialized handler calls with the list picker type", assert => {
        assert.expect(1);

        $("#dateBoxWithPicker").dxDateBox({
            pickerType: "list",
            onPopupInitialized(e) {
                assert.equal(e.popup.NAME, "dxPopup", "initialized event is fired for popup");
            },
            opened: true
        });

    });
});

QUnit.module("hidden input", {}, () => {
    QUnit.test("the value should be passed to the hidden input in the correct format", assert => {
        const dateValue = new Date(2016, 6, 15, 14, 30);
        const types = ["datetime", "date", "time"];

        const $element = $("#dateBox").dxDateBox({
            value: dateValue
        });

        const instance = $element.dxDateBox("instance");

        $.each(types, (_, type) => {
            const stringValue = uiDateUtils.toStandardDateFormat(dateValue, uiDateUtils.SUBMIT_FORMATS_MAP[type]);
            instance.option("type", type);
            assert.equal($element.find("input[type='hidden']").val(), stringValue, "input value is correct for the '" + type + "' format");
        });
    });

    QUnit.test("the value should be passed to the hidden input on widget value change", assert => {
        const type = "date";

        const $element = $("#dateBox").dxDateBox({
            type
        });

        const instance = $element.dxDateBox("instance");
        const $hiddenInput = $element.find("input[type='hidden']");
        const expectedDateValue = new Date(2016, 6, 15);
        const expectedStringValue = uiDateUtils.toStandardDateFormat(expectedDateValue, type);

        instance.option("value", expectedDateValue);
        assert.equal($hiddenInput.val(), expectedStringValue, "input value is correct after widget value change");
    });

    QUnit.test("click on drop-down button should call click on input to show native picker (T824701)", assert => {
        const clickSpy = sinon.spy();
        const $element = $("#dateBox").dxDateBox({
            pickerType: "native",
            showDropDownButton: true
        });

        $element
            .find(`.${TEXTEDITOR_INPUT_CLASS}`)
            .on("click", clickSpy);

        $element
            .find(`.${DROP_DOWN_BUTTON_CLASS}`)
            .trigger("dxclick");

        assert.ok(clickSpy.calledOnce);
    });
});

QUnit.module("focus policy", {}, () => {
    QUnit.test("dateBox should stay focused after value selecting in date strategy", assert => {
        assert.expect(1);

        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            opened: true,
            focusStateEnabled: true
        });
        const instance = $dateBox.dxDateBox("instance");
        const $popupContent = $(instance._popup.$content().parent());

        $($popupContent).on("mousedown", e => {
            assert.ok(e.isDefaultPrevented(), "datebox does not lose focus on overlay content clicking");
        });

        // NOTE: why we use not dxpointerdown (T241214)
        $($popupContent).trigger("mousedown");
    });

    QUnit.test("dateBox should stay focused after value selecting in time strategy", assert => {
        assert.expect(1);

        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        const $dateBox = $("#dateBox").dxDateBox({
            type: "time",
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox("instance");
        const $popupContent = $(instance._popup.$content().parent());

        $($popupContent).on("mousedown", e => {
            assert.ok(e.isDefaultPrevented(), "datebox does not lose focus on popup content clicking");
        });

        // NOTE: why we use not dxpointerdown (T241214)
        $($popupContent).trigger("mousedown");
    });

    QUnit.test("dateBox should stay focused after value selecting in datetime strategy", assert => {
        assert.expect(1);

        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        const $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox("instance");
        const $popupContent = $(instance._popup.$content().parent());

        $($popupContent).on("mousedown", e => {
            assert.ok(e.isDefaultPrevented(), "datebox does not lose focus on popup content clicking");
        });

        // NOTE: why we use not dxpointerdown (T241214)
        $($popupContent).trigger("mousedown");
    });

    QUnit.test("calendar in datebox should not have tabIndex attribute", assert => {
        assert.expect(1);

        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox("instance");
        const $calendar = $(instance._popup.$content().find(".dx-calendar"));

        assert.equal($calendar.attr("tabindex"), null, "calendar has not tabindex");
    });

    QUnit.testInActiveWindow("set focus on 'tab' key from editor to overlay and inversely", assert => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        const $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        const keyboard = keyboardMock($input);

        keyboard.keyDown("tab");

        const $hourBox = $(instance._strategy._timeView._hourBox.$element());
        const $inputHourBox = instance._strategy._timeView._hourBox._input();
        assert.ok($hourBox.hasClass(STATE_FOCUSED_CLASS), "tab set focus to first input in overlay");

        $($inputHourBox).trigger($.Event("keydown", { key: "Tab", shiftKey: true }));

        assert.ok($dateBox.hasClass(STATE_FOCUSED_CLASS), "dateBox on focus reset focus to element");
    });

    QUnit.test("mousewheel action should not work if dateBox is not focused", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "desktop specific test");
            return;
        }

        const $dateBox = $("#dateBox").dxDateBox({ type: "datetime", useMaskBehavior: true });
        const dateBox = $dateBox.dxDateBox("instance");
        const initText = dateBox.option("text");
        const input = $(`.${TEXTEDITOR_INPUT_CLASS}`, $dateBox).get(0);
        const mouse = pointerMock(input).start();

        mouse.wheel(10);
        assert.strictEqual(dateBox.option("text"), initText);

        input.focus();

        mouse.wheel(10);
        assert.notStrictEqual(dateBox.option("text"), initText);
    });
});

QUnit.module("options changed callbacks", moduleConfig, () => {
    QUnit.test("value", (assert) => {
        let date = new Date(2012, 10, 26);
        const mode = this.instance.option("mode");

        this.instance.option("value", date);
        assert.equal(this.$input().val(), getExpectedResult(date, mode, "2012-11-26"));

        date = new Date(2012, 11, 26);

        this.instance.option("value", date);
        assert.equal(this.$input().val(), getExpectedResult(date, mode, "2012-12-26"));
    });

    QUnit.test("type", (assert) => {
        const date = new Date(2012, 10, 26, 16, 40, 23);

        this.instance.option({
            value: date,
            type: "date"
        });
        assert.equal(this.$input().val(), getExpectedResult(date, this.instance.option("mode"), "2012-11-26"));

        this.instance.option("type", "time");
        assert.equal(this.$input().val(), getExpectedResult(date, this.instance.option("mode"), "16:40"));
    });

    QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", (assert) => {
        this.instance.option("onValueChanged", () => {
            assert.ok(true);
        });
        this.instance.option("value", new Date(2015, 6, 14));
    });

    QUnit.test("empty class toggle depending on value", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: null,
            pickerType: "calendar",
            type: "date"
        });
        const dateBox = $dateBox.dxDateBox("instance");

        assert.ok($dateBox.hasClass("dx-texteditor-empty"), "empty class attached when value is empty");

        dateBox.option("value", new Date());

        assert.ok(!$dateBox.hasClass("dx-texteditor-empty"), "empty class removed when value is not empty");
    });

    QUnit.test("T188238 - changing of type leads to strategy changing", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date(),
            type: "date",
            pickerType: "calendar"
        });

        const dateBox = $dateBox.dxDateBox("instance");

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

    QUnit.test("dxDateBox calendar popup should be closed after value is changed if applyValueMode='instantly' (T189022)", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            applyValueMode: "instantly"
        });

        const dateBox = $dateBox.dxDateBox("instance");
        dateBox.open();
        $(getInstanceWidget(dateBox).$element().find(".dx-calendar-cell:not(.dx-calendar-selected-date)").eq(0)).trigger("dxclick");

        assert.ok(!dateBox.option("opened"), "dateBox popup is closed");
        assert.ok(!dateBox._popup.option("visible"), "popup is not visible");
    });

    QUnit.test("dxDateBox's value change doesn't lead to strategy's widget value change until popup is opened", assert => {
        const firstValue = new Date(2015, 0, 20);
        const secondValue = new Date(2014, 4, 15);

        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "date",
            value: firstValue
        });

        const dateBox = $dateBox.dxDateBox("instance");

        dateBox.open();
        dateBox.close();

        const calendar = getInstanceWidget(dateBox);

        assert.deepEqual(firstValue, calendar.option("value"), "values in datebox and calendar are the same");
        dateBox.option("value", secondValue);
        assert.deepEqual(firstValue, calendar.option("value"), "value in calendar isn't changed");
        dateBox.open();
        assert.deepEqual(secondValue, calendar.option("value"), "value in calendar is changed");
    });

    QUnit.test("dxDateBox's value change leads to strategy's widget value change if popup is opened", assert => {
        const firstValue = new Date(2015, 0, 20);
        const secondValue = new Date(2014, 4, 15);

        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "date",
            value: firstValue
        });

        const dateBox = $dateBox.dxDateBox("instance");

        dateBox.open();

        const calendar = getInstanceWidget(dateBox);

        assert.deepEqual(firstValue, calendar.option("value"), "values in datebox and calendar are the same");

        dateBox.option("value", secondValue);
        dateBox.open();
        assert.deepEqual(secondValue, calendar.option("value"), "value in calendar is changed");
    });

    QUnit.test("buttons are removed after applyValueMode option is changed", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            type: "date",
            applyValueMode: "useButtons",
            pickerType: "calendar",
            value: new Date()
        }).dxDateBox("instance");

        dateBox.open();
        let $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

        assert.equal($buttons.length, 3, "two buttons are rendered");

        dateBox.close();
        dateBox.option("applyValueMode", "instantly");
        dateBox.open();
        $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

        assert.equal($buttons.length, 0, "no buttons are rendered");
    });

    QUnit.test("closeOnValueChange option still affects on buttons rendering", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            type: "date",
            closeOnValueChange: false,
            pickerType: "calendar",
            value: new Date()
        }).dxDateBox("instance");

        dateBox.open();
        let $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

        assert.equal($buttons.length, 3, "two buttons are rendered");

        dateBox.close();
        dateBox.option("closeOnValueChange", true);
        dateBox.open();
        $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

        assert.equal($buttons.length, 0, "no buttons are rendered");
    });
});

QUnit.module("merging dates", moduleConfig, () => {
    QUnit.test("dates should be merged correctly", assert => {
        const $element = $("#dateBox").dxDateBox({
            value: new Date(2014, 10, 1, 11, 22),
            type: "date",
            pickerType: "native"
        });

        const instance = $element.dxDateBox("instance");
        const $input = $element.find("." + TEXTEDITOR_INPUT_CLASS);

        $input.val("2014-10-31");
        $input.triggerHandler("change");
        assert.equal(instance.option("value").valueOf(), new Date(2014, 9, 31, 11, 22).valueOf(), "date merged correctly");

        $input.val("2014-11-01");
        $input.triggerHandler("change");
        assert.equal(instance.option("value").valueOf(), new Date(2014, 10, 1, 11, 22).valueOf(), "date merged correctly");
    });

    QUnit.test("incorrect work of mergeDates function (B237850)", (assert) => {
        this.instance.option("type", "date");
        this.instance.option("value", new Date(2000, 6, 31, 1, 1, 1));

        $(this.$input())
            .val("2000-09-10")
            .trigger("change");

        assert.deepEqual(this.instance.option("value"), new Date(2000, 8, 10, 1, 1, 1));
    });

    QUnit.test("incorrect work of mergeDates function if previous value not valid (Q568689)", (assert) => {
        this.instance.option("type", "time");

        $(this.$input())
            .val("")
            .trigger("change");

        assert.strictEqual(this.instance.option("value"), null);

        $(this.$input())
            .val("12:30")
            .trigger("change");

        const date = new Date(null);
        date.setHours(12, 30, 0);
        assert.deepEqual(this.instance.option("value"), date);
    });

    QUnit.test("if value isn't specified then Unix Epoch is default for an editor with type 'time'", (assert) => {
        this.instance.option({
            type: "time",
            pickerType: "list",
            displayFormat: "longTime"
        });

        $(this.$input())
            .val("1:1:16 AM")
            .trigger("change");

        const value = this.instance.option("value");
        const defaultDate = new Date(null);

        assert.equal(value.getFullYear(), defaultDate.getFullYear(), "correct year");
        assert.equal(value.getMonth(), defaultDate.getMonth(), "correct month");
        assert.equal(value.getDate(), defaultDate.getDate(), "correct date");
    });

    QUnit.test("mergeDates must merge seconds when type is 'time'", (assert) => {
        this.instance.option({
            type: "time",
            value: new Date(2000, 6, 31, 1, 1, 1),
            pickerType: "list",
            displayFormat: "longTime"
        });

        $(this.$input())
            .val("1:1:16 AM")
            .trigger("change");

        const date = new Date(2000, 6, 31, 1, 1, 16);
        assert.deepEqual(this.instance.option("value"), date);
    });

    QUnit.test("mergeDates must merge milliseconds when type is 'time'", (assert) => {
        this.instance.option({
            type: "time",
            value: new Date(2000, 6, 31, 1, 1, 1),
            pickerType: "list",
            displayFormat: "millisecond"
        });

        $(this.$input())
            .val("16")
            .trigger("change");

        const now = new Date();
        const date = new Date(2000, 6, 31, now.getHours(), now.getMinutes(), now.getSeconds(), 16);
        assert.deepEqual(this.instance.option("value"), date);
    });
});

QUnit.module("dateView integration", {
    beforeEach: (...args) => {
        fx.off = true;
        this.originalInputType = support.inputType;
        support.inputType = () => {
            return false;
        };
        moduleConfig.beforeEach.apply(this, args);
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
    afterEach: (...args) => {
        moduleConfig.afterEach.apply(this, args);
        support.inputType = this.originalInputType;
        fx.off = false;
    }
}, () => {
    QUnit.test("check DateView default config", (assert) => {
        const { value, minDate, maxDate } = this.dateView().option();
        const FIFTY_YEARS = uiDateUtils.ONE_YEAR * 50;
        const defaultDate = new Date();

        defaultDate.setHours(0, 0, 0, 0);

        assert.deepEqual(value, defaultDate, "default value is the current date");
        assert.deepEqual(minDate, new Date(1900, 0, 1), "default min date is 'January 1 1900'");

        this.clock.now += FIFTY_YEARS;
        assert.deepEqual(maxDate, new Date(), "default max date is current date + 50 years");
    });

    QUnit.test("dateView renders", (assert) => {
        assert.equal(this.popup().$content().find(".dx-dateview").length, 1);
    });

    QUnit.test("readOnly input prop should be always true to prevent keyboard open if simulated dateView is using", (assert) => {
        this.instance.option("readOnly", false);
        assert.ok(this.$element.find("." + TEXTEDITOR_INPUT_CLASS).prop("readOnly"), "readonly prop specified correctly");
    });

    QUnit.test("dateView shows on field click", (assert) => {
        assert.ok(this.instance.option("openOnFieldClick"));
    });

    QUnit.test("dateView 'minDate' and 'maxDate' matches dateBox 'min' and 'max' respectively", (assert) => {
        this.instance.option("min", new Date(2000, 1, 1));
        assert.deepEqual(this.dateView().option("minDate"), new Date(2000, 1, 1));

        this.instance.option("max", new Date(2001, 2, 2));
        assert.deepEqual(this.dateView().option("maxDate"), new Date(2001, 2, 2));
    });

    QUnit.test("dateView 'value' and 'type' matches dateBox 'value' and 'type' respectively", (assert) => {
        this.instance.option("value", new Date(2000, 1, 1));
        this.instance.open();
        assert.deepEqual(this.dateView().option("value"), new Date(2000, 1, 1));
        this.instance.close();

        this.instance.option("value", new Date(2000, 2, 2));
        this.instance.open();
        assert.deepEqual(this.dateView().option("value"), new Date(2000, 2, 2));
    });

    QUnit.test("dateView 'type' option matches dateBox 'type' option", (assert) => {
        this.instance.option("type", "datetime");
        this.instance.open();
        assert.equal(getInstanceWidget(this.instance).option("type"), "datetime");

        this.instance.option("type", "time");
        this.instance.open();
        assert.equal(getInstanceWidget(this.instance).option("type"), "time");
    });

    QUnit.test("dateView should be updated on popup opening and closing (T578764)", (assert) => {
        this.instance.close();
        this.instance.option("value", new Date(2000, 2, 2));

        this.instance.open();
        assert.deepEqual(this.dateView().option("value"), new Date(2000, 2, 2), "update on opening when value changed via api");

        this.dateView().option("value", new Date(2001, 1, 3));
        this.instance.close();
        assert.deepEqual(this.dateView().option("value"), new Date(2000, 2, 2), "update on closing when value was not applied");
    });

    QUnit.test("dateView should not update dateBox value after closing using 'close' method", (assert) => {
        this.instance.option("value", new Date(2000, 1, 1));
        this.instance.open();

        this.dateView().option("value", new Date(2000, 2, 2));
        assert.deepEqual(this.instance.option("value"), new Date(2000, 1, 1));

        this.instance.close();
        assert.deepEqual(this.instance.option("value"), new Date(2000, 1, 1));
    });

    QUnit.test("render simulated dateView title when using option 'placeholder'", (assert) => {
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

    QUnit.test("specify dataPicker title, dependent from 'type' option, when 'placeholder' option is not defined", (assert) => {
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

    QUnit.test("cancel & done button action", (assert) => {
        const date = new Date(2012, 9, 10);
        const minDate = new Date(2000, 1);

        this.instance.option({ min: minDate, value: date });

        let rollers = this.dateView()._rollers;
        rollers.day.option("selectedIndex", 12);
        rollers.month.option("selectedIndex", 10);
        rollers.year.option("selectedIndex", 2);

        $(this.popup().overlayContent()).find(CALENDAR_APPLY_BUTTON_SELECTOR).trigger("dxclick");
        assert.deepEqual(this.instance.option("value"), new Date(2002, 10, 13));

        this.instance.open();

        rollers = this.dateView()._rollers;
        rollers.day.option("selectedIndex", 10);
        rollers.month.option("selectedIndex", 8);
        rollers.year.option("selectedIndex", 0);

        $(this.popup().overlayContent()).find(".dx-popup-cancel.dx-button").trigger("dxclick");
        assert.deepEqual(this.instance.option("value"), new Date(2002, 10, 13));
    });

    QUnit.test("specify dataPicker title, independent from 'type' option, when 'placeholder' option is defined", (assert) => {
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

    QUnit.test("Native datebox should have specific class", assert => {
        const $element = $("#dateBox").dxDateBox({
            pickerType: "native"
        });

        assert.ok($element.hasClass("dx-datebox-native"), "class is correct");
        assert.equal($element.dxDateBox("instance")._strategy.NAME, "Native", "correct strategy is chosen");
    });

    QUnit.test("pickerType should be 'rollers' on android < 4.4 (Q588373, Q588012)", (assert) => {
        support.inputType = () => {
            return true;
        };

        let originalDevice;

        try {
            originalDevice = devices.real();
            devices.real({ platform: "android", version: [4, 3], android: true });

            const dateBox = $("#dateBox").dxDateBox().dxDateBox("instance");
            assert.ok(dateBox.option("pickerType") !== "native");
        } finally {
            support.inputType = this.originalInputType;
            devices.real(originalDevice);
        }
    });

    QUnit.test("pickerType should be 'native' on android >= 4.4 (Q588373, Q588012)", (assert) => {
        support.inputType = () => {
            return true;
        };

        const originalDevice = devices.real();
        const currentDevice = devices.current();

        try {
            devices.real({ platform: "android", deviceType: "phone", version: [4, 4, 2], android: true });
            devices.current({ platform: "android" });

            const dateBox = $("#dateBoxWithPicker").dxDateBox().dxDateBox("instance");
            assert.ok(dateBox.option("pickerType") === "native");
        } finally {
            support.inputType = this.originalInputType;
            devices.real(originalDevice);
            devices.current(currentDevice);
        }
    });

    QUnit.test("B230631 - Can not clear datebox field", (assert) => {
        this.instance.option({
            value: new Date(),
            type: "datetime"
        });

        this.instance.open();

        const kb = keyboardMock(this.$input());

        clearInput(this.$input(), kb);

        kb.change();

        assert.equal(this.$input().val(), "");
        assert.equal(this.instance.option("value"), undefined);
    });

    QUnit.test("B236537 - onValueChanged event does not fire", (assert) => {
        let valueUpdated = false;

        this.instance.option({
            onValueChanged() {
                valueUpdated = true;
            }
        });

        assert.ok(!valueUpdated);

        this.instance.option("value", new Date(2012, 10, 26, 16, 40, 23));

        assert.ok(valueUpdated);
    });

    QUnit.test("B251997 - date picker is shown in spite of 'readOnly' is true", (assert) => {
        const originalSupportInputType = support.inputType;

        support.inputType = () => {
            return false;
        };

        try {
            this.instance.close();

            this.instance.option({
                readOnly: true,
                pickerType: "rollers"
            });

            const $wrapper = this.$element.find(".dx-dropdowneditor-input-wrapper");
            $wrapper.trigger("dxclick");
            assert.notOk(this.popup().option("visible"), "popup is hidden");

            this.instance.option({ readOnly: false });
            $wrapper.trigger("dxclick");

            assert.ok(this.popup().option("visible"), "popup is shown");
            assert.ok(this.popup().$content().find(".dx-dateview").is(":visible"), "picker is shown");
        } finally {
            support.inputType = originalSupportInputType;
        }
    });

    QUnit.test("Q559762 - input does not clear input value Samsung Android 4.1 devices", (assert) => {
        assert.equal(this.$input().attr("autocomplete"), "off");
    });

    QUnit.test("T170478 - no picker rollers should be chosen after click on 'cancel' button", (assert) => {
        const pointer = pointerMock($(".dx-dateviewroller").eq(0).find(".dx-scrollable-container"));

        assert.equal($(".dx-dateviewroller-current").length, 0, "no rollers are chosen after widget is opened first time");

        pointer.start().down().move(0, -20).up();
        assert.equal($(".dx-dateviewroller-current").length, 1, "one roller is chosen after scrolling");
        $(".dx-popup-cancel").trigger("dxclick");

        this.instance.open();
        assert.equal($(".dx-dateviewroller-current").length, 0, "no rollers are chosen after widget is opened second time");
    });

    QUnit.test("T207178 - error should not be thrown if value is null", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: null,
            pickerType: "rollers"
        });

        const dateBox = $dateBox.dxDateBox("instance");

        try {
            dateBox.open();
            assert.ok(true, "error is not thrown");
        } catch(e) {
            assert.ok(false, "error is thrown");
        }
    });

    QUnit.test("T319042 - input value should be correct if picker type is 'rollers' and 'type' is 'time'", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date(0, 0, 0, 15, 32),
            pickerType: "rollers",
            type: "time"
        });

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        assert.equal($input.val(), "3:32 PM", "input value is correct");
    });

    QUnit.test("the next value after null should have zero time components when type = 'date' (T407518)", assert => {
        const instance = $("#dateBox").dxDateBox({
            value: null,
            pickerType: "rollers",
            type: "date",
            opened: true
        }).dxDateBox("instance");

        $("." + DATEBOX_WRAPPER_CLASS).find(CALENDAR_APPLY_BUTTON_SELECTOR).trigger("dxclick");

        const value = instance.option("value");
        assert.equal(value.getHours(), 0, "hours component is 0");
        assert.equal(value.getMinutes(), 0, "minutes component is 0");
        assert.equal(value.getSeconds(), 0, "seconds component is 0");
        assert.equal(value.getMilliseconds(), 0, "milliseconds component is 0");
    });

    QUnit.test("Gesture cover should be hidden after wheel event processed by Overlay emitter (T820405)", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "gesture cover element is specific for desktop");
            return;
        }

        const pointer = pointerMock($(".dx-dateviewroller").eq(0).find(".dx-scrollable-container"));

        assert.equal($(".dx-dateviewroller-current").length, 0, "no rollers are chosen after widget is opened first time");

        pointer
            .start()
            .move(1)
            .wheel(-20);

        const $gestureCover = $(`.${GESTURE_COVER_CLASS}`);
        const initialPointerEvents = $gestureCover.css("pointerEvents");

        assert.strictEqual($gestureCover.length, 1, "gesture cover element created");
        assert.strictEqual(initialPointerEvents, "none", "correct default state");

        pointer
            .down()
            .move(1)
            .wheel(-20);

        assert.strictEqual($gestureCover.css("pointerEvents"), initialPointerEvents, "correct default state");
    });
});

QUnit.module("widget sizing render", {}, () => {
    QUnit.test("default", assert => {
        const $element = $("#dateBox").dxDateBox();

        assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
    });

    QUnit.test("widget shouldn't be wider than a container", assert => {
        const $element = $("#innerDateBox").dxDateBox();
        const instance = $element.dxDateBox("instance");

        assert.strictEqual(instance.option("width"), undefined);
        assert.ok($element.outerWidth() <= 100, "outer width of the element must be less or equal to a container width");
    });

    QUnit.test("validation icon should hide if container size is too small", assert => {
        const $element = $("#innerDateBox").dxDateBox({
            "showClearButton": true,
            "pickerType": "calendar",
        });
        const instance = $element.dxDateBox("instance");

        assert.notOk($element.hasClass('dx-show-invalid-badge'), "validation icon's hidden");
        $("#containerWithWidth").get(0).style.width = "200px";
        const kb = keyboardMock(instance._input());
        kb.type("a");
        kb.keyDown("enter");

        assert.ok($element.hasClass('dx-show-invalid-badge'), "validation icon's visible");
    });

    QUnit.test("component should have correct width when it was rendered in a scaled container (T584097)", assert => {
        const $parent = $("#parent-div");
        $parent.css("width", 200);

        const $element = $("#dateBox").appendTo($parent);

        const component = $("#dateBox").dxDateBox({
            width: undefined
        }).dxDateBox("instance");

        const { width: initialWidth } = $element.get(0).getBoundingClientRect();

        $parent.css("transform", "scale(0.5)");
        component.repaint();
        $parent.css("transform", "scale(1)");
        const { width: actualWidth } = component.$element().get(0).getBoundingClientRect();

        assert.strictEqual(actualWidth, initialWidth, "component has correct width");
    });

    QUnit.test("component width calculation should consider buttons containers element", assert => {
        const $parent = $("#parent-div");
        $parent.css("width", 200);

        const $element = $("#dateBox").appendTo($parent);
        const component = $("#dateBox").dxDateBox({
            width: undefined,
            showDropDownButton: false
        }).dxDateBox("instance");
        const { width: initialWidth } = $element.get(0).getBoundingClientRect();
        const instance = $element.dxDateBox("instance");

        instance.option("showDropDownButton", true);
        const { width: actualWidth } = component.$element().get(0).getBoundingClientRect();
        const { width: buttonWidth } = $(`.${BUTTONS_CONTAINER_CLASS}`).get(0).getBoundingClientRect();

        assert.strictEqual(actualWidth, initialWidth + buttonWidth);
    });

    QUnit.test("change width", assert => {
        const $element = $("#dateBox").dxDateBox({
            pickerType: "rollers"
        });

        const instance = $element.dxDateBox("instance");
        const customWidth = 400;

        instance.option("width", customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
    });
});

QUnit.module("datebox and calendar integration", () => {
    QUnit.test("default", assert => {
        const $element = $("#dateBox").dxDateBox({ pickerType: "calendar" });

        assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
    });

    QUnit.test("change width", assert => {
        const $element = $("#dateBox").dxDateBox({ pickerType: "calendar" });
        const instance = $element.dxDateBox("instance");
        const customWidth = 258;

        instance.option("width", customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
    });

    QUnit.test("change input value should change calendar value", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "date",
            value: new Date(2016, 1, 25)
        });
        $($dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`)).trigger("dxclick");

        const dateBox = $dateBox.dxDateBox("instance");
        const calendar = $(".dx-calendar").dxCalendar("instance");

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        let dateString = $input.val();
        dateString = dateString.slice(0, -1) + String(new Date().getYear() - 1).slice(-1);

        $input.val("");
        keyboardMock($input).type(dateString);
        $($input).trigger("change");

        assert.deepEqual(calendar.option("value"), dateBox.option("value"), "datebox value and calendar value are equal");
        assert.strictEqual(dateBox.option("isValid"), true, "Editor should be marked as true");
        assert.strictEqual(dateBox.option("validationError"), null, "No validation error should be specified for valid input");
    });

    QUnit.test("wrong value in input should mark datebox as invalid", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: null,
            type: "date",
            pickerType: "calendar"
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        keyboardMock($input).type("blabla");
        $($input).trigger("change");
        assert.equal($input.val(), "blabla", "input value should not be erased");
        assert.strictEqual(dateBox.option("value"), null, "Editor's value should be reset");
        assert.strictEqual(dateBox.option("isValid"), false, "Editor should be marked as invalid");
        const validationError = dateBox.option("validationError");
        assert.ok(validationError, "Validation error should be specified");
        assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
    });

    QUnit.test("datebox should not be revalidated when readOnly option changed", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            readOnly: false
        }).dxValidator({
            validationRules: [{
                type: "required",
                message: "Date of birth is required"
            }]
        }).dxDateBox("instance");

        dateBox.option("readOnly", true);
        dateBox.option("readOnly", false);

        assert.ok(dateBox.option("isValid"), "dateBox is valid");
        assert.notOk($("#dateBox").hasClass("dx-invalid"), "dateBox is not marked as invalid");
    });

    QUnit.test("wrong value in input should mark time datebox as invalid", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: null,
            type: "time",
            pickerType: "calendar"
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        keyboardMock($input).type("blabla");
        $($input).trigger("change");

        assert.equal($input.val(), "blabla", "input value should not be erased");
        assert.strictEqual(dateBox.option("value"), null, "Editor's value should be reset");
        assert.strictEqual(dateBox.option("isValid"), false, "Editor should be marked as invalid");
        const validationError = dateBox.option("validationError");
        assert.ok(validationError, "Validation error should be specified");
        assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
    });

    QUnit.test("wrong value in input should mark pre-filled datebox as invalid", assert => {
        const value = new Date(2013, 2, 2);

        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            value: new Date(value),
            pickerType: "calendar"
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        $input.val("");
        keyboardMock($input).type("blabla");
        $($input).trigger("change");

        assert.equal($input.val(), "blabla", "input value should not be erased");
        assert.deepEqual(dateBox.option("value"), value, "Editor's value should not be changed");
        assert.strictEqual(dateBox.option("isValid"), false, "Editor should be marked as invalid");

        const validationError = dateBox.option("validationError");
        assert.ok(validationError, "Validation error should be specified");
        assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
    });

    QUnit.test("correct value in input should mark datebox as valid but keep text", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: null,
            type: "date",
            pickerType: "calendar"
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

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

    QUnit.test("calendar picker should be used on generic device by default and 'type' is 'date'", assert => {
        const currentDevice = devices.current();
        const realDevice = devices.real();

        devices.real({ platform: "generic", deviceType: "desktop", phone: false });
        devices.current({ deviceType: "desktop" });

        try {
            const $dateBox = $("#dateBox").dxDateBox();
            const instance = $dateBox.dxDateBox("instance");

            assert.equal(instance.option("pickerType"), "calendar");
            assert.equal(instance._strategy.NAME, "Calendar");
        } finally {
            devices.current(currentDevice);
            devices.real(realDevice);
        }
    });

    QUnit.test("calendar picker should not be used on generic device by default and 'type' is not 'date'", assert => {
        const currentDevice = devices.current();
        devices.current({ platform: "generic", deviceType: "desktop" });

        try {
            const $dateBox = $("#dateBox").dxDateBox({
                pickerType: "calendar",
                type: "time"
            });
            assert.ok(!$dateBox.hasClass(DATEBOX_CLASS + "-calendar"));
        } finally {
            devices.current(currentDevice);
        }
    });

    QUnit.test("calendar picker should not be used on mobile device by default", assert => {
        const realDevice = devices.real();
        devices.real({ platform: "android" });

        try {
            const $dateBox = $("#dateBox").dxDateBox();
            assert.ok(!$dateBox.hasClass(DATEBOX_CLASS + "-calendar"));
        } finally {
            devices.real(realDevice);
        }
    });

    QUnit.test("correct default value for 'minZoomLevel' option", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            opened: true
        }).dxDateBox("instance");

        const calendar = getInstanceWidget(instance);

        assert.equal(calendar.option("minZoomLevel"), "century", "'minZoomLevel' option value is correct");
    });

    QUnit.test("correct default value for 'maxZoomLevel' option", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            opened: true
        }).dxDateBox("instance");

        const calendar = getInstanceWidget(instance);

        assert.equal(calendar.option("maxZoomLevel"), "month", "'maxZoomLevel' option value is correct");
    });

    QUnit.test("DateBox 'minZoomLevel' option should affect on Calendar 'minZoomLevel' option", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            calendarOptions: { minZoomLevel: "year" },
            opened: true
        }).dxDateBox("instance");

        let calendar = getInstanceWidget(instance);

        assert.equal(calendar.option("minZoomLevel"), "year", "calendar 'minZoomLevel' option is correct on init");

        instance.close();
        instance.option("calendarOptions.minZoomLevel", "month");
        instance.open();
        calendar = getInstanceWidget(instance);

        assert.equal(calendar.option("minZoomLevel"), "month", "calendar 'minZoomLevel' option after dateBox option change");
    });

    QUnit.test("DateBox 'maxZoomLevel' option should affect on Calendar 'maxZoomLevel' option", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            calendarOptions: { maxZoomLevel: "century" },
            opened: true
        }).dxDateBox("instance");

        let calendar = getInstanceWidget(instance);

        assert.equal(calendar.option("maxZoomLevel"), "century", "calendar 'maxZoomLevel' option is correct on init");

        instance.close();
        instance.option("calendarOptions.maxZoomLevel", "year");
        instance.open();
        calendar = getInstanceWidget(instance);

        assert.equal(calendar.option("maxZoomLevel"), "year", "calendar 'maxZoomLevel' option after dateBox option change");
    });

    QUnit.test("T208534 - calendar value should depend on datebox text option", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            valueChangeEvent: "keyup"
        }).dxDateBox("instance");

        const kb = keyboardMock(instance._input());

        kb
            .press('end')
            .press('backspace')
            .type('4');

        instance.open();
        assert.deepEqual(new Date(2014, 4, 12), instance._strategy._widget.option("value"), "calendar value is correct");
    });

    QUnit.test("calendar value should depend on datebox text option when calendar is opened", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            valueChangeEvent: 'keyup',
            opened: true
        }).dxDateBox("instance");

        const kb = keyboardMock(instance._input());
        const calendar = instance._strategy._widget;

        kb
            .caret(9)
            .press('backspace')
            .type('4');

        assert.deepEqual(new Date(2014, 4, 12), calendar.option("value"), "calendar value is correct");

        kb.press('backspace');
        assert.deepEqual(new Date(201, 4, 12), calendar.option("value"), "calendar value is correct");

        kb.type('3');
        assert.deepEqual(new Date(2013, 4, 12), calendar.option("value"), "calendar value is correct");
    });

    QUnit.test("changing 'displayFormat' should update input value", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date('03/10/2015'),
            pickerType: 'calendar',
            type: 'date'
        });
        const dateBox = $dateBox.dxDateBox("instance");
        dateBox.option("displayFormat", "shortDateShortTime");

        assert.equal($dateBox.find("." + TEXTEDITOR_INPUT_CLASS).val(), "3/10/2015, 12:00 AM", "input value is updated");
    });

    QUnit.test("displayFormat should affect on timeView", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date('03/10/2015'),
            displayFormat: 'shortdateshorttime',
            pickerType: 'calendar',
            opened: true,
            type: 'datetime'
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $content = $(dateBox._popup.$content());
        const timeView = $content.find("." + TIMEVIEW_CLASS).dxTimeView("instance");

        assert.notOk(timeView.option("use24HourFormat"), "using 12 hour format");

        dateBox.option("displayFormat", "hour");
        assert.ok(timeView.option("use24HourFormat"), "using 24 hour format");
    });

    QUnit.test("disabledDates correctly displays", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            disabledDates: [new Date(2015, 4, 13)],
            opened: true
        }).dxDateBox("instance");

        const calendar = getInstanceWidget(instance);
        const $disabledCell = calendar.$element().find(".dx-calendar-empty-cell");

        assert.equal($disabledCell.length, 1, "There is one disabled cell");
        assert.equal($disabledCell.text(), "13", "Correct cell is disabled");
    });

    QUnit.test("disabledDates correctly displays after optionChanged", assert => {
        const instance = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            disabledDates: [new Date(2015, 4, 13)],
            opened: true
        }).dxDateBox("instance");

        instance.option("disabledDates", e => {
            if(e.date.getDate() === 14 && e.date.getMonth() === 3) {
                return true;
            }
        });

        const calendar = getInstanceWidget(instance);
        const $disabledCell = calendar.$element().find(".dx-calendar-empty-cell");

        assert.equal($disabledCell.length, 1, "There is one disabled cell");
        assert.equal($disabledCell.text(), "14", "Correct cell is disabled");
    });

    QUnit.test("disabledDates argument contains correct component parameter", assert => {
        const stub = sinon.stub();

        $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            disabledDates: stub,
            opened: true
        });

        const component = stub.lastCall.args[0].component;
        assert.equal(component.NAME, "dxDateBox", "Correct component");
    });

    QUnit.test("datebox with the 'datetime' type should keep event subscriptions", assert => {
        const stub = sinon.stub();

        const dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            adaptivityEnabled: true,
            onInitialized(e) {
                e.component.on("optionChanged", stub);
            }
        }).dxDateBox("instance");

        assert.equal(stub.callCount, 1, "set text on render");

        dateBox.option("opened", true);

        assert.equal(stub.callCount, 2, "'opened' optionChanged event has been raised");
    });
});

QUnit.module("datebox w/ calendar", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers(new Date().valueOf());
        fx.off = true;

        this.fixture = new DevExpress.ui.testing.DateBoxFixture("#dateBox", {
            value: currentDate,
            calendarOptions: {
                currentDate,
                firstDayOfWeek
            },
            pickerType: "calendar"
        });
        this.reinitFixture = (options) => {
            this.fixture.dispose();
            this.fixture = new DevExpress.ui.testing.DateBoxFixture("#dateBox", options);
        };
    },
    afterEach: () => {
        this.fixture.dispose();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test("DateBox is defined", (assert) => {
        assert.ok(this.fixture.dateBox);
    });

    QUnit.test("DateBox can be instantiated", (assert) => {
        assert.ok(this.fixture.dateBox instanceof DateBox);
    });

    QUnit.test("DateBox must render an input", (assert) => {
        assert.ok(this.fixture.input.length);
    });

    QUnit.test("open must set 'opened' option", (assert) => {
        assert.ok(!this.fixture.dateBox.option("opened"));
        this.fixture.dateBox.open();
        assert.ok(this.fixture.dateBox.option("opened"));
    });

    QUnit.test("calendarOptions must be passed to dxCalendar on initialization", (assert) => {
        this.fixture.dateBox.open();
        currentDate.setDate(1);
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("currentDate"), currentDate);
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("firstDayOfWeek"), firstDayOfWeek);
    });

    QUnit.test("Clicking _calendarContainer must not close dropDown", (assert) => {
        this.fixture.dateBox.open();
        pointerMock(this.fixture.dateBox._calendarContainer).click();
        assert.ok(this.fixture.dateBox.option("opened"));
    });

    QUnit.test("DateBox must update the input value when the value option changes", (assert) => {
        const date = new Date(2011, 11, 11);
        this.fixture.dateBox.option("value", date);
        assert.deepEqual(this.fixture.input.val(), dateLocalization.format(date, this.fixture.format));
    });

    QUnit.test("DateBox must immediately display 'value' passed via the constructor on rendering", (assert) => {
        const date = new Date(2010, 10, 10);

        this.reinitFixture({
            value: date,
            calendarOptions: { currentDate, firstDayOfWeek },
            pickerType: "calendar"
        });

        assert.deepEqual(this.fixture.input.val(), dateLocalization.format(date, this.fixture.format));
    });

    QUnit.test("DateBox must pass value to calendar correctly if value is empty string", (assert) => {
        this.reinitFixture({
            value: '',
            pickerType: 'calendar',
            opened: true
        });

        assert.equal(this.fixture.dateBox._strategy._widget.option("value"), null, "value is correctly");
    });

    QUnit.test("DateBox must show the calendar with a proper date selected", (assert) => {
        const date = new Date(2011, 11, 11);
        this.fixture.dateBox.option("value", date);
        this.fixture.dateBox.open();
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("value"), date);
    });

    QUnit.test("DateBox must update its value when a date is selected in the calendar when applyValueMode='instantly'", (assert) => {
        const date = new Date(2011, 11, 11);

        this.reinitFixture({
            applyValueMode: "instantly",
            pickerType: "calendar"
        });

        this.fixture.dateBox.open();
        getInstanceWidget(this.fixture.dateBox).option("value", date);
        // this.fixture.dateBox.close();
        assert.strictEqual(this.fixture.dateBox.option("value"), date);
    });

    QUnit.test("DateBox must update the calendar value when the CalendarPicker.option('value') changes", (assert) => {
        this.reinitFixture({
            applyValueMode: "useButtons",
            pickerType: "calendar",
        });

        const date = new Date(2011, 11, 11);
        this.fixture.dateBox.open();
        this.fixture.dateBox.option("value", date);
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option("value"), date);
    });

    QUnit.test("When typing a correct date, dateBox must not make a redundant _setInputValue call", (assert) => {
        let _setInputValueCallCount = 0;

        const mockSetInputValue = () => {
            ++_setInputValueCallCount;
        };

        this.fixture.dateBox._setInputValue = mockSetInputValue;
        this.fixture.dateBox.open();
        this.fixture.typeIntoInput("11/11/2011", this.fixture.input);
        assert.strictEqual(_setInputValueCallCount, 0);
    });

    QUnit.test("Swiping must not close the calendar", (assert) => {
        $(this.fixture.dateBox._input()).focus();
        this.fixture.dateBox.open();
        pointerMock(this.fixture.dateBox._strategy._calendarContainer).start().swipeStart().swipeEnd(1);
        assert.ok(this.fixture.dateBox._input()[0] === document.activeElement);
    });

    QUnit.test("Pressing escape must hide the calendar and clean focus", (assert) => {
        const escapeKeyDown = $.Event("keydown", { key: "Escape" });
        this.fixture.dateBox.option("focusStateEnabled", true);
        this.fixture.dateBox.open();
        $(this.fixture.dateBox._input()).trigger(escapeKeyDown);
        assert.ok(!this.fixture.dateBox.option("opened"));
        assert.ok(!this.fixture.dateBox._input().is(":focus"));
    });

    QUnit.test("dateBox must show the calendar with proper LTR-RTL mode", (assert) => {
        this.fixture.dateBox.option("rtlEnabled", true);
        this.fixture.dateBox.open();
        assert.ok(getInstanceWidget(this.fixture.dateBox).option("rtlEnabled"));
    });

    QUnit.test("dateBox should not reposition the calendar icon in RTL mode", (assert) => {
        let iconRepositionCount = 0;

        const _repositionCalendarIconMock = () => {
            ++iconRepositionCount;
        };

        this.fixture.dateBox._repositionCalendarIcon = _repositionCalendarIconMock;
        this.fixture.dateBox.option("rtl", true);
        assert.strictEqual(iconRepositionCount, 0);
    });

    QUnit.test("dateBox must apply the wrapper class with appropriate picker type to the drop-down overlay wrapper", (assert) => {
        const dateBox = this.fixture.dateBox;
        dateBox.open();
        assert.ok(this.fixture.dateBox._popup._wrapper().hasClass(DATEBOX_WRAPPER_CLASS + "-" + dateBox.option("pickerType")));
    });

    QUnit.test("dateBox must correctly reopen the calendar after refreshing when it was not hidden beforehand", (assert) => {
        this.fixture.dateBox.open();
        this.fixture.dateBox._refresh();
        assert.ok(this.fixture.dateBox._$popup.dxPopup("instance").option("visible"));
    });

    QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", (assert) => {
        this.fixture.dateBox.option("onValueChanged", () => {
            assert.ok(true);
        });
        this.fixture.dateBox.option("value", new Date(2015, 6, 14));
    });

    QUnit.test("ValueChanged action should have jQuery event as a parameter when value was changed by user interaction", (assert) => {
        const valueChangedHandler = sinon.stub();

        this.fixture.dateBox.option({
            onValueChanged: valueChangedHandler,
            opened: true
        });

        $(".dx-calendar-cell").eq(0).trigger("dxclick");

        assert.deepEqual(this.fixture.dateBox.option("value"), new Date(2015, 10, 29), "value has been changed");
        assert.ok(valueChangedHandler.getCall(0).args[0].event, "Event is defined");
    });

    QUnit.test("valueChangeEvent cache should be cleared after the value changing", (assert) => {
        const valueChangedHandler = sinon.stub();

        this.fixture.dateBox.option({
            onValueChanged: valueChangedHandler,
            opened: true
        });

        $(".dx-calendar-cell").eq(0).trigger("dxclick");
        this.fixture.dateBox.option("value", new Date());

        assert.equal(valueChangedHandler.callCount, 2, "valueChangeEventHandler was called 2 times");
        assert.ok(valueChangedHandler.getCall(0).args[0].event, "Event exists in first call via user interaction");
        assert.notOk(valueChangedHandler.getCall(1).args[0].event, "Event does not exist in second call via api");
    });

    QUnit.test("dateBox's 'min' and 'max' options equal to undefined (T171537)", (assert) => {
        assert.strictEqual(this.fixture.dateBox.option("min"), undefined);
        assert.strictEqual(this.fixture.dateBox.option("max"), undefined);
    });

    QUnit.test("dateBox must pass min and max to the created calendar", (assert) => {
        const min = new Date(2010, 9, 10);
        const max = new Date(2010, 11, 10);
        this.reinitFixture({
            min,
            max,
            pickerType: "calendar"
        });
        this.fixture.dateBox.open();
        assert.ok(dateUtils.dateInRange(getInstanceWidget(this.fixture.dateBox).option("currentDate"), min, max));
    });

    QUnit.test("dateBox should not change value when setting to an earlier date than min; and setting to a later date than max", (assert) => {
        const min = new Date(2010, 10, 5);
        const max = new Date(2010, 10, 25);
        const earlyDate = new Date(min.getFullYear(), min.getMonth(), min.getDate() - 1);
        const lateDate = new Date(max.getFullYear(), max.getMonth(), max.getDate() + 1);

        this.reinitFixture({
            min,
            max,
            pickerType: "calendar"
        });

        this.fixture.dateBox.option("value", earlyDate);
        assert.deepEqual(this.fixture.dateBox.option("value"), earlyDate);

        this.fixture.dateBox.option("value", lateDate);
        assert.deepEqual(this.fixture.dateBox.option("value"), lateDate);
    });

    QUnit.test("should execute custom validator while validation state reevaluating", (assert) => {
        this.reinitFixture({ opened: true });

        const dateBox = this.fixture.dateBox;

        dateBox.$element().dxValidator({
            validationRules: [{
                type: "custom",
                validationCallback: () => false
            }]
        });

        const cell = dateBox._popup._wrapper().find(".dx-calendar-cell");

        assert.ok(dateBox.option("isValid"));
        assert.strictEqual(dateBox.option("text"), "");

        $(cell).trigger("dxclick");

        assert.notOk(dateBox.option("isValid"));
        assert.notStrictEqual(dateBox.option("text"), "");
    });

    QUnit.test("should rise validation event once after value is changed by calendar (T714599)", (assert) => {
        const validationCallbackStub = sinon.stub().returns(false);
        const dateBox = $("#dateBoxWithPicker")
            .dxDateBox({
                type: "datetime",
                pickerType: "calendar",
                value: new Date(2015, 5, 9, 15, 54, 13),
                opened: true
            })
            .dxValidator({
                validationRules: [{
                    type: "custom",
                    validationCallback: validationCallbackStub
                }]
            })
            .dxDateBox("instance");

        $(".dx-calendar-cell").eq(0).trigger("dxclick");
        $(CALENDAR_APPLY_BUTTON_SELECTOR).trigger("dxclick");

        assert.notOk(dateBox.option("opened"));
        assert.ok(validationCallbackStub.calledOnce);
    });

    QUnit.test("Editor should reevaluate validation state after change text to the current value", (assert) => {
        this.reinitFixture({
            min: new Date(2010, 10, 5),
            value: new Date(2010, 10, 10),
            type: "date",
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;

        $(dateBox._input())
            .val("11/3/2010")
            .change();

        assert.notOk(dateBox.option("isValid"), "Editor isn't valid");
        assert.equal(dateBox.option("text"), "11/3/2010");

        dateBox.open();

        const $selectedDate = dateBox._popup._wrapper().find(".dx-calendar-selected-date");
        $($selectedDate).trigger("dxclick");

        assert.ok(dateBox.option("isValid"), "Editor is valid");
        assert.equal(dateBox.option("text"), "11/10/2010");
    });

    QUnit.test("In dateTime strategy buttons should be placed in popup bottom", (assert) => {
        this.reinitFixture({
            type: "datetime",
            applyValueMode: "useButtons",
            pickerType: "calendar"
        });

        this.fixture.dateBox.open();

        assert.equal($(".dx-popup-bottom .dx-button").length, 3, "two buttons is in popup bottom");
    });

    QUnit.test("Click on apply button", (assert) => {
        const onValueChangedHandler = sinon.spy(noop);
        const newDate = new Date(2010, 10, 10);

        this.reinitFixture({
            onValueChanged: onValueChangedHandler,
            applyValueMode: "useButtons",
            pickerType: "calendar"
        });
        this.fixture.dateBox.open();
        getInstanceWidget(this.fixture.dateBox).option("value", newDate);
        $(CALENDAR_APPLY_BUTTON_SELECTOR).eq(0).trigger("dxclick");
        assert.equal(this.fixture.dateBox.option("opened"), false);
        assert.deepEqual(this.fixture.dateBox.option("value"), newDate);
        assert.ok(onValueChangedHandler.calledOnce);
    });

    QUnit.test("Click on cancel button", (assert) => {
        const onValueChangedHandler = sinon.spy(noop);
        const oldDate = new Date(2008, 8, 8);
        const newDate = new Date(2010, 10, 10);

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

    QUnit.test("calendar does not open on field click (T189394)", (assert) => {
        assert.ok(!this.fixture.dateBox.option("openOnFieldClick"));
    });

    const getLongestCaptionIndex = uiDateUtils.getLongestCaptionIndex;
    const getLongestDate = uiDateUtils.getLongestDate;

    QUnit.test("getLongestDate must consider the possibility of overflowing to the next month from its 28th day and thus losing the longest month name when calculating widths for formats containing day and month names", assert => {
        const someLanguageMonthNames = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "22", "1", "1"];
        const someLanguageDayNames = ["1", "1", "1", "1", "22", "1", "1"];
        const longestMonthNameIndex = getLongestCaptionIndex(someLanguageMonthNames);
        const longestDate = getLongestDate("D", someLanguageMonthNames, someLanguageDayNames);
        assert.strictEqual(longestDate.getMonth(), longestMonthNameIndex);
    });

    QUnit.test("Calendar should update it value accordingly 'text' option if it is valid (T189474)", (assert) => {
        const date = new Date(2014, 5, 10);

        this.reinitFixture({
            value: date,
            pickerType: "calendar"
        });

        this.fixture.dateBox.open();

        keyboardMock(this.fixture.input)
            .caret(9)
            .press("backspace")
            .type("5");

        this.fixture.input.trigger("change");
        this.fixture.dateBox.open();

        const calendar = getInstanceWidget(this.fixture.dateBox);
        assert.deepEqual(calendar.option("value"), new Date(2015, 5, 10));
    });

    QUnit.test("Calendar should not be closed after datebox value has been changed by input", (assert) => {
        const date = new Date(2014, 5, 10);

        this.reinitFixture({
            value: date,
            applyValueMode: "useButtons",
            pickerType: "calendar"
        });

        this.fixture.dateBox.open();

        keyboardMock(this.fixture.input)
            .caret(9)
            .press("backspace")
            .type("5");

        this.fixture.input.trigger("change");

        const calendar = getInstanceWidget(this.fixture.dateBox);
        assert.deepEqual(calendar.option("value"), new Date(2015, 5, 10));
        assert.ok(this.fixture.dateBox.option("opened"));
    });

    QUnit.test("Value should be changed only after click on 'Apply' button if the 'applyValueMode' options is changed to 'useButtons'", (assert) => {
        const value = new Date(2015, 0, 20);
        const newValue = new Date(2015, 0, 30);

        const dateBox = this.fixture.dateBox;

        dateBox.option("value", value);
        dateBox.open();
        dateBox.close();
        dateBox.option("applyValueMode", "useButtons");

        dateBox.open();
        const calendar = getInstanceWidget(dateBox);
        const $applyButton = dateBox._popup._wrapper().find(CALENDAR_APPLY_BUTTON_SELECTOR).eq(0);

        calendar.option("value", newValue);
        assert.deepEqual(dateBox.option("value"), value, "value is not changed yet");

        $($applyButton).trigger("dxclick");
        assert.deepEqual(dateBox.option("value"), newValue, "value is changed after click");
    });

    QUnit.test("Value should be changed if it was entered from keyboard and it is out of range", (assert) => {
        const value = new Date(2015, 0, 15);
        const min = new Date(2015, 0, 10);
        const max = new Date(2015, 0, 20);

        this.reinitFixture({
            value,
            min,
            max,
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;
        const $input = $(dateBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`));
        const kb = keyboardMock($input);
        const inputValue = "1/5/2015";

        clearInput($input, kb);
        kb.type(inputValue).change();
        assert.equal($input.val(), inputValue, "input value is correct");
        assert.deepEqual(dateBox.option("value"), value, "value has not been changed");
        assert.ok(!dateBox.option("isValid"), "datebox value is invalid");

        const validationError = dateBox.option("validationError");
        assert.ok(validationError, "Validation error should be specified");
        assert.ok(validationError.editorSpecific, "editorSpecific flag should be added");
    });

    QUnit.test("Empty value should not be marked as 'out of range'", (assert) => {
        const value = new Date(2015, 0, 15);
        const min = new Date(2015, 0, 10);
        const max = new Date(2015, 0, 20);

        this.reinitFixture({
            value,
            min,
            max,
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;
        const $input = $(dateBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`));
        const kb = keyboardMock($input);

        clearInput($input, kb);
        kb.change();
        assert.ok(dateBox.option("isValid"), "isValid flag should be set");
        assert.ok(!dateBox.option("validationError"), "validationError should not be set");
    });

    QUnit.test("Popup should not be hidden after value change using keyboard", (assert) => {
        const value = new Date(2015, 0, 29);

        this.reinitFixture({
            type: "date",
            value,
            closeOnValueChange: true,
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;
        const $input = $(dateBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`));
        const kb = keyboardMock($input);

        dateBox.open();
        assert.equal($input.val(), "1/29/2015", "correct input value");

        kb
            .caret(9)
            .press("backspace")
            .type("6")
            .change();

        assert.equal($input.val(), "1/29/2016", "input value is changed");
        assert.ok(dateBox.option("opened"), "popup is still opened");
    });

    QUnit.test("T196443 - dxDateBox should not hide popup after erase date in input field", (assert) => {
        const value = new Date(2015, 0, 30);

        this.reinitFixture({
            value,
            min: null,
            max: null,
            type: "date",
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;
        const $input = dateBox._input();
        const kb = keyboardMock($input);

        dateBox.open();
        kb.press("end");

        for(let i = 0; i < 10; i++) {
            kb.press("backspace");
        }

        assert.deepEqual(dateBox.option("value"), value, "datebox value is not changed");
        assert.ok(dateBox.option("opened"), "popup is still opened");
    });

    QUnit.test("T203457 - popup should be closed when selected date is clicked", (assert) => {
        const value = new Date(2015, 1, 1);

        this.reinitFixture({
            value,
            min: null,
            max: null,
            type: "date",
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;
        dateBox.open();
        const $selectedDate = dateBox._popup._wrapper().find(".dx-calendar-selected-date");
        $($selectedDate).trigger("dxclick");

        assert.ok(!dateBox.option("opened"), "popup is closed");
    });

    QUnit.test("T208825 - tapping on the 'enter' should change value if popup is opened", (assert) => {
        const value = new Date(2015, 2, 13);

        this.reinitFixture({
            value,
            focusStateEnabled: true,
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;
        const $input = dateBox._input();
        const kb = keyboardMock($input);

        dateBox.option("valueChangeEvent", "keyup");
        dateBox.open();

        kb
            .caret(9)
            .press('backspace')
            .type('4')
            .press('enter');

        assert.deepEqual(dateBox.option("value"), new Date(2014, 2, 13), "value is changed");
    });

    QUnit.test("Close popup on the 'enter' press after input value is changed", (assert) => {
        const value = new Date(2015, 2, 10);

        this.reinitFixture({
            value,
            focusStateEnabled: true,
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;

        dateBox.open();

        keyboardMock(dateBox._input())
            .press('end')
            .press('backspace')
            .type('4')
            .press('enter');

        assert.equal(dateBox.option("opened"), false, "popup is still opened");
    });

    QUnit.test("repaint was fired if strategy is fallback", (assert) => {
        this.reinitFixture({
            useNative: false,
            useCalendar: true,
            type: "datetime",
            pickerType: "calendarWithTime",
            opened: true
        });

        const dateBox = this.fixture.dateBox;
        const popup = dateBox.$element().find(".dx-popup").dxPopup("instance");
        const repaintSpy = sinon.spy(popup, "repaint");

        this.clock.tick();

        assert.ok(repaintSpy.called, "repaint was fired on opened");
    });

    QUnit.test("changing type from 'datetime' to 'date' should lead to strategy changing", (assert) => {
        this.reinitFixture({
            type: "datetime",
            pickerType: "calendar"
        });

        const dateBox = this.fixture.dateBox;
        assert.equal(dateBox._strategy.NAME, "CalendarWithTime", "correct strategy for the 'datetime' type");

        dateBox.option("type", "date");
        assert.equal(dateBox._strategy.NAME, "Calendar", "correct strategy for the 'date' type");
    });

    QUnit.test("T247493 - value is cleared when text is changed to invalid date and popup is opened", (assert) => {
        const date = new Date(2015, 5, 9);

        this.reinitFixture({
            pickerType: "calendar",
            value: date
        });

        const dateBox = this.fixture.dateBox;
        const $element = $(dateBox.$element());
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const kb = keyboardMock($input);

        kb
            .press('end')
            .press('backspace');

        dateBox.open();
        assert.deepEqual(dateBox.option("value"), date, "value is correct");
        assert.equal($input.val(), "6/9/201", "input value is correct");
    });

    QUnit.test("T252170 - date time should be the same with set value after calendar value is changed", (assert) => {
        const date = new Date(2015, 5, 9, 15, 54, 13);

        this.reinitFixture({
            pickerType: "calendar",
            type: "date",
            value: date
        });

        const dateBox = this.fixture.dateBox;
        dateBox.open();
        const calendar = dateBox._strategy._widget;
        const $calendar = $(calendar.$element());

        $($calendar.find(".dx-calendar-cell[data-value='2015/06/10']")).trigger("dxclick");
        assert.deepEqual(calendar.option("value"), new Date(2015, 5, 10, 15, 54, 13), "new calendar value saves set value time");
        assert.deepEqual(dateBox.option("value"), new Date(2015, 5, 10, 15, 54, 13), "new datebox value saves set value time");
    });

    QUnit.test("calendar views should be positioned correctly", assert => {
        $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(2015, 4, 12),
            opened: true
        });

        const $calendarViews = $(".dx-popup-wrapper .dx-calendar-views-wrapper .dx-widget");
        const viewWidth = $calendarViews.eq(0).width();

        assert.equal($calendarViews.eq(0).position().left, 0, "main view is at 0");
        assert.equal($calendarViews.eq(1).position().left, -viewWidth, "before view is at the left");
        assert.equal($calendarViews.eq(2).position().left, viewWidth, "after view is at the right");
    });

    QUnit.test("Popup with calendar strategy should be use 'flipfit flip' strategy", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            pickerType: "calendar",
            value: new Date(),
            deferRendering: true
        });

        $dateBox.dxDateBox("option", "popupPosition", { my: "bottom left" });

        $dateBox.dxDateBox("option", "opened", true);

        const popup = $dateBox.find(".dx-popup").dxPopup("instance");

        assert.equal(popup.option("position").collision, "flipfit flip", "collision set correctly");
        assert.equal(popup.option("position").my, "bottom left", "position is saved");
    });

    QUnit.test("Popup with calendarWithTime strategy should be use 'flipfit flip' strategy", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            value: new Date(),
            opened: true
        });

        assert.equal($dateBox.find(".dx-popup").dxPopup("option", "position").collision, "flipfit flip", "collision set correctly");
    });

    QUnit.test("DateBox should not take current date value at the opening if value is null", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: null,
            pickerType: "calendar"
        });

        const instance = $dateBox.dxDateBox("instance");
        const $dropDownButton = $dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`);

        $($dropDownButton).trigger("dxclick");

        assert.equal(instance.option("value"), null, "value shouldn't be dropped after opening");
    });

    QUnit.test("time component should not be changed if editing value with the help of keyboard (T398429)", (assert) => {
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

        const value = this.fixture.dateBox.option("value");
        assert.equal(value.getHours(), 14, "the 'hours' component has not been changed");
        assert.equal(value.getMinutes(), 15, "the 'minutes' component has not been changed");
    });
});

QUnit.module("datebox with time component", {
    beforeEach: () => {
        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test("date box should contain calendar and time view inside box in large screen", assert => {
        const originalWidthFunction = renderer.fn.width;

        try {
            sinon.stub(renderer.fn, 'width').returns(600);

            const $element = $("#dateBox").dxDateBox({
                type: "datetime",
                pickerType: "calendar",
                adaptivityEnabled: true,
                opened: true
            });

            const instance = $element.dxDateBox("instance");
            const $content = $(instance._popup.$content());
            const box = Box.getInstance($content.find("." + BOX_CLASS));
            const $clock = $content.find(".dx-timeview-clock");

            assert.equal(box.option("direction"), "row", "correct box direction specified");
            assert.ok(box.itemElements().eq(0).find("." + CALENDAR_CLASS).length, "calendar rendered");
            assert.ok(box.itemElements().eq(1).find("." + TIMEVIEW_CLASS).length, "timeview rendered");
            assert.equal($clock.length, 1, "clock was rendered");
        } finally {
            renderer.fn.width = originalWidthFunction;
        }
    });

    QUnit.test("date box should contain calendar and time view inside box in small screen", assert => {
        const originalWidthFunction = renderer.fn.width;

        try {
            sinon.stub(renderer.fn, 'width').returns(300);

            const $element = $("#dateBox").dxDateBox({
                type: "datetime",
                pickerType: "calendar",
                adaptivityEnabled: true,
                opened: true
            });

            const instance = $element.dxDateBox("instance");
            const $content = $(instance._popup.$content());
            const box = Box.getInstance($content.find("." + BOX_CLASS));
            const $clock = $content.find(".dx-timeview-clock");

            assert.equal(box.option("direction"), "row", "correct box direction specified");
            assert.ok(box.itemElements().eq(0).find("." + CALENDAR_CLASS).length, "calendar rendered");
            assert.ok(box.itemElements().eq(0).find("." + TIMEVIEW_CLASS).length, "timeview rendered");
            assert.equal($clock.length, 0, "clock was not rendered");
        } finally {
            renderer.fn.width = originalWidthFunction;
        }
    });

    QUnit.test("date box should have compact view when showAnalogClock option is false", assert => {
        const $element = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar"
        });

        const instance = $element.dxDateBox("instance");

        instance.option("showAnalogClock", false);
        instance.open();

        const $content = $(instance._popup.$content());
        const box = Box.getInstance($content.find("." + BOX_CLASS));
        const $clock = $content.find(".dx-timeview-clock");

        assert.equal(box.option("direction"), "row", "correct box direction specified");
        assert.ok(box.itemElements().eq(0).find("." + CALENDAR_CLASS).length, "calendar rendered");
        assert.ok(box.itemElements().eq(0).find("." + TIMEVIEW_CLASS).length, "timeview rendered");
        assert.equal($clock.length, 0, "clock was not rendered");
    });

    QUnit.test("date box wrapper adaptivity class depends on the screen size", assert => {
        const LARGE_SCREEN_SIZE = 2000;
        const SMALL_SCREEN_SIZE = 300;

        let stub = sinon.stub(renderer.fn, 'width').returns(LARGE_SCREEN_SIZE);

        try {
            const instance = $("#dateBox").dxDateBox({
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

    QUnit.test("dateBox with datetime strategy should be rendered once on init", assert => {
        const contentReadyHandler = sinon.spy();

        $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            onContentReady: contentReadyHandler
        }).dxDateBox("instance");

        assert.equal(contentReadyHandler.callCount, 1, "contentReady has been called once");
    });

    QUnit.test("date box popup should have maximum 100% width", assert => {
        const currentDevice = sinon.stub(devices, "current").returns({
            platform: "generic",
            phone: true
        });

        try {
            const instance = $("#dateBox").dxDateBox({
                type: "date",
                pickerType: "rollers",
                opened: true
            }).dxDateBox("instance");

            assert.equal(instance._popup.option("maxWidth"), "100%", "popup width should be correct on 320px screens");
            assert.equal(instance._popup.option("maxHeight"), "100%", "popup height should be correct on 320px screens");
        } finally {
            currentDevice.restore();
        }
    });

    QUnit.test("datebox value is bound to time view value", assert => {
        const $element = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            opened: true
        });

        const instance = $element.dxDateBox("instance");
        const $content = $(instance._popup.$content());
        const timeView = $content.find("." + TIMEVIEW_CLASS).dxTimeView("instance");

        let date = new Date(2014, 2, 1, 14, 33);
        instance.option("value", date);
        assert.equal(timeView.option("value").getTime(), date.getTime(), "timeView value is set");

        date = new Date(2014, 2, 1, 17, 47);
        timeView.option("value", date);

        $(CALENDAR_APPLY_BUTTON_SELECTOR).eq(0).trigger("dxclick");

        assert.equal(instance.option("value").toString(), date.toString(), "dateBox value is set");
    });

    QUnit.test("time value should be updated after select date", assert => {
        const $element = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            opened: true
        });

        const dateBox = $element.dxDateBox("instance");
        const $content = $(dateBox._popup.$content());
        const calendar = $content.find("." + CALENDAR_CLASS).dxCalendar("instance");
        const timeView = $content.find("." + TIMEVIEW_CLASS).dxTimeView("instance");

        calendar.option("value", new Date(2014, 2, 1, 11, 15));
        timeView.option("value", new Date(2014, 1, 1, 12, 16));

        $(CALENDAR_APPLY_BUTTON_SELECTOR).eq(0).trigger("dxclick");

        assert.equal(dateBox.option("value").toString(), (new Date(2014, 2, 1, 12, 16)).toString(), "dateBox value is set");
    });

    QUnit.test("buttons are rendered after 'type' option was changed", assert => {
        const $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            applyValueMode: "useButtons"
        });

        const dateBox = $element.dxDateBox("instance");

        dateBox.open();

        let $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");

        assert.equal($buttons.length, 3, "buttons are rendered");

        dateBox.option("type", "date");
        dateBox.open();
        dateBox.option("type", "datetime");
        dateBox.open();

        $buttons = $(".dx-datebox-wrapper .dx-toolbar .dx-button");
        assert.equal($buttons.length, 3, "buttons are rendered after option was changed");
    });

    QUnit.test("T208853 - time is reset when calendar value is changed", assert => {
        const $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            applyValueMode: "useButtons",
            value: new Date(2015, 1, 16, 11, 20)
        });

        const dateBox = $element.dxDateBox("instance");

        dateBox.open();

        const $dateBoxOverlay = $(".dx-datebox-wrapper");
        const $applyButton = $dateBoxOverlay.find(".dx-toolbar .dx-popup-done.dx-button");
        const calendar = $dateBoxOverlay.find(".dx-calendar").dxCalendar("instance");

        calendar.option("value", new Date(2014, 1, 16));
        $($applyButton).trigger("dxclick");

        assert.deepEqual(dateBox.option("value"), new Date(2014, 1, 16, 11, 20), "date and time are correct");
    });

    QUnit.test("T231015 - widget should set default date or time if only one widget's value is chosen", assert => {
        const $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            value: null
        });

        const dateBox = $element.dxDateBox("instance");

        dateBox.open();
        let date = new Date();
        dateBox._strategy._widget.option("value", new Date(2015, 3, 21));
        $(dateBox._popup._wrapper()).find(".dx-popup-done").trigger("dxclick");

        date.setFullYear(2015, 3, 21);
        uiDateUtils.normalizeTime(date);
        assert.equal(Math.floor(dateBox.option("value").getTime() / 1000 / 10), Math.floor(date.getTime() / 1000 / 10), "value is correct if only calendar value is changed");

        dateBox.option("value", null);
        dateBox._strategy._widget.option("value", null);
        dateBox.open();
        date = new Date();
        dateBox._strategy._timeView.option("value", new Date(2015, 3, 21, 15, 15));
        $(dateBox._popup._wrapper()).find(".dx-popup-done").trigger("dxclick");

        date.setHours(15, 15);
        uiDateUtils.normalizeTime(date);
        assert.equal(Math.floor(dateBox.option("value").getTime() / 1000 / 10), Math.floor(date.getTime() / 1000 / 10), "value is correct if only timeView value is changed");
    });

    QUnit.test("T253298 - widget should set default date and time if value is null and the 'OK' button is clicked", assert => {
        const $element = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            type: "datetime",
            value: null
        });

        const dateBox = $element.dxDateBox("instance");

        dateBox.open();
        const date = new Date();
        uiDateUtils.normalizeTime(date);
        $(dateBox._popup._wrapper()).find(".dx-popup-done").trigger("dxclick");

        const value = dateBox.option("value");
        assert.equal(value.getMilliseconds(), 0, "milliseconds is should be zero");
        assert.equal(Math.round(value.getTime() / 1000 / 10), Math.round(date.getTime() / 1000 / 10), "value is correct");
    });

    QUnit.test("DateBox should have time part when pickerType is rollers", assert => {
        const date = new Date(2015, 1, 1, 12, 13, 14);
        const dateBox = $("#dateBox").dxDateBox({
            pickerType: "rollers",
            type: "datetime",
            value: date
        }).dxDateBox("instance");

        const format = uiDateUtils.FORMATS_MAP["datetime"];
        const $input = $(dateBox.$element().find("." + TEXTEDITOR_INPUT_CLASS));

        assert.equal($input.val(), dateLocalization.format(date, format), "input value is correct");
    });

    QUnit.test("DateBox with time should be rendered correctly in IE, templatesRenderAsynchronously=true", assert => {
        const clock = sinon.useFakeTimers();
        try {
            const dateBox = $("#dateBox").dxDateBox({
                type: "datetime",
                pickerType: "calendar",
                value: new Date(),
                templatesRenderAsynchronously: true
            }).dxDateBox("instance");

            dateBox.option("opened", true);
            clock.tick();

            const $content = $(dateBox._popup.$content());
            const $timeView = $content.find(".dx-timeview-clock");
            assert.ok($timeView.parent().width() > 100, "Time view was rendered correctly");
        } finally {
            clock.restore();
        }
    });

    QUnit.test("Reset seconds and milliseconds when DateBox has no value for datetime view", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            min: new Date("2015/1/25"),
            max: new Date("2015/2/10")
        }).dxDateBox("instance");

        dateBox.open();

        $(".dx-calendar-cell").first().trigger("dxclick");
        $(CALENDAR_APPLY_BUTTON_SELECTOR).first().trigger("dxclick");

        assert.equal(dateBox.option("value").getSeconds(), 0, "seconds has zero value");
        assert.equal(dateBox.option("value").getMilliseconds(), 0, "milliseconds has zero value");
    });

    QUnit.test("Submit value should not be changed when apply button clicked and an invalid (by internal validation) value is selected", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            opened: true,
            min: new Date("2015/1/25 13:00:00"),
            value: new Date("2015/1/25 13:00:00")
        }).dxDateBox("instance");
        const $submitElement = $("#dateBox").find("input[type=hidden]");
        const $hourDownButton = $(dateBox.content()).find(".dx-numberbox-spin-down").first();

        $hourDownButton.trigger("dxpointerdown");
        $(CALENDAR_APPLY_BUTTON_SELECTOR).first().trigger("dxclick");

        assert.notOk(dateBox.option("isValid"), "editor is invalid");
        assert.equal($submitElement.val(), "2015-01-25T13:00:00", "submit element has correct value");
    });

    QUnit.test("Submit value should be changed when apply button clicked and an invalid (by validator) value is selected", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            opened: true,
            value: new Date("2015/1/25 13:00:00")
        }).dxValidator({
            validationRules: [{
                type: "custom",
                reevaluate: true,
                validationCallback: function(e) {
                    return false;
                }
            }]
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $submitElement = $("#dateBox").find("input[type=hidden]");
        const $hourDownButton = $(dateBox.content()).find(".dx-numberbox-spin-down").first();

        $hourDownButton.trigger("dxpointerdown");
        $(CALENDAR_APPLY_BUTTON_SELECTOR).first().trigger("dxclick");

        assert.notOk(dateBox.option("isValid"), "editor is invalid");
        assert.equal($submitElement.val(), "2015-01-25T12:00:00", "submit element has correct value");
    });

    QUnit.test("Reset seconds and milliseconds when DateBox has no value for time view", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            pickerType: "list",
            type: "time"
        }).dxDateBox("instance");

        dateBox.open();

        $(".dx-list-item").first().trigger("dxclick");

        assert.equal(dateBox.option("value").getSeconds(), 0, "seconds has zero value");
        assert.equal(dateBox.option("value").getMilliseconds(), 0, "milliseconds has zero value");
    });

    QUnit.test("DateBox renders the right stylingMode for editors in time view overlay (default)", assert => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }
        const dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            value: new Date("2015/1/25")
        }).dxDateBox("instance");

        dateBox.open();

        const hourEditor = $(".dx-timeview-field .dx-numberbox").eq(0);
        const minuteEditor = $(".dx-timeview-field .dx-numberbox").eq(1);
        const amPmEditor = $(".dx-timeview-field .dx-selectbox").eq(0);

        assert.ok(hourEditor.hasClass("dx-editor-outlined"));
        assert.ok(minuteEditor.hasClass("dx-editor-outlined"));
        assert.ok(amPmEditor.hasClass("dx-editor-outlined"));
    });

    QUnit.test("DateBox renders the right stylingMode for editors in time view overlay (custom)", assert => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }
        const dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            value: new Date("2015/1/25"),
            stylingMode: "underlined"
        }).dxDateBox("instance");

        dateBox.open();

        const hourEditor = $(".dx-timeview-field .dx-numberbox").eq(0);
        const minuteEditor = $(".dx-timeview-field .dx-numberbox").eq(1);
        const amPmEditor = $(".dx-timeview-field .dx-selectbox").eq(0);

        assert.ok(hourEditor.hasClass("dx-editor-underlined"));
        assert.ok(minuteEditor.hasClass("dx-editor-underlined"));
        assert.ok(amPmEditor.hasClass("dx-editor-underlined"));
    });

    QUnit.test("datebox with the 'datetime' type should have an 'event' parameter of the ValueChanged event", assert => {
        $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            onValueChanged: ({ event }) => {
                assert.ok(event, "event field is exist");
                assert.strictEqual(event.type, "dxclick", "it's a 'dxclick' event");
            },
            opened: true
        });

        $(`.${TODAY_CELL_CLASS}`).trigger("dxclick");
        $(CALENDAR_APPLY_BUTTON_SELECTOR).trigger("dxclick");
    });
});

QUnit.module("datebox w/ time list", {
    beforeEach: () => {
        fx.off = true;

        this.$dateBox = $("#dateBox");

        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: "list",
                type: "time"
            })
            .dxDateBox("instance");
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test("rendered markup", (assert) => {
        this.dateBox.option("opened", true);
        assert.ok($(DATEBOX_LIST_POPUP_SELECTOR).length, "Popup has dx-timebox-popup-wrapper class");
    });

    QUnit.test("rendered popup markup", (assert) => {
        this.dateBox.option("opened", true);

        assert.ok(this.dateBox._popup, "popup exist");
    });

    QUnit.test("rendered list markup", (assert) => {
        this.dateBox.option("opened", true);

        assert.ok(getInstanceWidget(this.dateBox), "list exist");
        assert.ok(getInstanceWidget(this.dateBox).$element().hasClass("dx-list"), "list initialized");
    });

    QUnit.test("width option test", (assert) => {
        this.dateBox.option("opened", false);
        this.dateBox.option("width", "auto");
        this.dateBox.option("opened", true);

        const popup = this.$dateBox.find(".dx-popup").dxPopup("instance");

        assert.equal(this.$dateBox.outerWidth(), popup.option("width"), "timebox popup has equal width with timebox with option width 'auto'");

        this.dateBox.option("opened", false);
        this.dateBox.option("width", "153px");
        this.dateBox.option("opened", true);
        assert.equal(this.$dateBox.outerWidth(), popup.option("width"), "timebox popup has equal width with timebox with option width in pixels");
    });

    QUnit.test("list should contain correct values if min/max does not specified", (assert) => {
        this.dateBox.option({
            min: null,
            max: null
        });

        this.dateBox.option("opened", true);

        const $timeList = $(".dx-list");
        const $listItems = $timeList.find(".dx-list-item-content");

        assert.equal($listItems.first().text(), "12:00 AM", "min value is right");
        assert.equal($listItems.last().text(), "11:30 PM", "max value is right");
    });

    QUnit.test("min/max option test", (assert) => {
        this.dateBox.option({
            min: new Date(2008, 7, 8, 4, 0),
            max: new Date(2008, 7, 8, 8, 59)
        });

        this.dateBox.option("opened", true);

        const $timeList = $(".dx-list");
        const $listItems = $timeList.find(".dx-list-item-content");

        assert.equal($listItems.first().text(), "4:00 AM", "min value is right");
        assert.equal($listItems.last().text(), "8:30 AM", "max value is right");
    });

    QUnit.test("min/max overflow test", (assert) => {
        this.dateBox.option({
            min: new Date(2008, 7, 8, 4, 0),
            max: new Date(2008, 7, 9, 9, 0)
        });

        this.dateBox.option("opened", true);

        const $timeList = $(".dx-list");
        const $listItems = $timeList.find(".dx-list-item-content");

        assert.equal($listItems.first().text(), "4:00 AM", "min value is right");
        assert.equal($listItems.last().text(), "3:30 AM", "max value is right");
    });

    QUnit.test("interval option", (assert) => {
        this.dateBox.option({
            min: new Date(2008, 7, 8, 4, 0),
            value: new Date(2008, 7, 8, 5, 0),
            max: new Date(2008, 7, 8, 6, 0),
            interval: 60
        });

        this.dateBox.option("opened", true);

        let $timeList = $(".dx-list");
        let items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 2, "interval option works");

        this.dateBox.option("interval", 120);
        this.dateBox.option("opened", true);

        $timeList = $(".dx-list");
        items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 1, "interval option works");
    });

    QUnit.test("T240639 - correct list item should be highlighted if appropriate datebox value is set", (assert) => {
        this.dateBox.option({
            type: "time",
            pickerType: "list",
            value: new Date(0, 0, 0, 12, 30),
            opened: true
        });

        const list = this.dateBox._strategy._widget;

        assert.deepEqual(list.option("selectedIndex"), 25, "selectedIndex item is correct");
        assert.deepEqual(list.option("selectedItem"), new Date(0, 0, 0, 12, 30), "selected list item is correct");

        this.dateBox.option("value", new Date(2016, 1, 1, 12, 20));

        assert.equal(list.option("selectedIndex"), -1, "there is no selected list item");
        assert.equal(list.option("selectedItem"), null, "there is no selected list item");
    });

    QUnit.test("T351678 - the date is reset after item click", (assert) => {
        this.dateBox.option({
            type: "time",
            pickerType: "list",
            value: new Date(2020, 4, 13, 12, 17),
            opened: true
        });

        const $list = $(this.dateBox._strategy._widget.$element());
        $($list.find(".dx-list-item").eq(3)).trigger("dxclick");

        assert.deepEqual(this.dateBox.option("value"), new Date(2020, 4, 13, 1, 30), "date is correct");
    });

    QUnit.test("the date should be in range after the selection", (assert) => {
        this.dateBox.option({
            type: "time",
            pickerType: "list",
            min: new Date(2016, 10, 5, 12, 0, 0),
            max: new Date(2016, 10, 5, 14, 0, 0),
            opened: true
        });

        const $item = $(this.dateBox.content()).find(".dx-list-item").eq(0);

        $item.trigger("dxclick");

        assert.deepEqual(this.dateBox.option("value"), new Date(2016, 10, 5, 12, 0, 0), "date is correct");
    });

    QUnit.test("list should have items if the 'min' option is specified (T395529)", (assert) => {
        this.dateBox.option({
            min: new Date(new Date(null).setHours(15)),
            opened: true
        });

        const list = $(".dx-list").dxList("instance");
        assert.ok(list.option("items").length > 0, "list is not empty");
    });

    QUnit.test("selected date should be in 1970 when it was set from the null value", (assert) => {
        this.dateBox.option({
            opened: true,
            value: null
        });

        const $item = $(this.dateBox.content()).find(".dx-list-item").eq(0);
        $item.trigger("dxclick");

        assert.strictEqual(this.dateBox.option("value").getFullYear(), new Date(null).getFullYear(), "year is correct");
    });

    QUnit.test("selected date should be in value year when value is specified", (assert) => {
        this.dateBox.option({
            opened: true,
            value: new Date(2018, 5, 6, 14, 12)
        });

        const $item = $(this.dateBox.content()).find(".dx-list-item").eq(0);
        $item.trigger("dxclick");

        assert.strictEqual(this.dateBox.option("value").getFullYear(), 2018, "year is correct");
    });

    QUnit.test("selected date should be in 1970 when it was set from user's input", (assert) => {
        this.dateBox.option({
            value: null,
            displayFormat: "HH:mm"
        });

        keyboardMock(this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`))
            .focus()
            .type("11:11")
            .change();

        assert.strictEqual(this.dateBox.option("value").getFullYear(), new Date(null).getFullYear(), "year is correct");
    });

    QUnit.test("the value's date part should not be changed if editing input's text by keyboard (T395685)", (assert) => {
        this.dateBox.option({
            focusStateEnabled: true,
            value: new Date(2016, 5, 25, 14, 22)
        });

        const $input = this.$dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        keyboardMock($input)
            .focus()
            .caret($input.val().length - 3)
            .press("backspace")
            .press("backspace")
            .type("44")
            .change();

        assert.deepEqual(this.dateBox.option("value"), new Date(2016, 5, 25, 14, 44), "value is correct");
    });

    QUnit.test("List of items should be refreshed after value is changed", (assert) => {
        this.dateBox.option({
            min: new Date(2016, 1, 1, 10, 0),
            value: new Date(2016, 1, 2, 14, 45),
            interval: 60,
            opened: true
        });

        const $timeList = $(".dx-list");
        let items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 24, "24 items should be find");

        this.dateBox.option("value", new Date(2016, 1, 1));

        items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 14, "14 items should be find from min to finish of day");
    });

    QUnit.test("All items in list should be present if value and min options are belong to different days", (assert) => {
        this.dateBox.option({
            min: new Date(2016, 1, 1, 13, 45),
            value: new Date(2016, 1, 1, 14, 45),
            interval: 60,
            opened: true
        });

        const $timeList = $(".dx-list");
        let items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 11, "interval option works");

        this.dateBox.option("value", new Date(2016, 1, 2, 13, 45));

        items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 24, "interval is correct");
        assert.equal(items.eq(0).text(), "12:45 AM", "start time is correct");
    });

    QUnit.test("The situation when value and max options are belong to one day", (assert) => {
        this.dateBox.option({
            value: new Date(2016, 1, 1, 13, 45),
            max: new Date(2016, 1, 1, 15, 0),
            interval: 60,
            opened: true
        });

        const $timeList = $(".dx-list");
        const items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 15, "list should be contain right count of items");
    });

    QUnit.test("value and max are belong to one day", (assert) => {
        this.dateBox.option({
            min: new Date(2016, 1, 1, 0, 11),
            value: new Date(2016, 1, 3, 14, 45),
            max: new Date(2016, 1, 3, 18, 22),
            interval: 60,
            opened: true
        });

        const $timeList = $(".dx-list");
        const items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 19, "list should be contain right count of items");
        assert.equal(items.eq(0).text(), "12:11 AM", "first item in list is correct");
        assert.equal(items.eq(items.length - 1).text(), "6:11 PM", "last item in list is correct");
    });

    QUnit.test("List items should be started with minimal possible value", (assert) => {
        this.dateBox.option({
            min: new Date(2016, 1, 1, 0, 17),
            value: new Date(2016, 1, 3, 14, 45),
            interval: 15,
            opened: true
        });

        const $timeList = $(".dx-list");
        const items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.eq(0).text(), "12:02 AM", "first item in list is correct");
        assert.equal(items.eq(items.length - 1).text(), "11:47 PM", "last item in list is correct");
    });

    QUnit.test("dxDateBox with list strategy automatically scrolls to selected item on opening", (assert) => {
        this.dateBox.option({
            value: new Date(2016, 1, 3, 14, 45),
            interval: 15,
            opened: true
        });

        this.dateBox.option("opened", true);

        const $popupContent = $(".dx-popup-content");
        const $selectedItem = $popupContent.find("." + LIST_ITEM_SELECTED_CLASS);

        assert.ok($popupContent.offset().top + $popupContent.height() > $selectedItem.offset().top, "selected item is visible");
    });

    QUnit.test("min/max settings should be work if value option is null", (assert) => {
        this.dateBox.option({
            value: null,
            min: new Date(2008, 7, 8, 8, 0),
            max: new Date(2008, 7, 8, 20, 0)
        });

        this.dateBox.option("opened", true);

        const $timeList = $(".dx-list");
        const $listItems = $timeList.find(".dx-list-item-content");

        assert.equal($listItems.first().text(), "8:00 AM", "min value is right");
        assert.equal($listItems.last().text(), "7:30 PM", "max value is right");
    });

    QUnit.test("min/max settings should be work if value option is undefined", (assert) => {
        this.dateBox.option({
            value: undefined,
            min: new Date(2008, 7, 8, 8, 0),
            max: new Date(2008, 7, 8, 20, 0)
        });

        this.dateBox.option("opened", true);

        const $timeList = $(".dx-list");
        const $listItems = $timeList.find(".dx-list-item-content");

        assert.equal($listItems.first().text(), "8:00 AM", "min value is right");
        assert.equal($listItems.last().text(), "7:30 PM", "max value is right");
    });

    QUnit.test("validator correctly check value with 'time' format", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "time",
            pickerType: "list",
            min: new Date(2015, 1, 1, 6, 0),
            max: new Date(2015, 1, 1, 16, 0),
            value: new Date(2015, 1, 1, 12, 0),
            opened: true
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        $input.val("11:30 AM").change();

        const value = dateBox.option("value");
        assert.equal($input.val(), "11:30 AM", "Correct input value");
        assert.equal(value.getHours(), 11, "Correct hours");
        assert.equal(value.getMinutes(), 30, "Correct minutes");
        assert.equal(dateBox.option("isValid"), true, "Editor should be marked as valid");
    });

    QUnit.testInActiveWindow("select a new value via the Enter key", (assert) => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "time",
            value: new Date(2018, 2, 2, 12, 0, 13),
            pickerType: "list"
        });

        const dateBox = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.focusin();
        this.dateBox.option("opened", true);
        keyboard
            .keyDown("down")
            .keyDown("down")
            .keyDown("enter");

        const value = dateBox.option("value");
        assert.equal($input.val(), "1:00 PM", "Correct input value");
        assert.equal(value.getHours(), 13, "Correct hours");
        assert.equal(value.getMinutes(), 0, "Correct minutes");
    });

    QUnit.test("items are rendered when value is 'undefined' (T805931)", (assert) => {
        this.dateBox.option({
            value: undefined
        });

        this.dateBox.option("opened", true);

        const $timeListItems = $(".dx-list .dx-list-item");
        assert.ok($timeListItems.length > 0);
    });
});

QUnit.module("keyboard navigation", {
    beforeEach: () => {
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

        this.$input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.testInActiveWindow("popup hides on tab", (assert) => {
        this.dateBox.focus();
        assert.ok(this.$dateBox.hasClass(STATE_FOCUSED_CLASS), "element is focused");
        this.dateBox.option("opened", true);
        this.keyboard.keyDown("tab");
        assert.ok(this.$dateBox.hasClass(STATE_FOCUSED_CLASS), "element is focused");

        assert.equal(this.dateBox.option("opened"), false, "popup is hidden");
    });

    QUnit.testInActiveWindow("home/end should not be handled", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        this.$input.focusin();
        this.dateBox.option("opened", true);
        const $timeList = $(".dx-list");

        this.keyboard.keyDown("down");
        this.keyboard.keyDown("end");
        assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "element is not focused");
        this.keyboard.keyDown("home");
        assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "element is not focused");
    });

    QUnit.testInActiveWindow("arrow keys control", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        this.$input.focusin();
        this.dateBox.option("opened", true);
        this.keyboard.keyDown("down");

        const $timeList = $(".dx-list");

        assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "the first item is not focused");

        this.keyboard.keyDown("down");
        assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "the first item is focused");

        this.keyboard.keyDown("down");
        assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(1).hasClass(STATE_FOCUSED_CLASS), "the second item is focused");

        this.keyboard.keyDown("up");
        assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), "the first item is focused");

        this.keyboard.keyDown("enter");
        assert.equal(this.dateBox.option("opened"), false, "popup is hidden");

        const selectedDate = this.dateBox.option("value");
        assert.equal(selectedDate.getHours(), 4, "hours is right");
        assert.equal(selectedDate.getMinutes(), 30, "minutes is right");
    });

    QUnit.test("apply contoured date on enter for date and datetime mode", (assert) => {
        if(devices.real().deviceType !== "desktop") {
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

        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $($input).trigger($.Event("keydown", { key: "ArrowUp" }));
        $($input).trigger($.Event("keydown", { key: "ArrowDown" }));
        $($input).trigger($.Event("keydown", { key: "ArrowUp" }));
        $($input).trigger($.Event("keydown", { key: "Enter" }));

        assert.equal(this.dateBox.option("opened"), false, "popup is hidden");

        const selectedDate = this.dateBox.option("value");
        assert.equal(selectedDate.getDate(), 1, "day is right");
    });

    QUnit.testInActiveWindow("valueChangeEvent should have Event when enter key was pressed", assert => {
        let $dateBox;

        try {
            const valueChangedHandler = sinon.stub();

            $dateBox = $("<div>").appendTo("body").dxDateBox({
                pickerType: "calendar",
                focusStateEnabled: true,
                onValueChanged: valueChangedHandler,
                opened: true
            });

            const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            const kb = keyboardMock($input);

            $input.focusin();
            kb.press("enter");

            assert.ok(valueChangedHandler.getCall(0).args[0].event, "Event exists");
        } finally {
            $dateBox.remove();
        }
    });

    QUnit.testInActiveWindow("onValueChanged fires after clearing and enter key press", (assert) => {
        const valueChanged = sinon.stub();

        this.dateBox = this.$dateBox
            .dxDateBox({
                value: null,
                pickerType: "calendar",
                type: "date",
                focusStateEnabled: true,
                opened: true,
                onValueChanged: valueChanged
            }).dxDateBox("instance");

        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input.focusin();

        $(".dx-calendar .dx-calendar-cell").eq(12).trigger("dxclick");

        // attempt to simulate real clearing
        $input.val("");
        this.dateBox.option("text", "");

        $($input).trigger($.Event("keydown", { key: "Enter" }));

        assert.equal(valueChanged.callCount, 2, "valueChanged is called");
    });

    QUnit.test("Enter key press prevents default when popup in opened", assert => {
        assert.expect(1);

        let prevented = 0;

        const $dateBox = $("<div>").appendTo("body").dxDateBox({
            pickerType: "calendar",
            focusStateEnabled: true,
            value: new Date(2015, 5, 13),
            opened: true
        });

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        try {
            $($dateBox).on("keydown", e => {
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

    QUnit.testInActiveWindow("the 'shift+tab' key press leads to the cancel button focus if the input is focused", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "desktop specific test");
            return;
        }

        this.dateBox.option({
            pickerType: "calendar",
            type: "datetime",
            opened: true,
            applyValueMode: "useButtons"
        });

        const $input = this.$dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        $input
            .focus()
            .trigger($.Event("keydown", {
                key: "Tab",
                shiftKey: true
            }));

        const $cancelButton = this.dateBox._popup._wrapper().find(".dx-button.dx-popup-cancel");
        assert.ok($cancelButton.hasClass("dx-state-focused"), "cancel button is focused");
    });

    QUnit.testInActiveWindow("Unsupported key handlers must be processed correctly", (assert) => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }

        this.dateBox.option({
            pickerType: "list",
            type: "time"
        });

        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        this.dateBox.focus();

        let isNoError = true;

        try {
            keyboard
                .press("down")
                .press("up")
                .press("right")
                .press("left");
        } catch(e) {
            isNoError = false;
        }

        assert.ok(isNoError, "key handlers processed without errors");
    });
});

QUnit.module("aria accessibility", {}, () => {
    QUnit.test("aria-activedescendant on combobox should point to the active list item (date view)", assert => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "test does not actual for mobile devices");
            return;
        }
        const $element = $("#dateBox").dxDateBox({
            value: new Date(2008, 7, 8, 5, 0),
            opened: true,
            pickerType: "calendar"
        });

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.keyDown("right");

        const $contouredCell = $(".dx-calendar-contoured-date");

        assert.notEqual($input.attr("aria-activedescendant"), undefined, "aria-activedescendant exists");
        assert.equal($input.attr("aria-activedescendant"), $contouredCell.attr("id"), "aria-activedescendant equals contoured cell's id");
    });

    QUnit.test("aria-activedescendant on combobox should point to the active list item (time view)", assert => {
        const isDesktop = devices.real().deviceType === "desktop";

        if(isDesktop) {
            const $element = $("#dateBox").dxDateBox({
                type: "time",
                pickerType: "list",
                value: new Date(2008, 7, 8, 5, 0),
                opened: true
            });

            const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            const keyboard = keyboardMock($input);

            keyboard.keyDown("down");

            const $activeItem = $(".dx-state-focused");

            assert.notEqual($input.attr("aria-activedescendant"), undefined, "aria-activedescendant exists");
            assert.equal($input.attr("aria-activedescendant"), $activeItem.attr("id"), "aria-activedescendant equals contoured cell's id");
        } else {
            assert.ok(true, "skip test on devices");
        }
    });
});

QUnit.module("pickerType", {}, () => {
    QUnit.test("T319039 - classes on DateBox should be correct after the 'pickerType' option changed", assert => {
        const pickerTypes = ["rollers", "calendar", "native", "list"];
        const $dateBox = $("#dateBox").dxDateBox();
        const dateBox = $dateBox.dxDateBox("instance");

        const areClassesCorrect = currentPickerType => {
            for(let i = 0, n = pickerTypes.length; i < n; i++) {
                const pickerType = pickerTypes[i];
                const className = DATEBOX_CLASS + "-" + pickerType;

                if(currentPickerType === pickerType ^ $dateBox.hasClass(className)) {
                    return false;
                }
            }

            return true;
        };

        for(let i = 0, n = pickerTypes.length; i < n; i++) {
            const pickerType = pickerTypes[i];
            const type = pickerType === "list" ? "time" : "date";

            dateBox.option({
                type,
                pickerType,
            });

            assert.ok(areClassesCorrect(pickerType), "classes for " + pickerType + " are correct");
        }
    });

    QUnit.test("Calendar pickerType and time type should use time list (T248089)", assert => {
        const currentDevice = devices.real();
        devices.real({ platform: "android" });

        try {
            const $element = $("#dateBox").dxDateBox({
                type: 'time',
                pickerType: 'calendar'
            });

            const instance = $element.dxDateBox("instance");

            assert.equal(instance._strategy.NAME, "List", "strategy is correct");
        } finally {
            devices.real(currentDevice);
        }
    });
});

QUnit.module("datebox validation", {}, () => {
    QUnit.test("validation should be correct when max value is chosen (T266206)", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            min: new Date(2015, 6, 10),
            max: new Date(2015, 6, 14),
            value: new Date(2015, 6, 14, 15, 30)
        });

        const dateBox = $dateBox.dxDateBox("instance");

        assert.ok(dateBox.option("isValid"), "datebox is valid");
    });

    QUnit.test("datebox should create validation error if user set isValid = false", (assert) => {
        const dateBox = $("#widthRootStyle").dxDateBox({
            type: "datetime",
            isValid: false,
            value: null
        }).dxDateBox("instance");

        assert.notOk(dateBox.option("isValid"), "isValid = false does not change on widget init by value validation");

        dateBox.option("value", new Date(2018, 1, 1));
        assert.ok(dateBox.option("isValid"), "valid after valid value is setted");

        dateBox.option("isValid", false);
        assert.notOk(dateBox.option("isValid"), "set isValid = false by API");
    });

    QUnit.test("datebox should be invalid after out of range value was setted", (assert) => {
        const dateBox = $("#widthRootStyle").dxDateBox({
            type: "datetime",
            min: new Date(2019, 1, 1),
            value: null
        }).dxDateBox("instance");

        assert.ok(dateBox.option("isValid"), "widget is valid");

        dateBox.option("value", new Date(2018, 0, 1));
        assert.notOk(dateBox.option("isValid"), "widget is invalid");

        dateBox.option("value", new Date(2019, 1, 2));
        assert.ok(dateBox.option("isValid"), "widget is valid");
    });

    QUnit.test("datebox should change validation state if value was changed by keyboard", (assert) => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            value: null,
            pickerType: "calendar"
        }).dxValidator({
            validationRules: [{
                type: "required"
            }]
        });
        const dateBox = $dateBox.dxDateBox("instance");
        const keyboard = keyboardMock($dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));

        keyboard
            .type("10/10/2014")
            .change();

        assert.ok(dateBox.option("isValid"), "widget is valid");
    });

    QUnit.test("required validator should not block valuechange in datetime strategy", (assert) => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            opened: true,
            value: null
        }).dxValidator({
            validationRules: [{
                type: "required"
            }]
        });
        const dateBox = $dateBox.dxDateBox("instance");
        const $done = $(dateBox.content()).parent().find(CALENDAR_APPLY_BUTTON_SELECTOR);

        $done.trigger("dxclick");

        assert.ok(dateBox.option("isValid"), "widget is valid");
        assert.ok(dateBox.option("value"), "value is not empty");
    });

    QUnit.test("widget is still valid after drop down is opened", assert => {
        const startDate = new Date(2015, 1, 1, 8, 12);

        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            value: startDate,
            pickerType: "calendar",
            applyValueMode: "instantly"
        }).dxValidator({
            validationRules: [
                { type: 'required' },
                { type: 'range', min: new Date(2016, 0, 1) }
            ]
        });

        const dateBox = $dateBox.dxDateBox("instance");

        assert.equal(dateBox.option("value"), startDate, "start value is correct");
        assert.ok(dateBox.option("isValid"), "value is valid");

        dateBox.option("opened", true);

        assert.ok(dateBox.option("isValid"), "value is still valid after drop down is opened");
        assert.equal(dateBox.option("value"), startDate, "start value is correct");

        dateBox.option("value", new Date(2017, 1, 1));
        assert.ok(dateBox.option("isValid"), "value is valid too");
    });

    QUnit.test("datebox with 'date' type should ignore time in min/max options", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2015, 0, 31, 10),
            focusStateEnabled: true,
            min: new Date(2015, 0, 31, 12)
        });

        assert.ok(!$dateBox.hasClass("dx-invalid"), "datebox should stay valid");
    });

    QUnit.test("time works correct when value is invalid", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "time",
            pickerType: "list",
            valueChangeEvent: "change"
        });

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        const $button = $dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`);

        $input.val("");
        $($input).trigger("change");
        $($button).trigger("dxclick");

        const popup = $dateBox.find(".dx-popup").dxPopup("instance");

        assert.ok(popup.option("visible"), "popup is opened");
    });

    QUnit.test("invalidDateMessage", assert => {
        if(devices.real().deviceType !== "desktop") {
            assert.expect(0);
            return;
        }

        const $dateBox = $("#dateBox").dxDateBox({
            invalidDateMessage: "A lorem ipsum..."
        });

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        $input.val("ips");
        $($input).trigger("change");

        const validationError = $dateBox.dxDateBox("instance").option("validationError").message;
        assert.equal(validationError, "A lorem ipsum...", "validation message is correct");
    });

    QUnit.test("dateOutOfRangeMessage", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            dateOutOfRangeMessage: "A lorem ipsum...",
            min: new Date(2015, 5, 5),
            max: new Date(2016, 5, 5),
            value: new Date(2017, 5, 5)
        });

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        $($input).trigger("change");

        const validationError = $dateBox.dxDateBox("instance").option("validationError").message;
        assert.equal(validationError, "A lorem ipsum...", "validation message is correct");
    });

    QUnit.test("year is too big", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            displayFormat: "d/M/y",
            valueChangeEvent: "change",
            mode: "text"
        });

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        $input.val("01/01/999999999");
        $($input).trigger("change");

        assert.equal($dateBox.dxDateBox("option", "isValid"), false, "datebox has invalid state");
        assert.equal($input.val(), "01/01/999999999", "value is not changed");
    });

    QUnit.test("datebox should not ignore the time component in validation when it is changed by timeview (T394206)", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            type: "datetime",
            pickerType: "calendar",
            value: new Date(2016, 6, 8, 8, 34),
            max: new Date(2016, 6, 8, 9, 15),
            opened: true
        });

        const $dateBoxWrapper = $("." + DATEBOX_WRAPPER_CLASS);
        const $hoursInput = $dateBoxWrapper.find(".dx-numberbox").eq(0).find("." + TEXTEDITOR_INPUT_CLASS);

        $hoursInput
            .val(9)
            .trigger("change");

        $dateBoxWrapper.find(".dx-button.dx-popup-done")
            .trigger("dxclick");

        assert.ok($dateBox.hasClass("dx-invalid"), "datebox should be marked as invalid");
    });

    QUnit.test("datebox should be valid if value was changed in the onValueChanged handle(T413553)", assert => {
        const date = new Date();

        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2016, 1, 1),
            onValueChanged(e) {
                if(!e.value) {
                    e.component.option("value", date);
                }
            },
        });

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input.val("");
        $($input).trigger("change");

        assert.equal(date, $dateBox.dxDateBox("instance").option("value"), "value set correctly");
        assert.ok(!$dateBox.hasClass("dx-invalid"), "datebox should be marked as valid");
    });

    QUnit.test("custom validation should be more important than internal", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2016, 1, 1)
        }).dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback(options) {
                    return false;
                }
            }]
        });

        const dateBox = $dateBox.dxDateBox("instance");

        dateBox.option("value", new Date());

        assert.notOk(dateBox.option("isValid"), "dateBox is invalid");
        assert.ok($dateBox.hasClass("dx-invalid"), "datebox should be marked as invalid");
    });

    QUnit.test("Internal validation should be valid when null value was set to null", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2016, 1, 1)
        });

        const dateBox = $dateBox.dxDateBox("instance");

        dateBox.option("value", null);

        assert.ok(!$dateBox.hasClass("dx-invalid"), "datebox should not be marked as invalid");
    });

    QUnit.test("Internal validation shouldn't be reset value if localization return null for invalid value", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            value: new Date(2016, 1, 1)
        });
        const dateBox = $dateBox.dxDateBox("instance");

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard
            .type("abc")
            .change();

        assert.equal($dateBox.hasClass("dx-invalid"), 1, "datebox should be marked as invalid");
        assert.equal(dateBox.option("text"), "abc2/1/2016", "text option shouldn't be reset");
    });

    QUnit.test("Validation should be correct when year of the value less than 100", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            min: new Date(2015, 6, 10),
            max: new Date(2015, 6, 14),
            value: new Date(2015, 6, 12),
            valueChangeEvent: "change",
            pickerType: "calendar"
        });

        const dateBox = $dateBox.dxDateBox("instance");

        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);
        $input.val("1/1/99");
        $input.change();

        assert.notOk(dateBox.option("isValid"), "datebox is invalid");
        const validationError = dateBox.option("validationError").message;
        assert.equal(validationError, "Value is out of range", "validation message is correct");
    });

    QUnit.test("dxDateBox should validate value after change 'max' option", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            max: new Date(2015, 6, 14),
            value: new Date(2015, 6, 12),
            pickerType: "calendar"
        }).dxDateBox("instance");

        dateBox.option("value", new Date(2015, 6, 20));
        dateBox.option("max", new Date(2015, 6, 25));

        assert.ok(dateBox.option("isValid"), "datebox is valid");
    });

    QUnit.test("dxDateBox should validate value after change 'min' option", assert => {
        const dateBox = $("#dateBox").dxDateBox({
            min: new Date(2015, 6, 14),
            value: new Date(2015, 6, 18),
            pickerType: "calendar"
        }).dxDateBox("instance");

        dateBox.option("value", new Date(2015, 6, 10));
        dateBox.option("min", new Date(2015, 6, 5));

        assert.ok(dateBox.option("isValid"), "datebox is valid");
    });

    QUnit.test("dxDateBox should become invalid if min/max options changed", (assert) => {
        const dateBox = $("#dateBox").dxDateBox({
            min: new Date(2015, 6, 14),
            value: new Date(2015, 6, 18),
            max: new Date(2015, 6, 20),
            pickerType: "calendar"
        }).dxDateBox("instance");

        dateBox.option("min", new Date(2015, 6, 19));
        assert.notOk(dateBox.option("isValid"), "datebox is invalid");

        dateBox.option("min", new Date(2015, 6, 14));
        assert.ok(dateBox.option("isValid"), "datebox is valid");

        dateBox.option("max", new Date(2015, 6, 17));
        assert.notOk(dateBox.option("isValid"), "datebox is invalid");

        dateBox.option("max", new Date(2015, 6, 20));
        assert.ok(dateBox.option("isValid"), "datebox is valid");
    });

    QUnit.test("required validator should not be triggered when another validation rule has been changed", (assert) => {
        const dateBox = $("#dateBox").dxDateBox({
            min: new Date(2015, 6, 14),
            value: null,
            max: new Date(2015, 6, 20),
            pickerType: "calendar"
        }).dxValidator({
            validationRules: [{ type: "required", message: "Date is required" }]
        }).dxDateBox("instance");

        dateBox.option({
            min: new Date(2015, 6, 13),
            max: new Date(2015, 6, 21)
        });

        assert.ok(dateBox.option("isValid"), "datebox is valid");
    });

    QUnit.testInActiveWindow("DateBox should validate value after remove an invalid characters", assert => {
        const $element = $("#dateBox");
        const dateBox = $element.dxDateBox({
            value: new Date(2015, 6, 18),
            pickerType: "calendar"
        }).dxDateBox("instance");
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard
            .caret(dateBox.option("text").length - 1)
            .type("d")
            .press("enter");

        assert.notOk(dateBox.option("isValid"));

        keyboard
            .press("backspace")
            .press("enter");

        assert.ok(dateBox.option("isValid"));
    });
});

QUnit.module("DateBox number and string value support", {
    beforeEach: () => {
        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test("string value should be supported", assert => {
        assert.expect(1);

        $("#dateBox").dxDateBox({
            value: "2015/08/09",
            onContentReady() {
                assert.ok(true, "widget is rendered without errors");
            }
        });
    });

    QUnit.test("number value should be supported", assert => {
        assert.expect(1);

        const date = new Date(2015, 7, 7);
        $("#dateBox").dxDateBox({
            value: date.valueOf(),
            onContentReady() {
                assert.ok(true, "widget is rendered without errors");
            }
        });
    });

    QUnit.test("date should be displayed correctly", assert => {
        const date = new Date(2015, 7, 14);
        const $dateBox = $("#dateBox").dxDateBox({
            type: "date",
            value: new Date(date)
        });
        const instance = $dateBox.dxDateBox("instance");
        const $input = $dateBox.find("." + TEXTEDITOR_INPUT_CLASS);

        const expectedText = $input.text();

        instance.option("value", date.valueOf());
        assert.equal($input.text(), expectedText, "date is displayed correctly when specified by number");

        instance.option("value", dateLocalization.format(date, instance.option("displayFormat")));
        assert.equal($input.text(), expectedText, "date is displayed correctly when specified by string");
    });

    QUnit.test("value should save its type after picker was used (type = 'date')", assert => {
        const date = new Date(2015, 7, 9);
        const dateString = "2015/08/09";
        const newDate = new Date(2015, 7, 21);
        const newDateString = "2015/08/21";

        const $dateBox = $("#dateBox").dxDateBox({
            value: dateString,
            type: "date",
            pickerType: "calendar",
            applyValueMode: "instantly",
            opened: true
        });
        const instance = $dateBox.dxDateBox("instance");

        $("td[data-value='" + getShortDate(newDate) + "']").trigger("dxclick");
        assert.equal(typeof instance.option("value"), "string", "value type is saved");
        assert.equal(instance.option("value"), newDateString, "value is correct");

        instance.option("value", date.valueOf());
        instance.open();

        $("td[data-value='" + getShortDate(newDate) + "']").trigger("dxclick");
        assert.equal(typeof instance.option("value"), "number", "value type is saved");
        assert.equal(instance.option("value"), newDate.valueOf(), "value is correct");
    });

    QUnit.test("value should remain correct after picker was used (type = 'datetime')", assert => {
        const dateString = "2015/08/09 18:33:00";
        const newDate = new Date(2015, 7, 21, 18, 33);

        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            applyValueMode: "instantly",
            type: "datetime",
            value: dateString,
            opened: true
        });
        const instance = $dateBox.dxDateBox("instance");

        $("td[data-value='" + getShortDate(newDate) + "']").trigger("dxclick");

        assert.deepEqual(new Date(instance.option("value")), newDate, "value is correct");
    });

    QUnit.test("value should remain correct after picker was used (type = 'time')", assert => {
        const $dateBox = $("#dateBox").dxDateBox({
            pickerType: "calendar",
            applyValueMode: "instantly",
            type: "time",
            value: dateLocalization.format(new Date(2015, 7, 9, 18, 33), "yyyy/MM/dd HH:mm:ss"),
            opened: true
        });
        const instance = $dateBox.dxDateBox("instance");

        $(".dx-list-item").eq(37).trigger("dxclick");

        const time = dateLocalization.format(new Date(instance.option("value")), "longtime");
        const expectedTime = dateLocalization.format(new Date(2015, 7, 9, 18, 30), "longtime");

        assert.equal(time, expectedTime, "value is correct");
    });

    QUnit.test("string value for the 'min' option should be supported", assert => {
        assert.expect(1);

        $("#dateBox").dxDateBox({
            value: "2015/08/09",
            min: "2015/05/09",
            onContentReady() {
                assert.ok(true, "widget is rendered without errors");
            }
        });
    });

    QUnit.test("number value for the 'min' option should be supported", assert => {
        assert.expect(1);

        $("#dateBox").dxDateBox({
            value: new Date(2015, 7, 7).valueOf(),
            min: new Date(2015, 4, 7).valueOf(),
            onContentReady() {
                assert.ok(true, "widget is rendered without errors");
            }
        });
    });

    QUnit.test("string value for the 'max' option should be supported", assert => {
        assert.expect(1);

        $("#dateBox").dxDateBox({
            value: "2015/08/09",
            max: "2015/10/09",
            onContentReady() {
                assert.ok(true, "widget is rendered without errors");
            }
        });
    });

    QUnit.test("number value for the 'max' option should be supported", assert => {
        assert.expect(1);

        $("#dateBox").dxDateBox({
            value: new Date(2015, 7, 7).valueOf(),
            max: new Date(2015, 9, 7).valueOf(),
            onContentReady() {
                assert.ok(true, "widget is rendered without errors");
            }
        });
    });

    QUnit.test("ISO strings support", assert => {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            $("#dateBox").dxDateBox({
                value: "2016-01-11T12:00:00",
                min: "2016-01-10T17:29:00",
                max: "2016-01-13T17:29:00",
                mode: "text"
            });

            const $input = $("#dateBox").find(`.${TEXTEDITOR_INPUT_CLASS}`);
            assert.equal($input.val(), "1/11/2016", "text is correct");

            $($input.val("1/12/2016")).trigger("change");

            assert.equal($("#dateBox").dxDateBox("option", "value"), "2016-01-12T12:00:00", "value is correct");
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test("ISO strings support dateSerializationFormat", assert => {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            $("#dateBox").dxDateBox({
                value: "2016-01-11T00:00:00Z",
                dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssZ",
                mode: "text"
            });

            const serializeUTCDate = (year, month, day) => {
                return dateSerialization.serializeDate(new Date(Date.UTC(year, month, day)), "M/d/y");
            };

            const $input = $("#dateBox").find(`.${TEXTEDITOR_INPUT_CLASS}`);
            assert.equal($input.val(), serializeUTCDate(2016, 0, 11), "text is correct");

            $($input.val(serializeUTCDate(2016, 0, 12))).trigger("change");
            assert.equal($("#dateBox").dxDateBox("option", "value"), "2016-01-12T00:00:00Z", "value is correct");
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    // T506146
    QUnit.test("enter value with big year if dateSerializationFormat is defined", assert => {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            $("#dateBox").dxDateBox({
                dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                mode: "text"
            });

            const $input = $("#dateBox").find(`.${TEXTEDITOR_INPUT_CLASS}`);

            $($input.val("1/12/21016")).trigger("change");

            assert.equal($("#dateBox").dxDateBox("option", "value"), "21016-01-12T00:00:00", "value is correct");
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test("enter value with big year if dateSerializationFormat is defined and forceIsoDateParsing is disabled", assert => {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = false;

        try {
            $("#dateBox").dxDateBox({
                dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                mode: "text"
            });

            const $input = $("#dateBox").find(`.${TEXTEDITOR_INPUT_CLASS}`);

            $($input.val("1/12/21016")).trigger("change");

            assert.deepEqual($("#dateBox").dxDateBox("option", "value"), new Date(21016, 0, 12), "value is correct and it is not serialized");
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test("onValueChanged should not be fired when on popup opening", assert => {
        let isValueChangedCalled = false;

        const dateBox = $("#dateBox").dxDateBox({
            value: undefined,
            mode: "text",
            onValueChanged() {
                isValueChangedCalled = true;
            }
        }).dxDateBox("instance");

        // act
        dateBox.option("opened", true);

        // assert
        assert.ok(!isValueChangedCalled, "onValueChanged is not called");
    });

    QUnit.test("value should be changed on cell click in calendar with defined dateSerializationFormat via defaultOptions", assert => {
        Calendar.defaultOptions({
            options: { dateSerializationFormat: 'yyyy-MM-dd' }
        });

        const $dateBox = $("#dateBox").dxDateBox({
            value: new Date(2017, 11, 25),
            pickerType: "calendar"
        });

        const dateBox = $dateBox.dxDateBox("instance");
        dateBox.open();

        // act
        $(".dx-calendar-cell").eq(0).trigger("dxclick");

        // assert
        assert.deepEqual(dateBox.option("value"), new Date(2017, 10, 26), "value is changed");

        Calendar.defaultOptions({
            options: { dateSerializationFormat: null }
        });
    });

});
