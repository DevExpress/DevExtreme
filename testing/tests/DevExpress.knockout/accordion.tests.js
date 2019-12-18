var $ = require('jquery'),
    ko = require('knockout');

require('ui/accordion');
require('integration/knockout');

QUnit.testStart(function() {
    var markup =
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

var ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title',
    ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';

QUnit.test('widget rendering when title template is used', function(assert) {
    var $element = $('#templated-accordion');

    ko.applyBindings({}, $element[0]);

    var $itemTitle = $element.find('.' + ACCORDION_ITEM_TITLE_CLASS);

    assert.equal($itemTitle.length, 1, 'item title exists');
    assert.equal($itemTitle.text(), 'Title 1', 'item title is correct');
});

QUnit.test('widget rendering when content template is used', function(assert) {
    var $element = $('#templated-accordion');

    ko.applyBindings({}, $element[0]);

    var $itemContent = $element.find('.' + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($itemContent.length, 1, 'item title exists');
    assert.equal($itemContent.text(), 'Text 1', 'item title is correct');
});

QUnit.test('item should be rendered correctly with dxitem syntax', function(assert) {
    var $element = $('#accordion-with-dxitem');

    ko.applyBindings({}, $element[0]);

    var $item = $element.dxAccordion('itemElements').eq(0),
        $title = $item.find('.' + ACCORDION_ITEM_TITLE_CLASS),
        $content = $item.find('.' + ACCORDION_ITEM_BODY_CLASS);

    assert.equal($.trim($title.text()), 'title', 'title rendered correctly');
    assert.equal($.trim($content.text()), 'custom', 'content rendered correctly');
});

QUnit.test('itemTitleTemplate option', function(assert) {
    var $element = $('#custom-template-accordion');

    ko.applyBindings({}, $element[0]);

    var $title = $element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(0);

    assert.equal($title.text(), 'User title template', 'Title text from template is correct');
});

QUnit.test('itemContentTemplate option', function(assert) {
    var $element = $('#custom-template-accordion');

    ko.applyBindings({}, $element[0]);

    var $content = $element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(0);

    assert.equal($content.text(), 'User content template', 'Content text from template is correct');
});
