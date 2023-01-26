import $ from 'jquery';
import resizeObserverSingleton from 'core/resize_observer';

import { getWindow, setWindow } from 'core/utils/window';
const window = getWindow();

const TIME_TO_WAIT = 50;

QUnit.testStart(function() {
    const markup = '<div id="root" style="width: 200px;"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Resize observer', () => {
    QUnit.test('should not raise any error if there is no window', function(assert) {
        setWindow(window, false);

        try {
            const element = $('#root').get(0);

            const observer = new resizeObserverSingleton.ResizeObserverSingleton();
            observer.observe(element, () => {});
            observer.unobserve(element);
            observer.disconnect();

            assert.ok(true, 'no errors were raised');
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        } finally {
            setWindow(window, true);
        }
    });

    QUnit.module('base functionality', {
        beforeEach: function() {
            this.observer = resizeObserverSingleton;
            this.$element = $('#root');
            this.element = this.$element.get(0);
        },
        afterEach: function() {
            this.observer.disconnect();
            this.$element.width(200);
        }
    }, () => {
        QUnit.testInActiveWindow('callback should be raised after observable element resize', function(assert) {
            const resizeHandled = assert.async();
            const callback = () => {
                assert.ok(true, 'observer callback is called');
                resizeHandled();
            };

            this.observer.observe(this.element, callback);
            this.$element.width(50);
        });

        QUnit.testInActiveWindow('callback should not be raised after element is unobserved', function(assert) {
            const done = assert.async();

            const callback = () => {
                assert.ok(false, 'observer callback was called after unobserve');
            };

            this.observer.observe(this.element, callback);
            this.observer.unobserve(this.element);

            setTimeout(() => {
                assert.ok(true, 'no callbacks were called');
                done();
            }, TIME_TO_WAIT);
        });
    });
});
