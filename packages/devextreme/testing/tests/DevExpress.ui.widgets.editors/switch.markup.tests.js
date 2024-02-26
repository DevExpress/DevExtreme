import $ from 'jquery';

import 'generic_light.css!';

import 'ui/switch';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="switch"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const SWITCH_CLASS = 'dx-switch';
const WRAPPER_CLASS = 'dx-switch-wrapper';
const CONTAINER_CLASS = 'dx-switch-container';

const INNER_CLASS = 'dx-switch-inner';
const INNER_SELECTOR = '.' + INNER_CLASS;
const HANDLE_CLASS = 'dx-switch-handle';
const HANDLE_SELECTOR = '.' + HANDLE_CLASS;

const LABEL_ON_CLASS = 'dx-switch-on';
const LABEL_OFF_CLASS = 'dx-switch-off';
const LABEL_ON_SELECTOR = '.' + LABEL_ON_CLASS;
const LABEL_OFF_SELECTOR = '.' + LABEL_OFF_CLASS;

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

QUnit.module('Switch markup', () => {
    QUnit.test('markup', function(assert) {
        const element = $('#switch').dxSwitch();

        assert.ok(element.hasClass(SWITCH_CLASS));

        const wrapper = element.find('.' + WRAPPER_CLASS);
        assert.equal(wrapper.length, 1);

        const container = wrapper.children();
        assert.equal(container.length, 1);
        assert.ok(container.hasClass(CONTAINER_CLASS));

        const inner = element.find(INNER_SELECTOR);
        assert.ok(inner.length, 'Switch inner');

        const labelOnEl = element.find(LABEL_ON_SELECTOR);
        assert.ok(labelOnEl.length, 'Switch label');

        const handleEl = element.find(HANDLE_SELECTOR);
        assert.ok(handleEl.length, 'Switch handle');

        const labelOffEl = element.find(LABEL_OFF_SELECTOR);
        assert.ok(labelOffEl.length, 'Switch label');
    });

    QUnit.test('default labels', function(assert) {
        const element = $('#switch').dxSwitch();

        const inner = element.find(INNER_SELECTOR);

        const labelOnEl = inner.find(LABEL_ON_SELECTOR);
        assert.equal($.trim(labelOnEl.text()), 'ON');

        const labelOffEl = inner.find(LABEL_OFF_SELECTOR);
        assert.equal($.trim(labelOffEl.text()), 'OFF');
    });

    QUnit.test('switchedOnText/switchedOffText on init', function(assert) {
        const element = $('#switch').dxSwitch({
            switchedOnText: 'customOn',
            switchedOffText: 'customOff'
        });

        const inner = element.find(INNER_SELECTOR);

        const textOnEl = inner.find(LABEL_ON_SELECTOR);
        assert.equal($.trim(textOnEl.text()), 'customOn');

        const textOffEl = inner.find(LABEL_OFF_SELECTOR);
        assert.equal($.trim(textOffEl.text()), 'customOff');
    });

    QUnit.test('default ui state', function(assert) {
        const element = $('#switch').dxSwitch();

        const inner = element.find(INNER_SELECTOR);
        const handle = element.find(HANDLE_SELECTOR);

        assert.strictEqual(UIState(inner, handle), false, 'Default UI state is right');
    });

    QUnit.test('ui state with options', function(assert) {
        const element = $('#switch').dxSwitch({
            switchedOnText: 'customOn',
            switchedOffText: 'customOff',
            value: true
        });

        const inner = element.find(INNER_SELECTOR);
        const handle = element.find(HANDLE_SELECTOR);

        assert.strictEqual(UIState(inner, handle), true, 'UI state with options is right');
    });


    QUnit.test('a hidden input should be rendered', function(assert) {
        const $element = $('#switch').dxSwitch(); const $input = $element.find('input');

        assert.equal($input.length, 1, 'input is rendered');
        assert.equal($input.attr('type'), 'hidden', 'input type is \'hidden\'');
    });

    QUnit.test('input should be able to get the \'true\' value', function(assert) {
        const $element = $('#switch').dxSwitch({
            value: true
        });
        const $input = $element.find('input');

        assert.equal($input.val(), 'true', 'the input value is \'true\'');
    });

    QUnit.test('input should be able to get the \'false\' value', function(assert) {
        const $element = $('#switch').dxSwitch({
            value: false
        });
        const $input = $element.find('input');

        assert.equal($input.val(), 'false', 'the input value is \'false\'');
    });
});

QUnit.module('Accessibility', () => {
    QUnit.test('Switch should have correct role attribute', function(assert) {
        const $element = $('#switch').dxSwitch();

        assert.strictEqual($element.attr('role'), 'switch', 'Element should have role=switch');
    });

    QUnit.test('Switch should have correct aria-checked attribute', function(assert) {
        const $element = $('#switch').dxSwitch();
        const instance = $element.dxSwitch('instance');

        assert.strictEqual($element.attr('aria-checked'), 'false', 'aria-checked must be false if the value is false');

        instance.option({ value: true });

        assert.strictEqual($element.attr('aria-checked'), 'true', 'aria-checked must be true if the value is true');
    });

    QUnit.test('Switch should have correct aria-label attribute', function(assert) {
        const $element = $('#switch').dxSwitch({
            switchedOnText: 'on test',
            switchedOffText: 'off test',
        });
        const instance = $element.dxSwitch('instance');

        assert.strictEqual($element.attr('aria-label'), 'off test', 'aria-label must have switchOffText if the value is false');

        instance.option({ value: true });

        assert.strictEqual($element.attr('aria-label'), 'on test', 'aria-label must have switchedOnText if the value if true');
    });

    QUnit.test('Switch should have correct aria-disabled and tabindex attributes', function(assert) {
        const $element = $('#switch').dxSwitch({ focusStateEnabled: true });
        const instance = $element.dxSwitch('instance');

        assert.strictEqual($element.attr('aria-disabled'), undefined, 'The element should not have an aria-disabled attribute unless it is disabled');
        assert.strictEqual($element.attr('tabindex'), '0', 'The element must have tabindex=0 if it is not disabled');

        instance.option({ disabled: true });

        assert.strictEqual($element.attr('aria-disabled'), 'true', 'The element must have aria-disabled=true if it is disabled');
        assert.strictEqual($element.attr('tabindex'), undefined, 'The element should not have an aria-disabled attribute if it is disabled');
    });

    QUnit.test('Switch should have correct aria-readonly attribute', function(assert) {
        const $element = $('#switch').dxSwitch();
        const instance = $element.dxSwitch('instance');

        assert.strictEqual($element.attr('aria-readonly'), undefined, 'The element should not have aria-readonly attribute if readOnly is false');

        instance.option({ readOnly: true });

        assert.strictEqual($element.attr('aria-readonly'), 'true', 'The element must have aria-readonly=true if readOnly is true');
    });
});
