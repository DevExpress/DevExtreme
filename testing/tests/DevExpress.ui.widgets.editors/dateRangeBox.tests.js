import $ from 'jquery';
import config from 'core/config';
import DateRangeBox from 'ui/date_range_box';
import DateBox from 'ui/date_box';
import { isRenderer } from 'core/utils/type';
import fx from 'animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';

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
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const POPUP_CONTENT_CLASS = 'dx-popup-content';
const CLEAR_BUTTON = 'dx-clear-button-area';
const STATE_FOCUSED_CLASS = 'dx-state-focused';

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const getEndDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getEndDateBox();

const getButtonsContainers = $element => $element.find(`> .${DROP_DOWN_EDITOR_BUTTONS_CONTAINER_CLASS}`);
const getButtons = $element => $element.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
const getClearButton = $element => getButtonsContainers($element).find(`.${CLEAR_BUTTON}`);


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
                applyValueMode: 'instantly',
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
            applyValueMode: 'instantly',
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
                showClearButton: false,
                showDropDownButton: false,
                buttons: undefined,
            };
            const startDateBox = getStartDateBoxInstance(this.instance);

            Object.entries(initialDateRangeBoxOptions).forEach(([key]) => {
                assert.deepEqual(startDateBox.option(key), expectedOptions[key], `${key} value is correct`);
            });
        });

        QUnit.test('EndDateBox has expected settings', function(assert) {
            this.reinit(initialDateRangeBoxOptions);

            const expectedOptions = {
                showClearButton: false,
                showDropDownButton: false,
                buttons: undefined,
            };
            const endDateBox = getEndDateBoxInstance(this.instance);

            Object.entries(initialDateRangeBoxOptions).forEach(([key]) => {
                assert.deepEqual(endDateBox.option(key), expectedOptions[key], `${key} value is correct`);
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

    QUnit.test('Popup of startDateBox should be opened by click on drop down button if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: false,
            openOnFieldClick: true,
        });

        getButtons(this.$element).eq(0).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should be closed by click on drop down button if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: true,
            openOnFieldClick: true,
        });

        getButtons(this.$element).eq(0).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox is closed');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should be opened by click on startDate field if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: false,
            openOnFieldClick: true,
        });

        $(this.instance.field()[0]).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should be opened by click on endDate field if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: false,
            openOnFieldClick: true,
        });

        $(this.instance.field()[1]).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should be closed by click on startDate field if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: true,
            openOnFieldClick: true,
        });

        $(this.instance.field()[0]).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox is closed');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should be closed by click on endDate field if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: true,
            openOnFieldClick: true,
        });

        $(this.instance.field()[1]).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is closed'); // TODO: investigate scenario
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is closed'); // TODO: investigate scenario
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

QUnit.module('Clear button', moduleConfig, () => {
    QUnit.test('Clear button should be rendered if showClearButton is true', function(assert) {
        this.reinit({
            showClearButton: true
        });

        assert.strictEqual(getClearButton(this.$element).length, 1, 'clear button was rendered');
    });

    QUnit.test('Clear button should not be rendered if buttons is ["clear"] and showClearButton is false', function(assert) {
        this.reinit({
            showClearButton: false,
            buttons: ['clear']
        });

        assert.strictEqual(getClearButton(this.$element).length, 0, 'clear button was not rendered');
    });

    QUnit.test('Clear button should not be rendered if buttons is [] and showClearButton is true', function(assert) {
        this.reinit({
            showClearButton: true,
            buttons: []
        });

        assert.strictEqual(getClearButton(this.$element).length, 0, 'clear button was not rendered');
    });

    QUnit.test('Clear button should be rendered if buttons is ["clear"] and showClearButton is true', function(assert) {
        this.reinit({
            showClearButton: true,
            buttons: ['clear']
        });

        assert.strictEqual(getClearButton(this.$element).length, 1, 'clear button was rendered');
    });

    QUnit.test('Clear button should not be rendered if showClearButton is false', function(assert) {
        this.reinit({
            showClearButton: false
        });

        assert.strictEqual(getClearButton(this.$element).length, 0, 'clear button was not rendered');
    });

    QUnit.test('Clear button should be rendered if buttons option is changed in runtime', function(assert) {
        this.reinit({
            showClearButton: true,
            buttons: []
        });

        this.instance.option('buttons', ['clear']);

        assert.strictEqual(getClearButton(this.$element).length, 1, 'clear button was rendered');
    });

    QUnit.test('Clear button should be rendered if showClearButton option is changed in runtime', function(assert) {
        this.reinit({
            showClearButton: false,
        });

        this.instance.option('showClearButton', true);

        assert.strictEqual(getClearButton(this.$element).length, 1, 'clear button was rendered');
    });

    QUnit.test('getButton("clear") method should return element of default clear button', function(assert) {
        this.reinit({
            showClearButton: true,
        });

        assert.deepEqual(this.instance.getButton('clear').get(0), getClearButton(this.$element).get(0));
    });

    QUnit.test('Value of startDateBox & endDateBox should be cleared by click on clear button', function(assert) {
        this.reinit({
            opened: true,
            showClearButton: true,
            value: [new Date(2021, 9, 17), new Date(2021, 10, 5)],
        });

        getClearButton(this.$element).eq(0).trigger('click');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.deepEqual(this.instance.option('value'), [null, null], 'dateRangeBox value is cleared');
        assert.strictEqual(this.instance.getStartDateBox().option('value'), null, 'startDateBox value is cleared');
        assert.strictEqual(this.instance.getEndDateBox().option('value'), null, 'endDateBox value is cleared');
    });

    QUnit.test('Popup of startDateBox should not be opened by click on clear button button if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: false,
            value: [new Date(2021, 9, 17), new Date(2021, 10, 5)],
            openOnFieldClick: true,
        });

        getClearButton(this.$element).eq(0).trigger('click');

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');
    });
});

QUnit.module('Behavior', moduleConfig, () => {
    QUnit.test('Popup of startDateBox should open on attempt to open Popup of endDateBox', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        endDateBox.open();

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(endDateBox.option('opened'), false, 'endDateBox is closed');
        assert.strictEqual(startDateBox.option('opened'), true, 'startDateBox is opened');

        startDateBox.close();

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        assert.strictEqual(endDateBox.option('opened'), false, 'endDateBox is closed');
        assert.strictEqual(startDateBox.option('opened'), false, 'startDateBox is closed');
    });

    QUnit.test('StartDateBox should be focused on attempt to open endDateBox', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        endDateBox.open();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(startDateBox.$element().hasClass(STATE_FOCUSED_CLASS), true, 'startDateBox has focus state class');
        assert.strictEqual(endDateBox.$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
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

    QUnit.test('DateRangeBox element should be invisible if "visible" is set to false on init', function(assert) {
        this.reinit({
            visible: false
        });

        assert.strictEqual(this.$element.css('display'), 'none');
    });

    QUnit.test('DateRangeBox element should be invisible if "visible" is set to false on runtime change', function(assert) {
        this.instance.option('visible', false);

        assert.strictEqual(this.$element.css('display'), 'none');
    });

    QUnit.test('DateRangeBox element should be visible if "visible" is true on runtime change', function(assert) {
        this.reinit({
            visible: false
        });

        this.instance.option('visible', true);

        assert.notStrictEqual(this.$element.css('display'), 'none');
    });
});

QUnit.module('Events', moduleConfig, () => {
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

        // TODO: now onValueChanged event calls twice because we clear dateboxes sequentially
        QUnit.test('should be called once after click on clear button', function(assert) {
            this.reinit({
                showClearButton: true,
                value: ['2021/09/17', '2022/10/14'],
                onValueChanged: this.onValueChangedHandler
            });

            getClearButton(this.$element).trigger('dxclick');

            assert.strictEqual(this.onValueChangedHandler.callCount, 2);
        });

        // TODO: now onValueChanged event calls twice
        QUnit.test('should be called once after click on reset method call', function(assert) {
            this.reinit({
                showClearButton: true,
                value: ['2021/09/17', '2022/10/14'],
                onValueChanged: this.onValueChangedHandler
            });

            this.instance.reset();

            assert.strictEqual(this.onValueChangedHandler.callCount, 2);
        });
    });

    QUnit.module('onOpened & onClosed events', {
        beforeEach: function() {
            this.onOpenedHandler = sinon.stub();
            this.onClosedHandler = sinon.stub();

            this.reinit({
                onOpened: this.onOpenedHandler,
                onClosed: this.onClosedHandler,
            });
        }
    }, () => {
        QUnit.test('should be called after change opened option', function(assert) {
            this.instance.option('opened', true);

            assert.strictEqual(this.onOpenedHandler.callCount, 1, 'onOpenHandler callCount');
            assert.strictEqual(this.onClosedHandler.callCount, 0, 'onCloseHandler callCount');

            this.onOpenedHandler.reset();
            this.instance.option('opened', false);

            assert.strictEqual(this.onOpenedHandler.callCount, 0, 'onOpenHandler callCount');
            assert.strictEqual(this.onClosedHandler.callCount, 1, 'onCloseHandler callCount');
        });

        QUnit.test('DateRangeBox opened option value should be changed before call opened & closed actions', function(assert) {
            assert.expect(2);

            this.reinit({
                opened: false,
                onOpened: () => {
                    assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox has correct opened value');
                },
                onClosed: () => {
                    assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox has correct opened value');
                }
            });

            this.instance.getStartDateBox().option('opened', true);
            this.instance.getStartDateBox().option('opened', false);
        });

        QUnit.test('should be called with a new handlers after value change in runtime', function(assert) {
            this.reinit({
                onOpened: () => {},
                onClosed: () => {}
            });

            this.instance.option('onOpened', this.onOpenedHandler);
            this.instance.option('onClosed', this.onClosedHandler);

            this.instance.option('opened', true);

            assert.strictEqual(this.onOpenedHandler.callCount, 1, 'onOpenHandler callCount');
            assert.strictEqual(this.onClosedHandler.callCount, 0, 'onCloseHandler callCount');

            this.onOpenedHandler.reset();
            this.instance.option('opened', false);

            assert.strictEqual(this.onOpenedHandler.callCount, 0, 'onOpenHandler callCount');
            assert.strictEqual(this.onClosedHandler.callCount, 1, 'onCloseHandler callCount');
        });
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

    QUnit.test('Field() method should return startDateBox and endDateBox input elements', function(assert) {
        const field = this.instance.field();

        assert.strictEqual(field.length, 2, 'field method return two inputs');
        assert.strictEqual(isRenderer(field[0]), !!config().useJQuery, 'field[0] contains correct fieldElement');
        assert.strictEqual(isRenderer(field[1]), !!config().useJQuery, 'field[1] contains correct fieldElement');

        const $startDateBox = this.instance.getStartDateBox().$element();
        const $endDateBox = this.instance.getEndDateBox().$element();

        assert.strictEqual($(field[0]).is($startDateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)), true, 'field[0] contains startDateBox input');
        assert.strictEqual($(field[1]).is($endDateBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)), true, 'field[1] contains endDateBox input');
    });

    QUnit.test('Content() method should return null if dateRangeBox is closed', function(assert) {
        assert.strictEqual(this.instance.content(), null, 'content returns right value');
    });

    QUnit.test('Content() method should return popup content of startDateBox if dateRangeBox is opened', function(assert) {
        this.instance.open();

        const startDateBox = this.instance.getStartDateBox();

        const $popupContent = $(this.instance.content());

        assert.strictEqual($popupContent.is($(startDateBox.content())), true, 'content returns right element');
        assert.strictEqual($popupContent.hasClass(POPUP_CONTENT_CLASS), true, 'content returns popup content element');
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

    [
        {
            optionName: 'dateSerializationFormat',
            optionValue: 'yyyy-MM-dd',
        }, {
            optionName: 'height',
            optionValue: 200,
        }, {
            optionName: 'useMaskBehavior',
            optionValue: true,
        }, {
            optionName: 'valueChangeEvent',
            optionValue: 'keyDown',
        },
    ].forEach(({ optionName, optionValue }) => {
        QUnit.test(`${optionName} should be passed to startDateBox and endDateBox on init`, function(assert) {
            const initOptions = {};
            initOptions[optionName] = optionValue;
            this.reinit(initOptions);

            const startDateBox = getStartDateBoxInstance(this.instance);
            const endDateBox = getEndDateBoxInstance(this.instance);

            assert.strictEqual(startDateBox.option(optionName), optionValue);
            assert.strictEqual(endDateBox.option(optionName), optionValue);
        });

        QUnit.test(`${optionName} should be passed to startDateBox and endDateBox on runtime change`, function(assert) {
            const startDateBox = getStartDateBoxInstance(this.instance);
            const endDateBox = getEndDateBoxInstance(this.instance);

            this.instance.option(optionName, optionValue);

            assert.strictEqual(startDateBox.option(optionName), optionValue);
            assert.strictEqual(endDateBox.option(optionName), optionValue);
        });
    });

    ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
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

    QUnit.test('StartDateBox and EndDateBox should increase width on x/2 when DateRangeBox increase width on x', function(assert) {
        this.reinit({
            width: 300,
        });

        const initialDateBoxWidth = $(getStartDateBoxInstance(this.instance).$element()).width();

        this.instance.option('width', 320);

        assert.strictEqual($(this.instance.getStartDateBox().$element()).width(), initialDateBoxWidth + 10);
        assert.strictEqual($(this.instance.getEndDateBox().$element()).width(), initialDateBoxWidth + 10);
    });
});
