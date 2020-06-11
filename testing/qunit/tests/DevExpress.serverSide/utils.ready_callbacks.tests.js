const readyCallbacks = require('core/utils/ready_callbacks');

QUnit.module('readyCallbacks injection', {
    afterEach: function() {
        readyCallbacks.resetInjection();
    }
});

QUnit.test('ready callbacks should be called only once', function(assert) {
    let counter = 0;
    readyCallbacks.add(() => counter++);

    readyCallbacks.fire();
    assert.equal(counter, 1);

    readyCallbacks.fire();
    assert.equal(counter, 1, 'handler should be called only once');
});
