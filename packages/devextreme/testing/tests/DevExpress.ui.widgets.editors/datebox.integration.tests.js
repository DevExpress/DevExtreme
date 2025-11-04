import '../../helpers/noIntl.js';
import $ from 'jquery';
import Box from 'ui/box';
import DateBox from 'ui/date_box';
import dateLocalization from 'common/core/localization/date';
import dateUtils from 'core/utils/date';
import devices from '__internal/core/m_devices';
import fx from 'common/core/animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import { getActiveElement } from '../../helpers/shadowDom.js';
import pointerMock from '../../helpers/pointerMock.js';
import uiDateUtils from '__internal/ui/date_box/m_date_utils';
import { noop } from 'core/utils/common';
import { logger } from 'core/utils/console';

import '../../helpers/calendarFixtures.js';

import 'ui/validator';
import 'generic_light.css!';
import { implementationsMap } from 'core/utils/size';

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

const currentDate = new Date(2015, 11, 31);
const firstDayOfWeek = 0;
const BOX_CLASS = 'dx-box';
const CALENDAR_CLASS = 'dx-calendar';
const TIMEVIEW_CLASS = 'dx-timeview';
const TIMEVIEW_CLOCK_CLASS = 'dx-timeview-clock';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const DATEBOX_CLASS = 'dx-datebox';
const DATEBOX_WRAPPER_CLASS = 'dx-datebox-wrapper';
const DATEBOX_LIST_POPUP_SELECTOR = '.dx-datebox-wrapper-list .dx-popup-content';
const LIST_ITEM_SELECTOR = '.dx-list-item';
const DATEBOX_ADAPTIVITY_MODE_CLASS = 'dx-datebox-adaptivity-mode';
const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const DROP_DOWN_BUTTON_CLASS = 'dx-dropdowneditor-button';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const POPUP_CLASS = 'dx-popup';
const LIST_CLASS = 'dx-list';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const NUMBERBOX_CLASS = 'dx-numberbox';
const NUMBERBOX_SPIN_DOWN_CLASS = 'dx-numberbox-spin-down';
const SELECTBOX_CLASS = 'dx-selectbox';

const APPLY_BUTTON_SELECTOR = '.dx-popup-done.dx-button';
const CANCEL_BUTTON_SELECTOR = '.dx-popup-cancel.dx-button';

const getInstanceWidget = instance => {
    return instance._strategy._widget;
};

const clearInput = ($element, keyboard) => {
    const textLength = $element.val().length;
    keyboard
        .caret({ start: 0, end: textLength })
        .press('backspace');
};

QUnit.module('datebox and calendar integration', () => {
    QUnit.test('default', function(assert) {
        const $element = $('#dateBox').dxDateBox({ pickerType: 'calendar' });

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#dateBox').dxDateBox({ pickerType: 'calendar' });
        const instance = $element.dxDateBox('instance');
        const customWidth = 258;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change input value should change calendar value', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            type: 'date',
            value: new Date(2016, 1, 25)
        });
        $($dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`)).trigger('dxclick');

        const dateBox = $dateBox.dxDateBox('instance');
        const calendar = $('.dx-calendar').dxCalendar('instance');

        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        let dateString = $input.val();
        dateString = dateString.slice(0, -1) + String(new Date().getYear() - 1).slice(-1);

        $input.val('');
        keyboardMock($input).type(dateString);
        $($input).trigger('change');

        assert.deepEqual(calendar.option('value'), dateBox.option('value'), 'datebox value and calendar value are equal');
        assert.strictEqual(dateBox.option('isValid'), true, 'Editor should be marked as true');
        assert.strictEqual(dateBox.option('validationError'), null, 'No validation error should be specified for valid input');
    });

    QUnit.test('wrong value in input should mark datebox as invalid', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: null,
            type: 'date',
            pickerType: 'calendar'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        keyboardMock($input).type('blabla');
        $($input).trigger('change');
        assert.equal($input.val(), 'blabla', 'input value should not be erased');
        assert.strictEqual(dateBox.option('value'), null, 'Editor\'s value should be reset');
        assert.strictEqual(dateBox.option('isValid'), false, 'Editor should be marked as invalid');
        const validationError = dateBox.option('validationError');
        assert.ok(validationError, 'Validation error should be specified');
        assert.ok(validationError.editorSpecific, 'editorSpecific flag should be added');
    });

    QUnit.test('datebox should not be revalidated when readOnly option changed', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            readOnly: false
        }).dxValidator({
            validationRules: [{
                type: 'required',
                message: 'Date of birth is required'
            }]
        }).dxDateBox('instance');

        dateBox.option('readOnly', true);
        dateBox.option('readOnly', false);

        assert.ok(dateBox.option('isValid'), 'dateBox is valid');
        assert.notOk($('#dateBox').hasClass('dx-invalid'), 'dateBox is not marked as invalid');
    });

    QUnit.test('wrong value in input should mark time datebox as invalid', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: null,
            type: 'time',
            pickerType: 'calendar'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        keyboardMock($input).type('blabla');
        $($input).trigger('change');

        assert.equal($input.val(), 'blabla', 'input value should not be erased');
        assert.strictEqual(dateBox.option('value'), null, 'Editor\'s value should be reset');
        assert.strictEqual(dateBox.option('isValid'), false, 'Editor should be marked as invalid');
        const validationError = dateBox.option('validationError');
        assert.ok(validationError, 'Validation error should be specified');
        assert.ok(validationError.editorSpecific, 'editorSpecific flag should be added');
    });

    QUnit.test('wrong value in input should mark pre-filled datebox as invalid', function(assert) {
        const value = new Date(2013, 2, 2);

        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            value: new Date(value),
            pickerType: 'calendar'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

        $input.val('');
        keyboardMock($input).type('blabla');
        $($input).trigger('change');

        assert.equal($input.val(), 'blabla', 'input value should not be erased');
        assert.deepEqual(dateBox.option('value'), value, 'Editor\'s value should not be changed');
        assert.strictEqual(dateBox.option('isValid'), false, 'Editor should be marked as invalid');

        const validationError = dateBox.option('validationError');
        assert.ok(validationError, 'Validation error should be specified');
        assert.ok(validationError.editorSpecific, 'editorSpecific flag should be added');
    });

    QUnit.test('correct value in input should mark datebox as valid but keep text', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: null,
            type: 'date',
            pickerType: 'calendar'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type('blabla')
            .change();

        $input.val('');
        keyboard
            .type('3/2/2014')
            .change();

        assert.equal($input.val(), '3/2/2014', 'input value should not be erased');
        assert.deepEqual(dateBox.option('value'), new Date(2014, 2, 2), 'Editor\'s value should be set');
        assert.strictEqual(dateBox.option('isValid'), true, 'Editor should be marked as valid');
        assert.strictEqual(dateBox.option('validationError'), null, 'No validation error should be specified for valid input');
    });

    QUnit.test('calendar picker should be used on generic device by default and \'type\' is \'date\'', function(assert) {
        const currentDevice = devices.current();
        const realDevice = devices.real();

        devices.real({ platform: 'generic', deviceType: 'desktop', phone: false });
        devices.current({ deviceType: 'desktop' });

        try {
            const $dateBox = $('#dateBox').dxDateBox();
            const instance = $dateBox.dxDateBox('instance');

            assert.equal(instance.option('pickerType'), 'calendar');
            assert.equal(instance._strategy.NAME, 'Calendar');
        } finally {
            devices.current(currentDevice);
            devices.real(realDevice);
        }
    });

    QUnit.test('calendar picker should not be used on generic device by default and \'type\' is not \'date\'', function(assert) {
        const currentDevice = devices.current();
        devices.current({ platform: 'generic', deviceType: 'desktop' });

        try {
            const $dateBox = $('#dateBox').dxDateBox({
                pickerType: 'calendar',
                type: 'time'
            });
            assert.ok(!$dateBox.hasClass(DATEBOX_CLASS + '-calendar'));
        } finally {
            devices.current(currentDevice);
        }
    });

    QUnit.test('calendar picker should not be used on mobile device by default', function(assert) {
        const realDevice = devices.real();
        devices.real({ platform: 'android' });

        try {
            const $dateBox = $('#dateBox').dxDateBox();
            assert.ok(!$dateBox.hasClass(DATEBOX_CLASS + '-calendar'));
        } finally {
            devices.real(realDevice);
        }
    });

    QUnit.test('correct default value for \'minZoomLevel\' option', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            opened: true
        }).dxDateBox('instance');

        const calendar = getInstanceWidget(instance);

        assert.equal(calendar.option('minZoomLevel'), 'century', '\'minZoomLevel\' option value is correct');
    });

    QUnit.test('correct default value for \'maxZoomLevel\' option', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            opened: true
        }).dxDateBox('instance');

        const calendar = getInstanceWidget(instance);

        assert.equal(calendar.option('maxZoomLevel'), 'month', '\'maxZoomLevel\' option value is correct');
    });

    QUnit.test('DateBox \'minZoomLevel\' option should affect on Calendar \'minZoomLevel\' option', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            calendarOptions: { minZoomLevel: 'year' },
            opened: true
        }).dxDateBox('instance');

        let calendar = getInstanceWidget(instance);

        assert.equal(calendar.option('minZoomLevel'), 'year', 'calendar \'minZoomLevel\' option is correct on init');

        instance.close();
        instance.option('calendarOptions.minZoomLevel', 'month');
        instance.open();
        calendar = getInstanceWidget(instance);

        assert.equal(calendar.option('minZoomLevel'), 'month', 'calendar \'minZoomLevel\' option after dateBox option change');
    });

    QUnit.test('DateBox \'maxZoomLevel\' option should affect on Calendar \'maxZoomLevel\' option', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            calendarOptions: { maxZoomLevel: 'century' },
            opened: true
        }).dxDateBox('instance');

        let calendar = getInstanceWidget(instance);

        assert.equal(calendar.option('maxZoomLevel'), 'century', 'calendar \'maxZoomLevel\' option is correct on init');

        instance.close();
        instance.option('calendarOptions.maxZoomLevel', 'year');
        instance.open();
        calendar = getInstanceWidget(instance);

        assert.equal(calendar.option('maxZoomLevel'), 'year', 'calendar \'maxZoomLevel\' option after dateBox option change');
    });

    QUnit.test('T208534 - calendar value should depend on datebox text option', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2015, 4, 12),
            valueChangeEvent: 'keyup'
        }).dxDateBox('instance');

        const kb = keyboardMock(instance._input());

        kb
            .press('end')
            .press('backspace')
            .type('4');

        instance.open();
        assert.deepEqual(new Date(2014, 4, 12), instance._strategy._widget.option('value'), 'calendar value is correct');
    });

    QUnit.test('calendar value should depend on datebox text option when calendar is opened', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2015, 4, 12),
            valueChangeEvent: 'keyup',
            opened: true
        }).dxDateBox('instance');

        const kb = keyboardMock(instance._input());
        const calendar = instance._strategy._widget;

        kb
            .caret(9)
            .press('backspace')
            .type('4');

        assert.deepEqual(new Date(2014, 4, 12), calendar.option('value'), 'calendar value is correct');

        kb.press('backspace');
        assert.deepEqual(new Date(201, 4, 12), calendar.option('value'), 'calendar value is correct');

        kb.type('3');
        assert.deepEqual(new Date(2013, 4, 12), calendar.option('value'), 'calendar value is correct');
    });

    QUnit.test('changing \'displayFormat\' should update input value', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date('03/10/2015'),
            pickerType: 'calendar',
            type: 'date'
        });
        const dateBox = $dateBox.dxDateBox('instance');
        dateBox.option('displayFormat', 'shortDateShortTime');

        assert.equal($dateBox.find('.' + TEXTEDITOR_INPUT_CLASS).val(), '3/10/2015, 12:00 AM', 'input value is updated');
    });

    QUnit.test('displayFormat should affect on timeView', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: new Date('03/10/2015'),
            displayFormat: 'shortdateshorttime',
            pickerType: 'calendar',
            opened: true,
            type: 'datetime'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $content = $(dateBox._popup.$content());
        const timeView = $content.find('.' + TIMEVIEW_CLASS).dxTimeView('instance');

        assert.notOk(timeView.option('use24HourFormat'), 'using 12 hour format');

        dateBox.option('displayFormat', 'hour');
        assert.ok(timeView.option('use24HourFormat'), 'using 24 hour format');
    });

    QUnit.test('disabledDates correctly displays', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2015, 4, 12),
            disabledDates: [new Date(2015, 4, 13)],
            opened: true
        }).dxDateBox('instance');

        const calendar = getInstanceWidget(instance);
        const $disabledCell = calendar.$element().find('.dx-calendar-empty-cell');

        assert.equal($disabledCell.length, 1, 'There is one disabled cell');
        assert.equal($disabledCell.text(), '13', 'Correct cell is disabled');
    });

    QUnit.test('disabledDates should not be called for the dates out of range[min, max]', function(assert) {
        let callCount = 0;

        $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2019, 11, 10),
            min: new Date(2019, 11, 15),
            max: new Date(2019, 11, 20),
            disabledDates: () => {
                ++callCount;
                return true;
            },
            opened: true
        }).dxDateBox('instance');

        assert.equal(callCount, 12, 'disabledDates has been called 6 times on init, 6 times on [min; max] for focusing');
    });

    QUnit.test('disabledDates correctly displays after optionChanged', function(assert) {
        const instance = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2015, 4, 12),
            disabledDates: [new Date(2015, 4, 13)],
            opened: true
        }).dxDateBox('instance');

        instance.option('disabledDates', e => {
            if(e.date.getDate() === 14 && e.date.getMonth() === 3) {
                return true;
            }
        });

        const calendar = getInstanceWidget(instance);
        const $disabledCell = calendar.$element().find('.dx-calendar-empty-cell');

        assert.equal($disabledCell.length, 1, 'There is one disabled cell');
        assert.equal($disabledCell.text(), '14', 'Correct cell is disabled');
    });

    QUnit.test('disabledDates argument contains correct component parameter', function(assert) {
        const stub = sinon.stub();

        $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2015, 4, 12),
            disabledDates: stub,
            opened: true
        });

        const component = stub.lastCall.args[0].component;
        assert.equal(component.NAME, 'dxDateBox', 'Correct component');
    });

    QUnit.test('datebox with the \'datetime\' type should keep event subscriptions', function(assert) {
        const stub = sinon.stub();

        const dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            pickerType: 'calendar',
            value: new Date(2015, 4, 12),
            adaptivityEnabled: true,
            onInitialized(e) {
                e.component.on('optionChanged', stub);
            }
        }).dxDateBox('instance');

        assert.equal(stub.callCount, 1, 'set text on render');

        dateBox.option('opened', true);

        assert.equal(stub.callCount, 2, '\'opened\' optionChanged event has been raised');
    });

    QUnit.test('Today button should be hidden if calendar is hidden', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            type: 'datetime',
            calendarOptions: {
                visible: false
            },
            opened: true
        });
        const instance = $element.dxDateBox('instance');
        const $todayButton = $(instance.content()).parent().find('.dx-button-today');

        assert.strictEqual($todayButton.length, 0);
    });


    QUnit.test('Today button should be hidden if calendar visibility is changed', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            type: 'datetime',
            opened: true
        });
        const instance = $element.dxDateBox('instance');

        instance.option('calendarOptions.visible', false);
        assert.strictEqual($(instance.content()).parent().find('.dx-button-today').length, 0);

        instance.option('calendarOptions.visible', true);
        assert.strictEqual($(instance.content()).parent().find('.dx-button-today').length, 1);
    });

    QUnit.test('change year via scroll should log proper year in on value change event (T1229926)', function(assert) {
        const valueChangedHandle = sinon.spy();
        const date = new Date();
        const currentYear = date.getFullYear();
        const datebox = $('#dateBox').dxDateBox({
            type: 'date',
            value: date,
            displayFormat: 'M/dd/yyyy',
            valueChangeEvent: 'dxmousewheel',
            useMaskBehavior: true,
            onValueChanged: valueChangedHandle
        }).dxDateBox('instance');

        const $input = $(datebox.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const pointer = pointerMock($input);
        const keyboard = keyboardMock($input, true);

        keyboard.caret({ start: 12, end: 15 });

        $input.trigger('dxclick');

        pointer.wheel(1);

        let changedValue = valueChangedHandle.getCall(0).args[0];
        assert.strictEqual(valueChangedHandle.callCount, 1, 'handler has been called once');
        assert.deepEqual(new Date(changedValue.value).getFullYear(), currentYear + 1, 'value year is correct'); assert.deepEqual(new Date(changedValue.previousValue).getFullYear(), currentYear, 'previous value year is correct');

        pointer.wheel(1);

        changedValue = valueChangedHandle.getCall(1).args[0];
        assert.strictEqual(valueChangedHandle.callCount, 2, 'handler has been called twice');
        assert.deepEqual(new Date(changedValue.value).getFullYear(), currentYear + 2, 'value year is correct');
        assert.deepEqual(new Date(changedValue.previousValue).getFullYear(), currentYear + 1, 'previous value year is correct');
    });
});

QUnit.module('datebox w/ calendar', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(new Date().valueOf());
        fx.off = true;

        this.fixture = new DevExpress.ui.testing.DateBoxFixture('#dateBox', {
            value: currentDate,
            calendarOptions: {
                currentDate,
                firstDayOfWeek
            },
            pickerType: 'calendar'
        });
        this.reinitFixture = (options) => {
            this.fixture.dispose();
            this.fixture = new DevExpress.ui.testing.DateBoxFixture('#dateBox', options);
        };
    },
    afterEach: function() {
        this.fixture.dispose();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('DateBox is defined', function(assert) {
        assert.ok(this.fixture.dateBox);
    });

    QUnit.test('DateBox can be instantiated', function(assert) {
        assert.ok(this.fixture.dateBox instanceof DateBox);
    });

    QUnit.test('DateBox must render an input', function(assert) {
        assert.ok(this.fixture.input.length);
    });

    QUnit.test('open must set \'opened\' option', function(assert) {
        assert.ok(!this.fixture.dateBox.option('opened'));
        this.fixture.dateBox.open();
        assert.ok(this.fixture.dateBox.option('opened'));
    });

    QUnit.test('calendarOptions must be passed to dxCalendar on initialization', function(assert) {
        this.fixture.dateBox.open();
        currentDate.setDate(1);
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option('currentDate'), currentDate);
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option('firstDayOfWeek'), firstDayOfWeek);
    });

    QUnit.test('Clicking _calendarContainer must not close dropDown', function(assert) {
        this.fixture.dateBox.open();
        pointerMock(this.fixture.dateBox._calendarContainer).click();
        assert.ok(this.fixture.dateBox.option('opened'));
    });

    QUnit.test('DateBox must update the input value when the value option changes', function(assert) {
        const date = new Date(2011, 11, 11);
        this.fixture.dateBox.option('value', date);
        assert.deepEqual(this.fixture.input.val(), dateLocalization.format(date, this.fixture.format));
    });

    QUnit.test('DateBox must immediately display \'value\' passed via the constructor on rendering', function(assert) {
        const date = new Date(2010, 10, 10);

        this.reinitFixture({
            value: date,
            calendarOptions: { currentDate, firstDayOfWeek },
            pickerType: 'calendar'
        });

        assert.deepEqual(this.fixture.input.val(), dateLocalization.format(date, this.fixture.format));
    });

    QUnit.test('DateBox should pass empty string value to calendar if value is empty string', function(assert) {
        this.reinitFixture({
            value: '',
            pickerType: 'calendar',
            opened: true
        });

        assert.equal(this.fixture.dateBox._strategy._widget.option('value'), '', 'value is equal to empty string');
    });

    QUnit.test('DateBox must show the calendar with a proper date selected', function(assert) {
        const date = new Date(2011, 11, 11);
        this.fixture.dateBox.option('value', date);
        this.fixture.dateBox.open();
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option('value'), date);
    });

    QUnit.test('DateBox must update its value when a date is selected in the calendar when applyValueMode=\'instantly\'', function(assert) {
        const date = new Date(2011, 11, 11);

        this.reinitFixture({
            applyValueMode: 'instantly',
            pickerType: 'calendar'
        });

        this.fixture.dateBox.open();
        getInstanceWidget(this.fixture.dateBox).option('value', date);
        // this.fixture.dateBox.close();
        assert.strictEqual(this.fixture.dateBox.option('value'), date);
    });

    QUnit.test('DateBox must update the calendar value when the CalendarPicker.option(\'value\') changes', function(assert) {
        this.reinitFixture({
            applyValueMode: 'useButtons',
            pickerType: 'calendar',
        });

        const date = new Date(2011, 11, 11);
        this.fixture.dateBox.open();
        this.fixture.dateBox.option('value', date);
        assert.deepEqual(getInstanceWidget(this.fixture.dateBox).option('value'), date);
    });

    QUnit.test('When typing a correct date, dateBox must not make a redundant _setInputValue call', function(assert) {
        let _setInputValueCallCount = 0;

        const mockSetInputValue = () => {
            ++_setInputValueCallCount;
        };

        this.fixture.dateBox._setInputValue = mockSetInputValue;
        this.fixture.dateBox.open();
        this.fixture.typeIntoInput('11/11/2011', this.fixture.input);
        assert.strictEqual(_setInputValueCallCount, 0);
    });

    QUnit.test('Swiping must not close the calendar', function(assert) {
        $(this.fixture.dateBox._input()).focus();
        this.fixture.dateBox.open();
        pointerMock(this.fixture.dateBox._strategy._calendarContainer).start().swipeStart().swipeEnd(1);
        assert.strictEqual(this.fixture.dateBox._input()[0], getActiveElement());
    });

    QUnit.test('Pressing escape must hide the calendar and clean focus', function(assert) {
        const escapeKeyDown = $.Event('keydown', { key: 'Escape' });
        this.fixture.dateBox.option('focusStateEnabled', true);
        this.fixture.dateBox.open();
        $(this.fixture.dateBox._input()).trigger(escapeKeyDown);
        assert.ok(!this.fixture.dateBox.option('opened'));
        assert.ok(!this.fixture.dateBox._input().is(':focus'));
    });

    QUnit.test('dateBox must show the calendar with proper LTR-RTL mode', function(assert) {
        this.fixture.dateBox.option('rtlEnabled', true);
        this.fixture.dateBox.open();
        assert.ok(getInstanceWidget(this.fixture.dateBox).option('rtlEnabled'));
    });

    QUnit.test('dateBox should not reposition the calendar icon in RTL mode', function(assert) {
        let iconRepositionCount = 0;

        const _repositionCalendarIconMock = () => {
            ++iconRepositionCount;
        };

        this.fixture.dateBox._repositionCalendarIcon = _repositionCalendarIconMock;
        this.fixture.dateBox.option('rtl', true);
        assert.strictEqual(iconRepositionCount, 0);
    });

    QUnit.test('dateBox must apply the wrapper class with appropriate picker type to the drop-down overlay wrapper', function(assert) {
        const dateBox = this.fixture.dateBox;
        dateBox.open();
        assert.ok(this.fixture.dateBox._popup.$wrapper().hasClass(DATEBOX_WRAPPER_CLASS + '-' + dateBox.option('pickerType')));
    });

    QUnit.test('dateBox must correctly reopen the calendar after refreshing when it was not hidden beforehand', function(assert) {
        this.fixture.dateBox.open();
        this.fixture.dateBox._refresh();
        assert.ok(this.fixture.dateBox._$popup.dxPopup('instance').option('visible'));
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        this.fixture.dateBox.option('onValueChanged', () => {
            assert.ok(true);
        });
        this.fixture.dateBox.option('value', new Date(2015, 6, 14));
    });

    QUnit.test('dateBox\'s \'min\' and \'max\' options equal to undefined (T171537)', function(assert) {
        assert.strictEqual(this.fixture.dateBox.option('min'), undefined);
        assert.strictEqual(this.fixture.dateBox.option('max'), undefined);
    });

    QUnit.test('dateBox must pass min and max to the created calendar', function(assert) {
        const min = new Date(2010, 9, 10);
        const max = new Date(2010, 11, 10);
        this.reinitFixture({
            min,
            max,
            pickerType: 'calendar'
        });
        this.fixture.dateBox.open();
        assert.ok(dateUtils.dateInRange(getInstanceWidget(this.fixture.dateBox).option('currentDate'), min, max));
    });

    QUnit.test('dateBox should not change value when setting to an earlier date than min; and setting to a later date than max', function(assert) {
        const min = new Date(2010, 10, 5);
        const max = new Date(2010, 10, 25);
        const earlyDate = new Date(min.getFullYear(), min.getMonth(), min.getDate() - 1);
        const lateDate = new Date(max.getFullYear(), max.getMonth(), max.getDate() + 1);

        this.reinitFixture({
            min,
            max,
            pickerType: 'calendar'
        });

        this.fixture.dateBox.option('value', earlyDate);
        assert.deepEqual(this.fixture.dateBox.option('value'), earlyDate);

        this.fixture.dateBox.option('value', lateDate);
        assert.deepEqual(this.fixture.dateBox.option('value'), lateDate);
    });

    QUnit.test('should execute custom validator while validation state reevaluating', function(assert) {
        this.reinitFixture({ opened: true });

        const dateBox = this.fixture.dateBox;

        dateBox.$element().dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback: () => false
            }]
        });

        const cell = dateBox._popup.$wrapper().find(`.${CALENDAR_CELL_CLASS}`);

        assert.ok(dateBox.option('isValid'));
        assert.strictEqual(dateBox.option('text'), '');

        $(cell).trigger('dxclick');

        assert.notOk(dateBox.option('isValid'));
        assert.notStrictEqual(dateBox.option('text'), '');
    });

    QUnit.test('should rise validation event once after value is changed by calendar (T714599)', function(assert) {
        const validationCallbackStub = sinon.stub().returns(false);
        const dateBox = $('#dateBoxWithPicker')
            .dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                value: new Date(2015, 5, 9, 15, 54, 13),
                opened: true
            })
            .dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: validationCallbackStub
                }]
            })
            .dxDateBox('instance');

        $(`.${CALENDAR_CELL_CLASS}`).eq(0).trigger('dxclick');
        $(APPLY_BUTTON_SELECTOR).trigger('dxclick');

        assert.notOk(dateBox.option('opened'));
        assert.ok(validationCallbackStub.calledOnce);
    });

    QUnit.test('Editor should reevaluate validation state after change text to the current value', function(assert) {
        this.reinitFixture({
            min: new Date(2010, 10, 5),
            value: new Date(2010, 10, 10),
            type: 'date',
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;

        $(dateBox._input())
            .val('11/3/2010')
            .change();

        assert.notOk(dateBox.option('isValid'), 'Editor isn\'t valid');
        assert.equal(dateBox.option('text'), '11/3/2010');

        dateBox.open();

        const $selectedDate = dateBox._popup.$wrapper().find('.dx-calendar-selected-date');
        $($selectedDate).trigger('dxclick');

        assert.ok(dateBox.option('isValid'), 'Editor is valid');
        assert.equal(dateBox.option('text'), '11/10/2010');
    });

    QUnit.test('In dateTime strategy buttons should be placed in popup bottom', function(assert) {
        this.reinitFixture({
            type: 'datetime',
            applyValueMode: 'useButtons',
            pickerType: 'calendar'
        });

        this.fixture.dateBox.open();

        assert.equal($('.dx-popup-bottom .dx-button').length, 3, 'two buttons is in popup bottom');
    });

    QUnit.test('Click on apply button', function(assert) {
        const onValueChangedHandler = sinon.spy(noop);
        const newDate = new Date(2010, 10, 10);

        this.reinitFixture({
            onValueChanged: onValueChangedHandler,
            applyValueMode: 'useButtons',
            pickerType: 'calendar'
        });
        this.fixture.dateBox.open();
        getInstanceWidget(this.fixture.dateBox).option('value', newDate);
        $(APPLY_BUTTON_SELECTOR).eq(0).trigger('dxclick');
        assert.equal(this.fixture.dateBox.option('opened'), false);
        assert.deepEqual(this.fixture.dateBox.option('value'), newDate);
        assert.ok(onValueChangedHandler.calledOnce);
    });

    QUnit.test('Click on cancel button', function(assert) {
        const onValueChangedHandler = sinon.spy(noop);
        const oldDate = new Date(2008, 8, 8);
        const newDate = new Date(2010, 10, 10);

        this.reinitFixture({
            value: oldDate,
            onValueChanged: onValueChangedHandler,
            applyValueMode: 'useButtons',
            pickerType: 'calendar'
        });

        this.fixture.dateBox.open();
        getInstanceWidget(this.fixture.dateBox).option('value', newDate);
        $('.dx-popup-cancel.dx-button').eq(0).trigger('dxclick');

        assert.equal(this.fixture.dateBox.option('opened'), false);
        assert.equal(this.fixture.dateBox.option('value'), oldDate);
        assert.ok(!onValueChangedHandler.calledOnce);
    });

    QUnit.test('calendar does not open on field click (T189394)', function(assert) {
        assert.ok(!this.fixture.dateBox.option('openOnFieldClick'));
    });

    const getLongestCaptionIndex = uiDateUtils.getLongestCaptionIndex;
    const getLongestDate = uiDateUtils.getLongestDate;

    QUnit.test('getLongestDate must consider the possibility of overflowing to the next month from its 28th day and thus losing the longest month name when calculating widths for formats containing day and month names', function(assert) {
        const someLanguageMonthNames = ['1', '1', '1', '1', '1', '1', '1', '1', '1', '22', '1', '1'];
        const someLanguageDayNames = ['1', '1', '1', '1', '22', '1', '1'];
        const longestMonthNameIndex = getLongestCaptionIndex(someLanguageMonthNames);
        const longestDate = getLongestDate('D', someLanguageMonthNames, someLanguageDayNames);
        assert.strictEqual(longestDate.getMonth(), longestMonthNameIndex);
    });

    QUnit.test('Calendar should update it value accordingly \'text\' option if it is valid (T189474)', function(assert) {
        const date = new Date(2014, 5, 10);

        this.reinitFixture({
            value: date,
            pickerType: 'calendar'
        });

        this.fixture.dateBox.open();

        keyboardMock(this.fixture.input)
            .caret(9)
            .press('backspace')
            .type('5');

        this.fixture.input.trigger('change');
        this.fixture.dateBox.open();

        const calendar = getInstanceWidget(this.fixture.dateBox);
        assert.deepEqual(calendar.option('value'), new Date(2015, 5, 10));
    });

    QUnit.test('Calendar should not be closed after datebox value has been changed by input', function(assert) {
        const date = new Date(2014, 5, 10);

        this.reinitFixture({
            value: date,
            applyValueMode: 'useButtons',
            pickerType: 'calendar'
        });

        this.fixture.dateBox.open();

        keyboardMock(this.fixture.input)
            .caret(9)
            .press('backspace')
            .type('5');

        this.fixture.input.trigger('change');

        const calendar = getInstanceWidget(this.fixture.dateBox);
        assert.deepEqual(calendar.option('value'), new Date(2015, 5, 10));
        assert.ok(this.fixture.dateBox.option('opened'));
    });

    QUnit.test('Value should be changed only after click on \'Apply\' button if the \'applyValueMode\' options is changed to \'useButtons\'', function(assert) {
        const value = new Date(2015, 0, 20);
        const newValue = new Date(2015, 0, 30);

        const dateBox = this.fixture.dateBox;

        dateBox.option('value', value);
        dateBox.open();
        dateBox.close();
        dateBox.option('applyValueMode', 'useButtons');

        dateBox.open();
        const calendar = getInstanceWidget(dateBox);
        const $applyButton = dateBox._popup.$wrapper().find(APPLY_BUTTON_SELECTOR).eq(0);

        calendar.option('value', newValue);
        assert.deepEqual(dateBox.option('value'), value, 'value is not changed yet');

        $($applyButton).trigger('dxclick');
        assert.deepEqual(dateBox.option('value'), newValue, 'value is changed after click');
    });

    QUnit.test('Value should be changed if it was entered from keyboard and it is out of range', function(assert) {
        const value = new Date(2015, 0, 15);
        const min = new Date(2015, 0, 10);
        const max = new Date(2015, 0, 20);

        this.reinitFixture({
            value,
            min,
            max,
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;
        const $input = $(dateBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`));
        const kb = keyboardMock($input);
        const inputValue = '1/5/2015';

        clearInput($input, kb);
        kb.type(inputValue).change();
        assert.equal($input.val(), inputValue, 'input value is correct');
        assert.deepEqual(dateBox.option('value'), value, 'value has not been changed');
        assert.ok(!dateBox.option('isValid'), 'datebox value is invalid');

        const validationError = dateBox.option('validationError');
        assert.ok(validationError, 'Validation error should be specified');
        assert.ok(validationError.editorSpecific, 'editorSpecific flag should be added');
    });

    QUnit.test('Empty value should not be marked as \'out of range\'', function(assert) {
        const value = new Date(2015, 0, 15);
        const min = new Date(2015, 0, 10);
        const max = new Date(2015, 0, 20);

        this.reinitFixture({
            value,
            min,
            max,
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;
        const $input = $(dateBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`));
        const kb = keyboardMock($input);

        clearInput($input, kb);
        kb.change();
        assert.ok(dateBox.option('isValid'), 'isValid flag should be set');
        assert.ok(!dateBox.option('validationError'), 'validationError should not be set');
    });

    QUnit.test('Popup should not be hidden after value change using keyboard', function(assert) {
        const value = new Date(2015, 0, 29);

        this.reinitFixture({
            type: 'date',
            value,
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;
        const $input = $(dateBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`));
        const kb = keyboardMock($input);

        dateBox.open();
        assert.equal($input.val(), '1/29/2015', 'correct input value');

        kb
            .caret(9)
            .press('backspace')
            .type('6')
            .change();

        assert.equal($input.val(), '1/29/2016', 'input value is changed');
        assert.ok(dateBox.option('opened'), 'popup is still opened');
    });

    QUnit.test('T196443 - dxDateBox should not hide popup after erase date in input field', function(assert) {
        const value = new Date(2015, 0, 30);

        this.reinitFixture({
            value,
            min: null,
            max: null,
            type: 'date',
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;
        const $input = dateBox._input();
        const kb = keyboardMock($input);

        dateBox.open();
        kb.press('end');

        for(let i = 0; i < 10; i++) {
            kb.press('backspace');
        }

        assert.deepEqual(dateBox.option('value'), value, 'datebox value is not changed');
        assert.ok(dateBox.option('opened'), 'popup is still opened');
    });

    QUnit.test('T203457 - popup should be closed when selected date is clicked', function(assert) {
        const value = new Date(2015, 1, 1);

        this.reinitFixture({
            value,
            min: null,
            max: null,
            type: 'date',
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;
        dateBox.open();
        const $selectedDate = dateBox._popup.$wrapper().find('.dx-calendar-selected-date');
        $($selectedDate).trigger('dxclick');

        assert.ok(!dateBox.option('opened'), 'popup is closed');
    });

    QUnit.test('T208825 - tapping on the \'enter\' should change value if popup is opened', function(assert) {
        const value = new Date(2015, 2, 13);

        this.reinitFixture({
            value,
            focusStateEnabled: true,
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;
        const $input = dateBox._input();
        const kb = keyboardMock($input);

        dateBox.option('valueChangeEvent', 'keyup');
        dateBox.open();

        kb
            .caret(9)
            .press('backspace')
            .type('4')
            .press('enter');

        assert.deepEqual(dateBox.option('value'), new Date(2014, 2, 13), 'value is changed');
    });

    QUnit.test('Close popup on the \'enter\' press after input value is changed', function(assert) {
        const value = new Date(2015, 2, 10);

        this.reinitFixture({
            value,
            focusStateEnabled: true,
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;

        dateBox.open();

        keyboardMock(dateBox._input())
            .press('end')
            .press('backspace')
            .type('4')
            .press('enter');

        assert.equal(dateBox.option('opened'), false, 'popup is still opened');
    });

    QUnit.test('repaint was fired if strategy is fallback', function(assert) {
        this.reinitFixture({
            useNative: false,
            useCalendar: true,
            type: 'datetime',
            pickerType: 'calendarWithTime',
            opened: true
        });

        const dateBox = this.fixture.dateBox;
        const popup = dateBox.$element().find('.dx-popup').dxPopup('instance');
        const repaintSpy = sinon.spy(popup, 'repaint');

        this.clock.tick(10);

        assert.ok(repaintSpy.called, 'repaint was fired on opened');
    });

    QUnit.test('changing type from \'datetime\' to \'date\' should lead to strategy changing', function(assert) {
        this.reinitFixture({
            type: 'datetime',
            pickerType: 'calendar'
        });

        const dateBox = this.fixture.dateBox;
        assert.equal(dateBox._strategy.NAME, 'CalendarWithTime', 'correct strategy for the \'datetime\' type');

        dateBox.option('type', 'date');
        assert.equal(dateBox._strategy.NAME, 'Calendar', 'correct strategy for the \'date\' type');
    });

    QUnit.test('T247493 - value is cleared when text is changed to invalid date and popup is opened', function(assert) {
        const date = new Date(2015, 5, 9);

        this.reinitFixture({
            pickerType: 'calendar',
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
        assert.deepEqual(dateBox.option('value'), date, 'value is correct');
        assert.equal($input.val(), '6/9/201', 'input value is correct');
    });

    QUnit.test('T252170 - date time should be the same with set value after calendar value is changed', function(assert) {
        const date = new Date(2015, 5, 9, 15, 54, 13);

        this.reinitFixture({
            pickerType: 'calendar',
            type: 'date',
            value: date
        });

        const dateBox = this.fixture.dateBox;
        dateBox.open();
        const calendar = dateBox._strategy._widget;
        const $calendar = $(calendar.$element());

        $($calendar.find('.dx-calendar-cell[data-value=\'2015/06/10\']')).trigger('dxclick');
        assert.deepEqual(calendar.option('value'), new Date(2015, 5, 10, 15, 54, 13), 'new calendar value saves set value time');
        assert.deepEqual(dateBox.option('value'), new Date(2015, 5, 10, 15, 54, 13), 'new datebox value saves set value time');
    });

    QUnit.test('calendar views should be positioned correctly', function(assert) {
        $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2015, 4, 12),
            opened: true
        });

        const $calendarViews = $('.dx-popup-wrapper .dx-calendar-views-wrapper .dx-widget');
        const viewWidth = $calendarViews.eq(0).width();

        assert.equal($calendarViews.eq(0).position().left, 0, 'main view is at 0');
        assert.equal($calendarViews.eq(1).position().left, -viewWidth, 'before view is at the left');
        assert.equal($calendarViews.eq(2).position().left, viewWidth, 'after view is at the right');
    });

    QUnit.test('Popup with calendar strategy should be use \'flipfit flip\' strategy', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(),
            deferRendering: true
        });

        $dateBox.dxDateBox('option', 'popupPosition', { my: 'bottom left' });

        $dateBox.dxDateBox('option', 'opened', true);

        const popup = $dateBox.find('.dx-popup').dxPopup('instance');

        assert.equal(popup.option('position').collision, 'flipfit flip', 'collision set correctly');
        assert.equal(popup.option('position').my, 'bottom left', 'position is saved');
    });

    QUnit.test('Popup with calendarWithTime strategy should be use \'flipfit flip\' strategy', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            pickerType: 'calendar',
            value: new Date(),
            opened: true
        });

        assert.equal($dateBox.find('.dx-popup').dxPopup('option', 'position').collision, 'flipfit flip', 'collision set correctly');
    });

    QUnit.test('DateBox should not take current date value at the opening if value is null', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: null,
            pickerType: 'calendar'
        });

        const instance = $dateBox.dxDateBox('instance');
        const $dropDownButton = $dateBox.find(`.${DROP_DOWN_BUTTON_CLASS}`);

        $($dropDownButton).trigger('dxclick');

        assert.equal(instance.option('value'), null, 'value shouldn\'t be dropped after opening');
    });

    QUnit.test('time component should not be changed if editing value with the help of keyboard (T398429)', function(assert) {
        this.reinitFixture({
            type: 'date',
            pickerType: 'calendar',
            value: new Date(2016, 6, 1, 14, 15),
            focusStateEnabled: true
        });

        keyboardMock(this.fixture.rootElement.find('.' + TEXTEDITOR_INPUT_CLASS))
            .focus()
            .caret(2)
            .press('del')
            .type('2')
            .change();

        const value = this.fixture.dateBox.option('value');
        assert.equal(value.getHours(), 14, 'the \'hours\' component has not been changed');
        assert.equal(value.getMinutes(), 15, 'the \'minutes\' component has not been changed');
    });

    QUnit.test('Calendar should have single selectionMode even if another selectionMode is passed to calendarOptions', function(assert) {
        this.reinitFixture({
            pickerType: 'calendar',
            opened: true,
            calendarOptions: {
                selectionMode: 'range',
            }
        });

        assert.strictEqual(this.fixture.dateBox.option('calendarOptions.selectionMode'), 'single');
    });
});

QUnit.module('datebox with time component', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('date box should contain calendar and time view inside box in large screen', function(assert) {
        const originalWidthFunction = implementationsMap.getWidth;

        try {
            sinon.stub(implementationsMap, 'getWidth').returns(600);

            const $element = $('#dateBox').dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                adaptivityEnabled: true,
                opened: true
            });

            const instance = $element.dxDateBox('instance');
            const $content = $(instance._popup.$content());
            const box = Box.getInstance($content.find('.' + BOX_CLASS));
            const $clock = $content.find('.dx-timeview-clock');

            assert.equal(box.option('direction'), 'row', 'correct box direction specified');
            assert.ok(box.itemElements().eq(0).find('.' + CALENDAR_CLASS).length, 'calendar rendered');
            assert.ok(box.itemElements().eq(1).find('.' + TIMEVIEW_CLASS).length, 'timeview rendered');
            assert.equal($clock.length, 1, 'clock was rendered');
        } finally {
            implementationsMap.getWidth = originalWidthFunction;
        }
    });

    QUnit.test('date box should contain calendar and time view inside box in small screen', function(assert) {
        const originalWidthFunction = implementationsMap.getWidth;

        try {
            sinon.stub(implementationsMap, 'getWidth').returns(300);

            const $element = $('#dateBox').dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                adaptivityEnabled: true,
                opened: true
            });

            const instance = $element.dxDateBox('instance');
            const $content = $(instance._popup.$content());
            const box = Box.getInstance($content.find('.' + BOX_CLASS));
            const $clock = $content.find('.dx-timeview-clock');

            assert.equal(box.option('direction'), 'row', 'correct box direction specified');
            assert.ok(box.itemElements().eq(0).find('.' + CALENDAR_CLASS).length, 'calendar rendered');
            assert.ok(box.itemElements().eq(0).find('.' + TIMEVIEW_CLASS).length, 'timeview rendered');
            assert.equal($clock.length, 0, 'clock was not rendered');
        } finally {
            implementationsMap.getWidth = originalWidthFunction;
        }
    });

    [true, false].forEach((adaptivityEnabledValue) => {
        QUnit.test(`date box should change behavior if adaptivityEnabled option is changed to ${adaptivityEnabledValue} at runtime`, function(assert) {
            const widthStub = sinon.stub(implementationsMap, 'getWidth').returns(300);

            try {
                const $element = $('#dateBox').dxDateBox({
                    type: 'datetime',
                    pickerType: 'calendar',
                    adaptivityEnabled: !adaptivityEnabledValue,
                    opened: true
                });
                const instance = $element.dxDateBox('instance');

                instance.option('adaptivityEnabled', adaptivityEnabledValue);
                instance.close();
                instance.open();

                const $content = $(instance._popup.$content());
                const box = Box.getInstance($content.find(`.${BOX_CLASS}`));
                const $clock = $content.find(`.${TIMEVIEW_CLOCK_CLASS}`);
                const timeViewExpectedMessage = `timeview is ${adaptivityEnabledValue ? '' : 'not'} rendered`;
                const clockExpectedMessage = `clock is ${adaptivityEnabledValue ? 'not' : ''} rendered`;

                assert.strictEqual(box.itemElements().eq(0).find(`.${TIMEVIEW_CLASS}`).length, (adaptivityEnabledValue ? 1 : 0), timeViewExpectedMessage);
                assert.strictEqual($clock.length, (adaptivityEnabledValue ? 0 : 1), clockExpectedMessage);
            } finally {
                widthStub.restore();
            }
        });
    });

    [true, false].forEach((showAnalogClockValue) => {
        const timeViewExpectedMessage = `timeview is ${showAnalogClockValue ? 'not' : ''} rendered`;
        const clockExpectedMessage = `clock is ${showAnalogClockValue ? '' : 'not'} rendered`;

        QUnit.test(`date box should ${showAnalogClockValue ? 'not' : ''} have compact view when showAnalogClock option is ${showAnalogClockValue}`, function(assert) {
            const $element = $('#dateBox').dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                showAnalogClock: showAnalogClockValue
            });

            const instance = $element.dxDateBox('instance');
            instance.open();

            const $content = $(instance._popup.$content());
            const box = Box.getInstance($content.find(`.${BOX_CLASS}`));
            const $clock = $content.find('.dx-timeview-clock');

            assert.strictEqual(box.option('direction'), 'row', 'correct box direction specified');
            assert.strictEqual(box.itemElements().eq(0).find(`.${CALENDAR_CLASS}`).length, 1, 'calendar rendered');
            assert.strictEqual(box.itemElements().eq(0).find(`.${TIMEVIEW_CLASS}`).length, (showAnalogClockValue ? 0 : 1), timeViewExpectedMessage);
            assert.strictEqual($clock.length, (showAnalogClockValue ? 1 : 0), clockExpectedMessage);
        });

        QUnit.test(`date box should change behavior if showAnalogClock option is changed to ${showAnalogClockValue} at runtime`, function(assert) {
            const $element = $('#dateBox').dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                showAnalogClock: !showAnalogClockValue,
                opened: true
            });
            const instance = $element.dxDateBox('instance');

            instance.option('showAnalogClock', showAnalogClockValue);
            instance.close();
            instance.open();

            const $content = $(instance._popup.$content());
            const box = Box.getInstance($content.find(`.${BOX_CLASS}`));
            const $clock = $content.find(`.${TIMEVIEW_CLOCK_CLASS}`);
            assert.strictEqual(box.itemElements().eq(0).find(`.${TIMEVIEW_CLASS}`).length, (showAnalogClockValue ? 0 : 1), timeViewExpectedMessage);
            assert.strictEqual($clock.length, (showAnalogClockValue ? 1 : 0), clockExpectedMessage);
        });
    });

    QUnit.test('date box wrapper adaptivity class depends on the screen size', function(assert) {
        const LARGE_SCREEN_SIZE = 2000;
        const SMALL_SCREEN_SIZE = 300;

        let stub = sinon.stub(implementationsMap, 'getWidth').returns(LARGE_SCREEN_SIZE);

        try {
            const instance = $('#dateBox').dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                adaptivityEnabled: true,
                opened: true
            }).dxDateBox('instance');

            assert.notOk(instance._popup.$wrapper().hasClass(DATEBOX_ADAPTIVITY_MODE_CLASS), 'there is no adaptivity class for the large screen');

            instance.close();

            stub.restore();
            stub = sinon.stub(implementationsMap, 'getWidth').returns(SMALL_SCREEN_SIZE);

            instance.open();
            assert.ok(instance._popup.$wrapper().hasClass(DATEBOX_ADAPTIVITY_MODE_CLASS), 'there is the adaptivity class for the small screen');
        } finally {
            stub.restore();
        }
    });

    QUnit.test('dateBox with datetime strategy should be rendered once on init', function(assert) {
        const contentReadyHandler = sinon.spy();

        $('#dateBox').dxDateBox({
            type: 'datetime',
            pickerType: 'calendar',
            onContentReady: contentReadyHandler
        }).dxDateBox('instance');

        assert.equal(contentReadyHandler.callCount, 1, 'contentReady has been called once');
    });

    QUnit.test('date box popup should have maximum 100% width', function(assert) {
        const currentDevice = sinon.stub(devices, 'current').returns({
            platform: 'generic',
            phone: true
        });

        const clock = sinon.useFakeTimers();
        try {
            const instance = $('#dateBox').dxDateBox({
                type: 'date',
                pickerType: 'rollers',
                opened: true
            }).dxDateBox('instance');

            assert.equal(instance._popup.option('maxWidth'), '100%', 'popup width should be correct on 320px screens');
            assert.equal(instance._popup.option('maxHeight'), '100%', 'popup height should be correct on 320px screens');
        } finally {
            clock.restore();
            currentDevice.restore();
        }
    });

    QUnit.test('buttons are rendered after \'type\' option was changed', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            pickerType: 'calendar',
            type: 'datetime',
            applyValueMode: 'useButtons'
        });

        const dateBox = $element.dxDateBox('instance');

        dateBox.open();

        let $buttons = $('.dx-datebox-wrapper .dx-toolbar .dx-button');

        assert.equal($buttons.length, 3, 'buttons are rendered');

        dateBox.option('type', 'date');
        dateBox.open();
        dateBox.option('type', 'datetime');
        dateBox.open();

        $buttons = $('.dx-datebox-wrapper .dx-toolbar .dx-button');
        assert.equal($buttons.length, 3, 'buttons are rendered after option was changed');
    });

    QUnit.test('DateBox should have time part when pickerType is rollers', function(assert) {
        const date = new Date(2015, 1, 1, 12, 13, 14);
        const dateBox = $('#dateBox').dxDateBox({
            pickerType: 'rollers',
            type: 'datetime',
            value: date
        }).dxDateBox('instance');

        const format = uiDateUtils.FORMATS_MAP['datetime'];
        const $input = $(dateBox.$element().find('.' + TEXTEDITOR_INPUT_CLASS));

        assert.equal($input.val(), dateLocalization.format(date, format), 'input value is correct');
    });

    QUnit.test('DateBox with pickerType=rollers should scroll to the neighbor item independent of deltaY when device is desktop (T921228)', function(assert) {
        const date = new Date(2015, 0, 1);
        $('#dateBox').dxDateBox({
            pickerType: 'rollers',
            value: date,
            opened: true
        });

        const $monthRollerView = $('.dx-dateviewroller-month');
        const monthRollerView = $monthRollerView.dxDateViewRoller('instance');
        const deltaY = 100;
        const pointer = pointerMock(monthRollerView.container());

        assert.strictEqual(monthRollerView.option('selectedIndex'), 0, 'selectedItem is correct');

        pointer.start().wheel(deltaY).wait(500);
        assert.strictEqual(monthRollerView.option('selectedIndex'), 0, 'selectedItem is correct');

        pointer.start().wheel(-deltaY).wait(500);
        assert.strictEqual(monthRollerView.option('selectedIndex'), 1, 'selectedItem is correct');

        pointer.start().wheel(-deltaY * 3).wait(500);
        assert.strictEqual(monthRollerView.option('selectedIndex'), 2, 'selectedItem is correct');

        pointer.start().wheel(deltaY * 5).wait(500);
        assert.strictEqual(monthRollerView.option('selectedIndex'), 1, 'selectedItem is correct');

        pointer.start().wheel(-deltaY * 10).wait(500);
        assert.strictEqual(monthRollerView.option('selectedIndex'), 2, 'selectedItem is correct');
    });

    QUnit.test('dateview selectedIndex should not be changed after dateBox reopen (T934663)', function(assert) {
        assert.expect(0);

        const clock = sinon.useFakeTimers();
        try {
            const date = new Date(2015, 3, 3);
            const dateBox = $('#dateBox').dxDateBox({
                pickerType: 'rollers',
                value: date,
                opened: true
            }).dxDateBox('instance');

            const selectedIndexChangedHandler = (args) => {
                assert.ok(false, 'selectedIndex has been changed');
            };

            const monthRollerView = $('.dx-dateviewroller-month').dxDateViewRoller('instance');
            const dayRollerView = $('.dx-dateviewroller-day').dxDateViewRoller('instance');
            const yearRollerView = $('.dx-dateviewroller-year').dxDateViewRoller('instance');
            monthRollerView.option('onSelectedIndexChanged', selectedIndexChangedHandler);
            dayRollerView.option('onSelectedIndexChanged', selectedIndexChangedHandler);
            yearRollerView.option('onSelectedIndexChanged', selectedIndexChangedHandler);

            dateBox.close();
            dateBox.open();
        } finally {
            clock.restore();
        }
    });

    QUnit.test('DateBox with time should be rendered correctly when templatesRenderAsynchronously=true', function(assert) {
        const clock = sinon.useFakeTimers();
        try {
            const dateBox = $('#dateBox').dxDateBox({
                type: 'datetime',
                pickerType: 'calendar',
                value: new Date(),
                templatesRenderAsynchronously: true
            }).dxDateBox('instance');

            dateBox.option('opened', true);
            clock.tick(10);

            const $content = $(dateBox._popup.$content());
            const $timeView = $content.find('.dx-timeview-clock');
            assert.ok($timeView.parent().width() > 100, 'Time view was rendered correctly');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('DateBox renders the right stylingMode for editors in time view overlay (default)', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            value: new Date('2015/1/25')
        }).dxDateBox('instance');

        dateBox.open();

        const hourEditor = $(`.${TIMEVIEW_CLASS} .${NUMBERBOX_CLASS}`).eq(0);
        const minuteEditor = $(`.${TIMEVIEW_CLASS} .${NUMBERBOX_CLASS}`).eq(1);
        const amPmEditor = $(`.${TIMEVIEW_CLASS} .${SELECTBOX_CLASS}`).eq(0);

        assert.ok(hourEditor.hasClass('dx-editor-outlined'));
        assert.ok(minuteEditor.hasClass('dx-editor-outlined'));
        assert.ok(amPmEditor.hasClass('dx-editor-outlined'));
    });

    QUnit.test('DateBox renders the right stylingMode for editors in time view overlay (custom)', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            value: new Date('2015/1/25'),
            stylingMode: 'underlined'
        }).dxDateBox('instance');

        dateBox.open();

        const hourEditor = $(`.${TIMEVIEW_CLASS} .${NUMBERBOX_CLASS}`).eq(0);
        const minuteEditor = $(`.${TIMEVIEW_CLASS} .${NUMBERBOX_CLASS}`).eq(1);
        const amPmEditor = $(`.${TIMEVIEW_CLASS} .${SELECTBOX_CLASS}`).eq(0);

        assert.ok(hourEditor.hasClass('dx-editor-underlined'));
        assert.ok(minuteEditor.hasClass('dx-editor-underlined'));
        assert.ok(amPmEditor.hasClass('dx-editor-underlined'));
    });

    QUnit.test('DateBox with timeview should have amPm popup inside of dateBox popup content (T1300566)', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            type: 'datetime',
            pickerType: 'calendar',
            opened: true,
            displayFormat: 'ddMMyy hh:mm',
        }).dxDateBox('instance');
        const amPmEditor = $(`.${TIMEVIEW_CLASS} .${SELECTBOX_CLASS}`).eq(0).dxSelectBox('instance');

        amPmEditor.open();

        const $dateBoxPopup = $(dateBox.content());
        const $amPmPopup = $(amPmEditor.content());

        assert.strictEqual($amPmPopup.closest($dateBoxPopup).length, 1, 'amPm popup is inside dateBox popup');
    });

    QUnit.test('Reset seconds and milliseconds when DateBox has no value for time view', function(assert) {
        const dateBox = $('#dateBox').dxDateBox({
            pickerType: 'list',
            type: 'time'
        }).dxDateBox('instance');

        dateBox.open();

        $('.dx-list-item').first().trigger('dxclick');

        assert.equal(dateBox.option('value').getSeconds(), 0, 'seconds has zero value');
        assert.equal(dateBox.option('value').getMilliseconds(), 0, 'milliseconds has zero value');
    });

    QUnit.module('value change', {
        beforeEach: function() {
            this.currentDateTime = new Date(2001, 1, 1, 1, 1, 0, 0);
            this.clock = sinon.useFakeTimers(this.currentDateTime.valueOf());

            this.date = new Date('2015/1/25');
            this.init = (options) => {
                this.$dateBox = $('#dateBox').dxDateBox($.extend({}, {
                    type: 'datetime',
                    value: this.date,
                    opened: true,
                    pickerType: 'calendar',
                }, options));
                this.dateBox = this.$dateBox.dxDateBox('instance');
                this.$input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
                this.$submitInput = this.$dateBox.find('input[type=hidden]');
                this.$content = $(this.dateBox.content());
                this.keyboard = keyboardMock(this.$input);
                this.timeView = this.$content
                    .find(`.${TIMEVIEW_CLASS}`)
                    .dxTimeView('instance');
                this.calendar = this.$content
                    .find(`.${CALENDAR_CLASS}`)
                    .dxCalendar('instance');

                this.$hourBox = this.$content.find(`.${NUMBERBOX_CLASS}`).eq(0);
                this.$hourBoxSpinDown = this.$hourBox.find(`.${NUMBERBOX_SPIN_DOWN_CLASS}`).eq(0);

                this.$minuteBox = this.$content.find(`.${NUMBERBOX_CLASS}`).eq(1);
                this.$minuteBoxSpinDown = this.$minuteBox.find(`.${NUMBERBOX_SPIN_DOWN_CLASS}`).eq(0);
            };
            this.reinit = (options = {}) => {
                this.dateBox.dispose();
                this.init(options);
            };
            this.clickApplyButton = () => {
                $(APPLY_BUTTON_SELECTOR).first().trigger('dxclick');
            };
            this.clickCalendarCell = () => {
                $(`.${CALENDAR_CELL_CLASS}`).first().trigger('dxclick');
            };

            this.init({});
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('dateBox should update time on enter pressing (T969012)', function(assert) {
            const expectedDate = new Date(this.date);
            expectedDate.setHours(11, 28);

            this.timeView.option('value', expectedDate);
            this.keyboard
                .focus()
                .press('enter');

            assert.deepEqual(this.dateBox.option('value'), expectedDate, 'dateBox value was updated');
        });

        QUnit.test('dateBox should update date and time on enter pressing after time value change using arrows', function(assert) {
            const time = new Date(this.date);
            time.setHours(11, 28);

            this.keyboard.press('up');
            this.timeView.option('value', time);
            this.keyboard
                .focus()
                .press('enter')
                .press('enter');

            const expectedDate = new Date(time);
            expectedDate.setDate(18);

            assert.deepEqual(this.dateBox.option('value'), expectedDate, 'dateBox value was updated');
        });

        QUnit.test('submit value should be updated after apply button click if internal validation is failed', function(assert) {
            const date = new Date(new Date('2015/1/25 13:00:00'));

            this.reinit({
                min: date,
                value: date
            });

            this.$hourBoxSpinDown.trigger('dxpointerdown');
            this.clickApplyButton();

            assert.notOk(this.dateBox.option('isValid'), 'editor is invalid');
            assert.strictEqual(this.$submitInput.val(), '2015-01-25T12:00:00', 'submit element has correct value');
        });

        QUnit.test('submit value should be updated after apply button click if external validation is failed', function(assert) {
            this.date = new Date('2015/1/25 13:00:00');
            this.reinit();
            this.$dateBox.dxValidator({
                validationRules: [{
                    type: 'custom',
                    reevaluate: true,
                    validationCallback: function(e) {
                        return false;
                    }
                }]
            });

            this.$hourBoxSpinDown.trigger('dxpointerdown');
            this.clickApplyButton();

            assert.notOk(this.dateBox.option('isValid'), 'editor is invalid');
            assert.strictEqual(this.$submitInput.val(), '2015-01-25T12:00:00', 'submit element has correct value');
        });

        QUnit.test('invalid (by internal validation) value should be displayed if it is selected by time numberboxes (T939117)', function(assert) {
            const date = new Date('2015/1/25 14:00:00');
            this.reinit({
                min: date,
                displayFormat: 'HH:mm',
                value: date
            });

            this.$hourBoxSpinDown.trigger('dxpointerdown');
            this.clickApplyButton();

            assert.strictEqual(this.$input.val(), '13:00', 'input displays a correct value');
            assert.strictEqual(this.dateBox.option('text'), '13:00', 'text is invalid');
            assert.notOk(this.dateBox.option('isValid'), 'widget is invalid');

            assert.deepEqual(this.dateBox.option('value'), new Date(date.setHours(13)), 'value does not changed');
        });

        QUnit.test('datebox value is bound to time view value', function(assert) {
            let date = new Date(2014, 2, 1, 14, 33);
            this.dateBox.option('value', date);
            assert.equal(this.timeView.option('value').getTime(), date.getTime(), 'timeView value is set');

            date = new Date(2014, 2, 1, 17, 47);
            this.timeView.option('value', date);

            this.clickApplyButton();

            assert.strictEqual(this.dateBox.option('value').toString(), date.toString(), 'dateBox value is set');
        });

        QUnit.test('time value should be updated after select date', function(assert) {
            this.calendar.option('value', new Date(2014, 2, 1, 11, 15));
            this.timeView.option('value', new Date(2014, 1, 1, 12, 16));

            this.clickApplyButton();

            const expectedValue = (new Date(2014, 2, 1, 12, 16)).toString();
            assert.strictEqual(this.dateBox.option('value').toString(), expectedValue, 'dateBox value is set');
        });

        QUnit.test('Reset seconds and milliseconds when DateBox has no value for datetime view', function(assert) {
            this.reinit({
                min: new Date('2015/1/25'),
                max: new Date('2015/2/10')
            });

            this.clickCalendarCell();
            this.clickApplyButton();

            assert.strictEqual(this.dateBox.option('value').getSeconds(), 0, 'seconds has zero value');
            assert.strictEqual(this.dateBox.option('value').getMilliseconds(), 0, 'milliseconds has zero value');
        });

        QUnit.test('time is reset when calendar value is changed (T208853)', function(assert) {
            this.date = new Date(2015, 1, 16, 11, 20);
            this.reinit();

            this.calendar.option('value', new Date(2014, 1, 16));
            this.clickApplyButton();

            assert.deepEqual(this.dateBox.option('value'), new Date(2014, 1, 16, 11, 20), 'date and time are correct');
        });

        ['instantly', 'useButtons'].forEach(applyValueMode => {
            QUnit.module(`the out of range value, applyValueMode: ${applyValueMode}`, {
                beforeEach: function() {
                    this.date = new Date('2015/1/25 14:00:00');
                    this.onValueChangedHandler = sinon.stub();

                    this.reinit({
                        type: 'datetime',
                        min: this.date,
                        max: this.date,
                        value: this.date,
                        applyValueMode,
                        useMaskBehavior: true,
                        onValueChanged: this.onValueChangedHandler
                    });
                },
                afterEach: function() {
                    this.onValueChangedHandler.reset();
                }
            }, () => {
                QUnit.test('valueChangeEvent should be called after change of datebox value', function(assert) {
                    this.dateBox.option('value', new Date('2015/1/25 13:00:00'));

                    assert.strictEqual(this.onValueChangedHandler.callCount, applyValueMode === 'instantly' ? 3 : 1, 'onValueChangedHandler.callCount');
                    assert.strictEqual(this.$input.val(), '1/25/2015, 1:00 PM', 'input displays a correct value');

                    const { text, isValid, value } = this.dateBox.option();
                    assert.strictEqual(text, '1/25/2015, 1:00 PM', 'text is right');
                    assert.strictEqual(isValid, false, 'widget is invalid');
                    assert.deepEqual(value, new Date(this.date.setHours(13)), 'value is changed correctly');
                });

                QUnit.test('valueChangeEvent should be called after change of hours by spin click', function(assert) {
                    this.$hourBoxSpinDown.trigger('dxpointerdown');
                    this.clickApplyButton();

                    assert.strictEqual(this.onValueChangedHandler.callCount, 1, 'onValueChangedHandler.callCount');
                    assert.strictEqual(this.$input.val(), '1/25/2015, 1:00 PM', 'input displays a correct value');

                    const { text, isValid, value } = this.dateBox.option();
                    assert.strictEqual(text, '1/25/2015, 1:00 PM', 'text is right');
                    assert.strictEqual(isValid, false, 'widget is invalid');
                    assert.deepEqual(value, new Date(this.date.setHours(13)), 'value is changed correctly');
                });

                QUnit.test('valueChangeEvent should be called after change of minutes by spin click', function(assert) {
                    this.$minuteBoxSpinDown.trigger('dxpointerdown');
                    this.clickApplyButton();

                    assert.strictEqual(this.onValueChangedHandler.callCount, 1, 'onValueChangedHandler.callCount');
                    assert.strictEqual(this.$input.val(), '1/25/2015, 2:59 PM', 'input displays a correct value');

                    const { text, isValid, value } = this.dateBox.option();
                    assert.strictEqual(text, '1/25/2015, 2:59 PM', 'text is right');
                    assert.strictEqual(isValid, false, 'widget is invalid');
                    assert.deepEqual(value, new Date(this.date.setMinutes(59)), 'value is changed correctly');
                });

                QUnit.test('valueChangeEvent should be called after input in hours', function(assert) {
                    const keyboard = keyboardMock(this.$hourBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));
                    keyboard
                        .focus()
                        .caret(this.$input.val().length - 3)
                        .press('backspace')
                        .press('backspace')
                        .type('13')
                        .change();

                    if(applyValueMode === 'useButtons') {
                        this.clickApplyButton();
                    }

                    assert.strictEqual(this.onValueChangedHandler.callCount, 1, 'onValueChangedHandler.callCount');
                    assert.strictEqual(this.$input.val(), '1/25/2015, 1:00 PM', 'input displays a correct value');

                    const { text, isValid, value } = this.dateBox.option();
                    assert.strictEqual(text, '1/25/2015, 1:00 PM', 'text is right');
                    assert.strictEqual(isValid, false, 'widget is invalid');
                    assert.deepEqual(value, new Date(this.date.setHours(13)), 'value is changed correctly');
                });

                QUnit.test('valueChangeEvent should be called after input in minutes', function(assert) {
                    const keyboard = keyboardMock(this.$minuteBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));
                    keyboard
                        .focus()
                        .caret(this.$input.val().length - 3)
                        .press('backspace')
                        .press('backspace')
                        .type('59')
                        .change();

                    if(applyValueMode === 'useButtons') {
                        this.clickApplyButton();
                    }

                    assert.strictEqual(this.onValueChangedHandler.callCount, 1, 'onValueChangedHandler.callCount');
                    assert.strictEqual(this.$input.val(), '1/25/2015, 2:59 PM', 'input displays a correct value');

                    const { text, isValid, value } = this.dateBox.option();
                    assert.strictEqual(text, '1/25/2015, 2:59 PM', 'text is right');
                    assert.strictEqual(isValid, false, 'widget is invalid');
                    assert.deepEqual(value, new Date(this.date.setMinutes(59)), 'value is changed correctly');
                });
            });
        });

        QUnit.module('partial datetime selecting when value=null', {
            beforeEach: function() {
                this.reinit({
                    value: null
                });
            }
        }, () => {
            QUnit.test('updated value time should be equal to current time if only date is selected (T231015)', function(assert) {
                const newDateTime = new Date(2002, 2, 2, 1, 1, 0, 0);

                this.calendar.option('value', new Date(2002, 2, 2, 14, 17, 22, 34)); // updates only date
                this.clickApplyButton();

                assert.strictEqual(this.dateBox.option('value').getTime(), newDateTime.getTime(), 'value is correct if only calendar value is changed');
            });

            QUnit.test('updated value time should be equal to selected time if only time is selected (T231015)', function(assert) {
                const newDateTime = new Date(2001, 1, 1, 2, 2, 0, 0);

                this.timeView.option('value', new Date(2002, 2, 2, 2, 2)); // updated only time
                this.clickApplyButton();

                assert.strictEqual(this.dateBox.option('value').getTime(), newDateTime.getTime(), 'value is correct if only timeView value is changed');
            });

            QUnit.test('updated value should have date and time equal to current date and time after apply button click if value is null (T253298)', function(assert) {
                this.clickApplyButton();

                assert.strictEqual(this.dateBox.option('value').getDate(), this.currentDateTime.getDate(), 'value date is correct');
                assert.strictEqual(this.dateBox.option('value').getTime(), this.currentDateTime.getTime(), 'value time is correct');
            });

            QUnit.test('updated value should have date equal to calendar controured date after apply button click if value is null (T1039021)', function(assert) {
                const minDate = new Date(2050, 10, 10);
                this.reinit({
                    value: null,
                    min: minDate
                });

                this.clickApplyButton();

                const expectedDateTime = new Date(minDate);
                expectedDateTime.setHours(this.currentDateTime.getHours(), this.currentDateTime.getMinutes());

                assert.strictEqual(this.dateBox.option('value').getDate(), expectedDateTime.getDate(), 'value date is correct');
                assert.strictEqual(this.dateBox.option('value').getTime(), expectedDateTime.getTime(), 'value time is correct');
            });
        });
    });
});

QUnit.module('datebox w/ time list', {
    before: function() {
        this.checkForIncorrectKeyWarning = function(assert) {
            const isIncorrectKeyWarning = logger.warn.lastCall.args[0].indexOf('W1002') > -1;
            assert.ok(logger.warn.calledOnce);
            assert.ok(isIncorrectKeyWarning);
        };
    },
    beforeEach: function() {
        fx.off = true;

        this.$dateBox = $('#dateBox');

        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: 'list',
                type: 'time'
            })
            .dxDateBox('instance');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('rendered markup', function(assert) {
        this.dateBox.option('opened', true);
        assert.ok($(DATEBOX_LIST_POPUP_SELECTOR).length, 'Popup has dx-timebox-popup-wrapper class');
    });

    QUnit.test('rendered popup markup', function(assert) {
        this.dateBox.option('opened', true);

        assert.ok(this.dateBox._popup, 'popup exist');
    });

    QUnit.test('rendered list markup', function(assert) {
        this.dateBox.option('opened', true);

        assert.ok(getInstanceWidget(this.dateBox), 'list exist');
        assert.ok(getInstanceWidget(this.dateBox).$element().hasClass(LIST_CLASS), 'list initialized');
    });

    QUnit.test('list should contain correct values if min/max does not specified', function(assert) {
        this.dateBox.option({
            min: null,
            max: null
        });

        this.dateBox.option('opened', true);

        const $timeList = $(`.${LIST_CLASS}`);
        const $listItems = $timeList.find('.dx-list-item-content');

        assert.equal($listItems.first().text(), '12:00 AM', 'min value is right');
        assert.equal($listItems.last().text(), '11:30 PM', 'max value is right');
    });

    QUnit.test('list should contain all correct values when min/max options are defined (T869203)', function(assert) {
        this.dateBox.option({
            min: new Date(2015, 11, 1, 5, 45),
            max: new Date(2015, 11, 1, 6, 15),
            interval: 15
        });

        this.dateBox.option('opened', true);

        const $timeList = $(`.${LIST_CLASS}`);
        const $listItems = $timeList.find('.dx-list-item-content');

        assert.strictEqual($listItems.first().text(), '5:45 AM', 'min value is right');
        assert.strictEqual($listItems.last().text(), '6:15 AM', 'max value is right');
        assert.strictEqual($listItems.length, 3, 'list items count is correct');
    });

    QUnit.test('min/max option test', function(assert) {
        this.dateBox.option({
            min: new Date(2008, 7, 8, 4, 0),
            max: new Date(2008, 7, 8, 8, 59)
        });

        this.dateBox.option('opened', true);

        const $timeList = $(`.${LIST_CLASS}`);
        const $listItems = $timeList.find('.dx-list-item-content');

        assert.equal($listItems.first().text(), '4:00 AM', 'min value is right');
        assert.equal($listItems.last().text(), '8:30 AM', 'max value is right');
    });

    QUnit.test('min/max overflow test', function(assert) {
        this.dateBox.option({
            min: new Date(2008, 7, 8, 4, 0),
            max: new Date(2008, 7, 9, 9, 0)
        });

        this.dateBox.option('opened', true);

        const $timeList = $(`.${LIST_CLASS}`);
        const $listItems = $timeList.find('.dx-list-item-content');

        assert.strictEqual($listItems.first().text(), '4:00 AM', 'min value is right');
        assert.strictEqual($listItems.last().text(), '4:00 AM', 'max value is right');
    });

    QUnit.test('interval option', function(assert) {
        this.dateBox.option({
            min: new Date(2008, 7, 8, 4, 0),
            value: new Date(2008, 7, 8, 5, 0),
            max: new Date(2008, 7, 8, 6, 0),
            interval: 60
        });

        this.dateBox.option('opened', true);

        let $timeList = $(`.${LIST_CLASS}`);
        let items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.strictEqual(items.length, 3, 'interval option works');

        this.dateBox.option('interval', 120);
        this.dateBox.option('opened', true);

        $timeList = $(`.${LIST_CLASS}`);
        items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.strictEqual(items.length, 2, 'interval option works');
    });

    QUnit.test('T240639 - correct list item should be highlighted if appropriate datebox value is set', function(assert) {
        sinon.stub(logger, 'warn');
        try {
            this.dateBox.option({
                type: 'time',
                pickerType: 'list',
                value: new Date(0, 0, 0, 12, 30),
                opened: true
            });

            const list = this.dateBox._strategy._widget;

            assert.deepEqual(list.option('selectedIndex'), 25, 'selectedIndex item is correct');
            assert.deepEqual(list.option('selectedItem'), new Date(0, 0, 0, 12, 30), 'selected list item is correct');

            this.dateBox.option('value', new Date(2016, 1, 1, 12, 20));

            this.checkForIncorrectKeyWarning(assert);
            assert.equal(list.option('selectedIndex'), -1, 'there is no selected list item');
            assert.equal(list.option('selectedItem'), null, 'there is no selected list item');
        } finally {
            logger.warn.restore();
        }
    });

    QUnit.test('T351678 - the date is reset after item click', function(assert) {
        this.dateBox.option({
            type: 'time',
            pickerType: 'list',
            value: new Date(2020, 4, 13, 12, 17),
            opened: true
        });

        const $list = $(this.dateBox._strategy._widget.$element());
        $($list.find('.dx-list-item').eq(3)).trigger('dxclick');

        assert.deepEqual(this.dateBox.option('value'), new Date(2020, 4, 13, 1, 30), 'date is correct');
    });

    QUnit.test('the date should be in range after the selection', function(assert) {
        this.dateBox.option({
            type: 'time',
            pickerType: 'list',
            min: new Date(2016, 10, 5, 12, 0, 0),
            max: new Date(2016, 10, 5, 14, 0, 0),
            opened: true
        });

        const $item = $(this.dateBox.content()).find('.dx-list-item').eq(0);

        $item.trigger('dxclick');

        assert.deepEqual(this.dateBox.option('value'), new Date(2016, 10, 5, 12, 0, 0), 'date is correct');
    });

    QUnit.test('list should have items if the \'min\' option is specified (T395529)', function(assert) {
        this.dateBox.option({
            min: new Date(new Date(null).setHours(15)),
            opened: true
        });

        const list = $(`.${LIST_CLASS}`).dxList('instance');
        assert.ok(list.option('items').length > 0, 'list is not empty');
    });

    QUnit.test('selected date should be in 1970 when it was set from the null value', function(assert) {
        this.dateBox.option({
            opened: true,
            value: null
        });

        const $item = $(this.dateBox.content()).find('.dx-list-item').eq(0);
        $item.trigger('dxclick');

        assert.strictEqual(this.dateBox.option('value').getFullYear(), new Date(null).getFullYear(), 'year is correct');
    });

    QUnit.test('selected date should be in value year when value is specified', function(assert) {
        this.dateBox.option({
            opened: true,
            value: new Date(2018, 5, 6, 14, 12)
        });

        const $item = $(this.dateBox.content()).find('.dx-list-item').eq(0);
        $item.trigger('dxclick');

        assert.strictEqual(this.dateBox.option('value').getFullYear(), 2018, 'year is correct');
    });

    QUnit.test('selected date should be in 1970 when it was set from user\'s input', function(assert) {
        this.dateBox.option({
            value: null,
            displayFormat: 'HH:mm'
        });

        keyboardMock(this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`))
            .focus()
            .type('11:11')
            .change();

        assert.strictEqual(this.dateBox.option('value').getFullYear(), new Date(null).getFullYear(), 'year is correct');
    });

    QUnit.test('the value\'s date part should not be changed if editing input\'s text by keyboard (T395685)', function(assert) {
        this.dateBox.option({
            focusStateEnabled: true,
            value: new Date(2016, 5, 25, 14, 22)
        });

        const $input = this.$dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        keyboardMock($input)
            .focus()
            .caret($input.val().length - 3)
            .press('backspace')
            .press('backspace')
            .type('44')
            .change();

        assert.deepEqual(this.dateBox.option('value'), new Date(2016, 5, 25, 14, 44), 'value is correct');
    });

    QUnit.test('List of items should be refreshed after value is changed', function(assert) {
        this.dateBox.option({
            min: new Date(2016, 1, 1, 10, 0),
            value: new Date(2016, 1, 2, 14, 45),
            interval: 60,
            opened: true
        });

        const $timeList = $(`.${LIST_CLASS}`);
        let items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 24, '24 items should be find');

        this.dateBox.option('value', new Date(2016, 1, 1));

        items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 14, '14 items should be find from min to finish of day');
    });

    QUnit.test('All items in list should be present if value and min options are belong to different days', function(assert) {
        const clock = sinon.useFakeTimers();
        sinon.stub(logger, 'warn');
        try {
            this.dateBox.option({
                min: new Date(2016, 1, 1, 13, 45),
                value: new Date(2016, 1, 1, 14, 45),
                interval: 60,
                opened: true
            });

            const $timeList = $(`.${LIST_CLASS}`);
            let items = $timeList.find(LIST_ITEM_SELECTOR);

            assert.equal(items.length, 11, 'interval option works');

            this.dateBox.option('value', new Date(2016, 1, 2, 13, 45));

            items = $timeList.find(LIST_ITEM_SELECTOR);

            this.checkForIncorrectKeyWarning(assert);
            assert.equal(items.length, 24, 'interval is correct');
            assert.equal(items.eq(0).text(), '12:45 AM', 'start time is correct');
        } finally {
            clock.restore();
            logger.warn.restore();
        }
    });

    QUnit.test('The situation when value and max options are belong to one day', function(assert) {
        this.dateBox.option({
            value: new Date(2016, 1, 1, 13, 45),
            max: new Date(2016, 1, 1, 15, 0),
            interval: 60,
            opened: true
        });

        const $timeList = $(`.${LIST_CLASS}`);
        const items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.strictEqual(items.length, 16, 'list should be contain right count of items');
    });

    QUnit.test('value and max are belong to one day', function(assert) {
        this.dateBox.option({
            min: new Date(2016, 1, 1, 0, 11),
            value: new Date(2016, 1, 3, 14, 45),
            max: new Date(2016, 1, 3, 18, 22),
            interval: 60,
            opened: true
        });

        const $timeList = $(`.${LIST_CLASS}`);
        const items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.length, 19, 'list should be contain right count of items');
        assert.equal(items.eq(0).text(), '12:11 AM', 'first item in list is correct');
        assert.equal(items.eq(items.length - 1).text(), '6:11 PM', 'last item in list is correct');
    });

    QUnit.test('List items should be started with minimal possible value', function(assert) {
        this.dateBox.option({
            min: new Date(2016, 1, 1, 0, 17),
            value: new Date(2016, 1, 3, 14, 45),
            interval: 15,
            opened: true
        });

        const $timeList = $(`.${LIST_CLASS}`);
        const items = $timeList.find(LIST_ITEM_SELECTOR);

        assert.equal(items.eq(0).text(), '12:02 AM', 'first item in list is correct');
        assert.equal(items.eq(items.length - 1).text(), '11:47 PM', 'last item in list is correct');
    });

    QUnit.test('dxDateBox with list strategy automatically scrolls to selected item on opening', function(assert) {
        this.dateBox.option({
            value: new Date(2016, 1, 3, 14, 45),
            interval: 15,
            opened: true
        });

        this.dateBox.option('opened', true);

        const $popupContent = $('.dx-popup-content');
        const $selectedItem = $popupContent.find('.' + LIST_ITEM_SELECTED_CLASS);

        assert.ok($popupContent.offset().top + $popupContent.height() > $selectedItem.offset().top, 'selected item is visible');
    });

    QUnit.test('min/max settings should be work if value option is null', function(assert) {
        this.dateBox.option({
            value: null,
            min: new Date(2008, 7, 8, 8, 0),
            max: new Date(2008, 7, 8, 20, 0)
        });

        this.dateBox.option('opened', true);

        const $timeList = $(`.${LIST_CLASS}`);
        const $listItems = $timeList.find('.dx-list-item-content');

        assert.strictEqual($listItems.first().text(), '8:00 AM', 'min value is right');
        assert.strictEqual($listItems.last().text(), '8:00 PM', 'max value is right');
    });

    QUnit.test('min/max settings should be work if value option is undefined', function(assert) {
        this.dateBox.option({
            value: undefined,
            min: new Date(2008, 7, 8, 8, 0),
            max: new Date(2008, 7, 8, 20, 0)
        });

        this.dateBox.option('opened', true);

        const $timeList = $(`.${LIST_CLASS}`);
        const $listItems = $timeList.find('.dx-list-item-content');

        assert.strictEqual($listItems.first().text(), '8:00 AM', 'min value is right');
        assert.strictEqual($listItems.last().text(), '8:00 PM', 'max value is right');
    });

    QUnit.test('validator correctly check value with \'time\' format', function(assert) {
        sinon.stub(logger, 'warn');
        try {
            const $dateBox = $('#dateBox').dxDateBox({
                type: 'time',
                pickerType: 'list',
                min: new Date(2015, 1, 1, 6, 0),
                max: new Date(2015, 1, 1, 16, 0),
                value: new Date(2015, 1, 1, 12, 0),
                opened: true
            });

            const dateBox = $dateBox.dxDateBox('instance');
            const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);

            $input.val('11:30 AM').change();

            const value = dateBox.option('value');
            this.checkForIncorrectKeyWarning(assert);
            assert.equal($input.val(), '11:30 AM', 'Correct input value');
            assert.equal(value.getHours(), 11, 'Correct hours');
            assert.equal(value.getMinutes(), 30, 'Correct minutes');
            assert.equal(dateBox.option('isValid'), true, 'Editor should be marked as valid');
        } finally {
            logger.warn.restore();
        }
    });

    QUnit.testInActiveWindow('select a new value via the Enter key', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            type: 'time',
            value: new Date(2018, 2, 2, 12, 0, 13),
            pickerType: 'list'
        });

        const dateBox = $dateBox.dxDateBox('instance');
        const $input = $dateBox.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $input.focusin();
        this.dateBox.option('opened', true);
        keyboard
            .keyDown('down')
            .keyDown('down')
            .keyDown('enter');

        const value = dateBox.option('value');
        assert.equal($input.val(), '1:00 PM', 'Correct input value');
        assert.equal(value.getHours(), 13, 'Correct hours');
        assert.equal(value.getMinutes(), 0, 'Correct minutes');
    });

    QUnit.test('items are rendered when value is \'undefined\' (T805931)', function(assert) {
        this.dateBox.option({
            value: undefined
        });

        this.dateBox.option('opened', true);

        const $timeListItems = $('.dx-list .dx-list-item');
        assert.ok($timeListItems.length > 0);
    });

    QUnit.test('should works correctly with serialized dates (T854579)', function(assert) {
        this.dateBox.option({
            opened: true,
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx',
        });
        const $input = $(this.dateBox.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $items = $(this.dateBox.content()).find(LIST_ITEM_SELECTOR);

        $items.eq(1).trigger('dxclick');
        assert.strictEqual($input.val(), $items.eq(1).text(), 'time is applied');

        this.dateBox.open();
        $items.eq(3).trigger('dxclick');
        assert.strictEqual($input.val(), $items.eq(3).text(), 'new time is applied');
    });

    QUnit.module('applyValueMode = useButtons', {
        beforeEach: function() {
            this.date = new Date(2020, 1, 1);
            this.dateBox.option({
                value: this.date,
                opened: true,
                applyValueMode: 'useButtons'
            });
            this.$items = $(this.dateBox.content()).find(LIST_ITEM_SELECTOR);
            this.$firstItem = this.$items.eq(1);
        }
    }, () => {
        QUnit.test('should not close popup on list item click', function(assert) {
            this.$firstItem.trigger('dxclick');

            assert.ok(this.dateBox.option('opened'), 'dateBox is still opened');
        });

        QUnit.test('should not instantly select value on list item click (T1005111)', function(assert) {
            this.$firstItem.trigger('dxclick');

            assert.deepEqual(this.dateBox.option('value'), this.date, 'item is not selected');
        });

        QUnit.test('should not raise validation error on "Ok" button click without item selecting (T1005111)', function(assert) {
            $(APPLY_BUTTON_SELECTOR).trigger('dxclick');

            assert.ok(this.dateBox.option('isValid'), 'dateBox is still valid');
        });

        QUnit.test('should update value on "Ok" button click', function(assert) {
            const expectedDate = new Date(this.date);
            expectedDate.setHours(0, 30);
            this.$firstItem.trigger('dxclick');
            $(APPLY_BUTTON_SELECTOR).trigger('dxclick');

            assert.deepEqual(this.dateBox.option('value'), expectedDate, 'value is updated');
        });

        QUnit.test('should not update value on "Cancel" button click', function(assert) {
            this.$firstItem.trigger('dxclick');
            $(CANCEL_BUTTON_SELECTOR).trigger('dxclick');

            assert.deepEqual(this.dateBox.option('value'), this.date, 'value is not updated');
        });

        QUnit.testInActiveWindow('should not close on "tab" press', function(assert) {
            const $input = this.$dateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            const keyboard = keyboardMock($input);

            keyboard
                .focus()
                .keyDown('tab');

            assert.ok(this.dateBox.option('opened'), 'dateBox is still opened');
        });
    });
});


QUnit.module('width of datebox with list', {
    beforeEach: function() {
        fx.off = true;

        this.$dateBox = $('#dateBox');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.module('overlay content real width', () => {
        QUnit.test('should be equal to the editor width when dropDownOptions.width in not defined', function(assert) {
            this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'list',
                type: 'time'
            }).dxDateBox('instance');

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), this.$dateBox.outerWidth(), 'popup width is correct');
        });

        QUnit.test('should be equal to the editor width when dropDownOptions.width in not defined after editor width runtime change', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'list',
                type: 'time'
            }).dxDateBox('instance');

            dateBox.option('width', 153);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), this.$dateBox.outerWidth(), 'popup width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width if it\'s defined (T897820)', function(assert) {
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    width: 500
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), 500, 'overlay content width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width even after editor input width change (T897820)', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    width: 500
                },
                opened: true
            }).dxDateBox('instance');

            dateBox.option('width', 300);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), 500, 'overlay content width is correct');
        });

        QUnit.test('should be equal to wrapper width if dropDownOptions.width is set to auto (T897820)', function(assert) {
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    width: 'auto'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth(), 'overlay content width is correct');
        });

        QUnit.test('should be equal to wrapper width if dropDownOptions.width is set to 100%', function(assert) {
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    width: '100%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth(), 'overlay content width is correct');
        });

        QUnit.test('should be calculated relative to wrapper when dropDownOptions.width is percent (T897820)', function(assert) {
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    width: '50%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth() / 2, 0.1, 'overlay content width is correct');
        });

        QUnit.test('should be calculated relative to wrapper after editor width runtime change', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                width: 600,
                dropDownOptions: {
                    width: '50%'
                },
                opened: true
            }).dxDateBox('instance');

            dateBox.option('width', 700);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth() / 2, 0.1, 'overlay content width is correct');
        });

        QUnit.test('should be equal to editor input width even when dropDownOptions.container is defined (T938497)', function(assert) {
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    container: $('#containerWithWidth')
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);

            assert.strictEqual($overlayContent.outerWidth(), this.$dateBox.outerWidth(), 'width is correct');
        });
    });

    QUnit.test('dropDownOptions.width should be passed to popup', function(assert) {
        this.$dateBox.dxDateBox({
            type: 'time',
            pickerType: 'list',
            dropDownOptions: {
                width: 500
            },
            opened: true
        });

        const popup = this.$dateBox.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('width'), 500, 'popup width option value is correct');
    });

    QUnit.test('popup should have width equal to dropDownOptions.width even after editor input width change (T897820)', function(assert) {
        const dateBox = this.$dateBox.dxDateBox({
            type: 'time',
            pickerType: 'list',
            dropDownOptions: {
                width: 500
            },
            opened: true
        }).dxDateBox('instance');

        dateBox.option('width', 300);

        const popup = this.$dateBox.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('width'), 500, 'popup width option value is correct');
    });
});

QUnit.module('height of datebox with list', {
    beforeEach: function() {
        fx.off = true;

        this.$dateBox = $('#dateBox');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.module('overlay content height', () => {
        QUnit.test('should be equal to 0.45 * window height when dropDownOptions.height in not defined and list hight is bigger than 0.45 of window height', function(assert) {
            this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'list',
                type: 'time'
            }).dxDateBox('instance');

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.roughEqual($overlayContent.outerHeight(), 0.45 * $(window).outerHeight(), 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be equal to 0.45 * window height when dropDownOptions.height in set to auto and list hight is bigger than 0.45 of window height', function(assert) {
            this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'list',
                type: 'time',
                dropDownOptions: {
                    height: 'auto'
                }
            }).dxDateBox('instance');

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.roughEqual($overlayContent.outerHeight(), 0.45 * $(window).outerHeight(), 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be equal to 0.45 * window height when dropDownOptions.height in not defined after editor height runtime change', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'list',
                type: 'time'
            }).dxDateBox('instance');

            dateBox.option('height', 153);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.roughEqual($overlayContent.outerHeight(), 0.45 * $(window).outerHeight(), 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be equal to list height when dropDownOptions.height in not defined and content list is smaller than 0.45 of window height', function(assert) {
            this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'list',
                type: 'time',
                min: Date.now(),
                max: Date.now(),
            }).dxDateBox('instance');

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $list = $(`.${LIST_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), $list.outerHeight(), 'overlay content height is correct');
        });

        QUnit.test('should be equal to list height when dropDownOptions.height in set to auto and content list is smaller than 0.45 of window height', function(assert) {
            this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'list',
                type: 'time',
                min: Date.now(),
                max: Date.now(),
                dropDownOptions: {
                    height: 'auto'
                }
            }).dxDateBox('instance');

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $list = $(`.${LIST_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), $list.outerHeight(), 'overlay content height is correct');
        });

        QUnit.test('should be equal to dropDownOptions.height if it is defined', function(assert) {
            const dropDownOptionsHeight = 200;
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    height: dropDownOptionsHeight
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), dropDownOptionsHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to dropDownOptions.height even after editor input height change', function(assert) {
            const dropDownOptionsHeight = 500;
            const dateBox = this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    height: dropDownOptionsHeight
                },
                opened: true
            }).dxDateBox('instance');

            dateBox.option('height', 300);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), dropDownOptionsHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to wrapper height if dropDownOptions.height is set to 100%', function(assert) {
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    height: '100%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.strictEqual($overlayContent.outerHeight(), $overlayWrapper.outerHeight(), 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to wrapper when dropDownOptions.height is percent', function(assert) {
            this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                dropDownOptions: {
                    height: '50%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerHeight(), $overlayWrapper.outerHeight() / 2, 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to wrapper after editor height runtime change', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                type: 'time',
                pickerType: 'list',
                height: 600,
                dropDownOptions: {
                    height: '50%'
                },
                opened: true
            }).dxDateBox('instance');

            dateBox.option('height', 700);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerHeight(), $overlayWrapper.outerHeight() / 2, 0.1, 'overlay content height is correct');
        });
    });

    QUnit.test('dropDownOptions.height should be passed to popup', function(assert) {
        const dropDownOptionsHeight = 500;
        this.$dateBox.dxDateBox({
            type: 'time',
            pickerType: 'list',
            dropDownOptions: {
                height: dropDownOptionsHeight
            },
            opened: true
        });

        const popup = this.$dateBox.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('height'), dropDownOptionsHeight, 'popup height option value is correct');
    });

    QUnit.test('popup should have height equal to dropDownOptions.height even after editor input height change', function(assert) {
        const dropDownOptionsHeight = 500;
        const dateBox = this.$dateBox.dxDateBox({
            type: 'time',
            pickerType: 'list',
            dropDownOptions: {
                height: dropDownOptionsHeight
            },
            opened: true
        }).dxDateBox('instance');

        dateBox.option('height', 300);

        const popup = this.$dateBox.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('height'), dropDownOptionsHeight, 'popup height option value is correct');
    });
});

QUnit.module('width of datebox with calendar', {
    beforeEach: function() {
        fx.off = true;

        this.$dateBox = $('#dateBox');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.module('overlay content width', () => {
        QUnit.test('should be equal to the calendar width + margins when dropDownOptions.width in not defined', function(assert) {
            this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'calendar'
            }).dxDateBox('instance');

            const $calendar = $(`.${CALENDAR_CLASS}`);
            const paddingsWidth = parseInt($calendar.css('margin-left')) * 2;
            const calendarWidth = $calendar.outerWidth() + paddingsWidth;

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.width(), calendarWidth, 'popup width is correct');
        });

        QUnit.test('should be equal to the calendar width + margins when dropDownOptions.width in not defined after editor width runtime change', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                opened: true,
                pickerType: 'calendar'
            }).dxDateBox('instance');

            const $calendar = $(`.${CALENDAR_CLASS}`);
            const paddingsWidth = parseInt($calendar.css('margin-left')) * 2;
            const calendarWidth = $calendar.outerWidth() + paddingsWidth;

            dateBox.option('width', 153);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.width(), calendarWidth, 'popup width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width if it\'s defined', function(assert) {
            this.$dateBox.dxDateBox({
                pickerType: 'calendar',
                dropDownOptions: {
                    width: 500
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), 500, 'overlay content width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width even after editor input width change', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                pickerType: 'calendar',
                dropDownOptions: {
                    width: 500
                },
                opened: true
            }).dxDateBox('instance');

            dateBox.option('width', 300);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), 500, 'overlay content width is correct');
        });

        QUnit.test('should be equal to calendar width + margins if dropDownOptions.width is set to auto', function(assert) {
            this.$dateBox.dxDateBox({
                pickerType: 'calendar',
                dropDownOptions: {
                    width: 'auto'
                },
                opened: true
            });

            const $calendar = $(`.${CALENDAR_CLASS}`);
            const paddingsWidth = parseInt($calendar.css('margin-left')) * 2;
            const calendarWidth = $calendar.outerWidth() + paddingsWidth;

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual($overlayContent.width(), calendarWidth, 'overlay content width is correct');
        });

        QUnit.test('should be equal to wrapper width if dropDownOptions.width is set to 100%', function(assert) {
            this.$dateBox.dxDateBox({
                pickerType: 'calendar',
                dropDownOptions: {
                    width: '100%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.strictEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth(), 'overlay content width is correct');
        });

        QUnit.test('should be calculated relative to wrapper when dropDownOptions.width is percent', function(assert) {
            this.$dateBox.dxDateBox({
                pickerType: 'calendar',
                dropDownOptions: {
                    width: '50%'
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth() / 2, 0.1, 'overlay content width is correct');
        });

        QUnit.test('should be calculated relative to wrapper after editor width runtime change', function(assert) {
            const dateBox = this.$dateBox.dxDateBox({
                pickerType: 'calendar',
                width: 600,
                dropDownOptions: {
                    width: '50%'
                },
                opened: true
            }).dxDateBox('instance');

            dateBox.option('width', 700);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual($overlayContent.outerWidth(), $overlayWrapper.outerWidth() / 2, 0.1, 'overlay content width is correct');
        });

        QUnit.test('should be equal to calendar width + margins even when dropDownOptions.container is defined', function(assert) {
            this.$dateBox.dxDateBox({
                pickerType: 'calendar',
                dropDownOptions: {
                    container: $('#containerWithWidth')
                },
                opened: true
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $calendar = $(`.${CALENDAR_CLASS}`);
            const paddingsWidth = parseInt($calendar.css('margin-left')) * 2;
            const calendarWidth = $calendar.outerWidth() + paddingsWidth;

            assert.strictEqual($overlayContent.width(), calendarWidth, 'width is correct');
        });
    });

    QUnit.test('dropDownOptions.width should be passed to popup', function(assert) {
        this.$dateBox.dxDateBox({
            pickerType: 'calendar',
            dropDownOptions: {
                width: 500
            },
            opened: true
        });

        const popup = this.$dateBox.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('width'), 500, 'popup width option value is correct');
    });

    QUnit.test('popup should have width equal to dropDownOptions.width even after editor input width change (T897820)', function(assert) {
        const dateBox = this.$dateBox.dxDateBox({
            pickerType: 'calendar',
            dropDownOptions: {
                width: 500
            },
            opened: true
        }).dxDateBox('instance');

        dateBox.option('width', 300);

        const popup = this.$dateBox.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('width'), 500, 'popup width option value is correct');
    });
});
