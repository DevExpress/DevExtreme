import $ from 'jquery';
import ko from 'knockout';

import scrollView from 'ui/scroll_view';
import 'integration/knockout';

QUnit.test = QUnit.urlParams['nocsp'] ? QUnit.test : QUnit.skip;

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

const isRenovatedScrollView = !!scrollView.IS_RENOVATED_WIDGET;
QUnit[isRenovatedScrollView ? 'test' : 'skip']('Scrollview content is not recreated on initializing', function(assert) {
    const contentInit = $('#text').get(0);
    const contentInitJq = $('#textJquery').get(0);

    const viewModel = {
        scrollViewOptions: {
            useNative: false,
            width: 100,
            height: 100
        }
    };

    ko.applyBindings({ scrollViewOptions: viewModel.scrollViewOptions }, $('#scrollview')[0]);

    $('#scrollviewJquery').dxScrollView({ ...viewModel.scrollViewOptions });

    assert.strictEqual(contentInit, $('#text').get(0));
    assert.strictEqual(contentInitJq, $('#textJquery').get(0));

});

QUnit.test('Scrollview content apply binding', function(assert) {
    ko.applyBindings({ content: 'ScrollViewContent' }, $('#scrollviewWithBinding')[0]);

    assert.strictEqual($('#content').get(0).innerText, 'ScrollViewContent');
});
