import $ from 'jquery';
import notify from 'ui/notify';
import fx from 'common/core/animation/fx';
import { value as viewPort } from 'core/utils/view_port';
import { isPlainObject } from 'core/utils/type';
import 'generic_light.css!';

const TOAST_CLASS = 'dx-toast';
const TOAST_WRAPPER_CLASS = 'dx-toast-wrapper';
const TOAST_MESSAGE_CLASS = 'dx-toast-message';
const TOAST_STACK = 'dx-toast-stack';

QUnit.module('notify', {
    beforeEach: function() {
        viewPort('#qunit-fixture');

        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('show/hide', function(assert) {
        assert.expect(3);

        assert.strictEqual($(`.${TOAST_CLASS}`).length, 0);
        notify({
            displayTime: 100,
            onHidden: function() {
                assert.strictEqual($(`.${TOAST_CLASS}`).length, 0);
            }
        });
        assert.strictEqual($(`.${TOAST_CLASS}`).length, 1);
        this.clock.tick(100);
    });

    QUnit.test('have content', function(assert) {
        const expected = 'Hello word';
        assert.strictEqual($(`.${TOAST_CLASS}`).length, 0);
        notify({
            message: expected,
            displayTime: 100,
            hidden: function() {
                assert.strictEqual($(`.${TOAST_CLASS}`).length, 0);
            }
        });

        assert.strictEqual($(`.${TOAST_WRAPPER_CLASS}`).find(`.${TOAST_MESSAGE_CLASS}`).text(), expected, 'Actual message is equal to expected.');
        assert.strictEqual($(`.${TOAST_WRAPPER_CLASS}`).length, 1);
        this.clock.tick(100);
    });

    QUnit.test('second argument should set type option if it is not an object', function(assert) {
        const type = 'warning';
        notify({ displayTime: 100 }, type);

        const instance = $(`.${TOAST_CLASS}`).dxToast('instance');

        assert.strictEqual(instance.option('type'), type);
        this.clock.tick(100);
    });

    QUnit.test('notify content should have transform translate styles (stack disabled)', function(assert) {
        notify({ displayTime: 100 });

        const $content = $($(`.${TOAST_CLASS}`).dxToast('instance').content());
        const translateStyles = $content.css('transform').replace(/[^0-9\-.,]/g, '').split(',');

        assert.notStrictEqual(translateStyles[4], 0, 'translateX is defined');
        assert.notStrictEqual(translateStyles[5], 0, 'translateY is defined');
        this.clock.tick(100);
    });

    QUnit.module('stack', {
        beforeEach: function() {
            this.options = {
                displayTime: 100
            };
            this.stack = {
                position: 'top left'
            };
        },

        afterEach: function() {
            this.clock.tick(100);
            notify._resetContainers();
        }
    }, () => {
        QUnit.test('do not create toast-stack if stack do not have position field', function(assert) {
            notify(this.options, {});
            assert.strictEqual($(`.${TOAST_STACK}`).length, 0);
        });

        QUnit.test('create toast-stack if stack have position field', function(assert) {
            notify(this.options, this.stack);

            assert.strictEqual($(`.${TOAST_STACK}`).length, 1);
        });

        QUnit.test('use the same toast-stack if two notifies have the same position', function(assert) {
            notify(this.options, this.stack);
            notify(this.options, this.stack);

            assert.strictEqual($(`.${TOAST_STACK}`).length, 1);
        });

        QUnit.test('use different toast-stacks if two notifies have diefferent position', function(assert) {
            notify(this.options, this.stack);
            notify(this.options, { position: 'bottom left' });

            assert.strictEqual($(`.${TOAST_STACK}`).length, 2);
        });

        QUnit.test('add down-push direction class if stack do not have direction field and position is a top position alias', function(assert) {
            notify(this.options, this.stack);

            assert.strictEqual($(`.${TOAST_STACK}-down-push-direction`).length, 1);
        });

        QUnit.test('add up-push direction class if stack do not have direction field and position is not a top position alias', function(assert) {
            notify(this.options, { position: { top: 100, left: 100 } });

            assert.strictEqual($(`.${TOAST_STACK}-up-push-direction`).length, 1);
        });

        QUnit.test('add correct direction class if stack have direction field', function(assert) {
            const direction = 'left-stack';
            notify(this.options, { ...this.stack, direction });

            assert.strictEqual($(`.${TOAST_STACK}-${direction}-direction`).length, 1);
        });

        QUnit.test('delete previous direction class on container', function(assert) {
            const direction = 'up-push';
            const newDirection = 'down-push';
            notify(this.options, { ...this.stack, direction });
            assert.strictEqual($(`.${TOAST_STACK}-${direction}-direction`).length, 1);

            notify(this.options, { ...this.stack, direction: newDirection });
            assert.strictEqual($(`.${TOAST_STACK}-${direction}-direction`).length, 0);

        });

        QUnit.test('set container option as a toast stack element', function(assert) {
            notify(this.options, this.stack);

            const $container = $(`.${TOAST_STACK}`);
            const instance = $(`.${TOAST_CLASS}`).dxToast('instance');

            assert.strictEqual(instance.option('container')[0], $container[0]);
        });

        [
            { direction: 'up-push', style: 'bottom' },
            { direction: 'down-push', style: 'top' },
            { direction: 'left-push', style: 'right' },
            { direction: 'right-push', style: 'left' }
        ].forEach(({ direction, style }) => {
            QUnit.test(`should set ${style} style if stack has ${direction} direction`, function(assert) {
                notify(this.options, { ...this.stack, direction });

                const stackStyles = $(`.${TOAST_STACK}`)[0].style;

                assert.ok(stackStyles[style]);
            });
        });

        QUnit.test('set styles when position is an object', function(assert) {
            const position = { bottom: 300, right: 150 };
            notify(this.options, { position });

            const stackStyles = $(`.${TOAST_STACK}`)[0].style;

            assert.strictEqual(stackStyles.bottom, `${position.bottom}px`);
            assert.strictEqual(stackStyles.right, `${position.right}px`);
        });

        QUnit.test('stack container should have toasts base zIndex (T1105343)', function(assert) {
            notify(this.options, this.stack);

            const stackZIndex = parseInt($(`.${TOAST_STACK}`).css('zIndex'), 10);
            const toastsBaseZIndex = 9500;

            assert.strictEqual(stackZIndex, toastsBaseZIndex);
        });

        QUnit.test('notify content should not have transform styles, stack enabled (T1181708)', function(assert) {
            notify(this.options, this.stack);

            const $content = $($(`.${TOAST_CLASS}`).dxToast('instance').content());
            const translateStyles = $content.css('transform');

            assert.strictEqual(translateStyles, 'none');
        });
    });

    [
        'onShowing',
        'onShown',
        'onHiding',
        'onHidden'
    ].forEach(eventName => {
        QUnit.test(`${eventName} argument should be plain object`, function(assert) {
            const options = { displayTime: 100 };
            const stub = sinon.stub();
            options[eventName] = stub;

            notify(options, { position: 'top left' });
            this.clock.tick(100);

            const eventArg = stub.lastCall.args[0];

            assert.ok(isPlainObject(eventArg), 'argument is plain object');
        });
    });
});

