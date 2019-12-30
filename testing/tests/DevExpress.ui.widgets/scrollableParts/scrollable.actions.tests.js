import $ from 'jquery';
import { noop } from 'core/utils/common';
import translator from 'animation/translator';
import animationFrame from 'animation/frame';
import pointerMock from '../../../helpers/pointerMock.js';

import 'common.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_WRAPPER_CLASS,
    SCROLLABLE_CONTENT_CLASS
} from './scrollable.constants.js';

const moduleConfig = {
    beforeEach: function() {
        const markup = '\
            <div id="scrollable" style="height: 50px; width: 50px;">\
                <div class="content1" style="height: 100px; width: 100px;"></div>\
                <div class="content2"></div>\
            </div>\
            <div id="scrollableNeighbour"></div>';
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
    const $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS);
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const location = translator.locate($content);

    return {
        top: location.top - $container.scrollTop(),
        left: location.left - $container.scrollLeft()
    };
};

QUnit.module('actions', moduleConfig);

QUnit.test('start action not fired after creation', function(assert) {
    let started = 0;

    $('#scrollable').dxScrollable({
        useNative: false,
        onStart: function() {
            started++;
        }
    });

    assert.equal(started, 0, 'scroll was not started');
});

QUnit.test('start action fired once after several moves', function(assert) {
    let started = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onStart: function() {
            started++;
        }
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, 1)
        .move(0, 1)
        .up();

    assert.equal(started, 1, 'scroll started once');
});

QUnit.test('scroll action fired on every move', function(assert) {
    let scrolled = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        },
        inertiaEnabled: false
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .move(0, -1)
        .move(0, -1)
        .up();

    assert.equal(scrolled, 3, 'scroll action fired three times');
});

QUnit.test('scroll action fired on every content move during inertia', function(assert) {
    let scrolled = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        }
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .wait(10)
        .move(0, -1)
        .up();

    assert.ok(scrolled > 1, 'scroll action fired during inertia');
});

QUnit.test('scroll action does not fire when location was not changed', function(assert) {
    let scrolled = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        bounceEnabled: false,
        onScroll: function() {
            scrolled++;
        },
        inertiaEnabled: false
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, 1)
        .move(0, 0)
        .up();

    assert.equal(scrolled, 0, 'scroll was not fired');
});

QUnit.test('end action fired on scroll end', function(assert) {
    let end = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onEnd: function() {
            end++;
        }
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up();

    assert.equal(end, 1, 'end action fired once');
});

QUnit.test('end action isn\'t fired without move', function(assert) {
    let end = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onEnd: function() {
            end++;
        }
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .up();

    assert.equal(end, 0, 'end action wasn\'t fired');
});

QUnit.test('set actions by option', function(assert) {
    let start = 0;
    let scroll = 0;
    let end = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });
    const instance = $scrollable.dxScrollable('instance');

    instance.option('onStart', function(assert) { start++; });
    instance.option('onScroll', function(assert) { scroll++; });
    instance.option('onEnd', function(assert) { end++; });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up();

    assert.equal(start, 1, 'start action fired');
    assert.equal(scroll, 1, 'scroll action fired');
    assert.equal(end, 1, 'end action fired');
});

QUnit.test('start not fired if event outside the scrollable', function(assert) {
    let started = 0;
    let scrolled = 0;
    let ended = 0;

    $('#scrollable').dxScrollable({
        useNative: false,
        onStart: function() {
            started++;
        },
        onScroll: function() {
            scrolled++;
        },
        onEnd: function() {
            ended++;
        }
    });

    pointerMock($('#scrollableNeighbour'))
        .start()
        .down()
        .move(0, -1)
        .up();

    assert.equal(started, 0, 'start action not fired');
    assert.equal(scrolled, 0, 'scroll action not fired');
    assert.equal(ended, 0, 'end action not fired');
});

QUnit.test('scroll not fired without start', function(assert) {
    let scrolled = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        },
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .move(0, -1);

    assert.equal(scrolled, 0, 'scroll action not fired');
});

QUnit.test('scroll not fired when start on another element', function(assert) {
    let scrolled = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onScroll: function() {
            scrolled++;
        },
    });

    pointerMock($('#scrollableNeighbour'))
        .start()
        .down();

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .move(0, -1);

    assert.equal(scrolled, 0, 'scroll action not fired');
});

QUnit.test('scroll isn\'t fired when moving after finish of previous scrolling', function(assert) {
    let scrolled = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function() {
            scrolled++;
        },
    });

    pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS))
        .start()
        .down()
        .move(0, -1)
        .up()
        .start()
        .move(0, -1);

    assert.equal(scrolled, 1, 'scroll action not fired');
});

QUnit.test('scroll action fired during native scroll', function(assert) {
    let scrolled = 0;

    const $scrollable = $('#scrollable').dxScrollable({
        inertiaEnabled: false,
        useNative: true,
        onScroll: function() {
            scrolled++;
        },
    });

    $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS).trigger('scroll');

    assert.equal(scrolled, 1, 'scroll action fired');
});

QUnit.test('changing action option does not cause render', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });

    const $content = $scrollable.find('.' + SCROLLABLE_WRAPPER_CLASS);
    const mouse = pointerMock($content).start();

    mouse
        .down()
        .move(0, -10);

    const testAction = function(actionName) {
        $scrollable.dxScrollable('option', actionName, noop);
        const location = getScrollOffset($scrollable);
        assert.equal(location.top, -10, actionName + ' case scrollable rerendered');
    };

    testAction('onStop');
    testAction('onStart');
    testAction('onEnd');

    testAction('onScroll');
    testAction('onBounce');
    testAction('onUpdated');
});

QUnit.test('onStop action is called on `scrollable` stop (T818446)', function(assert) {
    assert.expect(1);

    animationFrame.requestAnimationFrame = function(callback) {
        setTimeout(callback, 0);
    };

    let stopCalled = false;
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        onStop: function(e) {
            stopCalled = true;
            assert.ok(stopCalled, 'onStop is called');
        }
    });

    const mouse = pointerMock($scrollable.find('.' + SCROLLABLE_CONTENT_CLASS)).start();

    mouse
        .down()
        .wait(10)
        .move(0, -10)
        .up();

    mouse
        .down()
        .up();

    this.clock.tick();
});
