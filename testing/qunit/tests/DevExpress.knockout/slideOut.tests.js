const $ = require('jquery');
const ko = require('knockout');

require('ui/slide_out');
require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="sharedTemplatesCase">\
            <div data-bind="dxSlideOut: { items: [1, 2, 3], menuItemTemplate: \'tmpl\' }">\
                <div data-options="dxTemplate: { name: \'tmpl\' }"><div class="myItemContent" data-bind="text: $data">abc</div></div>\
            </div>\
        </div>\
        <div id="internalTemplatesCase">\
            <script type="text/html" id="internalTemplatesCase_template">\
                <div data-options="dxTemplate: { name: \'tmpl\' }"><div class="myItemContent" data-bind="text: $data">abc</div></div>\
            </script>\
            <div data-bind="dxSlideOut: { items: [1, 2, 3], menuItemTemplate: $(\'#internalTemplatesCase_template\') }"> </div>\
        </div>\
        <div id="T131530" data-bind="dxSlideOut: { items: [{ menuTemplate: \'item0\' }, { menuTemplate: \'item1\' }], height: 100 }">\
            <div data-options="dxTemplate: { name: \'item0\' }">\
                Template 1\
            </div>\
            <div data-options="dxTemplate: { name: \'item1\' }">\
                Template 2\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('regression', {
    beforeEach: function() {
        this.$element = $('#slideOut');
    }
});

QUnit.test('shared external templates should works as shared internal templates for nested containers', function(assert) {
    ko.applyBindings({}, $('#sharedTemplatesCase')[0]);
    ko.applyBindings({}, $('#internalTemplatesCase')[0]);

    const listItems1 = $('#sharedTemplatesCase .dx-list-item');
    const listItems2 = $('#internalTemplatesCase .dx-list-item');

    listItems1.each(function(i) {
        assert.equal($.trim(listItems2.eq(i).text()), $.trim($(this).text()));
    });
});

QUnit.test('slideout should delegate templates to child widgets (T131530)', function(assert) {
    const $slideOut = $('#T131530');
    ko.applyBindings({}, $slideOut.get(0));

    const $list = $slideOut.find('.dx-list');

    assert.equal($.trim($list.find('.dx-list-item').eq(0).text()), 'Template 1');
    assert.equal($.trim($list.find('.dx-list-item').eq(1).text()), 'Template 2');
});
