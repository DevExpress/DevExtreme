import $ from 'jquery';
import animationFrame from 'common/core/animation/frame';
import devices from '__internal/core/m_devices';
import pointerMock from '../../../helpers/pointerMock.js';

import 'generic_light.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_WRAPPER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLBAR_HORIZONTAL_CLASS,
} from './scrollable.constants.js';

import { setWindow, getWindow } from 'core/utils/window';

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

QUnit.module('mouse wheel', moduleConfig);

QUnit.test('mousewheel for vertical direction', function(assert) {
    const distance = 10;

    const $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'vertical',
        inertiaEnabled: false
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, 'scrolled vertically');
});

// T737554
QUnit.test('preventDefault should be called on immediate mousewheel at the end of content', function(assert) {
    const $scrollable = $('#scrollable');
    let lastWheelEventArgs;
    $scrollable.on('dxmousewheel', function(e) {
        lastWheelEventArgs = e;
    });

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'vertical',
        inertiaEnabled: false,
        bounceEnabled: false
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    const pointer = pointerMock($container)
        .start()
        .wheel(-50);

    pointer.wheel(-50);

    assert.equal(scrollable.scrollOffset().top, 50, 'scrolled vertically');
    assert.strictEqual(lastWheelEventArgs.isDefaultPrevented(), true, 'default is prevented for wheel event');
});

// T737554
QUnit.test('preventDefault should not be called on delayed mousewheel at the end of content', function(assert) {
    const $scrollable = $('#scrollable');
    let lastWheelEventArgs;
    $scrollable.on('dxmousewheel', function(e) {
        lastWheelEventArgs = e;
    });

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'vertical',
        inertiaEnabled: false,
        bounceEnabled: false
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    const pointer = pointerMock($container)
        .start()
        .wheel(-50);

    this.clock.tick(500);

    pointer.wheel(-50);

    assert.equal(scrollable.scrollOffset().top, 50, 'scrolled vertically');
    assert.strictEqual(lastWheelEventArgs.isDefaultPrevented(), false, 'default is prevented for wheel event');
});

QUnit.test('mousewheel calls update before validation', function(assert) {
    const distance = 10;

    const $scrollable = $('#scrollable').height(1000);
    $scrollable.children().height(10);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'vertical',
        inertiaEnabled: false,
        bounceEnabled: false
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS).children().height(2000);

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, 'scrollable was scrolled');
});

QUnit.test('mousewheel scrolls correctly when mouse is located over scrollbar', function(assert) {
    const distance = 10;
    const $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'vertical',
        inertiaEnabled: false,
        scrollByThumb: true
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);

    pointerMock($scrollbar)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, 'scrolled vertically');
});

QUnit.test('mousewheel for horizontal direction', function(assert) {
    const distance = 10;
    const $scrollable = $('#scrollable');
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        direction: 'horizontal'
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .wheel(-distance, { shiftKey: true });

    assert.equal(scrollable.scrollOffset().left, distance, 'scrolled horizontally');
});

QUnit.test('mousewheel for both direction scrolls vertical', function(assert) {
    const distance = 10;

    const $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both',
        inertiaEnabled: false,
        scrollByContent: false
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, 'scrolled vertically');
    assert.equal(scrollable.scrollOffset().left, 0, 'horizontal was prevented');
});

QUnit.test('mousewheel default behavior prevented', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnabled: false
    });

    const wheelHandler = function(e) {
        assert.ok(e.isDefaultPrevented(), 'mousewheel is prevented');
    };

    try {
        $(document).on('dxmousewheel', wheelHandler);

        const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
        pointerMock($container)
            .start()
            .wheel(-10);

    } finally {
        $(document).off('dxmousewheel', wheelHandler);
    }
});

QUnit.test('mousewheel does not prevent default behavior when scroll is disabled', function(assert) {
    const $scrollable = $('#scrollable');
    $scrollable.height(100);
    $scrollable.wrapInner('<div>').children().height(50);

    $scrollable.dxScrollable({
        useNative: false,
        disabled: true
    });

    const wheelHandler = function(e) {
        assert.equal(e.isDefaultPrevented(), false, 'mousewheel is not prevented');
    };

    try {
        $(document).on('dxmousewheel', wheelHandler);

        const $container = $('.' + SCROLLABLE_CONTAINER_CLASS, $scrollable);
        pointerMock($container)
            .start()
            .wheel(-10);

    } finally {
        $(document).off('dxmousewheel', wheelHandler);
    }
});

QUnit.test('mousewheel prevented only for event handled by scrollable', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false,
        inertiaEnable: false,
        disabled: true
    });

    const wheelHandler = function(e) {
        assert.equal(e.isDefaultPrevented(), false, 'mousewheel is not prevented');
    };

    try {
        $(document).on('dxmousewheel', wheelHandler);

        const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
        pointerMock($container)
            .start()
            .wheel(-10);

    } finally {
        $(document).off('dxmousewheel', wheelHandler);
    }
});

QUnit.test('mousewheel triggers scroll event on container', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        useNative: false
    });

    let scrollFired = 0;
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    $container.on('scroll', function(e) {
        scrollFired++;
    });

    pointerMock($container)
        .start()
        .down()
        .move(-9, -10);

    assert.equal(scrollFired, 1, 'scroll fired once');
});

QUnit.test('mousewheel scroll parent scrollable when children scroll reach bounce', function(assert) {
    let scrollableCounter = 0;
    let parentScrollableCounter = 0;
    const $scrollable = $('#scrollable').height(50);
    const $parentScrollable = $scrollable.wrap('<div>').parent().height(25);

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            scrollableCounter++;
        }
    });

    $parentScrollable.dxScrollable({
        useNative: false,
        inertiaEnabled: false,
        onScroll: function() {
            parentScrollableCounter++;
        }
    });

    $parentScrollable.dxScrollable('scrollTo', 1);

    const $wrapper = $scrollable.find('.' + SCROLLABLE_WRAPPER_CLASS);

    pointerMock($wrapper).start().wheel(10);

    assert.equal(scrollableCounter, 0, 'scroll was not fire for children scrollable');
    assert.ok(parentScrollableCounter > 0, 'scroll fired for children scrollable');
});

QUnit.test('scrollable prevented when it is stretched', function(assert) {
    let scrollableCounter = 0;
    let innerScrollableCounter = 0;
    const $scrollable = $('#scrollable').height(50);
    const $innerScrollable = $('<div>').height(75).appendTo($scrollable);

    $scrollable.dxScrollable({
        useNative: false,
        bounceEnabled: true,
        inertiaEnabled: false,
        onScroll: function() {
            scrollableCounter++;
        }
    });

    $innerScrollable.dxScrollable({
        useNative: false,
        bounceEnabled: false,
        inertiaEnabled: false,
        onScroll: function() {
            innerScrollableCounter++;
        }
    });

    pointerMock($innerScrollable).start().wheel(-10);

    assert.equal(innerScrollableCounter, 0, 'scroll was not fire for children scrollable');
    assert.ok(scrollableCounter > 0, 'scroll fired for children scrollable');
});

QUnit.test('scroll should work on mousewheel after draging on horizontal bar', function(assert) {
    const distance = 10;

    const $scrollable = $('#scrollable');

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both',
        inertiaEnabled: false,
        scrollByContent: false,
        scrollByThumb: true
    });
    const scrollable = $scrollable.dxScrollable('instance');

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const $scrollbar = $scrollable.find('.' + SCROLLBAR_HORIZONTAL_CLASS + ' .dx-scrollable-scroll');

    pointerMock($scrollbar).start().down().move(-distance).up();

    pointerMock($container)
        .start()
        .wheel(-distance);

    assert.equal(scrollable.scrollOffset().top, distance, 'scrolled vertically');
});

if(devices.current().deviceType === 'desktop') {
    ['vertical', 'horizontal'].forEach((direction) => {
        class ValidateMouseWheelEventTestHelper {
            constructor(direction, useNative) {
                this._direction = direction;
                this._useNative = useNative;
                this._wheelEvent = {
                    type: 'dxmousewheel',
                    pointerType: 'mouse',
                    shiftKey: direction === 'horizontal'
                };

                this.$scrollable = this._getScrollable();

                this.scrollable = this.$scrollable.dxScrollable('instance');
            }

            _getScrollable() {
                return $('#scrollable').dxScrollable({
                    useNative: this._useNative,
                    direction: this._direction,
                    showScrollbar: 'always'
                });
            }

            getEvent() { return this._wheelEvent; }

            triggerWheelEvent(delta) {
                const pointer = pointerMock(this.getScrollableContainer());

                pointer.start();
                pointer.wheel(delta, { shiftKey: this._direction === 'horizontal' });
            }

            getScrollableContainer() {
                return this.$scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`);
            }

            checkScrollOffset(delta, zoom) {
                const expectedOffset = { top: 25, left: 25 };

                if(this._direction === 'vertical') {
                    expectedOffset.top -= delta / zoom;
                    QUnit.assert.roughEqual(this.scrollable.scrollOffset().top, expectedOffset.top, 1, 'scrollOffset.top');
                    QUnit.assert.roughEqual(this.scrollable.scrollOffset().left, 0, 1, 'scrollOffset.left');
                } else {
                    expectedOffset.left -= delta / zoom;
                    QUnit.assert.roughEqual(this.scrollable.scrollOffset().top, 0, 1, 'scrollOffset.top');
                    QUnit.assert.roughEqual(this.scrollable.scrollOffset().left, expectedOffset.left, 1, 'scrollOffset.left');
                }
            }
        }

        QUnit.test(`validate() mousewheel (top, left), direction:${direction}`, function(assert) {
            const helper = new ValidateMouseWheelEventTestHelper(direction, true);
            const event = helper.getEvent();

            event.delta = 1;
            assert.strictEqual(!!helper.scrollable._validate(event), false, 'validate result when event.delta = 1');

            event.delta = -1;
            assert.strictEqual(!!helper.scrollable._validate(event), true, 'validate result when event.delta = -1');
        });

        QUnit.test(`validate() mousewheel (bottom, right), direction:${direction}`, function(assert) {
            const helper = new ValidateMouseWheelEventTestHelper(direction, true);
            const event = helper.getEvent();

            helper.scrollable.scrollTo(50);

            event.delta = 1;
            assert.strictEqual(!!helper.scrollable._validate(event), true, 'validate result when event.delta = 1');

            event.delta = -1;
            assert.strictEqual(!!helper.scrollable._validate(event), false, 'validate result when event.delta = -1');
        });

        QUnit.test(`validate() mousewheel (center, center), direction: ${direction}`, function(assert) {
            const helper = new ValidateMouseWheelEventTestHelper(direction, true);
            const event = helper.getEvent();

            helper.scrollable.scrollTo(25);

            event.delta = 1;
            assert.strictEqual(!!helper.scrollable._validate(event), true, 'validate result when event.delta = 1');

            event.delta = -1;
            assert.strictEqual(!!helper.scrollable._validate(event), true, 'validate result when event.delta = -1');
        });

        [-10, 10].forEach((wheelDelta) => {
            [1, 0.75, 1.5].forEach((browserZoom) => {
                QUnit.test(`WheelDelta -> browser.zoom: ${browserZoom}, direction: ${direction}, wheelDelta: ${wheelDelta}`, function() {
                    const helper = new ValidateMouseWheelEventTestHelper(direction, false);

                    const originalWindow = getWindow();

                    try {
                        helper.scrollable.scrollTo(25);
                        const defaultDevicePixelRatio = getWindow().devicePixelRatio;
                        setWindow({ devicePixelRatio: browserZoom }, true);

                        helper.triggerWheelEvent(wheelDelta);

                        helper.checkScrollOffset(wheelDelta, browserZoom);

                        setWindow({ devicePixelRatio: defaultDevicePixelRatio }, true);
                    } finally {
                        setWindow(originalWindow);
                    }
                });
            });
        });
    });
}
