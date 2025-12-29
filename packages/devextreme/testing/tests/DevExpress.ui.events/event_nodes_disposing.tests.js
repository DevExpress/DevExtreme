import eventsEngine from 'common/core/events/core/events_engine';
import domAdapter from '__internal/core/m_dom_adapter';

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
        eventsEngine.off(document, 'dxclick');
    }
});

QUnit.test('should not leak memory when subscribing to dxclick on document and clicking elements', function(assert) {
    const document = domAdapter.getDocument();
    const testElement = document.getElementById('test-element');

    eventsEngine.on(document, 'dxclick', function() {});

    if(typeof globalThis !== 'undefined' && typeof globalThis.gc === 'function') {
        globalThis.gc();
    }

    const initialMemory = performance.memory.usedJSHeapSize;

    for(let i = 0; i < 100; i++) {
        eventsEngine.trigger(testElement, 'click');
    }

    if(typeof globalThis !== 'undefined' && typeof globalThis.gc === 'function') {
        globalThis.gc();
    }

    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryDiff = finalMemory - initialMemory;

    assert.ok(
        finalMemory <= 0,
        `Memory should not leak. Memory before: ${initialMemory}B, Memory after: ${finalMemory}B, Memory diff: ${memoryDiff}B`
    );
});
