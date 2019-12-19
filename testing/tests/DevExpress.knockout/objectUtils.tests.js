var ko = require('knockout'),
    variableWrapper = require('core/utils/variable_wrapper'),
    objectUtils = require('core/utils/object');

require('integration/knockout');

QUnit.test('deepExtendArraySafe works correctly with array contain observables', function(assert) {
    var testObj = { id: 4, name: ko.observable('John') },
        resultObj;

    resultObj = objectUtils.deepExtendArraySafe(testObj, { name: 'Sue' });

    assert.equal(variableWrapper.isWrapped(resultObj.name), true, '\'name\' field is still observable');
    assert.equal(resultObj.name(), 'Sue', 'New value accepted');
});
