import $ from 'jquery';
import ValidationEngine from 'ui/validation_engine';
import Validator from 'ui/validator';
import DefaultAdapter from 'ui/validation/default_adapter';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import { createRenovationModuleConfig } from '../../helpers/renovationHelper.js';
import * as checkStyleHelper from '../../helpers/checkStyleHelper.js';
import { Deferred } from 'core/utils/deferred';
import dxrButton from 'renovation/ui/button.j';
import dxButton from 'ui/button';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<form id="form">\
        <div id="button"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="inkButton"></div>\
            <div data-options="dxTemplate: { name: \'content\' }" data-bind="text: text"></div>\
        </div>\
        </form>';

    $('#qunit-fixture').html(markup);

    $('#form').on('submit', function(e) {
        e.preventDefault();
    });
});

const BUTTON_HAS_TEXT_CLASS = 'dx-button-has-text';
const BUTTON_HAS_ICON_CLASS = 'dx-button-has-icon';
const BUTTON_BACK_CLASS = 'dx-button-back';
const BUTTON_SUBMIT_INPUT_CLASS = 'dx-button-submit-input';
const BUTTON_TEXT_STYLE_CLASS = 'dx-button-mode-text';
const BUTTON_CONTAINED_STYLE_CLASS = 'dx-button-mode-contained';
const BUTTON_OUTLINED_STYLE_CLASS = 'dx-button-mode-outlined';
const INK_RIPPLE_CLASS = 'dx-inkripple';

QUnit.module('Button', createRenovationModuleConfig(dxButton, dxrButton), function() {
    const isRenovation = !!dxButton.IS_RENOVATED_WIDGET;

    QUnit.module('options changed callbacks', {
        beforeEach: function() {
            this.element = $('#button').dxButton();
            this.instance = this.element.dxButton('instance');
        }
    }, function() {
        QUnit.test('text', function(assert) {
            this.instance.option('text', 'new text');
            assert.equal(this.element.text(), 'new text');

            this.instance.option('text', 'new text 2');
            assert.equal(this.element.text(), 'new text 2');
            assert.ok(!this.element.hasClass(BUTTON_HAS_ICON_CLASS), 'button with text only has not icon class');
            assert.ok(this.element.hasClass(BUTTON_HAS_TEXT_CLASS, 'button with text has text class'));
        });

        QUnit.test('onClick', function(assert) {
            const clickHandler = sinon.spy();

            this.instance.option('onClick', clickHandler);
            this.element.trigger('dxclick');

            assert.ok(clickHandler.calledOnce, 'Handler should be called');
            const params = clickHandler.getCall(0).args[0];
            assert.ok(params, 'Event params should be passed');
            assert.ok(params.event, 'Event should be passed');
            assert.ok(params.validationGroup, 'validationGroup should be passed');
        });

        QUnit.test('icon', function(assert) {
            this.instance.option('icon', 'home');
            assert.equal(this.element.find('.dx-icon-home').length, 1);

            this.instance.option('icon', 'add');
            assert.equal(this.element.find('.dx-icon-add').length, 1);

            this.instance.option('icon', undefined);
            assert.equal(this.element.find('.dx-icon-add').length, 0);
            assert.equal(this.element.find('.dx-icon-home').length, 0);
        });

        QUnit.test('icon position', function(assert) {
            this.instance.option({
                icon: 'box',
                text: 'Text',
                iconPosition: 'right'
            });

            let $buttonContentElements = this.element.find('.dx-button-content').children();
            assert.ok($buttonContentElements.eq(1).hasClass('dx-icon'), 'icon is after the text');
            assert.ok($buttonContentElements.eq(1).hasClass('dx-icon-right'), 'icon has class for right position');
            assert.ok(this.element.hasClass('dx-button-icon-right'), 'button has class for right icon position');

            this.instance.option('iconPosition', 'left');
            $buttonContentElements = this.element.find('.dx-button-content').children();
            assert.ok($buttonContentElements.eq(0).hasClass('dx-icon'), 'icon is before the text');
            assert.notOk($buttonContentElements.eq(0).hasClass('dx-icon-right'), 'icon has no class for right position');
            assert.notOk(this.element.hasClass('dx-button-icon-right'), 'button has no class for right icon position');
        });

        QUnit.test('type', function(assert) {
            this.instance.option('type', 'back');
            assert.ok(this.element.hasClass(BUTTON_BACK_CLASS));
        });

        QUnit.test('disabled', function(assert) {
            this.instance.option('disabled', true);
            assert.ok(this.element.hasClass('dx-state-disabled'));
        });

        if(!isRenovation) {
            QUnit.test('_templateData', function(assert) {
                const template = sinon.stub().returns('TPL');
                this.instance.option('template', template);
                this.instance.option('_templateData', { custom: 1 });
                template.reset();
                this.instance.repaint();

                assert.strictEqual(template.firstCall.args[0].custom, 1, 'custom field is correct');
            });
        }

        QUnit.test('stylingMode', function(assert) {
            assert.ok(this.element.hasClass(BUTTON_CONTAINED_STYLE_CLASS));

            this.instance.option('stylingMode', 'text');
            assert.ok(this.element.hasClass(BUTTON_TEXT_STYLE_CLASS));
            assert.notOk(this.element.hasClass(BUTTON_CONTAINED_STYLE_CLASS));

            this.instance.option('stylingMode', 'outlined');
            assert.ok(this.element.hasClass(BUTTON_OUTLINED_STYLE_CLASS));
            assert.notOk(this.element.hasClass(BUTTON_TEXT_STYLE_CLASS));

            this.instance.option('stylingMode', 'contained');
            assert.ok(this.element.hasClass(BUTTON_CONTAINED_STYLE_CLASS));
            assert.notOk(this.element.hasClass(BUTTON_OUTLINED_STYLE_CLASS));
        });

        QUnit.test('readOnly validator should be excluded for the click action', function(assert) {
            const clickHandler = sinon.spy();

            this.instance.option({
                onClick: clickHandler
            });

            this.element.addClass('dx-state-readonly');
            this.element.trigger('dxclick');
            assert.strictEqual(clickHandler.callCount, 1, 'click handler was executed');
        });

        QUnit.test('T325811 - \'text\' option change should not lead to widget clearing', function(assert) {
            const $testElement = $('<div>').appendTo(this.element);
            assert.ok($testElement.parent().hasClass('dx-button'), 'test element is in button');
            this.instance.option('text', 'new test button text');
            assert.ok($testElement.parent().hasClass('dx-button'), 'test element is still in button');
        });

        QUnit.test('button with non-string text option value should not raise an error (T893304)', function(assert) {
            assert.expect(0);

            try {
                this.instance.option('text', 100);
            } catch(e) {
                assert.ok(false);
            }
        });
    });

    QUnit.module('regressions', {
        beforeEach: function() {
            this.element = $('#button').dxButton();
            this.instance = this.element.dxButton('instance');
        }
    }, function() {
        QUnit.test('B230602', function(assert) {
            this.instance.option('icon', '1.png');
            assert.equal(this.element.find('img').length, 1);

            this.instance.option('icon', '2.png');
            assert.equal(this.element.find('img').length, 1);
        });

        QUnit.test('Q513961', function(assert) {
            this.instance.option({ text: '123', 'icon': 'home' });
            assert.equal(this.element.find('.dx-icon-home').index(), 0);
        });

        QUnit.test('B238735: dxButton holds the shape of an arrow after you change it\'s type from back to any other', function(assert) {
            this.instance.option('type', 'back');
            assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), true, 'back button css class removed');

            this.instance.option('type', 'normal');
            assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), false, 'back button css class removed');
        });
    });

    QUnit.module('contentReady', {}, function() {
        QUnit.test('T355000 - the \'onContentReady\' action should be fired after widget is rendered entirely', function(assert) {
            const buttonConfig = {
                text: 'Test button',
                icon: 'trash'
            };

            const areElementsEqual = (first, second) => {
                if(first.length !== second.length) {
                    return false;
                }

                if(first.length === 0) {
                    return true;
                }

                if(first.text() !== second.text()) {
                    return false;
                }

                if(first.attr('class') !== second.attr('class')) {
                    return false;
                }

                const firstChildren = first.children();
                const secondChildren = second.children();

                for(let i = 0, n = first.length; i < n; i++) {
                    if(!areElementsEqual(firstChildren.eq(i), secondChildren.eq(i))) {
                        return false;
                    }
                }

                return true;
            };

            const $firstButton = $('#widget').dxButton(buttonConfig);

            $('#button').dxButton($.extend({}, buttonConfig, {
                onContentReady(e) {
                    assert.ok(areElementsEqual($firstButton, $(e.element)), 'rendered widget and widget with fired action are equals');
                }
            }));
        });
    });

    QUnit.module('inkRipple', {}, function() {
        QUnit.test('inkRipple should be removed when widget is removed', function(assert) {
            $('#inkButton').dxButton({
                useInkRipple: true,
                onClick(e) {
                    const $element = $(e.component.$element());
                    $element.triggerHandler({ type: 'dxremove' });
                    $element.trigger('dxinactive');
                    assert.ok(true, 'no exceptions');
                }
            });
            $('#inkButton').trigger('dxclick');
        });

        QUnit.test('widget should works correctly when the useInkRipple option is changed at runtime', function(assert) {
            const clock = sinon.useFakeTimers();
            const $inkButton = $('#inkButton').dxButton({
                text: 'test',
                useInkRipple: true
            });
            const inkButton = $inkButton.dxButton('instance');
            const pointer = pointerMock($inkButton);

            pointer.start('touch').down();
            clock.tick();
            pointer.start('touch').up();
            assert.strictEqual($inkButton.find(`.${INK_RIPPLE_CLASS}`).length, 1, 'inkRipple element was rendered');

            inkButton.option('useInkRipple', false);
            assert.strictEqual($inkButton.find(`.${INK_RIPPLE_CLASS}`).length, 0, 'inkRipple element was removed');

            pointer.start('touch').down();
            clock.tick();
            pointer.start('touch').up();
            assert.strictEqual($inkButton.find(`.${INK_RIPPLE_CLASS}`).length, 0, 'inkRipple element was removed is still removed after click');

            inkButton.option('useInkRipple', true);
            pointer.start('touch').down();
            clock.tick();
            pointer.start('touch').up();
            assert.strictEqual($inkButton.find(`.${INK_RIPPLE_CLASS}`).length, 1, 'inkRipple element was rendered');

            clock.restore();
        });
    });

    QUnit.module('widget sizing render', {}, function() {
        QUnit.test('default', function(assert) {
            const $element = $('#widget').dxButton({ text: 'ahoy!' });

            assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
        });

        QUnit.test('constructor', function(assert) {
            const $element = $('#widget').dxButton({ text: 'ahoy!', width: 400 });
            const instance = $element.dxButton('instance');

            assert.strictEqual(instance.option('width'), 400);
            assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
        });

        QUnit.test('root with custom width', function(assert) {
            const $element = $('#widthRootStyle').dxButton({ text: 'ahoy!' });
            const instance = $element.dxButton('instance');

            assert.strictEqual(instance.option('width'), undefined);
            assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
        });

        QUnit.test('change width', function(assert) {
            const $element = $('#widget').dxButton({ text: 'ahoy!' });
            const instance = $element.dxButton('instance');
            const customWidth = 400;

            instance.option('width', customWidth);

            assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
        });
    });

    QUnit.module('keyboard navigation', {}, function() {
        QUnit.test('click fires on enter', function(assert) {
            assert.expect(2);

            let clickFired = 0;

            const $element = $('#button').dxButton({
                focusStateEnabled: true,
                onClick() {
                    clickFired++;
                }
            });

            const keyboard = keyboardMock($element);

            $element.trigger('focusin');
            keyboard.keyDown('enter');
            assert.equal(clickFired, 1, 'press enter on button call click action');

            keyboard.keyDown('space');
            assert.equal(clickFired, 2, 'press space on button call click action');
        });

        QUnit.test('arguments on key press', function(assert) {
            const clickHandler = sinon.spy();

            const $element = $('#button').dxButton({
                focusStateEnabled: true,
                onClick: clickHandler
            });

            const keyboard = keyboardMock($element);

            $element.trigger('focusin');
            keyboard.keyDown('enter');

            assert.ok(clickHandler.calledOnce, 'Handler should be called');

            const params = clickHandler.getCall(0).args[0];
            assert.ok(params, 'Event params should be passed');
            assert.ok(params.event, 'Event should be passed');
            assert.ok(params.validationGroup, 'validationGroup should be passed');
        });
    });

    QUnit.module('submit behavior', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            this.$element = $('#button').dxButton({ useSubmitBehavior: true });
            this.$form = $('#form');
            this.clickButton = function() {
                this.$element.trigger('dxclick');
                this.clock.tick();
            };
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, function() {
        QUnit.test('render input with submit type', function(assert) {
            assert.strictEqual(this.$element.find('input[type=submit]').length, 1);
        });

        QUnit.test('input with submit type should not have display:none (T983803)', function(assert) {
            assert.notStrictEqual(this.$element.find('input[type=submit]').css('display'), 'none');
        });

        QUnit.test('submit input has .dx-button-submit-input CSS class', function(assert) {
            assert.strictEqual(this.$element.find(`.${BUTTON_SUBMIT_INPUT_CLASS}`).length, 1);
        });

        QUnit.test('Button should not raise any errors after text option change when useSubmitBehavior is true (T892480)', function(assert) {
            this.$element.dxButton('instance').option('text', 'new text');
            assert.equal(this.$element.text(), 'new text');

            try {
                this.clickButton();
            } catch(e) {
                assert.notOk(true, 'Error is raised after click');
            }
        });

        QUnit.test('button click call click() on submit input', function(assert) {
            const clickHandlerSpy = sinon.spy();

            this.$element
                .find('.' + BUTTON_SUBMIT_INPUT_CLASS)
                .on('click', clickHandlerSpy);

            this.clickButton();

            assert.ok(clickHandlerSpy.calledOnce);
        });

        QUnit.test('widget should work correctly if useSubmitBehavior was changed runtime', function(assert) {
            const instance = this.$element.dxButton('instance');

            instance.option('useSubmitBehavior', false);
            assert.strictEqual(this.$element.find('input[type=submit]').length, 0, 'no submit input if useSubmitBehavior is false');
            assert.strictEqual(this.$element.find(`.${BUTTON_SUBMIT_INPUT_CLASS}`).length, 0, 'no submit class if useSubmitBehavior is false');

            instance.option('useSubmitBehavior', true);
            assert.strictEqual(this.$element.find('input[type=submit]').length, 1, 'has submit input if useSubmitBehavior is false');
            assert.strictEqual(this.$element.find(`.${BUTTON_SUBMIT_INPUT_CLASS}`).length, 1, 'has submit class if useSubmitBehavior is false');
        });

        QUnit.test('preventDefault is called to dismiss submit of form if validation failed', function(assert) {
            assert.expect(2);
            try {
                const validatorStub = sinon.createStubInstance(Validator);

                const clickHandlerSpy = sinon.spy(e => {
                    assert.ok(e.isDefaultPrevented(), 'default is prevented');
                });

                const $element = this.$element.dxButton({ validationGroup: 'testGroup' });

                validatorStub.validate = () => {
                    return { isValid: false };
                };

                ValidationEngine.registerValidatorInGroup('testGroup', validatorStub);

                $element
                    .find('.' + BUTTON_SUBMIT_INPUT_CLASS)
                    .on('click', clickHandlerSpy);

                this.clickButton();

                assert.ok(clickHandlerSpy.called);
            } finally {
                ValidationEngine.initGroups();
            }
        });

        QUnit.test('button onClick event handler should raise once (T443747)', function(assert) {
            const clickHandlerSpy = sinon.spy();
            this.$element.dxButton({ onClick: clickHandlerSpy });
            this.clickButton();
            assert.ok(clickHandlerSpy.calledOnce);
        });

        QUnit.test('Submit button should not be enabled on pending', function(assert) {
            try {
                const validator = new Validator(document.createElement('div'), {
                    adapter: sinon.createStubInstance(DefaultAdapter),
                    validationRules: [{
                        type: 'async',
                        validationCallback: function() {
                            const d = new Deferred();
                            return d.promise();
                        }
                    }]
                });
                const clickHandlerSpy = sinon.spy(e => {
                    assert.ok(e.isDefaultPrevented(), 'default is prevented');
                });
                const $element = this.$element.dxButton({ validationGroup: 'testGroup' });
                const buttonInstance = this.$element.dxButton('instance');


                ValidationEngine.registerValidatorInGroup('testGroup', validator);

                $element
                    .find('.' + BUTTON_SUBMIT_INPUT_CLASS)
                    .on('click', clickHandlerSpy);

                this.clickButton();

                assert.ok(clickHandlerSpy.called);
                assert.ok(buttonInstance.option('disabled'), 'button is disabled after the click');
            } finally {
                ValidationEngine.initGroups();
            }
        });

        QUnit.test('Submit button should change the \'disabled\' option to \'false\' when validation is passed negatively', function(assert) {
            this.clock.restore();
            const validator = new Validator($('<div>').appendTo(this.$form), {
                adapter: sinon.createStubInstance(DefaultAdapter),
                validationRules: [{
                    type: 'async',
                    validationCallback: function() {
                        const d = new Deferred();
                        setTimeout(() => {
                            d.reject();
                        }, 10);
                        return d.promise();
                    }
                }]
            });
            const done = assert.async();

            this.$element.dxButton({
                validationGroup: 'testGroup',
                onOptionChanged: function(args) {
                    if(args.name === 'disabled') {
                        if(args.value === true) {
                            assert.equal(validator._validationInfo.result.status, 'pending', 'validator in pending');
                        } else {
                            assert.equal(validator._validationInfo.result.status, 'invalid', 'validator is invalid');

                            ValidationEngine.initGroups();
                            done();
                        }
                    }
                }
            });

            ValidationEngine.registerValidatorInGroup('testGroup', validator);
            this.$element.trigger('dxclick');
        });

        QUnit.test('Submit button should change the \'disabled\' option to \'false\' when validation is passed positively', function(assert) {
            this.clock.restore();
            const validator = new Validator($('<div>').appendTo(this.$form), {
                adapter: sinon.createStubInstance(DefaultAdapter),
                validationRules: [{
                    type: 'async',
                    validationCallback: function() {
                        const d = new Deferred();
                        setTimeout(() => {
                            d.resolve();
                        }, 10);
                        return d.promise();
                    }
                }]
            });
            const done = assert.async();

            this.$element.dxButton({
                validationGroup: 'testGroup',
                onOptionChanged: function(args) {
                    if(args.name === 'disabled') {
                        if(args.value === true) {
                            assert.equal(validator._validationInfo.result.status, 'pending', 'validator in pending');
                        } else {
                            assert.equal(validator._validationInfo.result.status, 'valid', 'validator is valid');

                            ValidationEngine.initGroups();
                            done();
                        }
                    }
                }
            });

            ValidationEngine.registerValidatorInGroup('testGroup', validator);
            this.$element.trigger('dxclick');
        });

        if(!isRenovation) {
            QUnit.test('Form should be submitted only when an async validation rule is passed positively (T887207)', function(assert) {
                this.clock.restore();
                let value = 'a';
                const validValue = 'b';
                const validator = new Validator($('<div>').appendTo(this.$form), {
                    adapter: sinon.createStubInstance(DefaultAdapter),
                    validationRules: [{
                        type: 'async',
                        validationCallback: function() {
                            const d = new Deferred();
                            setTimeout(() => {
                                d.resolve({
                                    isValid: value === validValue
                                });
                            }, 10);
                            return d.promise();
                        }
                    }]
                });
                const done = assert.async();
                const onSubmit = () => {
                    assert.strictEqual(value, validValue, 'submitted with valid value');

                    ValidationEngine.initGroups();
                    this.$form.off('submit', onSubmit);
                    done();
                };
                const triggerButtonClick = () => {
                    this.$element.trigger('dxclick');
                };

                this.$form.on('submit', onSubmit);

                this.$element.dxButton({
                    validationGroup: 'testGroup',
                    onOptionChanged: function(args) {
                        if(args.name === 'disabled') {
                            if(args.value === false && validator._validationInfo.result.status === 'invalid') {
                                setTimeout(function() {
                                    value = validValue;
                                    triggerButtonClick();
                                });
                            }
                        }
                    }
                });

                ValidationEngine.registerValidatorInGroup('testGroup', validator);
                triggerButtonClick();
            });
        }
    });

    QUnit.module('templates', function() {
        checkStyleHelper.testInChromeOnDesktopActiveWindow('parent styles when button is not focused', function(assert) {
            const $template = $('<div>').text('test1');
            $('#button').dxButton({
                template: function() { return $template; }
            });
            $('#input1').focus();

            assert.equal(checkStyleHelper.getColor($template[0]), 'rgb(51, 51, 51)', 'color');
            assert.equal(checkStyleHelper.getBackgroundColor($template[0]), 'rgb(255, 255, 255)', 'backgroundColor');
            assert.equal(checkStyleHelper.getOverflowX($template[0].parentNode), 'visible', 'overflowX');
            assert.equal(checkStyleHelper.getTextOverflow($template[0].parentNode), 'clip', 'textOverflow');
            assert.equal(checkStyleHelper.getWhiteSpace($template[0].parentNode), 'normal', 'whiteSpace');
        });

        checkStyleHelper.testInChromeOnDesktopActiveWindow('parent styles when button is focused, text is not empty', function(assert) {
            const $template = $('<div>').text('test1');
            const $button = $('#button').dxButton({
                text: 'not empty',
                template: function() { return $template; }
            });
            $button.dxButton('instance').focus();

            assert.strictEqual(checkStyleHelper.getColor($template[0]), 'rgb(51, 51, 51)', 'color');
            assert.strictEqual(checkStyleHelper.getBackgroundColor($template[0]), 'rgb(235, 235, 235)', 'backgroundColor');
            assert.strictEqual(checkStyleHelper.getOverflowX($template[0].parentNode), 'hidden', 'overflowX');
            assert.strictEqual(checkStyleHelper.getTextOverflow($template[0].parentNode), 'ellipsis', 'textOverflow');
            assert.strictEqual(checkStyleHelper.getWhiteSpace($template[0].parentNode), 'nowrap', 'whiteSpace');
        });

        checkStyleHelper.testInChromeOnDesktopActiveWindow('parent styles when button is focused, text is empty', function(assert) {
            const $template = $('<div>').text('test1');
            const $button = $('#button').dxButton({
                text: null,
                template: function() { return $template; }
            });
            $button.dxButton('instance').focus();

            assert.strictEqual(checkStyleHelper.getColor($template[0]), 'rgb(51, 51, 51)', 'color');
            assert.strictEqual(checkStyleHelper.getBackgroundColor($template[0]), 'rgb(235, 235, 235)', 'backgroundColor');
            assert.strictEqual(checkStyleHelper.getOverflowX($template[0].parentNode), 'visible', 'overflowX');
            assert.strictEqual(checkStyleHelper.getTextOverflow($template[0].parentNode), 'clip', 'textOverflow');
            assert.strictEqual(checkStyleHelper.getWhiteSpace($template[0].parentNode), 'normal', 'whiteSpace');
        });
    });

    QUnit.module('events subscriptions', function() {
        QUnit.test('click', function(assert) {
            const clickHandler = sinon.spy();
            const $button = $('#button').dxButton({
                text: 'test'
            });
            const button = $button.dxButton('instance');

            button.on('click', clickHandler);

            $button.trigger('dxclick');

            assert.ok(clickHandler.calledOnce, 'Handler should be called');
            const params = clickHandler.getCall(0).args[0];
            assert.ok(params, 'Event params should be passed');
            assert.ok(params.event, 'Event should be passed');
            assert.ok(params.validationGroup, 'validationGroup should be passed');
        });

        if(isRenovation) {
            QUnit.skip('contentReady');
        } else {
            QUnit.test('contentReady', function(assert) {
                assert.expect(3);

                const button = $('#button').dxButton({
                    text: 'test',
                }).dxButton('instance');

                button.on('contentReady', (e) => {
                    assert.ok(e.component, 'Component info should be passed');
                    assert.ok(e.element, 'Element info should be passed');
                    assert.strictEqual($(e.element).text(), 'test', 'Text is rendered to the element');
                });
                button.repaint();
            });
        }
    });
});
