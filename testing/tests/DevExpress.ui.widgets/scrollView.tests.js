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
    const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const location = translator.locate($content);

    return {
        top: (location.top - $container.scrollTop() || 0),
        left: (location.left || -$container.scrollLeft() || 0)
    };
};

devices.current('iPhone');

const moduleConfig = {
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
    const markup = '\
        <div id="scrollView" style="height: 50px; width: 50px;">\
            <div class="content1" style="height: 100px; width: 100px;"></div>\
            <div class="content2" style="height: 100px; width: 100px;"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('render', moduleConfig, () => {
    QUnit.test('scrollView render', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const $scrollableContent = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollableContent.children().eq(0);
        const $content = $scrollableContent.children().eq(1);
        const $bottomPocket = $scrollableContent.children().eq(2);

        assert.ok($scrollView.hasClass(SCROLLVIEW_CLASS), 'dx-scrollview class attached');
        assert.ok($topPocket.hasClass(SCROLLVIEW_TOP_POCKET_CLASS), 'dx-scrollview-top-pocket class attached');
        assert.ok($content.hasClass(SCROLLVIEW_CONTENT_CLASS), 'dx-scrollview-content class attached');
        assert.ok($bottomPocket.hasClass(SCROLLVIEW_BOTTOM_POCKET_CLASS), 'dx-scrollview-bottom-pocket');

        assert.equal($content.children().length, 2, 'content was moved');
        assert.ok($content.children().eq(0).hasClass('content1'));
        assert.ok($content.children().eq(1).hasClass('content2'));
    });

    QUnit.test('scrollView pullDown markup', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);

        assert.equal($pullDown.length, 1, 'pull down container');
        assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_IMAGE_CLASS).length, 1, 'pull down image');
        assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_INDICATOR_CLASS).length, 1, 'pull down load indicator container');
        assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).length, 1, 'pull down text');
    });

    QUnit.test('dxLoadIndicator was created', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        const $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);
        const $loadIndicatorTop = $topPocket.find('.dx-loadindicator');
        const $loadIndicatorBottom = $bottomPocket.find('.dx-loadindicator');

        const top = $loadIndicatorTop.dxLoadIndicator('instance');
        const bottom = $loadIndicatorBottom.dxLoadIndicator('instance');

        assert.notEqual(top, null, 'dxLoadIndicator was created');
        assert.notEqual(bottom, null, 'dxLoadIndicator was created');
    });

    QUnit.test('pulldown text', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            onPullDown: noop,
            useNative: false
        });
        const pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);
        const scrollBottomText = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);

        assert.equal(pullDownText.children().eq(0).text(), messageLocalization.format('dxScrollView-pullingDownText'));
        assert.equal(pullDownText.children().eq(1).text(), messageLocalization.format('dxScrollView-pulledDownText'));
        assert.equal(pullDownText.children().eq(2).text(), messageLocalization.format('dxScrollView-refreshingText'));
        assert.equal(scrollBottomText.text(), 'Loading...');
    });

    QUnit.test('scrollView scrollbottom markup', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);
        const $scrollBottom = $bottomPocket.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);

        assert.equal($scrollBottom.length, 1, 'scroll bottom container');
        assert.equal($scrollBottom.find('.' + SCROLLVIEW_REACHBOTTOM_TEXT_CLASS).length, 1, 'scrollbottom text');
        assert.equal($scrollBottom.find('.' + SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS).length, 1, 'scrollbottom load indicator container');
    });

    QUnit.test('scrollView has correct height when container height is auto', function(assert) {
        const $scrollView = $('#scrollView');

        $scrollView.height('auto');
        $scrollView.dxScrollView({ useNative: false, pushBackValue: 0 });

        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

        assert.equal($scrollView.height(), $content.height(), 'scrollView has correctly height');
    });

    QUnit.test('pulling down text change', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        $scrollView.dxScrollView('option', 'pullingDownText', 'test');

        const $pullingDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).children().eq(0);
        assert.equal($pullingDownText.text(), 'test');
    });

    QUnit.test('pulled down text change', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        $scrollView.dxScrollView('option', 'pulledDownText', 'test');

        const $pullingDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).children().eq(1);
        assert.equal($pullingDownText.text(), 'test');
    });

    QUnit.test('refreshing text change', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        $scrollView.dxScrollView('option', 'refreshingText', 'test');

        const $pullingDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).children().eq(2);
        assert.equal($pullingDownText.text(), 'test');
    });

    QUnit.test('reachbottom text change', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        $scrollView.dxScrollView('option', 'reachBottomText', 'test');

        const $scrollBottomText = $('.' + SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);
        assert.equal($scrollBottomText.text(), 'test');
    });
});

QUnit.module('dimension', moduleConfig, () => {
    QUnit.test('top position calculation', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onPullDown: noop
        });
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        const location = getScrollOffset($scrollView);
        assert.equal(location.top, -$topPocket.height(), 'top position calculated considering top pocket height');
    });

    QUnit.test('bottom position calculation', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onEnd: function() {
                const location = getScrollOffset($scrollView);
                const height = $container.height() - $content.height() + $bottomPocket.height();
                assert.equal(location.top, height, 'bottom position calculated considering top pocket height');
            }
        });

        var $container = $scrollView.find('.dx-scrollable-container');
        var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $container.height() - $content.height() + $topPocket.height() + $bottomPocket.height() - 10)
            .up();
    });
});

QUnit.module('actions', moduleConfig, () => {
    QUnit.test('onPullDown action', function(assert) {
        let firstScroll = true;
        const offset = 10;
        var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function(e) {
                assert.ok(true, 'pulldown action was fired');
            },
            onScroll: function() {
                if(firstScroll) {
                    const location = getScrollOffset($scrollView);
                    assert.equal(location.top, offset);
                }
                firstScroll = false;
            },
            onEnd: function() {
                assert.ok(false, 'end action should not be fired');
            }
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + offset)
            .up();
    });

    QUnit.test('no onPullDown hides pullDown', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({});
        assert.ok($scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS).is(':hidden'), 'pull down element is hidden');
    });

    QUnit.test('changing of onPullDown option changes pullDown visibility', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({});
        $scrollView.dxScrollView('option', 'onPullDown', noop);
        assert.ok($scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS).is(':visible'), 'pull down element is visible');
    });

    QUnit.test('pullDown behavior turns off when pullDown is undefined', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onEnd: function() {
                assert.ok(true, 'end action should be fired');
            }
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 10)
            .up();
    });

    QUnit.test('top position calculation on pull down', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onPullDown: noop
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const offset = 2;

        pointerMock($content)
            .start()
            .down()
            .move(0, offset);

        const location = translator.locate($content);
        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        assert.equal(location.top, 0, 'translate top position is right');
        assert.equal($container.scrollTop(), $topPocket.height() - offset, 'scroll top position is right');

    });

    QUnit.test('onReachBottom action', function(assert) {
        const $scrollView = $($('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onReachBottom: function(e) {
                assert.ok(true, 'onReachBottom action was fired');
            },
            onEnd: function() {
                assert.ok(false, 'end action should not be fired');
            }
        }));
        const $container = $scrollView.find('.dx-scrollable-container');
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $container.height() - $content.height() - $bottomPocket.height() - 1)
            .up();
    });

    QUnit.test('onReachBottom action should not be fired in rtl mode', function(assert) {
        assert.expect(0);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            direction: 'vertical',
            rtlEnabled: false,
            onReachBottom: function(e) {
                assert.ok(false, 'onReachBottom action won\'t fired');
            }
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        $content.width(200);
        $content.height(0);

        $scrollView.dxScrollView('instance').option('rtlEnabled', true);
    });

    QUnit.test('changing of onReachBottom option changes reach bottom element visibility', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        $scrollView.dxScrollView('option', 'onReachBottom', noop);
        assert.ok($scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS).is(':visible'), 'reach bottom element is visible');
    });

    QUnit.test('onReachBottom action fired once', function(assert) {
        assert.expect(1);

        let reachBottomFired = 0;

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onReachBottom: function(e) {
                reachBottomFired++;
                assert.equal(reachBottomFired, 1, 'onReachBottom fired once');
            }
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, -$content.height())
            .move(0, -1)
            .up();
    });

    QUnit.test('changing action option does not cause render', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        const mouse = pointerMock($content).start();

        mouse
            .down()
            .move(0, -10);

        const testAction = function(actionName) {
            $scrollView.dxScrollView('option', actionName, noop);
            const location = getScrollOffset($scrollView);
            assert.equal(location.top, -$topPocket.height() - 10, actionName + ' case scrollable rerendered');
        };

        testAction('onPullDown');
        testAction('onReachBottom');
    });

    QUnit.test('onReachBottom action is not fired when scrollable content bottom is not reached', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onReachBottom: function(e) {
                assert.ok(false, 'onReachBottom action should not be fired');
            },
            onEnd: function() {
                assert.ok(true, 'end action was fired');
            }
        });
        const $container = $scrollView.find('.dx-scrollable-container');
        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);
        const $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $container.height() - ($content.height() - $bottomPocket.outerHeight() + 1))
            .up();
    });

    QUnit.test('disabled scrollview should not be updated on pointerdown after finish loading', function(assert) {
        let count = 0;
        const $scrollView = $('#scrollView').dxScrollView({
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
});

QUnit.module('dynamic', moduleConfig, () => {
    QUnit.test('pulling down', function(assert) {
        assert.expect(1);

        var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function() {
                const location = getScrollOffset($scrollView);
                assert.equal(location.top, 0, 'pulled down');
            }
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

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
                const location = getScrollOffset($scrollView);
                assert.equal(location.top, -$topPocket.height(), 'content bounced to the top');
            }
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 1)
            .move(0, -10)
            .up();
    });

    QUnit.test('onPullDown enabled doesn\'t change the position of content', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, -10)
            .up();

        $scrollView.dxScrollView('option', 'onPullDown', noop);

        const location = getScrollOffset($scrollView);

        assert.equal(location.top, -10 - $topPocket.height(), 'content position was not changed');
    });

    QUnit.test('onPullDown disabled does not change the position of content', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: noop
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, -10)
            .up();

        $scrollView.dxScrollView('option', 'onPullDown', undefined);

        const location = getScrollOffset($scrollView);

        assert.equal(location.top, -10, 'content position was not changed');
    });

    QUnit.test('scroll content stays in bounds when onPullDown turned off', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: noop,
            onReachBottom: noop
        });

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $container.height() - $content.height())
            .up();

        $scrollView.dxScrollView('option', 'onPullDown', null);

        const location = getScrollOffset($scrollView);

        assert.equal(location.top, $container.height() - $content.height(), 'content position was not changed');
    });

    QUnit.test('pulled down adds ready state', function(assert) {
        assert.expect(4);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: noop
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        const $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);
        const mouse = pointerMock($content).start();

        mouse.down().move(0, $topPocket.height() + 1);
        assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), true, 'scrollview-pull-down-ready class added');
        assert.equal($pullDownText.children().eq(1).css('opacity'), 1);

        mouse.move(0, -10);
        assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), false, 'scrollview-pull-down-ready class removed');
        assert.equal($pullDownText.children().eq(0).css('opacity'), 1);
    });

    QUnit.test('pulled down adds loading state', function(assert) {
        assert.expect(3);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function() {
                assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), true, 'scrollview-pull-down-loading class added');
                assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_READY_CLASS), false, 'scrollview-pull-down-ready class removed');
                assert.equal($pullDownText.children().eq(2).css('opacity'), 1);
            }
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        var $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 1)
            .up();
    });

    QUnit.test('release cause release state', function(assert) {
        assert.expect(3);

        const clock = this.clock;

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
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        var $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 1)
            .up();
    });

    const SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS = 'dx-scrollview-pull-down-text-visible';

    QUnit.test('pulled down adds ready state for Material theme', function(assert) {
        assert.expect(6);
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: noop
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        const $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);
        const mouse = pointerMock($content).start();

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
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function() {
                assert.ok(!$pullDownText.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
                assert.ok(!$pullDownText.children().eq(1).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
                assert.ok($pullDownText.children().eq(2).hasClass(SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS));
            }
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        var $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 1)
            .up();

        themes.isMaterial = origIsMaterial;
    });

    QUnit.test('scrollview locked while pulldown loading', function(assert) {
        assert.expect(0);

        let loading = false;

        const $scrollView = $('#scrollView').dxScrollView({
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

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        var mouse = pointerMock($content).start();

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
                const location = getScrollOffset($scrollView);
                assert.roughEqual(location.top, $container.height() - $content.height(), 1);
            }
        });

        var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const mouse = pointerMock($content).start();

        mouse
            .down()
            .move(0, -$content.height() - 10)
            .up();
    });

    QUnit.test('scrollview should go to released state if release method was called during the loading', function(assert) {
        assert.expect(1);
        const done = assert.async();
        let count = 0;

        const $scrollView = $('#scrollView').dxScrollView({
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
        });
        var scrollView = $scrollView.dxScrollView('instance');

        scrollView.toggleLoading(true);
        scrollView.scrollTo({ x: 0, y: 220 });
    });

    QUnit.test('onReachBottom should not be called when scroll delta is 0', function(assert) {
        assert.expect(1);

        const done = assert.async();
        const $scrollView = $('#scrollView').dxScrollView({
            height: 50,
            useNative: true,
            inertiaEnabled: false,
            refreshStrategy: 'pullDown',
            onReachBottom: function() {
                scrollView.release(false);

                assert.ok(true, 'reachBottom was not called on the second scroll');
                done();
            }
        });
        var scrollView = $scrollView.dxScrollView('instance');

        scrollView.scrollTo({ x: 0, y: 150 });
        $(scrollView.content()).trigger('scroll');
    });

    QUnit.test('scrollview locked while loading', function(assert) {
        assert.expect(0);

        let loading = false;

        const $scrollView = $('#scrollView').dxScrollView({
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

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);
        var mouse = pointerMock($content).start();

        mouse
            .down()
            .move(0, -$content.height() - 10)
            .up();
    });

    QUnit.test('release after loading cause bounce to the bottom bound', function(assert) {
        assert.expect(1);

        const clock = this.clock;

        var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onReachBottom: function() {
                this.release();
                clock.tick();
            },
            onEnd: function() {
                const location = getScrollOffset($scrollView);
                assert.roughEqual(location.top, $container.height() - $content.height(), 1, 'scrollview bounced');
            }
        });

        var $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, -$content.height() - 10)
            .up();
    });

    QUnit.test('pull down element is not hidden when container larger than content', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        $container.height(400);
        $content.find('.' + SCROLLVIEW_CONTENT_CLASS).children().height(50);
        $scrollView.dxScrollView('update');

        const location = getScrollOffset($scrollView);

        assert.equal(location.top, -$topPocket.height());
    });

    QUnit.test('pull down doesn\'t show loading panel', function(assert) {
        assert.expect(1);

        let isLoadPanelVisible;

        var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function() {
                isLoadPanelVisible = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).eq(0).dxLoadPanel('option', 'visible');
            }
        });
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 1)
            .up();

        assert.equal(isLoadPanelVisible, false, 'load panel is invisible during pull down');
    });

    QUnit.test('scrollview content should not blink in bounce on iOS', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown'
        });
        const instance = $scrollView.dxScrollView('instance');
        const $wrapper = $scrollView.find('.' + SCROLLABLE_WRAPPER_CLASS);
        let onStart = false;
        let onEnd = false;

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
});

QUnit.module('scrollbars', moduleConfig, () => {
    QUnit.test('scrollView locates scrollbar in correctly position after creation', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false
        });

        const location = getScrollOffset($scrollView);
        assert.equal(location.top, 0, 'scrollbar at the top position');
    });

    QUnit.test('scrollbar height calculated correctly', function(assert) {
        const containerHeight = 50;
        const contentHeight = 100;
        const scrollHeight = (containerHeight / contentHeight) * containerHeight;

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false
        });

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);
        const $scroll = $scrollView.find('.' + SCROLLABLE_SCROLL_CLASS);

        $container.height(containerHeight);
        $content.empty().height(contentHeight);

        $scrollView.dxScrollView('instance').update();

        assert.equal($scroll.height(), scrollHeight, 'scrollbar height calculated correctly');
    });

    QUnit.test('moving scrollView moves scrollbar in correct position', function(assert) {
        const containerHeight = 50;
        const contentHeight = 100;
        let location;
        const distance = -10;
        const scrollbarDistance = -distance * (containerHeight / contentHeight);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onEnd: function() {
                location = translator.locate($scroll);
                assert.equal(location.top, 2 * scrollbarDistance, 'scrollbar follows pointer everytime');
            }
        });

        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);
        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        var $scroll = $scrollView.find('.' + SCROLLABLE_SCROLL_CLASS);

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
        const $scrollView = $('#scrollView').height(50);
        $scrollView.append('<div>').children().height(100);
        $scrollView.dxScrollView({
            useNative: false,
            showScrollbar: 'onHover',
            bounceEnabled: false
        });

        const $scrollbar = $scrollView.find('.' + SCROLLABLE_SCROLLBAR_CLASS);
        pointerMock($scrollbar).start().wheel(-10);

        assert.equal(Scrollbar.getInstance($scrollbar).option('visible'), true, 'thumb stays visible when showScrollbar is \'onHover\'');
    });

    QUnit.test('scrolling by thumb should trigger bottom loading even without moving', function(assert) {
        const containerSize = 50;
        const contentHeight = 100;

        const $scrollView = $('#scrollView').dxScrollView({
            scrollByThumb: true,
            inertiaEnabled: false,
            useNative: false,
            onReachBottom: function() {
                assert.ok(true, 'action fired');
            }
        });

        const $scrollbar = $scrollView.find('.' + SCROLLABLE_SCROLLBAR_CLASS);
        const mouse = pointerMock($scrollbar).start();
        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

        $container.height(containerSize).width(containerSize);
        $content.empty().height(contentHeight);
        $scrollView.dxScrollView('update');

        const containerPosition = $container.offset();
        mouse.down(containerPosition.top + containerSize, containerPosition.left + containerSize).up();
    });
});

QUnit.module('api', moduleConfig, () => {
    QUnit.test('content', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({});
        assert.ok($($scrollView.dxScrollView('instance').content()).hasClass(SCROLLVIEW_CONTENT_CLASS), 'returns scrollView content');
    });

    QUnit.test('release', function(assert) {
        assert.expect(1);

        const clock = this.clock;

        var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function() {
                this.release();
                clock.tick();
            },
            onEnd: function() {
                const location = getScrollOffset($scrollView);
                assert.equal(location.top, -$topPocket.height(), 'scrollview bounced');
            }
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 1)
            .up();
    });

    QUnit.test('release does not enable reach bottom functionality', function(assert) {
        assert.expect(2);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false
        });

        const $reachBottom = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);

        assert.ok($reachBottom.is(':hidden'), 'reach bottom is hidden');

        $scrollView.dxScrollView('release').done(function() {
            assert.ok($reachBottom.is(':hidden'), 'reach bottom is hidden');
        });

        this.clock.tick();
    });

    QUnit.test('release with preventReachBottom', function(assert) {
        assert.expect(1);

        const clock = this.clock;

        var $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            inertiaEnabled: false,
            onPullDown: function() {
                this.release(true);
                clock.tick();
            },
            onEnd: function() {
                const $bottomPocketLoading = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);
                assert.ok($bottomPocketLoading.is(':hidden'), 'bottom pocket loading is hidden');
            }
        });

        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $topPocket.height() + 1)
            .up();
    });

    QUnit.test('release without pulldown', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false
        });

        $scrollView.dxScrollView('release')
            .done(function() {
                assert.ok(true, 'release without loading fails');
            });

        this.clock.tick();
    });

    QUnit.test('release fires update', function(assert) {
        let updated = 0;

        const $scrollView = $('#scrollView').dxScrollView({
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
                const location = getScrollOffset($scrollView);
                assert.roughEqual(location.top, $container.height() - $content.height(), 1);
            }
        });

        var $container = $scrollView.find('.dx-scrollable-container');
        var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        var mouse = pointerMock($content).start();

        mouse
            .down()
            .move(0, $topPocket.height() + 1)
            .up();

        this.clock.tick();
    });

    QUnit.test('release calls update for scrollbar', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({
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

        var $container = $scrollView.find('.dx-scrollable-container');
        var $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        var $scroll = $scrollView.find('.' + SCROLLABLE_SCROLL_CLASS);

        pointerMock($content)
            .start()
            .down()
            .move(0, $container.height() - $content.height() - $topPocket.height() - 10)
            .up();

        this.clock.tick();
    });

    QUnit.test('release calls moveToBound location immediately when state is released', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onPullDown: noop,
            inertiaEnabled: true
        });

        const $children = $('.' + SCROLLVIEW_CONTENT_CLASS, $scrollView).children();
        const $scrollableContent = $('.' + SCROLLABLE_CONTENT_CLASS, $scrollView);
        const pullDownSize = $('.' + SCROLLVIEW_TOP_POCKET_CLASS, $scrollView).height();
        const scrollView = $scrollView.dxScrollView('instance');

        scrollView.scrollTo(scrollView.scrollHeight());
        $children.remove();
        pointerMock($scrollableContent).start().down(); // NOTE: call update without moveToBound location
        scrollView.release();

        const locate = getScrollOffset($scrollView);
        assert.equal(locate.top, -pullDownSize, 'moveToBound was called immediately after release');
    });

    QUnit.test('toggleLoading', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onReachBottom: noop
        });
        const $bottomPocketLoading = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);
        const scrollView = $scrollView.dxScrollView('instance');

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
                const location = getScrollOffset($scrollView);
                assert.equal(location.top, $container.height() - $content.height() + $bottomPocket.height());
            }
        });

        var $container = $scrollView.find('.dx-scrollable-container');
        var $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        var $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

        const mouse = pointerMock($content)
            .start()
            .down()
            .move(0, $container.height() - $content.height() - $bottomPocket.height() - 1);

        $scrollView.dxScrollView('toggleLoading', false);

        mouse.up();
    });

    QUnit.test('isFull', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({});
        const $container = $scrollView.find('.dx-scrollable-container');
        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

        $container.height(50);
        $content.children().height(100);
        $scrollView.dxScrollView('update');
        assert.equal($scrollView.dxScrollView('isFull'), true, 'container is full');
    });

    QUnit.test('isFull should be false if container has same height as content', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({});
        const $container = $scrollView.find('.dx-scrollable-container');
        const $content = $scrollView.find('.' + SCROLLVIEW_CONTENT_CLASS);

        $container.height(50);
        $content.children().height(25);
        $scrollView.dxScrollView('update');
        assert.equal($scrollView.dxScrollView('isFull'), false, 'container is full');
    });

    QUnit.test('refresh', function(assert) {
        assert.expect(2);

        let pullDownFired = 0;
        const deferred = $.Deferred();

        const scrollView = $('#scrollView').dxScrollView({
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
        const deferred = $.Deferred();

        const $scrollView = $('#scrollView');

        const scrollView = $scrollView.dxScrollView({
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
        const testRefreshingText = 'test';
        const $scrollView = $('#scrollView').dxScrollView({
            refreshingText: testRefreshingText
        });

        const loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

        assert.equal(loadPanel.option('message'), testRefreshingText, 'refreshingText pass to loadPanel');
    });

    QUnit.test('startLoading shows load panel and locks scrolling', function(assert) {
        const $scrollView = $('#scrollView');
        let wasScrollEvent;
        $scrollView.dxScrollView({
            onScroll: function() {
                wasScrollEvent = true;
            }
        });
        wasScrollEvent = false;
        const loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

        $scrollView.dxScrollView('startLoading');
        assert.equal(loadPanel.option('visible'), true, 'load panel shown');

        pointerMock($scrollView).start().down().move(0, 10);
        assert.ok(!wasScrollEvent, 'scrollEvent was not fired');
    });

    QUnit.test('startLoading shows load panel doesn\'t show load panel when control is hidden', function(assert) {
        const $scrollView = $('#scrollView');
        $scrollView.dxScrollView({});

        const loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');
        $scrollView.hide();

        $scrollView.dxScrollView('startLoading');
        assert.equal(loadPanel.option('visible'), false, 'load panel shown');
    });

    QUnit.test('finishLoading hides load panel and unlocks scrolling', function(assert) {
        const $scrollView = $('#scrollView');
        $scrollView.dxScrollView({
            onScroll: function() {
                assert.ok(true, 'scroll is disabled');
            }
        });

        const loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

        $scrollView.dxScrollView('startLoading');
        $scrollView.dxScrollView('finishLoading');
        assert.equal(loadPanel.option('visible'), false, 'load panel hidden');

        pointerMock($scrollView).start().down().move(0, 10);
    });

    QUnit.test('load panel is not shown when onPullDown is not specified', function(assert) {
        const $scrollView = $('#scrollView');
        const scrollView = $scrollView.dxScrollView().dxScrollView('instance');
        const loadPanel = $scrollView.find('.' + SCROLLVIEW_LOADPANEL).dxLoadPanel('instance');

        scrollView.refresh();
        assert.equal(loadPanel.option('visible'), false, 'load panel hidden');
    });

    QUnit.test('disabled: scroll was not moved when disabled is changed dynamically', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false
        });
        const scrollView = $scrollView.dxScrollView('instance');

        scrollView.scrollTo({ top: 20 });
        scrollView.option('disabled', true);

        assert.equal(scrollView.scrollTop(), 20, 'scroll was not moved when disabled is changed dynamically');
    });

    QUnit.test('reach bottom action fired when scrolled to bottom', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({
            bounceEnabled: false,
            onReachBottom: function(e) {
                assert.ok(true, 'reachBottom fired');
            },
            useNative: false
        });
        const scrollView = $scrollView.dxScrollView('instance');
        const bottomPocketHeight = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS).height();
        scrollView.scrollTo($(scrollView.content()).height() + bottomPocketHeight);
    });

    QUnit.test('loadPanel hiding after release', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            onPullDown: noop,
            useNative: false,
            inertiaEnabled: false,
        });
        const scrollView = $scrollView.dxScrollView('instance');
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);

        scrollView.startLoading();
        scrollView.scrollTo(-$topPocket.height() - 1);
        scrollView.finishLoading();

        const loadPanel = $scrollView.find('.dx-loadpanel').dxLoadPanel('instance');
        assert.equal(loadPanel.option('visible'), false, 'load panel hiding');
    });


    QUnit.test('scrollTo considers pullDown', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: false,
            onPullDown: noop,
            bounceEnabled: true
        });
        const scrollView = $scrollView.dxScrollView('instance');
        const initialScrollTop = scrollView.scrollTop();
        assert.equal(initialScrollTop, 0, 'scrollTop has 0 position on start');

        scrollView.scrollTo(0);

        assert.equal(scrollView.scrollTop(), initialScrollTop, 'scrollTop not changed');
    });
});

QUnit.module('native pullDown strategy', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this._originalPlatform = devices.real().platform;
        devices.real({ platform: 'ios' });
        $('#qunit-fixture').addClass('dx-theme-ios');

        this.originalJQueryScrollTop = $.fn.scrollTop;
        this.originalRendererScrollTop = renderer.fn.scrollTop;
        let currentValue = 0;
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
}, () => {
    QUnit.test('markup', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown'
        });

        const $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);
        assert.equal($pullDown.length, 1, 'pull down container');
        assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_IMAGE_CLASS).length, 1, 'pull down image');
        assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_INDICATOR_CLASS).length, 1, 'pull down load indicator container');
        assert.equal($pullDown.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS).length, 1, 'pull down text');
    });

    QUnit.test('pull down element position', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown',
            onPullDown: noop
        });

        const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);
        const $topPocket = $('.' + SCROLLVIEW_TOP_POCKET_CLASS, $scrollView);

        const containerOffset = $container.offset().top;
        const topPocketOffset = $topPocket.offset().top;
        const topPocketSize = $topPocket.height();

        assert.equal(containerOffset, topPocketOffset + topPocketSize, 'pull down element located above content');
    });

    QUnit.test('pull down element position after dynamic action specification', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown'
        });
        $scrollView.dxScrollView('option', 'onPullDown', noop);

        const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);
        const $topPocket = $('.' + SCROLLVIEW_TOP_POCKET_CLASS, $scrollView);

        const containerOffset = $container.offset().top;
        const topPocketOffset = $topPocket.offset().top;
        const topPocketSize = $topPocket.height();

        assert.equal(containerOffset, topPocketOffset + topPocketSize, 'pull down element located above content');
    });

    QUnit.test('scrollTop should be greater than 0 on init for prevent WebView bounce', function(assert) {
        const scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown'
        }).dxScrollView('instance');

        const $container = $(scrollView.$element().find('.' + SCROLLABLE_CONTAINER_CLASS));

        assert.equal($container.scrollTop(), 1, 'real scrollTop is greater than 0');
    });

    QUnit.test('scrollTop should be greater than 0 after scroll event for prevent WebView bounce', function(assert) {
        const scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown'
        }).dxScrollView('instance');

        const $container = $(scrollView.$element().find('.' + SCROLLABLE_CONTAINER_CLASS));

        scrollView.scrollTo({ y: 10 });
        $($container).trigger('scroll');
        assert.equal($container.scrollTop(), 11, 'container was scrolled');

        scrollView.scrollTo({ y: 0 });
        $($container).trigger('scroll');
        assert.equal($container.scrollTop(), 1, 'scrollTop is greater than 0');
    });

    QUnit.test('scrollTop method should have correct position on init', function(assert) {
        const scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown'
        }).dxScrollView('instance');

        assert.equal(scrollView.scrollTop(), 0, 'scrollTop is 0');
    });

    QUnit.test('scrollTop method should have correct position after scroll event', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown'
        });

        const scrollView = $('#scrollView').dxScrollView('instance');
        const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);

        scrollView.scrollTo({ y: 10 });
        $($container).trigger('scroll');
        assert.equal(scrollView.scrollTop(), 10, 'correct scroll position');

        scrollView.scrollTo({ y: 0 });
        $($container).trigger('scroll');
        assert.equal(scrollView.scrollTop(), 0, 'correct scroll position');
    });

    QUnit.test('pulled down adds ready state', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown',
            onPullDown: noop
        });

        const scrollView = $('#scrollView').dxScrollView('instance');
        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        const $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);
        const topPocketHeight = $topPocket.height();

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
                let location = getScrollOffset($scrollView).top;
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

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        var $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        var $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);
        var topPocketHeight = $topPocket.height();


        const pointer = pointerMock($container).start().down();
        $container.scrollTop(-topPocketHeight);
        $($container).trigger('scroll');
        pointer.up();

        this.clock.tick(400);
    });

    QUnit.test('release', function(assert) {
        devices.real({ platform: this._originalPlatform });

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown',
            onPullDown: function() {
                setTimeout(function() {
                    scrollView.release();
                });
            }
        });
        var scrollView = $scrollView.dxScrollView('instance');

        const $wrapper = $scrollView.find('.' + SCROLLABLE_WRAPPER_CLASS);
        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        const $pullDownText = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_TEXT_CLASS);
        const topPocketHeight = $topPocket.height();

        const pointer = pointerMock($container)
            .start()
            .down();
        $container.scrollTop(-topPocketHeight);
        $($wrapper).trigger('scroll');
        pointer.up();

        this.clock.tick(800);
        assert.ok(true, 'scrollView was enabled');
        let location = translator.locate($topPocket).top;
        assert.equal(location, 0, 'topPocket located above content');
        location = translator.locate($scrollView).top;
        assert.equal(location, 0, 'content located at the top of container');

        assert.equal($topPocket.children().eq(0).hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), false, 'scrollview-pull-down-refreshing class added');
        assert.equal($pullDownText.children().eq(2).css('opacity'), 0, 'pullDown refreshing text');
    });

    QUnit.test('onReachBottom', function(assert) {
        assert.expect(1);

        const $scrollView = $($('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'pullDown',
            onReachBottom: function() {
                assert.ok(true, 'onReachBottom action was fired');
            }
        }));

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

        $container.scrollTop($content.height() - $container.height() + $bottomPocket.height() + 1);
        $($container).trigger('scroll');
    });

    QUnit.test('release fires update', function(assert) {
        let updated = 0;

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            onUpdated: function() {
                updated++;
            }
        });
        assert.equal(updated, 1, 'update fired once after creation');
        const clock = sinon.useFakeTimers();
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

        let top = true;
        let left = true;
        let right = false;
        let bottom = false;
        let lastScrollEventArgs;
        const $scrollView = $('#scrollView').width(50).height(50);
        $scrollView.children().width(100).height(100);

        const checkLastScrollEvent = function() {
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

        const scrollView = $scrollView.dxScrollView('instance');
        const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);

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
}, () => {
    QUnit.test('markup', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown'
        });

        const $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);
        assert.equal($pullDown.length, 1, 'pull down container');
    });

    QUnit.test('topPocket visibility depends on onPullDown', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true
        });

        const $topPocket = $scrollView.find('.' + SCROLLVIEW_TOP_POCKET_CLASS);
        assert.ok($topPocket.is(':hidden'), 'topPocket hidden');

        $scrollView.dxScrollView('option', 'onPullDown', noop);
        assert.ok($topPocket.is(':visible'), 'topPocket visible');
    });

    QUnit.test('pull down element start state', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown'
        });

        const $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);
        assert.equal($pullDown.css('opacity'), 0, 'pullDown hide with opacity');
    });

    QUnit.test('pulled down action should be fired when content less than container (T105659)', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onPullDown: function() {
                assert.ok(true, 'pullDown fired');
            }
        });

        $($scrollView.dxScrollView('content')).height(10);
        $scrollView.dxScrollView('update');

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

        pointerMock($container)
            .start()
            .down()
            .move(0, PULLDOWN_HEIGHT / 2)
            .move(0, PULLDOWN_HEIGHT / 2)
            .up();

        this.clock.tick(400);
    });

    QUnit.test('pulled down action should be fired after pointer is up if the \'swipeDown\' strategy is used', function(assert) {
        let isPullDownActionFired = false;
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onPullDown: function() {
                isPullDownActionFired = true;
            }
        });

        $($scrollView.dxScrollView('content')).height(10);
        $scrollView.dxScrollView('update');

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

        const pointer = pointerMock($container)
            .start()
            .down()
            .move(0, PULLDOWN_HEIGHT / 2)
            .move(0, PULLDOWN_HEIGHT / 2);

        assert.ok(!isPullDownActionFired, 'pull down action is not fired');

        pointer.up();
        assert.ok(isPullDownActionFired, 'pull down action is fired after pointer is up');
    });

    QUnit.test('pulled down action should not be fired at the end of scrollview', function(assert) {
        let isPullDownActionFired = false;
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onPullDown: function() {
                isPullDownActionFired = true;
            },
            height: 100
        });

        $($scrollView.dxScrollView('content')).height(1000);
        $scrollView.dxScrollView('update');

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

        pointerMock($container).start().down().move(0, -500).up();
        $scrollView.dxScrollView('scrollTo', { y: 500 });
        $($container).trigger('scroll');
        this.clock.tick(400);

        pointerMock($container).start().down(0, 0).move(0, PULLDOWN_HEIGHT).up();
        assert.ok(!isPullDownActionFired, 'pull down action is not fired');
    });

    QUnit.test('release', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onPullDown: function() {
                scrollView.release();
            }
        });

        var scrollView = $scrollView.dxScrollView('instance');

        const $pullDown = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);
        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

        pointerMock($container)
            .start()
            .down()
            .move(0, PULLDOWN_HEIGHT);

        assert.ok(true, 'scrollView was enabled');
        assert.equal($pullDown.hasClass(SCROLLVIEW_PULLDOWN_LOADING_CLASS), false, 'scrollview-pull-down-loading class removed');
    });

    QUnit.test('onReachBottom', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onReachBottom: function() {
                assert.ok(true, 'onReachBottom action was fired');
            }
        });

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

        $container.scrollTop($content.height() - $container.height() + $bottomPocket.height() + 1);
        $($container).trigger('scroll');
    });

    QUnit.test('onReachBottom action when content size changed', function(assert) {
        let count = 0;
        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown',
            onReachBottom: function() {
                count++;
            }
        });

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);
        const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);
        const $bottomPocket = $scrollView.find('.' + SCROLLVIEW_BOTTOM_POCKET_CLASS);

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

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            onPullDown: noop,
            refreshStrategy: 'swipeDown'
        });

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

        $(document).on('dxpointermove.dxtestns', function(e) {
            if(e.isDefaultPrevented()) {
                assert.ok(true, 'move prevented');
            }
        });

        const pointer = pointerMock($container)
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

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            refreshStrategy: 'swipeDown'
        });

        const $container = $scrollView.find('.' + SCROLLABLE_CONTAINER_CLASS);

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
        let updated = 0;

        const $scrollView = $('#scrollView').dxScrollView({
            useNative: true,
            onUpdated: function() {
                updated++;
            }
        });
        assert.equal(updated, 1, 'update fired once after creation');
        const clock = sinon.useFakeTimers();
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

        let top = true;
        let left = true;
        let right = false;
        let bottom = false;

        const $scrollView = $('#scrollView').width(50).height(50);
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
        const scrollView = $scrollView.dxScrollView('instance');
        const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollView);

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
});

QUnit.module('regressions', moduleConfig, () => {
    QUnit.skip('B251572 - dxScrollView - Scroll position flies away when setting the direction option to horizontal or both', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({});

        $scrollView.dxScrollView('option', 'direction', 'horizontal');
        const location = getScrollOffset($scrollView);
        assert.equal(location.left, 0);
    });

    QUnit.test('B252260 - dxScrollView raise the \'Unknown dxScrollView refresh strategy\' error in a simulator', function(assert) {
        assert.expect(0);
        $('#scrollView').dxScrollView({ useNativeScrolling: true }).dxScrollView('instance');
    });
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
}, () => {
    QUnit.test('refreshStrategy for ios set by real device', function(assert) {
        devices.real({ platform: 'ios' });
        devices.current({ platform: 'android' });

        const scrollView = $('#scrollView').dxScrollView().dxScrollView('instance');
        assert.equal(scrollView.option('refreshStrategy'), 'pullDown');
    });

    QUnit.test('refreshStrategy for android set by real device', function(assert) {
        devices.real({ platform: 'android', version: '4' });
        devices.current({ platform: 'ios' });

        const scrollView = $('#scrollView').dxScrollView().dxScrollView('instance');

        assert.equal(scrollView.option('refreshStrategy'), 'swipeDown');
    });

});

QUnit.module('pullDown, reachBottom events', moduleConfig, () => {
    QUnit.test('topPocket visibility depends on pullDown event', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const $topPocket = $scrollView.find('.' + SCROLLVIEW_PULLDOWN_CLASS);

        $scrollView.dxScrollView('instance').on('pullDown', noop);

        assert.ok($topPocket.is(':visible'), 'topPocket is visible');
    });

    QUnit.test('pullDown event should be fired after refresh method call', function(assert) {
        assert.expect(1);

        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });
        const instance = $scrollView.dxScrollView('instance');

        instance.on('pullDown', () => {
            assert.ok(true, 'pullDown is fired on refresh');
        });

        instance.refresh();
    });

    QUnit.test('bottomPocket element depends on reachBottom event', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        $scrollView.dxScrollView('instance').on('reachBottom', noop);

        const $reachBottom = $scrollView.find('.' + SCROLLVIEW_REACHBOTTOM_CLASS);

        assert.ok($reachBottom.is(':visible'), 'reach bottom is visible');
    });

    QUnit.test('scrollview events support chains', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        $scrollView.dxScrollView('instance').on('reachBottom', noop).on('pullDown', noop);

        assert.ok(true, 'chains is supported');
    });

    QUnit.test('scrollview events support chains', function(assert) {
        const $scrollView = $('#scrollView').dxScrollView({ useNative: false });

        $scrollView.dxScrollView('instance').on('reachBottom', noop).on('pullDown', noop);

        assert.ok(true, 'chains is supported');
    });

    ['config', 'onInitialized'].forEach(assignMethod => {
        QUnit.test('Check pullDown event handler - ' + assignMethod, function(assert) {
            const config = {};
            const pullDownHandler = sinon.stub();

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

            const $content = $scrollView.find(`.${SCROLLABLE_CONTENT_CLASS}`);
            const $topPocket = $scrollView.find(`.${SCROLLVIEW_TOP_POCKET_CLASS}`);
            pointerMock($content)
                .start()
                .down()
                .move(0, $topPocket.height() + 10)
                .up();
            assert.strictEqual(pullDownHandler.callCount, 1, 'pullDownHandler.callCount');
        });

        QUnit.test('Check reachBottom event handler - ' + assignMethod, function(assert) {
            const config = {};
            const reachBottomHandler = sinon.stub();

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

            const $content = $scrollView.find('.' + SCROLLABLE_CONTENT_CLASS);

            pointerMock($content)
                .start()
                .down()
                .move(0, -$content.height() - 10)
                .up();
            assert.strictEqual(reachBottomHandler.callCount, 1, 'reachBottomHandler.callCount');
        });
    });
});

