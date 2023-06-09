import { hasWindow, getWindow } from 'core/utils/window';
import {
    visualViewportEventMap,
    hasVisualViewport,
    getVisualViewportSizes,
    subscribeOnVisualViewportEvent,
} from 'core/utils/visual_viewport';

const setVisualViewport = (value, configurable) => {
    Object.defineProperty(getWindow(), 'visualViewport', {
        get: () => value,
        configurable,
    });
};

const getOriginalVisualViewport = () => {
    const { visualViewport } = getWindow();

    return visualViewport;
};

QUnit.module('VisualViewport API', () => {
    QUnit.test('VisualViewport exists if there is window object', function(assert) {
        assert.strictEqual(hasVisualViewport(), hasWindow());
    });

    QUnit.test('getVisualViewportSizes returns correct values', function(assert) {
        const sizes = {
            height: 7,
            offsetLeft: 1,
            offsetTop: 2,
            pageLeft: 3,
            pageTop: 4,
            scale: 5,
            width: 6,
        };

        const originalVisualViewport = getOriginalVisualViewport();

        try {
            setVisualViewport(sizes, true);

            const visualViewportSizes = getVisualViewportSizes();
            const visualViewportSizesKeys = Object.keys(visualViewportSizes);

            assert.strictEqual(visualViewportSizesKeys.length, 7, 'correct size properties count');

            visualViewportSizesKeys.forEach(property => {
                assert.strictEqual(visualViewportSizes[property], sizes[property], `correct ${property} property value`);
            });
        } finally {
            setVisualViewport(originalVisualViewport, false);
        }
    });

    QUnit.test('subscribeOnVisualViewportEvent returns a function', function(assert) {
        const resizeRemoveEventListenerCallback = subscribeOnVisualViewportEvent(visualViewportEventMap.resize, () => {});
        const scrollRemoveEventListenerCallback = subscribeOnVisualViewportEvent(visualViewportEventMap.scroll, () => {});

        try {
            assert.strictEqual(typeof resizeRemoveEventListenerCallback, 'function');
            assert.strictEqual(typeof scrollRemoveEventListenerCallback, 'function');
        } finally {
            resizeRemoveEventListenerCallback();
            scrollRemoveEventListenerCallback();
        }
    });

    QUnit.test('VisualViewport resize fires VisualViewport resize callback the correct number of times', function(assert) {
        let counter = 0;

        const resizeRemoveCallback = subscribeOnVisualViewportEvent(visualViewportEventMap.resize, () => counter++);
        const visualViewport = getOriginalVisualViewport();

        visualViewport.dispatchEvent(new Event('resize'));
        assert.strictEqual(counter, 1, 'there is event listener');

        resizeRemoveCallback();

        visualViewport.dispatchEvent(new Event('resize'));
        assert.strictEqual(counter, 1, 'there are no event listeners');
    });

    QUnit.test('VisualViewport scroll fires VisualViewport scroll callback the correct number of times', function(assert) {
        let counter = 0;

        const scrollRemoveCallback = subscribeOnVisualViewportEvent(visualViewportEventMap.scroll, () => counter++);
        const visualViewport = getOriginalVisualViewport();

        visualViewport.dispatchEvent(new Event('scroll'));
        assert.strictEqual(counter, 1, 'there is event listener');

        scrollRemoveCallback();

        visualViewport.dispatchEvent(new Event('scroll'));
        assert.strictEqual(counter, 1, 'there are no event listeners');
    });
});
