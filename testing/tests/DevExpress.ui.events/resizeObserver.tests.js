import $ from 'jquery';
import ResizeObserver from 'ui/overlay/resize_observer';
import { getWindow, setWindow } from 'core/utils/window';
const window = getWindow();

const TIME_TO_WAIT = 15;

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

    QUnit.module('beforeEach', {
        beforeEach: function() {
            this.callback = sinon.stub();
            this.$element = $('#root');
        },
        afterEach: function() {
            this.observer.disconnect();
        }
    }, () => {
        QUnit.test('should call passed "beforeEach" function before each callback', function(assert) {
            const observeHandled = assert.async();
            const resizeHandled = assert.async();
            this.beforeEachCallback = sinon.stub();

            this.observer = new ResizeObserver({ callback: this.callback, beforeEach: this.beforeEachCallback });
            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.$element.width(50);
                setTimeout(() => {
                    assert.ok(this.beforeEachCallback.called);
                    resizeHandled();
                }, TIME_TO_WAIT);
                observeHandled();
            }, TIME_TO_WAIT);
        });

        QUnit.test('should not call "callback" if "beforeEach" returns object with "shouldSkip: true"', function(assert) {
            const observeHandled = assert.async();
            const resizeHandled = assert.async();
            this.beforeEachCallback = sinon.stub().returns({ shouldSkip: true });

            this.observer = new ResizeObserver({ callback: this.callback, beforeEach: this.beforeEachCallback });
            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.$element.width(50);
                setTimeout(() => {
                    assert.ok(this.callback.notCalled);
                    resizeHandled();
                }, TIME_TO_WAIT);
                observeHandled();
            }, TIME_TO_WAIT);
        });
    });
    QUnit.module('base functionality', {
        beforeEach: function() {
            this.callback = sinon.stub();
            this.observer = new ResizeObserver({ callback: this.callback });
            this.$element = $('#root');
        },
        afterEach: function() {
            this.observer.disconnect();
            this.callback.reset();
        }
    }, () => {
        QUnit.test('callback should be raised after observable element resize', function(assert) {
            const observeHandled = assert.async();
            const resizeHandled = assert.async();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.$element.width(50);
                setTimeout(() => {
                    assert.strictEqual(this.callback.callCount, 2, 'on "observe" call and on target element resize');
                    resizeHandled();
                }, TIME_TO_WAIT);
                observeHandled();
            }, TIME_TO_WAIT);
        });

        QUnit.test('callback should not be raised on element resize if it was unobserved', function(assert) {
            const observeHandled = assert.async();
            const resizeHandled = assert.async();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.observer.unobserve(this.$element.get(0));
                this.$element.width(50);
                setTimeout(() => {
                    assert.ok(this.callback.calledOnce, 'called only on "observe" method invoke');
                    resizeHandled();
                }, TIME_TO_WAIT);
                observeHandled();
            }, TIME_TO_WAIT);
        });

        QUnit.test('callback should be raised after "skipNextResize" method call', function(assert) {
            const observeHandled = assert.async();
            const resizeHandled = assert.async();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.observer.skipNextResize();
                this.$element.width(50);
                setTimeout(() => {
                    assert.ok(this.callback.calledOnce, 'called only on "observe" method invoke');
                    resizeHandled();
                }, TIME_TO_WAIT);
                observeHandled();
            }, TIME_TO_WAIT);
        });

        QUnit.test('only one callback should be skipped after "skipNextResize" method call', function(assert) {
            const observeHandled = assert.async();
            const firstResizeHandled = assert.async();
            const secondResizeHandled = assert.async();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.observer.skipNextResize();
                this.$element.width(50);
                setTimeout(() => {
                    this.$element.width(100);
                    setTimeout(() => {
                        assert.strictEqual(this.callback.callCount, 2, 'on "observe" call and on second resize');
                        secondResizeHandled();
                    }, TIME_TO_WAIT);
                    firstResizeHandled();
                }, TIME_TO_WAIT);
                observeHandled();
            }, TIME_TO_WAIT);
        });
    });
});
