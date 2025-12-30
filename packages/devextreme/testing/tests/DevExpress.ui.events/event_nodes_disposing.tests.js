import eventsEngine from 'common/core/events/core/events_engine';
import domAdapter from '__internal/core/m_dom_adapter';
import { name as clickEventName } from 'common/core/events/click';

QUnit.testStart(function() {
    const markup = '<button id="test-element">Test</button>';
    const fixture = document.getElementById('qunit-fixture');
    if(fixture) {
        fixture.innerHTML = markup;
    }
});

QUnit.module('event nodes disposing', {
    afterEach: function() {
        const document = domAdapter.getDocument();
        eventsEngine.off(document, clickEventName);
    }
});

QUnit.test('should not leak memory when subscribing to dxclick on document and clicking elements', function(assert) {
    const done = assert.async();
    const document = domAdapter.getDocument();
    const testElement = document.getElementById('test-element');

    eventsEngine.on(document, clickEventName, () => {});

    if(typeof globalThis !== 'undefined' && typeof globalThis.gc === 'function') {
        globalThis.gc();
    }

    const initialMemory = performance.memory.usedJSHeapSize;

    let i = 0;

    const interval = setInterval(() => {
        testElement.click();
        i++;

        if(i > 99) {
            setTimeout(() => {
                if(typeof globalThis !== 'undefined' && typeof globalThis.gc === 'function') {
                    globalThis.gc();
                }

                const finalMemory = performance.memory.usedJSHeapSize;
                const memoryDiff = finalMemory - initialMemory;

                assert.ok(
                    memoryDiff <= 0,
                    `Memory should not leak. Memory diff: ${memoryDiff}B`
                );
                done();
            }, 50);

            clearInterval(interval);
        }
    }, 50);
});
