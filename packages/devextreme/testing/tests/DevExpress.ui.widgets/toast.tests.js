import { getWidth, getHeight, getOuterHeight, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'common/core/animation/fx';
import { value as setViewPort } from 'core/utils/view_port';
import Toast from 'ui/toast';
import devices from 'core/devices.js';

import 'generic_light.css!';

const TOAST_CLASS = 'dx-toast';
const TOAST_CLASS_PREFIX = TOAST_CLASS + '-';
const TOAST_WRAPPER_CLASS = TOAST_CLASS_PREFIX + 'wrapper';
const TOAST_CONTENT_CLASS = TOAST_CLASS_PREFIX + 'content';
const TOAST_MESSAGE_CLASS = TOAST_CLASS_PREFIX + 'message';
const TOAST_ICON_CLASS = TOAST_CLASS_PREFIX + 'icon';

const DEFAULT_MARGIN = 20;

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#toast');
        this.instance = new Toast(this.$element);
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

let viewPort = null;

QUnit.testStart(function() {
    viewPort = $('#qunit-fixture').addClass('dx-viewport');
    setViewPort(viewPort);

    const markup =
        '<div id="toast"></div>\
        <div id="firstToast"></div>\
        <div id="secondToast"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('general', moduleConfig, () => {
    QUnit.test('render', function(assert) {
        this.instance.show();

        const $content = this.instance.$content();
        const $wrapper = this.instance.$wrapper();

        assert.ok(this.$element.hasClass(TOAST_CLASS));
        assert.ok($wrapper.hasClass(TOAST_WRAPPER_CLASS));
        assert.ok($content.hasClass(TOAST_CONTENT_CLASS));

        assert.ok(getWidth($content) < getWidth($(window)));
        assert.ok(getHeight($content) < getHeight($(window)));
    });

    QUnit.test('default template', function(assert) {
        const $content = this.instance.$content();

        this.instance.option({
            message: 'test42',
            type: 'Error'
        });
        this.instance.show();

        assert.ok($content.children().eq(0).hasClass(TOAST_ICON_CLASS));
        assert.ok($content.children().eq(1).hasClass(TOAST_MESSAGE_CLASS));

        assert.ok($content.hasClass(TOAST_CLASS_PREFIX + 'error'));
        assert.equal($content.text(), 'test42');
    });

    QUnit.test('position', function(assert) {
        this.instance.option({
            message: 'test42',
            position: { my: 'bottom center', at: 'bottom center', offset: '0 0' }
        });

        fx.off = true;
        this.instance.show();

        const $content = this.instance.$content();
        assert.roughEqual($content.offset().top + getOuterHeight($content), getHeight($(window)), 1.01);
    });

    QUnit.test('position on mobile devices', function(assert) {
        if(devices.real().deviceType !== 'phone') {
            assert.ok(true, 'not mobile device');
            return;
        }

        const done = assert.async();
        fx.off = false;

        this.instance = this.$element.dxToast({
            onShown: function(e) {
                const $content = e.component.$content();

                assert.roughEqual($content.offset().top + getOuterHeight($content), window.visualViewport.height - DEFAULT_MARGIN, 1.01);
                assert.roughEqual(getOuterWidth($content), window.visualViewport.width - (DEFAULT_MARGIN * 2), 1.01);

                done();
            }
        }).dxToast('instance');

        this.instance.show();
        this.clock.tick(5000);
    });

    QUnit.test('displayTime', function(assert) {
        let shown = 0;
        let hidden = 0;

        this.instance.option({
            'displayTime': 100,
            'animation.show.duration': 20,
            'animation.hide.duration': 30,
            'onShown': function() {
                shown++;
            },
            'onHiding': function() {
                hidden++;
            }
        });


        this.instance.show();
        this.clock.tick(50);

        assert.equal(shown, 1);
        assert.equal(hidden, 0);

        this.clock.tick(50);

        assert.equal(shown, 1);
        assert.equal(hidden, 1);
    });

    QUnit.test('should not hide previous Toasts on new Toast showing (T1153204)', function(assert) {
        const $first = $('#firstToast');
        const $second = $('#secondToast');
        const first = $first.dxToast().dxToast('instance');
        const second = $second.dxToast().dxToast('instance');

        first.show();

        assert.equal($('.dx-toast-content').filter(':visible').length, 1, 'the first toast is visible');

        second.show();

        assert.equal($('.dx-toast-content').filter(':visible').length, 2, 'both toasts are visible');
    });

    QUnit.test('toast should repeat trying to close after hiding is cancelled (T1156504)', function(assert) {
        let hidingCallCount = 0;
        const displayTime = 500;
        this.instance.option({
            displayTime,
            onHiding: (e) => {
                if(hidingCallCount === 0) {
                    e.cancel = true;
                }
                hidingCallCount += 1;
            }
        });
        this.instance.show();

        this.clock.tick(displayTime);
        assert.strictEqual(hidingCallCount, 1, 'toast tried to close after displayTime');
        assert.strictEqual(this.instance.option('visible'), true, 'hiding was cancelled');

        this.clock.tick(displayTime);
        assert.strictEqual(hidingCallCount, 2, 'toast tried to close after displayTime repeatedly');
        assert.strictEqual(this.instance.option('visible'), false, 'toast was hidden');
    });
});

QUnit.module('API', moduleConfig, () => {
    QUnit.test('show/hide', function(assert) {
        fx.off = true;

        const instance = this.instance;

        instance.option({
        // hidden: function() {
        //     assert.ok(instance.content().is(":hidden"));
        //     start();
        // },
            displayTime: 50,
            animation: {
                type: 'fade',
                duration: 0,
                to: 1
            }
        });

        instance.show().done(function() {
            assert.ok(instance.$content().is(':visible'));
        });
    });

    QUnit.test('message option runtime change should update the message of a visible toast (T1169347)', function(assert) {
        this.instance.option('visible', true);

        const newMessage = 'new message';
        this.instance.option('message', newMessage);

        const toastText = this.instance.$content().text();
        assert.strictEqual(toastText, newMessage, 'message was changed');
    });
});

QUnit.module('regression', moduleConfig, () => {
    QUnit.test('change message in runtime', function(assert) {
        this.instance.option({ message: 'test42' });
        this.instance.show();
        this.instance.hide();
        this.instance.option({ message: 'test43' });
        this.instance.show();

        assert.equal(this.instance.$content().text(), 'test43');
    });

    QUnit.test('B238416', function(assert) {
        assert.expect(2);

        const instance = this.instance;

        instance.option({
            animation: {
                show: {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                },
                hide: {
                    from: { opacity: 1 },
                    to: { opacity: 0 }
                }
            }
        });

        instance.show().done(function() {
            const $content = instance.$content();

            assert.equal($content.css('opacity'), '1');

            instance.hide().done(function() {
                assert.equal($content.css('opacity'), '0');
            });
        });
    });

    QUnit.test('animation option should not contain window object if it was not set (T228805)', function(assert) {
        const instance = this.instance;
        const animationConfig = {
            show: { type: 'pop', from: { opacity: 1, scale: 0 }, to: { scale: 1 } },
            hide: { type: 'pop', from: { scale: 1 }, to: { scale: 0 } }
        };

        instance.option('animation', animationConfig);

        instance.show();

        assert.equal(animationConfig.show.to.position.of, null);

        instance.option('animation.show.to.position.of', window);
        assert.equal(animationConfig.show.to.position.of, window);
    });
});

QUnit.module('overlay integration', moduleConfig, () => {
    ['closeOnOutsideClick', 'hideOnOutsideClick'].forEach(closeOnOutsideClickOptionName => {
        QUnit.test(`toast should be closed on outside click if ${closeOnOutsideClickOptionName} is true`, function(assert) {
            this.instance.option(closeOnOutsideClickOptionName, true);
            this.instance.show();

            $('#qunit-fixture').trigger('dxpointerdown');

            assert.equal(this.instance.option('visible'), false, 'toast was hidden should be hiding');
        });

        QUnit.test(`toast does not prevent ${closeOnOutsideClickOptionName} handler of other overlays`, function(assert) {
            const $overlay = $('<div>').appendTo(viewPort);

            const overlay = $overlay.dxOverlay({
                [closeOnOutsideClickOptionName]: true
            }).dxOverlay('instance');


            overlay.show();
            this.instance.show();

            $('#qunit-fixture').trigger('dxpointerdown');

            assert.equal(overlay.option('visible'), false, 'dxOverlay should be hiding');
        });
    });

    QUnit.test('it should be possible to select a message in the toast by the mouse', function(assert) {
        assert.expect(1);
        const $toast = $('#toast').dxToast({
            shading: true,
            visible: true
        });
        const $shader = $toast.dxToast('$content').closest('.dx-overlay-shader');

        $($shader).on('dxdrag', function(e) {
            assert.equal(e.isDefaultPrevented(), false, 'touchmove is not prevented');
        });

        const event = $.Event('dxdrag', {
            originalEvent: $.Event('dxpointermove', {
                originalEvent: $.Event('touchmove')
            })
        });

        $($shader).trigger(event);
    });

    QUnit.test('toast should stay opened after change content template', function(assert) {
        const toast = $('#toast').dxToast({
            visible: true
        }).dxToast('instance');
        const hideSpy = sinon.spy(toast, 'hide');

        toast.option('contentTemplate', function() {
            return $('<div>');
        });

        this.clock.tick(10);
        assert.equal(hideSpy.callCount, 0, 'Toast didn\'t hide');
    });
});

QUnit.module('base z-index', () => {
    QUnit.test('toast should have base z-index greater than overlay', function(assert) {
        Toast.baseZIndex(10000);

        const $toast = $('#toast').dxToast({ visible: true }); const $content = $toast.dxToast('instance').$content();

        assert.equal($content.css('zIndex'), 18001, 'toast\'s z-index is correct');
    });
});

QUnit.module('close events handling', () => {
    QUnit.test('closeOnSwipe option', function(assert) {
        const $element = $('#toast').dxToast({ visible: true });
        const instance = $element.dxToast('instance');
        const pointer = pointerMock($('.dx-toast-content'));

        pointer.start().swipe(-0.5);
        assert.ok(!instance.option('visible'), 'toast should hide on swipe');

        instance.option('closeOnSwipe', false);
        instance.option('visible', true);
        pointer.swipe(-0.5);

        assert.ok(instance.option('visible'), 'toast should not hide on swipe');
    });

    QUnit.test('closeOnClick option', function(assert) {
        const $element = $('#toast').dxToast({ visible: true });
        const instance = $element.dxToast('instance');
        const $content = $('.dx-toast-content');

        $($content).trigger('dxclick');
        assert.ok(instance.option('visible'), 'toast should not hide on click if option is false');

        instance.option('closeOnClick', true);
        $($content).trigger('dxclick');

        assert.ok(!instance.option('visible'), 'toast should hide on click if option is true');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', function(assert) {
        const $element = $('#toast').dxToast({
            message: 'test',
            animation: {}
        });
        const instance = $element.dxToast('instance');

        instance.show();

        const $message = instance.$content().find('.' + TOAST_MESSAGE_CLASS);

        assert.equal($message.attr('role'), 'alert', 'role for toast message is correct');
    });
});

