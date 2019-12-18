var $ = require('jquery');

require('common.css!');
require('ui/switch');

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="switch"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var SWITCH_CLASS = 'dx-switch',
    WRAPPER_CLASS = 'dx-switch-wrapper',
    CONTAINER_CLASS = 'dx-switch-container',

    INNER_CLASS = 'dx-switch-inner',
    INNER_SELECTOR = '.' + INNER_CLASS,
    HANDLE_CLASS = 'dx-switch-handle',
    HANDLE_SELECTOR = '.' + HANDLE_CLASS,

    LABEL_ON_CLASS = 'dx-switch-on',
    LABEL_OFF_CLASS = 'dx-switch-off',
    LABEL_ON_SELECTOR = '.' + LABEL_ON_CLASS,
    LABEL_OFF_SELECTOR = '.' + LABEL_OFF_CLASS;

var INNER_TRANSFORM_RANGE = {
        left: 'translateX(-50%)',
        right: 'translateX(0%)'
    },

    HANDLE_TRANSFORM_RANGE = {
        left: 'translateX(0%)',
        right: 'translateX(-100%)'
    };

var UIState = function(inner, handle) {
    if(inner.hasClass(SWITCH_CLASS)) {
        inner = inner.find(INNER_SELECTOR),
        handle = inner.find(HANDLE_SELECTOR);
    }

    var innerTransform = inner.get(0).style.transform,
        handleTransform = handle.get(0).style.transform;

    if(innerTransform === INNER_TRANSFORM_RANGE.left && handleTransform === HANDLE_TRANSFORM_RANGE.left) {
        return false;
    } else if(innerTransform === INNER_TRANSFORM_RANGE.right && handleTransform === HANDLE_TRANSFORM_RANGE.right) {
        return true;
    } else {
        return undefined;
    }
};

QUnit.module('Switch markup');

QUnit.test('markup', function(assert) {
    var element = $('#switch').dxSwitch();

    assert.ok(element.hasClass(SWITCH_CLASS));

    var wrapper = element.find('.' + WRAPPER_CLASS);
    assert.equal(wrapper.length, 1);

    var container = wrapper.children();
    assert.equal(container.length, 1);
    assert.ok(container.hasClass(CONTAINER_CLASS));

    var inner = element.find(INNER_SELECTOR);
    assert.ok(inner.length, 'Switch inner');

    var labelOnEl = element.find(LABEL_ON_SELECTOR);
    assert.ok(labelOnEl.length, 'Switch label');

    var handleEl = element.find(HANDLE_SELECTOR);
    assert.ok(handleEl.length, 'Switch handle');

    var labelOffEl = element.find(LABEL_OFF_SELECTOR);
    assert.ok(labelOffEl.length, 'Switch label');
});

QUnit.test('default labels', function(assert) {
    var element = $('#switch').dxSwitch();

    var inner = element.find(INNER_SELECTOR);

    var labelOnEl = inner.find(LABEL_ON_SELECTOR);
    assert.equal($.trim(labelOnEl.text()), 'ON');

    var labelOffEl = inner.find(LABEL_OFF_SELECTOR);
    assert.equal($.trim(labelOffEl.text()), 'OFF');
});

QUnit.test('switchedOnText/switchedOffText on init', function(assert) {
    var element = $('#switch').dxSwitch({
        switchedOnText: 'customOn',
        switchedOffText: 'customOff'
    });

    var inner = element.find(INNER_SELECTOR);

    var textOnEl = inner.find(LABEL_ON_SELECTOR);
    assert.equal($.trim(textOnEl.text()), 'customOn');

    var textOffEl = inner.find(LABEL_OFF_SELECTOR);
    assert.equal($.trim(textOffEl.text()), 'customOff');
});

QUnit.test('default ui state', function(assert) {
    var element = $('#switch').dxSwitch();

    var inner = element.find(INNER_SELECTOR),
        handle = element.find(HANDLE_SELECTOR);

    assert.strictEqual(UIState(inner, handle), false, 'Default UI state is right');
});

QUnit.test('ui state with options', function(assert) {
    var element = $('#switch').dxSwitch({
        switchedOnText: 'customOn',
        switchedOffText: 'customOff',
        value: true
    });

    var inner = element.find(INNER_SELECTOR),
        handle = element.find(HANDLE_SELECTOR);

    assert.strictEqual(UIState(inner, handle), true, 'UI state with options is right');
});


QUnit.test('a hidden input should be rendered', function(assert) {
    var $element = $('#switch').dxSwitch(),
        $input = $element.find('input');

    assert.equal($input.length, 1, 'input is rendered');
    assert.equal($input.attr('type'), 'hidden', 'input type is \'hidden\'');
});

QUnit.test('input should be able to get the \'true\' value', function(assert) {
    var $element = $('#switch').dxSwitch({
            value: true
        }),
        $input = $element.find('input');

    assert.equal($input.val(), 'true', 'the input value is \'true\'');
});

QUnit.test('input should be able to get the \'false\' value', function(assert) {
    var $element = $('#switch').dxSwitch({
            value: false
        }),
        $input = $element.find('input');

    assert.equal($input.val(), 'false', 'the input value is \'false\'');
});

QUnit.module('aria accessibility');

QUnit.test('aria role', function(assert) {
    var $element = $('#switch').dxSwitch({});

    assert.equal($element.attr('role'), 'button', 'aria role is correct');
});

QUnit.test('aria properties', function(assert) {
    var $element = $('#switch').dxSwitch({
            switchedOnText: 'on test',
            switchedOffText: 'off test',
            value: true
        }),
        instance = $element.dxSwitch('instance');

    assert.equal($element.attr('aria-label'), 'on test', 'aria \'on state\' label is correct');
    assert.equal($element.attr('aria-pressed'), 'true', 'aria \'on state\' pressed attribute is correct');

    instance.option('value', false);
    assert.equal($element.attr('aria-label'), 'off test', 'aria \'off state\' label is correct');
    assert.equal($element.attr('aria-pressed'), 'false', 'aria \'off state\' pressed attribute is correct');
});
