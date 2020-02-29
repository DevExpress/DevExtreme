const $ = require('jquery');
const ko = require('knockout');

require('ui/accordion');
require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="templated-accordion" data-bind="dxAccordion: {\
                items: [\
                    { title: \'Title 1\', text: \'Text 1\' }\
                ]\
            }">\
            <div data-options="dxTemplate: { name: \'title\' }" data-bind="text: title"></div>\
            <div data-options="dxTemplate: { name: \'item\' }" data-bind="text: text"></div>\
            <div data-options="dxTemplate: { name: \'newTemplate\' }">New text</div>\
        </div>\
        \
        <div id="custom-template-accordion" data-bind="dxAccordion: {\
            items: [\
                { title: \'Title 1\', text: \'Text 1\' }\
            ],\
            itemTitleTemplate: \'userTitleTemplate\',\
            itemTemplate: \'userContentTemplate\'\
        }">\
            <div data-options="dxTemplate: { name: \'userTitleTemplate\' }">User title template</div>\
            <div data-options="dxTemplate: { name: \'userContentTemplate\' }">User content template</div>\
        </div>\
        \
        <div id="accordion-with-dxitem" data-bind="dxAccordion: {}">\
            <div data-options="dxItem: { title: \'title\' }">custom</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';

QUnit.test('widget rendering when title template is used', function(assert) {
    const $element = $('#templated-accordion');

    ko.applyBindings({}, $element[0]);

    const $itemTitle = $element.find('.' + ACCORDION_ITEM_TITLE_CLASS);

    assert.equal($itemTitle.length, 1, 'item title exists');
    assert.equal($itemTitle.text(), 'Title 1', 'item title is correct');
});

QUnit.test('widget rendering when content template is used', function(assert) {
    const $element = $('#templated-accordion');

    ko.applyBindings({}, $element[0]);

    const $itemContent = $element.find('.' + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($itemContent.length, 1, 'item title exists');
    assert.equal($itemContent.text(), 'Text 1', 'item title is correct');
});

QUnit.test('item should be rendered correctly with dxitem syntax', function(assert) {
    const $element = $('#accordion-with-dxitem');

    ko.applyBindings({}, $element[0]);

    const $item = $element.dxAccordion('itemElements').eq(0);
    const $title = $item.find('.' + ACCORDION_ITEM_TITLE_CLASS);
    const $content = $item.find('.' + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($.trim($title.text()), 'title', 'title rendered correctly');
    assert.equal($.trim($content.text()), 'custom', 'content rendered correctly');
});

QUnit.test('itemTitleTemplate option', function(assert) {
    const $element = $('#custom-template-accordion');

    ko.applyBindings({}, $element[0]);

    const $title = $element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(0);

    assert.equal($title.text(), 'User title template', 'Title text from template is correct');
});

QUnit.test('itemContentTemplate option', function(assert) {
    const $element = $('#custom-template-accordion');

    ko.applyBindings({}, $element[0]);

    const $content = $element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(0);

    assert.equal($content.text(), 'User content template', 'Content text from template is correct');
});
