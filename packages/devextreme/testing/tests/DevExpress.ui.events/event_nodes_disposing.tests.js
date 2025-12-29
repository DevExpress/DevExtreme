import eventsEngine from 'common/core/events/core/events_engine';
import domAdapter from '__internal/core/m_dom_adapter';

QUnit.testStart(function() {
    const markup = '';
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

QUnit.test('should not leak memory when clicking on body with dxclick subscription on document', function(assert) {
    const document = domAdapter.getDocument();
    const body = document.body;

    eventsEngine.on(document, 'dxclick', function() {});

    if(typeof globalThis !== 'undefined' && typeof globalThis.gc === 'function') {
        globalThis.gc();
    }

    const initialMemory = performance.memory.usedJSHeapSize;

    for(let i = 0; i < 100; i++) {
        eventsEngine.trigger(body, 'click');
    }

    if(typeof globalThis !== 'undefined' && typeof globalThis.gc === 'function') {
        globalThis.gc();
    }

    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryDiff = finalMemory - initialMemory;

    assert.ok(
        memoryDiff > 0,
        `Memory should not leak. Memory diff: ${memoryDiff}B`
    );
});
