import $ from 'jquery';
import { getTranslateValues } from '__internal/ui/scroll_view/utils/get_translate_values';
import animationFrame from 'common/core/animation/frame';
import resizeCallbacks from 'core/utils/resize_callbacks';
import pointerMock from '../../../helpers/pointerMock.js';

import 'generic_light.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    calculateInertiaDistance
} from './scrollable.constants.js';
import Scrollable from 'ui/scroll_view/ui.scrollable';

const INERTIA_TIMEOUT = 100;

const GESTURE_LOCK_KEY = 'dxGestureLock';
const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

const moduleConfig = {
    beforeEach: function() {
        const markup = `
            <style nonce="qunit-test">
                #scrollable {
                    height: 50px;
                    width: 50px;
                }
                #scrollable .content1 {
                    height: 100px;
                    width: 100px;
                }
            </style>
            <div id="scrollable">
                <div class="content1"></div>
                <div class="content2"></div>
            </div>`;
        $('#qunit-fixture').html(markup);

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

const getScrollOffset = function($scrollable) {
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const location = getTranslateValues($content.get(0));

    return {
        top: location.top - $container.scrollTop(),
        left: location.left - $container.scrollLeft()
    };
};

QUnit.module('dynamic', moduleConfig);

QUnit.test('moving scrollable moves content', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });

    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();
    let location;
    const distance = -10;

    mouse.down().move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, distance, 'scroll follows pointer');

    mouse.move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, 2 * distance, 'scroll follows pointer everytime');

    mouse.up();
});

QUnit.test('inertia', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            location = getScrollOffset($scrollable);
            assert.ok(location.top < distance, 'was inertia');
        }
    });
    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();
    let location;
    const distance = -10;

    mouse
        .down()
        .wait(10)
        .move(0, distance)
        .up();
});

QUnit.test('inertia calc distance', function(assert) {
    assert.expect(1);

    const contentHeight = 9000;
    const moveDistance = -10;
    const moveDuration = 10;
    const inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration);
    const distance = moveDistance + inertiaDistance;
    const $scrollable = $('#scrollable');

    $scrollable.find('.content1').height(contentHeight);
    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.top), Math.round(distance), 'distance was calculated correctly');
        }
    });

    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();

});

QUnit.test('no inertia when gesture end is deferred', function(assert) {
    assert.expect(1);

    const scrollableHeight = 50;
    const $scrollable = $('#scrollable');

    $scrollable.height(scrollableHeight);
    $scrollable.find('.content1').height(2 * scrollableHeight);
    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            assert.equal(Math.round(location.top), Math.round(moveDistance), 'no inertia');
        }
    });

    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const mouse = pointerMock($content);
    const moveDistance = -10;
    const moveDuration = 10;

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .wait(INERTIA_TIMEOUT + 1)
        .up();
});

QUnit.test('gesture prevent when scrollable is full and bounce enabled false', function(assert) {
    const $scrollable = $('#scrollable')
        .height(1000);

    $scrollable.wrapInner('<div>')
        .children()
        .height(10);
    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,
        direction: 'vertical'
    });

    pointerMock($scrollable).start().down().move(0, -10);
    assert.ok(!$scrollable.data(GESTURE_LOCK_KEY), 'gesture was prevented');
});

QUnit.test('stop inertia on click', function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    const moveDistance = -10;
    const moveDuration = 10;
    const inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration);
    const distance = moveDistance + inertiaDistance;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
    });
    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();

    mouse
        .down()
        .up();

    this.clock.tick(10);

    const location = getScrollOffset($scrollable);
    assert.notEqual(Math.round(location.top), Math.round(distance), 'scroll was stopped');
});

QUnit.test('scrollbar is hidden on stop', function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    const $scrollable = $('#scrollable').dxScrollable({
        showScrollbar: 'onScroll',
        useNative: false,
    });
    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(10)
        .move(0, -10)
        .up();

    this.clock.tick(100);

    const $scroll = $scrollable.find('.dx-scrollable-scroll');
    assert.ok($scroll.hasClass('dx-state-invisible'), 'scroll was hidden');
});

QUnit.test('bounce top', function(assert) {
    assert.expect(1);

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            assert.equal(location.top, 0, 'content bounced back');
        }
    });
    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(10)
        .move(0, 10)
        .up();
});

QUnit.test('bounce bottom', function(assert) {
    assert.expect(1);

    const scrollableHeight = 50;
    const $scrollable = $('#scrollable');

    $scrollable.height(scrollableHeight);
    $scrollable.find('.content1').height(2 * scrollableHeight);
    $scrollable.dxScrollable({
        useNative: false,
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            const height = $scrollable.height() - $content.height();

            assert.equal(location.top, height, 'content bounced back');
        },
        inertiaEnabled: false
    });

    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .move(0, -scrollableHeight - 10)
        .up();
});

QUnit.test('bounce up', function(assert) {
    const done = assert.async();
    assert.expect(1);

    let scroll = 0;

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            assert.ok(scroll > 1, 'Scroll action fired on bounced');
            done();
        },
        onScroll: function() {
            scroll++;
        },
        inertiaEnabled: false
    });
    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, 100)
        .up();

    this.clock.tick(100);
});

QUnit.test('stop bounce on click', function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    const moveDistance = -10;
    const moveDuration = 10;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            assert.ok(isRenovatedScrollable ? true : false, 'shouldn\'t fire end action');
        }
    });
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up()
        .down();

    this.clock.tick(10);

    const location = getScrollOffset($scrollable);
    assert.notEqual(location.top, 0, 'bounced stopped');
});

QUnit.test('stop inertia bounce on after mouse up', function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    const moveDistance = -10;
    const moveDuration = 10;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            assert.ok(isRenovatedScrollable ? true : false, 'scroll complete shouldn`t be fired');
        }
    });
    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();

    mouse
        .down();

    this.clock.tick(10);

    const location = getScrollOffset($scrollable);
    assert.notEqual(location.top, 0, 'bounced stopped');
});

QUnit.test('bounce elastic', function(assert) {
    assert.expect(2);

    const moveDistance = 10;
    let wasFirstMove = false;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function() {
            if(wasFirstMove) {
                const location = getScrollOffset($scrollable);
                assert.ok(location.top > 0, 'bounced exists');
                assert.ok(location.top < 2 * moveDistance, 'bounced elastic');
            } else {
                wasFirstMove = true;
            }
        }
    });
    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, moveDistance)
        .move(0, moveDistance);
});

QUnit.test('inertia calc distance out of bounds', function(assert) {
    assert.expect(1);

    const moveDistance = 10;
    const moveDuration = 10;
    const inertiaDistance = calculateInertiaDistance(moveDistance, moveDuration);
    const distance = (-1.5 * moveDistance) + (0.1 * moveDistance) + moveDistance + inertiaDistance;
    const $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,

        onBounce: function() {
            const location = getScrollOffset($scrollable);
            assert.ok(Math.round(location.top) < Math.round(distance), 'distance was calculated wrong');
        },

        onEnd: function() {
        }
    });

    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, -1.5 * moveDistance)
        .wait(300)
        .move(0, 0.1 * moveDistance)
        .wait(moveDuration)
        .move(0, moveDistance)
        .up();
});

QUnit.test('bounce is disabled', function(assert) {
    assert.expect(1);

    const moveDistance = 100;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        bounceEnabled: false,
        inertiaEnabled: false,
        onBounce: function() {
            assert.ok(false, 'bounce action was not fired');
        }
    });

    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, moveDistance);

    const location = getScrollOffset($scrollable);
    assert.equal(location.top, 0, 'content is not moving');
});

QUnit.test('inertia stopped on the bound when bounce is disabled', function(assert) {
    const done = assert.async();
    assert.expect(1);

    const moveDistance = 10;
    const $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,
        onBounce: function() {
            assert.ok(false, 'bounce action was not fired');
        },
        onEnd: function() {
            const location = getScrollOffset($scrollable);
            assert.equal(location.top, 0, 'content stopped on the bound');
            done();
        }
    });

    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .move(0, -1.5 * moveDistance)
        .wait(300)
        .move(0, 0.1 * moveDistance)
        .wait(10)
        .move(0, moveDistance)
        .up();

    this.clock.tick(10);
});

QUnit.test('inertia is stopped when bound is reached', function(assert) {
    const moveDistance = 10;
    let lastLocation = (-1.5 * moveDistance) + (0.1 * moveDistance) + moveDistance;
    const $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,

        onScroll: function() {
            const location = getScrollOffset($scrollable);
            assert.notEqual(location.top, lastLocation || -1, 'content position is changed on each scroll step');
            lastLocation = location.top;
        }
    });

    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const mouse = pointerMock($content);

    mouse
        .start()
        .down()
        .move(0, -1.5 * moveDistance)
        .wait(200)
        .move(0, 0.1 * moveDistance)
        .wait(10)
        .move(0, moveDistance)
        .up();
});

QUnit.test('velocity calculated correctly when content height less than container height', function(assert) {
    const moveDistance = 10;
    const $scrollable = $('#scrollable').height(500);

    $scrollable.dxScrollable({
        useNative: false,
        onScroll: function() {
            const location = getScrollOffset($scrollable);
            assert.ok(location.top >= 0, 'content location calculated right');
        }
    });

    const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);
    const mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, moveDistance)
        .up();
});

[true, false].forEach((useNative) => {
    QUnit.test(`window resize should call update, useNative: ${useNative}`, function(assert) {
        const $scrollable = $('#scrollable');

        const updateHandler = sinon.spy();

        $scrollable.dxScrollable({
            useNative: true,
            onUpdated: updateHandler
        });

        updateHandler.resetHistory();

        resizeCallbacks.fire();

        assert.equal(updateHandler.callCount, 1, 'onUpdate handler was fired once');
    });


    QUnit.test(`scrollable should have correct scrollPosition when content is not cropped by overflow hidden, useNative: ${useNative}`, function(assert) {
        const $scrollable = $('#scrollable').height(50).width(50);

        $scrollable.dxScrollable({
            useNative,
            direction: 'both',
            scrollByContent: true,
            useSimulatedScrollbar: true
        });

        const $content = $scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`);

        $content.children().eq(0).css({
            width: '100px',
            height: '100px'
        });
        $content.children().eq(1).css({
            width: '300px',
            height: '300px',
            position: 'absolute',
            top: 0,
            left: 0
        });

        $content.css({
            height: '100px',
            width: '100px'
        });

        $scrollable.dxScrollable('instance').scrollTo({ top: 250, left: 250 });
        $scrollable.dxScrollable('instance').update();
        $scrollable.dxScrollable('instance').scrollTo({ top: 250, left: 250 });

        assert.equal($scrollable.dxScrollable('instance').scrollTop(), 250);
        assert.equal($scrollable.dxScrollable('instance').scrollLeft(), 250);
    });

    QUnit.test(`scrollable should have correct scrollPosition when content is cropped by overflow hidden, useNative: ${useNative}`, function(assert) {
        const $scrollable = $('#scrollable').height(50).width(50);

        const scrollable = $scrollable.dxScrollable({
            useNative,
            direction: 'both',
            scrollByContent: true,
            useSimulatedScrollbar: true
        }).dxScrollable('instance');

        const $content = $(scrollable.content());

        $content.children().eq(0).css({
            width: '100px',
            height: '100px'
        });
        $content.children().eq(1).css({
            width: '300px',
            height: '300px',
            position: 'absolute',
            top: 0,
            left: 0
        });

        $content.css({
            height: '100px',
            width: '100px',
            overflow: 'hidden'
        });

        $scrollable.dxScrollable('instance').scrollTo({ top: 250, left: 250 });
        $scrollable.dxScrollable('instance').update();
        $scrollable.dxScrollable('instance').scrollTo({ top: 250, left: 250 });

        assert.equal($scrollable.dxScrollable('instance').scrollTop(), 50);
        assert.equal($scrollable.dxScrollable('instance').scrollLeft(), 50);
    });
});

QUnit.test('scrollable prevents anchor events', function(assert) {
    const $input = $('<input>').css('height', '40px');
    const scrollable = $('#scrollable')
        .append($input)
        .dxScrollable({
            useNative: false
        })
        .dxScrollable('instance');

    $input
        .focus()
        .css('height', 'auto');
    const scrollPosition = scrollable.scrollTop();

    $input
        .parent()
        .append($('<input>'));

    assert.strictEqual(scrollable.scrollTop(), scrollPosition, 'Scrollable save content position');
});
