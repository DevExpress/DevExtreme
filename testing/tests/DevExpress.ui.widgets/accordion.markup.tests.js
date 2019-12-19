import $ from 'jquery';
import Accordion from 'ui/accordion';

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="accordion"></div>\
        </div>\
        \
        <div id="html-template-accordion">\
            <div style="height: 20px" data-options="dxTemplate: { name: \'title\' }" data-bind="text: title"></div>\
        </div>\
        \
        <div id="templated-accordion">\
            <div data-options="dxTemplate: { name: \'title\' }" data-bind="text: title"></div>\
            <div data-options="dxTemplate: { name: \'item\' }" data-bind="text: text"></div>\
            <div data-options="dxTemplate: { name: \'newTemplate\' }">New text</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_WRAPPER_CLASS = 'dx-accordion-wrapper';
const ACCORDION_ITEM_CLASS = 'dx-accordion-item';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
const ACCORDION_ITEM_OPENED_CLASS = 'dx-accordion-item-opened';
const ACCORDION_ITEM_CLOSED_CLASS = 'dx-accordion-item-closed';

var moduleSetup = {
    beforeEach: function() {
        this.$element = $('#accordion');
        this.items = [
            { title: 'Title 1', text: 'Text 1' },
            { title: 'Title 2', text: 'Text 2' },
            { title: 'Title 3', text: 'Text 3' }
        ];
    }
};

QUnit.module('widget markup', moduleSetup);

QUnit.test('widget should have accordion class and wrapper', function(assert) {
    this.$element.dxAccordion();

    assert.ok(this.$element.hasClass(ACCORDION_CLASS), 'widget class was added');
    assert.equal(this.$element.find('.' + ACCORDION_WRAPPER_CLASS).length, 1, 'widget wrapper class was added');
});

QUnit.test('items should be rendered', function(assert) {
    this.$element.dxAccordion({
        items: this.items
    });

    var $container = this.$element.find('.' + ACCORDION_WRAPPER_CLASS),
        $items = $container.find('.' + ACCORDION_ITEM_CLASS);

    assert.equal($items.length, 3, 'items were added');
    assert.equal($items.eq(0).find('.' + ACCORDION_ITEM_TITLE_CLASS).length, 1, 'container has item title');
    assert.equal($items.eq(0).find('.' + ACCORDION_ITEM_BODY_CLASS).length, 1, 'container has item content');
});

QUnit.test('first should be opened as default state', function(assert) {
    this.$element.dxAccordion({
        items: this.items
    });

    var $items = this.$element.find('.' + ACCORDION_ITEM_CLASS);

    assert.ok($items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'first item is opened');
});

QUnit.test('item content is hidden when item is not opened', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 0
    }).dxAccordion('instance');

    var $items = this.$element.find('.' + ACCORDION_ITEM_CLASS),
        $openedItems = this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS);

    assert.ok($items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'first item is opened so it has \'item opened\' class');
    assert.equal($openedItems.length, 1, 'only opened item has \'item opened\' class');
});

QUnit.test('Item body should be rendered on item opening when the \'deferRendering\' option is true', function(assert) {
    var $element = this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 0,
        multiple: false,
        deferRendering: true
    });

    assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).length, 1, 'body is rendered only for one item which is opened on init');
});

QUnit.test('Body should be rendered for each item on init when the \'deferRendering\' option is false', function(assert) {
    var $element = this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 0,
        multiple: false,
        deferRendering: false
    });

    assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).length, this.items.length, 'body is rendered for each item');
});

QUnit.test('nested widget rendering', function(assert) {
    var that = this;

    this.$element.dxAccordion({
        items: this.items,
        itemTemplate: function() {
            return $('<div>').dxAccordion({ items: that.items });
        }
    });

    assert.equal(this.$element.dxAccordion('itemElements').length, 3, 'only first level items');
});


QUnit.module('widget options', moduleSetup);

QUnit.test('items option', function(assert) {
    this.$element.dxAccordion({
        items: this.items
    });

    var $item = this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(0);

    assert.equal($item.find('.' + ACCORDION_ITEM_TITLE_CLASS).text(), 'Title 1', 'item title is correct');
    assert.equal($item.find('.' + ACCORDION_ITEM_BODY_CLASS).text(), 'Text 1', 'item content is correct');
});

QUnit.test('out of range \'selectedIndex\' option', function(assert) {
    var instance = this.$element.dxAccordion({
        items: this.items,
        selectedIndex: -1
    }).dxAccordion('instance');

    assert.equal(instance.option('selectedIndex'), 0, '\'selectedIndex\' option set to first when trying to set index which is out of range (-1)');
    assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'first item is opened when index is out of range (-1)');

    this.$element.data('dxAccordion', null);
    instance = this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 5
    }).dxAccordion('instance');

    assert.equal(instance.option('selectedIndex'), 0, '\'selectedIndex\' option set to first when trying to set index which is out of range (5)');
    assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'first item is opened when index is out of range (5)');
});

QUnit.test('itemTitleTemplate', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        itemTitleTemplate: function(itemData) {
            return $('<div>')
                .addClass('item-title-render-first')
                .text('User title: ' + itemData.title);
        }
    });

    var $userElement = this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(0);

    assert.ok($userElement.children().hasClass('item-title-render-first'), 'title has specified element');
    assert.equal($userElement.text(), 'User title: ' + this.items[0].title, 'text in user element is correct');
});

QUnit.test('itemTemplate', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        itemTemplate: function(itemData, itemIndex, itemElement) {
            return $('<div>')
                .addClass('item-content-render-first')
                .text('User content: ' + itemData.text);
        }
    });

    var $userElement = this.$element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(0);

    assert.ok($userElement.children().hasClass('item-content-render-first'), 'content has specified element');
    assert.equal($userElement.text(), 'User content: ' + this.items[0].text, 'text in user element is correct');
});

QUnit.test('dataSource option with using array', function(assert) {
    this.$element.dxAccordion({
        dataSource: this.items
    });

    var $items = this.$element.find('.' + ACCORDION_ITEM_CLASS),
        $title = $items.eq(0).find('.' + ACCORDION_ITEM_TITLE_CLASS),
        $content = $items.eq(0).find('.' + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($items.length, this.items.length, 'all items is rendered');
    assert.equal($title.text(), this.items[0].title, 'title text is correct');
    assert.equal($content.text(), this.items[0].text, 'content text is correct');
});

QUnit.test('Closed class should be set after selection changed', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        collapsible: false
    });

    var $element = this.$element,
        $titles = $element.find('.' + ACCORDION_ITEM_CLASS);

    assert.equal($element.find('.' + ACCORDION_ITEM_CLOSED_CLASS).length, $titles.length - 1, 'one item content is visible');
});

QUnit.test('multiple option', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        selectedItems: [this.items[0], this.items[1]],
        multiple: true
    });

    assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 2, 'two item content is visible');
});

QUnit.test('disabled state option', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        disabled: true
    });

    assert.ok(this.$element.hasClass('dx-state-disabled'), 'widget has \'disabled\' class');
});

QUnit.test('visible state option', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        visible: false
    });

    assert.ok(this.$element.hasClass('dx-state-invisible'), 'widget is hidden');
});

QUnit.test('Value from plain data source is should be encoded', function(assert) {
    var $accordion = $('#accordion').dxAccordion({
            dataSource: ['<b>Test item</b>']
        }),
        $titleTemplate = $accordion.find('.' + ACCORDION_ITEM_TITLE_CLASS);

    assert.equal($titleTemplate.text(), '<b>Test item</b>');
});

QUnit.test('disabled state option of single item on init', function(assert) {
    this.$element.dxAccordion({
        items: [
            { title: 'Title 1', text: 'Text 1' },
            { title: 'Title 2', text: 'Text 2', disabled: true }
        ]
    }).dxAccordion('instance');

    assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass('dx-state-disabled'), 'item has disabled-state class');
});

QUnit.test('item selection', function(assert) {
    this.$element.dxAccordion({
        items: this.items,
        selectedIndex: 1
    }).dxAccordion('instance');

    var $item = this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1);

    assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
});


QUnit.module('aria accessibility');

QUnit.test('aria role', function(assert) {
    var $element = $('#accordion').dxAccordion();

    assert.equal($element.attr('role'), 'tablist', 'role is correct');
});

QUnit.test('aria-multiselectable property', function(assert) {
    var $element = $('#accordion').dxAccordion({
        multiple: false
    });

    assert.equal($element.attr('aria-multiselectable'), 'false', 'multiselectable on init');
});

QUnit.test('role for items', function(assert) {
    var $element = $('#accordion').dxAccordion({
            items: [{ title: 'Title 1', text: 'Text 1' }]
        }),
        $item = $element.find('.dx-accordion-item');

    assert.equal($item.attr('role'), 'tab', 'role for item is correct');
});

QUnit.test('body should be hidden if item is closed', function(assert) {
    var accordion = new Accordion($('#accordion'), {
            items: [{ title: 'Title 1', text: 'Text 1' }],
            collapsible: true,
            selectedIndex: -1,
            deferRendering: false
        }),
        $itemBody = accordion.itemElements().eq(0).find('.' + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($itemBody.attr('aria-hidden'), 'true', 'body not readable');
});

QUnit.module('default title template', {
    prepareItemTest: function(data) {
        var accordion = new Accordion($('<div>'), {
            items: [data]
        });

        return accordion.itemElements().eq(0).find('.' + ACCORDION_ITEM_TITLE_CLASS).contents();
    }
});

QUnit.test('template should be rendered correctly with title', function(assert) {
    var $content = this.prepareItemTest({
        title: 'test',
        icon: 'test'
    });

    assert.equal($content.text(), 'test');
    assert.equal($content.find('.dx-icon-test').length, 1);
});

QUnit.test('template should be rendered correctly with icon path', function(assert) {
    var $content = this.prepareItemTest({
        icon: 'test.png'
    });

    assert.equal($content.find('.dx-icon[src=\'test.png\']').length, 1);
});

QUnit.test('template should be rendered correctly with external icon', function(assert) {
    var $content = this.prepareItemTest({
        icon: 'fa fa-icon'
    });

    assert.equal($content.find('.fa.fa-icon').length, 1);
});

QUnit.test('template should be rendered correctly with title with html', function(assert) {
    var $content = this.prepareItemTest({
        title: 'test',
        html: '[test]'
    });

    assert.equal($content.text(), 'test');
});

[
    { title: 'text', expected: 'text' },
    { title: null, expected: '' },
    { title: undefined, expected: '' },
    { title: '', expected: '' },
    { title: 0, expected: '0' },
    { title: 1, expected: '1' },
    { title: new Date(2019, 10, 13), expected: String(new Date(2019, 10, 13)) },
    { title: { value: 'title' }, expected: '' }
].forEach((value) => {
    QUnit.test(`DefaultTemplate: title template property - ${value.title}`, (assert) => {
        const $element = $('<div>').appendTo('#qunit-fixture');

        const widget = new Accordion($element, { items: [ { title: value.title }] });

        const $itemElements = widget._itemElements();

        assert.strictEqual($itemElements.eq(0).find(`.${ACCORDION_ITEM_TITLE_CLASS}`).text(), value.expected, 'item.title');
    });

    QUnit.test(`DefaultTemplate: items["${value.title}"] as primitive`, (assert) => {
        const $element = $('<div>').appendTo('#qunit-fixture');

        const widget = new Accordion($element, { items: [ value.title ] });

        const $itemElements = widget._itemElements();

        assert.strictEqual($itemElements.eq(0).find(`.${ACCORDION_ITEM_TITLE_CLASS}`).text(), value.expected, 'item.title');
    });
});
