import $ from 'jquery';
import { isObject } from 'core/utils/type.js';
import fx from 'common/core/animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import Popup from 'ui/popup/ui.popup';
import 'ui/date_range_box';

QUnit.testStart(() => {
    const markup =
        '<div id="dateRangeBox"></div>';

    $('#qunit-fixture').html(markup);
});

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const getEndDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getEndDateBox();


const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options) => {
            this.$element = $('#dateRangeBox').dxDateRangeBox(options);
            this.instance = this.$element.dxDateRangeBox('instance');

            this.$startDateBox = $(this.instance.getStartDateBox().element());
            this.$endDateBox = $(this.instance.getEndDateBox().element());
            this.$startDateInput = $(this.instance.startDateField());
            this.$endDateInput = $(this.instance.endDateField());

            this.getPopupContent = () => $(this.instance.content());
            this.getCalendar = () => this.instance.getStartDateBox()._strategy._widget;
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({
            value: ['2023/01/05', '2023/02/14'],
            multiView: true,
        });
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Option synchronization', moduleConfig, () => {
    QUnit.test('StartDate option should get first item from value option on init', function(assert) {
        const { value, startDate } = this.instance.option();

        assert.strictEqual(startDate, value[0]);
    });

    QUnit.test('EndDate option should get second item from value option on init', function(assert) {
        const { value, endDate } = this.instance.option();

        assert.strictEqual(endDate, value[1]);
    });

    QUnit.test('Value option should get values from startDate/endDate options on init', function(assert) {
        const startDate = '2023/01/01';
        const endDate = '2023/02/02';

        this.reinit({
            startDate, endDate
        });

        const { value } = this.instance.option();

        assert.strictEqual(value[0], startDate);
        assert.strictEqual(value[1], endDate);
    });

    QUnit.test('Value should have higher priority if value option and startDate/endDate options are defined on init', function(assert) {
        const startDate = '2023/01/01';
        const endDate = '2023/02/02';
        const value = ['2024/01/01', '2024/02/02'];

        this.reinit({
            startDate, endDate, value
        });

        assert.deepEqual(this.instance.option('value'), value, 'value is not changed');
        assert.strictEqual(this.instance.option('startDate'), value[0], 'startDate got date from value');
        assert.strictEqual(this.instance.option('endDate'), value[1]), 'endDate got date from value';
    });

    QUnit.test('StartDate option should update value option on runtime change', function(assert) {
        const startDate = '2023/01/05';

        this.instance.option('startDate', startDate);

        assert.strictEqual(this.instance.option('value')[0], startDate);
    });

    QUnit.test('EndDate option should update value option on runtime change', function(assert) {
        const endDate = '2023/01/15';

        this.instance.option('endDate', endDate);

        assert.strictEqual(this.instance.option('value')[1], endDate);
    });

    QUnit.test('Value option should update startDate option on runtime change', function(assert) {
        const value = ['2023/01/07', '2023/02/07'];

        this.instance.option('value', value);

        assert.strictEqual(this.instance.option('startDate'), value[0]);
    });

    QUnit.test('value option should update endDate option on runtime change', function(assert) {
        const value = ['2023/01/07', '2023/02/07'];

        this.instance.option('value', value);

        assert.strictEqual(this.instance.option('endDate'), value[1]);
    });

    QUnit.test('StartDateBox opened option value should be change after change DateRangeBox option value', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        this.instance.option('opened', true);

        assert.strictEqual(startDateBox.option('opened'), true, 'startDateBox option was changed');
        assert.strictEqual(endDateBox.option('opened'), true, 'endDateBox option was not changed');

        this.instance.option('opened', false);

        assert.strictEqual(startDateBox.option('opened'), false, 'startDateBox option was changed');
        assert.strictEqual(endDateBox.option('opened'), false, 'endDateBox option was not changed');
    });

    QUnit.test('DateRangeBox startDateLabel, endDateLabel options should be passed in label option of startDateBox and endDateBox respectively', function(assert) {
        const customStartDateLabel = 'Start Date Label';
        const customEndDateLabel = 'End Date Label';

        this.reinit({
            startDateLabel: customStartDateLabel,
            endDateLabel: customEndDateLabel,
        });
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        assert.strictEqual(startDateBox.option('label'), customStartDateLabel, 'startDateBox label option has correct value');
        assert.strictEqual(endDateBox.option('label'), customEndDateLabel, 'endDateBox label option has correct value');
    });

    QUnit.test('startDateBox label should be changed after change startDateLabel option value of dateRangeBox in runtime', function(assert) {
        this.reinit({});

        this.instance.option('startDateLabel', 'text');

        assert.strictEqual(this.instance.getStartDateBox().option('label'), 'text', 'startDateBox label option value has been changed');
    });

    QUnit.test('endDateBox label should be changed after change endDateLabel option value of dateRangeBox in runtime', function(assert) {
        this.reinit({});

        this.instance.option('endDateLabel', 'text');

        assert.strictEqual(this.instance.getEndDateBox().option('label'), 'text', 'endDateLabel label option value has been changed');
    });

    QUnit.test('startDateBox placeholder should be changed after change startDatePlaceholder option value of dateRangeBox in runtime', function(assert) {
        this.reinit({});

        this.instance.option('startDatePlaceholder', 'text');

        assert.strictEqual(this.instance.getStartDateBox().option('placeholder'), 'text', 'startDateBox placeholder option value has been changed');
    });

    QUnit.test('endDateBox placeholder should be changed after change endDatePlaceholder option value of dateRangeBox in runtime', function(assert) {
        this.reinit({});

        this.instance.option('endDatePlaceholder', 'text');

        assert.strictEqual(this.instance.getEndDateBox().option('placeholder'), 'text', 'endDateBox placeholder option value has been changed');
    });

    QUnit.test('DateRangeBox "startDateInputAttr", "endDateInputAttr" option values should be passed in "inputAttr" option of startDateBox and endDateBox after change in runtime respectively', function(assert) {
        this.reinit({});

        this.instance.option({
            startDateInputAttr: { id: 'startDateInput' },
            endDateInputAttr: { id: 'endDateInput' }
        });

        assert.deepEqual(this.instance.getStartDateBox().option('inputAttr'), { id: 'startDateInput' }, 'startDateBox inputAttr option has correct value');
        assert.deepEqual(this.instance.getEndDateBox().option('inputAttr'), { id: 'endDateInput' }, 'endDateBox inputAttr option has correct value');
    });

    QUnit.test('DateRangeBox "startDateName", "endDateName" option values should be passed in "name" option of startDateBox and endDateBox after change in runtime respectively', function(assert) {
        this.reinit({});

        this.instance.option({
            startDateName: 'start_input',
            endDateName: 'end_input',
        });

        assert.strictEqual(this.instance.getStartDateBox().option('name'), 'start_input', 'startDateBox name option has correct value');
        assert.strictEqual(this.instance.getEndDateBox().option('name'), 'end_input', 'endDateBox name option has correct value');
    });

    QUnit.test('CalendarOptions should be passed to startDateBox on init', function(assert) {
        this.reinit({
            calendarOptions: {
                showWeekNumbers: true,
            }
        });

        const startDateBox = getStartDateBoxInstance(this.instance);

        assert.strictEqual(startDateBox.option('calendarOptions.showWeekNumbers'), true);
    });

    QUnit.test('CalendarOptions should be passed to startDateBox on runtime change', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        this.instance.option('calendarOptions', { showWeekNumbers: true });

        assert.strictEqual(startDateBox.option('calendarOptions.showWeekNumbers'), true);
    });

    QUnit.test('CalendarOptions field should be correctly passed to startDateBox on runtime change', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        this.instance.option('calendarOptions.showWeekNumbers', true);

        const calendarOptions = startDateBox.option('calendarOptions');

        assert.ok(isObject(calendarOptions), 'option is object');
        assert.strictEqual(calendarOptions.showWeekNumbers, true);
    });

    QUnit.test('DropDownOptions should be passed to startDateBox on init', function(assert) {
        this.reinit({
            dropDownOptions: {
                width: 800,
            }
        });

        const startDateBox = getStartDateBoxInstance(this.instance);

        assert.strictEqual(startDateBox.option('dropDownOptions.width'), 800);
    });

    QUnit.test('DropDownOptions should be passed to startDateBox on runtime change', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        this.instance.option('dropDownOptions', { width: 800 });

        assert.strictEqual(startDateBox.option('dropDownOptions.width'), 800);
    });

    QUnit.test('DropDownOptions field should be correctly passed to startDateBox on runtime change', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        this.instance.option('dropDownOptions.hideOnOutsideClick', false);

        const dropDownOptions = startDateBox.option('dropDownOptions');

        assert.ok(isObject(dropDownOptions), 'option is object');
        assert.strictEqual(dropDownOptions.hideOnOutsideClick, false);
    });

    [
        {
            optionName: 'applyValueMode',
            optionValue: 'useButtons'
        }, {
            optionName: 'applyButtonText',
            optionValue: 'apply'
        }, {
            optionName: 'cancelButtonText',
            optionValue: 'abort'
        }, {
            optionName: 'todayButtonText',
            optionValue: 'now'
        },
        // NOTE: disabledDates are not published now. Use calendarOptions.disabledDates
        // {
        //     optionName: 'disabledDates',
        //     optionValue: [new Date('2023/04/27'), new Date('2023/04/28')]
        // }
    ].forEach(({ optionName, optionValue }) => {
        QUnit.test(`${optionName} should be passed to startDateBox on init`, function(assert) {
            this.reinit({
                [optionName]: optionValue
            });

            const startDateBox = getStartDateBoxInstance(this.instance);

            assert.deepEqual(startDateBox.option(optionName), optionValue);
        });

        QUnit.test(`${optionName} should be passed to startDateBox on runtime change`, function(assert) {
            const startDateBox = getStartDateBoxInstance(this.instance);

            this.instance.option(optionName, optionValue);

            assert.deepEqual(startDateBox.option(optionName), optionValue);
        });
    });

    [
        {
            optionName: 'isValid',
            optionValue: false
        }
    ].forEach(({ optionName, optionValue }) => {
        QUnit.test(`${optionName} should be passed to endDateBox on init`, function(assert) {
            this.reinit({
                [optionName]: optionValue
            });

            const endDateBox = getEndDateBoxInstance(this.instance);

            assert.deepEqual(endDateBox.option(optionName), optionValue);
        });

        QUnit.test(`${optionName} should be passed to endDateBox on runtime change`, function(assert) {
            const endDateBox = getEndDateBoxInstance(this.instance);

            this.instance.option(optionName, optionValue);

            assert.deepEqual(endDateBox.option(optionName), optionValue);
        });
    });

    [
        {
            optionName: 'dateSerializationFormat',
            optionValue: 'yyyy-MM-dd',
        }, {
            optionName: 'isValid',
            optionValue: false,
        }, {
            optionName: 'height',
            optionValue: 200,
        }, {
            optionName: 'useMaskBehavior',
            optionValue: true,
        }, {
            optionName: 'valueChangeEvent',
            optionValue: 'keyDown',
        }, {
            optionName: 'min',
            optionValue: new Date('2023/03/01'),
        }, {
            optionName: 'max',
            optionValue: new Date('2023/06/30'),
        }, {
            optionName: 'spellcheck',
            optionValue: true,
        }, {
            optionName: 'pickerType',
            optionValue: 'native'
        }, {
            optionName: 'acceptCustomValue',
            optionValue: false
        }, {
            optionName: 'rtlEnabled',
            optionValue: true
        }, {
            optionName: 'displayFormat',
            optionValue: 'EEEE, d of MMM, yyyy'
        },
        {
            optionName: 'labelMode',
            optionValue: 'floating'
        },
        {
            optionName: 'openOnFieldClick',
            optionValue: false,
        },
        {
            optionName: 'focusStateEnabled',
            optionValue: false,
        },
        {
            optionName: 'activeStateEnabled',
            optionValue: false,
        },
        {
            optionName: 'hoverStateEnabled',
            optionValue: false,
        },
        {
            optionName: 'tabIndex',
            optionValue: 1,
        },
        {
            optionName: 'disabled',
            optionValue: false,
        }
    ].forEach(({ optionName, optionValue }) => {
        QUnit.test(`${optionName} should be passed to startDateBox and endDateBox on init`, function(assert) {
            this.reinit({
                [optionName]: optionValue
            });

            assert.strictEqual(this.instance.getStartDateBox().option(optionName), optionValue);
            assert.strictEqual(this.instance.getEndDateBox().option(optionName), optionValue);
        });

        QUnit.test(`${optionName} should be passed to startDateBox and endDateBox on runtime change`, function(assert) {
            this.instance.option(optionName, optionValue);

            assert.strictEqual(this.instance.getStartDateBox().option(optionName), optionValue);
            assert.strictEqual(this.instance.getEndDateBox().option(optionName), optionValue);
        });
    });

    ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
        QUnit.test(`onValueChanged should have correct event on change value in ${dateBoxName}`, function(assert) {
            const onValueChangedHandler = sinon.stub();

            this.reinit({
                value: ['2023/02/23', '2023/03/24'],
                valueChangeEvent: 'change',
                onValueChanged: onValueChangedHandler,
            });

            const dateBox = dateBoxName === 'startDateBox'
                ? getStartDateBoxInstance(this.instance)
                : getEndDateBoxInstance(this.instance);

            const $input = $(dateBox.field());
            const keyboard = keyboardMock($input);

            keyboard
                .caret({ start: 0, end: 1 })
                .type('1')
                .change();

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'handler has been called once');
            assert.strictEqual(onValueChangedHandler.getCall(0).args[0].event.type, 'change', 'event is correct');

            this.instance.option('value', [new Date(2021, 9, 17), new Date(2021, 9, 19)]);
            assert.strictEqual(onValueChangedHandler.callCount, 2, 'handler has been called twice');
            assert.strictEqual(onValueChangedHandler.getCall(1).args[0].event, undefined, 'event has been cleared');
        });

        QUnit.test(`value should change on keyup in ${dateBoxName} if valueChangeEvent is set to keyup on init`, function(assert) {
            assert.expect(1);

            this.reinit({
                value: ['2023/02/23', '2023/03/24'],
                valueChangeEvent: 'keyup',
                onValueChanged: () => {
                    assert.ok(true);
                }
            });

            const dateBox = dateBoxName === 'startDateBox'
                ? getStartDateBoxInstance(this.instance)
                : getEndDateBoxInstance(this.instance);

            const $input = $(dateBox.field());
            const keyboard = keyboardMock($input);

            keyboard
                .caret({ start: 0, end: 1 })
                .type('1');
        });

        QUnit.test(`value should change on keyup in ${dateBoxName} if valueChangeEvent is set to keyup on runtime`, function(assert) {
            assert.expect(1);

            this.reinit({
                value: ['2023/02/23', '2023/03/24'],
                onValueChanged: () => {
                    assert.ok(true);
                }
            });
            this.instance.option('valueChangeEvent', 'keyup');

            const dateBox = dateBoxName === 'startDateBox'
                ? getStartDateBoxInstance(this.instance)
                : getEndDateBoxInstance(this.instance);

            const $input = $(dateBox.field());
            const keyboard = keyboardMock($input);

            keyboard
                .caret({ start: 0, end: 1 })
                .type('1');
        });

        QUnit.test('DateBoxes pickerType should be "calendar" if initial DateRangeBox pickerType is not "calendar" or "native"', function(assert) {
            this.reinit({
                pickerType: 'rollers'
            });

            assert.strictEqual(this.instance.getStartDateBox().option('pickerType'), 'calendar');
            assert.strictEqual(this.instance.getEndDateBox().option('pickerType'), 'calendar');
        });

        QUnit.test('DateBoxes pickerType should be "calendar" if DateRangeBox pickerType is not "calendar" or "native" on runtime change', function(assert) {
            this.instance.option('pickerType', 'rollers');

            assert.strictEqual(this.instance.getStartDateBox().option('pickerType'), 'calendar');
            assert.strictEqual(this.instance.getEndDateBox().option('pickerType'), 'calendar');
        });

        QUnit.test('DateRangeBox startDateText and endDateText options should return text option of dateboxes correctly', function(assert) {
            this.reinit({
                value: ['2021/09/17', '2021/09/24'],
            });

            assert.deepEqual(new Date(this.instance.option('startDateText')), new Date('2021/09/17'));
            assert.deepEqual(new Date(this.instance.option('endDateText')), new Date('2021/09/24'));
            assert.strictEqual(this.instance.option('startDateText'), this.instance.getStartDateBox().option('text'));
            assert.strictEqual(this.instance.option('endDateText'), this.instance.getEndDateBox().option('text'));
        });

        QUnit.test('DateRangeBox startDateText and endDateText options should return text option of dateboxes correctly after change value in runtime', function(assert) {
            this.reinit({});

            this.instance.option('value', ['2021/09/17', '2021/09/24']),

            assert.deepEqual(new Date(this.instance.option('startDateText')), new Date('2021/09/17'));
            assert.deepEqual(new Date(this.instance.option('endDateText')), new Date('2021/09/24'));
            assert.strictEqual(this.instance.option('startDateText'), this.instance.getStartDateBox().option('text'));
            assert.strictEqual(this.instance.option('endDateText'), this.instance.getEndDateBox().option('text'));
        });
    });

    QUnit.test('StartDateBox & EndDateBox popups should not be rendered by default', function(assert) {
        assert.strictEqual(this.instance.getStartDateBox()._popup, undefined, 'startDateBox popup is not rendered by default');
        assert.strictEqual(this.instance.getEndDateBox()._popup, undefined, 'endDateBox popup is not rendered by default');
    });

    QUnit.test('Only startDateBox should be rendered if deferRendering is false', function(assert) {
        this.reinit({
            deferRendering: false,
        });

        assert.strictEqual(this.instance.getStartDateBox()._popup instanceof Popup, true, 'startDateBox popup is rendered');
        assert.strictEqual(this.instance.getEndDateBox()._popup, undefined, 'endDateBox popup is not rendered');
    });

    QUnit.test('Only startDateBox should be rendered if deferRendering was changed in runtime', function(assert) {
        this.reinit({});

        assert.strictEqual(this.instance.getStartDateBox()._popup, undefined, 'startDateBox popup is not rendered by default');
        assert.strictEqual(this.instance.getEndDateBox()._popup, undefined, 'endDateBox popup is not rendered by default');

        this.instance.option('deferRendering', false);

        assert.strictEqual(this.instance.getStartDateBox()._popup instanceof Popup, true, 'startDateBox popup is rendered');
        assert.strictEqual(this.instance.getEndDateBox()._popup, undefined, 'endDateBox popup is not rendered');
    });

    QUnit.test('disabledDates argument should have component parameter with DateRangeBox instance if disabledDates are set as function', function(assert) {
        const disabledDates = sinon.stub();

        this.reinit({
            disabledDates,
            opened: true
        });

        const componentField = disabledDates.lastCall.args[0].component;
        assert.strictEqual(componentField.NAME, 'dxDateRangeBox', 'Correct component');
    });
});

QUnit.module('calendarOptions', moduleConfig, () => {
    // NOTE: commented props are restricted in docs: value is passed from DateRangeBox.
    const calendarOptions = {
        accessKey: 'b',
        activeStateEnabled: false,
        cellTemplate: () => {},
        // dateSerializationFormat: 'yyyy-MM-dd',
        disabled: true,
        disabledDates: () => {},
        elementAttr: {},
        firstDayOfWeek: 5,
        focusStateEnabled: false,
        height: 500,
        hint: 'hint',
        hoverStateEnabled: false,
        isValid: false,
        // max: new Date('5/5/2023'),
        maxZoomLevel: 'year',
        // min: new Date('5/5/2023'),
        minZoomLevel: 'year',
        name: 'name',
        onDisposing: () => {},
        onInitialized: () => {},
        onOptionChanged: () => {},
        // onValueChanged: () => {},
        readOnly: true,
        rtlEnabled: true,
        showTodayButton: true,
        showWeekNumbers: true,
        // tabIndex: 1,
        validationError: {},
        validationErrors: [{}],
        validationMessageMode: 'always',
        validationMessagePosition: 'top',
        validationStatus: 'pending',
        // value: [null, null],
        visible: false,
        weekNumberRule: 'fullWeek',
        width: 500,
        zoomLevel: 'year',
    };

    Object.entries(calendarOptions).forEach(([ name, value ]) => {
        QUnit.test(`calendarOptions.${name} should be passed to the calendar on init`, function(assert) {
            this.reinit({
                deferRendering: false,
                [`calendarOptions.${name}`]: value
            });

            const calendar = this.getCalendar();

            assert.deepEqual(calendar.option(name), value);
        });

        QUnit.test(`calendarOptions.${name} should be passed to the calendar on runtime change`, function(assert) {
            this.instance.option({
                deferRendering: false,
                [`calendarOptions.${name}`]: value
            });

            const calendar = this.getCalendar();

            assert.deepEqual(calendar.option(name), value);
        });
    });

    QUnit.test('disabledDates should be passed to calendarOptions from dateRangeBox options when disabledDates option is array', function(assert) {
        const dates = [new Date('07/1/2018')];
        this.reinit({
            deferRendering: false,
            disabledDates: dates,
        });

        const calendar = this.getCalendar();

        assert.deepEqual(calendar.option('disabledDates'), dates);
    });

    QUnit.test('disabledDates should be passed to calendarOptions from dateRangeBox options when disabledDates option is array and option changed at runtime', function(assert) {
        const dates = [new Date('07/1/2018')];
        this.reinit({
            deferRendering: false,
        });

        this.instance.option('disabledDates', dates);

        const calendar = this.getCalendar();

        assert.deepEqual(calendar.option('disabledDates'), dates);
    });
});

