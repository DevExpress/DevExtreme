var LocalStore = require('data/local_store');

var TEST_NAME = '65DFE188-D178-11E1-A097-51216288709B';

QUnit.test('name option is required', function(assert) {
    assert.throws(function() {
        new LocalStore({ immediate: true });
    });
});

QUnit.test('LocalStore with data option (T418633)', function(assert) {
    var store = new LocalStore({
        key: 'id',
        name: TEST_NAME,
        immediate: true,
        data: [
            { id: 1, a: 'a' },
            { id: 2, a: 'a' }
        ]
    });
    assert.deepEqual(store._array, [{ id: 1, a: 'a' }, { id: 2, a: 'a' }]);
});

QUnit.test('immediate flush', function(assert) {
    var store1 = new LocalStore({
        key: 'id',
        name: TEST_NAME,
        immediate: true
    });

    store1.insert({ id: 1, a: 'a' });
    store1.insert({ id: 2, a: 'a' });
    store1.update(1, { b: 'b' });
    store1.remove(2);

    var store2 = new LocalStore({ name: TEST_NAME, immediate: true });
    assert.deepEqual(store2._array, [{ id: 1, a: 'a', b: 'b' }]);

    var store3 = new LocalStore({
        name: TEST_NAME,
        immediate: true
    });
    store3.clear();
    assert.deepEqual(store3._array, []);
});
