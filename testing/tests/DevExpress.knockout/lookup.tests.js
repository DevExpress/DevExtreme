var $ = require('jquery'),
    fx = require('animation/fx'),
    executeAsyncMock = require('../../helpers/executeAsyncMock.js'),
    ko = require('knockout');

require('ui/lookup');
require('integration/knockout');

QUnit.testStart(function() {
    var markup =
        '<div id="T131530" data-bind="dxLookup: { items: [{ }, { }], itemTemplate: \'item\' }">\
            <div data-options="dxTemplate: { name: \'item\' }">Template</div>\
        </div>\
        \
        <div id="lookupWithItemTemplate" data-bind="dxLookup: { items: [{}] }">\
            <div data-options="dxTemplate: { name: \'item\' }">Template</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var LIST_CLASS = 'dx-list';

var toSelector = function(val) {
    return '.' + val;
};

var openPopupWithList = function(lookup) {
    $(lookup._$field).trigger('dxclick');
};

QUnit.module('list options', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test('lookup should delegate templates to child widgets (T131530)', function(assert) {
    var $lookup = $('#T131530');
    ko.applyBindings({}, $lookup.get(0));

    var lookup = $lookup.dxLookup('instance');

    openPopupWithList(lookup);

    var $list = $(toSelector(LIST_CLASS));

    assert.equal($.trim($list.find('.dx-list-item').text()), 'TemplateTemplate');
});

QUnit.test('lookup with item template', function(assert) {
    var $lookup = $('#lookupWithItemTemplate');
    ko.applyBindings({}, $lookup.get(0));

    var lookup = $lookup.dxLookup('instance');

    openPopupWithList(lookup);

    var $list = $(toSelector(LIST_CLASS));

    assert.equal($.trim($list.find('.dx-list-item').text()), 'Template');
});
