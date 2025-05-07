const LocalStore = require('common/data/local_store');

const TEST_NAME = '65DFE188-D178-11E1-A097-51216288709B';
const DX_LOCALSTORAGE_ITEM_NAME = 'dx-data-localStore-' + TEST_NAME;

QUnit.module('LocalStorage', {
    afterEach: function() {
        localStorage.removeItem(DX_LOCALSTORAGE_ITEM_NAME);
    }
});

QUnit.test('name option is required', function(assert) {
    assert.throws(function() {
        new LocalStore({ immediate: true });
    });
});

QUnit.test('LocalStore with data option (T418633)', function(assert) {
    const store = new LocalStore({
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
    const store1 = new LocalStore({
        key: 'id',
        name: TEST_NAME,
        immediate: true
    });

    store1.insert({ id: 1, a: 'a' });
    store1.insert({ id: 2, a: 'a' });
    store1.update(1, { b: 'b' });
    store1.remove(2);

    const store2 = new LocalStore({ name: TEST_NAME, immediate: true });
    assert.deepEqual(store2._array, [{ id: 1, a: 'a', b: 'b' }]);

    const store3 = new LocalStore({
        name: TEST_NAME,
        immediate: true
    });
    store3.clear();
    assert.deepEqual(store3._array, []);
});

QUnit.test('_clearCache must read data from backend', function(assert) {
    const clock = sinon.useFakeTimers();
    const storeName = DX_LOCALSTORAGE_ITEM_NAME;
    const storeData = [
        { id: 1, name: '1' },
        { id: 2, name: '2' }
    ];

    localStorage.removeItem(storeName);

    const store = new LocalStore({
        key: 'id',
        name: TEST_NAME,
        data: []
    });

    localStorage.setItem(
        storeName,
        JSON.stringify(storeData)
    );

    store._clearCache();

    assert.deepEqual(store.createQuery().toArray(), storeData);
    clock.restore();
});

QUnit.test('store methods must get actual data', function(assert) {
    const done = assert.async();
    const clock = sinon.useFakeTimers();
    const storeName = DX_LOCALSTORAGE_ITEM_NAME;
    localStorage.removeItem(storeName);

    const storeData = [
        { id: 0, name: '1' },
        { id: 1, name: '2' },
        { id: 2, name: '3' },
    ];

    const store = new LocalStore({
        key: 'id',
        name: TEST_NAME,
        data: storeData
    });

    assert.deepEqual(storeData, store.createQuery().toArray());

    store.insert({ id: 3, name: '4' }).done(r => {
        assert.deepEqual([...storeData, { id: 3, name: '4' }], store.createQuery().toArray());

        clock.restore();
        done();
    });
});


