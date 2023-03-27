import $ from 'jquery';
import ko from 'knockout';

import 'ui/draggable';
import 'integration/knockout';

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
