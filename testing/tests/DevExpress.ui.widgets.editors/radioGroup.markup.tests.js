import $ from 'jquery';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import RadioGroup from 'ui/radio_group';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

QUnit.testStart(() => {
    const markup =
        '<div id="radioGroup"> </div>\
        <div id="radioGroup2"> </div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>';

    $('#qunit-fixture').html(markup);
});

const RADIO_GROUP_CLASS = 'dx-radiogroup',
    RADIO_BUTTON_CLASS = 'dx-radiobutton',
    RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';

const toSelector = cssClass => '.' + cssClass;

const moduleConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
};

QUnit.module('buttons group rendering', moduleConfig, () => {
    QUnit.test('widget should be rendered', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup();

        assert.ok($radioGroup.hasClass(RADIO_GROUP_CLASS), 'widget class added');
    });

    QUnit.test('widget should generate buttons', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' }
            ]
        });

        assert.equal($radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).length, 3, 'buttons generated');
    });

    QUnit.test('empty message should not be generated if no items', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup();

        assert.equal($radioGroup.find('.dx-scrollview-content').text(), '', 'empty message is not shown');
    });

    QUnit.test('widget should correctly process \'disabled\' option changed', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' }
            ],
            disabled: true
        });

        assert.ok($radioGroup.find('.dx-collection').hasClass('dx-state-disabled'), 'inner collection has disabled-state class');

        const radioGroup = $radioGroup.dxRadioGroup('instance');
        radioGroup.option('disabled', false);

        assert.ok(!$radioGroup.find('.dx-collection').hasClass('dx-state-disabled'), 'inner collection hasn\'t disabled-state class');
    });
});

QUnit.module('buttons rendering', moduleConfig, () => {
    QUnit.test('button markup item if item.value is specified', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup({
            items: [
                { text: '0', value: '0' }
            ],
            valueExpr: 'value'
        });

        const $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).eq(0);
        assert.equal($radioButton.text(), '0', 'text rendered correctly');
    });

    QUnit.test('button markup item if item.value is not specified', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup({
            items: [
                { text: '0' }
            ],
            valueExpr: 'value'
        });

        const $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).eq(0);
        assert.equal($radioButton.text(), '0', 'text rendered correctly');
    });

    QUnit.test('button markup item if item is primitive string', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup({
            items: [
                '0'
            ]
        });

        const $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).eq(0);
        assert.equal($radioButton.text(), '0', 'text rendered correctly');
    });

    QUnit.test('button markup item if item has html', function(assert) {
        const $radioGroup = $('#radioGroup').dxRadioGroup({
            items: [
                { html: '<input type=\'radio\' value=\'foo\'>' }
            ]
        });

        const $radioButton = $radioGroup.find(toSelector(RADIO_BUTTON_CLASS)).find('input');

        assert.equal($radioButton.prop('type'), 'radio', 'input type rendered correctly');
        assert.equal($radioButton.prop('value'), 'foo', 'input value rendered correctly');
    });
});

QUnit.module('hidden input', () => {
    QUnit.test('a hidden input should be rendered', function(assert) {
        const $element = $('#radioGroup').dxRadioGroup(),
            $input = $element.find('input');

        assert.equal($input.length, 1, 'input is rendered');
        assert.equal($input.attr('type'), 'hidden', 'the input type is \'hidden\'');
    });

    QUnit.test('the hidden input should have correct value on widget init', function(assert) {
        const $element = $('#radioGroup').dxRadioGroup({
                items: [1, 2, 3],
                value: 2
            }),
            $input = $element.find('input');

        assert.equal($input.val(), '2', 'input value is correct');
    });

    QUnit.test('the hidden input should get display text as value if widget value is an object', function(assert) {
        const items = [{ id: 1, text: 'one' }],
            $element = $('#radioGroup').dxRadioGroup({
                items: items,
                value: items[0],
                displayExpr: 'text'
            }),
            $input = $element.find('input');

        assert.equal($input.val(), items[0].text, 'input value is correct');
    });

    QUnit.test('the hidden input should get value in respect of the \'valueExpr\' option', function(assert) {
        const items = [{ id: 1, text: 'one' }],
            $element = $('#radioGroup').dxRadioGroup({
                items: items,
                value: items[0].id,
                valueExpr: 'id',
                displayExpr: 'text'
            }),
            $input = $element.find('input');

        assert.equal($input.val(), items[0].id, 'input value is correct');
    });
});

QUnit.module('the \'name\' option', () => {
    QUnit.test('widget hidden input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name',
            $element = $('#radioGroup').dxRadioGroup({
                name: expectedName
            }),
            $input = $element.find('input');

        assert.equal($input.attr('name'), expectedName, 'the hidden input \'name\' attribute has correct value');
    });
});

QUnit.module('value', moduleConfig, () => {
    QUnit.test('item checked on start', function(assert) {
        const done = assert.async();

        executeAsyncMock.teardown();

        const items = [{ text: '0' }, { text: '1' }];
        const $radioGroup = $('#radioGroup').dxRadioGroup({
            dataSource: items,
            value: items[1]
        });

        const radioGroup = $radioGroup.dxRadioGroup('instance');

        setTimeout(function() {
            assert.equal($(radioGroup.itemElements()).filter(toSelector(RADIO_BUTTON_CHECKED_CLASS)).length, 1, 'one item checked');
            done();
        });
    });
});

QUnit.module('valueExpr', moduleConfig, () => {
    QUnit.test('value should be correct if valueExpr is a string', function(assert) {
        const items = [
            { number: 0, caption: 'zero' },
            { number: 1, caption: 'one' }
        ];

        const radioGroup = $('#radioGroup')
            .dxRadioGroup({
                dataSource: items,
                valueExpr: 'number',
                itemRender: function(item) {
                    return item.caption;
                },
                value: 0
            })
            .dxRadioGroup('instance');

        const $firstItem = $(radioGroup.itemElements()).eq(0);

        assert.ok($firstItem.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'item with zero value rendered correctly');
    });
});

QUnit.module('widget sizing render', moduleConfig, () => {
    QUnit.test('default', function(assert) {
        const $element = $('#widget').dxRadioGroup({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' },
                { text: '3' }
            ]
        });

        assert.ok($element[0].offsetWidth > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxRadioGroup({
                items: [
                    { text: '0' },
                    { text: '1' },
                    { text: '2' },
                    { text: '3' }
                ],
                width: 400
            }),
            instance = $element.dxRadioGroup('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element[0].style.width, '400px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxRadioGroup({
                items: [
                    { text: '0' },
                    { text: '1' },
                    { text: '2' },
                    { text: '3' }
                ]
            }),
            instance = $element.dxRadioGroup('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element[0].style.width, '300px', 'outer width of the element must be equal to custom width');
    });
});

var helper;
QUnit.module('Aria accessibility', {
    beforeEach: function() {
        helper = new ariaAccessibilityTestHelper({
            createWidget: ($element, options) => new RadioGroup($element,
                $.extend({
                    focusStateEnabled: true
                }, options))
        });
    },
    afterEach: function() {
        helper.$widget.remove();
    }
}, () => {
    QUnit.test('Items: []', function() {
        helper.createWidget({ });

        helper.checkAttributes(helper.$widget, { role: 'radiogroup', tabindex: '0' }, 'widget');
    });

    QUnit.test('Items: [1, 2, 3], Item.selected: true', function() {
        helper.createWidget({ items: [1, 2, 3], value: 1 });

        helper.checkAttributes(helper.$widget, { role: 'radiogroup', tabindex: '0' }, 'widget');
        helper.checkItemsAttributes([0], { attributes: ['aria-selected', 'aria-checked'], role: 'radio' });
    });

    QUnit.test('Items: [1, 2, 3], Item.selected: true, set focusedElement -> clean focusedElement', function() {
        helper.createWidget({ items: [1, 2, 3], value: 1 });

        helper.widget.option('focusedElement', helper.getItems().eq(0));
        helper.checkAttributes(helper.$widget, { role: 'radiogroup', tabindex: '0' }, 'widget');
        helper.checkItemsAttributes([0], { attributes: ['aria-selected', 'aria-checked'], role: 'radio' });

        helper.widget.option('focusedElement', null);
        helper.checkAttributes(helper.$widget, { role: 'radiogroup', tabindex: '0' }, 'widget');
        helper.checkItemsAttributes([0], { attributes: ['aria-selected', 'aria-checked'], role: 'radio' });
    });
});
