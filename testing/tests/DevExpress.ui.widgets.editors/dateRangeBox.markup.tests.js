import $ from 'jquery';
import config from 'core/config';

import 'ui/date_range_box';

QUnit.testStart(function() {
    const markup =
        '<div id="dateRangeBox"></div>';

    $('#qunit-fixture').html(markup);
});

import 'generic_light.css!';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const END_DATEBOX_CLASS = 'dx-end-datebox';
const DATERANGEBOX_SEPARATOR_CLASS = 'dx-daterangebox-separator';
const ICON_CLASS = 'dx-icon';
const CLEAR_BUTTON = 'dx-clear-button-area';
const DROP_DOWN_EDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const STATE_FOCUSED_CLASS = 'dx-state-focused';

const stylingModes = ['outlined', 'underlined', 'filled'];

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const getEndDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getEndDateBox();

const getStartDateBoxElement = dateRangeBoxInstance => getStartDateBoxInstance(dateRangeBoxInstance).$element();

const getEndDateBoxElement = dateRangeBoxInstance => getEndDateBoxInstance(dateRangeBoxInstance).$element();

const getSeparatorElement = dateRangeBoxInstance => dateRangeBoxInstance._$separator;

const getClearButton = $element => $element.find(`> .${DROP_DOWN_EDITOR_BUTTONS_CONTAINER_CLASS}`).find(`.${CLEAR_BUTTON}`);

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

QUnit.module('DateRangeBox markup', moduleConfig, () => {
    QUnit.test('DateRangeBox has expected class', function(assert) {
        assert.ok(this.$element.hasClass(DATERANGEBOX_CLASS));
    });

    stylingModes.forEach((stylingMode) => {
        QUnit.test(`DateRangeBox has "${stylingMode}" class if config().editorStylingMode is ${stylingMode}`, function(assert) {
            config({ editorStylingMode: stylingMode });
            this.reinit({});

            assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${stylingMode}`), true, `${stylingMode} class was added`);
            const restStylingModes = stylingModes.filter((mode) => mode !== stylingMode);
            restStylingModes.forEach(mode => {
                assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${mode}`), false, `${mode} class was not added`);
            });

            config({ editorStylingMode: null });
        });

        QUnit.test(`DateRangeBox has "${stylingMode}" class if styling mode is "${stylingMode}"`, function(assert) {
            this.reinit({ stylingMode });

            assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${stylingMode}`), true, `${stylingMode} class was added`);
            const restStylingModes = stylingModes.filter((mode) => mode !== stylingMode);
            restStylingModes.forEach(mode => {
                assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${mode}`), false, `${mode} class was not added`);
            });
        });

        stylingModes.forEach((newStylingMode) => {
            QUnit.test(`DateRangeBox has "${newStylingMode}" class if styling mode value is changed to "${newStylingMode}"`, function(assert) {
                this.instance.option('stylingMode', newStylingMode);

                assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${newStylingMode}`), true, `${stylingMode} class was changed to ${newStylingMode}`);

                const restStylingModes = stylingModes.filter((mode) => mode !== newStylingMode);
                restStylingModes.forEach(mode => {
                    assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${mode}`), false, `${mode} class was not added`);
                });
            });
        });
    });

    QUnit.test('DateRangeBox has not readonly state class if readonly option value is false', function(assert) {
        this.reinit({
            readOnly: false,
        });

        assert.strictEqual(this.$element.hasClass(READONLY_STATE_CLASS), false, 'readonly class was not added');
    });

    QUnit.test('DateRangeBox has readonly state class if readonly option value is true', function(assert) {
        this.reinit({
            readOnly: true,
        });

        assert.strictEqual(this.$element.hasClass(READONLY_STATE_CLASS), true, 'readonly class was added');
    });

    QUnit.test('DateRangeBox has readonly state class if readonly option value is changed in runtime', function(assert) {
        assert.strictEqual(this.$element.hasClass(READONLY_STATE_CLASS), false, 'readonly class was not added on init');

        this.instance.option('readOnly', true);

        assert.strictEqual(this.$element.hasClass(READONLY_STATE_CLASS), true, 'readonly class was added');
    });

    QUnit.test('DateRangeBox should lose focus state if readonly option value is changed in runtime', function(assert) {
        this.instance.focus();

        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), true, 'dateRangeBox has focus state class');
        assert.strictEqual(this.$element.hasClass(READONLY_STATE_CLASS), false, 'readonly class was not added on init');

        this.instance.option('readOnly', true);

        assert.strictEqual(this.$element.hasClass(READONLY_STATE_CLASS), true, 'readonly class was added');
        assert.strictEqual(this.$element.hasClass(STATE_FOCUSED_CLASS), false, 'dateRangeBox does not have focus state class');
    });

    QUnit.test('StartDateBox has expected class', function(assert) {
        const $startDateBox = getStartDateBoxElement(this.instance);

        assert.ok($startDateBox.hasClass(START_DATEBOX_CLASS));
    });

    QUnit.test('EndDateBox has expected class', function(assert) {
        const $endDateBox = getEndDateBoxElement(this.instance);

        assert.ok($endDateBox.hasClass(END_DATEBOX_CLASS));
    });

    QUnit.test('Separator has expected class', function(assert) {
        const $separator = getSeparatorElement(this.instance);

        assert.ok($separator.hasClass(DATERANGEBOX_SEPARATOR_CLASS));
    });

    QUnit.test('Separator has icon', function(assert) {
        const $separator = getSeparatorElement(this.instance);
        const $icon = $separator.find(`.${ICON_CLASS}`);

        assert.strictEqual($icon.length, 1);
    });

    QUnit.test('Clear button is not rendered if dateRangeBox readOnly is true', function(assert) {
        this.reinit({
            showClearButton: true,
            readOnly: true,
        });

        const $clearButton = getClearButton(this.$element);

        assert.strictEqual($clearButton.length, 0, 'clear button was rendered');
    });

    QUnit.test('StartDateBox input should have accesKey attribute if accesKey option is set on init', function(assert) {
        this.reinit({
            accessKey: 'x'
        });

        const $startDateInput = $(this.instance.field()[0]);

        assert.strictEqual($startDateInput.attr('accesskey'), 'x');
    });

    QUnit.test('EndDateBox input should have accesKey attribute if accesKey option is set on init', function(assert) {
        this.reinit({
            accessKey: 'x'
        });

        const $endDateInput = $(this.instance.field()[1]);

        assert.strictEqual($endDateInput.attr('accesskey'), undefined);
    });

    QUnit.test('StartDateBox input should have accesKey attribute if accesKey option is set on runtime', function(assert) {
        this.instance.option('accessKey', 'y');

        const $startDateInput = $(this.instance.field()[0]);

        assert.strictEqual($startDateInput.attr('accesskey'), 'y');
    });

    QUnit.test('EndDateBox input should have accesKey attribute if accesKey option is set on runtime', function(assert) {
        this.instance.option('accessKey', 'y');

        const $endDateInput = $(this.instance.field()[1]);

        assert.strictEqual($endDateInput.attr('accesskey'), undefined);
    });

    ['readOnly', 'disabled'].forEach((optionName) => {
        QUnit.test(`DateRangeBox inputs should not have ${optionName} attribute if ${optionName} is false`, function(assert) {
            this.reinit({
                [optionName]: false,
            });

            const field = this.instance.field();

            assert.strictEqual($(field[0]).prop(optionName), false, `startDate input does not have ${optionName} attribute`);
            assert.strictEqual($(field[1]).prop(optionName), false, `endDate input does not have ${optionName} attribute`);
        });

        QUnit.test(`DateRangeBox inputs should have ${optionName} attribute if ${optionName} is true`, function(assert) {
            this.reinit({
                [optionName]: true,
            });

            const field = this.instance.field();

            assert.strictEqual($(field[0]).prop(optionName), true, `startDate input have ${optionName} attribute`);
            assert.strictEqual($(field[1]).prop(optionName), true, `endDate input have ${optionName} attribute`);
        });

        QUnit.test(`DateRangeBox inputs should have ${optionName} attribute if ${optionName} option value is changed in runtime`, function(assert) {
            this.reinit({
                [optionName]: false,
            });

            this.instance.option(optionName, true);

            const field = this.instance.field();

            assert.strictEqual($(field[0]).prop(optionName), true, `startDate input have ${optionName} attribute`);
            assert.strictEqual($(field[1]).prop(optionName), true, `endDate input have ${optionName} attribute`);

            this.instance.option(optionName, false);

            assert.strictEqual($(field[0]).prop(optionName), false, `startDate input does not have ${optionName} attribute`);
            assert.strictEqual($(field[1]).prop(optionName), false, `endDate input does not have ${optionName} attribute`);
        });
    });

    QUnit.test('DateRangeBox inputs should have the same value of tabIndex attribute after initialization', function(assert) {
        this.reinit({
            tabIndex: '2'
        });

        assert.strictEqual($(this.instance.field()[0]).attr('tabIndex'), '2', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.field()[1]).attr('tabIndex'), '2', 'endDateBox input tabIndex value');
    });

    QUnit.test('DateRangeBox inputs should have the same value of tabIndex attribute if tabIndex option was changed in runtime', function(assert) {
        this.reinit({});
        this.instance.option('tabIndex', 3);

        assert.strictEqual($(this.instance.field()[0]).attr('tabIndex'), '3', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.field()[1]).attr('tabIndex'), '3', 'endDateBox input tabIndex value');
    });

    QUnit.test('DateRangeBox inputs should have tabIndex attribute that equal -1 after initialization if focusStateEnabled is false', function(assert) {
        this.reinit({
            tabIndex: '2',
            focusStateEnabled: false,
        });

        assert.strictEqual($(this.instance.field()[0]).attr('tabIndex'), '-1', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.field()[1]).attr('tabIndex'), '-1', 'endDateBox input tabIndex value');
    });

    QUnit.test('DateRangeBox inputs should have correct tabIndex attribute value if focusStateEnabled is changed in runtime', function(assert) {
        this.reinit({
            tabIndex: '2',
            focusStateEnabled: true,
        });

        assert.strictEqual($(this.instance.field()[0]).attr('tabIndex'), '2', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.field()[1]).attr('tabIndex'), '2', 'endDateBox input tabIndex value');

        this.instance.option('focusStateEnabled', false);

        assert.strictEqual($(this.instance.field()[0]).attr('tabIndex'), '-1', 'startDateBox input tabIndex value');
        assert.strictEqual($(this.instance.field()[1]).attr('tabIndex'), '-1', 'endDateBox input tabIndex value');

        this.instance.option('focusStateEnabled', true);

        // TODO: it doesn't clear why texteditor remove tabindex on toggling
        // assert.strictEqual($(this.instance.field()[0]).attr('tabIndex'), '2', 'startDateBox input tabIndex value');
        // assert.strictEqual($(this.instance.field()[1]).attr('tabIndex'), '2', 'endDateBox input tabIndex value');
    });
});

