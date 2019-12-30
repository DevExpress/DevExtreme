const ko = require('knockout');
const variableWrapper = require('core/utils/variable_wrapper');
const objectUtils = require('core/utils/object');

require('integration/knockout');

QUnit.test('deepExtendArraySafe works correctly with array contain observables', function(assert) {
    const testObj = { id: 4, name: ko.observable('John') };
    let resultObj;

    resultObj = objectUtils.deepExtendArraySafe(testObj, { name: 'Sue' });

    assert.equal(variableWrapper.isWrapped(resultObj.name), true, '\'name\' field is still observable');
    assert.equal(resultObj.name(), 'Sue', 'New value accepted');
});
