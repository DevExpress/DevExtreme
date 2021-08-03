import $ from 'jquery';
import ResizeObserver from 'core/resize_observer';
import { getWindow, setWindow } from 'core/utils/window';
const window = getWindow();

const TIME_TO_WAIT = 50;

QUnit.testStart(function() {
    const markup = '<div id="root" style="width: 200px;"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Resize observer', () => {
    QUnit.test('initialization should not raise any error if there is no window', function(assert) {
        setWindow(window, false);
        let observer;

        try {
            observer = new ResizeObserver();

            assert.ok(true, 'no errors were raised');
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        } finally {
            setWindow(window, true);
            observer.disconnect();
        }
    });

    let callback;
    let shouldSkipCallback;
    QUnit.module('base functionality', {
        beforeEach: function() {
            this.observer = new ResizeObserver({
                callback: () => { callback(); },
                shouldSkipCallback: () => shouldSkipCallback()
            });
            this.$element = $('#root');
        },
        afterEach: function() {
            this.observer.disconnect();
            this.$element.width(200);
        }
    }, () => {
        QUnit.testInActiveWindow('there is only one ResizeObserver instance', function(assert) {
            assert.strictEqual(new ResizeObserver(), this.observer, 'instances are the same');
        });

        QUnit.testInActiveWindow('should call passed "shouldSkipCallback" function before callback', function(assert) {
            const resizeHandled = assert.async();
            shouldSkipCallback = sinon.stub();
            callback = () => {
                assert.strictEqual(shouldSkipCallback.callCount, 1, 'shouldSkipCallback is called before callback call');
                resizeHandled();
            };

            this.observer.observe(this.$element.get(0));
        });

        QUnit.testInActiveWindow('callback should be raised after observable element resize', function(assert) {
            const resizeHandled = assert.async();
            callback = () => {
                assert.ok(true, 'observer callback is called');
                resizeHandled();
            };

            this.observer.observe(this.$element.get(0));
            this.$element.width(50);
        });

        QUnit.testInActiveWindow('callback should not be raised after element is unobserved', function(assert) {
            const done = assert.async();

            callback = () => {
                assert.ok(false, 'observer callback was called after unobserve');
            };

            this.observer.observe(this.$element.get(0));
            this.observer.unobserve(this.$element.get(0));

            setTimeout(() => {
                assert.ok(true, 'no callbacks were called');
                done();
            }, TIME_TO_WAIT);
        });

        QUnit.testInActiveWindow('should not call "callback" if "shouldSkipCallback" returns true', function(assert) {
            const done = assert.async();
            shouldSkipCallback = sinon.stub().returns(true);
            callback = sinon.stub();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.$element.width(50);
                setTimeout(() => {
                    assert.strictEqual(callback.callCount, 0, 'callback was not called');
                    done();
                }, TIME_TO_WAIT);
            }, TIME_TO_WAIT);
        });
    });
});
