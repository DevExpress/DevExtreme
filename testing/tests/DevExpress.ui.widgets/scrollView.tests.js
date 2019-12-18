import $ from 'jquery';
import renderer from 'core/renderer';
import { noop } from 'core/utils/common';
import translator from 'animation/translator';
import animationFrame from 'animation/frame';
import devices from 'core/devices';
import messageLocalization from 'localization/message';
import Scrollbar from 'ui/scroll_view/ui.scrollbar';
import themes from 'ui/themes';
import pointerMock from '../../helpers/pointerMock.js';

import 'common.css!';
import 'ui/scroll_view';

const { module, test } = QUnit;

const SCROLLVIEW_CLASS = 'dx-scrollview';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
const SCROLLVIEW_CONTENT_CLASS = 'dx-scrollview-content';
const SCROLLVIEW_TOP_POCKET_CLASS = 'dx-scrollview-top-pocket';
const SCROLLVIEW_BOTTOM_POCKET_CLASS = 'dx-scrollview-bottom-pocket';
const SCROLLVIEW_LOADPANEL = 'dx-scrollview-loadpanel';
const SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper';

const SCROLLVIEW_PULLDOWN_CLASS = SCROLLVIEW_CLASS + '-pull-down';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = SCROLLVIEW_PULLDOWN_CLASS + '-image';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = SCROLLVIEW_PULLDOWN_CLASS + '-text';
const SCROLLVIEW_PULLDOWN_LOADING_CLASS = SCROLLVIEW_PULLDOWN_CLASS + '-loading';
const SCROLLVIEW_PULLDOWN_READY_CLASS = SCROLLVIEW_PULLDOWN_CLASS + '-ready';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = SCROLLVIEW_PULLDOWN_CLASS + '-indicator';

const SCROLLVIEW_REACHBOTTOM_CLASS = SCROLLVIEW_CLASS + '-scrollbottom';
const SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = SCROLLVIEW_REACHBOTTOM_CLASS + '-text';
const SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = SCROLLVIEW_REACHBOTTOM_CLASS + '-indicator';

const PULLDOWN_HEIGHT = 160;

const getScrollOffset = function($scrollView) {
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        location = translator.locate($content);

    return {
        top: (location.top - $container.scrollTop() || 0),
        left: (location.left || -$container.scrollLeft() || 0)
    };
};

devices.current('iPhone');

var moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this._originalRequestAnimationFrame = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            callback();
        };
    },
    afterEach: function() {
        this.clock.restore();
        animationFrame.requestAnimationFrame = this._originalRequestAnimationFrame;
    }
};


QUnit.testStart(function() {
    var markup = '\
        <div id="scrollView" style="height: 50px; width: 50px;">\
            <div class="content1" style="height: 100px; width: 100px;"></div>\
            <div class="content2" style="height: 100px; width: 100px;"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('render', moduleConfig);

QUnit.test('scrollView render', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false }),
        $scrollableContent = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollableContent.children().eq(0),
        $content = $scrollableContent.children().eq(1),
        $bottomPocket = $scrollableContent.children().eq(2);

    assert.ok($scrollView.hasClass(SCROLLVIEW_CLASS), 'dx-scrollview class attached');
    assert.ok($topPocket.hasClass(SCROLLVIEW_TOP_POCKET_CLASS), 'dx-scrollview-top-pocket class attached');
    assert.ok($content.hasClass(SCROLLVIEW_CONTENT_CLASS), 'dx-scrollview-content class attached');
    assert.ok($bottomPocket.hasClass(SCROLLVIEW_BOTTOM_POCKET_CLASS), 'dx-scrollview-bottom-pocket');

    assert.equal($content.children().length, 2, 'content was moved');
    assert.ok($content.children().eq(0).hasClass('content1'));
    assert.ok($content.children().eq(1).hasClass('content2'));
});

QUnit.test('scrollView pullDown markup', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false }),
        $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);

    assert.equal($pullDown.length, 1, 'pull down container');
    assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_IMAGE_CLASS).length, 1, 'pull down image');
    assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_INDICATOR_CLASS).length, 1, 'pull down load indicator container');
    assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).length, 1, 'pull down text');
});

QUnit.test('dxLoadIndicator was created', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false }),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS),
        $loadIndicatorTop = $topPocket.find('.dx-loadindicator'),
        $loadIndicatorBottom = $bottomPocket.find('.dx-loadindicator');

    var top = $loadIndicatorTop.dxLoadIndicator('instance'),
        bottom = $loadIndicatorBottom.dxLoadIndicator('instance');

    assert.notEqual(top, null, 'dxLoadIndicator was created');
    assert.notEqual(bottom, null, 'dxLoadIndicator was created');
});

QUnit.test('pulldown text', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
            onPullDown: noop,
            useNative: false
        }),
        pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS),
        scrollBottomText = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);

    assert.equal(pullDownText.children().eq(0).text(), messageLocalization.format('dxScrollView-pullingDownText'));
    assert.equal(pullDownText.children().eq(1).text(), messageLocalization.format('dxScrollView-pulledDownText'));
    assert.equal(pullDownText.children().eq(2).text(), messageLocalization.format('dxScrollView-refreshingText'));
    assert.equal(scrollBottomText.text(), 'Loading...');
});

QUnit.test('scrollView scrollbottom markup', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false }),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS),
        $scrollBottom = $bottomPocket.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);

    assert.equal($scrollBottom.length, 1, 'scroll bottom container');
    assert.equal($scrollBottom.find('.' + SCROLLVIEW_REACHBOTTOM_TEXT_CLASS).length, 1, 'scrollbottom text');
    assert.equal($scrollBottom.find('.' + SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS).length, 1, 'scrollbottom load indicator container');
});

QUnit.test('scrollView has correct height when container height is auto', function(assert) {
    var $scrollView = $('#scrollView');

    $scrollView.height('auto');
    $scrollView.dxScrollView({ useNative: false, pushBackValue: 0 });

    var $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

    assert.equal($scrollView.height(), $content.height(), 'scrollView has correctly height');
});

QUnit.test('pulling down text change', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false });

    $scrollView.dxScrollView('option', 'pullingDownText', 'test');

    var $pullingDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).children().eq(0);
    assert.equal($pullingDownText.text(), 'test');
});

QUnit.test('pulled down text change', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false });
    $scrollView.dxScrollView('option', 'pulledDownText', 'test');

    var $pullingDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).children().eq(1);
    assert.equal($pullingDownText.text(), 'test');
});

QUnit.test('refreshing text change', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false });
    $scrollView.dxScrollView('option', 'refreshingText', 'test');

    var $pullingDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).children().eq(2);
    assert.equal($pullingDownText.text(), 'test');
});

QUnit.test('reachbottom text change', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false });
    $scrollView.dxScrollView('option', 'reachBottomText', 'test');

    var $scrollBottomText = $('.' + SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);
    assert.equal($scrollBottomText.text(), 'test');
});

QUnit.module('dimension', moduleConfig);

QUnit.test('top position calculation', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onPullDown: noop
        }),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    var location = getScrollOffset($scrollView);
    assert.equal(location.top, -$topPocket.height(), 'top position calculated considering top pocket height');
});

QUnit.test('bottom position calculation', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onEnd: function() {
            var location = getScrollOffset($scrollView),
                height = $container.height() - $content.height() + $bottomPocket.height();
            assert.equal(location.top, height, 'bottom position calculated considering top pocket height');
        }
    });

    var $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $container.height() - $content.height() + $topPocket.height() + $bottomPocket.height() - 10)
        .up();
});


QUnit.module('actions', moduleConfig);

QUnit.test('onPullDown action', function(assert) {
    var firstScroll = true,
        offset = 10,
        $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function(e) {
                assert.ok(true, 'pulldown action was fired');
            },
            onScroll: function() {
                if(firstScroll) {
                    var location = getScrollOffset($scrollView);
                    assert.equal(location.top, offset);
                }
                firstScroll = false;
            },
            onEnd: function() {
                assert.ok(false, 'end action should not be fired');
            }
        });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + offset)
        .up();
});

QUnit.test('no onPullDown hides pullDown', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({});
    assert.ok($scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS).is(':hidden'), 'pull down element is hidden');
});

QUnit.test('changing of onPullDown option changes pullDown visibility', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({});
    $scrollView.dxScrollView('option', 'onPullDown', noop);
    assert.ok($scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS).is(':visible'), 'pull down element is visible');
});

QUnit.test('pullDown behavior turns off when pullDown is undefined', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onEnd: function() {
            assert.ok(true, 'end action should be fired');
        }
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 10)
        .up();
});

QUnit.test('top position calculation on pull down', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onPullDown: noop
        }),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        offset = 2;

    pointerMock($content)
        .start()
        .down()
        .move(0, offset);

    var location = translator.locate($content),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    assert.equal(location.top, 0, 'translate top position is right');
    assert.equal($container.scrollTop(), $topPocket.height() - offset, 'scroll top position is right');

});

QUnit.test('onReachBottom action', function(assert) {
    var $scrollView = $($('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onReachBottom: function(e) {
            assert.ok(true, 'onReachBottom action was fired');
        },
        onEnd: function() {
            assert.ok(false, 'end action should not be fired');
        }
    }));
    var $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $container.height() - $content.height() - $bottomPocket.height() - 1)
        .up();
});

QUnit.test('onReachBottom action should not be fired in rtl mode', function(assert) {
    assert.expect(0);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        direction: 'vertical',
        rtlEnabled: false,
        onReachBottom: function(e) {
            assert.ok(false, 'onReachBottom action won\'t fired');
        }
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
    $content.width(200);
    $content.height(0);

    $scrollView.dxScrollView('instance').option('rtlEnabled', true);
});

QUnit.test('changing of onReachBottom option changes reach bottom element visibility', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false });
    $scrollView.dxScrollView('option', 'onReachBottom', noop);
    assert.ok($scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS).is(':visible'), 'reach bottom element is visible');
});

QUnit.test('onReachBottom action fired once', function(assert) {
    assert.expect(1);

    var reachBottomFired = 0;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onReachBottom: function(e) {
            reachBottomFired++;
            assert.equal(reachBottomFired, 1, 'onReachBottom fired once');
        }
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, -$content.height())
        .move(0, -1)
        .up();
});

QUnit.test('changing action option does not cause render', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, -10);

    var testAction = function(actionName) {
        $scrollView.dxScrollView('option', actionName, noop);
        var location = getScrollOffset($scrollView);
        assert.equal(location.top, -$topPocket.height() - 10, actionName + ' case scrollable rerendered');
    };

    testAction('onPullDown');
    testAction('onReachBottom');
});

QUnit.test('onReachBottom action is not fired when scrollable content bottom is not reached', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onReachBottom: function(e) {
            assert.ok(false, 'onReachBottom action should not be fired');
        },
        onEnd: function() {
            assert.ok(true, 'end action was fired');
        }
    });
    var $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $container.height() - ($content.height() - $bottomPocket.outerHeight() + 1))
        .up();
});

QUnit.test('disabled scrollview should not be updated on pointerdown after finish loading', function(assert) {
    var count = 0;
    var $scrollView = $('#scrollView').dxScrollView({
        pushBackValue: 1,
        onUpdated: function() {
            count++;
        },
        useNative: true,
        disabled: true
    });

    $scrollView.dxScrollView('finishLoading');
    pointerMock($scrollView.find('.content1')).start().down();

    assert.equal(count, 1, 'update action won\'t fired');
});


QUnit.module('dynamic', moduleConfig);

QUnit.test('pulling down', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            var location = getScrollOffset($scrollView);
            assert.equal(location.top, 0, 'pulled down');
        }
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .up();
});

QUnit.test('pulling down without release', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        onPullDown: noop,
        inertiaEnabled: false,
        onEnd: function() {
            var location = getScrollOffset($scrollView);
            assert.equal(location.top, -$topPocket.height(), 'content bounced to the top');
        }
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .move(0, -10)
        .up();
});

QUnit.test('onPullDown enabled doesn\'t change the position of content', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, -10)
        .up();

    $scrollView.dxScrollView('option', 'onPullDown', noop);

    var location = getScrollOffset($scrollView);

    assert.equal(location.top, -10 - $topPocket.height(), 'content position was not changed');
});

QUnit.test('onPullDown disabled does not change the position of content', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: noop
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, -10)
        .up();

    $scrollView.dxScrollView('option', 'onPullDown', undefined);

    var location = getScrollOffset($scrollView);

    assert.equal(location.top, -10, 'content position was not changed');
});

QUnit.test('scroll content stays in bounds when onPullDown turned off', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: noop,
        onReachBottom: noop
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $container.height() - $content.height())
        .up();

    $scrollView.dxScrollView('option', 'onPullDown', null);

    var location = getScrollOffset($scrollView);

    assert.equal(location.top, $container.height() - $content.height(), 'content position was not changed');
});

QUnit.test('pulled down adds ready state', function(assert) {
    assert.expect(4);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: noop
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS),
        mouse = pointerMock($content).start();

    mouse.down().move(0, $topPocket.height() + 1);
    assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), true, 'scrollview-pull-down-ready class added');
    assert.equal($pullDownText.children().eq(1).css('opacity'), 1);

    mouse.move(0, -10);
    assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), false, 'scrollview-pull-down-ready class removed');
    assert.equal($pullDownText.children().eq(0).css('opacity'), 1);
});

QUnit.test('pulled down adds loading state', function(assert) {
    assert.expect(3);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), true, 'scrollview-pull-down-loading class added');
            assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), false, 'scrollview-pull-down-ready class removed');
            assert.equal($pullDownText.children().eq(2).css('opacity'), 1);
        }
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .up();
});

QUnit.test('release cause release state', function(assert) {
    assert.expect(3);

    var clock = this.clock;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            $scrollView.dxScrollView('release');
            clock.tick();
        },
        onEnd: function() {
            assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), false, 'scrollview-pull-down-loading class removed');
            assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), false, 'scrollview-pull-down-ready class removed');
            assert.equal($pullDownText.children().eq(0).css('opacity'), 1);
        }
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .up();
});

var SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS = 'dx-scrollview-pull-down-text-visible';

QUnit.test('pulled down adds ready state for Material theme', function(assert) {
    assert.expect(6);
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: noop
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS),
        mouse = pointerMock($content).start();

    mouse.down().move(0, $topPocket.height() + 1);

    assert.ok(!$pullDownText.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
    assert.ok($pullDownText.children().eq(1).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
    assert.ok(!$pullDownText.children().eq(2).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));

    mouse.move(0, -10);
    assert.ok($pullDownText.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
    assert.ok(!$pullDownText.children().eq(1).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
    assert.ok(!$pullDownText.children().eq(2).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));

    themes.isMaterial = origIsMaterial;
});

QUnit.test('pulled down adds loading state for Material theme', function(assert) {
    assert.expect(3);
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            assert.ok(!$pullDownText.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
            assert.ok(!$pullDownText.children().eq(1).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
            assert.ok($pullDownText.children().eq(2).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
        }
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .up();

    themes.isMaterial = origIsMaterial;
});

QUnit.test('scrollview locked while pulldown loading', function(assert) {
    assert.expect(0);

    var loading = false;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function() {
            if(loading) {
                assert.ok(false, 'scrolling disabled');
            }
        },
        onPullDown: function() {

            setTimeout(function() {
                loading = true;
                mouse
                    .down()
                    .move(0, -$topPocket.height() - 1)
                    .up();
            });
        }
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, $topPocket.height() + 1)
        .up();
});

QUnit.test('scrollview onReachBottom action fired when bottom position is reached', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onReachBottom: function() {
            var location = getScrollOffset($scrollView);
            assert.roughEqual(location.top, $container.height() - $content.height(), 1);
        }
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, -$content.height() - 10)
        .up();
});

QUnit.test('scrollview should go to released state if release method was called during the loading', function(assert) {
    assert.expect(1);
    var done = assert.async(),
        count = 0;

    var $scrollView = $('#scrollView').dxScrollView({
            height: 50,
            useNative: true,
            inertiaEnabled: false,
            refreshStrategy: 'pullDown',
            onReachBottom: function() {
                count++;
                scrollView.release(false);
                scrollView.scrollTo({ x: 0, y: 250 });

                if(count > 1) {
                    assert.ok(true);
                    done();
                }
            }
        }),
        scrollView = $scrollView.dxScrollView('instance');

    scrollView.toggleLoading(true);
    scrollView.scrollTo({ x: 0, y: 220 });
});

QUnit.test('onReachBottom should not be called when scroll delta is 0', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        $scrollView = $('#scrollView').dxScrollView({
            height: 50,
            useNative: true,
            inertiaEnabled: false,
            refreshStrategy: 'pullDown',
            onReachBottom: function() {
                scrollView.release(false);

                assert.ok(true, 'reachBottom was not called on the second scroll');
                done();
            }
        }),
        scrollView = $scrollView.dxScrollView('instance');

    scrollView.scrollTo({ x: 0, y: 150 });
    $(scrollView.content()).trigger('scroll');
});

QUnit.test('scrollview locked while loading', function(assert) {
    assert.expect(0);

    var loading = false;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function() {
            if(loading) {
                assert.ok(false, 'scrolling disabled');
            }
        },
        onReachBottom: function() {
            setTimeout(function() {
                loading = true;
                mouse
                    .down()
                    .move(0, $bottomPocket.height() + 1)
                    .up();
            });
        }
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS),
        mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, -$content.height() - 10)
        .up();
});

QUnit.test('release after loading cause bounce to the bottom bound', function(assert) {
    assert.expect(1);

    var clock = this.clock;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onReachBottom: function() {
            this.release();
            clock.tick();
        },
        onEnd: function() {
            var location = getScrollOffset($scrollView);
            assert.roughEqual(location.top, $container.height() - $content.height(), 1, 'scrollview bounced');
        }
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, -$content.height() - 10)
        .up();
});

QUnit.test('pull down element is not hidden when container larger than content', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({ useNative: false });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    $container.height(400);
    $content.find('.' + SCROLLVIEW_CONTENT_CLASS).children().height(50);
    $scrollView.dxScrollView('update');

    var location = getScrollOffset($scrollView);

    assert.equal(location.top, -$topPocket.height());
});

QUnit.test('pull down doesn\'t show loading panel', function(assert) {
    assert.expect(1);

    var isLoadPanelVisible;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            isLoadPanelVisible = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).eq(0).dxLoadPanel('option', 'visible');
        }
    });
    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .up();

    assert.equal(isLoadPanelVisible, false, 'load panel is invisible during pull down');
});

QUnit.test('scrollview content should not blink in bounce on iOS', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown'
    });
    var instance = $scrollView.dxScrollView('instance');
    var $wrapper = $scrollView.find('.' + SCROLLABLE_WRAPPER_CLASS);
    var onStart = false;
    var onEnd = false;

    $wrapper
        .on('dxscrollstart', function() {
            onStart = instance._strategy._disablePushBack;
        })
        .on('dxscrollend', function() {
            onEnd = instance._strategy._disablePushBack;
        });

    pointerMock($('.content1'))
        .start()
        .down()
        .move(0, 10)
        .up();

    assert.ok(onStart, 'constant _disablePushBack is true on scroll start');
    assert.ok(!onEnd, 'constant _disablePushBack is false on scroll end');
});


QUnit.module('scrollbars', moduleConfig);

QUnit.test('scrollView locates scrollbar in correctly position after creation', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false
    });

    var location = getScrollOffset($scrollView);
    assert.equal(location.top, 0, 'scrollbar at the top position');
});

QUnit.test('scrollbar height calculated correctly', function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        scrollHeight = (containerHeight / contentHeight) * containerHeight;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS),
        $scroll = $scrollView.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.empty().height(contentHeight);

    $scrollView.dxScrollView('instance').update();

    assert.equal($scroll.height(), scrollHeight, 'scrollbar height calculated correctly');
});

QUnit.test('moving scrollView moves scrollbar in correct position', function(assert) {
    var containerHeight = 50,
        contentHeight = 100,
        location,
        distance = -10,
        scrollbarDistance = -distance * (containerHeight / contentHeight);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onEnd: function() {
            location = translator.locate($scroll);
            assert.equal(location.top, 2 * scrollbarDistance, 'scrollbar follows pointer everytime');
        }
    });

    var $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $scroll = $scrollView.find('.' + SCROLLABLE_SCROLL_CLASS);

    $container.height(containerHeight);
    $content.empty().height(contentHeight);
    $scrollView.dxScrollView('instance').update();

    pointerMock($scrollView.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, distance)
        .move(0, distance)
        .up();
});

QUnit.test('scroll over scrollbar does not hide thumb', function(assert) {
    var $scrollView = $('#scrollView').height(50);
    $scrollView.append('<div>').children().height(100);
    $scrollView.dxScrollView({
        useNative: false,
        showScrollbar: 'onHover',
        bounceEnabled: false
    });

    var $scrollbar = $scrollView.find('.' + SCROLLABLE_SCROLLBAR_CLASS);
    pointerMock($scrollbar).start().wheel(-10);

    assert.equal(Scrollbar.getInstance($scrollbar).option('visible'), true, 'thumb stays visible when showScrollbar is \'onHover\'');
});

QUnit.test('scrolling by thumb should trigger bottom loading even without moving', function(assert) {
    var containerSize = 50,
        contentHeight = 100;

    var $scrollView = $('#scrollView').dxScrollView({
        scrollByThumb: true,
        inertiaEnabled: false,
        useNative: false,
        onReachBottom: function() {
            assert.ok(true, 'action fired');
        }
    });

    var $scrollbar = $scrollView.find('.' + SCROLLABLE_SCROLLBAR_CLASS),
        mouse = pointerMock($scrollbar).start(),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

    $container.height(containerSize).width(containerSize);
    $content.empty().height(contentHeight);
    $scrollView.dxScrollView('update');

    var containerPosition = $container.offset();
    mouse.down(containerPosition.top + containerSize, containerPosition.left + containerSize).up();
});


QUnit.module('api', moduleConfig);

QUnit.test('content', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({});
    assert.ok($($scrollView.dxScrollView('instance').content()).hasClass(SCROLLVIEW_CONTENT_CLASS), 'returns scrollView content');
});

QUnit.test('release', function(assert) {
    assert.expect(1);

    var clock = this.clock;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            this.release();
            clock.tick();
        },
        onEnd: function() {
            var location = getScrollOffset($scrollView);
            assert.equal(location.top, -$topPocket.height(), 'scrollview bounced');
        }
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .up();
});

QUnit.test('release does not enable reach bottom functionality', function(assert) {
    assert.expect(2);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false
    });

    var $reachBottom = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);

    assert.ok($reachBottom.is(':hidden'), 'reach bottom is hidden');

    $scrollView.dxScrollView('release').done(function() {
        assert.ok($reachBottom.is(':hidden'), 'reach bottom is hidden');
    });

    this.clock.tick();
});

QUnit.test('release with preventReachBottom', function(assert) {
    assert.expect(1);

    var clock = this.clock;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            this.release(true);
            clock.tick();
        },
        onEnd: function() {
            var $bottomPocketLoading = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);
            assert.ok($bottomPocketLoading.is(':hidden'), 'bottom pocket loading is hidden');
        }
    });

    var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $topPocket.height() + 1)
        .up();
});

QUnit.test('release without pulldown', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false
    });

    $scrollView.dxScrollView('release')
        .done(function() {
            assert.ok(true, 'release without loading fails');
        });

    this.clock.tick();
});

QUnit.test('release fires update', function(assert) {
    var updated = 0;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        onUpdated: function() {
            updated++;
        }
    });
    assert.equal(updated, 1, 'update fired once after creation');

    $scrollView.dxScrollView('release');

    this.clock.tick();

    assert.equal(updated, 2, 'update fired');
});

QUnit.test('release calls update', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onPullDown: function() {
            $('.content2').height(400);
            setTimeout($.proxy(this.release, this));
        },
        onEnd: function() {
            mouse
                .start()
                .down()
                .move(0, -1000)
                .up();
        },
        onReachBottom: function() {
            var location = getScrollOffset($scrollView);
            assert.roughEqual(location.top, $container.height() - $content.height(), 1);
        }
    });

    var $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    var mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, $topPocket.height() + 1)
        .up();

    this.clock.tick();
});

QUnit.test('release calls update for scrollbar', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        onPullDown: noop,
        inertiaEnabled: false,
        onEnd: function() {
            assert.equal($scroll.height(), Math.pow($container.height(), 2) / $content.height());
        },
        onReachBottom: function() {
            $container.height(100);
            $('.content2').height(400);
            setTimeout($.proxy(this.release, this));
        }
    });

    var $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $scroll = $scrollView.find('.' + SCROLLABLE_SCROLL_CLASS);

    pointerMock($content)
        .start()
        .down()
        .move(0, $container.height() - $content.height() - $topPocket.height() - 10)
        .up();

    this.clock.tick();
});

QUnit.test('release calls moveToBound location immediately when state is released', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        onPullDown: noop,
        inertiaEnabled: true
    });

    var $children = $('.' + SCROLLVIEW_CONTENT_CLASS, $scrollView).children();
    var $scrollableContent = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollView);
    var pullDownSize = $('.' + SCROLLVIEW_TOP_POCKET_CLASS, $scrollView).height();
    var scrollView = $scrollView.dxScrollView('instance');

    scrollView.scrollTo(scrollView.scrollHeight());
    $children.remove();
    pointerMock($scrollableContent).start().down(); // NOTE: call update without moveToBound location
    scrollView.release();

    var locate = getScrollOffset($scrollView);
    assert.equal(locate.top, -pullDownSize, 'moveToBound was called immediately after release');
});

QUnit.test('toggleLoading', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onReachBottom: noop
        }),
        $bottomPocketLoading = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS),
        scrollView = $scrollView.dxScrollView('instance');

    assert.ok($bottomPocketLoading.is(':visible'), 'loading is visible at the beginning');

    scrollView.toggleLoading(false);
    assert.ok($bottomPocketLoading.is(':hidden'), 'loading is hidden');

    scrollView.toggleLoading(true);
    assert.ok($bottomPocketLoading.is(':visible'), 'loading is visible');
});

QUnit.test('toggleLoading turns off reachBottom behavior', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        inertiaEnabled: false,
        onReachBottom: function(e) {
            assert.ok(false, 'onReachBottom action should not be fired');
        },
        onEnd: function() {
            assert.ok(true, 'end action should be fired');
            var location = getScrollOffset($scrollView);
            assert.equal(location.top, $container.height() - $content.height() + $bottomPocket.height());
        }
    });

    var $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    var mouse = pointerMock($content)
        .start()
        .down()
        .move(0, $container.height() - $content.height() - $bottomPocket.height() - 1);

    $scrollView.dxScrollView('toggleLoading', false);

    mouse.up();
});

QUnit.test('isFull', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({}),
        $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

    $container.height(50);
    $content.children().height(100);
    $scrollView.dxScrollView('update');
    assert.equal($scrollView.dxScrollView('isFull'), true, 'container is full');
});

QUnit.test('isFull should be false if container has same height as content', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({}),
        $container = $scrollView.find('.dx-scrollable-container'),
        $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

    $container.height(50);
    $content.children().height(25);
    $scrollView.dxScrollView('update');
    assert.equal($scrollView.dxScrollView('isFull'), false, 'container is full');
});

QUnit.test('refresh', function(assert) {
    assert.expect(2);

    var pullDownFired = 0;
    var deferred = $.Deferred();

    var scrollView = $('#scrollView').dxScrollView({
        onPullDown: function(e) {
            pullDownFired++;

            e.component.release().done(function() {
                deferred.resolve();
            });
        }
    }).dxScrollView('instance');

    scrollView.refresh();

    deferred.done(function() {
        assert.ok(true, 'scroll view released');
    });

    assert.equal(pullDownFired, 1, 'pull down action fired once');

    this.clock.tick(1000); // NOTE: wait complete for all strategies
});

QUnit.test('refresh show load panel', function(assert) {
    var deferred = $.Deferred();

    var $scrollView = $('#scrollView');

    var scrollView = $scrollView.dxScrollView({
        onPullDown: function(e) {
            assert.equal(loadPanel.option('visible'), true, 'load panel shown on start');

            e.component.release().done(function() {
                deferred.resolve();
            });
        }
    }).dxScrollView('instance');

    var loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

    scrollView.refresh();

    deferred.done(function() {
        assert.equal(loadPanel.option('visible'), false, 'load panel hidden on done');
    });
});

QUnit.test('refreshingText pass to dxLoadPanel', function(assert) {
    var testRefreshingText = 'test';
    var $scrollView = $('#scrollView').dxScrollView({
        refreshingText: testRefreshingText
    });

    var loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

    assert.equal(loadPanel.option('message'), testRefreshingText, 'refreshingText pass to loadPanel');
});

QUnit.test('startLoading shows load panel and locks scrolling', function(assert) {
    var $scrollView = $('#scrollView');
    var wasScrollEvent;
    $scrollView.dxScrollView({
        onScroll: function() {
            wasScrollEvent = true;
        }
    });
    wasScrollEvent = false;
    var loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

    $scrollView.dxScrollView('startLoading');
    assert.equal(loadPanel.option('visible'), true, 'load panel shown');

    pointerMock($scrollView).start().down().move(0, 10);
    assert.ok(!wasScrollEvent, 'scrollEvent was not fired');
});

QUnit.test('startLoading shows load panel doesn\'t show load panel when control is hidden', function(assert) {
    var $scrollView = $('#scrollView');
    $scrollView.dxScrollView({});

    var loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');
    $scrollView.hide();

    $scrollView.dxScrollView('startLoading');
    assert.equal(loadPanel.option('visible'), false, 'load panel shown');
});

QUnit.test('finishLoading hides load panel and unlocks scrolling', function(assert) {
    var $scrollView = $('#scrollView');
    $scrollView.dxScrollView({
        onScroll: function() {
            assert.ok(true, 'scroll is disabled');
        }
    });

    var loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

    $scrollView.dxScrollView('startLoading');
    $scrollView.dxScrollView('finishLoading');
    assert.equal(loadPanel.option('visible'), false, 'load panel hidden');

    pointerMock($scrollView).start().down().move(0, 10);
});

QUnit.test('load panel is not shown when onPullDown is not specified', function(assert) {
    var $scrollView = $('#scrollView');
    var scrollView = $scrollView.dxScrollView().dxScrollView('instance');
    var loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

    scrollView.refresh();
    assert.equal(loadPanel.option('visible'), false, 'load panel hidden');
});

QUnit.test('disabled: scroll was not moved when disabled is changed dynamically', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
            useNative: false
        }),
        scrollView = $scrollView.dxScrollView('instance');

    scrollView.scrollTo({ top: 20 });
    scrollView.option('disabled', true);

    assert.equal(scrollView.scrollTop(), 20, 'scroll was not moved when disabled is changed dynamically');
});

QUnit.test('reach bottom action fired when scrolled to bottom', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        bounceEnabled: false,
        onReachBottom: function(e) {
            assert.ok(true, 'reachBottom fired');
        },
        useNative: false
    });
    var scrollView = $scrollView.dxScrollView('instance');
    var bottomPocketHeight = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS).height();
    scrollView.scrollTo($(scrollView.content()).height() + bottomPocketHeight);
});

QUnit.test('loadPanel hiding after release', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        onPullDown: noop,
        useNative: false,
        inertiaEnabled: false,
    });
    var scrollView = $scrollView.dxScrollView('instance');
    var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

    scrollView.startLoading();
    scrollView.scrollTo(-$topPocket.height() - 1);
    scrollView.finishLoading();

    var loadPanel = $scrollView.find('.dx-loadpanel').dxLoadPanel('instance');
    assert.equal(loadPanel.option('visible'), false, 'load panel hiding');
});


QUnit.test('scrollTo considers pullDown', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: false,
        onPullDown: noop,
        bounceEnabled: true
    });
    var scrollView = $scrollView.dxScrollView('instance');
    var initialScrollTop = scrollView.scrollTop();
    assert.equal(initialScrollTop, 0, 'scrollTop has 0 position on start');

    scrollView.scrollTo(0);

    assert.equal(scrollView.scrollTop(), initialScrollTop, 'scrollTop not changed');
});

QUnit.module('native pullDown strategy', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this._originalPlatform = devices.real().platform;
        devices.real({ platform: 'ios' });
        $('#qunit-fixture').addClass('dx-theme-ios');

        this.originalJQueryScrollTop = $.fn.scrollTop;
        this.originalRendererScrollTop = renderer.fn.scrollTop;
        var currentValue = 0;
        renderer.fn.scrollTop = function(value) {
            if(arguments.length) {
                currentValue = value;
            } else {
                return currentValue;
            }
        };
        $.fn.scrollTop = function(value) {
            if(arguments.length) {
                currentValue = value;
            } else {
                return currentValue;
            }
        };
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real({ platform: this._originalPlatform });
        $('#qunit-fixture').removeClass('dx-theme-ios');

        $.fn.scrollTop = this.originalJQueryScrollTop;
        renderer.fn.scrollTop = this.originalRendererScrollTop;
    }
});

QUnit.test('markup', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown'
    });

    var $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);
    assert.equal($pullDown.length, 1, 'pull down container');
    assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_IMAGE_CLASS).length, 1, 'pull down image');
    assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_INDICATOR_CLASS).length, 1, 'pull down load indicator container');
    assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).length, 1, 'pull down text');
});

QUnit.test('pull down element position', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown',
        onPullDown: noop
    });

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView),
        $topPocket = $('.' + SCROLLVIEW_TOP_POCKET_CLASS, $scrollView);

    var containerOffset = $container.offset().top,
        topPocketOffset = $topPocket.offset().top,
        topPocketSize = $topPocket.height();

    assert.equal(containerOffset, topPocketOffset + topPocketSize, 'pull down element located above content');
});

QUnit.test('pull down element position after dynamic action specification', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown'
    });
    $scrollView.dxScrollView('option', 'onPullDown', noop);

    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView),
        $topPocket = $('.' + SCROLLVIEW_TOP_POCKET_CLASS, $scrollView);

    var containerOffset = $container.offset().top,
        topPocketOffset = $topPocket.offset().top,
        topPocketSize = $topPocket.height();

    assert.equal(containerOffset, topPocketOffset + topPocketSize, 'pull down element located above content');
});

QUnit.test('scrollTop should be greater than 0 on init for prevent WebView bounce', function(assert) {
    var scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown'
    }).dxScrollView('instance');

    var $container = $(scrollView.$element().find('.' + SCROLLABLE_CONTAINER_CLASS));

    assert.equal($container.scrollTop(), 1, 'real scrollTop is greater than 0');
});

QUnit.test('scrollTop should be greater than 0 after scroll event for prevent WebView bounce', function(assert) {
    var scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown'
    }).dxScrollView('instance');

    var $container = $(scrollView.$element().find('.' + SCROLLABLE_CONTAINER_CLASS));

    scrollView.scrollTo({ y: 10 });
    $($container).trigger('scroll');
    assert.equal($container.scrollTop(), 11, 'container was scrolled');

    scrollView.scrollTo({ y: 0 });
    $($container).trigger('scroll');
    assert.equal($container.scrollTop(), 1, 'scrollTop is greater than 0');
});

QUnit.test('scrollTop method should have correct position on init', function(assert) {
    var scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown'
    }).dxScrollView('instance');

    assert.equal(scrollView.scrollTop(), 0, 'scrollTop is 0');
});

QUnit.test('scrollTop method should have correct position after scroll event', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown'
    });

    var scrollView = $('#scrollView').dxScrollView('instance'),
        $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);

    scrollView.scrollTo({ y: 10 });
    $($container).trigger('scroll');
    assert.equal(scrollView.scrollTop(), 10, 'correct scroll position');

    scrollView.scrollTo({ y: 0 });
    $($container).trigger('scroll');
    assert.equal(scrollView.scrollTop(), 0, 'correct scroll position');
});

QUnit.test('pulled down adds ready state', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown',
        onPullDown: noop
    });

    var scrollView = $('#scrollView').dxScrollView('instance'),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS),
        topPocketHeight = $topPocket.height();

    scrollView.scrollTo({ y: -topPocketHeight });
    $($container).trigger('scroll');

    assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), true, 'scrollview-pull-down-ready class added');
    assert.equal($pullDownText.children().eq(1).css('opacity'), 1, 'pullDown ready text');

    scrollView.scrollTo({ y: -topPocketHeight + 1 });
    $($container).trigger('scroll');
    assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), false, 'scrollview-pull-down-ready class removed');
    assert.equal($pullDownText.children().eq(0).css('opacity'), 1, 'pullDown to refresh text');
});

QUnit.test('onPullDown action', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown',
        onPullDown: function() {
            assert.ok(true, 'onPullDown action was fired');
            var location = getScrollOffset($scrollView).top;
            assert.equal(location, topPocketHeight, 'topPocket located at the top of container');
            location = getScrollOffset($scrollView).top;
            assert.equal(location, topPocketHeight, 'content located below the top pocket');

            assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), true, 'scrollview-pull-down-refreshing class added');
            assert.equal($pullDownText.children().eq(2).css('opacity'), 1, 'pullDown refreshing text');
        }
    });

    $('*', $scrollView).css({
        'transition': 'none'
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS),
        topPocketHeight = $topPocket.height();


    var pointer = pointerMock($container).start().down();
    $container.scrollTop(-topPocketHeight);
    $($container).trigger('scroll');
    pointer.up();

    this.clock.tick(400);
});

QUnit.test('release', function(assert) {
    devices.real({ platform: this._originalPlatform });

    var $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown',
            onPullDown: function() {
                setTimeout(function() {
                    scrollView.release();
                });
            }
        }),
        scrollView = $scrollView.dxScrollView('instance');

    var $wrapper = $scrollView.find('.' + SCROLLABLE_WRAPPER_CLASS),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS),
        $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS),
        topPocketHeight = $topPocket.height();

    var pointer = pointerMock($container)
        .start()
        .down();
    $container.scrollTop(-topPocketHeight);
    $($wrapper).trigger('scroll');
    pointer.up();

    this.clock.tick(800);
    assert.ok(true, 'scrollView was enabled');
    var location = translator.locate($topPocket).top;
    assert.equal(location, 0, 'topPocket located above content');
    location = translator.locate($scrollView).top;
    assert.equal(location, 0, 'content located at the top of container');

    assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), false, 'scrollview-pull-down-refreshing class added');
    assert.equal($pullDownText.children().eq(2).css('opacity'), 0, 'pullDown refreshing text');
});

QUnit.test('onReachBottom', function(assert) {
    assert.expect(1);

    var $scrollView = $($('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'pullDown',
        onReachBottom: function() {
            assert.ok(true, 'onReachBottom action was fired');
        }
    }));

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    $container.scrollTop($content.height() - $container.height() + $bottomPocket.height() + 1);
    $($container).trigger('scroll');
});

QUnit.test('release fires update', function(assert) {
    var updated = 0;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        onUpdated: function() {
            updated++;
        }
    });
    assert.equal(updated, 1, 'update fired once after creation');
    var clock = sinon.useFakeTimers();
    try {
        $scrollView.dxScrollView('release');
        clock.tick(400);
        assert.equal(updated, 2, 'update fired');

    } finally {
        clock.restore();
    }
});

QUnit.test('scroll fires with correctly arguments', function(assert) {
    if(this._originalPlatform === 'android' && devices.real().version[0] < 4) {
        assert.expect(0);
        return;
    }

    var top = true,
        left = true,
        right = false,
        bottom = false;
    var lastScrollEventArgs;
    var $scrollView = $('#scrollView').width(50).height(50);
    $scrollView.children().width(100).height(100);

    var checkLastScrollEvent = function() {
        assert.equal(lastScrollEventArgs.reachedTop, top, 'reached top is correct');
        assert.equal(lastScrollEventArgs.reachedRight, right, 'reached right is correct');
        assert.equal(lastScrollEventArgs.reachedBottom, bottom, 'reached bottom is correct');
        assert.equal(lastScrollEventArgs.reachedLeft, left, 'reachde left is correct');
    };

    $scrollView.dxScrollView({
        useNative: true,
        direction: 'both',
        onScroll: function(e) {
            lastScrollEventArgs = e;
        }
    });

    var scrollView = $scrollView.dxScrollView('instance');
    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);

    assert.ok(!lastScrollEventArgs, 'scroll was not triggered on start');

    $($container).trigger('scroll');
    checkLastScrollEvent();

    scrollView.scrollTo({ x: 1, y: 1 });
    top = false; left = false;
    $($container).trigger('scroll');
    checkLastScrollEvent();

    scrollView.scrollTo({
        x: $container.prop('scrollWidth') - $container.prop('clientWidth'),
        y: $container.prop('scrollHeight') - $container.prop('clientHeight')
    });
    right = true; bottom = true;
    $($container).trigger('scroll');
    checkLastScrollEvent();
});

QUnit.module('native swipeDown strategy', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this._originalPlatform = devices.real().platform;
        devices.real({ platform: 'android' });
        $('#qunit-fixture').addClass('dx-theme-android');
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real({ platform: this._originalPlatform });
        $('#qunit-fixture').removeClass('dx-theme-android');
    }
});

QUnit.test('markup', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'swipeDown'
    });

    var $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);
    assert.equal($pullDown.length, 1, 'pull down container');
});

QUnit.test('topPocket visibility depends on onPullDown', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true
    });

    var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
    assert.ok($topPocket.is(':hidden'), 'topPocket hidden');

    $scrollView.dxScrollView('option', 'onPullDown', noop);
    assert.ok($topPocket.is(':visible'), 'topPocket visible');
});

QUnit.test('pull down element start state', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'swipeDown'
    });

    var $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);
    assert.equal($pullDown.css('opacity'), 0, 'pullDown hide with opacity');
});

QUnit.test('pulled down action should be fired when content less than container (T105659)', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'swipeDown',
        onPullDown: function() {
            assert.ok(true, 'pullDown fired');
        }
    });

    $($scrollView.dxScrollView('content')).height(10);
    $scrollView.dxScrollView('update');

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .down()
        .move(0, PULLDOWN_HEIGHT / 2)
        .move(0, PULLDOWN_HEIGHT / 2)
        .up();

    this.clock.tick(400);
});

QUnit.test('pulled down action should be fired after pointer is up if the \'swipeDown\' strategy is used', function(assert) {
    var isPullDownActionFired = false,
        $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onPullDown: function() {
                isPullDownActionFired = true;
            }
        });

    $($scrollView.dxScrollView('content')).height(10);
    $scrollView.dxScrollView('update');

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

    var pointer = pointerMock($container)
        .start()
        .down()
        .move(0, PULLDOWN_HEIGHT / 2)
        .move(0, PULLDOWN_HEIGHT / 2);

    assert.ok(!isPullDownActionFired, 'pull down action is not fired');

    pointer.up();
    assert.ok(isPullDownActionFired, 'pull down action is fired after pointer is up');
});

QUnit.test('pulled down action should not be fired at the end of scrollview', function(assert) {
    var isPullDownActionFired = false,
        $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onPullDown: function() {
                isPullDownActionFired = true;
            },
            height: 100
        });

    $($scrollView.dxScrollView('content')).height(1000);
    $scrollView.dxScrollView('update');

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container).start().down().move(0, -500).up();
    $scrollView.dxScrollView('scrollTo', { y: 500 });
    $($container).trigger('scroll');
    this.clock.tick(400);

    pointerMock($container).start().down(0, 0).move(0, PULLDOWN_HEIGHT).up();
    assert.ok(!isPullDownActionFired, 'pull down action is not fired');
});

QUnit.test('release', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'swipeDown',
        onPullDown: function() {
            scrollView.release();
        }
    });

    var scrollView = $scrollView.dxScrollView('instance');

    var $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS),
        $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .down()
        .move(0, PULLDOWN_HEIGHT);

    assert.ok(true, 'scrollView was enabled');
    assert.equal($pullDown.hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), false, 'scrollview-pull-down-loading class removed');
});

QUnit.test('onReachBottom', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'swipeDown',
        onReachBottom: function() {
            assert.ok(true, 'onReachBottom action was fired');
        }
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    $container.scrollTop($content.height() - $container.height() + $bottomPocket.height() + 1);
    $($container).trigger('scroll');
});

QUnit.test('onReachBottom action when content size changed', function(assert) {
    var count = 0;
    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'swipeDown',
        onReachBottom: function() {
            count++;
        }
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS),
        $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

    $container.scrollTop($content.height() - $container.height() + $bottomPocket.height() + 1);
    $($container).trigger('scroll');
    assert.equal(count, 1, 'fire onReachBottom after first scroll');

    $($container).trigger('scroll');
    assert.equal(count, 1, 'onReachBottom doesn\'t fire if scroll position doesn\'t change');

    $content.height($content.height() * 2);
    $scrollView.dxScrollView('instance').release();

    $container.scrollTop($content.height() - $container.height() + $bottomPocket.height() + 1);
    $($container).trigger('scroll');
    assert.equal(count, 2, 'fire onReachBottom after second scroll');
});

QUnit.test('allow pullDown in Android Chrome for element with native scrolling', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        onPullDown: noop,
        refreshStrategy: 'swipeDown'
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $(document).on('dxpointermove.dxtestns', function(e) {
        if(e.isDefaultPrevented()) {
            assert.ok(true, 'move prevented');
        }
    });

    var pointer = pointerMock($container)
        .start()
        .down()
        .move(0, 10)
        .up();

    pointer
        .start()
        .move(0, -10)
        .up();

    $(document).off('.dxtestns');
});

QUnit.test('dxpointermove shouldn\'t be prevented if pullDown is displayed in Android Chrome', function(assert) {
    assert.expect(1);

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        refreshStrategy: 'swipeDown'
    });

    var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $(document).on('dxpointermove.dxtestns', function(e) {
        assert.ok(!e.isDefaultPrevented(), 'move is not prevented');
    });

    pointerMock($container)
        .start()
        .down()
        .move(0, 10)
        .up();

    $(document).off('.dxtestns');
});

QUnit.test('release fires update', function(assert) {
    if(!('ontouchstart' in window)) {
        assert.ok(true, 'Ziborov: temporary we do not test this case if browser does not supported touch');
        return;
    }
    var updated = 0;

    var $scrollView = $('#scrollView').dxScrollView({
        useNative: true,
        onUpdated: function() {
            updated++;
        }
    });
    assert.equal(updated, 1, 'update fired once after creation');
    var clock = sinon.useFakeTimers();
    try {
        $scrollView.dxScrollView('release');
        clock.tick(800);
        assert.equal(updated, 2, 'update fired');

    } finally {
        clock.restore();
    }
});

QUnit.test('scroll fires with correctly arguments', function(assert) {
    if(this._originalPlatform === 'android' && devices.real().version[0] < 4) {
        assert.expect(0);
        return;
    }

    assert.expect(12);

    var top = true,
        left = true,
        right = false,
        bottom = false;

    var $scrollView = $('#scrollView').width(50).height(50);
    $scrollView.children().width(100).height(100);

    $scrollView.dxScrollView({
        useNative: true,
        direction: 'both',
        onScroll: function(e) {
            assert.equal(e.reachedTop, top, 'reached top is correct');
            assert.equal(e.reachedLeft, left, 'reached left is correct');
            assert.equal(e.reachedRight, right, 'reached right is correct');
            assert.equal(e.reachedBottom, bottom, 'reached bottom is correct');
        }
    });
    var scrollView = $scrollView.dxScrollView('instance');
    var $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);

    $($container).trigger('scroll');

    scrollView.scrollTo({ x: 1, y: 1 });
    top = false; left = false;
    $($container).trigger('scroll');
    scrollView.scrollTo({
        x: $container.prop('scrollWidth') - $container.prop('clientWidth'),
        y: $container.prop('scrollHeight') - $container.prop('clientHeight')
    });
    right = true; bottom = true;
    $($container).trigger('scroll');
});


QUnit.module('regressions', moduleConfig);

QUnit.skip('B251572 - dxScrollView - Scroll position flies away when setting the direction option to horizontal or both', function(assert) {
    var $scrollView = $('#scrollView').dxScrollView({});

    $scrollView.dxScrollView('option', 'direction', 'horizontal');
    var location = getScrollOffset($scrollView);
    assert.equal(location.left, 0);
});

QUnit.test('B252260 - dxScrollView raise the \'Unknown dxScrollView refresh strategy\' error in a simulator', function(assert) {
    assert.expect(0);
    $('#scrollView').dxScrollView({ useNativeScrolling: true }).dxScrollView('instance');
});


QUnit.module('default value', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.originalRealDevice = devices.real();
        this.originalCurrentDevice = devices.current();
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
        devices.real(this.originalRealDevice);
        devices.current(this.originalCurrentDevice);
    }
});

QUnit.test('refreshStrategy for ios set by real device', function(assert) {
    devices.real({ platform: 'ios' });
    devices.current({ platform: 'android' });

    var scrollView = $('#scrollView').dxScrollView().dxScrollView('instance');
    assert.equal(scrollView.option('refreshStrategy'), 'pullDown');
});

QUnit.test('refreshStrategy for android set by real device', function(assert) {
    devices.real({ platform: 'android', version: '4' });
    devices.current({ platform: 'ios' });

    var scrollView = $('#scrollView').dxScrollView().dxScrollView('instance');

    assert.equal(scrollView.option('refreshStrategy'), 'swipeDown');
});


module('pullDown, reachBottom events', moduleConfig, () => {
    test('topPocket visibility depends on pullDown event', (assert) => {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);

        $scrollView.dxScrollView('instance').on('pullDown', noop);

        assert.ok($topPocket.is(':visible'), 'topPocket is visible');
    });

    test('pullDown event should be fired after refresh method call', (assert) => {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const instance = $scrollView.dxScrollView('instance');

        instance.on('pullDown', () => {
            assert.ok(true, 'pullDown is fired on refresh');
        });

        instance.refresh();
    });

    test('bottomPocket element depends on reachBottom event', (assert) => {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        $scrollView.dxScrollView('instance').on('reachBottom', noop);

        const $reachBottom = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);

        assert.ok($reachBottom.is(':visible'), 'reach bottom is visible');
    });

    test('scrollview events support chains', (assert) => {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        $scrollView.dxScrollView('instance').on('reachBottom', noop).on('pullDown', noop);

        assert.ok(true, 'chains is supported');
    });

    test('scrollview events support chains', (assert) => {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        $scrollView.dxScrollView('instance').on('reachBottom', noop).on('pullDown', noop);

        assert.ok(true, 'chains is supported');
    });

    ['config', 'onInitialized'].forEach(assignMethod => {
        test('Check pullDown event handler - ' + assignMethod, (assert) => {
            let config = {};
            let pullDownHandler = sinon.stub();

            if(assignMethod === 'config') {
                config.onPullDown = pullDownHandler;
            } else if(assignMethod === 'onInitialized') {
                config.onInitialized = (e) => {
                    e.component.on('pullDown', pullDownHandler);
                };
            } else {
                assert.ok(false);
            }

            const $scrollView = $('#scrollView').dxScrollView($.extend(config, { useNative: false }));
            assert.ok(true, 'no exceptions');

            let $content = $scrollView.find(`.${SCROLLABLE_CONTENT_CLASS}`);
            const $topPocket = $scrollView.find(`.${SCROLLVIEW_TOP_POCKET_CLASS}`);
            pointerMock($content)
                .start()
                .down()
                .move(0, $topPocket.height() + 10)
                .up();
            assert.strictEqual(pullDownHandler.callCount, 1, 'pullDownHandler.callCount');
        });

        test('Check reachBottom event handler - ' + assignMethod, (assert) => {
            let config = {};
            let reachBottomHandler = sinon.stub();

            if(assignMethod === 'config') {
                config.onReachBottom = reachBottomHandler;
            } else if(assignMethod === 'onInitialized') {
                config.onInitialized = (e) => {
                    e.component.on('reachBottom', reachBottomHandler);
                };
            } else {
                assert.ok(false);
            }

            const $scrollView = $('#scrollView').dxScrollView($.extend(config, { useNative: false }));
            assert.ok(true, 'no exceptions');

            let $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

            pointerMock($content)
                .start()
                .down()
                .move(0, -$content.height() - 10)
                .up();
            assert.strictEqual(reachBottomHandler.callCount, 1, 'reachBottomHandler.callCount');
        });
    });
});
