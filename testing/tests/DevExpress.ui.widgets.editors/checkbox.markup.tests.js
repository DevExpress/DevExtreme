var $ = require('jquery');

require('common.css!');
require('ui/check_box');

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="checkbox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var CHECKBOX_CLASS = 'dx-checkbox',
    CHECKBOX_CONTAINER_CLASS = 'dx-checkbox-container',
    CHECKBOX_CONTAINER_SELECTOR = '.dx-checkbox-container',
    ICON_SELECTOR = '.dx-checkbox-icon',
    CHECKBOX_TEXT_CLASS = 'dx-checkbox-text',
    CHECKBOX_HAS_TEXT_CLASS = 'dx-checkbox-has-text';


QUnit.module('Checkbox markup', () => {
    QUnit.test('markup init', function(assert) {
        var element = $('#checkbox').dxCheckBox();

        assert.ok(element.hasClass(CHECKBOX_CLASS));

        var checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

        assert.ok(checkboxContent.hasClass(CHECKBOX_CONTAINER_CLASS), 'checkbox has a container');

        assert.equal(checkboxContent.find(ICON_SELECTOR).length, 1, 'checkbox has an icon');
    });

    QUnit.test('checkbox should have correct text', function(assert) {
        var element = $('#checkbox').dxCheckBox({
            text: 'text'
        });

        var checkboxContent = element.find(CHECKBOX_CONTAINER_SELECTOR);

        assert.equal($.trim(checkboxContent.find('.' + CHECKBOX_TEXT_CLASS).text()), 'text');
        assert.ok(element.hasClass(CHECKBOX_HAS_TEXT_CLASS), 'checkbox with text has text class');
    });

    QUnit.test('a hidden input should be rendered', function(assert) {
        var $element = $('#checkbox').dxCheckBox(),
            $input = $element.find('input');

        assert.equal($input.length, 1, 'input is rendered');
        assert.equal($input.attr('type'), 'hidden', 'type attribute of hidden input');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', function(assert) {
        var $element = $('#checkbox').dxCheckBox({});
        assert.equal($element.attr('role'), 'checkbox', 'aria role is correct');
    });

    QUnit.test('aria checked attributes', function(assert) {
        var $element = $('#checkbox').dxCheckBox({ value: true }),
            instance = $element.dxCheckBox('instance');

        assert.equal($element.attr('aria-checked'), 'true', 'checked state is correct');

        instance.option('value', '');
        assert.equal($element.attr('aria-checked'), 'false', 'unchecked state is correct');

        instance.option('value', undefined);
        assert.equal($element.attr('aria-checked'), 'mixed', 'mixed state is correct');
    });
});

