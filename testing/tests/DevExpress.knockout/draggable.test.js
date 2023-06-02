const $ = require('jquery');
const ko = require('knockout');

require('ui/draggable');
require('integration/knockout');

if(QUnit.urlParams['nocsp']) {
    QUnit.module('draggable');
} else {
    QUnit.module.skip('draggable');
}

QUnit.testStart(function() {
    const markup =
        `<div id="testItemTemplate">
            <div data-bind="dxDraggable: { }">
                <div class="test"></div>
                <div class="test"></div>
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.test('render with content', function(assert) {
    ko.applyBindings({}, $('#testItemTemplate').get(0));
    assert.equal($('.test').length, 2);
});
