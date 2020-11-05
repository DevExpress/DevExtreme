import $ from 'jquery';
import devices from 'core/devices';
import pointerMock from '../../../helpers/pointerMock.js';
import keyboardMock from '../../../helpers/keyboardMock.js';
import translator from 'animation/translator';

import 'common.css!';
import 'generic_light.css!';

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_SCROLL_CLASS,
} from './scrollable.constants.js';

const SCROLL_LINE_HEIGHT = 40;

QUnit.module('keyboard support', {
    beforeEach: function() {
        const markup = '\
            <div id="scrollable" style="height: 50px; width: 50px;">\
                <div class="content1" style="height: 100px; width: 100px;"></div>\
                <div class="content2"></div>\
            </div>\
            <div id="scrollable_container">\
                <div style="width: 400px">\
                    <div id="content_container_1" tabindex="1" style="height: 200px; width: 198px;"></div>\
                    <div id="content_container_2" tabindex="2" style="height: 200px; width: 198px;"></div>\
                </div>\
            </div>';
        $('#qunit-fixture').html(markup);
    }
});

QUnit.test('support arrow keys', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'mobile device does not support tabindex on div element');
        return;
    }

    const $scrollable = $('#scrollable');
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both'
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const keyboard = keyboardMock($container);

    $container.focus();

    keyboard.keyDown('down');
    assert.equal(scrollable.scrollOffset().top, SCROLL_LINE_HEIGHT, 'down key moves to one line down');

    keyboard.keyDown('up');
    assert.equal(scrollable.scrollOffset().top, 0, 'up key moves to one line up');

    keyboard.keyDown('right');
    assert.equal(scrollable.scrollOffset().left, SCROLL_LINE_HEIGHT, 'right key moves to one column right');

    keyboard.keyDown('left');
    assert.equal(scrollable.scrollOffset().left, 0, 'left key moves to one column down');
});

QUnit.test('support pageup and pagedown', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'mobile device does not support tabindex on div element');
        return;
    }

    const $scrollable = $('#scrollable');
    const containerHeight = 100;

    $scrollable.height(containerHeight);
    $scrollable.children().height(1000);

    $scrollable.dxScrollable({
        useNative: false
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const keyboard = keyboardMock($container);

    $container.focus();

    keyboard.keyDown('pagedown');
    keyboard.keyDown('pagedown');
    assert.equal(scrollable.scrollOffset().top, 2 * containerHeight, 'page down key moves to one page down');

    keyboard.keyDown('pageup');
    assert.equal(scrollable.scrollOffset().top, containerHeight, 'page up key moves to one page up');
});

QUnit.test('support end and home', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'mobile device does not support tabindex on div element');
        return;
    }

    const $scrollable = $('#scrollable');
    const containerHeight = 100;
    const contentHeight = 1000;

    $scrollable.height(containerHeight).wrapInner('<div>').children().height(contentHeight);

    $scrollable.dxScrollable({
        useNative: false
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const keyboard = keyboardMock($container);

    $container.focus();

    keyboard.keyDown('end');
    assert.roughEqual(scrollable.scrollOffset().top, contentHeight - containerHeight, 1, 'end key moves to the bottom');

    keyboard.keyDown('home');
    assert.equal(scrollable.scrollOffset().top, 0, 'home key moves to the top');
});

QUnit.test('supportKeyboard option', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'mobile device does not support tabindex on div element');
        return;
    }

    const $scrollable = $('#scrollable');
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both',
        useKeyboard: false
    });

    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);

    assert.equal($container.attr('tabindex'), null, 'scrollable has not tabindex after focus');

});

QUnit.test('supportKeyboard option after render', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'mobile device does not support tabindex on div element');
        return;
    }

    const $scrollable = $('#scrollable');
    $scrollable.width(100);
    $scrollable.children().width(200);

    $scrollable.dxScrollable({
        useNative: false,
        direction: 'both',
        useKeyboard: true
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const keyboard = keyboardMock($container);

    $container.focus();

    scrollable.option('useKeyboard', false);
    keyboard.keyDown('down');
    assert.equal(scrollable.scrollOffset().top, 0, 'down key does not move to one line down after option change');

    scrollable.option('useKeyboard', true);
    keyboard.keyDown('down');
    assert.equal(scrollable.scrollOffset().top, SCROLL_LINE_HEIGHT, 'right key moves to one column down after option change');
});

QUnit.test('arrow keys does not trigger when it not need', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'mobile device does not support tabindex on div element');
        return;
    }

    const $scrollable = $('#scrollable');
    $scrollable.height(100);
    $scrollable.wrapInner('<div>');
    $scrollable.children().height(50);

    $scrollable.dxScrollable({
        useNative: false,
        useKeyboard: true,
        bounceEnabled: false
    });

    let count = 0;

    $scrollable.on('scroll', function(assert) {
        count++;
    });
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    keyboardMock($container).keyDown('down');

    $container.focus();

    assert.equal(count, 0, 'down key moves to one line down');
});

QUnit.test('arrows work correctly after scroll by scrollbar', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'mobile device does not support tabindex on div element');
        return;
    }

    const $scrollable = $('#scrollable');
    $scrollable.height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        useNative: false,
        useKeyboard: true,
        bounceEnabled: false,
        scrollByThumb: true,
        useSimulatedScrollbar: true
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS);
    const keyboard = keyboardMock($container);
    const $scrollbar = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
    const pointer = pointerMock($scrollbar).start();

    $container.focus();

    pointer
        .down()
        .move(0, 10)
        .up();

    const scrollLocation = scrollable.scrollOffset().top;

    keyboard.keyDown('down');
    assert.equal(scrollable.scrollOffset().top, SCROLL_LINE_HEIGHT + scrollLocation);
});

QUnit.testInActiveWindow('arrows was not handled when focus on input element', function(assert) {
    const $scrollable = $('#scrollable');
    const $input = $('<input type=\'text\' />').appendTo($scrollable);

    $scrollable.dxScrollable({
        useNative: false,
        useKeyboard: true
    });

    $input.focus();

    try {
        $(document).on('keydown.test', function(e) {
            assert.equal(e.isDefaultPrevented(), false, 'event was not prevented');
        });

        const keyboard = keyboardMock($input);
        keyboard.keyDown('down');
    } finally {
        $(document).off('keydown.test');
    }
});


if(devices.real().deviceType === 'desktop') {
    [true, false].forEach((useNativeMode) => {
        ['vertical', 'horizontal'].forEach((scrollbarDirection) => {
            function checkScrollLocation($scrollable, expectedLocation) {
                const $scroll = $scrollable.find('.' + SCROLLABLE_SCROLL_CLASS);
                const scrollLocation = translator.locate($scroll);
                QUnit.assert.deepEqual(scrollLocation, expectedLocation, 'scroll location');
            }

            QUnit.testInActiveWindow(`Update vertical scroll location on tab: useNative - ${useNativeMode}, direction: ${scrollbarDirection}`, function(assert) {
                if(devices.real().deviceType !== 'desktop') {
                    assert.ok(true, 'mobile device does not support tabindex on div element');
                    return;
                }

                const done = assert.async();

                const scrollableContainerSize = 200;
                const $scrollable = $('#scrollable_container').dxScrollable({
                    height: scrollableContainerSize,
                    width: scrollableContainerSize,
                    useNative: useNativeMode,
                    direction: scrollbarDirection,
                    showScrollbar: 'always',
                    useSimulatedScrollbar: true
                });

                const $contentContainer1 = $scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS} #content_container_1`);
                const $contentContainer2 = $scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS} #content_container_2`);

                if(scrollbarDirection === 'horizontal') {
                    $contentContainer1.css('display', 'inline-block');
                    $contentContainer2.css('display', 'inline-block');
                }

                return new Promise(function(resolve) {
                    $scrollable.dxScrollable('option', 'onScroll', function() {
                        setTimeout(() => {
                            checkScrollLocation($scrollable, scrollbarDirection === 'vertical' ? { top: 100, left: 0 } : { top: 0, left: 100 });
                            done();
                        });
                        resolve();
                    });

                    checkScrollLocation($scrollable, { top: 0, left: 0 });

                    const keyboard = keyboardMock($contentContainer1);
                    $contentContainer2.focus();
                    keyboard.keyDown('tab');
                });
            });
        });
    });

    [1, 1.5, 0.25].forEach((browserZoom) => {
        ['up', 'down', 'left', 'right'].forEach((key) => {
            QUnit.testInActiveWindow(`Offset after press "${key}" key with browser zoom - ${browserZoom * 100}%: useNative - ${false}, direction: "both"`, function(assert) {
                const $scrollable = $('#scrollable');
                $scrollable.children().width(1000);
                $scrollable.children().height(1000);

                $scrollable.dxScrollable({
                    height: 400,
                    width: 400,
                    useNative: false,
                    direction: 'both',
                    showScrollbar: 'always'
                });

                const scrollable = $scrollable.dxScrollable('instance');
                const $container = $scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`);

                scrollable.scrollTo({ top: 200, left: 200 });

                $container.focus();
                $container.attr('tabIndex', 1);

                scrollable._strategy._tryGetDevicePixelRatio = () => browserZoom;

                keyboardMock($container).keyDown(key);

                const expectedOffset = { top: 200, left: 200 };
                const delta = SCROLL_LINE_HEIGHT / browserZoom;

                if(key === 'down') {
                    expectedOffset.top += delta;
                }
                if(key === 'up') {
                    expectedOffset.top -= delta;
                }
                if(key === 'left') {
                    expectedOffset.left -= delta;
                }
                if(key === 'right') {
                    expectedOffset.left += delta;
                }

                assert.roughEqual(scrollable.scrollOffset().top, expectedOffset.top, 0.01, 'scrollOffset.top');
                assert.roughEqual(scrollable.scrollOffset().left, expectedOffset.left, 0.01, 'scrollOffset.left');
            });
        });
    });
}

