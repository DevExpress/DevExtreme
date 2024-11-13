const $ = require('jquery');
const TagBox = require('ui/tag_box');
const fx = require('common/core/animation/fx');
const ko = require('knockout');

require('integration/knockout');

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="tagBoxWithFieldTemplate" data-bind="dxTagBox: { dataSource: dataSource, fieldTemplate: \'field\', valueExpr: \'key\', value: value }">\
            <div data-options="dxTemplate: { name: \'field\' }">\
                <div data-bind="dxTextBox: {}"></div>\
                <div id="customField" data-bind="foreach: $data"><span data-bind="    text: $data.name"></span></div>\
            </div>\
        </div>\
        <div id="koTagBox" data-bind="dxTagBox: { items: [1, 2, 3, 4, 5], value: value }">\
        </div>\
        <div id="koTagBoxWithTagTemplate" data-bind="dxTagBox: { items: [1, 2, 3], value: [1] }">\
            <span data-options="dxTemplate: { name: \'tag\' }" data-bind="text: $parent.someValue"></span>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const TAGBOX_TAG_REMOVE_BUTTON_CLASS = 'dx-tag-remove-button';

const moduleSetup = {
    beforeEach: function() {
        TagBox.defaultOptions({ options: { deferRendering: false } });
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};


moduleWithoutCsp('basic', moduleSetup);

QUnit.test('fieldTemplate is bound to selected items', function(assert) {
    const viewModel = {
        dataSource: [
            { key: 1, name: 'one' },
            { key: 2, name: 'two' },
            { key: 3, name: 'three' }
        ],
        value: [1, 2]
    };

    const $selectBox = $('#tagBoxWithFieldTemplate');
    ko.applyBindings(viewModel, $selectBox.get(0));

    assert.equal($('#customField').text(), 'onetwo', 'fieldTemplate got item in viewModel');
});


moduleWithoutCsp('ko integration');

QUnit.test('values should be provided to ko.observableArray', function(assert) {
    assert.expect(1);

    const vm = {
        value: ko.observableArray([1, 2, 3])
    };

    vm.value.subscribe(function(value) {
        assert.deepEqual(value, [1, 2], 'observable array changed');
    });

    ko.applyBindings(vm, $('#koTagBox').get(0));

    const $close = $('#koTagBox').find('.' + TAGBOX_TAG_REMOVE_BUTTON_CLASS).last();
    $close.trigger('dxclick');
});

QUnit.test('$parent should be correct for tag', function(assert) {
    const vm = {
        someValue: 'parent'
    };

    const $markup = $('#koTagBoxWithTagTemplate');
    ko.applyBindings(vm, $markup.get(0));

    const $tag = $markup.find('.dx-tag');
    assert.equal($.trim($tag.text()), vm.someValue);
});
