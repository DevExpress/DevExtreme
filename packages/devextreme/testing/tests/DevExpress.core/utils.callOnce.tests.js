const callOnce = require('core/utils/call_once');

QUnit.module('callOnce');

QUnit.test('base usage', function(assert) {
    let i = 0;

    const callOnceHandler = callOnce(function() {
        return ++i;
    });

    assert.equal(i, 0, 'Handler was not called on init');
    assert.equal(callOnceHandler(), 1, 'Handler correctly evaluated the first call');
    assert.equal(callOnceHandler(), 1, 'Handler returned cached result at the second call');
});
