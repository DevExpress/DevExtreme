const readyCallbacks = require('core/utils/ready_callbacks');

QUnit.module('readyCallbacks injection', {
    afterEach: function() {
        readyCallbacks.resetInjection();
    }
});

QUnit.test('inject method', function(assert) {
    assert.expect(1);
    readyCallbacks.inject({
        add: function() {
            assert.ok(true, 'injected method was called');
        }
    });
    readyCallbacks.add();
});
