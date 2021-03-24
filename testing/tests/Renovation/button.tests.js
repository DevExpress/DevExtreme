import $ from 'jquery';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import ValidationEngine from 'ui/validation_engine';
import Validator from 'ui/validator';
import DefaultAdapter from 'ui/validation/default_adapter';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import * as checkStyleHelper from '../../helpers/checkStyleHelper.js';
import { Deferred } from 'core/utils/deferred';
import { act } from 'preact/test-utils';

import 'renovation/ui/button.j';
import 'generic_light.css!';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <form id="form">\
        <div id="button"></div>\
        <div id="widget"></div>\
        <div id="inkButton"></div>\
        </form>
    `);

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

const moduleConfig = {
    Button(options = {}) {
        act(() => $('#button').dxButton(options));
        return $('#button');
    }
};

QUnit.module('Props: template', moduleConfig);

QUnit.test('should render button with default template', function(assert) {
    const $element = this.Button({ text: 'test', icon: 'check' });
    const $contentElements = $element.find('.dx-button-content').children();

    assert.strictEqual($element.dxButton('option', 'template'), undefined, 'default template value');
    assert.ok($contentElements.eq(0).hasClass('dx-icon'), 'render icon');
    assert.ok($contentElements.eq(1).hasClass('dx-button-text'), 'render test');
});

QUnit.test('should pass correct container', function(assert) {
    this.Button({
        template: function(data, container) {
            assert.strictEqual(isRenderer(container), !!config().useJQuery, 'container is correct');
            return $('<div>');
        }
    });
});

QUnit.test('should pass correct data', function(assert) {
    const element = this.Button({
        text: 'My button',
        icon: 'test',
        template: function(data, container) {
            assert.strictEqual(data.text, 'My button', 'text is correct');
            assert.strictEqual(data.icon, 'test', 'icon is correct');
            const $template = $('<div>');
            $template.text(`${data.text}123`);
            return $template;
        }
    });

    assert.strictEqual(element.text(), 'My button123', 'render correct text');
});

QUnit.test('should render jQuery', function(assert) {
    const element = this.Button({
        template: (data, container) => $('<div id="custom-template">'),
    });
    assert.strictEqual(element.find('.dx-button-content').length, 1, 'render content');
    assert.strictEqual(element.find('#custom-template').length, 1, 'render custom template');
});

QUnit.test('should render dom node', function(assert) {
    const element = this.Button({
        template: (data, container) => $('<div id="custom-template">').get(0),
    });
    assert.strictEqual(element.find('.dx-button-content').length, 1, 'render content');
    assert.strictEqual(element.find('#custom-template').length, 1, 'render custom template');
});

QUnit.test('should rerender template in runtime', function(assert) {
    const template = (data, container) => $('<div id="custom-template">');
    const templateNew = (data, container) => $('<div id="new-template">');
    const element = this.Button({ template: template });
    assert.strictEqual(element.find('#custom-template').length, 1, 'render custom template');

    this.Button({ template: templateNew });
    assert.strictEqual(element.find('#custom-template').length, 0, 'not render old template');
    assert.strictEqual(element.find('#new-template').length, 1, 'render new template');
});

QUnit.test('should render submit input with custom template', function(assert) {
    const element = this.Button({
        useSubmitBehavior: true,
        template: (data, container) => $('<span>'),
    });

    assert.strictEqual(element.find('.dx-button-submit-input').length, 1, 'render submit input');
});

// NOTE: legacy tests for button
QUnit.module('options changed callbacks', moduleConfig, () => {
    QUnit.test('text', function(assert) {
        const element = this.Button({ text: 'new text' });
        assert.equal(element.text(), 'new text');

        this.Button({ text: 'new text 2' });
        assert.equal(element.text(), 'new text 2');
        assert.ok(!element.hasClass(BUTTON_HAS_ICON_CLASS), 'button with text only has not icon class');
        assert.ok(element.hasClass(BUTTON_HAS_TEXT_CLASS, 'button with text has text class'));
    });

    QUnit.test('onClick', function(assert) {
        const clickHandler = sinon.spy();

        const element = this.Button({ onClick: clickHandler });
        element.trigger('dxclick');

        assert.ok(clickHandler.calledOnce, 'Handler should be called');
        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, 'Event params should be passed');
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.validationGroup, 'validationGroup should be passed');
    });

    QUnit.test('icon', function(assert) {
        const element = this.Button({ icon: 'home' });
        assert.equal(element.find('.dx-icon-home').length, 1);

        this.Button({ icon: 'add' });
        assert.equal(element.find('.dx-icon-add').length, 1);

        this.Button({ icon: undefined });
        assert.equal(element.find('.dx-icon-add').length, 0);
        assert.equal(element.find('.dx-icon-home').length, 0);
    });

    QUnit.test('icon position', function(assert) {
        const element = this.Button({
            icon: 'box',
            text: 'Text',
            iconPosition: 'right'
        });

        let $buttonContentElements = element.find('.dx-button-content').children();
        assert.ok($buttonContentElements.eq(1).hasClass('dx-icon'), 'icon is after the text');
        assert.ok($buttonContentElements.eq(1).hasClass('dx-icon-right'), 'icon has class for right position');
        assert.ok(element.hasClass('dx-button-icon-right'), 'button has class for right icon position');

        this.Button({ iconPosition: 'left' });
        $buttonContentElements = element.find('.dx-button-content').children();
        assert.ok($buttonContentElements.eq(0).hasClass('dx-icon'), 'icon is before the text');
        assert.notOk($buttonContentElements.eq(0).hasClass('dx-icon-right'), 'icon has no class for right position');
        assert.notOk(element.hasClass('dx-button-icon-right'), 'button has no class for right icon position');
    });

    QUnit.test('type', function(assert) {
        const element = this.Button({ type: 'back' });
        assert.ok(element.hasClass(BUTTON_BACK_CLASS));
    });

    QUnit.test('disabled', function(assert) {
        const element = this.Button({ disabled: true });
        assert.ok(element.hasClass('dx-state-disabled'));
    });

    // NOTE: deprecated property
    QUnit.skip('_templateData', function(assert) {
        const template = sinon.stub().returns('TPL');
        const element = this.Button({
            template: template,
            _templateData: { custom: 1 }
        });
        template.reset();
        act(() => element.dxButton('repaint'));

        assert.strictEqual(template.firstCall.args[0].custom, 1, 'custom field is correct');
    });

    QUnit.test('stylingMode', function(assert) {
        const element = this.Button();
        assert.ok(element.hasClass(BUTTON_CONTAINED_STYLE_CLASS));

        this.Button({ stylingMode: 'text' });
        assert.ok(element.hasClass(BUTTON_TEXT_STYLE_CLASS));
        assert.notOk(element.hasClass(BUTTON_CONTAINED_STYLE_CLASS));

        this.Button({ stylingMode: 'outlined' });
        assert.ok(element.hasClass(BUTTON_OUTLINED_STYLE_CLASS));
        assert.notOk(element.hasClass(BUTTON_TEXT_STYLE_CLASS));

        this.Button({ stylingMode: 'contained' });
        assert.ok(element.hasClass(BUTTON_CONTAINED_STYLE_CLASS));
        assert.notOk(element.hasClass(BUTTON_OUTLINED_STYLE_CLASS));
    });

    QUnit.test('readOnly validator should be excluded for the click action', function(assert) {
        const clickHandler = sinon.spy();

        const element = this.Button({
            onClick: clickHandler
        });

        element.addClass('dx-state-readonly');
        element.trigger('dxclick');
        assert.strictEqual(clickHandler.callCount, 1, 'click handler was executed');
    });

    QUnit.test('T325811 - \'text\' option change should not lead to widget clearing', function(assert) {
        const element = this.Button();
        const $testElement = $('<div>').appendTo(element);
        assert.ok($testElement.parent().hasClass('dx-button'), 'test element is in button');
        this.Button({ text: 'new test button text' });
        assert.ok($testElement.parent().hasClass('dx-button'), 'test element is still in button');
    });
});

QUnit.module('regressions', moduleConfig, () => {
    QUnit.test('B230602', function(assert) {
        const element = this.Button({ icon: '1.png' });
        assert.equal(element.find('img').length, 1);

        this.Button({ icon: '2.png' });
        assert.equal(element.find('img').length, 1);
    });

    QUnit.test('Q513961', function(assert) {
        const element = this.Button({
            text: '123',
            icon: 'home'
        });
        assert.equal(element.find('.dx-icon-home').index(), 0);
    });

    QUnit.test('B238735: Button holds the shape of an arrow after you change it\'s type from back to any other', function(assert) {
        const element = this.Button({ type: 'back' });
        assert.equal(element.hasClass(BUTTON_BACK_CLASS), true, 'back button css class removed');

        this.Button({ type: 'normal' });
        assert.equal(element.hasClass(BUTTON_BACK_CLASS), false, 'back button css class removed');
    });
});

QUnit.module('contentReady', () => {
    QUnit.test('T355000 - the \'onContentReady\' action should be fired after widget is rendered entirely', function(assert) {
        const done = assert.async();
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

        let $firstButton;
        act(() => $firstButton = $('#widget').dxButton(buttonConfig));

        act(() => $('#button').dxButton($.extend({}, buttonConfig, {
            onContentReady(e) {
                assert.ok(areElementsEqual($firstButton, $(e.element)), 'rendered widget and widget with fired action are equals');
                done();
            }
        })));
    });
});

QUnit.module('inkRipple', moduleConfig, () => {
    QUnit.test('inkRipple should be removed when widget is removed', function(assert) {
        assert.expect(1);
        const element = this.Button({
            useInkRipple: true,
            onClick: (e) => {
                const $element = $(e.component.$element());
                $element.triggerHandler({ type: 'dxremove' });
                $element.trigger('dxinactive');
                assert.ok(true, 'no exceptions');
            }
        });

        element.trigger('dxclick');
    });

    QUnit.test('widget should works correctly when the useInkRipple option is changed at runtime', function(assert) {
        const element = this.Button({
            text: 'test',
            useInkRipple: true
        });
        const pointer = pointerMock(element);

        pointer.start('touch').down();
        pointer.start('touch').up();
        assert.strictEqual(element.find(`.${INK_RIPPLE_CLASS}`).length, 1, 'inkRipple element was rendered');

        this.Button({ useInkRipple: false });
        assert.strictEqual(element.find(`.${INK_RIPPLE_CLASS}`).length, 0, 'inkRipple element was removed');

        pointer.start('touch').down();
        pointer.start('touch').up();
        assert.strictEqual(element.find(`.${INK_RIPPLE_CLASS}`).length, 0, 'inkRipple element was removed is still removed after click');

        this.Button({ useInkRipple: true });
        pointer.start('touch').down();
        pointer.start('touch').up();
        assert.strictEqual(element.find(`.${INK_RIPPLE_CLASS}`).length, 1, 'inkRipple element was rendered');
    });
});

QUnit.module('widget sizing render', moduleConfig, () => {
    QUnit.test('default', function(assert) {
        const element = this.Button({ text: 'ahoy!' });

        assert.ok(element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const element = this.Button({ text: 'ahoy!', width: 400 });

        assert.strictEqual(element.dxButton('option', 'width'), 400);
        assert.strictEqual(element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        $('#button').width('300px');
        const element = this.Button({ text: 'ahoy!' });

        assert.strictEqual(element.dxButton('option', 'width'), undefined);
        assert.strictEqual(element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const element = this.Button({ text: 'ahoy!' });
        const customWidth = 400;

        this.Button({ width: customWidth });

        assert.strictEqual(element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('keyboard navigation', moduleConfig, () => {
    QUnit.test('click fires on enter', function(assert) {
        assert.expect(2);

        let clickFired = 0;

        const element = this.Button({
            focusStateEnabled: true, // NOTE: for ios 9 testing
            onClick: () => clickFired++
        });

        const keyboard = keyboardMock(element);

        element.trigger('focusin');
        keyboard.keyDown('enter');
        assert.equal(clickFired, 1, 'press enter on button call click action');

        keyboard.keyDown('space');
        assert.equal(clickFired, 2, 'press space on button call click action');
    });

    QUnit.test('arguments on key press', function(assert) {
        const clickHandler = sinon.spy();

        const element = this.Button({
            focusStateEnabled: true, // NOTE: for ios 9 testing
            onClick: clickHandler
        });

        const keyboard = keyboardMock(element);

        element.trigger('focusin');
        keyboard.keyDown('enter');

        assert.ok(clickHandler.calledOnce, 'Handler should be called');

        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, 'Event params should be passed');
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.validationGroup, 'validationGroup should be passed');
    });
});

QUnit.module('submit behavior', {
    ...moduleConfig,
    beforeEach: function() {
        this.$element = this.Button({ useSubmitBehavior: true });
        this.$form = $('#form');
        this.clickButton = function() {
            act(() => this.$element.trigger('dxclick'));
        };
    }
}, () => {
    QUnit.test('render input with submit type', function(assert) {
        assert.strictEqual(this.$element.find('input[type=submit]').length, 1);
    });

    QUnit.test('submit input has .dx-button-submit-input CSS class', function(assert) {
        assert.strictEqual(this.$element.find(`.${BUTTON_SUBMIT_INPUT_CLASS}`).length, 1);
    });

    QUnit.test('button click call click() on submit input', function(assert) {
        const clickHandlerSpy = sinon.spy();
        // NOTE: workaround to synchronize test
        this.Button({ validationGroup: '' });

        this.$element
            .find('.' + BUTTON_SUBMIT_INPUT_CLASS)
            .on('click', clickHandlerSpy);

        this.clickButton();

        assert.ok(clickHandlerSpy.calledOnce);
    });

    QUnit.test('widget should work correctly if useSubmitBehavior was changed runtime', function(assert) {
        this.Button({ useSubmitBehavior: false });
        assert.strictEqual(this.$element.find('input[type=submit]').length, 0, 'no submit input if useSubmitBehavior is false');
        assert.strictEqual(this.$element.find(`.${BUTTON_SUBMIT_INPUT_CLASS}`).length, 0, 'no submit class if useSubmitBehavior is false');

        this.Button({ useSubmitBehavior: true });
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

            this.Button({ validationGroup: 'testGroup' });

            validatorStub.validate = () => {
                return { isValid: false };
            };

            ValidationEngine.registerValidatorInGroup('testGroup', validatorStub);

            this.$element
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
        this.Button({ onClick: clickHandlerSpy });
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
            this.Button({ validationGroup: 'testGroup' });
            const buttonInstance = this.$element.dxButton('instance');


            ValidationEngine.registerValidatorInGroup('testGroup', validator);

            this.$element
                .find('.' + BUTTON_SUBMIT_INPUT_CLASS)
                .on('click', clickHandlerSpy);

            this.clickButton();

            assert.ok(clickHandlerSpy.called);
            assert.ok(buttonInstance.option('disabled'), 'button is disabled after the click');
        } finally {
            ValidationEngine.initGroups();
        }
    });
});

QUnit.module('templates', moduleConfig, () => {
    checkStyleHelper.testInChromeOnDesktopActiveWindow('parent styles when button is not focused', function(assert) {
        const $template = $('<div>').text('test1');
        this.Button({
            template: function() { return $template; }
        });
        $('#input1').focus();

        assert.equal(checkStyleHelper.getColor($template[0]), 'rgb(51, 51, 51)', 'color');
        assert.equal(checkStyleHelper.getBackgroundColor($template[0]), 'rgb(255, 255, 255)', 'backgroundColor');
        assert.equal(checkStyleHelper.getOverflowX($template[0].parentNode), 'visible', 'overflowX');
        assert.equal(checkStyleHelper.getTextOverflow($template[0].parentNode), 'clip', 'textOverflow');
        assert.equal(checkStyleHelper.getWhiteSpace($template[0].parentNode), 'normal', 'whiteSpace');
    });
});

QUnit.module('events subscriptions', moduleConfig, () => {
    QUnit.test('click', function(assert) {
        assert.expect(2);
        const $button = this.Button({
            text: 'test',
            onClick: (e) => {
                assert.ok(e.event, 'Event should be passed');
                assert.ok(e.validationGroup, 'validationGroup should be passed');
            }
        });

        $button.trigger('dxclick');
    });

    QUnit.test('contentReady', function(assert) {
        assert.expect(3);

        this.Button({
            text: 'test',
            onContentReady: (e) => {
                assert.ok(e.component, 'Component info should be passed');
                assert.ok(e.element, 'Element info should be passed');
                assert.strictEqual($(e.element).text(), 'test', 'Text is rendered to the element');
            }
        });
    });
});
