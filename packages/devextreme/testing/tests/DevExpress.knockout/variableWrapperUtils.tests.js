const ko = require('knockout');
const variableWrapper = require('core/utils/variable_wrapper');

require('integration/knockout');

QUnit.test('wrapped value', function(assert) {
    const observableValue = ko.observable(3);
    const computedValue = ko.computed(function() { return '4'; });
    const wrappedValue = variableWrapper.wrap(3);
    const notWrappedValue = 3;

    assert.equal(variableWrapper.isWrapped(3), false, 'isWrapped must return true for observable variable');
    assert.equal(variableWrapper.isWrapped(observableValue), true, 'isWrapped must return false for not observable variable');

    assert.equal(variableWrapper.isWritableWrapped(computedValue), false, 'isWritableWrapped must return false for simple computed variable');
    assert.ok(variableWrapper.isWritableWrapped(observableValue), 'isWritableWrapped must return true for observable');
    assert.equal(variableWrapper.isWritableWrapped(wrappedValue), true, 'isWritableWrapped must return true for wrapped variable');
    assert.equal(variableWrapper.isWritableWrapped(notWrappedValue), false, 'isWritableWrapped must return false for not wrapped variable');

    assert.ok(ko.isObservable(wrappedValue), 'wrap method returns ko.observable');
    assert.equal(wrappedValue(), 3, 'wrap method returns correct value');

    assert.equal(variableWrapper.unwrap(observableValue), 3, 'unwrap method for observable variable');
    assert.equal(variableWrapper.unwrap(3), 3, 'unwrap method for not observable variable');

    variableWrapper.assign(observableValue, 5);
    assert.equal(observableValue(), 5, 'assign method for observable variable');

    assert.throws(variableWrapper.assign(notWrappedValue, 5), 'assign method for not observable variable');

    variableWrapper.resetInjection();
    assert.equal(variableWrapper.wrap(3), 3, 'reset method');
});
