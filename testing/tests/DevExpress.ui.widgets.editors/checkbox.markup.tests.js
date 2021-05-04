import $ from 'jquery';
import 'ui/check_box';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="checkBox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const CHECKBOX_CLASS = 'dx-checkbox';
const CHECKBOX_CONTAINER_CLASS = 'dx-checkbox-container';
const CHECKBOX_CONTAINER_SELECTOR = '.dx-checkbox-container';
const ICON_SELECTOR = '.dx-checkbox-icon';
const CHECKBOX_TEXT_CLASS = 'dx-checkbox-text';
const CHECKBOX_HAS_TEXT_CLASS = 'dx-checkbox-has-text';
const CHECKED_CLASS = 'dx-checkbox-checked';

QUnit.module('Checkbox markup', () => {
    QUnit.test('markup init', function(assert) {
        const $element = $('#checkBox').dxCheckBox();
        const $content = $element.find(CHECKBOX_CONTAINER_SELECTOR);

        assert.ok($element.hasClass(CHECKBOX_CLASS), 'widget has checkbox class');
        assert.notOk($element.hasClass(CHECKBOX_HAS_TEXT_CLASS), 'checkbox without text has not text class');
        assert.ok($content.hasClass(CHECKBOX_CONTAINER_CLASS), 'checkbox has a container');
        assert.strictEqual($content.find(ICON_SELECTOR).length, 1, 'checkbox has an icon');
    });

    QUnit.test('checkbox should have correct text', function(assert) {
        const $element = $('#checkBox').dxCheckBox({
            text: 'text'
        });
        const $content = $element.find(CHECKBOX_CONTAINER_SELECTOR);
        const text = $content.find(`.${CHECKBOX_TEXT_CLASS}`).text();

        assert.strictEqual(text, 'text', 'text is correct');
        assert.ok($element.hasClass(CHECKBOX_HAS_TEXT_CLASS), 'checkbox with text has text class');
    });

    QUnit.test('a hidden input should be rendered', function(assert) {
        const $element = $('#checkBox').dxCheckBox();
        const $input = $element.find('input');

        assert.strictEqual($input.length, 1, 'input is rendered');
        assert.strictEqual($input.attr('type'), 'hidden', 'type attribute of hidden input');
    });

    QUnit.test('init with options', function(assert) {
        const $element = $('#checkBox').dxCheckBox({
            value: true
        });

        assert.ok($element.hasClass(CHECKED_CLASS), 'checkBox is checked');
    });

    QUnit.test('checked class should not be rendered when value is not true (Q504139)', function(assert) {
        const $element = $('#checkBox').dxCheckBox({ value: undefined });
        const instance = $element.dxCheckBox('instance');
        assert.notOk($element.hasClass(CHECKED_CLASS));

        instance.option({ value: null });
        assert.notOk($element.hasClass(CHECKED_CLASS));

        instance.option({ value: 0 });
        assert.notOk($element.hasClass(CHECKED_CLASS));
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', function(assert) {
        const $element = $('#checkBox').dxCheckBox({});
        assert.strictEqual($element.attr('role'), 'checkbox', 'aria role is correct');
    });

    QUnit.test('aria checked attributes', function(assert) {
        const $element = $('#checkBox').dxCheckBox({ value: true });
        const instance = $element.dxCheckBox('instance');

        assert.strictEqual($element.attr('aria-checked'), 'true', 'checked state is correct');

        instance.option('value', false);
        assert.strictEqual($element.attr('aria-checked'), 'false', 'unchecked state is correct');

        instance.option('value', undefined);
        assert.strictEqual($element.attr('aria-checked'), 'mixed', 'mixed state is correct');
    });
});

