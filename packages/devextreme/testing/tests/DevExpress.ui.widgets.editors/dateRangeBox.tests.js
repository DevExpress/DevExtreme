import $ from 'jquery';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import DateRangeBox from 'ui/date_range_box';
import DateBox from 'ui/date_box';
import { isRenderer } from 'core/utils/type';
import { isObject } from 'core/utils/type.js';
import fx from 'common/core/animation/fx';
import hoverEvents from 'common/core/events/hover';
import keyboardMock from '../../helpers/keyboardMock.js';
import Popup from 'ui/popup/ui.popup';
import localization from 'localization';

import 'ui/validator';
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
const STATE_HOVER_CLASS = 'dx-state-hover';

const VALIDATION_MESSAGE_CLASS = 'dx-invalid-message';
const SHOW_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const INVALID_CLASS = 'dx-invalid';
const TEXTEDITOR_EMPTY_CLASS = 'dx-texteditor-empty';

const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_CONTOURED_CELL_CLASS = 'dx-calendar-contoured-date';
const APPLY_BUTTON_SELECTOR = '.dx-popup-done.dx-button';
const CANCEL_BUTTON_SELECTOR = '.dx-popup-cancel.dx-button';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const BUTTON_SELECTOR = '.dx-button';
const TEXTBOX_SELECTOR = '.dx-textbox';

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const getEndDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getEndDateBox();

const getButtonsContainers = $element => $element.find(`> .${DROP_DOWN_EDITOR_BUTTONS_CONTAINER_CLASS}`);
const getButtons = $element => $element.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);
const getClearButton = $element => getButtonsContainers($element).find(`.${CLEAR_BUTTON}`);
const getPopup = dateBox => dateBox._popup;


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
        this.instance.open();

        assert.strictEqual($(this.instance.getStartDateBox().field()).attr('tabIndex'), '0', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.getEndDateBox().field()).attr('tabIndex'), '0', 'endDateBox input tabIndex value');
    });

    QUnit.test('Calendar should have one view by default on mobile device', function(assert) {
        if(devices.real().deviceType === 'desktop') {
            assert.ok(true, 'test does not actual for desktop devices');
            return;
        }

        this.reinit({});
        this.instance.open();

        const calendar = this.getCalendar();

        assert.strictEqual(calendar.option('viewsCount'), 1);
    });

    QUnit.test('Calendar should have two views by default on desktop device', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({ });
        this.instance.open();

        const calendar = this.getCalendar();

        assert.strictEqual(calendar.option('viewsCount'), 2);
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
                deferRendering: true,
                disabled: false,
                disabledDates: null,
                displayFormat: null,
                dropDownButtonTemplate: 'dropDownButton',
                dropDownOptions: {},
                endDate: null,
                endDateInputAttr: {},
                endDateLabel: 'End Date',
                endDateName: '',
                endDateOutOfRangeMessage: 'End date is out of range',
                endDatePlaceholder: '',
                endDateText: '',
                focusStateEnabled: true,
                height: undefined,
                hoverStateEnabled: true,
                invalidStartDateMessage: 'Start value must be a date',
                invalidEndDateMessage: 'End value must be a date',
                isValid: true,
                labelMode: 'static',
                max: undefined,
                min: undefined,
                onChange: null,
                onCopy: null,
                onCut: null,
                onEnterKey: null,
                onInput: null,
                onKeyDown: null,
                onKeyUp: null,
                onPaste: null,
                openOnFieldClick: true,
                opened: false,
                readOnly: false,
                rtlEnabled: false,
                showClearButton: false,
                showDropDownButton: true,
                spellcheck: false,
                startDate: null,
                startDateInputAttr: {},
                startDateLabel: 'Start Date',
                startDateName: '',
                startDateOutOfRangeMessage: 'Start date is out of range',
                startDatePlaceholder: '',
                startDateText: '',
                stylingMode: 'outlined',
                tabIndex: 0,
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
                assert.deepEqual(this.instance.option(key), value, `${key} default value is correct`);
            });
        });

        const expectedDateBoxOptions = {
            acceptCustomValue: true,
            activeStateEnabled: true,
            applyValueMode: 'instantly',
            deferRendering: true,
            disabled: false,
            displayFormat: null,
            elementAttr: {},
            focusStateEnabled: true,
            hoverStateEnabled: true,
            inputAttr: {},
            isValid: true,
            label: '',
            labelMode: 'static',
            max: undefined,
            min: undefined,
            name: '',
            onChange: null,
            onCopy: null,
            onCut: null,
            onEnterKey: null,
            onInput: null,
            onKeyDown: null,
            onKeyUp: null,
            onPaste: null,
            openOnFieldClick: true,
            placeholder: '',
            readOnly: false,
            rtlEnabled: false,
            showClearButton: false,
            showDropDownButton: false,
            spellcheck: false,
            tabIndex: 0,
            useMaskBehavior: false,
            validationMessageMode: 'auto',
            validationMessagePosition: 'auto',
            validationStatus: 'valid',
            valueChangeEvent: 'change',
            _showValidationMessage: false,
        };

        QUnit.test('StartDateBox has expected defaults', function(assert) {
            this.reinit({});

            const expectedOptions = {
                ...expectedDateBoxOptions,
                applyButtonText: 'OK',
                calendarOptions: {},
                disabledDates: undefined,
                cancelButtonText: 'Cancel',
                dateOutOfRangeMessage: 'Start date is out of range',
                invalidDateMessage: 'Start value must be a date',
                label: 'Start Date',
                opened: false,
                stylingMode: this.instance.option('stylingMode'),
                _showValidationIcon: false,
                dropDownOptions: {
                    showTitle: false,
                    title: '',
                    hideOnParentScroll: false,
                    preventScrollEvents: false,
                },
            };
            const startDateBox = getStartDateBoxInstance(this.instance);

            Object.entries(expectedOptions).forEach(([key, value]) => {
                if(key === 'dropDownOptions') {
                    Object.entries(startDateBox.option(key)).forEach(([dropDownOptionKey, dropDownOptionValue]) => {
                        assert.deepEqual(dropDownOptionValue, startDateBox.option(`${key}.${dropDownOptionKey}`), `${key}.${dropDownOptionKey} default value is correct`);
                    });
                } else {
                    assert.deepEqual(value, startDateBox.option(key), `${key} default value is correct`);
                }
            });
        });

        QUnit.test('EndDateBox has expected defaults', function(assert) {
            this.reinit({});

            const expectedOptions = {
                ...expectedDateBoxOptions,
                dateOutOfRangeMessage: 'End date is out of range',
                invalidDateMessage: 'End value must be a date',
                label: 'End Date',
                stylingMode: this.instance.option('stylingMode'),
                _showValidationIcon: true,
            };
            const endDateBox = getEndDateBoxInstance(this.instance);

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, endDateBox.option(key), `${key} default value is correct`);
            });
        });
    });

    QUnit.module('DateBox\'s option dependency from DateRangeBox options ', () => {
        const initialDateRangeBoxOptions = {
            activeStateEnabled: false,
            buttons: ['dropDown'],
            deferRendering: false,
            disabled: true,
            endDateInputAttr: { id: 'endDateInput' },
            endDateName: 'end_input',
            focusStateEnabled: false,
            hoverStateEnabled: false,
            labelMode: 'floating',
            showClearButton: true,
            readOnly: true,
            showDropDownButton: true,
            startDateInputAttr: { id: 'startDateInput' },
            startDateName: 'start_input',
            stylingMode: 'underlined',
            // TODO: extend this list of options
        };

        QUnit.test('StartDateBox has expected settings', function(assert) {
            this.reinit(initialDateRangeBoxOptions);

            const expectedOptions = {
                activeStateEnabled: false,
                buttons: undefined,
                deferRendering: false,
                disabled: true,
                focusStateEnabled: false,
                hoverStateEnabled: false,
                inputAttr: { id: 'startDateInput' },
                labelMode: 'floating',
                stylingMode: 'underlined',
                name: 'start_input',
                readOnly: true,
                showClearButton: false,
                showDropDownButton: false,
            };
            const startDateBox = getStartDateBoxInstance(this.instance);

            Object.entries(initialDateRangeBoxOptions).forEach(([key]) => {
                assert.deepEqual(startDateBox.option(key), expectedOptions[key], `${key} value is correct`);
            });
        });

        QUnit.test('EndDateBox has expected settings', function(assert) {
            this.reinit(initialDateRangeBoxOptions);

            const expectedOptions = {
                activeStateEnabled: false,
                buttons: undefined,
                deferRendering: true,
                disabled: true,
                earButton: false,
                focusStateEnabled: false,
                hoverStateEnabled: false,
                inputAttr: { id: 'endDateInput' },
                labelMode: 'floating',
                name: 'end_input',
                readOnly: true,
                stylingMode: 'underlined',
                showDropDownButton: false,
                showClearButton: false,
            };
            const endDateBox = getEndDateBoxInstance(this.instance);

            Object.entries(initialDateRangeBoxOptions).forEach(([key]) => {
                assert.deepEqual(endDateBox.option(key), expectedOptions[key], `${key} value is correct`);
            });
        });
    });
});

QUnit.module('Classes', moduleConfig, () => {
    QUnit.test(`DateRangeBox should not have ${SHOW_INVALID_BADGE_CLASS} class for start dateBox to never show invalid icon`, function(assert) {
        assert.strictEqual(this.$element.hasClass(SHOW_INVALID_BADGE_CLASS), false, 'dateRangeBox does not have invalid badge class');
    });

    [true, false].forEach(readOnly => {
        QUnit.test(`hover class should be added on hover event if dateRangeBox readOnly is ${readOnly}`, function(assert) {
            this.reinit({
                hoverStateEnabled: true,
                value: ['2021/09/17', '2022/10/14'],
                readOnly,
            });

            this.$element.trigger(hoverEvents.start);

            assert.strictEqual(this.$element.hasClass(STATE_HOVER_CLASS), true, 'dateRangeBox element has hover class');
        });
    });

    QUnit.test(`DateRangeBox should toggle ${TEXTEDITOR_EMPTY_CLASS} class on input event after typing in start datebox`, function(assert) {
        this.reinit({
            value: [null, null],
        });

        const keyboard = keyboardMock(this.$startDateInput);

        keyboard.type('2021/14/15');
        this.$startDateInput.trigger('input');

        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), false, 'has not class');

        this.$startDateInput.val('').trigger('input');

        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), true, 'has class');
    });

    QUnit.test(`DateRangeBox should toggle ${TEXTEDITOR_EMPTY_CLASS}  class on input event after typing in end datebox`, function(assert) {
        this.reinit({
            value: [null, null],
        });

        const keyboard = keyboardMock(this.$endDateInput);

        keyboard.type('2021/14/15');
        this.$endDateInput.trigger('input');

        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), false, 'has not class');

        this.$endDateInput.val('').trigger('input');

        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), true, 'has class');
    });

    QUnit.test(`DateRangeBox should toggle ${TEXTEDITOR_EMPTY_CLASS} class on blur event after typing in start datebox`, function(assert) {
        this.reinit({
            value: [null, null],
        });

        const $startDateInput = $(this.instance.startDateField());
        const keyboard = keyboardMock($startDateInput);

        keyboard.type('2021/14/15');
        $startDateInput.trigger('blur');
        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), false, 'has not class');

        $startDateInput.val('').trigger('blur');
        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), true, 'has class');
    });

    QUnit.test(`DateRangeBox should toggle ${TEXTEDITOR_EMPTY_CLASS}  class on blur event after typing in end datebox`, function(assert) {
        this.reinit({
            value: [null, null],
        });

        const $endDateInput = this.$endDateInput;
        const keyboard = keyboardMock($endDateInput);

        keyboard.type('2021/14/15');
        $endDateInput.trigger('blur');
        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), false, 'has not class');

        $endDateInput.val('').trigger('blur');
        assert.strictEqual(this.instance.$element().hasClass(TEXTEDITOR_EMPTY_CLASS), true, 'has class');
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
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is opened');
    });

    QUnit.test('Popup of startDateBox should be opened by click on drop down button if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: false,
            openOnFieldClick: true,
        });

        getButtons(this.$element).eq(0).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is opened');
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
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is opened');
    });

    QUnit.test('Popup of startDateBox should be opened by click on endDate field if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: false,
            openOnFieldClick: true,
        });

        $(this.instance.field()[1]).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is opened');
    });

    QUnit.test('Popup of startDateBox should not be closed by click on startDate field if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: true,
            openOnFieldClick: true,
        });

        $(this.instance.field()[0]).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is opened');
    });

    QUnit.test('Popup of startDateBox should not be closed by click on endDate field if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: true,
            openOnFieldClick: true,
        });

        $(this.instance.field()[1]).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is closed');
    });

    QUnit.test('Popup of startDateBox should be closed by click on dropDownButton if openOnFieldClick is true', function(assert) {
        this.reinit({
            opened: true,
            openOnFieldClick: true,
        });

        getButtons(this.$element).eq(0).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox is closed');
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
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is opened');

        this.instance.getStartDateBox().option('opened', false);

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), false, 'startDateBox is closed');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), false, 'endDateBox is closed');

        getButtons(this.$element).trigger('dxclick');

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(this.instance.getStartDateBox().option('opened'), true, 'startDateBox is opened');
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox is opened');
    });

    QUnit.test('Drop down button should be rendered and not disabled after change readOnly state', function(assert) {
        this.reinit({
            readOnly: true,
        });

        assert.strictEqual(this.instance.getButton('dropDown'), null, 'drop down button is not rendered');

        this.instance.option('readOnly', false);

        assert.strictEqual(this.instance.getButton('dropDown'), getButtons(this.$element).dxButton('instance'), 'drop down button is rendered');
        assert.strictEqual(this.instance.getButton('dropDown').option('disabled'), false, 'drop down button is not disabled');
    });

    QUnit.testInActiveWindow('DateRangeBox should be focused after opening by click on drop down button if disabled is false', function(assert) {
        $(this.instance.getButton('dropDown').$element()).trigger('dxclick');

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'startDateBox has focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
    });

    QUnit.testInActiveWindow('DateRangeBox should be focused after opening by click on drop down button if disabled is true', function(assert) {
        this.reinit({
            disabled: true,
        });

        $(this.instance.getButton('dropDown').$element()).trigger('dxclick');

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), false, 'dateRangeBox has no focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
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
        assert.strictEqual(endDateBox.option('opened'), true, 'endDateBox is closed');
        assert.strictEqual(startDateBox.option('opened'), true, 'startDateBox is opened');

        startDateBox.close();

        assert.strictEqual(this.instance.option('opened'), false, 'dateRangeBox is closed');
        assert.strictEqual(endDateBox.option('opened'), false, 'endDateBox is closed');
        assert.strictEqual(startDateBox.option('opened'), false, 'startDateBox is closed');
    });

    QUnit.testInActiveWindow('StartDateBox should be focused after opening by click on input', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        $(startDateBox.field()).trigger('dxclick');

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(startDateBox.$element().hasClass(STATE_FOCUSED_CLASS), true, 'startDateBox has focus state class');
        assert.strictEqual(endDateBox.$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
    });

    QUnit.testInActiveWindow('EndDateBox should be focused after opening by click on input', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        $(endDateBox.field()).trigger('dxclick');

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(startDateBox.$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(endDateBox.$element().hasClass(STATE_FOCUSED_CLASS), true, 'endDateBox has focus state class');
    });

    QUnit.test('Popup of startDateBox should open if dateRangeBox opened option is true on initialization', function(assert) {
        this.reinit({
            value: [null, null],
            opened: true,
        });

        const startDateBox = getStartDateBoxInstance(this.instance);
        const endDateBox = getEndDateBoxInstance(this.instance);

        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox is opened');
        assert.strictEqual(endDateBox.option('opened'), true, 'endDateBox opened option has correct value');
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
            const newValue = '2023/01/20';
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

    QUnit.module('startDate > endDate', {
        beforeEach: function() {
            this.onValueChangedHandler = sinon.stub();

            this.testValue = (assert, value, callCount) => {
                assert.deepEqual(this.instance.option('value'), value, 'value is correct');
                assert.strictEqual(this.instance.option('startDate'), value[0], 'startDate is correct');
                assert.strictEqual(this.instance.option('endDate'), value[1], 'end is correct');
                assert.strictEqual(this.instance.getStartDateBox().option('value'), value[0], 'startDateBox value is correct');
                assert.strictEqual(this.instance.getEndDateBox().option('value'), value[1], 'endDateBox value is correct');

                assert.strictEqual(this.onValueChangedHandler.callCount, callCount, `onValueChanged called ${callCount} time`);
                if(callCount) {
                    const { value: eventValue } = this.onValueChangedHandler.getCall(0).args[0];

                    assert.deepEqual(eventValue, value, 'onValueChanged handler got correct value field');
                }
            };
        },
        afterEach: function() {
            this.onValueChangedHandler.reset();
        }
    }, () => {
        QUnit.test('dates should be swapped if passed value has dates in wrong order on init', function(assert) {
            this.reinit({
                value: ['2023/02/02', '2023/01/01'],
                onValueChanged: this.onValueChangedHandler
            });

            this.testValue(assert, ['2023/01/01', '2023/02/02'], 0);
        });

        QUnit.test('dates should be swapped if passed value has dates in wrong order on runtime', function(assert) {
            this.reinit({
                onValueChanged: this.onValueChangedHandler
            });

            this.instance.option('value', ['2023/02/02', '2023/01/01']);

            this.testValue(assert, ['2023/01/01', '2023/02/02'], 1);
        });

        QUnit.test('dates should be swapped if passed startDate is bigger than endDate on init', function(assert) {
            this.reinit({
                onValueChanged: this.onValueChangedHandler,
                startDate: '2023/03/03',
                endDate: '2023/02/02',
            });

            this.testValue(assert, ['2023/02/02', '2023/03/03'], 0);
        });

        QUnit.test('dates should be swapped if passed startDate is bigger than endDate on runtime', function(assert) {
            this.reinit({
                onValueChanged: this.onValueChangedHandler,
                value: ['2023/01/01', '2023/02/02']
            });
            this.instance.option('startDate', '2023/03/03');

            this.testValue(assert, ['2023/02/02', '2023/03/03'], 1);
        });

        QUnit.test('dates should be swapped if passed endDate is smaller than startDate on runtime', function(assert) {
            this.reinit({
                onValueChanged: this.onValueChangedHandler,
                value: ['2023/02/02', '2023/03/03']
            });
            this.instance.option('endDate', '2023/01/01');

            this.testValue(assert, ['2023/01/01', '2023/02/02'], 1);
        });

        QUnit.test('dates should be swapped if startDateBox got value bigger than endDateBox value on runtime', function(assert) {
            this.reinit({
                onValueChanged: this.onValueChangedHandler,
                value: ['2023/01/01', '2023/02/02']
            });
            this.instance.getStartDateBox().option('value', '2023/03/03');

            this.testValue(assert, ['2023/02/02', '2023/03/03'], 1);
        });

        QUnit.test('dates should be swapped if endDateBox got value smaller than startDateBox value on runtime', function(assert) {
            this.reinit({
                onValueChanged: this.onValueChangedHandler,
                value: ['2023/02/02', '2023/03/03']
            });
            this.instance.getEndDateBox().option('value', '2023/01/01');

            this.testValue(assert, ['2023/01/01', '2023/02/02'], 1);
        });
    });

    [false, true].forEach((multiView) => {
        QUnit.test(`Calendar should have ${multiView ? 2 : 1} views when multiView is set to ${multiView} on init`, function(assert) {
            this.reinit({
                multiView,
                opened: true
            });

            const calendar = this.getCalendar();

            assert.strictEqual(calendar.option('viewsCount'), multiView ? 2 : 1);
        });

        QUnit.test(`Calendar should have ${multiView ? 2 : 1} views when multiView is set to ${multiView} on runtime`, function(assert) {
            this.reinit({
                multiView: !multiView,
                opened: true
            });

            this.instance.option('multiView', multiView);

            const calendar = this.getCalendar();

            assert.strictEqual(calendar.option('viewsCount'), multiView ? 2 : 1);
        });
    });

    QUnit.test('onContentReady should not fire on Popup render', function(assert) {
        const onContentReady = sinon.stub();

        this.reinit({
            onContentReady
        });

        assert.strictEqual(onContentReady.callCount, 1, 'onContentReady fired after DateRangeBox render');

        this.instance.open();

        assert.strictEqual(onContentReady.callCount, 1, 'onContentReady did not fire after Popup render');
    });

    [false, true].forEach((opened) => {
        ['startDateBox', 'endDateBox'].forEach((dateBox) => {
            QUnit.test(`Calendar enter handler should ${opened ? '' : 'not'} fire on enter key when Popup is ${opened ? '' : 'not'} opened and ${dateBox} is focused`, function(assert) {
                this.reinit({
                    opened: true
                });

                const dateBoxInstance = dateBox === 'startDateBox' ? this.instance.getStartDateBox() : this.instance.getEndDateBox();
                const calendar = this.getCalendar();
                const calendarEnterHandler = sinon.spy(calendar, '_enterKeyHandler');
                const $input = $(dateBoxInstance.field());
                const keyboard = keyboardMock($input);

                if(!opened) {
                    this.instance.close();
                }

                keyboard.press('enter');

                assert.strictEqual(calendarEnterHandler.called, opened, 'onContentReady fired after DateRangeBox render');
            });
        });
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

        QUnit.test('should not be called after update value on the same dates array', function(assert) {
            this.instance.option('value', ['2023/01/05', '2023/02/14']);

            assert.strictEqual(this.onValueChangedHandler.callCount, 0);
        });

        QUnit.test('should not be called after update value on the same dates array with wrong order', function(assert) {
            this.instance.option('value', ['2023/02/14', '2023/01/05']);

            assert.strictEqual(this.onValueChangedHandler.callCount, 0);
        });

        QUnit.test('should be called after startDate change', function(assert) {
            this.instance.option('startDate', '2020/02/20');

            assert.ok(this.onValueChangedHandler.calledOnce);
        });

        QUnit.test('should be called after endDate change', function(assert) {
            this.instance.option('endDate', '2020/03/30');

            assert.ok(this.onValueChangedHandler.calledOnce);
        });

        QUnit.test('should not be called after update startDate to the same value', function(assert) {
            this.reinit({
                startDate: '2008/06/06',
                onValueChanged: this.onValueChangedHandler
            });

            this.instance.option('startDate', '2008/06/06');

            assert.strictEqual(this.onValueChangedHandler.callCount, 0);
        });

        QUnit.test('should not be called after update endDate to the same value', function(assert) {
            this.reinit({
                endDate: '2009/07/07',
                onValueChanged: this.onValueChangedHandler
            });

            this.instance.option('endDate', '2009/07/07');

            assert.strictEqual(this.onValueChangedHandler.callCount, 0);
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

        QUnit.test('should be called once after click on clear button', function(assert) {
            this.reinit({
                showClearButton: true,
                value: ['2021/09/17', '2022/10/14'],
                onValueChanged: this.onValueChangedHandler
            });

            getClearButton(this.$element).trigger('dxclick');

            assert.strictEqual(this.onValueChangedHandler.callCount, 1);
        });

        QUnit.test('should be called once after reset method call', function(assert) {
            this.reinit({
                showClearButton: true,
                value: ['2021/09/17', '2022/10/14'],
                onValueChanged: this.onValueChangedHandler
            });

            this.instance.clear();

            assert.strictEqual(this.onValueChangedHandler.callCount, 1);
            assert.deepEqual(this.instance.option('value'), [null, null], 'value is correct');
        });

        QUnit.test('keybord events should be attached if readonly is false', function(assert) {
            const keyboardHandledStub = sinon.stub();

            this.reinit({
                onKeyboardHandled: keyboardHandledStub,
                readOnly: false
            });

            $(this.instance.field()[0]).trigger($.Event('keydown'));

            assert.strictEqual(keyboardHandledStub.callCount, 1, 'keyboard events are attached');
        });

        QUnit.test('keybord events should be detached if readonly is true', function(assert) {
            const keyboardHandledStub = sinon.stub();

            this.reinit({
                onKeyboardHandled: keyboardHandledStub,
                readOnly: true
            });

            $(this.instance.field()[0]).trigger($.Event('keydown'));

            assert.strictEqual(keyboardHandledStub.callCount, 0, 'keyboard events are detached');
        });

        QUnit.test('keybord events should be detached if readonly was changed in runtime', function(assert) {
            const keyboardHandledStub = sinon.stub();

            this.reinit({
                onKeyboardHandled: keyboardHandledStub,
                readOnly: false
            });

            this.instance.option('readOnly', true);

            $(this.instance.field()[0]).trigger($.Event('keydown'));

            assert.strictEqual(keyboardHandledStub.callCount, 0, 'keyboard events are detached');
        });

        QUnit.test('should have correct event on change value after click on clear button', function(assert) {
            const onValueChangedHandler = sinon.stub();

            this.reinit({
                value: ['2023/02/23', '2023/03/24'],
                showClearButton: true,
                onValueChanged: onValueChangedHandler,
            });

            $(this.instance.getButton('clear')).trigger('dxclick');

            assert.strictEqual(onValueChangedHandler.callCount, 1, 'handler has been called once');
            assert.strictEqual(onValueChangedHandler.getCall(0).args[0].event.type, 'dxclick', 'event is correct');

            this.instance.option('value', [new Date(2021, 9, 17), new Date(2021, 9, 19)]);
            assert.strictEqual(onValueChangedHandler.callCount, 2, 'handler has been called twice');
            assert.strictEqual(onValueChangedHandler.getCall(1).args[0].event, undefined, 'event has been cleared');
        });

        QUnit.test('should allow to patch value without any errors', function(assert) {
            this.reinit({
                value: ['2023/02/23', '2023/03/24'],
                showClearButton: true,
                onValueChanged(e) {
                    if(!(e.value[0])) {
                        e.component.option({
                            value: [new Date('2021/10/17'), new Date('2021/10/24')]
                        });
                    }
                },
            });

            try {
                this.instance.option('value', [null, '2023/03/24']);
            } catch(e) {
                assert.ok(false, `error: ${e.message}`);
            } finally {
                assert.deepEqual(this.instance.option('value'), [new Date(2021, 9, 17), new Date(2021, 9, 24)], 'value was changed');
            }
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

            this.instance.option('opened', true);
            this.instance.option('opened', false);

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

    QUnit.module('Keyboard events', {
        beforeEach: function() {
            this.onKeyDownHandler = sinon.stub();
            this.onKeyUpHandler = sinon.stub();
            this.onChangeHandler = sinon.stub();
            this.onInputHandler = sinon.stub();
            this.onCutHandler = sinon.stub();
            this.onCopyHandler = sinon.stub();
            this.onPasteHandler = sinon.stub();
            this.onEnterKeyHandler = sinon.stub();

            this.checkEventHandlerArgs = (targetInput, event, eventName) => {
                const handler = this[`${event}Handler`];

                QUnit.assert.strictEqual(handler.callCount, 1, `${eventName} event raised once`);

                const args = handler.getCall(0).args[0];
                QUnit.assert.strictEqual(args.component, this.instance, `${event} component`);
                QUnit.assert.strictEqual($(args.element).get(0), this.$element.get(0), `${event} element`);
                QUnit.assert.strictEqual(args.event.type, eventName.toLowerCase(), `${event} event`);
                QUnit.assert.strictEqual($(args.event.target).get(0), $(targetInput).get(0), `${event} target`);
            };
        }
    }, () => {
        ['keyUp', 'keyDown', 'change', 'input', 'cut', 'copy', 'paste'].forEach((eventName) => {
            const event = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
            const mockHandlerName = `${event}Handler`;

            QUnit.test(`${event} event should not be called after trigger '${eventName}' event in startDate or endDate input by default`, function(assert) {
                const startDateInput = this.instance.field()[0];
                const endDateInput = this.instance.field()[1];

                $(startDateInput).trigger($.Event(eventName.toLowerCase()));
                $(endDateInput).trigger($.Event(eventName.toLowerCase()));

                assert.strictEqual(this[`${event}Handler`].callCount, 0, `${eventName} event is not raised`);
            });

            QUnit.test(`${event} event handler not be called if new value is null after trigger '${eventName}' event in startDate or endDate input`, function(assert) {
                this.reinit({
                    [event]: this[mockHandlerName],
                });

                this.instance.option(event, null);

                const startDateInput = this.instance.field()[0];
                $(startDateInput).trigger($.Event(eventName.toLowerCase()));

                assert.strictEqual(this[`${event}Handler`].callCount, 0, `${eventName} event is not raised`);
            });

            QUnit.test(`${event} event should be called after trigger '${eventName}' event in startDate input`, function() {
                this.reinit({
                    [event]: this[mockHandlerName],
                });

                const startDateInput = this.instance.field()[0];
                $(startDateInput).trigger($.Event(eventName.toLowerCase()));

                this.checkEventHandlerArgs(startDateInput, event, eventName);
            });

            QUnit.test(`${event} event handler be called with a new handlers after trigger '${eventName}' event in startDate input`, function() {
                this.reinit({
                    [event]: () => {},
                });

                const startDateInput = this.instance.field()[0];
                $(startDateInput).trigger($.Event(eventName.toLowerCase()));

                this.instance.option(event, this[mockHandlerName]);

                $(startDateInput).trigger($.Event(eventName.toLowerCase()));

                this.checkEventHandlerArgs(startDateInput, event, eventName);
            });

            QUnit.test(`${event} event should be called after trigger '${eventName}' event in endDate input`, function() {
                this.reinit({
                    [event]: this[mockHandlerName],
                });

                const endDateInput = this.instance.field()[1];
                $(endDateInput).trigger($.Event(eventName.toLowerCase()));

                this.checkEventHandlerArgs(endDateInput, event, eventName);
            });

            QUnit.test(`${event} event handler be called with a new handlers after trigger '${eventName}' event on endDate input`, function() {
                this.reinit({
                    [event]: () => {},
                });

                const endDateInput = this.instance.field()[1];
                $(endDateInput).trigger($.Event(eventName.toLowerCase()));

                this.instance.option(event, this[mockHandlerName]);

                $(endDateInput).trigger($.Event(eventName.toLowerCase()));

                this.checkEventHandlerArgs(endDateInput, event, eventName);
            });
        });

        [0, 1].forEach(inputIndex => {
            const inputName = inputIndex ? 'endDate' : 'startDate';

            QUnit.test(`onEnterKey event should be called after trigger keyup with "enter" key in ${inputName} input`, function() {
                this.reinit({
                    onEnterKey: this.onEnterKeyHandler,
                });

                const input = this.instance.field()[inputIndex];
                $(input).trigger($.Event('keyup', { key: 'enter' }));

                this.checkEventHandlerArgs(input, 'onEnterKey', 'keyup');
            });

            QUnit.test(`onEnterKey event handler be called with a new handlers after trigger keyup with "enter" key in ${inputName} input`, function() {
                this.reinit({
                    onEnterKey: () => {},
                });

                const input = this.instance.field()[inputIndex];
                $(input).trigger($.Event('keyup', { key: 'enter' }));

                this.instance.option('onEnterKey', this.onEnterKeyHandler);

                $(input).trigger($.Event('keyup', { key: 'enter' }));

                this.checkEventHandlerArgs(input, 'onEnterKey', 'keyup');
            });

            QUnit.test(`onEnterKey event should not be called after trigger keyup with "enter" key in ${inputName} input by default`, function(assert) {
                const input = this.instance.field()[inputIndex];
                $(input).trigger($.Event('keyup', { key: 'enter' }));

                assert.strictEqual(this.onEnterKeyHandler.callCount, 0, 'onEnterKey event is not raised');
            });

            QUnit.test(`onEnterKey event handler not be called if new value is null after trigger keyup with "enter" key in ${inputName} input`, function(assert) {
                this.reinit({
                    onEnterKey: this.onEnterKeyHandler,
                });

                this.instance.option('onEnterKey', null);

                const input = this.instance.field()[inputIndex];
                $(input).trigger($.Event('keyup', { key: 'enter' }));

                assert.strictEqual(this.onEnterKeyHandler.callCount, 0, 'onEnterKey event is not raised');
            });
        });

        QUnit.test('Click on clear button should raise input event', function(assert) {
            this.reinit({
                showClearButton: true,
                value: [new Date(2021, 9, 17), new Date(2021, 9, 19)],
                onInput: this.onInputHandler
            });

            $(this.instance.getButton('clear')).trigger('dxclick');

            this.checkEventHandlerArgs(this.instance.startDateField(), 'onInput', 'input');
        });
    });

    QUnit.module('onFocusIn & onFocusOut events', {
        beforeEach: function() {
            this.onFocusInHandler = sinon.stub();
            this.onFocusOutHandler = sinon.stub();
        }
    }, () => {
        QUnit.test('onFocusIn should be called once on call focus() method', function(assert) {
            this.reinit({
                onFocusIn: this.onFocusInHandler,
                onFocusOut: this.onFocusOutHandler,
            });

            this.instance.focus();

            assert.strictEqual(this.onFocusInHandler.callCount, 1, 'onFocusIn callCount');
            assert.strictEqual(this.onFocusOutHandler.callCount, 0, 'onFocusOut callCount');
        });

        QUnit.test('onFocusOut should be called once on call blur() method if startDate input is focused', function(assert) {
            this.reinit({
                onFocusIn: this.onFocusInHandler,
                onFocusOut: this.onFocusOutHandler,
            });

            this.instance.getStartDateBox().focus();

            assert.strictEqual(this.onFocusInHandler.callCount, 1, 'onFocusIn callCount');
            assert.strictEqual(this.onFocusOutHandler.callCount, 0, 'onFocusOut callCount');

            this.onFocusInHandler.reset();
            this.instance.blur();

            assert.strictEqual(this.onFocusInHandler.callCount, 0, 'onFocusIn callCount');
            assert.strictEqual(this.onFocusOutHandler.callCount, 1, 'onFocusOut callCount');
        });

        QUnit.test('onFocusOut should be called once on call blur() method if endDate input is focused', function(assert) {
            this.reinit({
                onFocusIn: this.onFocusInHandler,
                onFocusOut: this.onFocusOutHandler,
            });

            this.instance.getEndDateBox().focus();

            assert.strictEqual(this.onFocusInHandler.callCount, 1, 'onFocusIn callCount');
            assert.strictEqual(this.onFocusOutHandler.callCount, 0, 'onFocusOut callCount');

            this.onFocusInHandler.reset();
            this.instance.blur();

            assert.strictEqual(this.onFocusInHandler.callCount, 0, 'onFocusIn callCount');
            assert.strictEqual(this.onFocusOutHandler.callCount, 1, 'onFocusOut callCount');
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
        assert.strictEqual(this.instance.getEndDateBox().option('opened'), true, 'endDateBox opened option has correct value');
        assert.strictEqual(this.instance.option('opened'), true, 'dateRangeBox opened option has correct value');
    });

    QUnit.test('Close() method should set opened option value to false', function(assert) {
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

        assert.strictEqual(this.getPopupContent().is($(startDateBox.content())), true, 'content returns right element');
        assert.strictEqual(this.getPopupContent().hasClass(POPUP_CONTENT_CLASS), true, 'content returns popup content element');
    });

    QUnit.testInActiveWindow('Focus() method should focus startDate input', function(assert) {
        this.instance.focus();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'startDateBox has focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
    });

    QUnit.testInActiveWindow('Blur() method should unfocus startDate input', function(assert) {
        this.instance.getStartDateBox().focus();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'startDateBox has focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');

        this.instance.blur();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), false, 'dateRangeBox has no focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
    });

    QUnit.testInActiveWindow('Blur() method should unfocus startDate input', function(assert) {
        this.instance.getEndDateBox().focus();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), true, 'endDateBox has focus state class');

        this.instance.blur();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), false, 'dateRangeBox has no focus state class');
        assert.strictEqual(this.instance.getStartDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'startDateBox has no focus state class');
        assert.strictEqual(this.instance.getEndDateBox().$element().hasClass(STATE_FOCUSED_CLASS), false, 'endDateBox has no focus state class');
    });
});

QUnit.module('Popup integration', moduleConfig, () => {
    QUnit.test('Popup should be positioned relatively DateRangeBox root element', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        startDateBox.open();

        const popup = startDateBox._popup;

        assert.ok(this.$element.is(popup.option('position.of')));
    });

    QUnit.module('Popup title', () => {
        QUnit.test('Popup should not have a title by default', function(assert) {
            this.instance.open();

            const startDateBox = getStartDateBoxInstance(this.instance);
            const popup = getPopup(startDateBox);

            assert.strictEqual(popup.option('showTitle'), false, 'title showing is disabled');
            assert.strictEqual(popup.option('title'), '', 'title is empty');
        });

        QUnit.test('Popup title can be configured by dropDownOptions on init', function(assert) {
            this.reinit({
                dropDownOptions: {
                    showTitle: true,
                    title: 'title'
                }
            });
            this.instance.open();

            const startDateBox = getStartDateBoxInstance(this.instance);
            const popup = getPopup(startDateBox);

            assert.strictEqual(popup.option('showTitle'), true, 'title showing is disabled');
            assert.strictEqual(popup.option('title'), 'title', 'title is empty');
        });

        QUnit.test('Popup title can be configured by dropDownOptions on runtime change', function(assert) {
            this.instance.option({
                dropDownOptions: {
                    showTitle: true,
                    title: 'title'
                }
            });

            this.instance.open();

            const startDateBox = getStartDateBoxInstance(this.instance);
            const popup = getPopup(startDateBox);

            assert.strictEqual(popup.option('showTitle'), true, 'title showing is disabled');
            assert.strictEqual(popup.option('title'), 'title', 'title is empty');
        });
    });

    QUnit.module('IOS', () => {
        QUnit.test('Popup should not be closed after focus is moved to the end dateBox, especially on IOS', function(assert) {
            this.instance.open();

            const startDateBox = getStartDateBoxInstance(this.instance);
            const $startDateBoxInput = $(startDateBox.field());
            $startDateBoxInput.trigger('focusin');

            const endDateBox = getEndDateBoxInstance(this.instance);
            const $endDateBoxInput = $(endDateBox.field());

            $startDateBoxInput.trigger($.Event('focusout', { relatedTarget: $endDateBoxInput }));

            assert.strictEqual(this.instance.option('opened'), true, 'popup is not closed');
        });

        QUnit.test('Popup should be closed after focus is moved to other editor using IOs special nextButton', function(assert) {
            const isIOs = devices.current().platform === 'ios';
            if(!isIOs) {
                assert.ok(true, 'test is actual only for ios');
                return;
            }

            this.instance.open();

            const startDateBox = getStartDateBoxInstance(this.instance);
            const $startDateBoxInput = $(startDateBox.field());
            $startDateBoxInput.trigger('focusin');

            const otherDateRangeBox = $('#dateRangeBox2').dxDateRangeBox({}).dxDateRangeBox('instance');
            const otherStartDateBox = getStartDateBoxInstance(otherDateRangeBox);
            const $otherStartDateBoxInput = $(otherStartDateBox.field());

            $startDateBoxInput.trigger($.Event('focusout', { relatedTarget: $otherStartDateBoxInput }));

            assert.strictEqual(this.instance.option('opened'), false, 'popup is closed');
        });
    });

    QUnit.module('popup can be opened by click on input after option change when popup was already rendered', () => {
        [
            { name: 'min', value: new Date() },
            { name: 'max', value: new Date() },
            { name: 'multiView', value: false },
            { name: 'dateSerializationFormat', value: 'yyyy-MM-dd' },
            { name: 'calendarOptions', value: { showTodayButton: true } },
            { name: 'acceptCustomValue', value: false },

        ].forEach(({ name, value }) => {
            QUnit.test(name, function(assert) {
                const clickEndInput = () => {
                    const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
                    $endDateBoxInput.trigger('dxclick');
                };

                clickEndInput();
                this.instance.close();
                this.instance.blur();

                this.instance.option(name, value);

                clickEndInput();

                const popup = getPopup(getStartDateBoxInstance(this.instance));
                assert.strictEqual(popup.option('visible'), true, 'popup is opened');
                assert.strictEqual(popup.$content().is(':empty'), false, 'content is rendered');
            });
        });
    });
});

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

                const $clearButton = getClearButton(this.$element);

                assert.strictEqual($clearButton.css('visibility'), 'visible', 'clear button is visible');

                this.instance.option('value', [null, null]);

                const newWidth = $(dateBox.$element()).width();

                assert.strictEqual(initialWidth, newWidth);
                assert.strictEqual($clearButton.css('visibility'), 'hidden', 'clear button is hidden');
            });
        });

        QUnit.test('\'Clear\' button visibility depends on value', function(assert) {
            this.reinit({
                showClearButton: true,
                value: [null, null]
            });

            const $clearButton = getClearButton(this.$element);

            assert.strictEqual($clearButton.css('visibility'), 'hidden', 'clear button is hidden');

            this.instance.option('value', [new Date(2021, 9, 17), null]);
            assert.strictEqual($clearButton.css('visibility'), 'visible', 'clear button is visible');

            this.instance.option('value', [null, null]);
            assert.strictEqual($clearButton.css('visibility'), 'hidden', 'clear button is hidden');

            this.instance.option('value', [null, new Date(2021, 9, 17)]);
            assert.strictEqual($clearButton.css('visibility'), 'visible', 'clear button is visible');

            this.instance.option('value', [null, null]);
            assert.strictEqual($clearButton.css('visibility'), 'hidden', 'clear button is hidden');
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

QUnit.module('Validation', {
    ...moduleConfig,
    failInternalValidation(keyboard) {
        keyboard
            .press('backspace')
            .type('f')
            .change();
    },
    successInternalValidation(keyboard) {
        keyboard
            .press('backspace')
            .change();
    },
    raiseExternalValidation(keyboard) {
        keyboard
            .caret({ start: 0, end: 10 })
            .type('5/5/2023')
            .change();
    }
}, () => {
    // TODO: research how to improve this behavior
    QUnit.test('validation should be failed after startDate change if "required" rule is used', function(assert) {
        this.reinit({ value: [null, null] });

        this.$element.dxValidator({
            validationRules: [{
                type: 'required',
                message: 'Both dates are required'
            }]
        });


        this.instance.option('startDate', '2023/01/01');

        assert.strictEqual(this.instance.option('isValid'), false, 'validation is failed');
    });

    QUnit.test('reset should clear validation', function(assert) {
        this.reinit({ value: [null, null] });

        this.$element.dxValidator({
            validationRules: [{
                type: 'required',
                message: 'Both dates are required'
            }]
        });

        const startDateBox = getStartDateBoxInstance(this.instance);
        const keyboard = keyboardMock($(startDateBox.field()));

        this.failInternalValidation(keyboard);

        this.instance.reset();

        assert.strictEqual(this.instance.option('isValid'), true);
    });

    QUnit.test('reset should clear input value when editor`s value hasn`t been changed', function(assert) {
        const initialValue = [null, null];
        this.reinit({ value: initialValue });

        const startDateBox = getStartDateBoxInstance(this.instance);
        const $startDateBoxInput = $(startDateBox.field());

        const keyboard = keyboardMock($startDateBoxInput);
        keyboard.type('123').press('enter');

        assert.strictEqual($startDateBoxInput.val(), '123');
        assert.deepEqual(this.instance.option('value'), initialValue);

        this.instance.reset();

        assert.strictEqual($startDateBoxInput.val(), '');
    });

    QUnit.test('dateRangeBox should not be re-validated after readOnly option change', function(assert) {
        this.$element.dxValidator({
            validationRules: [{
                type: 'custom',
                validationCallback: () => false
            }]
        });

        this.instance.option('readOnly', true);

        assert.strictEqual(this.instance.option('isValid'), true, 'validation is not failed');
    });

    QUnit.module('validation message', {
        beforeEach: function() {
            this.reinit({
                isValid: false,
                validationError: {
                    message: 'Error message'
                },
                validationMessageMode: 'always',
            });
        },
        getValidationMessage: function($element = this.$element) {
            const $validationMessage = $element.find(`.${VALIDATION_MESSAGE_CLASS}`).eq(0);
            return $validationMessage.dxValidationMessage('instance');
        }
    }, () => {
        QUnit.test('validation message should be rendered above the inputs if popup is opened', function(assert) {
            this.instance.open();

            const $validationMessage = this.$element.find(`.${VALIDATION_MESSAGE_CLASS}`).eq(0);
            const validationMessage = $validationMessage.dxValidationMessage('instance');

            assert.strictEqual(validationMessage.option('positionSide'), 'top', 'validation message is rendered above the inputs');
        });

        QUnit.test('validation message should be rendered below the inputs if popup is closed', function(assert) {
            this.instance.open();
            this.instance.close();

            const validationMessage = this.getValidationMessage();
            assert.strictEqual(validationMessage.option('positionSide'), 'bottom', 'validation message is rendered below the inputs');
        });

        QUnit.test('validation message should be rendered below the inputs even is popup is opened if validationMessagePosition="bottom"', function(assert) {
            this.reinit({
                isValid: false,
                validationError: {
                    message: 'Error message'
                },
                validationMessageMode: 'always',
                validationMessagePosition: 'bottom',
            });

            this.instance.open();

            const validationMessage = this.getValidationMessage();
            assert.strictEqual(validationMessage.option('positionSide'), 'bottom', 'validation message is rendered below the inputs');
        });

        QUnit.test('validation message should be rendered above the inputs even is popup is close if validationMessagePosition="top"', function(assert) {
            this.reinit({
                isValid: false,
                validationError: {
                    message: 'Error message'
                },
                validationMessageMode: 'always',
                validationMessagePosition: 'top',
            });

            this.instance.open();

            const validationMessage = this.getValidationMessage();
            assert.strictEqual(validationMessage.option('positionSide'), 'top', 'validation message is rendered above the inputs');
        });

        QUnit.test('validation message should be rendered above the inputs if validation is failed when popup is already opened', function(assert) {
            this.reinit({
                validationError: {
                    message: 'Error message'
                },
                validationMessageMode: 'always',
            });

            this.instance.open();
            this.instance.option('isValid', false);

            const validationMessage = this.getValidationMessage();
            assert.strictEqual(validationMessage.option('positionSide'), 'top', 'validation message is rendered above the inputs');
        });

        QUnit.test('validationMessage should have correct position when validationMessagePosition is set on runtime change', function(assert) {
            this.instance.option('validationMessagePosition', 'left');

            const validationMessage = this.getValidationMessage();
            assert.strictEqual(validationMessage.option('positionSide'), 'left');
        });

        QUnit.test('validationMessage should have correct mode when validationMessageMode is set on init', function(assert) {
            this.reinit({
                validationMessageMode: 'always',
                isValid: false,
                validationError: {
                    message: 'error'
                }
            });

            const validationMessage = this.getValidationMessage();
            assert.strictEqual(validationMessage.option('mode'), 'always');
        });

        QUnit.test('validationMessage should have correct mode when validationMessageMode is set on runtime change', function(assert) {
            this.instance.option('validationMessageMode', 'always');

            const validationMessage = this.getValidationMessage();
            assert.strictEqual(validationMessage.option('mode'), 'always');
        });

        QUnit.test('start dateBox validation message should not be shown even if internal validation is failed', function(assert) {
            this.instance.option('isValid', true);

            const startDateBox = getStartDateBoxInstance(this.instance);
            const $startDateBoxInput = $(startDateBox.field());
            const keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);

            const validationMessage = this.getValidationMessage(startDateBox.$element());
            assert.strictEqual(validationMessage, undefined, 'validationMessage is not rendered');
        });

        QUnit.test('end dateBox validation message should not be shown even if internal validation is failed', function(assert) {
            this.instance.option('isValid', true);

            const endDateBox = getEndDateBoxInstance(this.instance);
            const $endDateBoxInput = $(endDateBox.field());
            const keyboard = keyboardMock($endDateBoxInput);

            this.failInternalValidation(keyboard);

            const validationMessage = this.getValidationMessage(endDateBox.$element());
            assert.strictEqual(validationMessage, undefined, 'validationMessage is not rendered');
        });
    });

    QUnit.module('options', () => {
        QUnit.test('validationMessagePosition option is passed to the first dateBox on runtime change', function(assert) {
            const validationMessagePosition = 'bottom';
            this.instance.option({ validationMessagePosition });

            const startDateBox = getStartDateBoxInstance(this.instance);
            assert.strictEqual(startDateBox.option('validationMessagePosition'), validationMessagePosition, 'option is passed');
        });

        QUnit.test('invalidStartDateMessage runtime change should pass new value to the start dateBox', function(assert) {
            const newInvalidMessage = 'new invalid message';
            this.instance.option('invalidStartDateMessage', newInvalidMessage);

            const startDateBox = getStartDateBoxInstance(this.instance);

            assert.strictEqual(startDateBox.option('invalidDateMessage'), newInvalidMessage, 'invalidDateMessage is updated');
        });

        QUnit.test('invalidEndDateMessage runtime change should pass new value to the end dateBox', function(assert) {
            const newInvalidMessage = 'new invalid message';
            this.instance.option('invalidEndDateMessage', newInvalidMessage);

            const endDateBox = getEndDateBoxInstance(this.instance);

            assert.strictEqual(endDateBox.option('invalidDateMessage'), newInvalidMessage, 'invalidDateMessage is updated');
        });

        QUnit.test('startDateOutOfRangeMessage runtime change should pass new value to the start dateBox', function(assert) {
            const newInvalidMessage = 'new invalid message';
            this.instance.option('startDateOutOfRangeMessage', newInvalidMessage);

            const startDateBox = getStartDateBoxInstance(this.instance);

            assert.strictEqual(startDateBox.option('dateOutOfRangeMessage'), newInvalidMessage, 'invalidDateMessage is updated');
        });

        QUnit.test('endDateOutOfRangeMessage runtime change should pass new value to the end dateBox', function(assert) {
            const newInvalidMessage = 'new invalid message';
            this.instance.option('endDateOutOfRangeMessage', newInvalidMessage);

            const endDateBox = getEndDateBoxInstance(this.instance);

            assert.strictEqual(endDateBox.option('dateOutOfRangeMessage'), newInvalidMessage, 'invalidDateMessage is updated');
        });

        QUnit.module('validationErrors option change', () => {
            QUnit.test('should be raised only once on internal validation fail', function(assert) {
                assert.expect(3);

                this.reinit({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'validationErrors') {
                            assert.strictEqual(previousValue, null, 'validationErrors previousValue');
                            assert.strictEqual(value.length, 1, 'validationErrors length');
                            assert.strictEqual(value[0].message, 'Start value must be a date', 'message');
                        }
                    }
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.failInternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on external validation fail', function(assert) {
                assert.expect(3);

                this.reinit({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'validationErrors') {
                            assert.strictEqual(previousValue, null, 'validationErrors previousValue');
                            assert.strictEqual(value.length, 1, 'validationErrors length');
                            assert.strictEqual(value[0].message, 'external error', 'message');
                        }
                    }
                });

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.raiseExternalValidation(keyboard);
            });

            QUnit.skip('should be raised only once on external validation fail after internal validation fail', function(assert) {
                assert.expect(3);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.failInternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name, previousValue, value }) => {
                        if(name === 'validationErrors') {
                            assert.deepEqual(previousValue, [{ message: 'Start value must be a date' }], 'validationErrors previousValue');
                            assert.strictEqual(value.length, 2, 'validationErrors length');
                            assert.strictEqual(value[1].message, 'external error', 'message');
                        }
                    }
                });

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                this.raiseExternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on internal validation fail after external validation fail', function(assert) {
                assert.expect(4);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);


                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });
                this.raiseExternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name, previousValue, value }) => {
                        if(name === 'validationErrors') {
                            assert.strictEqual(previousValue.length, 1, 'previousValue length');
                            assert.strictEqual(previousValue[0].message, 'external error', 'previousValue message');
                            assert.strictEqual(value.length, 2, 'value length');
                            assert.strictEqual(value[1].message, 'Start value must be a date', 'value[1] message');
                        }
                    }
                });

                this.failInternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on internal validation success after fail', function(assert) {
                assert.expect(2);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.failInternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'validationErrors') {
                            assert.deepEqual(previousValue, [{ message: 'Start value must be a date' }], 'validationErrors previousValue');
                            assert.deepEqual(value, [], 'validationErrors value');
                        }
                    }
                });

                this.successInternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on external validation success after fail', function(assert) {
                assert.expect(3);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                let validationCallbackCallCount = 0;
                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => {
                            ++validationCallbackCallCount;
                            return validationCallbackCallCount === 2;
                        },
                        message: 'external error'
                    }]
                });
                this.raiseExternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'validationErrors') {
                            assert.strictEqual(previousValue.length, 1, 'previousValue length');
                            assert.strictEqual(previousValue[0].message, 'external error', 'previousValue[0] message');
                            assert.strictEqual(value, null, 'validationErrors value');
                        }
                    }
                });

                this.raiseExternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on internal validation fail if other internal validation is already failed', function(assert) {
                assert.expect(2);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const startDateBoxKeyboard = keyboardMock($startDateBoxInput);
                this.failInternalValidation(startDateBoxKeyboard);

                this.instance.option({
                    onOptionChanged: ({ name, previousValue, value }) => {
                        if(name === 'validationErrors') {
                            assert.deepEqual(previousValue, [{ message: 'Start value must be a date' }], 'validationErrors previousValue');
                            const updatedErrors = [{ message: 'Start value must be a date' }, { message: 'End value must be a date' }];
                            assert.deepEqual(value, updatedErrors, 'validationErrors value');
                        }
                    }
                });

                const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
                const endDateBoxKeyboard = keyboardMock($endDateBoxInput);
                this.failInternalValidation(endDateBoxKeyboard);
            });

            QUnit.test('should be raised only once on internal validation fail if other external validation is already failed', function(assert) {
                assert.expect(4);

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const startDateBoxKeyboard = keyboardMock($startDateBoxInput);
                this.raiseExternalValidation(startDateBoxKeyboard);

                this.instance.option({
                    onOptionChanged: ({ name, previousValue, value }) => {
                        if(name === 'validationErrors') {
                            assert.strictEqual(previousValue.length, 1, 'previousValue length');
                            assert.strictEqual(previousValue[0].message, 'external error', 'previousValue[0] message');
                            assert.strictEqual(value.length, 2, 'value length');
                            assert.deepEqual(value[1], { message: 'End value must be a date' }, 'value[1]');
                        }
                    }
                });

                const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
                const endDateBoxKeyboard = keyboardMock($endDateBoxInput);
                this.failInternalValidation(endDateBoxKeyboard);
            });

            QUnit.skip('should be raised only once on external validation fail if other internal validation is already failed', function(assert) {
                assert.expect(4);

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const startDateBoxKeyboard = keyboardMock($startDateBoxInput);
                this.failInternalValidation(startDateBoxKeyboard);

                this.instance.option({
                    onOptionChanged: ({ name, previousValue, value }) => {
                        if(name === 'validationErrors') {
                            assert.strictEqual(previousValue.length, 1, 'previousValue length');
                            assert.strictEqual(previousValue[0].message, 'Start value must be a date', 'previousValue[0] message');
                            assert.strictEqual(value.length, 2, 'value length');
                            assert.deepEqual(value[1].message, 'external error', 'value[1]');
                        }
                    }
                });

                const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
                const endDateBoxKeyboard = keyboardMock($endDateBoxInput);
                this.raiseExternalValidation(endDateBoxKeyboard);
            });
        });

        QUnit.module('isValid option change', () => {
            QUnit.test('should be raised only once on internal validation fail', function(assert) {
                assert.expect(2);

                this.reinit({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'isValid') {
                            assert.strictEqual(previousValue, true, 'isValid previousValue');
                            assert.strictEqual(value, false, 'isValid value');
                        }
                    }
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.failInternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on external validation fail', function(assert) {
                assert.expect(2);

                this.reinit({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'isValid') {
                            assert.strictEqual(previousValue, true, 'isValid previousValue');
                            assert.strictEqual(value, false, 'isValid value');
                        }
                    }
                });

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.raiseExternalValidation(keyboard);
            });

            QUnit.skip('should not be raised on external validation fail after internal validation fail', function(assert) {
                assert.expect(0);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.failInternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name }) => {
                        if(name === 'isValid') {
                            assert.ok(false, 'should not be fired');
                        }
                    }
                });

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                this.raiseExternalValidation(keyboard);
            });

            QUnit.test('should not be raised on internal validation fail after external validation fail', function(assert) {
                assert.expect(0);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);


                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });
                this.raiseExternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name }) => {
                        if(name === 'isValid') {
                            assert.ok(false, 'should not be fired');
                        }
                    }
                });

                this.failInternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on internal validation success after fail', function(assert) {
                assert.expect(2);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                this.failInternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'isValid') {
                            assert.strictEqual(previousValue, false, 'isValid previousValue');
                            assert.strictEqual(value, true, 'isValid value');
                        }
                    }
                });

                this.successInternalValidation(keyboard);
            });

            QUnit.test('should be raised only once on external validation success after fail', function(assert) {
                assert.expect(2);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const keyboard = keyboardMock($startDateBoxInput);

                let validationCallbackCallCount = 0;
                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => {
                            ++validationCallbackCallCount;
                            return validationCallbackCallCount === 2;
                        },
                        message: 'external error'
                    }]
                });
                this.raiseExternalValidation(keyboard);

                this.instance.option({
                    onOptionChanged: ({ name, value, previousValue }) => {
                        if(name === 'isValid') {
                            assert.strictEqual(previousValue, false, 'isValid previousValue');
                            assert.strictEqual(value, true, 'isValid value');
                        }
                    }
                });

                this.raiseExternalValidation(keyboard);
            });

            QUnit.test('should not be raised on internal validation fail if other internal validation is already failed', function(assert) {
                assert.expect(0);

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const startDateBoxKeyboard = keyboardMock($startDateBoxInput);
                this.failInternalValidation(startDateBoxKeyboard);

                this.instance.option({
                    onOptionChanged: ({ name }) => {
                        if(name === 'isValid') {
                            assert.ok(false, 'should not be fired');
                        }
                    }
                });

                const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
                const endDateBoxKeyboard = keyboardMock($endDateBoxInput);
                this.failInternalValidation(endDateBoxKeyboard);
            });

            QUnit.test('should not be raised on internal validation fail if other external validation is already failed', function(assert) {
                assert.expect(0);

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const startDateBoxKeyboard = keyboardMock($startDateBoxInput);
                this.raiseExternalValidation(startDateBoxKeyboard);

                this.instance.option({
                    onOptionChanged: ({ name }) => {
                        if(name === 'isValid') {
                            assert.ok(false, 'should not be fired');
                        }
                    }
                });

                const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
                const endDateBoxKeyboard = keyboardMock($endDateBoxInput);
                this.failInternalValidation(endDateBoxKeyboard);
            });

            QUnit.test('should not be raised on external validation fail if other internal validation is already failed', function(assert) {
                assert.expect(0);

                this.$element.dxValidator({
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false,
                        message: 'external error'
                    }]
                });

                const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
                const startDateBoxKeyboard = keyboardMock($startDateBoxInput);
                this.failInternalValidation(startDateBoxKeyboard);

                this.instance.option({
                    onOptionChanged: ({ name }) => {
                        if(name === 'isValid') {
                            assert.ok(false, 'should not be fired');
                        }
                    }
                });

                const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
                const endDateBoxKeyboard = keyboardMock($endDateBoxInput);
                this.raiseExternalValidation(endDateBoxKeyboard);
            });
        });
    });

    QUnit.module('validation icon', () => {
        QUnit.test('start dateBox validation icon should not be shown even if internal validation is failed', function(assert) {
            const startDateBox = getStartDateBoxInstance(this.instance);
            const $startDateBoxInput = $(startDateBox.field());
            const keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);

            assert.strictEqual(startDateBox.$element().hasClass(SHOW_INVALID_BADGE_CLASS), false, 'validation icon is not shown');
        });

        QUnit.test('end dateBox validation icon should be shown if internal validation is failed', function(assert) {
            const endDateBox = getEndDateBoxInstance(this.instance);
            const $endDateBoxInput = $(endDateBox.field());
            const keyboard = keyboardMock($endDateBoxInput);

            this.failInternalValidation(keyboard);

            assert.strictEqual(endDateBox.$element().hasClass(SHOW_INVALID_BADGE_CLASS), true, `${SHOW_INVALID_BADGE_CLASS} class is added`);
            assert.strictEqual(endDateBox.$element().hasClass(INVALID_CLASS), true, `${INVALID_CLASS} class is added`);
        });

        QUnit.test('end dateBox validation icon should be shown if external validation is failed', function(assert) {
            const endDateBox = getEndDateBoxInstance(this.instance);
            const $endDateBoxInput = $(endDateBox.field());
            const keyboard = keyboardMock($endDateBoxInput);

            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                    message: 'external error'
                }]
            });

            this.raiseExternalValidation(keyboard);

            assert.strictEqual(endDateBox.$element().hasClass(SHOW_INVALID_BADGE_CLASS), true, `${SHOW_INVALID_BADGE_CLASS} class is added`);
            assert.strictEqual(endDateBox.$element().hasClass(INVALID_CLASS), true, `${INVALID_CLASS} class is added`);
        });

        QUnit.test('end dateBox validation icon should be shown if start dateBox internal validation is failed', function(assert) {
            const startDateBox = getStartDateBoxInstance(this.instance);
            const $startDateBoxInput = $(startDateBox.field());
            const keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);

            const endDateBox = getEndDateBoxInstance(this.instance);
            assert.strictEqual(endDateBox.$element().hasClass(SHOW_INVALID_BADGE_CLASS), true, `${SHOW_INVALID_BADGE_CLASS} class is added`);
            assert.strictEqual(endDateBox.$element().hasClass(INVALID_CLASS), true, `${INVALID_CLASS} class is added`);
        });

        QUnit.test('end dateBox validation icon should be shown if external validation is failed after end dateBox second value change', function(assert) {
            const endDateBox = getEndDateBoxInstance(this.instance);
            const $endDateBoxInput = $(endDateBox.field());
            const keyboard = keyboardMock($endDateBoxInput);

            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                    message: 'external error'
                }]
            });

            keyboard
                .caret({ start: 0, end: 10 })
                .type('5/5/2023')
                .change()
                .caret({ start: 0, end: 10 })
                .type('4/5/2023')
                .change();

            assert.strictEqual(endDateBox.$element().hasClass(SHOW_INVALID_BADGE_CLASS), true, `${SHOW_INVALID_BADGE_CLASS} class is added`);
            assert.strictEqual(endDateBox.$element().hasClass(INVALID_CLASS), true, `${INVALID_CLASS} class is added`);
        });
    });

    QUnit.module('internal validation', () => {
        // NOTE: In DateRangeBox we always keep both internal and external validation errors.

        QUnit.test('validationErrors should have all internal validation errors combined', function(assert) {
            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            let keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);

            const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
            keyboard = keyboardMock($endDateBoxInput);

            this.failInternalValidation(keyboard);

            const expectedErrors = [
                { message: 'Start value must be a date' },
                { message: 'End value must be a date' }
            ];
            assert.deepEqual(this.instance.option('validationErrors'), expectedErrors, 'validationErrors has both internal errors');
        });

        QUnit.test('validationErrors option change should not restore internal validation errors', function(assert) {
            const endDateBox = getEndDateBoxInstance(this.instance);
            const $endDateBoxInput = $(endDateBox.field());
            const keyboard = keyboardMock($endDateBoxInput);

            this.failInternalValidation(keyboard);

            const externalError = [{ message: 'external error' }];
            this.instance.option('validationErrors', [externalError]);

            const expectedErrors = [externalError, { message: 'End value must be a date' }];
            assert.deepEqual(this.instance.option('validationErrors'), expectedErrors, 'internal errors are not restored');
        });

        QUnit.test('external validation raise on value change should not restore internal validation errors', function(assert) {
            const externalError = { message: 'external error' };
            this.instance.option('validationError', externalError);

            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                    message: 'external error'
                }]
            });

            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            let keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);

            const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
            keyboard = keyboardMock($endDateBoxInput);

            this.raiseExternalValidation(keyboard);

            const { validationErrors } = this.instance.option();
            assert.strictEqual(validationErrors[0].message, 'external error', 'external error is added');
            assert.deepEqual(validationErrors[1], { message: 'Start value must be a date' }, 'internal error is not restored');
        });

        QUnit.test('internal validation fail should set isValid to false', function(assert) {
            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            const keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);

            assert.strictEqual(this.instance.option('isValid'), false, 'isValid is changed to false');
        });

        QUnit.test('internal validation success after fail should set isValid to true', function(assert) {
            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            const keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);
            this.successInternalValidation(keyboard);

            assert.strictEqual(this.instance.option('isValid'), true, 'isValid is changed to true');
        });

        QUnit.test('external validation success should not set isValid to true if internal validation is failed', function(assert) {
            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => true,
                    message: 'external error'
                }]
            });

            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            let keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);

            const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
            keyboard = keyboardMock($endDateBoxInput);

            this.raiseExternalValidation(keyboard);

            assert.strictEqual(this.instance.option('isValid'), false, 'isValid is still false');
        });

        QUnit.test('external validation fail should set isValid to false even if internal validation is passed', function(assert) {
            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                    message: 'external error'
                }]
            });

            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            let keyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(keyboard);
            this.successInternalValidation(keyboard);

            const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
            keyboard = keyboardMock($endDateBoxInput);

            this.raiseExternalValidation(keyboard);

            assert.strictEqual(this.instance.option('isValid'), false, 'isValid is set to false');
        });

        QUnit.test('external validation success after fail should set isValid to true', function(assert) {
            let validationCallCount = 0;
            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => {
                        validationCallCount++;
                        if(validationCallCount === 2) {
                            return true;
                        }

                        return false;
                    },
                    message: 'external error'
                }]
            });

            const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
            const keyboard = keyboardMock($endDateBoxInput);

            keyboard
                .caret({ start: 0, end: 10 })
                .type('5/5/2023')
                .change()
                .caret({ start: 0, end: 10 })
                .type('5/4/2023')
                .change();

            assert.strictEqual(this.instance.option('isValid'), true, 'isValid is set to true');
        });

        QUnit.test('external validation fail should update validationErrors if other internal validation is already failed', function(assert) {
            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => {
                        return false;
                    },
                    message: 'external error'
                }]
            });

            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            const startDateBoxKeyboard = keyboardMock($startDateBoxInput);
            this.failInternalValidation(startDateBoxKeyboard);

            const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
            const endDateBoxKeyboard = keyboardMock($endDateBoxInput);
            this.raiseExternalValidation(endDateBoxKeyboard);

            const errors = this.instance.option('validationErrors');
            assert.strictEqual(errors.length, 2, 'there are 2 validation errors');
            assert.strictEqual(errors[0].message, 'external error', 'first error is external');
            assert.deepEqual(errors[1].message, 'Start value must be a date', 'second error is internal');
        });

        QUnit.test('external validation raise using "validate" method should not restore internal validation errors', function(assert) {
            const externalError = { message: 'external error' };
            this.instance.option('validationError', externalError);

            const validator = this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                    message: 'external error'
                }]
            }).dxValidator('instance');

            const $startDateBoxInput = $(getStartDateBoxInstance(this.instance).field());
            const startDateBoxKeyboard = keyboardMock($startDateBoxInput);

            this.failInternalValidation(startDateBoxKeyboard);

            validator.validate();

            const { validationErrors } = this.instance.option();
            assert.strictEqual(validationErrors[0].message, 'external error', 'external error is added');
            assert.deepEqual(validationErrors[1], { message: 'Start value must be a date' }, 'internal error is not restored');
        });

        ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
            QUnit.module(dateBoxName, {
                beforeEach: function() {
                    this.dateBox = dateBoxName === 'startDateBox'
                        ? getStartDateBoxInstance(this.instance)
                        : getEndDateBoxInstance(this.instance);
                    this.$dateBoxInput = $(this.dateBox.field());
                }
            }, () => {
                QUnit.test('internal validation fail should set dateRangeBox isValid to false', function(assert) {
                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.failInternalValidation(keyboard);

                    assert.deepEqual(this.instance.option('isValid'), false, 'isValid is updated');
                });

                QUnit.test('internal validation success should set dateRangeBox isValid to true if there is no other errors', function(assert) {
                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.failInternalValidation(keyboard);
                    this.successInternalValidation(keyboard);

                    assert.deepEqual(this.instance.option('isValid'), true, 'isValid is updated');
                });

                QUnit.test('internal validation success should not set dateRangeBox isValid to true if there is an other error', function(assert) {
                    this.instance.option('isValid', false);
                    this.instance.option('validationError', { message: 'external error' });

                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.failInternalValidation(keyboard);
                    this.successInternalValidation(keyboard);

                    assert.strictEqual(this.instance.option('isValid'), false, 'isValid=false while there is an other error');
                });

                QUnit.test('internal date validation fail should update dateRangeBox validationErrors', function(assert) {
                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.failInternalValidation(keyboard);

                    const message = dateBoxName === 'startDateBox' ? 'Start value must be a date' : 'End value must be a date';
                    const expectedErrors = [{ message }];
                    assert.deepEqual(this.instance.option('validationErrors'), expectedErrors, 'dateRangeBox validationError is updated');
                });

                QUnit.test('internal date validation fail should update dateRangeBox validationErrors even if it is not empty', function(assert) {
                    const externalError = { message: 'external validation failed' };
                    this.instance.option('validationError', externalError);

                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.failInternalValidation(keyboard);

                    const message = dateBoxName === 'startDateBox' ? 'Start value must be a date' : 'End value must be a date';
                    const expectedErrors = [externalError, { message }];
                    assert.deepEqual(this.instance.option('validationErrors'), expectedErrors, 'dateRangeBox validationError is updated');
                });

                QUnit.test('internal date validation success should remove internal errors from dateRangeBox validationErrors', function(assert) {
                    const externalError = { message: 'external validation failed' };
                    this.instance.option('validationError', externalError);

                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.failInternalValidation(keyboard);
                    this.successInternalValidation(keyboard);

                    const expectedErrors = [externalError];
                    assert.deepEqual(this.instance.option('validationErrors'), expectedErrors, 'dateRangeBox validationError is updated');
                });
            });
        });

        QUnit.test('startDateBox should become valid after internal validation pass', function(assert) {
            this.reinit({
                value: [null, null],
                opened: true
            });

            const startDateBox = getStartDateBoxInstance(this.instance);

            const $startDateBoxInput = $(startDateBox.field());
            let keyboard = keyboardMock($startDateBoxInput);
            this.failInternalValidation(keyboard);

            const $endDateBoxInput = $(getEndDateBoxInstance(this.instance).field());
            keyboard = keyboardMock($endDateBoxInput);
            this.failInternalValidation(keyboard);

            keyboard.press('enter');
            keyboard = keyboardMock($startDateBoxInput);
            keyboard.press('enter');

            assert.strictEqual(startDateBox.option('isValid'), true);
        });
    });

    QUnit.module('submit value', () => {
        ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
            QUnit.module(dateBoxName, {
                beforeEach: function() {
                    this.reinit({
                        value: [new Date('2023/5/5'), new Date('2023/5/5')]
                    });

                    this.dateBox = dateBoxName === 'startDateBox'
                        ? getStartDateBoxInstance(this.instance)
                        : getEndDateBoxInstance(this.instance);
                    this.$dateBoxInput = $(this.dateBox.field());
                    this.$dateBoxSubmitInput = $(this.dateBox.$element().find('input[type=hidden]'));
                }
            }, () => {
                QUnit.test('submit value should be updated if internal validation is failed', function(assert) {
                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.failInternalValidation(keyboard);

                    assert.strictEqual(this.$dateBoxSubmitInput.val(), '2023-05-05', 'submit value is updated');
                });

                QUnit.test('submit value should be updated if external validation is failed', function(assert) {
                    const keyboard = keyboardMock(this.$dateBoxInput);

                    this.raiseExternalValidation(keyboard);

                    assert.strictEqual(this.$dateBoxSubmitInput.val(), '2023-05-05', 'submit value is updated');
                });
            });
        });
    });

    QUnit.module('min-max validation', () => {
        QUnit.test('validation should be success if min/max is specified on init', function(assert) {
            this.reinit({
                min: new Date('2023/4/5'),
                max: new Date('2023/4/8'),
                value: [new Date('2023/4/6'), new Date('2023/4/7')]
            });

            assert.strictEqual(this.instance.option('isValid'), true, 'validation is success');
        });

        QUnit.test('validation should be success if min/max is specified on runtime', function(assert) {
            this.reinit({ value: [new Date('2023/4/6'), new Date('2023/4/7')] });


            this.instance.option({
                min: new Date('2023/4/5'),
                max: new Date('2023/4/7'),
            });

            assert.strictEqual(this.instance.option('isValid'), true, 'validation is success');
        });

        QUnit.test('validation should be not failed if value is out of range specified on init', function(assert) {
            this.reinit({
                value: [new Date('2023/4/4'), new Date('2023/4/8')],
                min: new Date('2023/4/5'),
                max: new Date('2023/4/7'),
            });

            assert.strictEqual(this.instance.option('isValid'), true, 'validation is success');
        });

        QUnit.test('validation should be failed if value is out of range specified on runtime', function(assert) {
            this.reinit({
                value: [new Date('2023/4/4'), new Date('2023/4/8')]
            });

            this.instance.option({
                min: new Date('2023/4/5'),
                max: new Date('2023/4/7'),
            });

            assert.strictEqual(this.instance.option('isValid'), false, 'validation is failed');

            const expectedErrors = [{ message: 'Start date is out of range' }, { message: 'End date is out of range' }];
            assert.deepEqual(this.instance.option('validationErrors'), expectedErrors);
        });

        QUnit.test('validation should be failed after value change to the date out of range', function(assert) {
            this.reinit({
                min: new Date('2023/4/5'),
                max: new Date('2023/4/7'),
            });

            this.instance.option({
                value: [new Date('2023/4/4'), new Date('2023/4/8')]
            });

            assert.strictEqual(this.instance.option('isValid'), false, 'validation is failed');

            const expectedErrors = [{ message: 'Start date is out of range' }, { message: 'End date is out of range' }];
            assert.deepEqual(this.instance.option('validationErrors'), expectedErrors);
        });
    });

    QUnit.module('applyValueMode="useButtons"', {
        beforeEach: function() {
            this.instance.option({
                applyValueMode: 'useButtons',
                opened: true,
                value: [new Date('2023/5/5'), null]
            });
        },
        clickApplyValueButton: function() {
            $(APPLY_BUTTON_SELECTOR).first().trigger('dxclick');
        }
    }, () => {
        QUnit.test('should not raise validation error on "Ok" button click without date selecting', function(assert) {
            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                }]
            });

            $(APPLY_BUTTON_SELECTOR).trigger('dxclick');

            assert.strictEqual(this.instance.option('isValid'), true, 'dateBox is still valid');
        });

        QUnit.test('should raise external validation on value change by "Ok" button click', function(assert) {
            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                    message: 'external error'
                }]
            });

            $(`.${CALENDAR_CELL_CLASS}`).eq(0).trigger('dxclick');
            $(APPLY_BUTTON_SELECTOR).trigger('dxclick');

            assert.strictEqual(this.instance.option('isValid'), false, 'custom validation is failed');
        });
    });

    QUnit.module('value clear', () => {
        QUnit.test('clear button press should raise external validation', function(assert) {
            this.reinit({
                showClearButton: true,
                value: [new Date('2023/4/4'), new Date('2023/4/8')]
            });

            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false,
                }]
            });

            getClearButton(this.$element).eq(0).trigger('dxclick');

            assert.strictEqual(this.instance.option('isValid'), false, 'external validation is failed');
        });

        QUnit.test('clear method call should raise external validation', function(assert) {
            this.reinit({
                value: [new Date('2023/4/4'), new Date('2023/4/8')]
            });

            this.$element.dxValidator({
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false
                }]
            });

            this.instance.clear();

            assert.strictEqual(this.instance.option('isValid'), false, 'external validation is failed');
        });
    });
});

QUnit.module('localization', moduleConfig, () => {
    const localeVariablesMap = {
        applyButtonText: 'OK',
        cancelButtonText: 'Cancel',
        endDateLabel: 'dxDateRangeBox-endDateLabel',
        invalidStartDateMessage: 'dxDateRangeBox-invalidStartDateMessage',
        invalidEndDateMessage: 'dxDateRangeBox-invalidEndDateMessage',
        startDateLabel: 'dxDateRangeBox-startDateLabel',
        startDateOutOfRangeMessage: 'dxDateRangeBox-startDateOutOfRangeMessage',
        todayButtonText: 'dxCalendar-todayButtonText',
    };

    QUnit.test('default value is received from the dictionary', function(assert) {
        Object.keys(localeVariablesMap).forEach((optionName, index) => {
            const variableName = localeVariablesMap[optionName];
            localization.loadMessages({
                'en': {
                    [variableName]: index + 1
                }
            });
        });

        this.reinit();

        Object.keys(localeVariablesMap).forEach((optionName, index) => {
            assert.strictEqual(this.instance.option(optionName), index + 1, optionName);
        });
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

QUnit.module('Aria accessibility', {
    beforeEach: function() {
        moduleConfig.beforeEach.apply(this);

        this.checkInputAttributes = (attrName, expectedValue) => {
            QUnit.assert.strictEqual(this.$startDateInput.attr(attrName), expectedValue, `${attrName} attr value of start input`);
            QUnit.assert.strictEqual(this.$endDateInput.attr(attrName), expectedValue, `${attrName} attr value of end input`);
        };
    },

    afterEach: function() {
        moduleConfig.afterEach.apply(this);
    }
}, () => {
    QUnit.test('aria-owns attribute should be added to root element when popup is open and removed when popup is closed', function(assert) {
        assert.strictEqual(this.$element.attr('aria-owns'), undefined, 'aria-owns');

        this.instance.open();

        assert.strictEqual(this.$element.attr('aria-owns'), this.getPopupContent().attr('id'), 'aria-owns');

        this.instance.close();

        assert.strictEqual(this.$element.attr('aria-owns'), undefined, 'aria-owns');
    });

    QUnit.test('aria-owns attribute should not be added to root element of nested dateboxes', function(assert) {
        assert.strictEqual(this.$startDateBox.attr('aria-owns'), undefined, 'aria-owns attr value of start datebox');
        assert.strictEqual(this.$endDateBox.attr('aria-owns'), undefined, 'aria-owns attr value of end datebox');

        this.instance.open();

        assert.strictEqual(this.$startDateBox.attr('aria-owns'), undefined, 'aria-owns attr value of start datebox');
        assert.strictEqual(this.$endDateBox.attr('aria-owns'), undefined, 'aria-owns attr value of end datebox');

        this.instance.close();

        assert.strictEqual(this.$startDateBox.attr('aria-owns'), undefined, 'aria-owns attr value of start datebox');
        assert.strictEqual(this.$endDateBox.attr('aria-owns'), undefined, 'aria-owns attr value of end datebox');
    });

    QUnit.test('aria-expanded attribute with false value should be added to each input on initialization if opened is false', function(assert) {
        this.reinit({
            opened: false
        });

        this.checkInputAttributes('aria-expanded', 'false');
    });

    QUnit.test('aria-expanded attribute with true value should be added to each input on initialization if opened is true', function(assert) {
        this.reinit({
            opened: true
        });

        this.checkInputAttributes('aria-expanded', 'true');
    });

    QUnit.test('aria-expanded attribute value should be toggled for each input after change opened option value in runtime', function(assert) {
        this.instance.open();

        this.checkInputAttributes('aria-expanded', 'true');

        this.instance.close();

        this.checkInputAttributes('aria-expanded', 'false');
    });

    ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
        QUnit.test(`aria-expanded attribute value should be toggled for each input if ${dateBoxName} opened option is changed`, function(assert) {
            const dateBox = dateBoxName === 'startDateBox'
                ? this.instance.getStartDateBox()
                : this.instance.getEndDateBox();

            dateBox.option('opened', true);

            this.checkInputAttributes('aria-expanded', 'true');

            dateBox.option('opened', false);

            this.checkInputAttributes('aria-expanded', 'false');
        });
    });

    [true, false].forEach(deferRendering => {
        QUnit.test(`aria-controls attribute value with deferRendering="${deferRendering} on initialization"`, function(assert) {
            this.reinit({
                deferRendering,
            });

            const expectedAriaControlsValue = deferRendering ? undefined : this.getPopupContent().attr('id');

            this.checkInputAttributes('aria-controls', expectedAriaControlsValue);
        });

        QUnit.test(`aria-controls attribute value of each input should equal popup content identifier if popup is rendered, deferRendering="${deferRendering}"`, function(assert) {
            this.reinit({
                deferRendering,
            });

            this.instance.open();

            this.checkInputAttributes('aria-controls', this.getPopupContent().attr('id'));

            this.instance.close();

            this.checkInputAttributes('aria-controls', this.getPopupContent().attr('id'));
        });

        ['startDateBox', 'endDateBox'].forEach((dateBoxName) => {
            QUnit.test(`aria-controls attribute value of each input should equal popup content identifier if ${dateBoxName} opened option is changed, deferRendering="${deferRendering}`, function(assert) {
                this.reinit({
                    deferRendering,
                });

                const dateBox = dateBoxName === 'startDateBox'
                    ? this.instance.getStartDateBox()
                    : this.instance.getEndDateBox();

                dateBox.option('opened', true);

                this.checkInputAttributes('aria-controls', this.getPopupContent().attr('id'));

                dateBox.option('opened', false);

                this.checkInputAttributes('aria-controls', this.getPopupContent().attr('id'));
            });
        });

        QUnit.test('aria-activedescendant attribute value of each input should equal contoured calendar cell\'s identifier, deferRendering="${deferRendering}', function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'test does not actual for mobile devices');
                return;
            }

            this.reinit({
                calendarOptions: {
                    currentDate: new Date(2021, 9, 17),
                },
                deferRendering,
            });

            const contouredCellID = this.getPopupContent().find(`.${CALENDAR_CONTOURED_CELL_CLASS}`).attr('id');

            this.checkInputAttributes('aria-activedescendant', deferRendering ? undefined : contouredCellID);
        });

        QUnit.test('aria-activedescendant attribute value of each input should be saved after change opened option value to false in runtime', function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'test does not actual for mobile devices');
                return;
            }

            this.reinit({
                calendarOptions: {
                    currentDate: new Date(2021, 9, 17),
                },
                opened: true,
            });

            const contouredCellID = this.getPopupContent().find(`.${CALENDAR_CONTOURED_CELL_CLASS}`).attr('id');

            this.instance.option('opened', false);

            this.checkInputAttributes('aria-activedescendant', contouredCellID);
        });
    });

    QUnit.test('aria-activedescendant attribute value of each input should be synchronized with contoured calendar cell\'s identifier after navigation in calendar', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({
            calendarOptions: {
                currentDate: new Date(2021, 9, 17),
            },
            opened: true,
        });

        const getContouredCell = () => {
            return this.getPopupContent().find(`.${CALENDAR_CONTOURED_CELL_CLASS}`);
        };

        const contouredCellID = getContouredCell().attr('id');

        keyboardMock(this.$startDateInput).keyDown('right');

        const newContouredCellID = getContouredCell().attr('id');

        assert.strictEqual(newContouredCellID === contouredCellID, false, 'countoured cell is changed');
        this.checkInputAttributes('aria-activedescendant', newContouredCellID);
    });
});

QUnit.module('isDirty', moduleConfig, () => {
    QUnit.test('should be false by default', function(assert) {
        assert.strictEqual(this.instance.option('isDirty'), false);
    });

    QUnit.test('should be set to true after value changed', function(assert) {
        this.instance.option('value', ['2023/02/02', null]);

        assert.strictEqual(this.instance.option('isDirty'), true);
    });

    QUnit.test('should be false if value updated to initial', function(assert) {
        const initialValue = ['2023/02/02', '2023/01/01'];
        this.reinit({ value: initialValue });

        this.instance.option('value', ['2023/02/02', null]);
        this.instance.option('value', initialValue);

        assert.strictEqual(this.instance.option('isDirty'), false);
    });

    QUnit.test('should be set to true after startDateBox value changed', function(assert) {
        this.instance.getStartDateBox().option('value', '2023/03/03');

        assert.strictEqual(this.instance.option('isDirty'), true);
    });

    QUnit.test('should be set to true after endDateBox value changed', function(assert) {
        this.instance.getEndDateBox().option('value', '2023/03/03');

        assert.strictEqual(this.instance.option('isDirty'), true);
    });
});

if(devices.real().deviceType === 'desktop') {
    QUnit.module('Keyboard navigation', moduleConfig, () => {
        const toolbarItems = [{
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
        }];

        QUnit.test('pressing tab should set focus on previous month button in calendar', function(assert) {
            this.reinit({
                opened: true,
                applyValueMode: 'useButtons',
            });

            this.$endDateInput
                .focus()
                .trigger($.Event('keydown', {
                    key: 'Tab',
                }));

            const $prevButton = this.getPopupContent().parent().find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`);
            assert.ok($prevButton.hasClass(STATE_FOCUSED_CLASS));
        });

        QUnit.test('pressing tab + shift should set focus on cancel button in popup', function(assert) {
            this.reinit({
                opened: true,
                applyValueMode: 'useButtons',
            });
            this.$startDateInput
                .focus()
                .trigger($.Event('keydown', {
                    key: 'Tab',
                    shiftKey: true
                }));

            const $cancelButton = this.getPopupContent().parent().find(CANCEL_BUTTON_SELECTOR);
            assert.ok($cancelButton.hasClass(STATE_FOCUSED_CLASS));
        });

        QUnit.test('pressing tab should set focus on first item in popup with custom items', function(assert) {
            this.reinit({
                opened: true,
                applyValueMode: 'useButtons',
                dropDownOptions: {
                    toolbarItems,
                },
            });
            this.$endDateInput
                .focus()
                .trigger($.Event('keydown', {
                    key: 'Tab',
                }));

            const $firstItem = this.getPopupContent().parent().find(BUTTON_SELECTOR);
            assert.ok($firstItem.hasClass(STATE_FOCUSED_CLASS));
        });

        QUnit.test('pressing tab + shift should set focus on last item in popup with custom items', function(assert) {
            this.reinit({
                opened: true,
                applyValueMode: 'useButtons',
                dropDownOptions: {
                    toolbarItems,
                },
            });
            this.$startDateInput
                .focus()
                .trigger($.Event('keydown', {
                    key: 'Tab',
                    shiftKey: true
                }));

            const $lastItem = this.getPopupContent().parent().find(TEXTBOX_SELECTOR);
            assert.ok($lastItem.hasClass(STATE_FOCUSED_CLASS));
        });
    });
}

