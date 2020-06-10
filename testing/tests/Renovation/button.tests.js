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
import { patchOptions as patchPreactOptions, restoreOptions as restorePreactOptions } from '../../helpers/preactHelper.js';

import 'renovation/button.j';
import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="component"></div>
        <div id="anotherComponent"></div>

        <form id="form">\
        <div id="button"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="inkButton"></div>\
            <div data-options="dxTemplate: { name: 'content' }" data-bind="text: text"></div>\
        </div>\
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

const buttonConfig = {
    beforeEach: function(module) {
        // it needs for Preact timers https://github.com/preactjs/preact/blob/master/hooks/src/index.js#L273
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.tick(100);
        this.clock.restore();
    }
};

QUnit.module('Props: template', buttonConfig);

QUnit.test('should render button with default template', function(assert) {
    const $element = $('#component');
    $element.dxrButton({ text: 'test', icon: 'check' });
    const $contentElements = $element.find('.dx-button-content').children();

    assert.strictEqual($element.dxrButton('instance').option('template'), undefined, 'default template value');
    assert.ok($contentElements.eq(0).hasClass('dx-icon'), 'render icon');
    assert.ok($contentElements.eq(1).hasClass('dx-button-text'), 'render test');
});

QUnit.test('should pass correct container', function(assert) {
    const $element = $('#component');

    $element.dxrButton({
        template: function(data, container) {
            assert.strictEqual(isRenderer(container), !!config().useJQuery, 'container is correct');
            return $('<div>');
        }
    });
});

QUnit.test('should pass correct data', function(assert) {
    const $element = $('#component');

    $element.dxrButton({
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

    assert.strictEqual($element.text(), 'My button123', 'render correct text');
});

QUnit.test('should render jQuery', function(assert) {
    const $element = $('#component');

    $element.dxrButton({
        template: (data, container) => $('<div id="custom-template">'),
    });
    assert.strictEqual($element.find('.dx-button-content').length, 1, 'render content');
    assert.strictEqual($element.find('#custom-template').length, 1, 'render custom template');
});

QUnit.test('should render dom node', function(assert) {
    const $element = $('#component');

    $element.dxrButton({
        template: (data, container) => $('<div id="custom-template">').get(0),
    });
    assert.strictEqual($element.find('.dx-button-content').length, 1, 'render content');
    assert.strictEqual($element.find('#custom-template').length, 1, 'render custom template');
});

QUnit.test('should replace content if has "dx-template-wrapper" class', function(assert) {
    const $element = $('#component');

    $element.dxrButton({
        template: (data, container) => {
            const $element = $('<span>')
                .addClass('dx-template-wrapper');

            return $element.get(0);
        },
    });
    assert.ok($element.find('.dx-button-content').hasClass('dx-template-wrapper'), 'template has "dx-button-content" class');
});

QUnit.test('should rerender template in runtime', function(assert) {
    const template = (data, container) => $('<div id="custom-template">');
    const templateNew = (data, container) => $('<div id="new-template">');
    const $element = $('#component');

    $element.dxrButton({ template: template });
    assert.strictEqual($element.find('#custom-template').length, 1, 'render custom template');

    $element.dxrButton('instance').option('template', templateNew);
    assert.strictEqual($element.find('#custom-template').length, 0, 'not render old template');
    assert.strictEqual($element.find('#new-template').length, 1, 'render new template');
});

QUnit.test('should render submit input with custom template', function(assert) {
    const $element = $('#component');

    $element.dxrButton({
        useSubmitBehavior: true,
        template: (data, container) => $('<span>'),
    });

    assert.strictEqual($element.find('.dx-button-submit-input').length, 1, 'render submit input');
});

// NOTE: legacy tests for button
QUnit.module('options changed callbacks', {
    beforeEach: function() {
        this.element = $('#button').dxrButton();
        this.instance = this.element.dxrButton('instance');
    }
}, () => {
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

    // NOTE: deprecated property
    QUnit.skip('_templateData', function(assert) {
        const template = sinon.stub().returns('TPL');
        this.instance.option('template', template);
        this.instance.option('_templateData', { custom: 1 });
        template.reset();
        this.instance.repaint();

        assert.strictEqual(template.firstCall.args[0].custom, 1, 'custom field is correct');
    });

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
});

QUnit.module('regressions', {
    beforeEach: function() {
        this.element = $('#button').dxrButton();
        this.instance = this.element.dxrButton('instance');
    }
}, () => {
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

    QUnit.test('B238735: Button holds the shape of an arrow after you change it\'s type from back to any other', function(assert) {
        this.instance.option('type', 'back');
        assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), true, 'back button css class removed');

        this.instance.option('type', 'normal');
        assert.equal(this.element.hasClass(BUTTON_BACK_CLASS), false, 'back button css class removed');
    });
});

QUnit.module('contentReady', {}, () => {
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

        const $firstButton = $('#widget').dxrButton(buttonConfig);

        $('#button').dxrButton($.extend({}, buttonConfig, {
            onContentReady(e) {
                assert.ok(areElementsEqual($firstButton, $(e.element)), 'rendered widget and widget with fired action are equals');
                done();
            }
        }));
    });
});

QUnit.module('inkRipple', {}, () => {
    QUnit.test('inkRipple should be removed when widget is removed', function(assert) {
        const $element = $('#inkButton');

        $element.dxrButton({
            useInkRipple: true,
        });
        $element.dxrButton('instance').option('onClick', (e) => {
            const $element = $(e.component.$element());
            $element.triggerHandler({ type: 'dxremove' });
            $element.trigger('dxinactive');
            assert.ok(true, 'no exceptions');
        });

        $element.trigger('dxclick');
    });

    QUnit.test('widget should works correctly when the useInkRipple option is changed at runtime', function(assert) {
        const clock = sinon.useFakeTimers();
        const $inkButton = $('#inkButton').dxrButton({
            text: 'test',
            useInkRipple: true
        });
        const inkButton = $inkButton.dxrButton('instance');
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

QUnit.module('widget sizing render', {}, () => {
    QUnit.test('default', function(assert) {
        const $element = $('#widget').dxrButton({ text: 'ahoy!' });

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxrButton({ text: 'ahoy!', width: 400 });
        const instance = $element.dxrButton('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxrButton({ text: 'ahoy!' });
        const instance = $element.dxrButton('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxrButton({ text: 'ahoy!' });
        const instance = $element.dxrButton('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('keyboard navigation', {}, () => {
    QUnit.test('click fires on enter', function(assert) {
        assert.expect(2);

        let clickFired = 0;

        const $element = $('#button').dxrButton({
            focusStateEnabled: true, // NOTE: for ios 9 testing
        });

        // NOTE: initialize onClick in constructor doesn't trigger events correctly (dxclick, focusin, etc)
        $element.dxrButton('instance').option('onClick', () => clickFired++);

        const keyboard = keyboardMock($element);

        $element.trigger('focusin');
        keyboard.keyDown('enter');
        assert.equal(clickFired, 1, 'press enter on button call click action');

        keyboard.keyDown('space');
        assert.equal(clickFired, 2, 'press space on button call click action');
    });

    QUnit.test('arguments on key press', function(assert) {
        const clickHandler = sinon.spy();

        const $element = $('#button').dxrButton({
            focusStateEnabled: true, // NOTE: for ios 9 testing
        });

        // NOTE: initialize onClick in constructor doesn't trigger events correctly (dxclick, focusin, etc)
        $element.dxrButton('instance').option('onClick', clickHandler);

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
        this.$element = $('#button').dxrButton({ useSubmitBehavior: true });
        this.$form = $('#form');
        this.clickButton = function() {
            this.$element.trigger('dxclick');
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.clock.restore();
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
        const $element = this.$element.dxrButton({ validationGroup: '' });

        $element
            .find('.' + BUTTON_SUBMIT_INPUT_CLASS)
            .on('click', clickHandlerSpy);

        this.clickButton();

        assert.ok(clickHandlerSpy.calledOnce);
    });

    QUnit.test('widget should work correctly if useSubmitBehavior was changed runtime', function(assert) {
        const instance = this.$element.dxrButton('instance');

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

            const $element = this.$element.dxrButton({ validationGroup: 'testGroup' });

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
        this.$element.dxrButton({ onClick: clickHandlerSpy });
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
            const $element = this.$element.dxrButton({ validationGroup: 'testGroup' });
            const buttonInstance = this.$element.dxrButton('instance');


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
});

QUnit.module('templates', () => {
    checkStyleHelper.testInChromeOnDesktopActiveWindow('parent styles when button is not focused', function(assert) {
        const $template = $('<div>').text('test1');
        $('#button').dxrButton({
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

QUnit.module('events subscriptions', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        patchPreactOptions();
    },
    afterEach: function() {
        this.clock.restore();
        restorePreactOptions();
    }
}, () => {
    QUnit.test('click', function(assert) {
        const clickHandler = sinon.spy();
        const $button = $('#button').dxrButton({
            text: 'test'
        });
        const button = $button.dxrButton('instance');
        this.clock.tick();

        button.on('click', clickHandler);

        $button.trigger('dxclick');

        assert.ok(clickHandler.calledOnce, 'Handler should be called');
        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, 'Event params should be passed');
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.validationGroup, 'validationGroup should be passed');
    });

    QUnit.test('contentReady', function(assert) {
        assert.expect(3);

        const button = $('#button').dxrButton({
            text: 'test'
        }).dxrButton('instance');

        // NOTE: now we shouldn't call repaint, because we call onContentReady async
        button.on('contentReady', (e) => {
            assert.ok(e.component, 'Component info should be passed');
            assert.ok(e.element, 'Element info should be passed');
            assert.strictEqual($(e.element).text(), 'test', 'Text is rendered to the element');
        });

        this.clock.tick();
    });
});
