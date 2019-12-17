var $ = require('jquery');

require('common.css!');
require('ui/scroll_view');

var SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content',
    SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar',
    SCROLLVIEW_TOP_POCKET_CLASS = 'dx-scrollview-top-pocket',
    SCROLLVIEW_BOTTOM_POCKET_CLASS = 'dx-scrollview-bottom-pocket',
    SCROLLVIEW_LOADPANEL_CLASS = 'dx-scrollview-loadpanel';

QUnit.testStart(function() {
    var markup = '\
        <div id="scrollView" style="height: 50px; width: 50px;">\
            <div class="content1">ScrollView content</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('ScrollView server markup');

QUnit.test('pockets should not be rendered in scrollView on server', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView(),
        $scrollableContent = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollableContent.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $bottomPocket = $scrollableContent.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    assert.equal($topPocket.length, 0, 'scrollView has no top-pocket on server');
    assert.equal($bottomPocket.length, 0, 'scrollView has no bottom-pocket on server');
});

QUnit.test('scrollbar should not be rendered in scrollView on server', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView(),
        $scrollbar = $scrollView.find('.' + SCROLLABLE_SCROLLBAR_CLASS);

    assert.equal($scrollbar.length, 0, 'scrollView has no scrollbar on server');
});

QUnit.test('loadPanel should not be rendered in scrollView on server', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView(),
        $loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL_CLASS);

    assert.equal($loadPanel.length, 0, 'scrollView has no loadPanel on server');
});

QUnit.test('scrollView content should be rendered on server', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView(),
        $scrollableContent = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $content = $scrollableContent.children().eq(0);

    assert.equal($content.length, 1, 'scrollView has content on server');
    assert.equal($content.text(), 'ScrollView content', 'scrollView content has right text');
});

QUnit.test('root with custom size', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView(),
        instance = $scrollView.dxScrollView('instance');

    assert.strictEqual(instance.option('width'), undefined);
    assert.strictEqual(instance.option('height'), undefined);

    assert.strictEqual($scrollView[0].style.width, '50px', 'outer width of the element must be equal to custom width');
    assert.strictEqual($scrollView[0].style.height, '50px', 'outer height of the element must be equal to custom height');
});


