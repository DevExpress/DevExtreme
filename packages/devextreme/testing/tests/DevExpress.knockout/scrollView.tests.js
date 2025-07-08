import $ from 'jquery';
import ko from 'knockout';

import 'ui/scroll_view';
import 'integration/knockout';

if(QUnit.urlParams['nocsp']) {
    QUnit.module('scrollView');
} else {
    QUnit.module.skip('scrollView');
}

QUnit.testStart(function() {
    const markup =
        `<div id="scrollview" data-bind="dxScrollView: scrollViewOptions">
            <div id="text">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            </div>
        </div>
        <div id="scrollviewJquery">
            <div id="textJquery">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            </div>
        </div>

        <div id="scrollviewWithBinding" data-bind="dxScrollView: { }">
            <div id="content" data-bind="html: content"></div>
        </div>
`;

    $('#qunit-fixture').html(markup);
});

QUnit.test('Scrollview content apply binding', function(assert) {
    ko.applyBindings({ content: 'ScrollViewContent' }, $('#scrollviewWithBinding')[0]);

    assert.strictEqual($('#content').get(0).innerText, 'ScrollViewContent');
});
