const $ = require('jquery');

require('common.css!');
require('ui/text_area');

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="textarea"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});


const TEXTAREA_CLASS = 'dx-textarea';
const INPUT_CLASS = 'dx-texteditor-input';
const CONTAINER_CLASS = 'dx-texteditor-container';
const PLACEHOLDER_CLASS = 'dx-placeholder';


QUnit.module('rendering', () => {
    QUnit.test('markup init', function(assert) {
        assert.expect(5);

        var $element = $('#textarea').dxTextArea();

        assert.ok($element.hasClass(TEXTAREA_CLASS));
        assert.equal($element.children().length, 1);
        assert.equal($element.find('.' + PLACEHOLDER_CLASS).length, 1);
        assert.equal($element.find('.' + INPUT_CLASS).length, 1);
        assert.equal($element.find('.' + CONTAINER_CLASS).length, 1);
    });

    QUnit.test('init with options', function(assert) {
        assert.expect(3);

        var $element = $('#textarea').dxTextArea({
            value: 'custom',
            placeholder: 'enter value',
            required: true,
            readOnly: true
        });

        var $input = $element.find('.' + INPUT_CLASS);

        assert.equal($input.val(), 'custom');
        assert.equal($input.prop('placeholder') || $element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'enter value');
        assert.equal($input.prop('readOnly'), true);
    });
});

QUnit.module('init properties', () => {
    QUnit.test('disabled', function(assert) {
        var $element = $('#textarea').dxTextArea({ disabled: true }),
            $input = $element.find('.' + INPUT_CLASS);

        assert.ok($input.prop('disabled'));
    });

    QUnit.test('placeholder', function(assert) {
        var $element = $('#textarea').dxTextArea({ placeholder: 'John Doe' });

        assert.equal($element.find('.' + INPUT_CLASS).prop('placeholder') || $element.find('.' + PLACEHOLDER_CLASS).attr('data-dx_placeholder'), 'John Doe');
    });

    QUnit.test('inputAttr', function(assert) {
        var $textArea = $('#textarea').dxTextArea({
                inputAttr: { id: 'testId' }
            }),
            $input = $textArea.find('.' + INPUT_CLASS);

        assert.equal($input.attr('id'), 'testId', 'Attr ID was created on Init');
    });

    QUnit.test('the \'inputAttr\' option should preserve widget specific classes', function(assert) {
        var $textArea = $('#textarea').dxTextArea({
            inputAttr: { class: 'some-class' }
        });

        assert.equal($textArea.find('.' + INPUT_CLASS).length, 1, 'widget specific class is preserved');
    });

    QUnit.test('readOnly', function(assert) {
        var $element = $('#textarea').dxTextArea({ readOnly: true }),
            $input = $element.find('.' + INPUT_CLASS);

        assert.ok($input.prop('readOnly'));
    });
});

QUnit.module('widget sizing render', () => {
    QUnit.test('constructor', function(assert) {
        var $element = $('#textarea').dxTextArea({ width: 400 }),
            elementStyles = $element.get(0).style;

        assert.strictEqual(elementStyles.width, '400px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('the \'minHeight\' option works correctly', function(assert) {
        var $element = $('#textarea').dxTextArea({
                minHeight: 30,
                height: 0
            }),
            elementStyles = $element.get(0).style;

        assert.equal(elementStyles.minHeight, '30px', 'widget min-height is correct');
    });

    QUnit.test('the \'maxHeight\' option works correctly', function(assert) {
        var $element = $('#textarea').dxTextArea({
                maxHeight: 30,
                height: 100
            }),
            elementStyles = $element.get(0).style;

        assert.equal(elementStyles.maxHeight, '30px', 'widget max-height is correct');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria multiline attribute', function(assert) {
        var $element = $('#textarea').dxTextArea();
        assert.equal($element.find('.dx-texteditor-input').attr('aria-multiline'), 'true', 'aria multiline is correct');
    });
});

