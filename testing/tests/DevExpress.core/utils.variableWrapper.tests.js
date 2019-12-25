var variableWrapper = require('core/utils/variable_wrapper');

QUnit.test('Base wrapper methods', function(assert) {
    assert.strictEqual(variableWrapper.isWrapped(3), false, 'isWrapped method');
    assert.strictEqual(variableWrapper.wrap(3), 3, 'wrap method');
    assert.strictEqual(variableWrapper.unwrap(3), 3, 'unwrap method');
    assert.throws(variableWrapper.assign({}, 3), 'assign method');
});

QUnit.test('Custom wrapper methods', function(assert) {
    var log = {};

    var mockVariableWrapper = {
        isWrapped: function(value) {
            log.method = 'isWrapped',
            log.args = arguments;
        },
        isWritableWrapped: function(value) {
            log.method = 'isWritableWrapped',
            log.args = arguments;
        },
        wrap: function(value) {
            log.method = 'wrap',
            log.args = arguments;
        },
        unwrap: function(value) {
            log.method = 'unwrap',
            log.args = arguments;
        },
        assign: function(variable, value) {
            log.method = 'assign',
            log.args = arguments;
        }
    };

    variableWrapper.inject(mockVariableWrapper);

    variableWrapper.isWrapped(1);
    assert.equal(log.method, 'isWrapped', 'isWrapped method');
    assert.equal(log.args.length, 1, 'isWrapped method');
    assert.equal(log.args[0], 1, 'isWrapped method');

    variableWrapper.isWritableWrapped(2);
    assert.equal(log.method, 'isWritableWrapped', 'isWritableWrapped method');
    assert.equal(log.args.length, 1, 'isWritableWrapped method');
    assert.equal(log.args[0], 2, 'isWritableWrapped method');

    variableWrapper.wrap(3);
    assert.equal(log.method, 'wrap', 'wrap method');
    assert.equal(log.args.length, 1, 'wrap method');
    assert.equal(log.args[0], 3, 'wrap method');

    variableWrapper.unwrap(4);
    assert.equal(log.method, 'unwrap', 'unwrap method');
    assert.equal(log.args.length, 1, 'unwrap method');
    assert.equal(log.args[0], 4, 'unwrap method');

    variableWrapper.assign(5, 6);
    assert.equal(log.method, 'assign', 'assign method');
    assert.equal(log.args.length, 2, 'assign method');
    assert.equal(log.args[0], 5, 'assign method');
    assert.equal(log.args[1], 6, 'assign method');

    variableWrapper.resetInjection();
    assert.equal(variableWrapper.wrap(3), 3, 'reset method');
});
