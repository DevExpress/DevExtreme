const $ = require('jquery');
const NumberBox = require('ui/number_box');

require('common.css!');

QUnit.testStart(function() {
    const markup =
        '<div id="element"></div>';

    $('#qunit-fixture').html(markup);
});

const NUMBERBOX_CLASS = 'dx-numberbox';
const INVALID_CLASS = 'dx-invalid';
const SPIN_CLASS = 'dx-numberbox-spin';
const SPIN_CONTAINER_CLASS = 'dx-numberbox-spin-container';
const SPIN_UP_CLASS = 'dx-numberbox-spin-up';
const SPIN_DOWN_CLASS = 'dx-numberbox-spin-down';
const TEXTEDITOR_CLASS = 'dx-texteditor';
const INPUT_CLASS = 'dx-texteditor-input';
const CONTAINER_CLASS = 'dx-texteditor-container';
const SPIN_TOUCH_FRIENDLY_CLASS = 'dx-numberbox-spin-touch-friendly';
const PLACEHOLDER_CLASS = 'dx-placeholder';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#element');
    }
};

QUnit.module('dxNumberBox markup', moduleConfig, () => {
    QUnit.test('base markup', function(assert) {
        const element = this.$element.dxNumberBox();

        assert.ok(element.hasClass(NUMBERBOX_CLASS));
        assert.ok(element.hasClass(TEXTEDITOR_CLASS));

        assert.equal(element.find('.' + INPUT_CLASS).length, 1);
        assert.equal(element.find('.' + CONTAINER_CLASS).length, 1);
    });

    QUnit.test('input type should depend on mode option', function(assert) {
        const types = [
            { mode: 'tel', prop: 'tel' },
            { mode: 'number', prop: 'number' },
            { mode: 'text', prop: 'text' },
            { mode: 'tel', prop: 'tel' }
        ];

        types.forEach(function(type) {
            this.$element.dxNumberBox({ mode: type.mode });
            assert.equal(this.$element.find('.' + INPUT_CLASS).prop('type'), type.prop, 'when mode is ' + type.mode + ', type should be ' + type.prop);
        }.bind(this));
    });

    QUnit.test('numberbox should have correct markup with masks', function(assert) {
        const $element = this.$element.dxNumberBox({
            useMaskBehavior: true,
            format: '$ #0.00',
            value: 1
        });
        const $input = $element.find('.' + INPUT_CLASS);

        assert.equal($input.val(), '$ 1.00', 'value is correct');
    });

    QUnit.test('init with options', function(assert) {
        assert.expect(2);

        const element = this.$element.dxNumberBox({
            min: 0,
            max: 100
        });

        const $input = element.find('.' + INPUT_CLASS);

        assert.equal($input.prop('min'), 0);
        assert.equal($input.prop('max'), 100);
    });

    QUnit.test('init with option useLargeSpinButtons', function(assert) {
        const $element = this.$element.dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: true
        });

        assert.ok($element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), 'element has touchFriendly class');
    });

    QUnit.test('placeholder is visible when value is invalid', function(assert) {
        const $element = this.$element.dxNumberBox({
            placeholder: 'Placeholder',
            value: ''
        });
        const $placeholder = $element.find('.' + PLACEHOLDER_CLASS);

        assert.equal($placeholder.data('dx_placeholder'), 'Placeholder', 'text is correct');
    });

    QUnit.test('T220209 - the \'displayValueFormatter\' option', function(assert) {
        const $numberBox = this.$element.dxNumberBox({
            value: 5,
            displayValueFormatter: function(value) {
                return (value < 10 ? '0' : '') + value;
            }
        });

        assert.equal($numberBox.dxNumberBox('option', 'value'), 5, 'value is correct');
        assert.equal($numberBox.find('.dx-texteditor-input').val(), '05', 'input value is correct');
    });

    QUnit.test('The widget should be valid if the value option is undefined', function(assert) {
        const numberBox = new NumberBox(this.$element, { value: undefined }); const $input = this.$element.find('.' + INPUT_CLASS);

        assert.ok(numberBox.option('isValid'), 'widget is valid');
        assert.equal($input.val(), '', 'input value is correct');
    });

    QUnit.test('The widget should be invalid if isValid option is false on init but value format is correct', function(assert) {
        const $numberBox = this.$element.dxNumberBox({
            value: 0,
            isValid: false
        });

        assert.ok($numberBox.hasClass(INVALID_CLASS), 'widget is invalid');
    });

    QUnit.test('Spin buttons should not be rendered bu default', function(assert) {
        this.$element.dxNumberBox();

        const $spinContainer = this.$element.find('.' + SPIN_CONTAINER_CLASS);

        assert.notOk(this.$element.hasClass(SPIN_CLASS), 'number box has not spin class');
        assert.equal($spinContainer.length, 0, 'number box has no spin containers');
    });

    QUnit.test('Spin buttons should be rendered if showSpinButtons is true', function(assert) {
        this.$element.dxNumberBox({ showSpinButtons: true });

        const $spinContainer = this.$element.find('.' + SPIN_CONTAINER_CLASS);

        assert.ok(this.$element.hasClass(SPIN_CLASS), 'number box has a spin class');
        assert.equal($spinContainer.length, 1, 'number box has spin container');
        assert.equal($spinContainer.find('.' + SPIN_UP_CLASS).length, 1, 'spin up button exists');
        assert.equal($spinContainer.find('.' + SPIN_DOWN_CLASS).length, 1, 'spin down button exists');
    });

    QUnit.test('useLargeSpinButtons option should toggle touch friendly spin buttons', function(assert) {
        new NumberBox(this.$element, {
            showSpinButtons: true,
            useLargeSpinButtons: false
        });

        assert.ok(!this.$element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), 'element has not touchFriendly class');
    });

    QUnit.test('a hidden input should be rendered', function(assert) {
        const $element = this.$element.dxNumberBox(); const $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal($hiddenInput.length, 1, 'a hidden input is created');
    });

    QUnit.test('the hidden input should get correct value on init', function(assert) {
        const expectedValue = 24.8;
        const $element = this.$element.dxNumberBox({
            value: expectedValue
        });
        const $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal(parseFloat($hiddenInput.val()), expectedValue, 'the hidden input has correct value after init');
    });

    QUnit.test('hidden input should get the \'name\' attribute', function(assert) {
        const expectedName = 'name';

        this.$element.dxNumberBox({
            name: expectedName
        });

        const $hiddenInput = $('input[type=\'hidden\']');

        assert.equal($hiddenInput.attr('name'), expectedName, 'hidden input has correct \'name\' attribute');
    });

    QUnit.test('editor input should not get the \'name\' attribute', function(assert) {
        const $element = this.$element.dxNumberBox({
            name: 'name'
        });
        const input = $element.find('.' + INPUT_CLASS).get(0);

        assert.notOk(input.hasAttribute('name'), 'edior input does not have the \'name\' attribute');
    });
});

