import $ from 'jquery';
import ResizeObserver from 'ui/overlay/resize_observer';
import { getWindow, setWindow } from 'core/utils/window';
const window = getWindow();

QUnit.testStart(function() {
    const markup = '<div id="root"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Resize observer', () => {
    QUnit.test('initialization should not raise any error if there is no window', function(assert) {
        setWindow(window, false);
        let observer;

        try {
            observer = new ResizeObserver(() => {});

            assert.ok(true, 'no errors were raised');
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        } finally {
            setWindow(window, true);
            observer.disconnect();
        }
    });

    QUnit.module('base functionality', {
        beforeEach: function() {
            this.callback = sinon.stub();
            this.observer = new ResizeObserver(this.callback);
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
                    assert.ok(this.callback.called);
                    resizeHandled();
                }, 100);
                observeHandled();
            });
        });

        QUnit.test('callback should be raised on element resize if it was unobserved', function(assert) {
            const observeHandled = assert.async();
            const resizeHandled = assert.async();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.observer.unobserve(this.$element.get(0));
                this.$element.width(50);
                setTimeout(() => {
                    assert.ok(this.callback.notCalled);
                    resizeHandled();
                }, 100);
                observeHandled();
            });
        });

        QUnit.test('callback should be raised after "skipNextResuze" method call', function(assert) {
            const observeHandled = assert.async();
            const resizeHandled = assert.async();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                this.observer.skipNextResize();
                this.$element.width(50);
                setTimeout(() => {
                    assert.ok(this.callback.notCalled);
                    resizeHandled();
                }, 100);
                observeHandled();
            });
        });

        QUnit.test('only one callback should be skipped after "skipNextResuze" method call', function(assert) {
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
                        assert.ok(this.callback.calledOnce);
                        secondResizeHandled();
                    }, 100);
                    firstResizeHandled();
                }, 100);
                observeHandled();
            });
        });

        QUnit.test('"observe" call should not invoke callback immediately', function(assert) {
            const observeHandled = assert.async();

            this.observer.observe(this.$element.get(0));

            setTimeout(() => {
                assert.ok(this.callback.notCalled);
                observeHandled();
            });
        });
    });
});
