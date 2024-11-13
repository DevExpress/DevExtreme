import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import fx from 'common/core/animation/fx';
import { normalizeKeyName } from 'common/core/events/utils/index';

import 'generic_light.css!';
import 'ui/switch';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="switch"></div>\
            <div id="switch2"></div>\
            <div id="widget"></div>\
            <div id="invisibleSwitch"></div>\
            <div id="widthRootStyle"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
    $('#invisibleSwitch').css('display', 'none');
    $('#widthRootStyle').css('width', '300px');
});

const SWITCH_CLASS = 'dx-switch';
const SWITCH_ON_VALUE_CLASS = SWITCH_CLASS + '-on-value';
const INNER_CLASS = 'dx-switch-inner';
const HANDLE_CLASS = 'dx-switch-handle';

const DISABLED_CLASS = 'dx-state-disabled';

const INNER_SELECTOR = '.' + INNER_CLASS;
const HANDLE_SELECTOR = '.' + HANDLE_CLASS;

const LABEL_ON_CLASS = 'dx-switch-on';
const LABEL_OFF_CLASS = 'dx-switch-off';

const INNER_TRANSFORM_RANGE = {
    left: 'translateX(-50%)',
    right: 'translateX(0%)'
};

const HANDLE_TRANSFORM_RANGE = {
    left: 'translateX(0%)',
    right: 'translateX(-100%)'
};

const UIState = function(inner, handle) {
    if(inner.hasClass(SWITCH_CLASS)) {
        inner = inner.find(INNER_SELECTOR),
        handle = inner.find(HANDLE_SELECTOR);
    }

    const innerTransform = inner.get(0).style.transform;
    const handleTransform = handle.get(0).style.transform;

    if(innerTransform === INNER_TRANSFORM_RANGE.left && handleTransform === HANDLE_TRANSFORM_RANGE.left) {
        return false;
    } else if(innerTransform === INNER_TRANSFORM_RANGE.right && handleTransform === HANDLE_TRANSFORM_RANGE.right) {
        return true;
    } else {
        return undefined;
    }
};

const UIStateWithRTL = function(element) {
    let inner;
    let handle;

    if(element.hasClass(SWITCH_CLASS)) {
        inner = element.find(INNER_SELECTOR),
        handle = element.find(HANDLE_SELECTOR);
    }

    const innerTransform = inner.get(0).style.transform;
    const handleTransform = handle.get(0).style.transform;

    if(innerTransform === INNER_TRANSFORM_RANGE.right && handleTransform === HANDLE_TRANSFORM_RANGE.left) {
        return true;
    } else if(innerTransform === INNER_TRANSFORM_RANGE.right && handleTransform === HANDLE_TRANSFORM_RANGE.right) {
        return false;
    } else {
        return undefined;
    }
};

QUnit.module('widget init', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('switch should have correct width by default', function(assert) {
        const $element = $('#switch').dxSwitch();

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('onContentReady fired after the widget is fully ready', function(assert) {
        assert.expect(2);

        $('#switch').dxSwitch({
            value: true,
            onContentReady: function(e) {
                assert.ok($(e.element).hasClass(SWITCH_CLASS));
                assert.ok($(e.element).hasClass(SWITCH_ON_VALUE_CLASS));
            }
        });
    });

    QUnit.test('switchedOnText/switchedOffText options changing', function(assert) {
        const $element = $('#switch').dxSwitch({}); const instance = $element.dxSwitch('instance');

        instance.option('switchedOnText', '1');
        assert.equal($element.find('.' + LABEL_ON_CLASS).text(), '1');
        instance.option('switchedOnText', '11');
        assert.equal($element.find('.' + LABEL_ON_CLASS).text(), '11');

        instance.option('switchedOffText', '0');
        assert.equal($element.find('.' + LABEL_OFF_CLASS).text(), '0');
        instance.option('switchedOffText', '00');
        assert.equal($element.find('.' + LABEL_OFF_CLASS).text(), '00');
    });

    QUnit.test('onValueChanged option', function(assert) {
        let count = 0;

        const $element = $('#switch').dxSwitch({
            value: true,
            onValueChanged: function() {
                count++;
            }
        });

        const instance = $element.dxSwitch('instance');

        instance.option('value', false);
        assert.equal(count, 1);

        instance.option('onValueChanged', function() {
            count += 2;
        });

        instance.option('value', true);
        assert.equal(count, 3);
    });

    QUnit.test('value option changing', function(assert) {
        const element = $('#switch').dxSwitch({
            switchedOnText: 'customOn',
            switchedOffText: 'customOff',
            value: false
        });

        const instance = element.dxSwitch('instance');
        instance.option('value', true);
        assert.ok(element.hasClass('dx-switch-on-value'));
    });

    QUnit.test('value option changing - using non bool value', function(assert) {
        const element = $('#switch').dxSwitch();

        const instance = element.dxSwitch('instance');

        instance.option('value', undefined);
        assert.equal(element.dxSwitch('option', 'value'), false);

        instance.option('value', 123);
        assert.equal(element.dxSwitch('option', 'value'), true);
    });

    QUnit.test('value option changing must invoke the \'onValueChanged\' action', function(assert) {
        const switcher = $('#switch').dxSwitch({ onValueChanged: function() { assert.ok(true); } }).dxSwitch('instance');
        switcher.option('value', true);
    });

    QUnit.test('disabled option', function(assert) {
        const element = $('#switch').dxSwitch();

        const instance = element.dxSwitch('instance');

        instance.option('disabled', true);
        instance.option('value', true);

        element.trigger('dxclick');
        assert.equal(instance.option('value'), true, 'value is not changed');
    });

    QUnit.test('disabled switch should have special class', function(assert) {
        const element = $('#switch2').dxSwitch({ disabled: true });

        assert.ok(element.hasClass(DISABLED_CLASS));
    });
});

QUnit.module('invisible container', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('the position of handle for invisible and visible switch should be equal', function(assert) {
        const $visibleElement = $('#switch').dxSwitch(); const $invisibleElement = $('#invisibleSwitch').dxSwitch();

        $invisibleElement.css('display', 'block');
        assert.equal($visibleElement.find('.' + HANDLE_CLASS).position().left, $invisibleElement.find('.' + HANDLE_CLASS).position().left);
    });
});

QUnit.module('hidden input', () => {
    QUnit.test('the hidden input should change its value on widget value change', function(assert) {
        const $element = $('#switch').dxSwitch({
            value: true
        });
        const instance = $element.dxSwitch('instance');
        const $input = $element.find('input');

        instance.option('value', false);
        assert.equal($input.val(), 'false', 'input value has been changed');

        instance.option('value', true);
        assert.equal($input.val(), 'true', 'input value has been changed second time');
    });
});

QUnit.module('the \'name\' option', () => {
    QUnit.test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = $('#switch').dxSwitch({
            name: expectedName
        });
        const $input = $element.find('input');

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

QUnit.module('interaction', {
    beforeEach: function() {
        fx.off = true;

        this.element = $('#switch').dxSwitch({ value: true });
        this.mouse = pointerMock(this.element);
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('click switches state', function(assert) {
        this.element.trigger('dxclick');
        assert.strictEqual(UIState(this.element), false);
        assert.equal(this.element.dxSwitch('option', 'value'), false);

        this.element.trigger('dxclick');
        assert.strictEqual(UIState(this.element), true);
        assert.equal(this.element.dxSwitch('option', 'value'), true);
    });

    QUnit.test('swipe switches state', function(assert) {
        this.mouse.start().swipeStart().swipeEnd(-1);
        assert.strictEqual(UIState(this.element), false);
        assert.equal(this.element.dxSwitch('option', 'value'), false);

        this.mouse.start().swipeStart().swipeEnd(1);
        assert.strictEqual(UIState(this.element), true);
        assert.equal(this.element.dxSwitch('option', 'value'), true);
    });

    QUnit.test('swipe gesture is to fire onValueChanged', function(assert) {
        const valueChangeStub = sinon.stub();
        const $element = $('#switch').dxSwitch({
            value: true,
            onValueChanged: valueChangeStub
        });

        const mouse = pointerMock($element);

        mouse.start().swipeStart().swipeEnd(-1);
        assert.ok(valueChangeStub.calledOnce);

        mouse.start().swipeStart().swipeEnd(1);
        assert.ok(valueChangeStub.calledTwice);

        const { event } = valueChangeStub.lastCall.args[0];
        assert.ok(event);
        assert.strictEqual(event.type, 'dxswipeend');
    });

    QUnit.test('swipe doesn\'t turn off feedback during gesture', function(assert) {
        const activeStateClass = 'dx-state-active';

        const clock = sinon.useFakeTimers();

        try {
            assert.equal(this.element.hasClass(activeStateClass), false, 'feedback off before start');
            this.mouse.start().swipeStart();
            assert.equal(this.element.hasClass(activeStateClass), true, 'feedback on gesture start');

            this.mouse.swipe(0.01);
            assert.equal(this.element.hasClass(activeStateClass), true, 'feedback stays on after gesture start');

            this.mouse.swipe(0.2);
            assert.equal(this.element.hasClass(activeStateClass), true, 'feedback stays on after gesture continue');

            this.mouse.swipeEnd(1);
            assert.equal(this.element.hasClass(activeStateClass), false, 'feedback off after gesture end');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('click during animation hasn\'t any effects', function(assert) {
        const originalFxOff = fx.off;
        fx.off = false;
        const clock = sinon.useFakeTimers();
        try {
            const element = this.element;
            const instance = element.dxSwitch('instance');
            const originalRenderPosition = instance._renderPosition;
            let prevState = Number.MAX_VALUE;
            let stateMonotonicallyDecreases = true;
            const d1 = $.Deferred();
            const d2 = $.Deferred();

            instance._renderPosition = function(state, swipeOffset) {
                originalRenderPosition.call(instance, state, swipeOffset);
                stateMonotonicallyDecreases = stateMonotonicallyDecreases && (state <= prevState);
                prevState = state;
            };

            instance._animationDuration = 12345;

            element.click();

            setTimeout(function() {
                d1.resolve();
            }, 100);

            clock.tick(100);

            $.when(d1).done(function() {
                element.click();
                setTimeout(function() {
                    d2.resolve();
                }, 500);
            });

            clock.tick(500);

            $.when(d2).done(function() {
                assert.ok(stateMonotonicallyDecreases);
            });
        } finally {
            clock.restore();
            fx.off = originalFxOff;
        }
    });

    QUnit.test('switch should have right class before animation', function(assert) {
        const originalAnimation = fx.animate;
        const clock = sinon.useFakeTimers();
        try {
            const element = this.element;
            const instance = element.dxSwitch('instance');

            instance.option('value', false);

            fx.animate = function($element, config) {
                assert.ok(element.hasClass(SWITCH_ON_VALUE_CLASS), 'Switch has correct class');
            };

            this.element.trigger('dxclick');
            clock.tick(150);
        } finally {
            fx.animate = originalAnimation;
            clock.restore();
        }
    });

    QUnit.test('widget should be active while handle is swiped', function(assert) {
        const $element = this.element; const pointer = this.mouse; const clock = sinon.useFakeTimers();

        try {
            pointer.start().down().swipeStart().up();
            clock.tick(400);

            assert.ok($element.hasClass('dx-state-active'), 'widget is still active');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('handle follow of mouse during swipe', function(assert) {
        const $element = this.element;
        const pointer = this.mouse;

        $element.dxSwitch('option', { value: false });

        const $container = $element.find('.dx-switch-container');
        const $handle = $element.find('.dx-switch-handle');
        const $innerWrapper = $element.find('.dx-switch-inner');
        const offset = ($container.outerWidth(true) - $handle.outerWidth()) / 2;

        pointer.start().down().move(offset, 0);

        const innerTransform = $innerWrapper.get(0).style.transform;
        const handleTransform = $handle.get(0).style.transform;

        assert.equal(innerTransform, 'translateX(-25%)', 'Inner position is right');
        assert.equal(handleTransform, 'translateX(-50%)', 'Handle position is right');
    });

    QUnit.test('handle should have correct position after swipeend', function(assert) {
        const $element = this.element;
        const pointer = this.mouse;

        $element.dxSwitch('option', { value: false });

        const $container = $element.find('.dx-switch-container');
        const $handle = $element.find('.dx-switch-handle');
        const $innerWrapper = $element.find('.dx-switch-inner');
        const offset = ($container.outerWidth(true) - $handle.outerWidth()) / 4;

        pointer.start().down().move(offset, 0).up();

        const innerTransform = $innerWrapper.get(0).style.transform;
        const handleTransform = $handle.get(0).style.transform;

        assert.equal(innerTransform, 'translateX(0%)', 'Inner position is right');
        assert.equal(handleTransform, 'translateX(-100%)', 'Handle position is right');
    });

    QUnit.test('click on disabled switch has no effect', function(assert) {
        const element = this.element;
        const instance = element.dxSwitch('instance');

        instance.option('value', false);
        instance.option('disabled', true);

        element.trigger('dxclick');
        assert.strictEqual(UIState(element), false);

        this.mouse.start().swipeStart().swipeEnd(-1);
        assert.strictEqual(UIState(element), false);
    });
});

QUnit.module('RTL', {
    beforeEach: function() {
        fx.off = true;

        this.element = $('#switch').dxSwitch({ value: true, rtlEnabled: true });
        this.mouse = pointerMock(this.element);
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('click switches state', function(assert) {
        const $element = this.element; const instance = this.element.dxSwitch('instance');

        $element.trigger('dxclick');
        assert.equal(instance.option('value'), false);

        $element.trigger('dxclick');
        assert.strictEqual(UIStateWithRTL($element), true);
        assert.equal(instance.option('value'), true);
    });

    QUnit.test('swipe switches state', function(assert) {
        const $element = this.element; const instance = this.element.dxSwitch('instance');

        this.mouse.start().swipeStart().swipeEnd(1);
        assert.equal(instance.option('value'), false);

        this.mouse.start().swipeStart().swipeEnd(-1);
        assert.strictEqual(UIStateWithRTL($element), true);
        assert.equal(instance.option('value'), true);
    });
});

QUnit.module('widget sizing render', () => {
    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxSwitch({ width: 400 }); const instance = $element.dxSwitch('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxSwitch(); const instance = $element.dxSwitch('instance'); const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('state changes on enter/space/right and left key press', function(assert) {
        assert.expect(5);

        const $element = $('#widget').dxSwitch({
            focusStateEnabled: true,
            value: false
        });
        const instance = $element.dxSwitch('instance');
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');

        keyboard.keyDown('enter');
        assert.equal(instance.option('value'), true, 'value has been change');

        keyboard.keyDown('space');
        assert.equal(instance.option('value'), false, 'value has been change');

        keyboard.keyDown('right');
        assert.equal(instance.option('value'), true, 'value has been change');

        keyboard.keyDown('right');
        assert.equal(instance.option('value'), true, 'value has not been change');

        keyboard.keyDown('left');
        assert.equal(instance.option('value'), false, 'value has been change');
    });

    QUnit.test('state changes on right and left key press correctly in rtl mode', function(assert) {
        assert.expect(2);

        const $element = $('#widget').dxSwitch({
            focusStateEnabled: true,
            value: false,
            rtlEnabled: true
        });
        const instance = $element.dxSwitch('instance');
        const keyboard = keyboardMock($element);

        $element.trigger('focusin');

        keyboard.keyDown('left');
        assert.equal(instance.option('value'), true, 'value has not been change');

        keyboard.keyDown('right');
        assert.equal(instance.option('value'), false, 'value has been change');
    });
});

QUnit.module('valueChanged handler should receive correct event parameter', {
    beforeEach: function() {
        fx.off = true;

        this.valueChangedHandler = sinon.stub();
        const initialOptions = {
            onValueChanged: this.valueChangedHandler,
            focusStateEnabled: true
        };

        this.init = (options) => {
            this.$element = $('#switch').dxSwitch(options);
            this.instance = this.$element.dxSwitch('instance');
            this.keyboard = keyboardMock(this.$element);
            this.pointer = pointerMock(this.$element);
        };
        this.reinit = (options) => {
            this.instance.dispose();
            this.init($.extend({}, initialOptions, options));
        };
        this.testProgramChange = (assert) => {
            const value = this.instance.option('value');
            this.instance.option('value', !value);

            const callCount = this.valueChangedHandler.callCount;
            const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
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

        this.init(initialOptions);
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('on runtime change', function(assert) {
        this.testProgramChange(assert);
    });

    QUnit.test('on click', function(assert) {
        this.$element.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', this.$element);
        this.testProgramChange(assert);
    });

    QUnit.test('on swipe', function(assert) {
        this.pointer.start().swipeStart().swipeEnd(1);

        this.checkEvent(assert, 'dxswipeend', this.$element);
        this.testProgramChange(assert);
    });

    ['enter', 'space'].forEach(key => {
        QUnit.test(`on ${key} press`, function(assert) {
            this.keyboard.press(key);

            this.checkEvent(assert, 'keydown', this.$element, key);
            this.testProgramChange(assert);
        });
    });

    ['rightArrow', 'leftArrow'].forEach(arrow => {
        QUnit.test(`on ${arrow.replace('Arrow', '')} arrow press`, function(assert) {
            this.reinit({ value: arrow === 'leftArrow' ? true : false });

            this.keyboard.press(arrow);

            this.checkEvent(assert, 'keydown', this.$element, arrow);
            this.testProgramChange(assert);
        });
    });
});
