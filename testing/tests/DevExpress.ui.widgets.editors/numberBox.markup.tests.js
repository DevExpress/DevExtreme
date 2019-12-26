var $ = require('jquery'),
    NumberBox = require('ui/number_box');

require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="element"></div>';

    $('#qunit-fixture').html(markup);
});

var NUMBERBOX_CLASS = 'dx-numberbox',
    INVALID_CLASS = 'dx-invalid',
    SPIN_CLASS = 'dx-numberbox-spin',
    SPIN_CONTAINER_CLASS = 'dx-numberbox-spin-container',
    SPIN_UP_CLASS = 'dx-numberbox-spin-up',
    SPIN_DOWN_CLASS = 'dx-numberbox-spin-down',
    TEXTEDITOR_CLASS = 'dx-texteditor',
    INPUT_CLASS = 'dx-texteditor-input',
    CONTAINER_CLASS = 'dx-texteditor-container',
    SPIN_TOUCH_FRIENDLY_CLASS = 'dx-numberbox-spin-touch-friendly',
    PLACEHOLDER_CLASS = 'dx-placeholder';

var moduleConfig = {
    beforeEach: function() {
        this.$element = $('#element');
    }
};

QUnit.module('dxNumberBox markup', moduleConfig, () => {
    QUnit.test('base markup', function(assert) {
        var element = this.$element.dxNumberBox();

        assert.ok(element.hasClass(NUMBERBOX_CLASS));
        assert.ok(element.hasClass(TEXTEDITOR_CLASS));

        assert.equal(element.find('.' + INPUT_CLASS).length, 1);
        assert.equal(element.find('.' + CONTAINER_CLASS).length, 1);
    });

    QUnit.test('input type should depend on mode option', function(assert) {
        var types = [
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
        var $element = this.$element.dxNumberBox({
                useMaskBehavior: true,
                format: '$ #0.00',
                value: 1
            }),
            $input = $element.find('.' + INPUT_CLASS);

        assert.equal($input.val(), '$ 1.00', 'value is correct');
    });

    QUnit.test('init with options', function(assert) {
        assert.expect(2);

        var element = this.$element.dxNumberBox({
            min: 0,
            max: 100
        });

        var $input = element.find('.' + INPUT_CLASS);

        assert.equal($input.prop('min'), 0);
        assert.equal($input.prop('max'), 100);
    });

    QUnit.test('init with option useLargeSpinButtons', function(assert) {
        var $element = this.$element.dxNumberBox({
            showSpinButtons: true,
            useLargeSpinButtons: true
        });

        assert.ok($element.hasClass(SPIN_TOUCH_FRIENDLY_CLASS), 'element has touchFriendly class');
    });

    QUnit.test('placeholder is visible when value is invalid', function(assert) {
        var $element = this.$element.dxNumberBox({
                placeholder: 'Placeholder',
                value: ''
            }),
            $placeholder = $element.find('.' + PLACEHOLDER_CLASS);

        assert.equal($placeholder.data('dx_placeholder'), 'Placeholder', 'text is correct');
    });

    QUnit.test('T220209 - the \'displayValueFormatter\' option', function(assert) {
        var $numberBox = this.$element.dxNumberBox({
            value: 5,
            displayValueFormatter: function(value) {
                return (value < 10 ? '0' : '') + value;
            }
        });

        assert.equal($numberBox.dxNumberBox('option', 'value'), 5, 'value is correct');
        assert.equal($numberBox.find('.dx-texteditor-input').val(), '05', 'input value is correct');
    });

    QUnit.test('The widget should be valid if the value option is undefined', function(assert) {
        var numberBox = new NumberBox(this.$element, { value: undefined }),
            $input = this.$element.find('.' + INPUT_CLASS);

        assert.ok(numberBox.option('isValid'), 'widget is valid');
        assert.equal($input.val(), '', 'input value is correct');
    });

    QUnit.test('The widget should be invalid if isValid option is false on init but value format is correct', function(assert) {
        var $numberBox = this.$element.dxNumberBox({
            value: 0,
            isValid: false
        });

        assert.ok($numberBox.hasClass(INVALID_CLASS), 'widget is invalid');
    });

    QUnit.test('Spin buttons should not be rendered bu default', function(assert) {
        this.$element.dxNumberBox();

        var $spinContainer = this.$element.find('.' + SPIN_CONTAINER_CLASS);

        assert.notOk(this.$element.hasClass(SPIN_CLASS), 'number box has not spin class');
        assert.equal($spinContainer.length, 0, 'number box has no spin containers');
    });

    QUnit.test('Spin buttons should be rendered if showSpinButtons is true', function(assert) {
        this.$element.dxNumberBox({ showSpinButtons: true });

        var $spinContainer = this.$element.find('.' + SPIN_CONTAINER_CLASS);

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
        var $element = this.$element.dxNumberBox(),
            $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal($hiddenInput.length, 1, 'a hidden input is created');
    });

    QUnit.test('the hidden input should get correct value on init', function(assert) {
        var expectedValue = 24.8,
            $element = this.$element.dxNumberBox({
                value: expectedValue
            }),
            $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal(parseFloat($hiddenInput.val()), expectedValue, 'the hidden input has correct value after init');
    });

    QUnit.test('hidden input should get the \'name\' attribute', function(assert) {
        var expectedName = 'name';

        this.$element.dxNumberBox({
            name: expectedName
        });

        var $hiddenInput = $('input[type=\'hidden\']');

        assert.equal($hiddenInput.attr('name'), expectedName, 'hidden input has correct \'name\' attribute');
    });

    QUnit.test('editor input should not get the \'name\' attribute', function(assert) {
        var $element = this.$element.dxNumberBox({
                name: 'name'
            }),
            input = $element.find('.' + INPUT_CLASS).get(0);

        assert.notOk(input.hasAttribute('name'), 'edior input does not have the \'name\' attribute');
    });
});

