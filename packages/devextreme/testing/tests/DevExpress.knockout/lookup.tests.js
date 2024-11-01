const $ = require('jquery');
const fx = require('common/core/animation/fx');
const executeAsyncMock = require('../../helpers/executeAsyncMock.js');
const ko = require('knockout');

require('ui/lookup');
require('integration/knockout');

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="T131530" data-bind="dxLookup: { items: [{ }, { }], itemTemplate: \'item\' }">\
            <div data-options="dxTemplate: { name: \'item\' }">Template</div>\
        </div>\
        \
        <div id="lookupWithItemTemplate" data-bind="dxLookup: { items: [{}] }">\
            <div data-options="dxTemplate: { name: \'item\' }">Template</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const LIST_CLASS = 'dx-list';

const toSelector = function(val) {
    return '.' + val;
};

const openPopupWithList = function(lookup) {
    $(lookup._$field).trigger('dxclick');
};

moduleWithoutCsp('list options', {
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
    const $lookup = $('#T131530');
    ko.applyBindings({}, $lookup.get(0));

    const lookup = $lookup.dxLookup('instance');

    openPopupWithList(lookup);

    const $list = $(toSelector(LIST_CLASS));

    assert.equal($.trim($list.find('.dx-list-item').text()), 'TemplateTemplate');
});

QUnit.test('lookup with item template', function(assert) {
    const $lookup = $('#lookupWithItemTemplate');
    ko.applyBindings({}, $lookup.get(0));

    const lookup = $lookup.dxLookup('instance');

    openPopupWithList(lookup);

    const $list = $(toSelector(LIST_CLASS));

    assert.equal($.trim($list.find('.dx-list-item').text()), 'Template');
});
