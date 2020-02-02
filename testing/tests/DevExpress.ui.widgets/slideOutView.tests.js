import $ from 'jquery';
import fx from 'animation/fx';
import translator from 'animation/translator';
import { hideCallback as hideTopOverlayCallback } from 'mobile/hide_top_overlay';
import resizeCallbacks from 'core/utils/resize_callbacks';
import config from 'core/config';
import typeUtils from 'core/utils/type';
import { animation } from 'ui/slide_out_view';
import pointerMock from '../../helpers/pointerMock.js';

import 'common.css!';
import 'ui/slide_out_view';

const SLIDEOUTVIEW_CLASS = 'dx-slideoutview';
const SLIDEOUTVIEW_MENU_CONTENT_CLASS = 'dx-slideoutview-menu-content';
const SLIDEOUTVIEW_CONTENT_CLASS = 'dx-slideoutview-content';
const SLIDEOUTVIEW_SHIELD_CLASS = 'dx-slideoutview-shield';

const position = function($element) {
    return $element.position().left;
};

const mockFxAnimate = function(animations, type, output) {
    animations[type] = function($element, position, duration, endAction) {
        position = position || 0;

        output.push({
            $element: $element,
            type: type,
            start: translator.locate($element).left,
            duration: duration,
            end: position
        });

        translator.move($element, { left: position });

        if(endAction) {
            endAction();
        }
    };
};

const animationCapturing = {
    start: function() {
        this._capturedAnimations = [];
        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, 'moveTo', this._capturedAnimations);

        return this._capturedAnimations;
    },
    teardown: function() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};


QUnit.testStart(function() {
    const markup = '\
    <style>\
        .dx-slideoutview-menu-content {\
                width: 200px;\
        }\
    </style>\
    \
    <div id="slideOutView">\
        Test Content\
    </div>\
    <div id="slideOutViewContainer" style="width: 100px">\
        <div id="slideOutView2"></div>\
    </div>\
        <div id="contentTemplate">\
        <div data-options="dxTemplate: { name: \'customMenu\' }">\
            Test Menu Template\
        </div>\
            <div data-options="dxTemplate: { name: \'customContent\' }">\
            Test Content Template\
        </div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('api', () => {
    QUnit.test('menuContent() function', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});
        const instance = $element.dxSlideOutView('instance');
        const $menu = $element.find('.' + SLIDEOUTVIEW_MENU_CONTENT_CLASS).eq(0);
        assert.equal(typeUtils.isRenderer(instance.menuContent()), !!config().useJQuery, 'menu element');
        assert.equal($menu.get(0), $(instance.menuContent()).get(0), 'menuContent function return correct DOMNode');
    });

    QUnit.test('content() function', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});
        const instance = $element.dxSlideOutView('instance');
        const $content = $element.find('.' + SLIDEOUTVIEW_CONTENT_CLASS).eq(0);

        assert.equal($content.get(0), $(instance.content()).get(0), 'content function return correct DOMNode');
    });

    QUnit.test('showMenu and hideMenu functions', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});
        const instance = $element.dxSlideOutView('instance');

        instance.showMenu();
        assert.equal(instance.option('menuVisible'), true, 'menu was shown');

        instance.hideMenu();
        assert.equal(instance.option('menuVisible'), false, 'menu was hidden');
    });

    QUnit.test('toggleMenuVisibility function', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});
        const instance = $element.dxSlideOutView('instance');
        const menuVisible = instance.option('menuVisible');

        instance.toggleMenuVisibility();
        assert.equal(instance.option('menuVisible'), !menuVisible, 'menu was shown');

        instance.toggleMenuVisibility();
        assert.equal(instance.option('menuVisible'), menuVisible, 'menu was hidden');
    });

    QUnit.test('subscribe on toggleMenuVisibility function should fired at the end of animation', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false
        });

        const instance = $element.dxSlideOutView('instance');
        let count = 0;
        const done = assert.async();

        instance.toggleMenuVisibility().done(function() {
            count++;
            assert.equal(count, 1, 'callback not fired at animation start');
            done();
        });

        assert.equal(count, 0, 'callback not fired at animation start');
    });
});

QUnit.module('navigation', () => {
    QUnit.test('content container should have correct position if menu isn\'t visible', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());

        assert.equal(position($content), 0, 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if menu is visible', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());

        assert.equal(position($content), $menu.width(), 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if menu is lager than element', function(assert) {
        const $element = $('#slideOutView2').dxSlideOutView({
            width: '100%',
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());

        assert.equal(position($content), $element.width() - instance.option('contentOffset'), 'container rendered at correct position');
    });

    QUnit.test('content should not overlap menu', function(assert) {
        const $element = $('#slideOutView2').dxSlideOutView({
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $menu = $(instance.menuContent());

        assert.equal(parseInt($menu.css('max-width')), $element.width() - instance.option('contentOffset'), 'menu isn\'t overlapped by content');

        instance.option('width', 200);
        assert.equal(parseInt($menu.css('max-width')), $element.width() - instance.option('contentOffset'), 'menu isn\'t overlapped by content');
    });

    QUnit.test('content container should have correct position after resize', function(assert) {
        const $element = $('#slideOutView2').dxSlideOutView({
            width: '100%',
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const elementWidth = $element.width();

        $('#slideOutViewContainer').width(elementWidth * 2);
        resizeCallbacks.fire();

        assert.equal(position($content), $(instance.menuContent()).width(), 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if it is rendered in invisible container', function(assert) {
        const $container = $('#slideOutViewContainer');
        const $element = $('#slideOutView2');

        $container.detach();

        const instance = $element.dxSlideOutView({
            width: '100%',
            menuVisible: true
        }).dxSlideOutView('instance');
        const $content = $(instance.content());

        $container.appendTo('#qunit-fixture');
        $element.trigger('dxshown');

        assert.equal(position($content), $element.width() - instance.option('contentOffset'), 'container rendered at correct position');
    });

    QUnit.test('menu should be hidden after back button click', function(assert) {
        const instance = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        }).dxSlideOutView('instance');

        hideTopOverlayCallback.fire();
        assert.equal(instance.option('menuVisible'), false, 'hidden after back button event');
    });

    QUnit.test('handle back button should be removed on dispose', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });

        $element.remove();
        assert.ok(!hideTopOverlayCallback.hasCallback());
    });

    QUnit.test('menu should not handle back button click if it isn\'t visible', function(assert) {
        $('#slideOutView').dxSlideOutView({
            menuVisible: false
        });

        assert.ok(!hideTopOverlayCallback.hasCallback());
    });
});

QUnit.module('interaction via swipe', () => {
    QUnit.test('content container should be moved by swipe', function(assert) {
        fx.off = true;

        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());
        const pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(0.1);
        assert.equal(position($content), $menu.width() / 10, 'container moved');

        pointer.swipeEnd(1).swipe(-0.5);
        assert.equal(position($content), $menu.width() * 0.5, 'container moved');
        fx.off = false;
    });

    QUnit.test('content should be moved by swipe with inverted position', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false,
            menuPosition: 'inverted'
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());
        const pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), -$menu.width() / 10, 'container moved');
    });

    QUnit.test('content container should not be moved out of menu', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});
        const instance = $element.dxSlideOutView('instance');
        const pointer = pointerMock($(instance.content())).start();

        let lastEvent = pointer.swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 0, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 1, 'container will not move out of menu');

        instance.option('menuVisible', true);

        lastEvent = pointer.swipeEnd().swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 1, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 0, 'container will not move out of menu');
    });

    QUnit.test('swipeEnabled option', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            swipeEnabled: false,
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const pointer = pointerMock($content).start();

        const startPosition = position($content);

        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), startPosition, 'position won\'t changed');
    });

    QUnit.test('swipeEnabled option dynamic change', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            swipeEnabled: true,
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const pointer = pointerMock($content).start();

        const startPosition = position($content);

        instance.option('swipeEnabled', false);
        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), startPosition, 'position won\'t changed');
    });
});

QUnit.module('animation', {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach: function() {
        animationCapturing.teardown();
    }
}, () => {
    QUnit.test('showing menu should be animated', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());
        const pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(0.1).swipeEnd(1);

        assert.equal(this.capturedAnimations[0].$element.get(0), $content.get(0), 'content was animated');
        assert.equal(this.capturedAnimations[0].start, $menu.width() / 10, 'correct start position');
        assert.equal(this.capturedAnimations[0].end, $menu.width(), 'correct end position');
    });

    QUnit.test('animation should be stopped after swipe start', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const pointer = pointerMock($content).start();

        animationCapturing.teardown();
        pointer.swipeStart().swipe(0.1).swipeEnd(1).swipeStart();

        assert.ok(!fx.isAnimating($content), 'animation was stopped');
    });

    QUnit.test('hiding menu should be animated', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());
        const pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(-0.5).swipeEnd(-1);

        assert.equal(this.capturedAnimations[0].$element.get(0), $content.get(0), 'content was animated');
        assert.equal(this.capturedAnimations[0].start, $menu.width() * 0.5, 'correct start position');
        assert.equal(this.capturedAnimations[0].end, 0, 'correct end position');
    });
});

QUnit.module('shield', () => {
    QUnit.test('shield should be visible if menu is opened', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });
        const $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        assert.ok($shield.is(':visible'), 'shield is visible');
    });

    QUnit.test('shield should not be visible if menu is closed', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false
        });
        const $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        assert.ok($shield.is(':hidden'), 'shield is visible');
    });

    QUnit.test('click on shield should not close menu', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        $shield.trigger('dxclick');
        assert.ok(!instance.option('menuVisible'), 'menu was closed');
    });

    QUnit.test('shield should be visible during swipe', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);
        const pointer = pointerMock($content).start();

        pointer.swipeStart();
        assert.ok($shield.is(':visible'), 'shield won\'t hidden');
    });

    QUnit.test('shield should be visible during animation', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false
        });
        const instance = $element.dxSlideOutView('instance');
        const $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        instance.showMenu();
        assert.ok($shield.is(':visible'), 'shield is visible during animation');
    });

    QUnit.test('shield should have correct position', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        assert.equal($shield.offset().left, $content.offset().left, 'shield has correct position');
    });

    QUnit.test('shield should have correct position after widget resize', function(assert) {
        const $element = $('#slideOutView2').dxSlideOutView({
            width: '100%',
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);
        const menuWidth = $(instance.menuContent()).width();

        $('#slideOutViewContainer').width(menuWidth * 2);
        resizeCallbacks.fire();

        assert.equal($shield.offset().left, $content.offset().left, 'shield has correct position');
    });
});

QUnit.module('rtl', () => {
    QUnit.test('content should have correct position if menu is visible in rtl mode', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true,
            rtlEnabled: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());

        assert.equal(position($content), -$menu.width(), 'container rendered at correct position');
    });

    QUnit.test('content should be moved by swipe in rtl', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false,
            rtlEnabled: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());
        const pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), -$menu.width() / 10, 'container moved');
    });

    QUnit.test('content should be moved by swipe in rtl with inverted position', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: false,
            rtlEnabled: true,
            menuPosition: 'inverted'
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menu = $(instance.menuContent());
        const pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(0.1);
        assert.equal(position($content), $menu.width() / 10, 'container moved');
    });

    QUnit.test('menu position classes in rtl', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            rtlEnabled: true,
            menuPosition: 'normal'
        });
        const instance = $element.dxSlideOutView('instance');
        const $menu = $(instance.menuContent());

        assert.ok($menu.hasClass(SLIDEOUTVIEW_CLASS + '-right'), 'menu has class for right position');
        assert.notOk($menu.hasClass(SLIDEOUTVIEW_CLASS + '-left'), 'menu has not class for left position');

        instance.option('menuPosition', 'inverted');
        assert.ok($menu.hasClass(SLIDEOUTVIEW_CLASS + '-left'), 'menu has class for left position');
        assert.notOk($menu.hasClass(SLIDEOUTVIEW_CLASS + '-right'), 'menu has not class for right position');
    });

    QUnit.test('content should not be moved out of menu', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            rtlEnabled: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const pointer = pointerMock($content).start();

        let lastEvent = pointer.swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 1, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 0, 'container will not move out of menu');

        instance.option('menuVisible', true);

        lastEvent = pointer.swipeEnd().swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 0, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 1, 'container will not move out of menu');
    });
});

