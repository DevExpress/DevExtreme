import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import LocalStore from 'common/data/local_store';
import ODataStore from 'common/data/odata/store';
import ajaxMock from '../../helpers/ajaxMock.js';

QUnit.test('no options', function(assert) {
    const ds = new DataSource();
    assert.ok(ds.store() instanceof ArrayStore);
});

QUnit.test('empty options', function(assert) {
    const ds = new DataSource({});
    assert.ok(ds.store() instanceof ArrayStore);
});

QUnit.test('options are array', function(assert) {
    const done = assert.async();
    const ds = new DataSource([1, 2, 3]);
    assert.ok(ds.store() instanceof ArrayStore);
    ds.load().done(function(r) {
        assert.deepEqual(r, [1, 2, 3]);
        done();
    });
});

QUnit.test('options are store', function(assert) {
    const store = new ArrayStore([1, 2, 3]);
    const ds = new DataSource(store);

    assert.strictEqual(ds.store(), store);
});

QUnit.test('options.store is Store', function(assert) {
    const store = new ArrayStore([1, 2, 3]);
    const ds = new DataSource({ store: store });
    assert.strictEqual(ds.store(), store);
});

QUnit.test('options.store is array', function(assert) {
    const ds = new DataSource({
        store: [1, 2, 3]
    });
    assert.ok(ds.store() instanceof ArrayStore);
});


QUnit.test('options.load provided', function(assert) {
    function loadFunc() {
        return [1, 2, 3];
    }

    const ds = new DataSource({
        key: 'key1',
        load: loadFunc,
        sort: 'abc'
    });

    assert.ok(ds.store() instanceof CustomStore);
    assert.equal(ds.store().key(), 'key1');
    assert.equal(ds._storeLoadOptions.sort, 'abc');
    assert.strictEqual(ds.store()._loadFunc, loadFunc);
});

QUnit.test('options.load and raw load mode', function(assert) {
    const ds = new DataSource({
        load: function() { },
        loadMode: 'raw',
        cacheRawData: false
    });

    const store = ds.store();

    assert.equal(store._loadMode, 'raw');
    assert.equal(store._cacheRawData, false);
});

QUnit.test('options.store is ODataStore config', function(assert) {
    const url = 'http://service.test';
    const source = new DataSource({
        store: {
            type: 'odata',
            url: url
        }
    });

    assert.ok(source.store() instanceof ODataStore);
    assert.equal(source.store()._requestDispatcher.url, url);
});

QUnit.test('options.store is LocalStore config', function(assert) {
    const source = new DataSource({
        store: {
            type: 'local',
            name: 'MyTestStore',
            immediate: true
        }
    });

    assert.ok(source.store() instanceof LocalStore);
});


QUnit.test('options.store is ArrayStore config', function(assert) {
    const source = new DataSource({
        store: {
            type: 'array',
            data: [1, 2, 3]
        }
    });

    assert.ok(source.store() instanceof ArrayStore);
    assert.deepEqual(source.store()._array, [1, 2, 3]);
});

QUnit.test('unknown value of options.store.type throws', function(assert) {
    assert.throws(function() {
        new DataSource({
            store: { type: 'unknown' }
        });
    });
});

QUnit.test('create from bare url', function(assert) {
    const goFurther = assert.async();

    ajaxMock.setup({
        url: 'some.url',
        responseText: [1, 2, 3]
    });

    new DataSource('some.url')
        .load().done(function(r) {
            assert.ok(r.length, 3);
        })
        .always(function() {
            ajaxMock.clear();
        })
        .always(goFurther);
});

QUnit.test('create from bare url, JSONP', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'some.url?callback=?',
        responseText: { jsonp: 'works' }
    });

    new DataSource('some.url?callback=?')
        .load()
        .done(function(r) {
            assert.ok(r[0].jsonp, 'works');
        })
        .done(function() {
            ajaxMock.clear();
        })
        .always(done);
});
