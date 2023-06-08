import { hasWindow } from 'core/utils/window';
import {
    visualViewportEventMap,
    hasVisualViewport,
    getVisualViewportSizes,
    subscribeOnVisualViewportEvent,
} from 'core/utils/visual_viewport';

QUnit.module('VisualViewport API', () => {
    QUnit.test('VisualViewport exists if there is window object', function(assert) {
        assert.strictEqual(hasVisualViewport(), hasWindow());
    });

    QUnit.test('getVisualViewportSizes returns correct values', function(assert) {
        const visualViewportSizes = getVisualViewportSizes();
        const visualViewportSizesKeys = Object.keys(visualViewportSizes);

        const expectedResults = {
            offsetLeft: 0,
            offsetTop: 0,
            pageLeft: 0,
            pageTop: 0,
            scale: 1,
        };

        assert.strictEqual(visualViewportSizesKeys.length, 7, 'correct size properties count');

        visualViewportSizesKeys.forEach(property => {
            if(property === 'width' || property === 'height') {
                assert.strictEqual(typeof visualViewportSizes[property], 'number', `correct ${property} property type`);

                return;
            }

            assert.strictEqual(visualViewportSizes[property], expectedResults[property], `correct ${property} property value`);
        });
    });

    QUnit.test('subscribeOnVisualViewportEvent returns a function', function(assert) {
        assert.strictEqual(typeof subscribeOnVisualViewportEvent(visualViewportEventMap.resize, () => {}), 'function');
        assert.strictEqual(typeof subscribeOnVisualViewportEvent(visualViewportEventMap.scroll, () => {}), 'function');
    });
});
