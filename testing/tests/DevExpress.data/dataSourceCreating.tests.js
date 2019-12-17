var DataSource = require('data/data_source/data_source').DataSource,
    ArrayStore = require('data/array_store'),
    CustomStore = require('data/custom_store'),
    LocalStore = require('data/local_store'),
    ODataStore = require('data/odata/store'),
    ajaxMock = require('../../helpers/ajaxMock.js');

QUnit.test('no options', function(assert) {
    var ds = new DataSource();
    assert.ok(ds.store() instanceof ArrayStore);
});

QUnit.test('empty options', function(assert) {
    var ds = new DataSource({});
    assert.ok(ds.store() instanceof ArrayStore);
});

QUnit.test('options are array', function(assert) {
    var done = assert.async(),
        ds = new DataSource([1, 2, 3]);
    assert.ok(ds.store() instanceof ArrayStore);
    ds.load().done(function(r) {
        assert.deepEqual(r, [1, 2, 3]);
        done();
    });
});

QUnit.test('options are store', function(assert) {
    var store = new ArrayStore([1, 2, 3]),
        ds = new DataSource(store);

    assert.strictEqual(ds.store(), store);
});

QUnit.test('options.store is Store', function(assert) {
    var store = new ArrayStore([1, 2, 3]);
    var ds = new DataSource({ store: store });
    assert.strictEqual(ds.store(), store);
});

QUnit.test('options.store is array', function(assert) {
    var ds = new DataSource({
        store: [1, 2, 3]
    });
    assert.ok(ds.store() instanceof ArrayStore);
});


QUnit.test('options.load provided', function(assert) {
    function loadFunc() {
        return [1, 2, 3];
    }

    var ds = new DataSource({
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
    var ds = new DataSource({
        load: function() { },
        loadMode: 'raw',
        cacheRawData: false
    });

    var store = ds.store();

    assert.equal(store._loadMode, 'raw');
    assert.equal(store._cacheRawData, false);
});

QUnit.test('options.store is ODataStore config', function(assert) {
    var url = 'http://service.test',
        source;

    source = new DataSource({
        store: {
            type: 'odata',
            url: url
        }
    });

    assert.ok(source.store() instanceof ODataStore);
    assert.equal(source.store()._url, url);
});

QUnit.test('options.store is LocalStore config', function(assert) {
    var source = new DataSource({
        store: {
            type: 'local',
            name: 'MyTestStore',
            immediate: true
        }
    });

    assert.ok(source.store() instanceof LocalStore);
});


QUnit.test('options.store is ArrayStore config', function(assert) {
    var source = new DataSource({
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
    var goFurther = assert.async();

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
    var done = assert.async();

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
