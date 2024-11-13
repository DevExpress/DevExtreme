import animationFrame from 'common/core/animation/frame';
import 'generic_light.css!';
import { triggerShownEvent } from 'common/core/events/visibility_change';
import $ from 'jquery';
import Scrollable from 'ui/scroll_view/ui.scrollable';
import {
    RTL_CLASS
} from './scrollable.constants.js';


const moduleConfig = {
    beforeEach: function() {
        const markup = `
            <style nonce="qunit-test">
                #scrollable {
                    height: 50px;
                    width: 50px;
                }
                #scrollableVary {
                    height: auto;
                }
                .content1, .content3 {
                    height: 100px; width: 100px;
                }
            </style>
            <div id="scrollable">
                <div class="content1"></div>
                <div class="content2"></div>
            </div>
            <div id="scrollableVary">
                <div class="content3"></div>
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

QUnit.module('rtl', moduleConfig);

QUnit.test('option \'rtl\'', function(assert) {
    const $element = $('#scrollable');
    new Scrollable($element);
    const instance = Scrollable.getInstance($element);

    assert.ok(!$element.hasClass(RTL_CLASS));

    instance.option('rtlEnabled', true);
    assert.ok($element.hasClass(RTL_CLASS));
});

QUnit.test('rtlEnabled scrolls to very right position', function(assert) {
    const $scrollable = $('#scrollable').dxScrollable({
        direction: 'horizontal',
        rtlEnabled: true,
        useNative: false
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const veryRightPosition = $(scrollable.content()).width() - $scrollable.width();

    assert.equal(scrollable.scrollLeft(), veryRightPosition, 'scrolled to very right position');
});

QUnit.test('rtlEnabled scrolls to very right position after changing the size of the scrollable (T544872)', function(assert) {
    const $scrollable = $('#scrollableVary').dxScrollable({
        direction: 'horizontal',
        rtlEnabled: true,
        width: 50,
        height: 50,
        useNative: false
    });

    const scrollable = $scrollable.dxScrollable('instance');
    const veryRightPosition = $(scrollable.content()).width() - $scrollable.width();

    assert.equal(scrollable.scrollLeft(), veryRightPosition, 'scrolled to very right position');
});

QUnit.test('rtlEnabled scrolls to very right position after shown event', function(assert) {
    const $scrollable = $('#scrollable');
    const $wrapper = $scrollable.wrap('<div>').parent().hide();

    $scrollable.dxScrollable({
        direction: 'horizontal',
        rtlEnabled: true,
        useNative: false
    });

    $wrapper.show();
    triggerShownEvent($wrapper);

    const scrollable = $scrollable.dxScrollable('instance');
    const veryRightPosition = $(scrollable.content()).width() - $scrollable.width();

    assert.equal(scrollable.scrollLeft(), veryRightPosition, 'scrolled to very right position');
});

QUnit.test('init option \'rtl\' is true', function(assert) {
    const $element = $('#scrollable').dxScrollable({ rtlEnabled: true });
    const instance = $element.dxScrollable('instance');

    assert.ok($element.hasClass(RTL_CLASS));

    instance.option('rtlEnabled', false);
    assert.ok(!$element.hasClass(RTL_CLASS));
});

QUnit.test('rtlEnabled scrolls to very right position when a width was changing via API', function(assert) {
    const $scrollable = $('#scrollable')
        .dxScrollable({
            direction: 'horizontal',
            rtlEnabled: true,
            useNative: true
        });

    const scrollable = $scrollable.dxScrollable('instance');
    scrollable.option('width', 50);

    const veryRightPosition = $(scrollable.content()).width() - $scrollable.width();
    assert.equal(scrollable.scrollLeft(), veryRightPosition, 'scrolled to very right position');
});
