var dataUtils = require('core/element_data');

QUnit.module('Data');

QUnit.test('Get and set data', function(assert) {
    var element = document.createElement('div');
    var testData = 'testData';

    dataUtils.data(element, 'testKey1', testData);
    var data = dataUtils.data(element, 'testKey1');

    assert.equal(data, testData);

    data = dataUtils.data(element, 'testKey2');
    assert.equal(data, undefined);

    data = dataUtils.data(element);
    assert.deepEqual(data, { testKey1: testData });
});

QUnit.test('removeData', function(assert) {
    var element = document.createElement('div');
    var testData = 'testData';
    var key = 'testKey';

    dataUtils.data(element, key, testData);
    dataUtils.removeData(element, key);

    var data = dataUtils.data(element, key);
    assert.equal(data, undefined);

    data = dataUtils.data(element);
    assert.deepEqual(data, {});

    dataUtils.removeData(element);
    data = dataUtils.data(element);
    assert.deepEqual(data, {});
});

QUnit.test('cleanData', function(assert) {
    var element = document.createElement('div');
    var testData = 'testData';
    var key = 'testKey';

    dataUtils.data(element, key, testData);
    dataUtils.cleanData([element]);

    var data = dataUtils.data(element, key);
    assert.equal(data, undefined);

    data = dataUtils.data(element);
    assert.deepEqual(data, {});
});
