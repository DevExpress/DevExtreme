const LocalStore = require('data/local_store');
const DataSource = require("data/data_source");

const TEST_NAME = '65DFE188-D178-11E1-A097-51216288709B';

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

QUnit.test('reload() of DataSource from LocalStore and totalCount() of LocalStore must reread window.localStorage', async function(assert) {
    const storeName = "dx-data-localStore-myTest";
    localStorage.removeItem(storeName);

    const storeData = [{ id: 0, nom: new Date().toISOString() }];
    let store = new LocalStore({
        key: "id",
        name: "myTest",
        immediate: true,
        data: storeData
    });

    let dataSource = new DataSource({
        store: store
    });

    await dataSource.load();

    assert.deepEqual(storeData, dataSource.items());

    // Force data in storage
    localStorage.setItem(
        storeName,
        JSON.stringify([
            { id: 1, nom: "1" },
            { id: 2, nom: "2" }
        ])
    );

    // check local storage
    let dataFromLocalStorage = JSON.parse(localStorage.getItem(storeName));

    await dataSource.reload();

    const updatedDataAfterReload = await dataSource.items();

    assert.deepEqual(dataFromLocalStorage, updatedDataAfterReload);
    assert.equal(dataFromLocalStorage.length, await dataSource.store().totalCount({}));
});
