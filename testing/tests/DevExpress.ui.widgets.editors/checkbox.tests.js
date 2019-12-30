import $ from 'jquery';
import devices from 'core/devices';
import keyboardMock from '../../helpers/keyboardMock.js';
import { validateGroup } from 'ui/validation_engine';

import 'common.css!';
import 'ui/check_box';
import 'ui/validator';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="checkbox"></div>\
            <div id="widget"></div>\
            <div id="widthRootStyle" style="width: 300px;"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const CHECKBOX_CLASS = 'dx-checkbox';
const CHECKBOX_CONTAINER_CLASS = 'dx-checkbox-container';
const CHECKBOX_CONTAINER_SELECTOR = '.dx-checkbox-container';
const ICON_SELECTOR = '.dx-checkbox-icon';
const CHECKED_CLASS = 'dx-checkbox-checked';
const CHECKBOX_TEXT_CLASS = 'dx-checkbox-text';
const CHECKBOX_HAS_TEXT_CLASS = 'dx-checkbox-has-text';


QUnit.module('render', function() {

    QUnit.test('markup init', function(assert) {
        const element = $('#checkbox').dxCheckBox();

        assert.ok(element.hasClass(CHECKBOX_CLASS));

        const checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

        assert.ok(checkboxContent.hasClass(CHECKBOX_CONTAINER_CLASS), 'checkbox has a container');

        assert.equal(checkboxContent.find(ICON_SELECTOR).length, 1, 'checkbox has an icon');
    });

    QUnit.test('init with default options', function(assert) {
        const element = $('#checkbox').dxCheckBox();
        const instance = element.dxCheckBox('instance');

        assert.equal(instance.option('value'), false, 'checkbox has a false value by default');
        assert.ok(!element.hasClass(CHECKED_CLASS));
        assert.ok(!element.hasClass(CHECKBOX_HAS_TEXT_CLASS, 'checkbox without text has not text class'));
    });

    QUnit.test('init with options', function(assert) {
        const element = $('#checkbox').dxCheckBox({
            value: true,
            text: 'text'
        });

        const checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

        assert.ok(element.hasClass(CHECKED_CLASS, 'checkBox is checked'));
        assert.equal($.trim(checkboxContent.find('.' + CHECKBOX_TEXT_CLASS).text()), 'text');
        assert.ok(element.hasClass(CHECKBOX_HAS_TEXT_CLASS), 'checkbox with text has text class');
    });

    QUnit.test('click triggers user handler and changes state', function(assert) {
        let checked = false;

        const element = $('#checkbox').dxCheckBox({
            onValueChanged: function(e) {
                assert.ok(e.value, 'value present');
                checked = true;
            }
        });

        const instance = element.dxCheckBox('instance');

        assert.ok(!checked);
        assert.ok(!instance.option('value'));

        element.trigger('dxclick');
        assert.ok(checked);
        assert.ok(instance.option('value'));
    });

    QUnit.test('changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        const checkbox = $('#checkbox').dxCheckBox({
            onValueChanged: function(args) {
                assert.equal(args.value, true, 'correct value present');
                assert.ok(true);
            }
        }).dxCheckBox('instance');
        checkbox.option('value', true);
    });

    QUnit.test('onContentReady fired after setting the value', function(assert) {
        assert.expect(2);

        $('#checkbox').dxCheckBox({
            value: true,
            onContentReady: function(e) {
                assert.ok($(e.element).find('input').val());
                assert.ok($(e.element).hasClass(CHECKBOX_CLASS));
            }
        });
    });
});

QUnit.module('validation', function() {

    if(devices.real().deviceType === 'desktop') {
        QUnit.test('the click should be processed before the validation message is shown (T570458)', (assert) => {
            const $checkbox = $('#checkbox')
                .dxCheckBox({})
                .dxValidator({
                    validationRules: [{ type: 'required', message: 'message' }]
                });
            const checkbox = $checkbox.dxCheckBox('instance');
            const isValidationMessageVisible = () => {
                const message = $checkbox.find('.dx-overlay-wrapper.dx-invalid-message').get(0);

                return message && window.getComputedStyle(message).visibility === 'visible';
            };

            validateGroup();
            assert.notOk(checkbox.option('isValid'));

            $checkbox.focus();
            assert.notOk(checkbox.option('isValid'));
            assert.notOk(isValidationMessageVisible());

            $checkbox.trigger('dxclick');
            assert.ok(checkbox.option('isValid'));
            assert.notOk(isValidationMessageVisible());

            $checkbox.trigger('dxclick');
            assert.notOk(checkbox.option('isValid'));
            assert.ok(isValidationMessageVisible());
        });

        QUnit.test('should show validation message after focusing', (assert) => {
            const clock = sinon.useFakeTimers();
            const $checkbox = $('#checkbox')
                .dxCheckBox({})
                .dxValidator({
                    validationRules: [{ type: 'required', message: 'message' }]
                });

            validateGroup();
            $checkbox.focus();
            clock.tick(200);

            const message = $checkbox.find('.dx-overlay-wrapper.dx-invalid-message').get(0);

            assert.strictEqual(window.getComputedStyle(message).visibility, 'visible');
            clock.restore();
        });
    }
});

QUnit.module('options', function() {

    QUnit.test('visible', function(assert) {
        const $element = $('#checkbox').dxCheckBox();
        const instance = $element.dxCheckBox('instance');
        instance.option('width', 1);
        assert.ok($element.is(':visible'), 'checkBox is visible');

        instance.option('visible', false);
        assert.ok($element.is(':hidden'), 'checkBox is hidden');
    });

    QUnit.test('text is changed according to the corresponding option', function(assert) {
        const $element = $('#checkbox').dxCheckBox();
        const instance = $element.dxCheckBox('instance');

        instance.option('text', 'new text');
        assert.equal($element.text(), 'new text', 'checkbox changed text to \'new text\'');

        instance.option('text', 'new text 2');
        assert.equal($element.text(), 'new text 2', 'checkbox changed text to \'new text 2\'');
    });

    QUnit.test('disabled', function(assert) {
        const $element = $('#checkbox').dxCheckBox({
            disabled: true,
            value: false
        });
        const instance = $element.dxCheckBox('instance');

        $element.trigger('dxclick');
        assert.equal(instance.option('value'), false);

        instance.option('disabled', false);
        $element.trigger('dxclick');
        assert.equal(instance.option('value'), true);
    });

    QUnit.test('checkbox icon must not resize according to the \'width\' and \'height\' options', function(assert) {
        const newSize = 50;

        const $element = $('#checkbox').dxCheckBox();
        const instance = $element.dxCheckBox('instance');
        const initWidth = $element.find(ICON_SELECTOR).width();
        const initHeight = $element.find(ICON_SELECTOR).height();

        instance.option('width', newSize);

        assert.equal($element.find(ICON_SELECTOR).width(), initWidth, 'icon width is not resized ');

        instance.option('height', newSize);

        assert.equal($element.find(ICON_SELECTOR).height(), initHeight, 'icon height is not resized');
    });

    QUnit.test('value option should be processed correctly (Q504139)', function(assert) {
        const $element = $('#checkbox').dxCheckBox({ value: undefined });
        const instance = $element.dxCheckBox('instance');
        assert.ok(!$element.hasClass(CHECKED_CLASS));

        instance.option({ value: null });
        assert.ok(!$element.hasClass(CHECKED_CLASS));

        instance.option({ value: 0 });
        assert.ok(!$element.hasClass(CHECKED_CLASS));
    });
});

QUnit.module('hidden input', function() {

    QUnit.test('the hidden input has \'true\' value', function(assert) {
        const $element = $('#checkbox').dxCheckBox({ value: true });
        const $input = $element.find('input');

        assert.equal($input.val(), 'true', 'a hidden input\'s value');
    });

    QUnit.test('the hidden input has \'false\' value', function(assert) {
        const $element = $('#checkbox').dxCheckBox();
        const $input = $element.find('input');

        assert.equal($input.val(), 'false', 'a hidden input\'s value');
    });

    QUnit.test('the hidden should change its value on widget value change', function(assert) {
        const $element = $('#checkbox').dxCheckBox({
            value: undefined
        });
        const instance = $element.dxCheckBox('instance');
        const $input = $element.find('input');

        instance.option('value', false);
        assert.equal($input.val(), 'false', 'input value has been changed');

        instance.option('value', true);
        assert.equal($input.val(), 'true', 'input value has been changed second time');
    });
});


QUnit.module('the \'name\' option', function() {

    QUnit.test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = $('#checkbox').dxCheckBox({
            name: expectedName
        });
        const $input = $element.find('input');

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});


QUnit.module('widget sizing render', function() {

    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxCheckBox({ width: 400 });
        const instance = $element.dxCheckBox('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxCheckBox();
        const instance = $element.dxCheckBox('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});


QUnit.module('keyboard navigation', function() {

    QUnit.test('check state changes on space press', function(assert) {
        assert.expect(2);

        const $element = $('#checkbox').dxCheckBox({
            focusStateEnabled: true,
            onValueChanged: function() {
                assert.ok(true, 'press space on button call click action');
            },
            value: false
        });
        const instance = $element.dxCheckBox('instance');
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        keyboard.keyDown('space');
        assert.equal(instance.option('value'), true, 'value has been change successfully');

    });
});

QUnit.module('events', function() {
    QUnit.test('valueChanged event fired after setting the value by click', function(assert) {
        const handler = sinon.stub();
        const $element = $('#checkbox').dxCheckBox({});
        const checkbox = $element.dxCheckBox('instance');

        checkbox.on('valueChanged', handler);

        $element.trigger('dxclick');
        assert.ok(handler.calledOnce);
    });

    QUnit.test('valueChanged event fired after setting the value by keyboard', function(assert) {
        const handler = sinon.stub();
        const $element = $('#checkbox').dxCheckBox({ focusStateEnabled: true });
        const checkbox = $element.dxCheckBox('instance');
        const keyboard = keyboardMock($element);

        checkbox.on('valueChanged', handler);

        $element.trigger('focusin');
        keyboard.keyDown('space');
        assert.ok(handler.calledOnce);
    });

    QUnit.test('valueChanged event fired after setting the value by option', function(assert) {
        const handler = sinon.stub();
        const $element = $('#checkbox').dxCheckBox({
            value: true
        });
        const checkbox = $element.dxCheckBox('instance');

        checkbox.on('valueChanged', handler);

        checkbox.option('value', false);
        assert.ok(handler.calledOnce);
    });
});

