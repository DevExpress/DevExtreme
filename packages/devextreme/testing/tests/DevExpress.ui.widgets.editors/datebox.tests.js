import '../../helpers/noIntl.js';
import $ from 'jquery';
import Calendar from 'ui/calendar';
import config from 'core/config';
import dateLocalization from 'common/core/localization/date';
import dateSerialization from 'core/utils/date_serialization';
import dateUtils from 'core/utils/date';
import devices from '__internal/core/m_devices';
import fx from 'common/core/animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import messageLocalization from 'common/core/localization/message';
import localization from 'localization';
import ja from 'localization/messages/ja.json!';
import pointerMock from '../../helpers/pointerMock.js';
import support from '__internal/core/utils/m_support';
import typeUtils from 'core/utils/type';
import uiDateUtils from '__internal/ui/date_box/date_utils';
import DateBox from 'ui/date_box';
import { normalizeKeyName } from 'common/core/events/utils/index';

import '../../helpers/calendarFixtures.js';

import 'ui/validator';
import 'fluent_blue_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="parent-div"></div>\
        <div id="dateBox"></div>\
        <div id="dateBoxWithPicker"></div>\
        <div id="widthRootStyle"></div>\
        <div id="containerWithWidth"><div id="innerDateBox"></div></div';

    $('#qunit-fixture').html(markup);
    $('#containerWithWidth').css('width', '100px');
    $('#widthRootStyle').css('width', '300px');
});

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const DATEBOX_CLASS = 'dx-datebox';
const DATEBOX_WRAPPER_CLASS = 'dx-datebox-wrapper';
const LIST_ITEM_SELECTOR = '.dx-list-item';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
const GESTURE_COVER_CLASS = 'dx-gesture-cover';
const DROP_DOWN_BUTTON_CLASS = 'dx-dropdowneditor-button';
const BUTTON_CLASS = 'dx-button';
const TODAY_BUTTON_CLASS = 'dx-button-today';
const DROP_DOWN_BUTTON_VISIBLE_CLASS = 'dx-dropdowneditor-button-visible';
const LIST_CLASS = 'dx-list';
const CLEAR_BUTTON_AREA_CLASS = 'dx-clear-button-area';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_TODAY_BUTTON_CLASS = 'dx-calendar-today-button';
const CALENDAR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const DROPDOWNEDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const NUMBERBOX_SPIN_DOWN_CLASS = 'dx-numberbox-spin-down';
const SHOW_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';

const APPLY_BUTTON_SELECTOR = '.dx-popup-done.dx-button';
const CANCEL_BUTTON_SELECTOR = '.dx-popup-cancel.dx-button';
const TODAY_BUTTON_SELECTOR = `.${TODAY_BUTTON_CLASS}.${BUTTON_CLASS}`;
const BUTTON_SELECTOR = '.dx-button';
const TEXTBOX_SELECTOR = '.dx-textbox';
const TEXTEDITOR_EMPTY_INPUT_CLASS = 'dx-texteditor-empty';


const widgetName = 'dxDateBox';
const { module: testModule, test } = QUnit;

const getShortDate = date => {
    return dateSerialization.serializeDate(date, dateUtils.getShortDateFormat());
};

const getInstanceWidget = instance => {
    return instance._strategy._widget;
};

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(new Date().valueOf());

        this.$element = $('#dateBox')[widgetName]({ pickerType: 'native' });
        this.instance = this.$element[widgetName]('instance');
        this.$input = $.proxy(this.instance._input, this.instance);
    },
    afterEach: function() {
        this.clock.restore();
    }
};

const clearInput = ($element, keyboard) => {
    const textLength = $element.val().length;
    keyboard
        .caret({ start: 0, end: textLength })
        .press('backspace');
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

const prepareDateString = (type, year, month, day) => type === 'text' ? `${month}/${day}/${year}` : `${year}-${month}-${day}`;

QUnit.module('datebox tests', moduleConfig, () => {
    QUnit.test('value is null after reset', function(assert) {
        const date = new Date(2012, 10, 26, 16, 40, 23);

        this.instance.option('value', date);
        this.instance.clear();

        assert.equal(this.instance.option('value'), null, 'value is null after clear');
    });

    QUnit.test('render valueChangeEvent', function(assert) {
        this.instance.option({
            type: 'date'
        });

        const $input = $(this.$input());
        const newValue = prepareDateString($input.prop('type'), 2012, 11, 26);

        $input
            .val(newValue)
            .trigger('change');

        const value = this.instance.option('value');

        assert.equal(this.instance.option('valueChangeEvent'), 'change', 'T173149');
        assert.equal(value.getFullYear(), 2012);
        assert.equal(value.getMonth(), 10);
        assert.equal(value.getDate(), 26);
    });

    QUnit.test('simulated date picker should not be opened if pickerType is \'native\'', function(assert) {
        const originalInputType = support.inputType;
        support.inputType = () => {
            return true;
        };

        const $dateBox = $('#dateBoxWithPicker').dxDateBox({
            pickerType: 'native',
            deferRendering: false
        });

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        $($input).trigger('dxclick');

        const $popup = $dateBox.find('.dx-popup');

        assert.equal($popup.dxPopup('option', 'visible'), false, 'simulated datepicker is closed');
        support.inputType = originalInputType;
    });

    QUnit.test('simulated datepicker should not be draggable, T231481', function(assert) {
        const $dateBox = $('#dateBoxWithPicker').dxDateBox({
            pickerType: 'native',
            deferRendering: false,
            opened: true
        });

        const $popup = $dateBox.find('.dx-popup');
        const popup = $popup.dxPopup('instance');

        assert.ok(!popup.option('dragEnabled'), 'popup is not draggable');
    });

    QUnit.test('T204185 - dxDateBox input should be editable when pickerType is \'calendar\'', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar'
        });

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.ok(!$input.prop('readOnly'), 'correct readOnly value');
    });

    QUnit.test('readonly property should not be applied to the native picker on real ios', function(assert) {
        const deviceStub = sinon.stub(devices, 'real').returns({
            deviceType: 'mobile',
            version: [],
            platform: 'ios'
        });

        try {
            const $dateBox = $('#dateBox').dxDateBox({
                pickerType: 'native',
                acceptCustomValue: false
            });

            const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            assert.ok(!$input.prop('readOnly'), 'correct readOnly value');
        } finally {
            deviceStub.restore();
        }
    });

    QUnit.test('dateBox with readOnly option enabled should not raise exception', function(assert) {
        try {
            $('#dateBox').dxDateBox({
                type: 'date',
                readOnly: true,
                showClearButton: true
            });

            assert.ok(true);
        } catch(e) {
            assert.ok(false, 'exception raised: ' + e.message);
        }
    });

    QUnit.test('T204179 - dxDateBox should not render dropDownButton only for generic device when pickerType is \'native\'', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'native'
        });

        const $dropDownButton = $dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`);

        assert.equal($dropDownButton.length, 0, 'correct readOnly value');
    });

    QUnit.test('Datebox should set min/max attributes to datetime input in localized datetime format (T1252602)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            pickerType: 'native',
            value: new Date(2024, 8, 15, 16, 54, 10),
            min: new Date(2024, 8, 10, 16, 54, 14),
            max: new Date(2024, 8, 27, 16, 54, 15)
        });

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.equal($input.attr('min'), '2024-09-10T16:54:14', 'minimum date set correctly');
        assert.equal($input.attr('max'), '2024-09-27T16:54:15', 'maximum date set correctly');
    });

    QUnit.test('Datebox should set min/max attributes to time input in localized time format (T1252602)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'time',
            pickerType: 'native',
            value: new Date(2024, 8, 10, 16, 30),
            min: new Date(2024, 8, 10, 12, 0, 14),
            max: new Date(2024, 8, 10, 18, 0, 15)
        });
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.equal($input.attr('min'), '12:00:14', 'minimum time set correctly');
        assert.equal($input.attr('max'), '18:00:15', 'maximum time set correctly');
    });
    QUnit.test('Datebox should set min/max attributes to date input in localized date format (T1252602)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'native',
            value: new Date(2024, 8, 15),
            min: new Date(2024, 8, 10),
            max: new Date(2024, 8, 20)
        });
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.equal($input.attr('min'), '2024-09-10', 'minimum date set correctly');
        assert.equal($input.attr('max'), '2024-09-20', 'maximum date set correctly');
    });

    QUnit.test('Datebox should set min and max attributes to the native input (T258860) after option changed', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'native',
            min: new Date(2015, 5, 2),
            max: new Date(2015, 7, 2)
        });

        const dateBox = $dateBox.dxDateBox('instance');
        let $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        dateBox.option({
            min: new Date(2015, 5, 3),
            max: new Date(2015, 7, 3)
        });

        $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        assert.equal($input.attr('min'), '2015-06-03', 'minimum date changed correctly');
        assert.equal($input.attr('max'), '2015-08-03', 'maximum date changed correctly');
    });

    QUnit.test('T195971 - popup is not showing after click on the \'clear\' button', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'rollers',
            showClearButton: true
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $clearButton = $dateBox.find(`.${CLEAR_BUTTON_AREA_CLASS}`);

        assert.ok(!dateBox.option('opened'), 'popup is closed');
        $($clearButton).trigger('dxclick');
        assert.ok(!dateBox.option('opened'), 'popup is still closed after click on clear button');
    });

    QUnit.test('invalid value should be cleared after clear button click', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            showClearButton: true,
            focusStateEnabled: true
        });
        const instance = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $clearButton = $dateBox.find(`.${CLEAR_BUTTON_AREA_CLASS}`);

        $($input.val('asd')).trigger('change');
        $($clearButton).trigger('dxclick');

        assert.equal(instance.option('text'), '', 'dateBox \'text\' option is clear');
        assert.equal($input.val(), '', 'dateBox input is empty');
    });

    QUnit.test('out of range value should not be marked as invalid on init', function(assert) {
        const $dateBox = $('#widthRootStyle').dxDateBox({
            value: new Date(2015, 3, 20),
            min: new Date(2014, 3, 20),
            max: new Date(2014, 4, 20)
        });

        const dateBox = $dateBox.dxDateBox('instance');

        assert.ok(dateBox.option('isValid'), 'widget is valid on init');
    });

    QUnit.test('it shouild be impossible to set out of range time to dxDateBox using ui (T394206)', function(assert) {
        const $dateBox = $('#widthRootStyle').dxDateBox({
            opened: true,
            type: 'datetime',
            pickerType: 'calendarWithTime',
            value: new Date(2015, 3, 20, 15, 0, 0),
            min: new Date(2015, 3, 20, 15, 0, 0),
        });

        this.clock.tick(10);
        const dateBox = $dateBox.dxDateBox('instance');
        const $done = $(dateBox.content()).parent().find(APPLY_BUTTON_SELECTOR);
        const $hourDown = $(dateBox.content()).parent().find(`.${NUMBERBOX_SPIN_DOWN_CLASS}`).eq(0);

        $hourDown.trigger('dxpointerdown');
        $done.trigger('dxclick');

        assert.notOk(dateBox.option('isValid'), 'widget is invalid');
    });

    QUnit.test('type change should raise validation', function(assert) {
        const now = new Date();
        const $dateBox = $('#widthRootStyle').dxDateBox({
            type: 'date',
            value: now,
            pickerType: 'calendar',
            focusStateEnabled: true
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type('123').press('enter');
        assert.notOk(dateBox.option('isValid'), 'widget is invalid');

        dateBox.option('type', 'datetime');
        assert.ok(dateBox.option('isValid'), 'widget is valid after type change');
        assert.deepEqual(dateBox.option('value'), now, 'value has been reset');
    });

    QUnit.test('T252737 - the \'acceptCustomValue\' option correct behavior', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            acceptCustomValue: false,
            valueChangeEvent: 'change keyup',
            value: null,
            pickerType: 'calendar'
        });

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        keyboardMock($input).type('2015/6/10');

        assert.equal($dateBox.dxDateBox('option', 'value'), null, 'value is not set');
        assert.equal($input.val(), '', 'text is not rendered');
    });

    QUnit.test('After typing while calendar is opened the typed data should be saved', function(assert) {
        const optionsSet = [];
        [true, false].forEach(useMaskBehavior => {
            ['date', 'datetime'].forEach(type => {
                optionsSet.push({
                    useMaskBehavior,
                    type,
                    pickerType: 'calendar',
                    openOnFieldClick: true
                });
            });
        });

        optionsSet.forEach((options) => {
            const $dateBox = $('#dateBox').dxDateBox(
                options
            );

            const instance = $dateBox.dxDateBox('instance');
            const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            const kb = keyboardMock($input);
            const typedDate = (options.type === 'date' ? '10/6/2010' : '10/6/2010, 12:00 PM');
            const selectedDate = (options.type === 'date' ? '9/7/2010' : '9/7/2010, 12:00 PM');

            $input.val('');
            instance.open();
            this.clock.tick(10);
            kb.type(typedDate).press('enter');
            assert.deepEqual(instance.option('text'), typedDate, `typed value is set when useMaskBehavior:${options.useMaskBehavior}, type:${options.type}`);

            instance.open();
            this.clock.tick(10);
            kb
                .keyDown('left', { ctrlKey: true })
                .press('right')
                .press('enter');

            if(options.type === 'datetime') {
                kb.press('enter'); // confirm date with time
            }

            assert.deepEqual(instance.option('text'), selectedDate, `value is successfully changed by calendar when useMaskBehavior:${options.useMaskBehavior}, type:${options.type}`);
            instance.dispose();
        });
    });

    QUnit.test('T378630 - the displayFormat should not be changed if the type option is set', function(assert) {
        const displayFormat = 'Y';

        const instance = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            displayFormat,
            type: 'datetime',
            value: new Date(2016, 4, 13)
        }).dxDateBox('instance');

        assert.equal(instance.option('displayFormat'), displayFormat, 'the displayFormat option is not changed');
    });

    QUnit.test('the \'displayFormat\' option should accept format objects (T378753)', function(assert) {
        const date = new Date(2016, 4, 13, 22, 5);
        const format = {
            type: 'longDate'
        };
        const $element = $('#dateBox').dxDateBox({
            value: date,
            pickerType: 'calendar',
            displayFormat: format
        });

        const expectedDisplayValue = dateLocalization.format(date, format);
        assert.equal($element.find('.' + TEXTEDITOR_INPUT_CLASS).val(), expectedDisplayValue, 'correct display value');
    });

    QUnit.test('T437211: Custom dxDateBox value formatter is not called if the same value is typed twice', function(assert) {
        const date = new Date(2016, 4, 13, 22, 5);

        const format = {
            type: 'longDate'
        };

        const $dateBox = $('#dateBox').dxDateBox({
            value: date,
            pickerType: 'calendar',
            displayFormat: format
        });
        const instance = $dateBox.dxDateBox('instance');
        const expectedDisplayValue = dateLocalization.format(new Date(2016, 0, 1), format);

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input.val('');
        $input.val('1/01/2016');
        $input.change();
        assert.equal(instance.option('text'), expectedDisplayValue, 'input value was formatted');

        $input.val('');
        $input.val('1/01/2016');
        $input.change();

        assert.equal(instance.option('text'), expectedDisplayValue, 'input value was formatted');
    });

    QUnit.test('onPopupInitialized handler calls with the calendar picker type', function(assert) {
        assert.expect(1);

        $('#dateBoxWithPicker').dxDateBox({
            pickerType: 'calendar',
            onPopupInitialized(e) {
                assert.equal(e.popup.NAME, 'dxPopup', 'initialized event is fired for popup');
            },
            opened: true
        });

    });

    QUnit.test('onPopupInitialized handler calls with the rollers picker type', function(assert) {
        assert.expect(1);

        $('#dateBoxWithPicker').dxDateBox({
            pickerType: 'rollers',
            onPopupInitialized(e) {
                assert.equal(e.popup.NAME, 'dxPopup', 'initialized event is fired for popup');
            },
            opened: true
        });

    });

    QUnit.test('onPopupInitialized handler calls with the list picker type', function(assert) {
        assert.expect(1);

        $('#dateBoxWithPicker').dxDateBox({
            pickerType: 'list',
            onPopupInitialized(e) {
                assert.equal(e.popup.NAME, 'dxPopup', 'initialized event is fired for popup');
            },
            opened: true
        });

    });
});

QUnit.module('toolbar buttons', {}, () => {
    const types = [ 'date', 'datetime' ];

    const buttons = [
        {
            optionName: 'todayButtonText',
            name: 'Today',
            newText: 'newTodayText',
            selector: TODAY_BUTTON_SELECTOR,
            localizationMessageKey: 'dxCalendar-todayButtonText',
        },
        {
            optionName: 'applyButtonText',
            name: 'Done',
            newText: 'newDoneText',
            selector: APPLY_BUTTON_SELECTOR,
            localizationMessageKey: 'OK',
        },
        {
            optionName: 'cancelButtonText',
            name: 'Cancel',
            newText: 'newCancelText',
            selector: CANCEL_BUTTON_SELECTOR,
            localizationMessageKey: 'Cancel',
        },
    ];

    types.forEach(type => {
        QUnit.test(`Today button should have "dx-button-today" class (type=${type})`, function(assert) {
            const dateBox = $('#dateBox').dxDateBox({
                type,
                pickerType: 'calendar',
                opened: true,
                applyValueMode: 'useButtons',
            }).dxDateBox('instance');
            const $overlayContent = $(dateBox.content()).parent();
            const $todayButton = $overlayContent.find(`.${TODAY_BUTTON_CLASS}`);

            assert.strictEqual($todayButton.length, 1);
        });

        buttons.forEach(button => {
            QUnit.test(`"${button.optionName}" should customize ${button.name} button on init when type="${type}"`, function(assert) {
                const $dateBox = $('#dateBox').dxDateBox({
                    type,
                    pickerType: 'calendar',
                    opened: true,
                    applyValueMode: 'useButtons',
                    [button.optionName]: button.newText,
                });

                const instance = $dateBox.dxDateBox('instance');

                const $overlayContent = $(instance.content()).parent();
                const buttonText = $overlayContent.find(button.selector).text();

                assert.strictEqual(buttonText, button.newText, `${button.name} text customized correctly`);
            });

            QUnit.test(`"${button.optionName}" should customize ${button.name} button after init when type="${type}"`, function(assert) {
                const $dateBox = $('#dateBox').dxDateBox({
                    type,
                    pickerType: 'calendar',
                    opened: true,
                    applyValueMode: 'useButtons',
                });

                const instance = $dateBox.dxDateBox('instance');

                instance.option(button.optionName, button.newText);

                const $overlayContent = $(instance.content()).parent();
                const buttonText = $overlayContent.find(button.selector).text();

                assert.strictEqual(buttonText, button.newText, `${button.name} text customized correctly`);
            });

            QUnit.test(`The "${button.optionName}" value should be localized by default when type="${type}"`, function(assert) {
                const defaultLocale = localization.locale();

                try {
                    localization.loadMessages(ja);
                    localization.locale('ja');

                    const $dateBox = $('#dateBox').dxDateBox({
                        type,
                        pickerType: 'calendar',
                        opened: true,
                        applyValueMode: 'useButtons',
                    });

                    const instance = $dateBox.dxDateBox('instance');

                    const $overlayContent = $(instance.content()).parent();
                    const buttonText = $overlayContent.find(button.selector).text();

                    assert.strictEqual(buttonText, messageLocalization.format(button.localizationMessageKey), `the default "${button.optionName}" value is localized`);
                } finally {
                    localization.locale(defaultLocale);
                }
            });
        });
    });
});

QUnit.module('hidden input', {}, () => {
    QUnit.test('the value should be passed to the hidden input in the correct format', function(assert) {
        const dateValue = new Date(2016, 6, 15, 14, 30);
        const types = ['datetime', 'date', 'time'];

        const $element = $('#dateBox').dxDateBox({
            value: dateValue
        });

        const instance = $element.dxDateBox('instance');

        $.each(types, (_, type) => {
            const stringValue = uiDateUtils.toStandardDateFormat(dateValue, uiDateUtils.SUBMIT_FORMATS_MAP[type]);
            instance.option('type', type);
            assert.equal($element.find('input[type=\'hidden\']').val(), stringValue, 'input value is correct for the \'' + type + '\' format');
        });
    });

    QUnit.test('the value should be passed to the hidden input on widget value change', function(assert) {
        const type = 'date';

        const $element = $('#dateBox').dxDateBox({
            type
        });

        const instance = $element.dxDateBox('instance');
        const $hiddenInput = $element.find('input[type=\'hidden\']');
        const expectedDateValue = new Date(2016, 6, 15);
        const expectedStringValue = uiDateUtils.toStandardDateFormat(expectedDateValue, type);

        instance.option('value', expectedDateValue);
        assert.equal($hiddenInput.val(), expectedStringValue, 'input value is correct after widget value change');
    });

    QUnit.test('click on drop-down button should not call click on input to show native picker (T824701, T950897)', function(assert) {
        const clickStub = sinon.stub();
        const $element = $('#dateBox').dxDateBox({
            pickerType: 'native',
            showDropDownButton: true
        });

        $element
            .find(`.${TEXTEDITOR_INPUT_CLASS}`)
            .on('click', clickStub);

        $element
            .find(`.${DROP_DOWN_BUTTON_CLASS}`)
            .trigger('dxclick');

        assert.strictEqual(clickStub.callCount, 0, 'editor should not trigger click on the input');
    });
});

QUnit.module('focus policy', {}, () => {
    QUnit.test('dateBox should stay focused after value selecting in date strategy', function(assert) {
        assert.expect(1);

        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            opened: true,
            focusStateEnabled: true
        });
        const instance = $dateBox.dxDateBox('instance');
        const $popupContent = $(instance._popup.$content().parent());

        $($popupContent).on('mousedown', e => {
            assert.ok(e.isDefaultPrevented(), 'datebox does not lose focus on overlay content clicking');
        });

        // NOTE: why we use not dxpointerdown (T241214)
        $($popupContent).trigger('mousedown');
    });

    QUnit.test('dateBox should stay focused after value selecting in time strategy', function(assert) {
        assert.expect(1);

        const $dateBox = $('#dateBox').dxDateBox({
            type: 'time',
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox('instance');
        const $popupContent = $(instance._popup.$content().parent());

        $($popupContent).on('mousedown', e => {
            assert.ok(e.isDefaultPrevented(), 'datebox does not lose focus on popup content clicking');
        });

        // NOTE: why we use not dxpointerdown (T241214)
        $($popupContent).trigger('mousedown');
    });

    QUnit.test('dateBox should stay focused after value selecting in datetime strategy', function(assert) {
        assert.expect(1);

        const $dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox('instance');
        const $popupContent = $(instance._popup.$content().parent());

        $($popupContent).on('mousedown', e => {
            assert.ok(e.isDefaultPrevented(), 'datebox does not lose focus on popup content clicking');
        });

        // NOTE: why we use not dxpointerdown (T241214)
        $($popupContent).trigger('mousedown');
    });

    QUnit.test('calendar in datebox should not have tabIndex attribute', function(assert) {
        assert.expect(1);

        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox('instance');
        const $calendar = $(instance._popup.$content().find('.dx-calendar'));

        assert.equal($calendar.attr('tabindex'), null, 'calendar has not tabindex');
    });

    QUnit.testInActiveWindow('set focus on \'tab\' key from editor to overlay and inversely', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            opened: true,
            focusStateEnabled: true
        });

        const instance = $dateBox.dxDateBox('instance');

        let keyboard = keyboardMock($dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));

        keyboard.keyDown('tab');

        const $prevButton = instance._popup.$wrapper().find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`);

        assert.ok($prevButton.hasClass(STATE_FOCUSED_CLASS), 'tab set focus to first focusable element in overlay');

        $($prevButton).trigger($.Event('keydown', { key: 'Tab', shiftKey: true }));

        assert.ok($dateBox.hasClass(STATE_FOCUSED_CLASS), 'shift+tab move focus to input element');

        instance.option('calendarOptions', { focusStateEnabled: false });
        keyboard = keyboardMock($dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));
        keyboard.keyDown('tab');

        const $hourBox = $(instance._strategy._timeView._hourBox.$element());
        const $inputHourBox = instance._strategy._timeView._hourBox._input();

        assert.ok($hourBox.hasClass(STATE_FOCUSED_CLASS), 'tab set focus to first input in overlay');

        $($inputHourBox).trigger($.Event('keydown', { key: 'Tab', shiftKey: true }));

        assert.ok($dateBox.hasClass(STATE_FOCUSED_CLASS), 'dateBox on focus reset focus to element');
    });

    QUnit.testInActiveWindow('first input in poup should have selected text when move from dateBox input on tab (T1127632)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            opened: true,
            focusStateEnabled: true,
            calendarOptions: {
                focusStateEnabled: false,
            }
        });

        const instance = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        const keyboard = keyboardMock($input);

        keyboard.keyDown('tab');

        const $inputHourBox = instance._strategy._timeView._hourBox._input();
        const caretPosition = {
            start: $inputHourBox[0].selectionStart,
            end: $inputHourBox[0].selectionEnd
        };

        assert.strictEqual(caretPosition.start, 0, 'selectionStart is correct');
        assert.strictEqual(caretPosition.end, 2, 'selectionEnd is correct');
    });

    QUnit.test('mousewheel action should not work if dateBox is not focused', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({ type: 'datetime', useMaskBehavior: true });
        const dateBox = $dateBox.dxDateBox('instance');
        const initText = dateBox.option('text');
        const input = $(`.${TEXTEDITOR_INPUT_CLASS}`, $dateBox).get(0);
        const mouse = pointerMock(input).start();

        mouse.wheel(10);
        assert.strictEqual(dateBox.option('text'), initText);

        input.focus();

        mouse.wheel(10);
        assert.notStrictEqual(dateBox.option('text'), initText);
    });
});

QUnit.module('options changed callbacks', moduleConfig, () => {
    QUnit.test('value', function(assert) {
        let date = new Date(2012, 10, 26);
        const mode = this.instance.option('mode');

        this.instance.option('value', date);
        assert.equal(this.$input().val(), getExpectedResult(date, mode, '2012-11-26'));

        date = new Date(2012, 11, 26);

        this.instance.option('value', date);
        assert.equal(this.$input().val(), getExpectedResult(date, mode, '2012-12-26'));
    });

    QUnit.test('type', function(assert) {
        const date = new Date(2012, 10, 26, 16, 40, 23);

        this.instance.option({
            value: date,
            type: 'date'
        });
        assert.equal(this.$input().val(), getExpectedResult(date, this.instance.option('mode'), '2012-11-26'));

        this.instance.option('type', 'time');
        assert.equal(this.$input().val(), getExpectedResult(date, this.instance.option('mode'), '16:40'));
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        this.instance.option('onValueChanged', () => {
            assert.ok(true);
        });
        this.instance.option('value', new Date(2015, 6, 14));
    });

    QUnit.test('empty class toggle depending on value', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: null,
            pickerType: 'calendar',
            type: 'date'
        });
        const dateBox = $dateBox.dxDateBox('instance');

        assert.ok($dateBox.hasClass('dx-texteditor-empty'), 'empty class attached when value is empty');

        dateBox.option('value', new Date());

        assert.ok(!$dateBox.hasClass('dx-texteditor-empty'), 'empty class removed when value is not empty');
    });

    QUnit.test('T188238 - changing of type leads to strategy changing', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date(),
            type: 'date',
            pickerType: 'calendar'
        });

        const dateBox = $dateBox.dxDateBox('instance');

        dateBox.open();
        assert.ok($dateBox.hasClass('dx-datebox-date'), 'strategy is correct');
        assert.equal($('.dx-calendar').length, 1, 'there is calendar in popup when type is \'date\'');
        assert.equal($('.dx-timeview').length, 0, 'there is no timeview in popup when type is \'date\'');
        dateBox.close();

        dateBox.option('type', 'datetime');
        dateBox.open();
        assert.ok($dateBox.hasClass('dx-datebox-datetime'), 'strategy is changed');
        assert.equal($('.dx-calendar').length, 1, 'there is calendar in popup when type is \'datetime\'');
        assert.equal($('.dx-timeview').length, 1, 'there is timeview in popup when type is \'datetime\'');
    });

    QUnit.test('dxDateBox calendar popup should be closed after value is changed if applyValueMode=\'instantly\' (T189022)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            applyValueMode: 'instantly'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        dateBox.open();
        $(getInstanceWidget(dateBox).$element().find('.dx-calendar-cell:not(.dx-calendar-selected-date)').eq(0)).trigger('dxclick');

        assert.ok(!dateBox.option('opened'), 'dateBox popup is closed');
        assert.ok(!dateBox._popup.option('visible'), 'popup is not visible');
    });

    QUnit.test('dxDateBox\'s value change doesn\'t lead to strategy\'s widget value change until popup is opened', function(assert) {
        const firstValue = new Date(2015, 0, 20);
        const secondValue = new Date(2014, 4, 15);

        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            type: 'date',
            value: firstValue
        });

        const dateBox = $dateBox.dxDateBox('instance');

        dateBox.open();
        dateBox.close();

        const calendar = getInstanceWidget(dateBox);

        assert.deepEqual(firstValue, calendar.option('value'), 'values in datebox and calendar are the same');
        dateBox.option('value', secondValue);
        assert.deepEqual(firstValue, calendar.option('value'), 'value in calendar isn\'t changed');
        dateBox.open();
        this.clock.tick(10);
        assert.deepEqual(secondValue, calendar.option('value'), 'value in calendar is changed');
    });

    QUnit.test('dxDateBox\'s value change leads to strategy\'s widget value change if popup is opened', function(assert) {
        const firstValue = new Date(2015, 0, 20);
        const secondValue = new Date(2014, 4, 15);

        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            type: 'date',
            value: firstValue
        });

        const dateBox = $dateBox.dxDateBox('instance');

        dateBox.open();

        const calendar = getInstanceWidget(dateBox);

        assert.deepEqual(firstValue, calendar.option('value'), 'values in datebox and calendar are the same');

        dateBox.option('value', secondValue);
        dateBox.open();
        assert.deepEqual(secondValue, calendar.option('value'), 'value in calendar is changed');
    });

    QUnit.test('dxDateBox should hide or show its DDButton on showDropDownButton option change', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            showDropDownButton: true,
            value: new Date(),
            type: 'date',
            pickerType: 'calendar'
        });
        const dateBox = $dateBox.dxDateBox('instance');

        assert.ok($dateBox.hasClass(DROP_DOWN_BUTTON_VISIBLE_CLASS));

        dateBox.option('showDropDownButton', false);
        assert.notOk($dateBox.hasClass(DROP_DOWN_BUTTON_VISIBLE_CLASS));

        dateBox.option('showDropDownButton', true);
        assert.ok($dateBox.hasClass(DROP_DOWN_BUTTON_VISIBLE_CLASS));
    });

    QUnit.test('buttons are removed after applyValueMode option is changed', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            applyValueMode: 'useButtons',
            pickerType: 'calendar',
            value: new Date()
        }).dxDateBox('instance');

        dateBox.open();
        let $buttons = $('.dx-datebox-wrapper .dx-toolbar .dx-button');

        assert.equal($buttons.length, 3, 'two buttons are rendered');

        dateBox.close();
        dateBox.option('applyValueMode', 'instantly');
        dateBox.open();
        $buttons = $('.dx-datebox-wrapper .dx-toolbar .dx-button');

        assert.equal($buttons.length, 0, 'no buttons are rendered');
    });
});

QUnit.module('merging dates', moduleConfig, () => {
    QUnit.test('dates should be merged correctly', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            value: new Date(2014, 10, 1, 11, 22),
            type: 'date',
            pickerType: 'native'
        });

        const instance = $element.dxDateBox('instance');
        const $input = $element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const inputType = $input.prop('type');

        $input.val(prepareDateString(inputType, 2014, 10, 31));
        $input.triggerHandler('change');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 9, 31, 11, 22).valueOf(), 'date merged correctly');

        $input.val(prepareDateString(inputType, 2014, 11, '01'));
        $input.triggerHandler('change');
        assert.equal(instance.option('value').valueOf(), new Date(2014, 10, 1, 11, 22).valueOf(), 'date merged correctly');
    });

    QUnit.test('incorrect work of mergeDates function (B237850)', function(assert) {
        this.instance.option('type', 'date');
        this.instance.option('value', new Date(2000, 6, 31, 1, 1, 1));

        const $input = $(this.$input());
        const inputType = $input.prop('type');

        $input
            .val(prepareDateString(inputType, 2000, '09', '10'))
            .trigger('change');

        assert.deepEqual(this.instance.option('value'), new Date(2000, 8, 10, 1, 1, 1));
    });

    QUnit.test('incorrect work of mergeDates function if previous value not valid (Q568689)', function(assert) {
        this.instance.option('type', 'time');

        const $input = $(this.$input());
        const inputType = $input.prop('type');

        $input
            .val('')
            .trigger('change');

        assert.strictEqual(this.instance.option('value'), null);

        $input
            .val(inputType === 'text' ? '12:30 PM' : '12:30')
            .trigger('change');

        const date = new Date(null);
        date.setHours(12, 30, 0);
        assert.deepEqual(this.instance.option('value'), date);
    });

    QUnit.test('if value isn\'t specified then Unix Epoch is default for an editor with type \'time\'', function(assert) {
        this.instance.option({
            type: 'time',
            pickerType: 'list',
            displayFormat: 'longTime'
        });

        $(this.$input())
            .val('1:1:16 AM')
            .trigger('change');

        const value = this.instance.option('value');
        const defaultDate = new Date(null);

        assert.equal(value.getFullYear(), defaultDate.getFullYear(), 'correct year');
        assert.equal(value.getMonth(), defaultDate.getMonth(), 'correct month');
        assert.equal(value.getDate(), defaultDate.getDate(), 'correct date');
    });

    QUnit.test('mergeDates must merge seconds when type is \'time\'', function(assert) {
        this.instance.option({
            type: 'time',
            value: new Date(2000, 6, 31, 1, 1, 1),
            pickerType: 'list',
            displayFormat: 'longTime'
        });

        $(this.$input())
            .val('1:1:16 AM')
            .trigger('change');

        assert.strictEqual(this.instance.option('value').getSeconds(), 16);
    });

    QUnit.test('mergeDates must merge milliseconds when type is \'time\'', function(assert) {
        this.instance.option({
            type: 'time',
            value: new Date(2000, 6, 31, 1, 1, 1),
            pickerType: 'list',
            displayFormat: 'millisecond'
        });

        $(this.$input())
            .val('16')
            .trigger('change');

        assert.strictEqual(this.instance.option('value').getMilliseconds(), 16);
    });
});

QUnit.module('dateView integration', {
    beforeEach: function(...args) {
        fx.off = true;
        this.originalInputType = support.inputType;
        support.inputType = () => {
            return false;
        };
        moduleConfig.beforeEach.apply(this, args);
        this.instance.option('pickerType', 'rollers');

        this.popup = $.proxy(function() {
            return this._popup;
        }, this.instance);

        this.popupTitle = function() {
            return this.popup().topToolbar().find('.dx-toolbar-label').text();
        };

        this.instance.open();

        this.dateView = function() {
            return getInstanceWidget(this.instance);
        };
    },
    afterEach: function(...args) {
        moduleConfig.afterEach.apply(this, args);
        support.inputType = this.originalInputType;
        fx.off = false;
    }
}, () => {
    QUnit.test('check DateView default config', function(assert) {
        const { value, minDate, maxDate } = this.dateView().option();
        const FIFTY_YEARS = uiDateUtils.ONE_YEAR * 50;
        const defaultDate = new Date();

        defaultDate.setHours(0, 0, 0, 0);

        assert.deepEqual(value, defaultDate, 'default value is the current date');
        assert.deepEqual(minDate, new Date(1900, 0, 1), 'default min date is \'January 1 1900\'');

        this.clock.now += FIFTY_YEARS;
        assert.deepEqual(maxDate, new Date(), 'default max date is current date + 50 years');
    });

    QUnit.test('dateView renders', function(assert) {
        assert.equal(this.popup().$content().find('.dx-dateview').length, 1);
    });

    QUnit.test('readOnly input prop should be always true to prevent keyboard open if simulated dateView is using', function(assert) {
        this.instance.option('readOnly', false);
        assert.ok(this.$element.find('.' + TEXTEDITOR_INPUT_CLASS).prop('readOnly'), 'readonly prop specified correctly');
    });

    QUnit.test('dateView shows on field click', function(assert) {
        assert.ok(this.instance.option('openOnFieldClick'));
    });

    QUnit.test('dateView \'minDate\' and \'maxDate\' matches dateBox \'min\' and \'max\' respectively', function(assert) {
        this.instance.option('min', new Date(2000, 1, 1));
        assert.deepEqual(this.dateView().option('minDate'), new Date(2000, 1, 1));

        this.instance.option('max', new Date(2001, 2, 2));
        assert.deepEqual(this.dateView().option('maxDate'), new Date(2001, 2, 2));
    });

    QUnit.test('dateView \'value\' and \'type\' matches dateBox \'value\' and \'type\' respectively', function(assert) {
        this.instance.option('value', new Date(2000, 1, 1));
        this.instance.open();
        assert.deepEqual(this.dateView().option('value'), new Date(2000, 1, 1));
        this.instance.close();

        this.instance.option('value', new Date(2000, 2, 2));
        this.instance.open();
        assert.deepEqual(this.dateView().option('value'), new Date(2000, 2, 2));
    });

    QUnit.test('dateView \'type\' option matches dateBox \'type\' option', function(assert) {
        this.instance.option('type', 'datetime');
        this.instance.open();
        assert.equal(getInstanceWidget(this.instance).option('type'), 'datetime');

        this.instance.option('type', 'time');
        this.instance.open();
        assert.equal(getInstanceWidget(this.instance).option('type'), 'time');
    });

    QUnit.test('dateView should be updated on popup opening and closing (T578764)', function(assert) {
        this.instance.close();
        this.instance.option('value', new Date(2000, 2, 2));

        this.instance.open();
        assert.deepEqual(this.dateView().option('value'), new Date(2000, 2, 2), 'update on opening when value changed via api');

        this.dateView().option('value', new Date(2001, 1, 3));
        this.instance.close();
        assert.deepEqual(this.dateView().option('value'), new Date(2000, 2, 2), 'update on closing when value was not applied');
    });

    QUnit.test('dateView should not update dateBox value after closing using \'close\' method', function(assert) {
        this.instance.option('value', new Date(2000, 1, 1));
        this.instance.open();

        this.dateView().option('value', new Date(2000, 2, 2));
        assert.deepEqual(this.instance.option('value'), new Date(2000, 1, 1));

        this.instance.close();
        assert.deepEqual(this.instance.option('value'), new Date(2000, 1, 1));
    });

    QUnit.test('dateBox should use actual rollers value as a new date if click to the DateBox Apply button without any rollers navigation (T860282)', function(assert) {
        this.instance.option({
            'max': new Date(2000, 1, 1),
            'opened': false
        });
        this.instance.open();
        $(this.popup().$overlayContent()).find(APPLY_BUTTON_SELECTOR).trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), new Date(2000, 1, 1));
    });

    QUnit.test('render simulated dateView title when using option \'placeholder\'', function(assert) {
        this.instance.option({
            placeholder: 'test'
        });

        this.dateView().option({
            cancelButton: false
        });

        this.instance.open();
        assert.equal(this.popupTitle(), 'test', 'title in simulated dateView rendered correctly, when using option \'placeholder\' in dateBox');

        this.instance.option('placeholder', 'new title');
        assert.equal(this.popupTitle(), 'new title', 'option changed successfully');
    });

    QUnit.test('specify dataPicker title, dependent from \'type\' option, when \'placeholder\' option is not defined', function(assert) {
        this.instance.option({
            type: 'date',
            placeholder: ''
        });

        this.dateView().option({
            cancelButton: false
        });

        this.instance.open();

        assert.equal(this.popupTitle(), messageLocalization.format('dxDateBox-simulatedDataPickerTitleDate'), 'title set correctly when \'placeholder\' option is not defined');

        this.instance.option('type', 'time');
        this.instance.open();
        assert.equal(this.popupTitle(), messageLocalization.format('dxDateBox-simulatedDataPickerTitleTime'), 'title changed successfully when type set in \'time\'');

        this.instance.option('type', 'datetime');
        this.instance.open();
        assert.equal(this.popupTitle(), messageLocalization.format('dxDateBox-simulatedDataPickerTitleDate'), 'title changed successfully when type set in \'datetime\'');

        this.instance.option('type', 'date');
        this.instance.open();
        assert.equal(this.popupTitle(), messageLocalization.format('dxDateBox-simulatedDataPickerTitleDate'), 'title changed successfully when type set in \'date\'');
    });

    QUnit.test('cancel & done button action', function(assert) {
        const date = new Date(2012, 9, 10);
        const minDate = new Date(2000, 1);

        this.instance.option({ min: minDate, value: date });

        let rollers = this.dateView()._rollers;
        rollers.day.option('selectedIndex', 12);
        rollers.month.option('selectedIndex', 10);
        rollers.year.option('selectedIndex', 2);

        $(this.popup().$overlayContent()).find(APPLY_BUTTON_SELECTOR).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), new Date(2002, 10, 13));

        this.instance.open();

        rollers = this.dateView()._rollers;
        rollers.day.option('selectedIndex', 10);
        rollers.month.option('selectedIndex', 8);
        rollers.year.option('selectedIndex', 0);

        $(this.popup().$overlayContent()).find('.dx-popup-cancel.dx-button').trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), new Date(2002, 10, 13));
    });

    QUnit.test('specify dataPicker title, independent from \'type\' option, when \'placeholder\' option is defined', function(assert) {
        this.instance.option({
            type: 'date',
            placeholder: 'custom title'
        });

        this.instance.open();

        this.instance.option('type', 'time');
        this.instance.open();
        assert.equal(this.popupTitle(), 'custom title', 'custom title set successfully when type has been changed');

        this.instance.option('placeholder', '');
        this.instance.open();
        assert.equal(this.popupTitle(), messageLocalization.format('dxDateBox-simulatedDataPickerTitleTime'), 'title set successfully when \'placeholder\' option set to \'\'');
    });

    QUnit.test('Native datebox should have specific class', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            pickerType: 'native'
        });

        assert.ok($element.hasClass('dx-datebox-native'), 'class is correct');
        assert.equal($element.dxDateBox('instance')._strategy.NAME, 'Native', 'correct strategy is chosen');
    });

    QUnit.test('B230631 - Can not clear datebox field', function(assert) {
        this.instance.option({
            value: new Date(),
            type: 'datetime'
        });

        this.instance.open();

        const kb = keyboardMock(this.$input());

        clearInput(this.$input(), kb);

        kb.change();

        assert.equal(this.$input().val(), '');
        assert.equal(this.instance.option('value'), undefined);
    });

    QUnit.test('B236537 - onValueChanged event does not fire', function(assert) {
        let valueUpdated = false;

        this.instance.option({
            onValueChanged() {
                valueUpdated = true;
            }
        });

        assert.ok(!valueUpdated);

        this.instance.option('value', new Date(2012, 10, 26, 16, 40, 23));

        assert.ok(valueUpdated);
    });

    QUnit.test('B251997 - date picker is shown in spite of \'readOnly\' is true', function(assert) {
        const originalSupportInputType = support.inputType;

        support.inputType = () => {
            return false;
        };

        try {
            this.instance.close();

            this.instance.option({
                readOnly: true,
                pickerType: 'rollers'
            });

            const $wrapper = this.$element.find('.dx-dropdowneditor-input-wrapper');
            $wrapper.trigger('dxclick');
            assert.notOk(this.popup().option('visible'), 'popup is hidden');

            this.instance.option({ readOnly: false });
            $wrapper.trigger('dxclick');

            assert.ok(this.popup().option('visible'), 'popup is shown');
            assert.ok(this.popup().$content().find('.dx-dateview').is(':visible'), 'picker is shown');
        } finally {
            support.inputType = originalSupportInputType;
        }
    });

    QUnit.test('Q559762 - input does not clear input value Samsung Android 4.1 devices', function(assert) {
        assert.equal(this.$input().attr('autocomplete'), 'off');
    });

    QUnit.test('T170478 - no picker rollers should be chosen after click on \'cancel\' button', function(assert) {
        const pointer = pointerMock($('.dx-dateviewroller').eq(0).find('.dx-scrollable-container'));

        assert.equal($('.dx-dateviewroller-current').length, 0, 'no rollers are chosen after widget is opened first time');

        pointer.start().down().move(0, -20).up();
        assert.equal($('.dx-dateviewroller-current').length, 1, 'one roller is chosen after scrolling');
        $('.dx-popup-cancel').trigger('dxclick');

        this.instance.open();
        assert.equal($('.dx-dateviewroller-current').length, 0, 'no rollers are chosen after widget is opened second time');
    });

    QUnit.test('T207178 - error should not be thrown if value is null', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: null,
            pickerType: 'rollers'
        });

        const dateBox = $dateBox.dxDateBox('instance');

        try {
            dateBox.open();
            assert.ok(true, 'error is not thrown');
        } catch(e) {
            assert.ok(false, 'error is thrown');
        }
    });

    QUnit.test('T319042 - input value should be correct if picker type is \'rollers\' and \'type\' is \'time\'', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date(0, 0, 0, 15, 32),
            pickerType: 'rollers',
            type: 'time'
        });

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        assert.equal($input.val(), '3:32 PM', 'input value is correct');
    });

    QUnit.test('the next value after null should have zero time components when type = \'date\' (T407518)', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            value: null,
            pickerType: 'rollers',
            type: 'date',
            opened: true
        }).dxDateBox('instance');

        $('.' + DATEBOX_WRAPPER_CLASS).find(APPLY_BUTTON_SELECTOR).trigger('dxclick');

        const value = instance.option('value');
        assert.equal(value.getHours(), 0, 'hours component is 0');
        assert.equal(value.getMinutes(), 0, 'minutes component is 0');
        assert.equal(value.getSeconds(), 0, 'seconds component is 0');
        assert.equal(value.getMilliseconds(), 0, 'milliseconds component is 0');
    });

    QUnit.test('Gesture cover should be hidden after wheel event processed by Overlay emitter (T820405)', function(assert) {
        const pointer = pointerMock($('.dx-dateviewroller').eq(0).find('.dx-scrollable-container'));

        assert.equal($('.dx-dateviewroller-current').length, 0, 'no rollers are chosen after widget is opened first time');

        pointer
            .start()
            .move(1)
            .wheel(-20);

        const $gestureCover = $(`.${GESTURE_COVER_CLASS}`);
        const initialPointerEvents = $gestureCover.css('pointerEvents');

        assert.strictEqual($gestureCover.length, 1, 'gesture cover element created');
        assert.strictEqual(initialPointerEvents, 'none', 'correct default state');

        pointer
            .down()
            .move(1)
            .wheel(-20);

        assert.strictEqual($gestureCover.css('pointerEvents'), initialPointerEvents, 'correct default state');
    });
});

QUnit.module('widget sizing render', {}, () => {
    QUnit.test('default', function(assert) {
        const $element = $('#dateBox').dxDateBox();

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('widget shouldn\'t be wider than a container', function(assert) {
        const $element = $('#innerDateBox').dxDateBox();
        const instance = $element.dxDateBox('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.ok($element.outerWidth() <= 100, 'outer width of the element must be less or equal to a container width');
    });

    QUnit.test('validation icon should hide if container size is too small', function(assert) {
        const $element = $('#innerDateBox').dxDateBox({
            'showClearButton': true,
            'pickerType': 'calendar',
        });
        const instance = $element.dxDateBox('instance');

        assert.notOk($element.hasClass(SHOW_INVALID_BADGE_CLASS), 'validation icon\'s hidden');
        $('#containerWithWidth').get(0).style.width = '200px';
        const kb = keyboardMock(instance._input());
        kb.type('a');
        kb.keyDown('enter');

        assert.ok($element.hasClass(SHOW_INVALID_BADGE_CLASS), 'validation icon\'s visible');
    });

    QUnit.test('component should have correct width when it was rendered in a scaled container (T584097)', function(assert) {
        const $parent = $('#parent-div');
        $parent.css('width', 200);

        const $element = $('#dateBox').appendTo($parent);

        const component = $('#dateBox').dxDateBox({
            width: undefined
        }).dxDateBox('instance');

        const { width: initialWidth } = $element.get(0).getBoundingClientRect();

        $parent.css('transform', 'scale(0.5)');
        component.repaint();
        $parent.css('transform', 'scale(1)');
        const { width: actualWidth } = component.$element().get(0).getBoundingClientRect();

        assert.strictEqual(actualWidth, initialWidth, 'component has correct width');
    });

    QUnit.test('component width calculation should consider buttons containers element', function(assert) {
        const $parent = $('#parent-div');
        $parent.css('display', 'inline-block');

        const $element = $('#dateBox').appendTo($parent);
        const component = $('#dateBox').dxDateBox({
            width: undefined,
            pickerType: 'calendar',
            showDropDownButton: false
        }).dxDateBox('instance');
        const { width: initialWidth } = $element.get(0).getBoundingClientRect();
        const instance = $element.dxDateBox('instance');

        instance.option('showDropDownButton', true);
        const { width: actualWidth } = component.$element().get(0).getBoundingClientRect();
        const { width: buttonWidth } = $(`.${BUTTONS_CONTAINER_CLASS}`).get(0).getBoundingClientRect();

        assert.strictEqual(actualWidth >= initialWidth + buttonWidth, true);
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            pickerType: 'rollers'
        });

        const instance = $element.dxDateBox('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;

        this.$dateBox = $('#dateBox');

        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: 'calendar',
                type: 'time',
                focusStateEnabled: true,
                min: new Date(2008, 7, 8, 4, 30),
                value: new Date(2008, 7, 8, 5, 0),
                max: new Date(2008, 7, 8, 6, 0)
            })
            .dxDateBox('instance');

        this.$input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.testInActiveWindow('popup hides on tab', function(assert) {
        this.$input.focusin();

        assert.ok(this.$dateBox.hasClass(STATE_FOCUSED_CLASS), 'element is focused');
        this.dateBox.option('opened', true);
        this.keyboard.keyDown('tab');
        assert.ok(this.$dateBox.hasClass(STATE_FOCUSED_CLASS), 'element is focused');

        assert.equal(this.dateBox.option('opened'), false, 'popup is hidden');
    });

    QUnit.testInActiveWindow('home/end should not be handled', function(assert) {
        this.$input.focusin();
        this.dateBox.option('opened', true);
        const $timeList = $(`.${LIST_CLASS}`);

        this.keyboard.keyDown('down');
        this.keyboard.keyDown('end');
        assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), 'element is not focused');
        this.keyboard.keyDown('home');
        assert.ok(!$timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), 'element is not focused');
    });

    QUnit.testInActiveWindow('arrow keys control', function(assert) {
        this.$input.focusin();
        this.dateBox.option('opened', true);
        this.keyboard.keyDown('down');

        const $timeList = $(`.${LIST_CLASS}`);

        assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(2).hasClass(STATE_FOCUSED_CLASS), 'correct item is focused');

        this.keyboard.keyDown('down');
        assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(3).hasClass(STATE_FOCUSED_CLASS), 'correct item is focused');

        this.keyboard.keyDown('down');
        assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(0).hasClass(STATE_FOCUSED_CLASS), 'correct item is focused');

        this.keyboard.keyDown('up');
        assert.ok($timeList.find(LIST_ITEM_SELECTOR).eq(3).hasClass(STATE_FOCUSED_CLASS), 'correct item is focused');

        this.keyboard.keyDown('enter');
        assert.strictEqual(this.dateBox.option('opened'), false, 'popup is hidden');

        const selectedDate = this.dateBox.option('value');
        assert.strictEqual(selectedDate.getHours(), 6, 'hours is right');
        assert.strictEqual(selectedDate.getMinutes(), 0, 'minutes is right');
    });

    QUnit.test('apply contoured date on enter for date and datetime mode', function(assert) {
        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: 'calendar',
                type: 'date',
                applyValueMode: 'useButtons',
                focusStateEnabled: true,
                min: new Date(2008, 6, 8, 4, 30),
                value: new Date(2008, 7, 8, 5, 0),
                max: new Date(2008, 9, 8, 6, 0),
                opened: true
            })
            .dxDateBox('instance');

        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $($input).trigger($.Event('keydown', { key: 'ArrowUp' }));
        $($input).trigger($.Event('keydown', { key: 'ArrowDown' }));
        $($input).trigger($.Event('keydown', { key: 'ArrowUp' }));
        $($input).trigger($.Event('keydown', { key: 'Enter' }));

        assert.equal(this.dateBox.option('opened'), false, 'popup is hidden');

        const selectedDate = this.dateBox.option('value');
        assert.equal(selectedDate.getDate(), 1, 'day is right');
    });

    QUnit.test('Enter key press prevents default when popup in opened', function(assert) {
        assert.expect(1);

        let prevented = 0;

        const $dateBox = $('<div>').appendTo('body').dxDateBox({
            pickerType: 'calendar',
            focusStateEnabled: true,
            value: new Date(2015, 5, 13),
            opened: true
        });

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        try {
            $($dateBox).on('keydown', e => {
                if(e.isDefaultPrevented()) {
                    prevented++;
                }
            });

            keyboard.keyDown('enter');
            assert.equal(prevented, 1, 'defaults prevented on enter key press');

        } finally {
            $dateBox.remove();
        }
    });

    QUnit.testInActiveWindow('the \'shift+tab\' key press leads to the cancel button focus if the input is focused', function(assert) {
        this.dateBox.option({
            pickerType: 'calendar',
            type: 'datetime',
            opened: true,
            applyValueMode: 'useButtons'
        });

        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input
            .focus()
            .trigger($.Event('keydown', {
                key: 'Tab',
                shiftKey: true
            }));

        const $cancelButton = this.dateBox._popup.$wrapper().find('.dx-button.dx-popup-cancel');
        assert.ok($cancelButton.hasClass('dx-state-focused'), 'cancel button is focused');
    });

    QUnit.test('pressing tab should set focus on calendar prev button in popup', function(assert) {
        this.dateBox.option({
            pickerType: 'calendar',
            type: 'date',
            applyValueMode: 'useButtons',
            opened: true,
            min: null,
            max: null,
        });

        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input
            .focus()
            .trigger($.Event('keydown', {
                key: 'Tab',
            }));

        const $prevButton = this.dateBox._popup.$wrapper().find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`);

        assert.ok($prevButton.hasClass(STATE_FOCUSED_CLASS));
    });

    QUnit.test('pressing tab should set focus on first item in popup with custom items', function(assert) {
        this.dateBox.option({
            pickerType: 'calendar',
            type: 'date',
            applyValueMode: 'useButtons',
            opened: true,
            dropDownOptions: {
                toolbarItems: [{
                    widget: 'dxButton',
                    toolbar: 'top',
                    location: 'before',
                    options: {
                        text: 'Button',
                    },
                },
                {
                    widget: 'dxTextBox',
                    toolbar: 'bottom',
                    location: 'before',
                    options: {
                        text: 'Text box',
                    },
                }],
            },
        });
        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input
            .focus()
            .trigger($.Event('keydown', {
                key: 'Tab',
            }));

        const $firstItem = this.dateBox._popup.$wrapper().find(BUTTON_SELECTOR);
        assert.ok($firstItem.hasClass(STATE_FOCUSED_CLASS));
    });

    QUnit.test('pressing tab + shift should set focus on last item in popup with custom items', function(assert) {
        this.dateBox.option({
            pickerType: 'calendar',
            type: 'date',
            applyValueMode: 'useButtons',
            opened: true,
            dropDownOptions: {
                toolbarItems: [{
                    widget: 'dxButton',
                    toolbar: 'top',
                    location: 'before',
                    options: {
                        text: 'Button',
                    },
                },
                {
                    widget: 'dxTextBox',
                    toolbar: 'bottom',
                    location: 'before',
                    options: {
                        text: 'Text box',
                    },
                }],
            },
        });
        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input
            .focus()
            .trigger($.Event('keydown', {
                key: 'Tab',
                shiftKey: true
            }));

        const $lastItem = this.dateBox._popup.$wrapper().find(TEXTBOX_SELECTOR);
        assert.ok($lastItem.hasClass(STATE_FOCUSED_CLASS));
    });

    QUnit.test('Home and end key press prevent default when popup in opened (T587313)', function(assert) {
        assert.expect(1);

        let prevented = 0;

        this.dateBox.option('opened', true);

        this.$dateBox.on('keydown', (e) => {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard.keyDown('home');
        this.keyboard.keyDown('end');

        assert.equal(prevented, 0, 'defaults prevented on home and end keys');
    });

    QUnit.test('Home and end key press does not prevent default when popup in not opened (T587313)', function(assert) {
        assert.expect(1);

        let prevented = 0;

        this.dateBox.option('opened', false);

        this.$dateBox.on('keydown', (e) => {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard.keyDown('home');
        this.keyboard.keyDown('end');

        assert.equal(prevented, 0, 'defaults has not prevented on home and end keys');
    });

    QUnit.testInActiveWindow('Unsupported key handlers must be processed correctly', function(assert) {
        this.dateBox.option({
            pickerType: 'list',
            type: 'time'
        });

        const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        this.dateBox.focus();

        let isNoError = true;

        try {
            keyboard
                .press('down')
                .press('up')
                .press('right')
                .press('left');
        } catch(e) {
            isNoError = false;
        }

        assert.ok(isNoError, 'key handlers processed without errors');
    });

    QUnit.test('Pressing escape when focus \'today\' button must hide the popup', function(assert) {
        const escapeKeyDown = $.Event('keydown', { key: 'Escape' });
        this.dateBox.option({
            type: 'date',
            pickerType: 'calendar',
            applyValueMode: 'useButtons'
        });
        this.dateBox.open();

        $(this.dateBox.content())
            .parent()
            .find('.dx-button-today')
            .trigger(escapeKeyDown);

        assert.ok(!this.dateBox.option('opened'));
    });

    [
        { editorName: 'hour', editorIndex: 0 },
        { editorName: 'minute', editorIndex: 1 },
        { editorName: 'period', editorIndex: 2 }
    ].forEach(({ editorName, editorIndex }) => {
        QUnit.test(`Pressing escape when focus the ${editorName} editor must hide the popup`, function(assert) {
            const escapeKeyDown = $.Event('keydown', { key: 'Escape' });
            this.dateBox.option({
                pickerType: 'calendar',
                type: 'datetime'
            });
            this.dateBox.open();

            $(this.dateBox.content())
                .find(`.${TEXTEDITOR_INPUT_CLASS}`)
                .eq(editorIndex)
                .trigger(escapeKeyDown);

            assert.ok(!this.dateBox.option('opened'));
        });
    });

    QUnit.test('DateBox value is applied after the second press of the "Enter" key', function(assert) {
        this.dateBox.option({
            pickerType: 'calendar',
            type: 'datetime',
            applyValueMode: 'useButtons',
            focusStateEnabled: true,
            value: null,
            opened: true
        });

        const instance = this.dateBox;
        const $content = $(instance.content());
        const $input = $(instance.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);
        function getValue() {
            return instance.option('value');
        }
        function calendarHasSelectedDate() {
            return $content.find('.dx-calendar-selected-date').length > 0;
        }

        assert.notOk(getValue());
        assert.notOk(calendarHasSelectedDate());

        keyboard.press('enter');

        assert.notOk(getValue(), 'value does not applied to the DateBox after the first press of the "Enter" key');
        assert.ok(calendarHasSelectedDate(), 'but Calendar got selected date');

        keyboard.press('enter');
        assert.ok(getValue(), 'DateBox got selected value after the second press of the "Enter" key');
    });
});

QUnit.module('Popup open state', () => {
    ['date', 'time'].forEach(type => {
        ['calendar', 'list'].forEach(pickerType => {
            QUnit.testInActiveWindow(`Popup should be closed on tab key when there is no focusable elements, applyValueMode: "instantly", type: "${type}", pickerType: "${pickerType}"`, function(assert) {
                const $dateBox = $('#dateBox').dxDateBox({
                    focusStateEnabled: true,
                    applyValueMode: 'instantly',
                    type,
                    pickerType,
                    calendarOptions: {
                        focusStateEnabled: false,
                    }
                });
                const dateBox = $dateBox.dxDateBox('instance');
                const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
                const keyboard = keyboardMock($input);

                dateBox.open();
                keyboard.keyDown('tab');

                assert.strictEqual(dateBox.option('opened'), false, 'popup is closed');
            });
        });
    });

    ['date', 'time', 'datetime'].forEach(type => {
        ['calendar', 'list', 'rollers'].forEach(pickerType => {
            QUnit.testInActiveWindow(`Popup should be opened on tab key when there are focusable items, applyValueMode: "useButtons", type: "${type}", pickerType: "${pickerType}"`, function(assert) {
                const $dateBox = $('#dateBox').dxDateBox({
                    focusStateEnabled: true,
                    applyValueMode: 'useButtons',
                    type,
                    pickerType,
                });
                const dateBox = $dateBox.dxDateBox('instance');
                const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
                const keyboard = keyboardMock($input);

                dateBox.open();
                keyboard.keyDown('tab');

                assert.strictEqual(dateBox.option('opened'), true, 'popup is still opened');
            });
        });
    });
});

QUnit.module('aria accessibility', {}, () => {
    QUnit.test('aria-activedescendant on combobox should point to the active list item (date view)', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            value: new Date(2008, 7, 8, 5, 0),
            opened: true,
            pickerType: 'calendar'
        });

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.keyDown('right');

        const $contouredCell = $('.dx-calendar-contoured-date');

        assert.notEqual($input.attr('aria-activedescendant'), undefined, 'aria-activedescendant exists');
        assert.equal($input.attr('aria-activedescendant'), $contouredCell.attr('id'), 'aria-activedescendant equals contoured cell\'s id');
    });

    QUnit.test('aria-activedescendant on combobox should point to the active list item (time view)', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            type: 'time',
            pickerType: 'list',
            value: new Date(2008, 7, 8, 5, 0),
            opened: true
        });

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.keyDown('down');

        const $activeItem = $('.dx-state-focused');

        assert.notEqual($input.attr('aria-activedescendant'), undefined, 'aria-activedescendant exists');
        assert.equal($input.attr('aria-activedescendant'), $activeItem.attr('id'), 'aria-activedescendant equals contoured cell\'s id');
    });
});

QUnit.module('pickerType', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('T319039 - classes on DateBox should be correct after the \'pickerType\' option changed', function(assert) {
        const pickerTypes = ['rollers', 'calendar', 'native', 'list'];
        const $dateBox = $('#dateBox').dxDateBox();
        const dateBox = $dateBox.dxDateBox('instance');

        const areClassesCorrect = currentPickerType => {
            for(let i = 0, n = pickerTypes.length; i < n; i++) {
                const pickerType = pickerTypes[i];
                const className = DATEBOX_CLASS + '-' + pickerType;

                if(currentPickerType === pickerType ^ $dateBox.hasClass(className)) {
                    return false;
                }
            }

            return true;
        };

        for(let i = 0, n = pickerTypes.length; i < n; i++) {
            const pickerType = pickerTypes[i];
            const type = pickerType === 'list' ? 'time' : 'date';

            dateBox.option({
                type,
                pickerType,
            });

            assert.ok(areClassesCorrect(pickerType), 'classes for ' + pickerType + ' are correct');
        }
    });

    [
        { pickerType: 'calendar', type: 'datetime' },
        { pickerType: 'rollers', type: 'datetime' },
        { pickerType: 'list', type: 'time' }
    ].forEach(({ type, pickerType }) => {
        QUnit.test(`Overlay wrapper should have 'dx-dropdowneditor-overlay' class in DateBox with ${pickerType} pickerType`, function(assert) {
            $('#dateBox').dxDateBox({ type, pickerType, opened: true });
            assert.ok($(`.${DATEBOX_WRAPPER_CLASS}`).hasClass(DROPDOWNEDITOR_OVERLAY_CLASS));
        });
    });

    QUnit.test('Calendar pickerType and time type should use time list (T248089)', function(assert) {
        const currentDevice = devices.real();
        devices.real({ platform: 'android' });

        try {
            const $element = $('#dateBox').dxDateBox({
                type: 'time',
                pickerType: 'calendar'
            });

            const instance = $element.dxDateBox('instance');

            assert.equal(instance._strategy.NAME, 'List', 'strategy is correct');
        } finally {
            devices.real(currentDevice);
        }
    });
});

QUnit.module('datebox validation', {}, () => {
    QUnit.test('validation should be correct when max value is chosen (T266206)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            min: new Date(2015, 6, 10),
            max: new Date(2015, 6, 14),
            value: new Date(2015, 6, 14, 15, 30)
        });

        const dateBox = $dateBox.dxDateBox('instance');

        assert.ok(dateBox.option('isValid'), 'datebox is valid');
    });

    QUnit.test('datebox should create validation error if user set isValid = false', function(assert) {
        const dateBox = $('#widthRootStyle').dxDateBox({
            type: 'datetime',
            isValid: false,
            value: null
        }).dxDateBox('instance');

        assert.notOk(dateBox.option('isValid'), 'isValid = false does not change on widget init by value validation');

        dateBox.option('value', new Date(2018, 1, 1));
        assert.ok(dateBox.option('isValid'), 'valid after valid value is setted');

        dateBox.option('isValid', false);
        assert.notOk(dateBox.option('isValid'), 'set isValid = false by API');
    });

    QUnit.test('datebox should be invalid after out of range value was setted', function(assert) {
        const dateBox = $('#widthRootStyle').dxDateBox({
            type: 'datetime',
            min: new Date(2019, 1, 1),
            value: null
        }).dxDateBox('instance');

        assert.ok(dateBox.option('isValid'), 'widget is valid');

        dateBox.option('value', new Date(2018, 0, 1));
        assert.notOk(dateBox.option('isValid'), 'widget is invalid');

        dateBox.option('value', new Date(2019, 1, 2));
        assert.ok(dateBox.option('isValid'), 'widget is valid');
    });

    QUnit.test('datebox should change validation state if value was changed by keyboard', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            value: null,
            pickerType: 'calendar'
        }).dxValidator({
            validationRules: [{
                type: 'required'
            }]
        });
        const dateBox = $dateBox.dxDateBox('instance');
        const keyboard = keyboardMock($dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));

        keyboard
            .type('10/10/2014')
            .change();

        assert.ok(dateBox.option('isValid'), 'widget is valid');
    });

    QUnit.test('required validator should not block valuechange in datetime strategy', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const $dateBox = $('#dateBox').dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                opened: true,
                value: null
            }).dxValidator({
                validationRules: [{
                    type: 'required'
                }]
            });
            clock.tick(10);
            const dateBox = $dateBox.dxDateBox('instance');
            const $done = $(dateBox.content()).parent().find(APPLY_BUTTON_SELECTOR);

            $done.trigger('dxclick');

            assert.ok(dateBox.option('isValid'), 'widget is valid');
            assert.ok(dateBox.option('value'), 'value is not empty');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('widget is still valid after drop down is opened', function(assert) {
        const startDate = new Date(2015, 1, 1, 8, 12);

        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            value: startDate,
            pickerType: 'calendar',
            applyValueMode: 'instantly'
        }).dxValidator({
            validationRules: [
                { type: 'required' },
                { type: 'range', min: new Date(2016, 0, 1) }
            ]
        });

        const dateBox = $dateBox.dxDateBox('instance');

        assert.equal(dateBox.option('value'), startDate, 'start value is correct');
        assert.ok(dateBox.option('isValid'), 'value is valid');

        dateBox.option('opened', true);

        assert.ok(dateBox.option('isValid'), 'value is still valid after drop down is opened');
        assert.equal(dateBox.option('value'), startDate, 'start value is correct');

        dateBox.option('value', new Date(2017, 1, 1));
        assert.ok(dateBox.option('isValid'), 'value is valid too');
    });

    QUnit.test('datebox with \'date\' type should ignore time in min/max options', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date(2015, 0, 31, 10),
            focusStateEnabled: true,
            min: new Date(2015, 0, 31, 12)
        });

        assert.ok(!$dateBox.hasClass('dx-invalid'), 'datebox should stay valid');
    });

    QUnit.test('time works correct when value is invalid', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'time',
            pickerType: 'list',
            valueChangeEvent: 'change'
        });

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        const $button = $dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`);

        $input.val('');
        $($input).trigger('change');
        $($button).trigger('dxclick');

        const popup = $dateBox.find('.dx-popup').dxPopup('instance');

        assert.ok(popup.option('visible'), 'popup is opened');
    });

    QUnit.test('invalidDateMessage', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            invalidDateMessage: 'A lorem ipsum...'
        });

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        $input.val('ips');
        $($input).trigger('change');

        const validationError = $dateBox.dxDateBox('instance').option('validationError').message;
        assert.equal(validationError, 'A lorem ipsum...', 'validation message is correct');
    });

    QUnit.test('change invalidDateMessage at runtime', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            invalidDateMessage: 'test message'
        });
        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input.val('ips');
        $($input).trigger('change');

        dateBox.option('invalidDateMessage', 'another test message');
        $($input).trigger('change');

        const validationError = $dateBox.dxDateBox('instance').option('validationError').message;
        assert.equal(validationError, 'another test message', 'validation message is correct');
    });

    QUnit.test('dateOutOfRangeMessage', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            dateOutOfRangeMessage: 'A lorem ipsum...',
            min: new Date(2015, 5, 5),
            max: new Date(2016, 5, 5),
            value: new Date(2017, 5, 5)
        });

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        $($input).trigger('change');

        const validationError = $dateBox.dxDateBox('instance').option('validationError').message;
        assert.equal(validationError, 'A lorem ipsum...', 'validation message is correct');
    });

    QUnit.test('change dateOutOfRangeMessage at runtime', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            dateOutOfRangeMessage: 'test message',
            min: new Date(2015, 5, 5),
            max: new Date(2016, 5, 5),
            value: new Date(2017, 5, 5)
        });
        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $($input).trigger('change');
        dateBox.option('dateOutOfRangeMessage', 'another test message');
        $($input).trigger('change');

        const validationError = dateBox.option('validationError.message');
        assert.equal(validationError, 'another test message', 'validation message is correct');
    });

    QUnit.test('year is too big', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            displayFormat: 'd/M/y',
            valueChangeEvent: 'change',
            mode: 'text'
        });

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        $input.val('01/01/999999999');
        $($input).trigger('change');

        assert.equal($dateBox.dxDateBox('option', 'isValid'), false, 'datebox has invalid state');
        assert.equal($input.val(), '01/01/999999999', 'value is not changed');
    });

    QUnit.test('datebox should not ignore the time component in validation when it is changed by timeview (T394206)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            pickerType: 'calendar',
            value: new Date(2016, 6, 8, 8, 34),
            max: new Date(2016, 6, 8, 9, 15),
            opened: true
        });

        const $dateBoxWrapper = $('.' + DATEBOX_WRAPPER_CLASS);
        const $hoursInput = $dateBoxWrapper.find('.dx-numberbox').eq(0).find('.' + TEXTEDITOR_INPUT_CLASS);

        $hoursInput
            .val(9)
            .trigger('change');

        $dateBoxWrapper.find('.dx-button.dx-popup-done')
            .trigger('dxclick');

        assert.ok($dateBox.hasClass('dx-invalid'), 'datebox should be marked as invalid');
    });

    QUnit.test('datebox should be valid if value was changed in the onValueChanged handle(T413553)', function(assert) {
        const date = new Date();

        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date(2016, 1, 1),
            onValueChanged(e) {
                if(!e.value) {
                    e.component.option('value', date);
                }
            },
        });

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input.val('');
        $($input).trigger('change');

        assert.equal(date, $dateBox.dxDateBox('instance').option('value'), 'value set correctly');
        assert.ok(!$dateBox.hasClass('dx-invalid'), 'datebox should be marked as valid');
    });

    QUnit.test('custom validation should be more important than internal', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date(2016, 1, 1)
        }).dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback(options) {
                    return false;
                }
            }]
        });

        const dateBox = $dateBox.dxDateBox('instance');

        dateBox.option('value', new Date());

        assert.notOk(dateBox.option('isValid'), 'dateBox is invalid');
        assert.ok($dateBox.hasClass('dx-invalid'), 'datebox should be marked as invalid');
    });

    QUnit.test('Internal validation should be valid when null value was set to null', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date(2016, 1, 1)
        });

        const dateBox = $dateBox.dxDateBox('instance');

        dateBox.option('value', null);

        assert.ok(!$dateBox.hasClass('dx-invalid'), 'datebox should not be marked as invalid');
    });

    QUnit.test('Internal validation shouldn\'t be reset value if localization return null for invalid value', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            value: new Date(2016, 1, 1)
        });
        const dateBox = $dateBox.dxDateBox('instance');

        const $input = $dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard
            .type('abc')
            .change();

        assert.equal($dateBox.hasClass('dx-invalid'), 1, 'datebox should be marked as invalid');
        assert.equal(dateBox.option('text'), 'abc2/1/2016', 'text option shouldn\'t be reset');
    });

    QUnit.test('Validation should be correct when year of the value less than 100', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            min: new Date(2015, 6, 10),
            max: new Date(2015, 6, 14),
            value: new Date(2015, 6, 12),
            valueChangeEvent: 'change',
            pickerType: 'calendar'
        });

        const dateBox = $dateBox.dxDateBox('instance');

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        $input.val('1/1/99');
        $input.change();

        assert.notOk(dateBox.option('isValid'), 'datebox is invalid');
        const validationError = dateBox.option('validationError').message;
        assert.equal(validationError, 'Value is out of range', 'validation message is correct');
    });

    QUnit.test('dxDateBox should validate value after change \'max\' option', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            max: new Date(2015, 6, 14),
            value: new Date(2015, 6, 12),
            pickerType: 'calendar'
        }).dxDateBox('instance');

        dateBox.option('value', new Date(2015, 6, 20));
        dateBox.option('max', new Date(2015, 6, 25));

        assert.ok(dateBox.option('isValid'), 'datebox is valid');
    });

    QUnit.test('dxDateBox should validate value after change \'min\' option', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            min: new Date(2015, 6, 14),
            value: new Date(2015, 6, 18),
            pickerType: 'calendar'
        }).dxDateBox('instance');

        dateBox.option('value', new Date(2015, 6, 10));
        dateBox.option('min', new Date(2015, 6, 5));

        assert.ok(dateBox.option('isValid'), 'datebox is valid');
    });

    QUnit.test('dxDateBox should become invalid if min/max options changed', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            min: new Date(2015, 6, 14),
            value: new Date(2015, 6, 18),
            max: new Date(2015, 6, 20),
            pickerType: 'calendar'
        }).dxDateBox('instance');

        dateBox.option('min', new Date(2015, 6, 19));
        assert.notOk(dateBox.option('isValid'), 'datebox is invalid');

        dateBox.option('min', new Date(2015, 6, 14));
        assert.ok(dateBox.option('isValid'), 'datebox is valid');

        dateBox.option('max', new Date(2015, 6, 17));
        assert.notOk(dateBox.option('isValid'), 'datebox is invalid');

        dateBox.option('max', new Date(2015, 6, 20));
        assert.ok(dateBox.option('isValid'), 'datebox is valid');
    });

    QUnit.test('required validator should not be triggered when another validation rule has been changed', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            min: new Date(2015, 6, 14),
            value: null,
            max: new Date(2015, 6, 20),
            pickerType: 'calendar'
        }).dxValidator({
            validationRules: [{ type: 'required', message: 'Date is required' }]
        }).dxDateBox('instance');

        dateBox.option({
            min: new Date(2015, 6, 13),
            max: new Date(2015, 6, 21)
        });

        assert.ok(dateBox.option('isValid'), 'datebox is valid');
    });

    QUnit.test('required validator should be triggered when another validation rule has been changed for widget in invalid state (T838294)', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            min: new Date(2015, 6, 14),
            value: new Date(2015, 6, 15),
            max: new Date(2015, 6, 20),
            pickerType: 'calendar'
        }).dxValidator({
            validationRules: [{ type: 'required', message: 'Date is required' }]
        }).dxDateBox('instance');

        dateBox.option('value', null);

        dateBox.option({
            min: new Date(2015, 6, 13),
            max: new Date(2015, 6, 21)
        });

        assert.notOk(dateBox.option('isValid'), 'datebox is invalid');
    });

    QUnit.test('Validation callback should be called only once when value changes (T879881)', function(assert) {
        const validationCallbackSpy = sinon.spy();

        const dateBox = $('#dateBox').dxDateBox({
            value: '2020-01-15'
        }).dxValidator({
            validationRules: [{
                type: 'custom',
                reevaluate: true,
                validationCallback: validationCallbackSpy
            }]
        }).dxDateBox('instance');

        const date = new Date(2020, 0, 1);
        dateBox.option('value', date);

        const args = validationCallbackSpy.getCall(0).args[0];
        assert.ok(validationCallbackSpy.calledOnce, 'validation callback is called only once');
        assert.strictEqual(args.value, date, 'value is correct');
        assert.ok(args.validator, 'validator is passed');
        assert.ok(args.rule, 'rule is passed');
    });

    QUnit.test('Validation callback should be called only once when value changes by keyboard typing (T879881)', function(assert) {
        const validationCallbackSpy = sinon.spy();

        const dateBox = $('#dateBox').dxDateBox({
            value: '2020-01-15',
            pickerType: 'calendar'
        }).dxValidator({
            validationRules: [{
                type: 'custom',
                reevaluate: true,
                validationCallback: validationCallbackSpy
            }]
        }).dxDateBox('instance');

        const $input = $(dateBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`));
        const keyboard = keyboardMock($input);

        keyboard
            .caret({ start: 0, end: 9 })
            .type('1/1/2020')
            .press('enter');

        const args = validationCallbackSpy.getCall(0).args[0];
        assert.ok(validationCallbackSpy.calledOnce, 'validation callback is called only once');
        assert.strictEqual(args.value, '2020-01-01', 'value is correct');
        assert.ok(args.validator, 'validator is passed');
        assert.ok(args.rule, 'rule is passed');
    });

    QUnit.testInActiveWindow('DateBox should validate value after remove an invalid characters', function(assert) {
        const $element = $('#dateBox');
        const dateBox = $element.dxDateBox({
            value: new Date(2015, 6, 18),
            pickerType: 'calendar'
        }).dxDateBox('instance');
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard
            .caret(dateBox.option('text').length - 1)
            .type('d')
            .press('enter');

        assert.notOk(dateBox.option('isValid'));

        keyboard
            .press('backspace')
            .press('enter');

        assert.ok(dateBox.option('isValid'));
    });

    QUnit.test('datebox should pass Date value to the validationCallback by default', function(assert) {
        const validationCallback = sinon.stub().returns(true);
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            value: null,
            pickerType: 'calendar'
        }).dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback
            }]
        });
        const keyboard = keyboardMock($dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));

        keyboard
            .type('10/10/2020')
            .change();

        const { value } = validationCallback.lastCall.args[0];
        assert.ok(validationCallback.calledOnce, 'validationCallback called once');
        assert.ok(typeUtils.isDate(value), 'value type is Date');
    });

    QUnit.test('datebox should pass string value to the validationCallback when "dateSerializationFormat" defined', function(assert) {
        const validationCallback = sinon.stub().returns(true);
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            value: null,
            pickerType: 'calendar',
            dateSerializationFormat: 'yyyy-MM-dd'
        }).dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback
            }]
        });
        const keyboard = keyboardMock($dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));

        keyboard
            .type('10/10/2020')
            .change();

        const { value } = validationCallback.lastCall.args[0];
        assert.ok(validationCallback.calledOnce, 'validationCallback called once');
        assert.strictEqual(value, '2020-10-10', 'String value passed');
    });
});

QUnit.module('DateBox number and string value support', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('string value should be supported', function(assert) {
        assert.expect(1);

        $('#dateBox').dxDateBox({
            value: '2015/08/09',
            onContentReady() {
                assert.ok(true, 'widget is rendered without errors');
            }
        });
    });

    QUnit.test('number value should be supported', function(assert) {
        assert.expect(1);

        const date = new Date(2015, 7, 7);
        $('#dateBox').dxDateBox({
            value: date.valueOf(),
            onContentReady() {
                assert.ok(true, 'widget is rendered without errors');
            }
        });
    });

    QUnit.test('date should be displayed correctly', function(assert) {
        const date = new Date(2015, 7, 14);
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(date)
        });
        const instance = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        const expectedText = $input.text();

        instance.option('value', date.valueOf());
        assert.equal($input.text(), expectedText, 'date is displayed correctly when specified by number');

        instance.option('value', dateLocalization.format(date, instance.option('displayFormat')));
        assert.equal($input.text(), expectedText, 'date is displayed correctly when specified by string');
    });

    QUnit.test('value should save its type after picker was used (type = \'date\')', function(assert) {
        const date = new Date(2015, 7, 9);
        const dateString = '2015/08/09';
        const newDate = new Date(2015, 7, 21);
        const newDateString = '2015/08/21';

        const $dateBox = $('#dateBox').dxDateBox({
            value: dateString,
            type: 'date',
            pickerType: 'calendar',
            applyValueMode: 'instantly',
            opened: true
        });
        const instance = $dateBox.dxDateBox('instance');

        $('td[data-value=\'' + getShortDate(newDate) + '\']').trigger('dxclick');
        assert.equal(typeof instance.option('value'), 'string', 'value type is saved');
        assert.equal(instance.option('value'), newDateString, 'value is correct');

        instance.option('value', date.valueOf());
        instance.open();

        $('td[data-value=\'' + getShortDate(newDate) + '\']').trigger('dxclick');
        assert.equal(typeof instance.option('value'), 'number', 'value type is saved');
        assert.equal(instance.option('value'), newDate.valueOf(), 'value is correct');
    });

    QUnit.test('value should remain correct after picker was used (type = \'datetime\')', function(assert) {
        const dateString = '2015/08/09 18:33:00';
        const newDate = new Date(2015, 7, 21, 18, 33);

        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            applyValueMode: 'instantly',
            type: 'datetime',
            value: dateString,
            opened: true
        });
        const instance = $dateBox.dxDateBox('instance');

        $('td[data-value=\'' + getShortDate(newDate) + '\']').trigger('dxclick');

        assert.deepEqual(new Date(instance.option('value')), newDate, 'value is correct');
    });

    QUnit.test('value should remain correct after picker was used (type = \'time\')', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            applyValueMode: 'instantly',
            type: 'time',
            value: dateLocalization.format(new Date(2015, 7, 9, 18, 33), 'yyyy/MM/dd HH:mm:ss'),
            opened: true
        });
        const instance = $dateBox.dxDateBox('instance');

        $('.dx-list-item').eq(37).trigger('dxclick');

        const time = dateLocalization.format(new Date(instance.option('value')), 'longtime');
        const expectedTime = dateLocalization.format(new Date(2015, 7, 9, 18, 30), 'longtime');

        assert.equal(time, expectedTime, 'value is correct');
    });

    QUnit.test('string value for the \'min\' option should be supported', function(assert) {
        assert.expect(1);

        $('#dateBox').dxDateBox({
            value: '2015/08/09',
            min: '2015/05/09',
            onContentReady() {
                assert.ok(true, 'widget is rendered without errors');
            }
        });
    });

    QUnit.test('number value for the \'min\' option should be supported', function(assert) {
        assert.expect(1);

        $('#dateBox').dxDateBox({
            value: new Date(2015, 7, 7).valueOf(),
            min: new Date(2015, 4, 7).valueOf(),
            onContentReady() {
                assert.ok(true, 'widget is rendered without errors');
            }
        });
    });

    QUnit.test('string value for the \'max\' option should be supported', function(assert) {
        assert.expect(1);

        $('#dateBox').dxDateBox({
            value: '2015/08/09',
            max: '2015/10/09',
            onContentReady() {
                assert.ok(true, 'widget is rendered without errors');
            }
        });
    });

    QUnit.test('number value for the \'max\' option should be supported', function(assert) {
        assert.expect(1);

        $('#dateBox').dxDateBox({
            value: new Date(2015, 7, 7).valueOf(),
            max: new Date(2015, 9, 7).valueOf(),
            onContentReady() {
                assert.ok(true, 'widget is rendered without errors');
            }
        });
    });

    QUnit.test('ISO strings support', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            $('#dateBox').dxDateBox({
                value: '2016-01-11T12:00:00',
                min: '2016-01-10T17:29:00',
                max: '2016-01-13T17:29:00',
                mode: 'text'
            });

            const $input = $('#dateBox').find(`.${TEXTEDITOR_INPUT_CLASS}`);
            assert.equal($input.val(), '1/11/2016', 'text is correct');

            $($input.val('1/12/2016')).trigger('change');

            assert.equal($('#dateBox').dxDateBox('option', 'value'), '2016-01-12T12:00:00', 'value is correct');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('ISO strings support dateSerializationFormat', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            $('#dateBox').dxDateBox({
                value: '2016-01-11T00:00:00Z',
                dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
                mode: 'text'
            });

            const serializeUTCDate = (year, month, day) => {
                return dateSerialization.serializeDate(new Date(Date.UTC(year, month, day)), 'M/d/y');
            };

            const $input = $('#dateBox').find(`.${TEXTEDITOR_INPUT_CLASS}`);
            assert.equal($input.val(), serializeUTCDate(2016, 0, 11), 'text is correct');

            $($input.val(serializeUTCDate(2016, 0, 12))).trigger('change');
            assert.equal($('#dateBox').dxDateBox('option', 'value'), '2016-01-12T00:00:00Z', 'value is correct');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    // T506146
    QUnit.test('enter value with big year if dateSerializationFormat is defined', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            $('#dateBox').dxDateBox({
                dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
                mode: 'text'
            });

            const $input = $('#dateBox').find(`.${TEXTEDITOR_INPUT_CLASS}`);

            $($input.val('1/12/21016')).trigger('change');

            assert.equal($('#dateBox').dxDateBox('option', 'value'), '21016-01-12T00:00:00', 'value is correct');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('enter value with big year if dateSerializationFormat is defined and forceIsoDateParsing is disabled', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = false;

        try {
            $('#dateBox').dxDateBox({
                dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
                mode: 'text'
            });

            const $input = $('#dateBox').find(`.${TEXTEDITOR_INPUT_CLASS}`);

            $($input.val('1/12/21016')).trigger('change');

            assert.deepEqual($('#dateBox').dxDateBox('option', 'value'), new Date(21016, 0, 12), 'value is correct and it is not serialized');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('First century year value should works correctly(T905007)', function(assert) {
        try {
            const dateBox = $('#dateBox').dxDateBox({
                value: '3/16/1964',
                min: new Date(-50, 1, 1),
                displayFormat: 'shortdate',
                pickerType: 'calendar'
            }).dxDateBox('instance');

            const $input = $('#dateBox').find(`.${TEXTEDITOR_INPUT_CLASS}`);

            $($input.val('1/1/15')).trigger('change');
            dateBox.option('opened', true);

            assert.deepEqual($('#dateBox').dxDateBox('option', 'text'), '1/1/15');
        } catch(e) {
            assert.ok(false, 'exception raised: ' + e.message);
        }
    });

    QUnit.test('onValueChanged should not be fired when on popup opening', function(assert) {
        let isValueChangedCalled = false;

        const dateBox = $('#dateBox').dxDateBox({
            value: undefined,
            mode: 'text',
            onValueChanged() {
                isValueChangedCalled = true;
            }
        }).dxDateBox('instance');

        dateBox.option('opened', true);

        assert.ok(!isValueChangedCalled, 'onValueChanged is not called');
    });

    QUnit.test('value should be changed on cell click in calendar with defined dateSerializationFormat via defaultOptions', function(assert) {
        Calendar.defaultOptions({
            options: { dateSerializationFormat: 'yyyy-MM-dd' }
        });

        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date(2017, 11, 25),
            pickerType: 'calendar'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        dateBox.open();

        $(`.${CALENDAR_CELL_CLASS}`).eq(0).trigger('dxclick');

        assert.deepEqual(dateBox.option('value'), new Date(2017, 10, 26), 'value is changed');

        Calendar.defaultOptions({
            options: { dateSerializationFormat: null }
        });
    });

    QUnit.test('should not throw any errors after clicking on the navigator caption button if the value is an empty string (T1257679)', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: '',
            opened: true,
        }).dxDateBox('instance');

        try {
            const $navigatorCaptionButton = dateBox._popup.$wrapper().find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);

            $($navigatorCaptionButton).trigger('dxclick');
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        } finally {
            assert.ok(true, 'there is no error');
        }
    });

    [true, false].forEach(isRuntime => {
        QUnit.test(`should not throw error after applying new date when empty string ${isRuntime ? 'runtime' : 'initial'} value is passed and datetime type used (T1301310)`, function(assert) {
            const dateBox = $('#dateBox').dxDateBox({
                value: isRuntime ? undefined : '',
                type: 'datetime',
            }).dxDateBox('instance');

            try {
                dateBox.open();

                if(isRuntime) {
                    dateBox.option('value', '');
                }

                const $calendarCell = $(`.${CALENDAR_CELL_CLASS}`).eq(0);
                $calendarCell.trigger('dxclick');

                const $applyButton = $(dateBox.content()).parent().find(APPLY_BUTTON_SELECTOR);
                $applyButton.trigger('dxclick');

                assert.ok(true, 'no error');
            } catch(e) {
                assert.ok(false, `error thrown: ${e.message}`);
            }
        });
    });
});

testModule('native picker', function() {
    [
        { editorType: 'date', checkDate: true, checkTime: false },
        { editorType: 'time', checkDate: false, checkTime: true },
        { editorType: 'datetime', checkDate: true, checkTime: true }
    ].forEach(({ editorType, checkDate, checkTime }) => {
        test(`set new value for editor with ${editorType} type`, function(assert) {
            const $editor = $('#dateBox').dxDateBox({
                pickerType: 'native',
                type: editorType,
                value: new Date(2020, 10, 11, 13, 0, 0)
            });
            const instance = $editor.dxDateBox('instance');
            const newEditorInstance = $('<div>').appendTo('#qunit-fixture').dxDateBox({
                pickerType: 'native',
                type: editorType,
                value: new Date(2020, 10, 12, 13, 1, 0)
            }).dxDateBox('instance');
            const newValue = newEditorInstance.option('text');

            $editor
                .find(`.${TEXTEDITOR_INPUT_CLASS}`)
                .val(newValue)
                .trigger('change');

            assert.ok(instance.option('isValid'), 'New value is valid');

            const currentDate = instance.option('value');
            if(checkDate) {
                assert.strictEqual(currentDate.getFullYear(), 2020);
                assert.strictEqual(currentDate.getMonth(), 10);
                assert.strictEqual(currentDate.getDate(), 12);
            }

            if(checkTime) {
                assert.strictEqual(currentDate.getHours(), 13);
                assert.strictEqual(currentDate.getMinutes(), 1);
            }
        });
    });

    test('empty class should not be attached for native picker with null value (T1328901)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'native',
            type: 'date',
            value: null,
            labelMode: 'floating',
            label: 'Label',
        });
        const dateBox = $dateBox.dxDateBox('instance');

        assert.strictEqual($dateBox.hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS), false,
            'empty class is not attached so floating label does not overlap with browser-rendered date format hint');

        dateBox.option('value', new Date());

        assert.strictEqual($dateBox.hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS), false,
            'empty class remains absent after value is set');
    });
});

QUnit.module('valueChanged handler should receive correct event', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.valueChangedHandler = sinon.stub();
        const initialOptions = {
            opened: true,
            onValueChanged: this.valueChangedHandler,
            pickerType: 'calendar',
            type: 'date'
        };
        this.init = (options) => {
            this.$element = $('#dateBox').dxDateBox(options);
            this.instance = this.$element.dxDateBox('instance');
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            this.keyboard = keyboardMock(this.$input);
        };
        this.testProgramChange = (assert) => {
            this.instance.option('value', new Date(1991, 5, 5));

            const callCount = this.valueChangedHandler.callCount;
            const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
            assert.strictEqual(event, undefined, 'event is undefined');
        };
        this.reinit = (options) => {
            this.instance.dispose();
            this.init($.extend({}, initialOptions, options));
        };
        this.checkEvent = (assert, type, target, key) => {
            const event = this.valueChangedHandler.getCall(0).args[0].event;
            assert.strictEqual(event.type, type, 'event type is correct');
            assert.strictEqual(event.target, target.get(0), 'event target is correct');
            if(type === 'keydown') {
                assert.strictEqual(normalizeKeyName(event), normalizeKeyName({ key }), 'event key is correct');
            }
        };

        this.init(initialOptions);
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    test('on runtime change', function(assert) {
        this.testProgramChange(assert);
    });

    [false, true].forEach(useMaskBehavior => {
        test(`on change when useMaskBehavior=${useMaskBehavior}`, function(assert) {
            this.reinit({ useMaskBehavior });

            this.keyboard
                .type('10/10/2020')
                .change();

            this.checkEvent(assert, 'change', this.$input);
            this.testProgramChange(assert);
        });

        test(`on enter press after typing when useMaskBehavior=${useMaskBehavior}`, function(assert) {
            this.reinit({ useMaskBehavior });

            this.keyboard
                .type('10/10/2020')
                .press('enter');

            this.checkEvent(assert, 'keydown', this.$input, 'enter');
            this.testProgramChange(assert);
        });

        test(`on enter press after clearing when useMaskBehavior=${useMaskBehavior}`, function(assert) {
            this.reinit({ useMaskBehavior, value: new Date() });

            // attempt to simulate real clearing
            this.$input.val('');
            this.instance.option('text', '');

            this.$input.trigger($.Event('keydown', { key: 'Enter' }));

            this.checkEvent(assert, 'keydown', this.$input, 'enter');
            this.testProgramChange(assert);
        });
    });

    ['calendar', 'rollers'].forEach(pickerType => {
        ['date', 'datetime', 'time'].forEach(type => {
            QUnit.test(`on click on apply button if pickerType=${pickerType} and type=${type}`, function(assert) {
                this.reinit({ applyValueMode: 'useButtons', pickerType, type });
                const $applyButton = $(this.instance.content()).parent().find(APPLY_BUTTON_SELECTOR);

                if(pickerType === 'calendar' && /date/.test(type)) {
                    $(`.${CALENDAR_CELL_CLASS}`).eq(0).trigger('dxclick');
                } else if(pickerType === 'calendar' && type === 'time') {
                    $(this.instance.content()).find(LIST_ITEM_SELECTOR).eq(1).trigger('dxclick');
                }

                $applyButton.trigger('dxclick');

                this.checkEvent(assert, 'dxclick', $applyButton);
                this.testProgramChange(assert);
            });
        });
    });

    QUnit.test('on click on clear button', function(assert) {
        this.reinit({ showClearButton: true, value: new Date() });
        const $clearButton = this.$element.find(`.${CLEAR_BUTTON_AREA_CLASS}`);

        $clearButton.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', $clearButton);
        this.testProgramChange(assert);
    });

    QUnit.module('list integration', {
        beforeEach: function() {
            this.reinit({ pickerType: 'list', type: 'time' });
            this.$listItem = $(this.instance.content()).find(LIST_ITEM_SELECTOR).eq(0);
        }
    }, () => {
        QUnit.test('on list item click', function(assert) {
            this.$listItem.trigger('dxclick');

            this.checkEvent(assert, 'dxclick', this.$listItem);
            this.testProgramChange(assert);
        });

        QUnit.test('on list item selecting using enter', function(assert) {
            this.keyboard
                .press('down')
                .press('enter');

            this.checkEvent(assert, 'keydown', this.$listItem, 'enter');
            this.testProgramChange(assert);
        });
    });

    QUnit.test('on calendar cell click', function(assert) {
        const $calendarCell = $(`.${CALENDAR_CELL_CLASS}`).eq(0);
        $calendarCell.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', $calendarCell);
        this.testProgramChange(assert);
    });

    QUnit.test('on click on today button', function(assert) {
        this.reinit({ calendarOptions: { showTodayButton: true } });
        const $todayButton = $(this.instance.content()).parent().find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

        $todayButton.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', $todayButton);
        this.testProgramChange(assert);
    });

    QUnit.test('should display custom text on today button from todayButtonText option', function(assert) {
        this.instance.option({ calendarOptions: { showTodayButton: true }, todayButtonText: 'today button text' });
        const $todayButton = $(this.instance.content()).parent().find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

        assert.equal($todayButton.text().trim(), 'today button text');
    });

    QUnit.test('should display custom text on today button from todayButtonText option initialize', function(assert) {
        this.reinit({ calendarOptions: { showTodayButton: true }, todayButtonText: 'today button text' });
        const $todayButton = $(this.instance.content()).parent().find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

        assert.equal($todayButton.text().trim(), 'today button text');
    });
});

QUnit.module('validation', {
    beforeEach: function() {
        this.$dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            showClearButton: true
        });

        this.dateBox = this.$dateBox.dxDateBox('instance');
        this.$input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        this.keyboard = keyboardMock(this.$input);
        this.$clearButton = this.$dateBox.find(`.${CLEAR_BUTTON_AREA_CLASS}`);
    }
}, () => {
    [null, new Date(2020, 1, 1)].forEach(value => {
        QUnit.test(`click on clear button should raise custom validation when value is ${value ? 'custom' : 'default'} (T993296)`, function(assert) {
            this.$dateBox.dxValidator({
                validationRules: [{
                    type: 'required',
                    message: 'required'
                }]
            });
            this.dateBox.option({ value });

            this.keyboard.type('123').press('enter');
            this.$clearButton.trigger('dxclick');

            assert.notOk(this.dateBox.option('isValid'), 'dateBox is invalid');
            assert.strictEqual(this.dateBox.option('validationError').message, 'required', 'validation callback is failed');
        });

        QUnit.test(`clear button click should raise inner validation when value is ${value ? 'custom' : 'default'}`, function(assert) {
            this.dateBox.option({ value });

            this.keyboard.type('123').press('enter');
            this.$clearButton.trigger('dxclick');

            assert.ok(this.dateBox.option('isValid'), 'datebox is valid after clear button click');
        });

        QUnit.test(`clear method call should raise inner validation when value is ${value ? 'custom' : 'default'}`, function(assert) {
            this.dateBox.option({ value });

            this.keyboard.type('123').press('enter');
            this.dateBox.clear();

            assert.ok(this.dateBox.option('isValid'), 'datebox is valid after clear button click');
        });
    });

    ['change', 'input', 'keydown', 'keyup', 'focusout', 'blur'].forEach(valueChangeEvent => {
        QUnit.test(`enter handler should raise custom validation when valueChangeEvent=${valueChangeEvent}(T999607)`, function(assert) {
            this.dateBox.option({ valueChangeEvent });
            this.$dateBox.dxValidator({
                validationRules: [{
                    type: 'custom',
                    message: 'custom',
                    validationCallback: () => false
                }]
            });

            this.keyboard
                .type('1/1/2021')
                .press('enter')
                .change();

            assert.notOk(this.dateBox.option('isValid'), 'dateBox is invalid');
            assert.strictEqual(this.dateBox.option('validationError').message, 'custom', 'validation callback is failed');
        });

        QUnit.test(`enter handler should raise custom validation after invalid character remove when valueChangeEvent=${valueChangeEvent}`, function(assert) {
            this.dateBox.option({ valueChangeEvent });
            this.$dateBox.dxValidator({
                validationRules: [{
                    type: 'custom',
                    message: 'custom',
                    validationCallback: () => false
                }]
            });

            this.keyboard
                .type('1/1/2021')
                .press('enter')
                .change()
                .type('d')
                .change()
                .press('backspace')
                .press('enter')
                .change();

            assert.notOk(this.dateBox.option('isValid'), 'dateBox is invalid');
            assert.strictEqual(this.dateBox.option('validationError').message, 'custom', 'validation callback is failed');
        });

        QUnit.test(`custom validation should be raised only once after enter press when valueChangeEvent=${valueChangeEvent}`, function(assert) {
            this.dateBox.option({ valueChangeEvent });
            const validationCallbackStub = sinon.stub();

            this.keyboard.type('1/1/2021');
            this.$dateBox.dxValidator({
                validationRules: [{
                    reevaluate: true,
                    type: 'custom',
                    message: 'custom',
                    validationCallback: validationCallbackStub
                }]
            });
            this.keyboard
                .press('enter')
                .change();

            assert.ok(validationCallbackStub.calledOnce, 'custom validation was called only once');
        });
    });

    QUnit.test('custom validation should get actual value as parameter if value was not changed (T1024043)', function(assert) {
        const value = '2021-08-24';
        this.dateBox.option({ value });
        const validationCallbackStub = sinon.stub();

        this.$dateBox.dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback: validationCallbackStub
            }]
        });

        this.keyboard.press('enter');

        assert.strictEqual(validationCallbackStub.getCall(0).args[0].value, value, 'validation callback value parameter is correct');
    });

    QUnit.test('validation icon should not be shown if _showValidationIcon=false', function(assert) {
        this.dateBox.option({
            _showValidationIcon: false,
            isValid: false,
        });

        assert.strictEqual(this.$dateBox.hasClass(SHOW_INVALID_BADGE_CLASS), false, 'validation icon is be hidden');
    });
});

QUnit.module('Global formatting config (spec)', {
    beforeEach: function() {
        const globalConfig = config();
        this.defaultOptions = DateBox.defaultOptions;
        this.savedGlobalFormats = {
            dateFormat: globalConfig.dateFormat,
            timeFormat: globalConfig.timeFormat,
            dateTimeFormat: globalConfig.dateTimeFormat,
            numberFormat: globalConfig.numberFormat,
            dateTimeFormatPresets: globalConfig.dateTimeFormatPresets,
        };
    },
    afterEach: function() {
        const globalConfig = config();
        Object.keys(this.savedGlobalFormats).forEach((key) => {
            const value = this.savedGlobalFormats[key];
            if(value === undefined) {
                delete globalConfig[key];
            } else {
                globalConfig[key] = value;
            }
        });
        DateBox.defaultOptions(this.defaultOptions || {});
    },
}, () => {
    QUnit.test('implicit date displayFormat uses global dateFormat', function(assert) {
        config({
            ...config(),
            dateFormat: 'dd/MM/yyyy',
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(2020, 0, 2),
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.val(), '02/01/2020');
    });

    QUnit.test('implicit datetime displayFormat uses global dateTimeFormat', function(assert) {
        config({
            ...config(),
            dateTimeFormat: 'dd/MM/yyyy, HH:mm',
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'datetime',
            value: new Date(2020, 0, 2, 14, 5),
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.val(), '02/01/2020, 14:05');
    });

    QUnit.test('implicit time displayFormat uses global timeFormat', function(assert) {
        config({
            ...config(),
            timeFormat: 'HH:mm:ss',
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'time',
            value: new Date(2020, 0, 2, 14, 5, 6),
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.val(), '14:05:06');
    });

    QUnit.test('timeview number editors ignore global numberFormat', function(assert) {
        config({
            ...config(),
            numberFormat: '+#',
        });

        $('#dateBox').dxDateBox({
            type: 'datetime',
            pickerType: 'calendar',
            value: new Date(2020, 0, 2, 4, 5, 0),
            opened: true,
        });

        const $timeInputs = $(`.dx-timeview .dx-numberbox .${TEXTEDITOR_INPUT_CLASS}`);
        assert.strictEqual($timeInputs.eq(0).val(), '04', 'hours editor does not use global number format');
        assert.strictEqual($timeInputs.eq(1).val(), '05', 'minutes editor does not use global number format');
    });

    QUnit.test('explicit displayFormat keeps priority over global dateFormat', function(assert) {
        config({
            ...config(),
            dateFormat: 'dd/MM/yyyy',
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(2020, 0, 2),
            displayFormat: 'shortDate',
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.val(), '1/2/2020');
    });

    QUnit.test('implicit DateBox uses dateTimeFormatPresets.shortDate when no dateFormat is set', function(assert) {
        config({
            ...config(),
            dateTimeFormatPresets: {
                shortDate: 'dd/MM/yyyy',
            },
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(2020, 0, 3),
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.val(), '03/01/2020');
    });

    QUnit.test('defaultOptions displayFormat keeps priority over global dateFormat', function(assert) {
        config({
            ...config(),
            dateFormat: 'dd/MM/yyyy',
        });
        DateBox.defaultOptions({
            options: {
                displayFormat: 'yyyy-MM-dd',
            },
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(2020, 0, 2),
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.val(), '2020-01-02');
    });

    QUnit.test('dateFormat takes priority over dateTimeFormatPresets.shortDate for implicit DateBox', function(assert) {
        config({
            ...config(),
            dateFormat: 'yyyy-MM-dd',
            dateTimeFormatPresets: {
                shortDate: 'dd/MM/yyyy',
            },
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(2020, 0, 2),
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        // dateFormat wins over dateTimeFormatPresets for implicit case
        assert.strictEqual($input.val(), '2020-01-02');
    });

    QUnit.test('explicit displayFormat: "shortDate" uses dateTimeFormatPresets override', function(assert) {
        config({
            ...config(),
            dateTimeFormatPresets: {
                shortDate: 'dd/MM/yyyy',
            },
        });

        const $element = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(2020, 0, 2),
            displayFormat: 'shortDate',
            pickerType: 'calendar',
        });
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.val(), '02/01/2020');
    });
});
