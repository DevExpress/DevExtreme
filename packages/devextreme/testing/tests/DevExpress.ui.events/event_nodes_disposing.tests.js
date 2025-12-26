import $ from 'jquery';

QUnit.testStart(function() {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('event nodes disposing');

QUnit.test('should not leak memory when clicking on body with DxDataGrid on page', function(assert) {
    $('#dataGrid').dxDataGrid({
        dataSource: []
    });

    globalThis.gc();

    const initialMemory = performance.memory.usedJSHeapSize;

    for(let i = 0; i < 100; i++) {
        $('body').trigger('click');
    }

    globalThis.gc();

    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryDiff = finalMemory - initialMemory;

    assert.ok(
        memoryDiffMB <= 0,
        `Memory should not leak. Memory diff: ${memoryDiff}B`
    );
});
