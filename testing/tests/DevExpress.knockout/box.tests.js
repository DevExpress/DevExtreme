const $ = require('jquery');
const ko = require('knockout');

require('ui/box');
require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="nestedBox" data-bind="dxBox: {}">\
            <div data-options="dxItem: {baseSize: 272, ratio: 0, box: {direction: \'col\'}}">\
                <div data-options="dxItem: {baseSize: \'auto\', ratio: 0}">\
                    <h2>Box1</h2>\
                </div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.test('innerBox with nested box item', function(assert) {
    const $box = $('#nestedBox');
    ko.applyBindings({}, $box[0]);

    assert.equal($.trim($box.text()), 'Box1', 'inner box rendered');
});

QUnit.test('box item visibility change should fire onItemStateChanged action', function(assert) {

    $('#qunit-fixture').append('<div id="box" data-bind="dxBox: {\
        items: [{ visible: isItemVisible }],\
        onItemStateChanged: itemStateChangedHandler\
    }"></div>');

    const $box = $('#box');
    const vm = {
        isItemVisible: ko.observable(true),
        itemStateChangedHandler: sinon.spy()
    };

    ko.applyBindings(vm, $box[0]);
    assert.equal(vm.itemStateChangedHandler.callCount, 0, 'handler should not be called on render');

    vm.isItemVisible(false);
    assert.equal(vm.itemStateChangedHandler.callCount, 1, 'handler should be called after item visibility changed');
});
