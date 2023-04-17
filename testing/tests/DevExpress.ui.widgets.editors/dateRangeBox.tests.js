import $ from 'jquery';
import config from 'core/config';
import DateRangeBox from 'ui/date_range_box';
import DateBox from 'ui/date_box';
import { isRenderer } from 'core/utils/type';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="dateRangeBox"></div>';

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
                label: '',
                labelMode: 'static',
                max: undefined,
                maxLength: null,
                min: undefined,
                opened: false,
                openOnFieldClick: false,
                placeholder: '',
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
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, this.instance.option(key), `${key} default value is correct`);
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
                label: 'Start Date',
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
                label: 'End Date',
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
});

QUnit.module('Behavior', moduleConfig, () => {
    QUnit.test('Popup of startDateBox should open on attempt to open Popup of endDateBox', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        endDateBox.open();

        assert.ok(startDateBox.option('opened'));
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

        assert.strictEqual(this.instance.option('opened'), true, 'opened option has correct value');
    });

    QUnit.test('Close() methos should set opened option value to false', function(assert) {
        this.reinit({
            opened: true,
        });

        this.instance.close();

        assert.strictEqual(this.instance.option('opened'), false, 'opened option has correct value');
    });
});
