import $ from 'jquery';
import config from 'core/config';
import DateRangeBox from 'ui/date_range_box';
import DateBox from 'ui/date_box';
import { isRenderer } from 'core/utils/type';
import fx from 'animation/fx';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="dateRangeBox"></div><div id="dateRangeBox2"></div>';

    $('#qunit-fixture').html(markup);
});

const WIDGET_CLASS = 'dx-widget';
const BUTTON_CLASS = 'dx-button';
const DROP_DOWN_EDITOR_BUTTON_CLASS = 'dx-dropdowneditor-button';
const DROP_DOWN_EDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const getEndDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getEndDateBox();

const getButtonsContainers = $element => $element.find(`> .${DROP_DOWN_EDITOR_BUTTONS_CONTAINER_CLASS}`);
const getButtons = $element => $element.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options) => {
            this.$element = $('#dateRangeBox').dxDateRangeBox(options);
            this.instance = this.$element.dxDateRangeBox('instance');
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({
            value: ['2023/01/05', '2023/02/14']
        });
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('DateRangeBox Initialization', moduleConfig, () => {
    QUnit.test('DateRangeBox is created', function(assert) {
        assert.ok(this.instance instanceof DateRangeBox);
    });

    QUnit.test('StartDateBox is created', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        assert.ok(startDateBox instanceof DateBox);
    });

    QUnit.test('EndDateBox is created', function(assert) {
        const endDateBox = getEndDateBoxInstance(this.instance);

        assert.ok(endDateBox instanceof DateBox);
    });

    QUnit.test('StartDateBox should have first value from DateRangeBox', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const startDateBoxValue = startDateBox.option('value');
        const dateRangeBoxValue = this.instance.option('value');

        assert.strictEqual(startDateBoxValue, dateRangeBoxValue[0]);
    });

    QUnit.test('EndDateBox should have second value from DateRangeBox', function(assert) {
        const endDateBox = getEndDateBoxInstance(this.instance);
        const endDateBoxValue = endDateBox.option('value');
        const dateRangeBoxValue = this.instance.option('value');

        assert.strictEqual(endDateBoxValue, dateRangeBoxValue[1]);
    });

    QUnit.test('StartDateBox & endDateBox inputs should have the same default value of tabIndex attribute', function(assert) {
        this.reinit({});

        assert.strictEqual($(this.instance.getStartDateBox().field()).attr('tabIndex'), '0', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.getEndDateBox().field()).attr('tabIndex'), '0', 'endDateBox input tabIndex value');
    });

    QUnit.module('Default options (temporary module)', () => {
        QUnit.test('DateRangeBox has expected defaults', function(assert) {
            this.reinit({});

            const expectedOptions = {
                acceptCustomValue: true,
                activeStateEnabled: true,
                applyButtonText: 'OK',
                applyValueMode: 'useButtons',
                buttons: undefined,
                calendarOptions: {},
                cancelButtonText: 'Cancel',
                dateSerializationFormat: undefined,
                disabledDates: null,
                displayFormat: null,
                dropDownOptions: {},
                dropDownButtonTemplate: 'dropDownButton',
                endDate: null,
                focusStateEnabled: true,
                height: undefined,
                hoverStateEnabled: true,
                isValid: true,
                startDateLabel: 'Start Date',
                endDateLabel: 'End Date',
                startDatePlaceholder: '',
                endDatePlaceholder: '',
                labelMode: 'static',
                max: undefined,
                maxLength: null,
                min: undefined,
                opened: false,
                openOnFieldClick: false,
                readOnly: false,
                rtlEnabled: false,
                showClearButton: false,
                showDropDownButton: true,
                spellcheck: false,
                startDate: null,
                stylingMode: 'outlined',
                text: '',
                useMaskBehavior: false,
                validationError: null,
                validationErrors: null,
                validationMessageMode: 'auto',
                validationMessagePosition: 'auto',
                validationStatus: 'valid',
                value: [null, null],
                valueChangeEvent: 'change',
                width: undefined,
                tabIndex: 0,
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(this.instance.option(key), value, `${key} default value is correct`);
            });
        });

        const expectedDateBoxOptions = {
            acceptCustomValue: true,
            activeStateEnabled: false,
            applyValueMode: 'useButtons',
            displayFormat: null,
            elementAttr: {},
            focusStateEnabled: true,
            hoverStateEnabled: false,
            isValid: true,
            label: '',
            labelMode: 'static',
            max: undefined,
            maxLength: null,
            min: undefined,
            placeholder: '',
            readOnly: false,
            rtlEnabled: false,
            spellcheck: false,
            stylingMode: 'underlined',
            useMaskBehavior: false,
            validationMessageMode: 'auto',
            validationMessagePosition: 'auto',
            validationStatus: 'valid',
            valueChangeEvent: 'change',
            tabIndex: 0,
        };

        QUnit.test('StartDateBox has expected defaults', function(assert) {
            this.reinit({});

            const expectedOptions = {
                ...expectedDateBoxOptions,
                applyButtonText: 'OK',
                calendarOptions: {},
                cancelButtonText: 'Cancel',
                disabledDates: null,
                opened: false,
                showClearButton: false,
                showDropDownButton: false,
            };
            const startDateBox = getStartDateBoxInstance(this.instance);

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, startDateBox.option(key), `${key} default value is correct`);
            });
        });

        QUnit.test('EndDateBox has expected defaults', function(assert) {
            this.reinit({});

            const expectedOptions = {
                ...expectedDateBoxOptions,
                showClearButton: false,
            };
            const endDateBox = getEndDateBoxInstance(this.instance);

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, endDateBox.option(key), `${key} default value is correct`);
            });
        });
    });

    QUnit.module('DateBox\'s option dependency from DateRangeBox options ', () => {
        const initialDateRangeBoxOptions = {
            showClearButton: true,
            showDropDownButton: true,
            buttons: ['dropDown'],
            // TODO: extend this list of options
        };

        QUnit.test('StartDateBox has expected settings', function(assert) {
            this.reinit(initialDateRangeBoxOptions);

            const expectedOptions = {
                showClearButton: true,
                showDropDownButton: false,
                buttons: undefined,
            };
            const startDateBox = getStartDateBoxInstance(this.instance);

            Object.entries(initialDateRangeBoxOptions).forEach(([key]) => {
                assert.deepEqual(expectedOptions[key], startDateBox.option(key), `${key} value is correct`);
            });
        });

        QUnit.test('EndDateBox has expected settings', function(assert) {
            this.reinit(initialDateRangeBoxOptions);

            const expectedOptions = {
                showClearButton: true,
                showDropDownButton: false,
                buttons: undefined,
            };
            const endDateBox = getEndDateBoxInstance(this.instance);

            Object.entries(initialDateRangeBoxOptions).forEach(([key]) => {
                assert.deepEqual(expectedOptions[key], endDateBox.option(key), `${key} value is correct`);
            });
        });
    });
});

QUnit.module('DropDownButton', moduleConfig, () => {
    QUnit.test('Drop down button should be rendered if showDropDownButton is true', function(assert) {
        this.reinit({
            showDropDownButton: true
        });

        assert.strictEqual(getButtons(this.$element).length, 1, 'drop down button was rendered');
    });

    QUnit.test('Drop down button should not be rendered if showDropDownButton is false', function(assert) {
        this.reinit({
            showDropDownButton: false
        });

        assert.strictEqual(getButtons(this.$element).length, 0, 'drop down button was not rendered');
    });

    QUnit.test('Drop down button should not be rendered if buttons is [] and showDropDownButton is true', function(assert) {
        this.reinit({
            showDropDownButton: true,
            buttons: []
        });

        assert.strictEqual(getButtons(this.$element).length, 0, 'drop down button was not rendered');
    });

    QUnit.test('Drop down button should not be rendered if buttons is ["dropDown"] and showDropDownButton is false', function(assert) {
        this.reinit({
            showDropDownButton: false,
            buttons: ['dropDown']
        });

        assert.strictEqual(getButtons(this.$element).length, 0, 'drop down button was not rendered');
    });

    QUnit.test('Drop down button should be rendered if buttons option is changed in runtime', function(assert) {
        this.reinit({
            showDropDownButton: true,
            buttons: []
        });

        this.instance.option('buttons', ['dropDown']);

        assert.strictEqual(getButtons(this.$element).length, 1, 'drop down button was rendered');
    });

    QUnit.test('Drop down button should be rendered if showDropDownButton option is changed in runtime', function(assert) {
        this.reinit({
            showDropDownButton: false,
        });

        this.instance.option('showDropDownButton', true);

        assert.strictEqual(getButtons(this.$element).length, 1, 'drop down button was rendered');
    });

    QUnit.test('Drop down button should be rendered if buttons is ["dropDown"]', function(assert) {
        this.reinit({
            buttons: ['dropDown']
        });

        assert.strictEqual(getButtons(this.$element).length, 1, 'drop down button was rendered');
    });

    QUnit.test('Drop down button template should be rendered correctly', function(assert) {
        const buttonTemplate = function(buttonData, contentElement) {
            assert.strictEqual(isRenderer(contentElement), !!config().useJQuery, 'contentElement is correct');

            return '<div>Template</div>';
        };

        this.reinit({
            dropDownButtonTemplate: buttonTemplate
        });

        assert.strictEqual(getButtons(this.$element).text(), 'Template', 'template was rendered');
    });

    QUnit.test('Drop down button template should be changed correctly in runtime', function(assert) {
        const buttonTemplate = function(buttonData, contentElement) {
            assert.strictEqual(isRenderer(contentElement), !!config().useJQuery, 'contentElement is correct');

            return '<div>Template</div>';
        };

        this.instance.option('dropDownButtonTemplate', buttonTemplate);

        assert.strictEqual(getButtons(this.$element).text(), 'Template', 'template was rendered');
    });

    QUnit.test('render custom action button in after section in right order, drop down button first', function(assert) {
        this.reinit({
            buttons: ['dropDown', {
                name: 'home',
                location: 'after',
                options: {
                    icon: 'home',
                    elementAttr: {
                        class: 'custom-button'
                    }
                },
            }]
        });

        const $buttonsContainer = getButtonsContainers(this.$element);

        assert.strictEqual($buttonsContainer.length, 1, 'one buttons container was rendered');

        const $buttons = $buttonsContainer.find(`.${WIDGET_CLASS}`);
        assert.strictEqual($buttons.length, 2, 'two items was rendered');
        assert.strictEqual($buttons.eq(0).hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS), true, 'drop down button was rendered in right order');
        assert.strictEqual($buttons.eq(1).hasClass('custom-button'), true, 'custom button was rendered in right order');
    });

    QUnit.test('render custom action button in after section in right order, custom button first ', function(assert) {
        this.reinit({
            buttons: [{
                name: 'home',
                location: 'after',
                options: {
                    icon: 'home',
                    elementAttr: {
                        class: 'custom-button'
                    }
                },
            }, 'dropDown']
        });

        const $buttonsContainer = getButtonsContainers(this.$element);

        assert.strictEqual($buttonsContainer.length, 1, 'one buttons container was rendered');

        const $buttons = $buttonsContainer.find(`.${WIDGET_CLASS}`);
        assert.strictEqual($buttons.length, 2, 'two items was rendered');
        assert.strictEqual($buttons.eq(0).hasClass('custom-button'), true, 'custom button was rendered in right order');
        assert.strictEqual($buttons.eq(1).hasClass(DROP_DOWN_EDITOR_BUTTON_CLASS), true, 'drop down button was rendered in right order');
    });

    QUnit.test('render custom action button in before section', function(assert) {
        this.reinit({
            buttons: [{
                name: 'home',
                location: 'before',
                options: {
                    icon: 'home',
                    elementAttr: {
                        class: 'custom-button'
                    }
                },
            }, 'dropDown']
        });

        const $buttonsContainers = getButtonsContainers(this.$element);

        assert.strictEqual($buttonsContainers.length, 2, 'two buttons containers were rendered');

        const $beforeSectionButton = $buttonsContainers.eq(0).find(`.${WIDGET_CLASS}`);
        assert.strictEqual($beforeSectionButton.length, 1, 'one button was rendered in before section');
        assert.strictEqual($beforeSectionButton.eq(0).hasClass('custom-button'), true, 'custom button was rendered in right order');

        assert.strictEqual(getButtons($buttonsContainers.eq(1)).length, 1, 'drop down button was rendered in after section');
    });

    QUnit.test('getButton("dropDown") method should return instance of default drop down button', function(assert) {
        this.reinit({});

        assert.deepEqual(this.instance.getButton('dropDown'), getButtons(this.$element).dxButton('instance'));
    });

    QUnit.test('getButton(name) method should return instance of custom action button by passed name', function(assert) {
        this.reinit({
            name: 'home',
            location: 'before',
            options: {
                icon: 'home',
                elementAttr: {
                    class: 'custom-button'
                }
            },
        });

        const $homeButton = getButtonsContainers(this.$element).find(`.${BUTTON_CLASS}`);

        assert.deepEqual(this.instance.getButton('home'), $homeButton.dxButton('instance'));
    });

    QUnit.test('Popup of startDateBox should be opened by click on drop down button', function(assert) {
        this.reinit({
            opened: false,
        });

        getButtons(this.$element).eq(0).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });

    QUnit.test('Open popup of startDateBox should be closed by click on drop down button twice', function(assert) {
        this.reinit({
            opened: false,
        });

        getButtons(this.$element).eq(0).trigger('dxclick');
        getButtons(this.$element).eq(0).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox is closed');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should be opened by second click on drop down button if startDateBox was closed by option', function(assert) {
        this.reinit({
            opened: false,
        });

        getButtons(this.$element).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is opened');

        this.instance.getStartDateBox().option('opened', false);

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is opened');

        getButtons(this.$element).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is opened');
    });
});

QUnit.module('Behavior', moduleConfig, () => {
    QUnit.test('Popup of startDateBox should open on attempt to open Popup of endDateBox', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        endDateBox.open();

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        // TODO: investigate this behavior
        assert.strictEqual(endDateBox.option('opened'), true, 'endDateBox is opened');
        assert.strictEqual(startDateBox.option('opened'), true, 'startDateBox is opened');

        startDateBox.close();

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        // TODO: investigate this behavior
        assert.strictEqual(endDateBox.option('opened'), true, 'endDateBox is opened');
        assert.strictEqual(startDateBox.option('opened'), false, 'startDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should open if dateRangeBox opened option is true on initialization', function(assert) {
        this.reinit({
            value: [null, null],
            opened: true,
        });

        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(endDateBox.option('opened'), false, 'endDateBox opened option has correct value');
        assert.strictEqual(startDateBox.option('opened'), true, 'startDateBox is opened');
    });

    ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
        QUnit.test(`${dateBoxName} should update value on DateRangeBox value change`, function(assert) {
            const newValue = ['2023/04/18', '2023/05/03'];
            const dateBox = dateBoxName === 'startDateBox'
                ? getStartDateBoxInstance(this.instance)
                : getEndDateBoxInstance(this.instance);

            this.instance.option('value', newValue);

            assert.strictEqual(dateBox.option('value'), newValue[dateBoxName === 'startDateBox' ? 0 : 1]);
        });

        QUnit.test(`${dateBoxName} should not update value on DateRangeBox value change if value is the same date`, function(assert) {
            const newValue = ['2023/01/05', '2023/02/14'];
            const onValueChangedHandler = sinon.stub();
            const dateBox = dateBoxName === 'startDateBox'
                ? getStartDateBoxInstance(this.instance)
                : getEndDateBoxInstance(this.instance);

            dateBox.option('onValueChanged', onValueChangedHandler);
            this.instance.option('value', newValue);

            assert.strictEqual(onValueChangedHandler.callCount, 0);
        });

        QUnit.test(`DateRangeBox should update value on ${dateBoxName} value change`, function(assert) {
            const newValue = '2023/07/07';
            const dateBox = dateBoxName === 'startDateBox'
                ? getStartDateBoxInstance(this.instance)
                : getEndDateBoxInstance(this.instance);

            dateBox.option('value', newValue);

            assert.strictEqual(this.instance.option('value')[dateBoxName === 'startDateBox' ? 0 : 1], newValue);
        });

        QUnit.test(`DateRangeBox should not update value on ${dateBoxName} value change if the value is the same`, function(assert) {
            const isStartDateBox = dateBoxName === 'startDateBox';
            const newValue = isStartDateBox ? '2023/01/05' : '2023/02/14';
            const onValueChangedHandler = sinon.stub();
            const dateBox = isStartDateBox
                ? getStartDateBoxInstance(this.instance)
                : getEndDateBoxInstance(this.instance);

            this.instance.option('onValueChanged', onValueChangedHandler);
            dateBox.option('value', newValue);

            assert.strictEqual(onValueChangedHandler.callCount, 0);
        });
    });

    QUnit.module('onValueChanged event', {
        beforeEach: function() {
            this.onValueChangedHandler = sinon.stub();
            this.instance.option('onValueChanged', this.onValueChangedHandler);
        }
    }, () => {
        QUnit.test('should be called after value change', function(assert) {
            this.instance.option('value', ['2023/04/19', null]);

            assert.ok(this.onValueChangedHandler.calledOnce);
        });

        QUnit.test('onValueChanged event should have correct arguments', function(assert) {
            const oldValue = this.instance.option('value');
            const newValue = ['2023/04/19', null];

            this.instance.option('value', newValue);

            const { previousValue, value, element, component } = this.onValueChangedHandler.getCall(0).args[0];
            assert.deepEqual(previousValue, oldValue);
            assert.deepEqual(value, newValue);
            assert.ok($(element).is(this.$element));
            assert.strictEqual(component, this.instance);
        });

        [
            {
                newValue: ['2022/01/05', '2022/02/14'],
                scenario: 'with new startDate and endDate'
            },
            {
                newValue: ['2022/01/05', '2023/02/14'],
                scenario: 'with new startDate'
            },
            {
                newValue: ['2023/01/05', '2022/02/14'],
                scenario: 'with new endDate'
            },
        ].forEach(({ newValue, scenario }) => {
            QUnit.test(`should be called after updateValue call ${scenario}`, function(assert) {
                this.instance.updateValue(newValue);

                assert.ok(this.onValueChangedHandler.calledOnce);
            });
        });

        QUnit.test('should not be called after updateValue call with the same values', function(assert) {
            this.instance.updateValue(['2023/01/05', '2023/02/14']);

            assert.strictEqual(this.onValueChangedHandler.callCount, 0);
        });

        QUnit.test('should not be called when values are null and updateValue called with null values', function(assert) {
            this.reinit({
                value: [null, null],
                onValueChanged: this.onValueChangedHandler
            });
            this.instance.updateValue([null, null]);

            assert.strictEqual(this.onValueChangedHandler.callCount, 0);
        });
    });
});

QUnit.module('Strategy', moduleConfig, () => {
    [
        {
            optionName: 'selectionMode',
            optionValue: 'range'
        },
        {
            optionName: 'viewsCount',
            optionValue: 2
        },
    ].forEach(({ optionName, optionValue }) => {
        QUnit.test(`Calendar should have ${optionName} option equals ${optionValue}`, function(assert) {
            const startDateBox = getStartDateBoxInstance(this.instance);

            startDateBox.open();

            assert.strictEqual(startDateBox._strategy.widgetOption(optionName), optionValue);
        });
    });

    QUnit.test('Calendar should have "values" option equals to dateRangeBox "value"', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        startDateBox.open();

        assert.deepEqual(startDateBox._strategy.widgetOption('values'), this.instance.option('value'));
    });
});

QUnit.module('Public methods', moduleConfig, () => {
    QUnit.test('Open() method should set opened option value to true', function(assert) {
        this.reinit({
            opened: false,
        });

        this.instance.open();

        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox opened option has correct value');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox opened option has correct value');
        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox opened option has correct value');
    });

    QUnit.test('Close() methos should set opened option value to false', function(assert) {
        this.reinit({
            opened: true,
        });

        this.instance.close();

        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox opened option has correct value');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox opened option has correct value');
        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox opened option has correct value');
    });
});

QUnit.module('Popup integration', moduleConfig, () => {
    QUnit.test('Popup should be positioned relatively DateRangeBox root element', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        startDateBox.open();

        const popup = startDateBox._popup;

        assert.ok(this.$element.is(popup.option('position.of')));
    });
});

QUnit.module('Option synchronization', moduleConfig, () => {
    QUnit.test('StartDateBox opened option value should be change after change DateRangeBox option value', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        this.instance.option('opened', true);

        assert.strictEqual(startDateBox.option('opened'), true, 'startDateBox option was changed');
        assert.strictEqual(endDateBox.option('opened'), false, 'endDateBox option was not changed');

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

    QUnit.test('StartDateBox & endDateBox inputs should have the same value of tabIndex attribute after initialization', function(assert) {
        this.reinit({
            tabIndex: '2'
        });

        assert.strictEqual($(this.instance.getStartDateBox().field()).attr('tabIndex'), '2', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.getEndDateBox().field()).attr('tabIndex'), '2', 'endDateBox input tabIndex value');
    });

    QUnit.test('StartDateBox & endDateBox inputs should have the same value of tabIndex attribute if tabIndex option was changed in runtime', function(assert) {
        this.reinit({});
        this.instance.option('tabIndex', 3);

        assert.strictEqual($(this.instance.getStartDateBox().field()).attr('tabIndex'), '3', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.getEndDateBox().field()).attr('tabIndex'), '3', 'endDateBox input tabIndex value');
    });
});

QUnit.module('Dimensions', moduleConfig, () => {
    [undefined, 700].forEach((width) => {
        QUnit.test(`startDateBox and endDateBox should have equal width (dateRangeBox width = ${width})`, function(assert) {
            this.reinit({
                value: ['2023/01/05', '2023/02/14'],
                width,
            });

            const startDateBoxWidth = $(getStartDateBoxInstance(this.instance).$element()).width();
            const endDateBoxWidth = $(getEndDateBoxInstance(this.instance).$element()).width();

            assert.strictEqual(startDateBoxWidth, endDateBoxWidth);
        });

        ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
            QUnit.test(`${dateBoxName} with clear button should not change width after clear value (dateRangeBox width = ${width})`, function(assert) {
                this.reinit({
                    value: ['2023/01/05', '2023/02/14'],
                    showClearButton: true,
                    width,
                });

                const dateBox = dateBoxName === 'startDateBox'
                    ? getStartDateBoxInstance(this.instance)
                    : getEndDateBoxInstance(this.instance);
                const initialWidth = $(dateBox.$element()).width();

                this.instance.option('value', [null, null]);

                const newWidth = $(dateBox.$element()).width();

                assert.strictEqual(initialWidth, newWidth);
            });
        });
    });
});
