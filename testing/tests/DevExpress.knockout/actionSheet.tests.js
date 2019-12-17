var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    ko = require('knockout');

require('ui/action_sheet');
require('integration/knockout');

QUnit.testStart(function() {
    var markup =
        '<div id="testItemTemplate">\
            <div data-bind="dxActionSheet: { items: items }"></div>\
        </div>\
        \
        <div id="T171912">\
            <div data-bind="dxActionSheet: { items: items, visible: true }"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.test('change itemTemplate rerenders items (B253739)', function(assert) {
    var vm = {
        items: [{ text: 'test' }]
    };

    ko.applyBindings(vm, $('#testItemTemplate').get(0));

    var $actionSheet = $('#testItemTemplate .dx-actionsheet');
    $actionSheet.dxActionSheet('show');

    assert.equal($('.dx-actionsheet-container').text(), 'test', 'single item rendered');

    $actionSheet.dxActionSheet('option', 'itemTemplate', null);
    assert.equal($('.dx-actionsheet-container').text(), '', 'single item rendered');
});

QUnit.test('T171912: dxActionSheet - \'item.onClick\' option does not work', function(assert) {
    var handler = sinon.spy(noop),
        $container = $('#T171912');

    ko.applyBindings({
        items: [{ text: 'item 1', onClick: handler }]
    }, $container.get(0));

    $('.dx-actionsheet-item .dx-button').trigger('dxclick');
    assert.ok(handler.calledOnce);
});
