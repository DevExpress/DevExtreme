const $ = require('jquery');
const ko = require('knockout');

require('ui/sortable');
require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        `<div id="testItemTemplate">
            <div data-bind="dxSortable: { }">
                <div class="test"></div>
                <div class="test"></div>
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.test('render with content', function(assert) {
    const vm = {
    };

    ko.applyBindings(vm, $('#testItemTemplate').get(0));
    assert.equal($('.test').length, 2);
});
