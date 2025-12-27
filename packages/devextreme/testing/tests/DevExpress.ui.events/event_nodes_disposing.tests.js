import eventsEngine from 'common/core/events/core/events_engine';
import domAdapter from '__internal/core/m_dom_adapter';

QUnit.module('event nodes disposing', {
    afterEach: function() {
        const document = domAdapter.getDocument();
        eventsEngine.off(document, 'dxclick');
    }
});

QUnit.test('should not leak memory when clicking on body with dxclick subscription on document', function(assert) {
    const document = domAdapter.getDocument();
    $(document).on('dxclick', function() {});

    const initialMemory = performance.memory.usedJSHeapSize;

    for(let i = 0; i < 100; i++) {
        $('body').trigger('click');
    }

    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryDiff = finalMemory - initialMemory;

    assert.ok(
        memoryDiff <= 0,
        `Memory should not leak. Memory diff: ${memoryDiff}B`
    );
});
