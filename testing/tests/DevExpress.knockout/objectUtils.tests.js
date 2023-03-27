import ko from 'knockout';
import variableWrapper from 'core/utils/variable_wrapper';
import objectUtils from 'core/utils/object';

import 'integration/knockout';

QUnit.test('deepExtendArraySafe works correctly with array contain observables', function(assert) {
    const testObj = { id: 4, name: ko.observable('John') };
    const resultObj = objectUtils.deepExtendArraySafe(testObj, { name: 'Sue' });

    assert.equal(variableWrapper.isWrapped(resultObj.name), true, '\'name\' field is still observable');
    assert.equal(resultObj.name(), 'Sue', 'New value accepted');
});
