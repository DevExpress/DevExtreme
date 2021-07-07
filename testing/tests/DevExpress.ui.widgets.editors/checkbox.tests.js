import $ from 'jquery';
import devices from 'core/devices';
import keyboardMock from '../../helpers/keyboardMock.js';
import { validateGroup } from 'ui/validation_engine';
import dxCheckBox from 'ui/check_box';
import { normalizeKeyName } from 'events/utils/index';

import 'generic_light.css!';
import 'ui/validator';

QUnit.testStart(function() {
    const markup =
        `<div id="qunit-fixture">
            <div id="checkBox"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

const CHECKBOX_CLASS = 'dx-checkbox';
const ICON_SELECTOR = '.dx-checkbox-icon';

QUnit.module('Checkbox', function() {
    const isRenovation = !!dxCheckBox.IS_RENOVATED_WIDGET;

    QUnit.module('render', function() {
        QUnit.test('init with default options', function(assert) {
            const $element = $('#checkBox').dxCheckBox();
            const instance = $element.dxCheckBox('instance');

            assert.strictEqual(instance.option('value'), false, 'checkbox has a false value by default');
        });

        QUnit.test('click triggers user handler and changes state', function(assert) {
            assert.expect(5);

            let checked = false;

            const $element = $('#checkBox').dxCheckBox({
                onValueChanged: function(e) {
                    assert.ok(e.value, 'value present');
                    checked = true;
                }
            });

            const instance = $element.dxCheckBox('instance');

            assert.notOk(checked);
            assert.notOk(instance.option('value'));

            $element.trigger('dxclick');

            assert.ok(checked);
            assert.ok(instance.option('value'));
        });
    });

    QUnit.module('validation', function() {
        if(devices.real().deviceType === 'desktop') {
            QUnit.test('the click should be processed before the validation message is shown (T570458)', function(assert) {
                const $checkBox = $('#checkBox')
                    .dxCheckBox({})
                    .dxValidator({
                        validationRules: [{ type: 'required', message: 'message' }]
                    });
                const checkBox = $checkBox.dxCheckBox('instance');
                const isValidationMessageVisible = () => {
                    const message = $checkBox.find('.dx-overlay-wrapper.dx-invalid-message').get(0);

                    return message && window.getComputedStyle(message).visibility === 'visible';
                };

                validateGroup();
                assert.notOk(checkBox.option('isValid'));

                $checkBox.focus();
                assert.notOk(checkBox.option('isValid'));
                assert.notOk(isValidationMessageVisible());

                $checkBox.trigger('dxclick');
                assert.ok(checkBox.option('isValid'));
                assert.notOk(isValidationMessageVisible());

                $checkBox.trigger('dxclick');
                assert.notOk(checkBox.option('isValid'));
                assert.ok(isValidationMessageVisible());
            });

            QUnit.test('should show validation message after focusing', function(assert) {
                const clock = sinon.useFakeTimers();
                const $checkBox = $('#checkBox')
                    .dxCheckBox({})
                    .dxValidator({
                        validationRules: [{ type: 'required', message: 'message' }]
                    });

                const instance = $checkBox.dxCheckBox('instance');

                validateGroup();
                instance.focus();
                clock.tick(200);

                const message = $checkBox.find('.dx-overlay-wrapper.dx-invalid-message').get(0);

                assert.strictEqual(window.getComputedStyle(message).visibility, 'visible');
                clock.restore();
            });
        }
    });

    QUnit.module('options', function() {
        QUnit.test('visible', function(assert) {
            const $element = $('#checkBox').dxCheckBox();
            const instance = $element.dxCheckBox('instance');
            instance.option('width', 1);
            assert.ok($element.is(':visible'), 'checkBox is visible');

            instance.option('visible', false);
            assert.ok($element.is(':hidden'), 'checkBox is hidden');
        });

        QUnit.test('text is changed according to the corresponding option', function(assert) {
            const $element = $('#checkBox').dxCheckBox();
            const instance = $element.dxCheckBox('instance');

            instance.option('text', 'new text');
            assert.equal($element.text(), 'new text', 'checkbox changed text to \'new text\'');

            instance.option('text', 'new text 2');
            assert.equal($element.text(), 'new text 2', 'checkbox changed text to \'new text 2\'');
        });

        QUnit.test('disabled', function(assert) {
            const $element = $('#checkBox').dxCheckBox({
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

        QUnit.test('checkbox icon must not resize according to the "width" and "height" options', function(assert) {
            const $element = $('#checkBox').dxCheckBox();
            const instance = $element.dxCheckBox('instance');
            const initWidth = $element.find(ICON_SELECTOR).width();
            const initHeight = $element.find(ICON_SELECTOR).height();
            const newSize = 50;

            instance.option('width', newSize);

            assert.equal($element.find(ICON_SELECTOR).width(), initWidth, 'icon width is not resized');

            instance.option('height', newSize);

            assert.equal($element.find(ICON_SELECTOR).height(), initHeight, 'icon height is not resized');
        });

        if(isRenovation) {
            QUnit.test('checkbox icon must resize according to the "iconWidth" and "iconHeight" options', function(assert) {
                const $element = $('#checkBox').dxCheckBox();
                const instance = $element.dxCheckBox('instance');
                const newSize = 50;

                instance.option('iconWidth', newSize);

                assert.strictEqual($element.find(ICON_SELECTOR).outerWidth(), newSize, 'icon width is resized');

                instance.option('iconHeight', newSize);

                assert.strictEqual($element.find(ICON_SELECTOR).outerHeight(), newSize, 'icon height is resized');
            });

            QUnit.test('checkbox icon\'s font-size must change according to the "iconWidth" and "iconHeight" options', function(assert) {
                const $element = $('#checkBox').dxCheckBox();
                const instance = $element.dxCheckBox('instance');

                const newSize = 50;
                const initialFontSize = $element.find(ICON_SELECTOR).css('font-size');

                instance.option('iconWidth', newSize);
                instance.option('iconHeight', newSize);

                const newFontSize = $element.find(ICON_SELECTOR).css('font-size');

                assert.notStrictEqual(initialFontSize, newFontSize, 'font-size is changed');
            });

            QUnit.test('checkbox icon\'s font-size should be directly proportional to Math.min of "iconWidth"/"iconHeight" options', function(assert) {
                const iconWidth = 45;
                const iconHeight = 55;
                const $element = $('#checkBox').dxCheckBox({ iconWidth, iconHeight });
                const fontSizeMultiplayer = 16 / 22;
                const expectedFontSize = `${Math.round(fontSizeMultiplayer * Math.min(iconHeight, iconWidth))}px`;

                assert.strictEqual($element.find(ICON_SELECTOR).css('font-size'), expectedFontSize, 'font-size is calculated correctly');
            });

            QUnit.test('checkbox root element size should adjust to "iconWidth"/"iconHeight" options if "widht"/"height" options are not defined', function(assert) {
                const iconWidth = 45;
                const iconHeight = 55;
                const $element = $('#checkBox').dxCheckBox({ iconWidth, iconHeight });

                assert.strictEqual($element.css('width'), `${iconWidth}px`, 'root element width equals icon width');
                assert.strictEqual($element.css('height'), `${iconHeight}px`, 'root element height equals icon height');
            });

            QUnit.test('checkbox root element size should not adjust to "iconWidth"/"iconHeight" options if "widht"/"height" options not defined', function(assert) {
                const iconWidth = 45;
                const iconHeight = 55;
                const width = 30;
                const height = 30;
                const $element = $('#checkBox').dxCheckBox({ iconWidth, iconHeight, width, height });

                assert.strictEqual($element.css('width'), `${width}px`, 'root element width not equals icon width');
                assert.strictEqual($element.css('height'), `${height}px`, 'root element height not equals icon height');
            });

            [14, '14', '14px', '50%', () => 14, () => '14px'].forEach((value) => {
                QUnit.test(`checkbox "iconWidth"/"iconHeight" options should correctly apply value in format ${value}`, function(assert) {
                    const $element = $('#checkBox').dxCheckBox({ width: 28, height: 28, iconWidth: value, iconHeight: value });
                    assert.strictEqual($element.find(ICON_SELECTOR).outerWidth(), 14, `icon got expected width from ${value} option value`);
                });
            });
        }

        QUnit.test('widget input should get the "name" attribute with a correct value', function(assert) {
            const expectedName = 'some_name';
            const $element = $('#checkBox').dxCheckBox({
                name: expectedName
            });
            const $input = $element.find('input');

            assert.strictEqual($input.attr('name'), expectedName, 'the input "name" attribute has correct value');
        });
    });

    QUnit.module('hidden input', function() {
        QUnit.test('the hidden input has "true" value', function(assert) {
            const $element = $('#checkBox').dxCheckBox({ value: true });
            const $input = $element.find('input');

            assert.strictEqual($input.val(), 'true', 'hidden input value is correct');
        });

        QUnit.test('the hidden input has "false" value', function(assert) {
            const $element = $('#checkBox').dxCheckBox();
            const $input = $element.find('input');

            assert.strictEqual($input.val(), 'false', 'hidden input value is correct');
        });

        QUnit.test('the hidden should change its value on widget value change', function(assert) {
            const $element = $('#checkBox').dxCheckBox({
                value: undefined
            });
            const instance = $element.dxCheckBox('instance');
            const $input = $element.find('input');

            instance.option('value', false);
            assert.strictEqual($input.val(), 'false', 'input value has been changed');

            instance.option('value', true);
            assert.strictEqual($input.val(), 'true', 'input value has been changed second time');
        });
    });

    QUnit.module('widget sizing render', function() {
        QUnit.test('constructor', function(assert) {
            const $element = $('#checkBox').dxCheckBox({ width: 400 });
            const instance = $element.dxCheckBox('instance');

            assert.strictEqual(instance.option('width'), 400);
            assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
        });

        QUnit.test('change width', function(assert) {
            const $element = $('#checkBox').dxCheckBox();
            const instance = $element.dxCheckBox('instance');
            const customWidth = 400;

            instance.option('width', customWidth);

            assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
        });
    });

    QUnit.module('keyboard navigation', function() {
        QUnit.test('space press should toggle value', function(assert) {
            const $element = $('#checkBox').dxCheckBox({
                focusStateEnabled: true,
                value: false
            });
            const instance = $element.dxCheckBox('instance');
            const keyboard = keyboardMock($element);

            $element.trigger('focusin');
            keyboard.keyDown('space');

            assert.ok(instance.option('value'), 'value has been changed successfully');
        });
    });

    QUnit.module('events', function() {
        QUnit.test('valueChanged event fired after setting the value by click', function(assert) {
            const handler = sinon.stub();
            const $element = $('#checkBox').dxCheckBox({});
            const checkbox = $element.dxCheckBox('instance');

            checkbox.on('valueChanged', handler);

            $element.trigger('dxclick');
            assert.ok(handler.calledOnce);
        });

        QUnit.test('valueChanged handler runtime change', function(assert) {
            const handler = sinon.stub();
            const newHandler = sinon.stub();
            const $element = $('#checkBox').dxCheckBox({ onValueChanged: handler });
            const checkBox = $element.dxCheckBox('instance');

            checkBox.option('onValueChanged', newHandler);
            $element.trigger('dxclick');
            assert.ok(newHandler.calledOnce);
        });

        QUnit.test('valueChanged should have correct previousValue when it is undefined', function(assert) {
            const handler = sinon.stub();
            const $element = $('#checkBox').dxCheckBox({ onValueChanged: handler, value: undefined });

            $element.trigger('dxclick');
            assert.ok(handler.calledOnce);
            assert.strictEqual(handler.getCalls()[0].args[0].previousValue, undefined, 'previousValue is correct');
        });

        QUnit.test('value=undefined should be set correctly', function(assert) {
            const $element = $('#checkBox').dxCheckBox({ value: undefined });
            const checkbox = $element.dxCheckBox('instance');
            assert.strictEqual(checkbox.option('value'), undefined, 'value on init is correct');
            assert.ok($element.hasClass('dx-checkbox-indeterminate'), '"dx-checkbox-indeterminate"class has been added');

            $element.trigger('dxclick');
            assert.strictEqual(checkbox.option('value'), true, 'value on correct after click');
            assert.ok($element.hasClass('dx-checkbox-checked'), 'class has been changed to "dx-checkbox-checked"');

            checkbox.option('value', undefined);
            assert.strictEqual(checkbox.option('value'), undefined, 'value on correct after runtime change to undefined');
            assert.ok($element.hasClass('dx-checkbox-indeterminate'), 'class has been added');
        });

        QUnit.test('valueChanged event fired after setting the value by keyboard', function(assert) {
            const handler = sinon.stub();
            const $element = $('#checkBox').dxCheckBox({ focusStateEnabled: true });
            const checkbox = $element.dxCheckBox('instance');
            const keyboard = keyboardMock($element);

            checkbox.on('valueChanged', handler);

            $element.trigger('focusin');
            keyboard.keyDown('space');
            assert.ok(handler.calledOnce);
        });

        QUnit.test('valueChanged event fired after setting the value by option', function(assert) {
            const handler = sinon.stub();
            const $element = $('#checkBox').dxCheckBox({
                value: true
            });
            const checkbox = $element.dxCheckBox('instance');

            checkbox.on('valueChanged', handler);

            checkbox.option('value', false);
            assert.ok(handler.calledOnce);
        });

        QUnit.module('valueChanged handler should receive correct event parameter', {
            beforeEach: function() {
                this.valueChangedHandler = sinon.stub();
                this.$element = $('#checkBox').dxCheckBox({ onValueChanged: this.valueChangedHandler, focusStateEnabled: true });
                this.instance = this.$element.dxCheckBox('instance');
                this.keyboard = keyboardMock(this.$element);

                this.testProgramChange = (assert) => {
                    const value = this.instance.option('value');
                    this.instance.option('value', !value);

                    const callCount = this.valueChangedHandler.callCount - 1;
                    const event = this.valueChangedHandler.getCall(callCount).args[0].event;
                    assert.strictEqual(event, undefined, 'event is undefined');
                };
                this.checkEvent = (assert, type, target, key) => {
                    const event = this.valueChangedHandler.getCall(0).args[0].event;
                    assert.strictEqual(event.type, type, 'event type is correct');
                    assert.strictEqual(event.target, target.get(0), 'event target is correct');
                    if(type === 'keydown') {
                        assert.strictEqual(normalizeKeyName(event), normalizeKeyName({ key }), 'event key is correct');
                    }
                };
            }
        }, () => {
            QUnit.test('after click', function(assert) {
                this.$element.trigger('dxclick');

                this.checkEvent(assert, 'dxclick', this.$element);
                this.testProgramChange(assert);
            });

            QUnit.test('after space press', function(assert) {
                this.keyboard.press('space');

                this.checkEvent(assert, 'keydown', this.$element, 'space');
                this.testProgramChange(assert);
            });

            QUnit.test('after runtime change', function(assert) {
                this.testProgramChange(assert);
            });
        });

        QUnit.test('onContentReady is fired after first render', function(assert) {
            assert.expect(2);

            $('#checkBox').dxCheckBox({
                value: true,
                onContentReady: function(e) {
                    assert.ok($(e.element).find('input').val());
                    assert.ok($(e.element).hasClass(CHECKBOX_CLASS));
                }
            });
        });
    });
});
