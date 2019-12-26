var $ = require('jquery'),
    fx = require('animation/fx'),
    translator = require('animation/translator'),
    hideTopOverlayCallback = require('mobile/hide_top_overlay').hideCallback,
    resizeCallbacks = require('core/utils/resize_callbacks'),
    config = require('core/config'),
    typeUtils = require('core/utils/type'),
    animation = require('ui/slide_out_view').animation,
    pointerMock = require('../../helpers/pointerMock.js');

require('common.css!');
require('ui/slide_out_view');

var SLIDEOUTVIEW_CLASS = 'dx-slideoutview',
    SLIDEOUTVIEW_MENU_CONTENT_CLASS = 'dx-slideoutview-menu-content',
    SLIDEOUTVIEW_CONTENT_CLASS = 'dx-slideoutview-content',
    SLIDEOUTVIEW_SHIELD_CLASS = 'dx-slideoutview-shield';

var position = function($element) {
    return $element.position().left;
};

var mockFxAnimate = function(animations, type, output) {
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

var animationCapturing = {
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
    var markup = '\
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
        var $element = $('#slideOutView').dxSlideOutView({}),
            instance = $element.dxSlideOutView('instance'),
            $menu = $element.find('.' + SLIDEOUTVIEW_MENU_CONTENT_CLASS).eq(0);
        assert.equal(typeUtils.isRenderer(instance.menuContent()), !!config().useJQuery, 'menu element');
        assert.equal($menu.get(0), $(instance.menuContent()).get(0), 'menuContent function return correct DOMNode');
    });

    QUnit.test('content() function', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({}),
            instance = $element.dxSlideOutView('instance'),
            $content = $element.find('.' + SLIDEOUTVIEW_CONTENT_CLASS).eq(0);

        assert.equal($content.get(0), $(instance.content()).get(0), 'content function return correct DOMNode');
    });

    QUnit.test('showMenu and hideMenu functions', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({}),
            instance = $element.dxSlideOutView('instance');

        instance.showMenu();
        assert.equal(instance.option('menuVisible'), true, 'menu was shown');

        instance.hideMenu();
        assert.equal(instance.option('menuVisible'), false, 'menu was hidden');
    });

    QUnit.test('toggleMenuVisibility function', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({}),
            instance = $element.dxSlideOutView('instance'),
            menuVisible = instance.option('menuVisible');

        instance.toggleMenuVisibility();
        assert.equal(instance.option('menuVisible'), !menuVisible, 'menu was shown');

        instance.toggleMenuVisibility();
        assert.equal(instance.option('menuVisible'), menuVisible, 'menu was hidden');
    });

    QUnit.test('subscribe on toggleMenuVisibility function should fired at the end of animation', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false
            }),
            instance = $element.dxSlideOutView('instance'),
            count = 0,
            done = assert.async();

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
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content());

        assert.equal(position($content), 0, 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if menu is visible', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent());

        assert.equal(position($content), $menu.width(), 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if menu is lager than element', function(assert) {
        var $element = $('#slideOutView2').dxSlideOutView({
                width: '100%',
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content());

        assert.equal(position($content), $element.width() - instance.option('contentOffset'), 'container rendered at correct position');
    });

    QUnit.test('content should not overlap menu', function(assert) {
        var $element = $('#slideOutView2').dxSlideOutView({
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $menu = $(instance.menuContent());

        assert.equal(parseInt($menu.css('max-width')), $element.width() - instance.option('contentOffset'), 'menu isn\'t overlapped by content');

        instance.option('width', 200);
        assert.equal(parseInt($menu.css('max-width')), $element.width() - instance.option('contentOffset'), 'menu isn\'t overlapped by content');
    });

    QUnit.test('content container should have correct position after resize', function(assert) {
        var $element = $('#slideOutView2').dxSlideOutView({
                width: '100%',
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            elementWidth = $element.width();

        $('#slideOutViewContainer').width(elementWidth * 2);
        resizeCallbacks.fire();

        assert.equal(position($content), $(instance.menuContent()).width(), 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if it is rendered in invisible container', function(assert) {
        var $container = $('#slideOutViewContainer'),
            $element = $('#slideOutView2');

        $container.detach();

        var instance = $element.dxSlideOutView({
                width: '100%',
                menuVisible: true
            }).dxSlideOutView('instance'),
            $content = $(instance.content());

        $container.appendTo('#qunit-fixture');
        $element.trigger('dxshown');

        assert.equal(position($content), $element.width() - instance.option('contentOffset'), 'container rendered at correct position');
    });

    QUnit.test('menu should be hidden after back button click', function(assert) {
        var instance = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        }).dxSlideOutView('instance');

        hideTopOverlayCallback.fire();
        assert.equal(instance.option('menuVisible'), false, 'hidden after back button event');
    });

    QUnit.test('handle back button should be removed on dispose', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
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

        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent()),
            pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(0.1);
        assert.equal(position($content), $menu.width() / 10, 'container moved');

        pointer.swipeEnd(1).swipe(-0.5);
        assert.equal(position($content), $menu.width() * 0.5, 'container moved');
        fx.off = false;
    });

    QUnit.test('content should be moved by swipe with inverted position', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false,
                menuPosition: 'inverted'
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent()),
            pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), -$menu.width() / 10, 'container moved');
    });

    QUnit.test('content container should not be moved out of menu', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({}),
            instance = $element.dxSlideOutView('instance'),
            pointer = pointerMock($(instance.content())).start();

        var lastEvent = pointer.swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 0, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 1, 'container will not move out of menu');

        instance.option('menuVisible', true);

        lastEvent = pointer.swipeEnd().swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 1, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 0, 'container will not move out of menu');
    });

    QUnit.test('swipeEnabled option', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                swipeEnabled: false,
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            pointer = pointerMock($content).start();

        var startPosition = position($content);

        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), startPosition, 'position won\'t changed');
    });

    QUnit.test('swipeEnabled option dynamic change', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                swipeEnabled: true,
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            pointer = pointerMock($content).start();

        var startPosition = position($content);

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
        var $element = $('#slideOutView').dxSlideOutView({}),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent()),
            pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(0.1).swipeEnd(1);

        assert.equal(this.capturedAnimations[0].$element.get(0), $content.get(0), 'content was animated');
        assert.equal(this.capturedAnimations[0].start, $menu.width() / 10, 'correct start position');
        assert.equal(this.capturedAnimations[0].end, $menu.width(), 'correct end position');
    });

    QUnit.test('animation should be stopped after swipe start', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({}),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            pointer = pointerMock($content).start();

        animationCapturing.teardown();
        pointer.swipeStart().swipe(0.1).swipeEnd(1).swipeStart();

        assert.ok(!fx.isAnimating($content), 'animation was stopped');
    });

    QUnit.test('hiding menu should be animated', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent()),
            pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(-0.5).swipeEnd(-1);

        assert.equal(this.capturedAnimations[0].$element.get(0), $content.get(0), 'content was animated');
        assert.equal(this.capturedAnimations[0].start, $menu.width() * 0.5, 'correct start position');
        assert.equal(this.capturedAnimations[0].end, 0, 'correct end position');
    });
});

QUnit.module('shield', () => {
    QUnit.test('shield should be visible if menu is opened', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: true
            }),
            $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        assert.ok($shield.is(':visible'), 'shield is visible');
    });

    QUnit.test('shield should not be visible if menu is closed', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false
            }),
            $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        assert.ok($shield.is(':hidden'), 'shield is visible');
    });

    QUnit.test('click on shield should not close menu', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        $shield.trigger('dxclick');
        assert.ok(!instance.option('menuVisible'), 'menu was closed');
    });

    QUnit.test('shield should be visible during swipe', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS),
            pointer = pointerMock($content).start();

        pointer.swipeStart();
        assert.ok($shield.is(':visible'), 'shield won\'t hidden');
    });

    QUnit.test('shield should be visible during animation', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false
            }),
            instance = $element.dxSlideOutView('instance'),
            $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        instance.showMenu();
        assert.ok($shield.is(':visible'), 'shield is visible during animation');
    });

    QUnit.test('shield should have correct position', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS);

        assert.equal($shield.offset().left, $content.offset().left, 'shield has correct position');
    });

    QUnit.test('shield should have correct position after widget resize', function(assert) {
        var $element = $('#slideOutView2').dxSlideOutView({
                width: '100%',
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $shield = $element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS),
            menuWidth = $(instance.menuContent()).width();

        $('#slideOutViewContainer').width(menuWidth * 2);
        resizeCallbacks.fire();

        assert.equal($shield.offset().left, $content.offset().left, 'shield has correct position');
    });
});

QUnit.module('rtl', () => {
    QUnit.test('content should have correct position if menu is visible in rtl mode', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: true,
                rtlEnabled: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent());

        assert.equal(position($content), -$menu.width(), 'container rendered at correct position');
    });

    QUnit.test('content should be moved by swipe in rtl', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false,
                rtlEnabled: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent()),
            pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(-0.1);
        assert.equal(position($content), -$menu.width() / 10, 'container moved');
    });

    QUnit.test('content should be moved by swipe in rtl with inverted position', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                menuVisible: false,
                rtlEnabled: true,
                menuPosition: 'inverted'
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menu = $(instance.menuContent()),
            pointer = pointerMock($content).start();

        pointer.swipeStart().swipe(0.1);
        assert.equal(position($content), $menu.width() / 10, 'container moved');
    });

    QUnit.test('menu position classes in rtl', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                rtlEnabled: true,
                menuPosition: 'normal'
            }),
            instance = $element.dxSlideOutView('instance'),
            $menu = $(instance.menuContent());

        assert.ok($menu.hasClass(SLIDEOUTVIEW_CLASS + '-right'), 'menu has class for right position');
        assert.notOk($menu.hasClass(SLIDEOUTVIEW_CLASS + '-left'), 'menu has not class for left position');

        instance.option('menuPosition', 'inverted');
        assert.ok($menu.hasClass(SLIDEOUTVIEW_CLASS + '-left'), 'menu has class for left position');
        assert.notOk($menu.hasClass(SLIDEOUTVIEW_CLASS + '-right'), 'menu has not class for right position');
    });

    QUnit.test('content should not be moved out of menu', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({
                rtlEnabled: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            pointer = pointerMock($content).start();

        var lastEvent = pointer.swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 1, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 0, 'container will not move out of menu');

        instance.option('menuVisible', true);

        lastEvent = pointer.swipeEnd().swipeStart().lastEvent();
        assert.strictEqual(lastEvent.maxLeftOffset, 0, 'container will not move out of menu');
        assert.strictEqual(lastEvent.maxRightOffset, 1, 'container will not move out of menu');
    });
});

