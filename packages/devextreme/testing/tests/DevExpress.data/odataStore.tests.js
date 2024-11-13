import $ from 'jquery';
import { EdmLiteral } from 'common/data/odata/utils';
import ODataStore from 'common/data/odata/store';
import ODataContext from 'common/data/odata/context';
import Guid from 'core/guid';
import config from 'core/config';
import ErrorHandlingHelper from '../../helpers/data.errorHandlingHelper.js';
import ajaxMock from '../../helpers/ajaxMock.js';

const MUST_NOT_REACH_MESSAGE = 'Shouldn\'t reach this point';

const moduleConfig = {
    afterEach: function() {
        ajaxMock.clear();
    }
};

QUnit.module('ctor');
QUnit.test('use fourth version by default', function(assert) {
    assert.expect(2);

    assert.equal(new ODataStore({ url: 'odata.org/EntitySet/' }).version(), 4);
    assert.equal(new ODataContext({ url: 'odata.org/EntitySet/' }).version(), 4);
});

QUnit.test('fieldTypes are updated correctly', function(assert) {
    const params = [{
        storeOptions: {},
        expectedFieldTypes: {}
    }, {
        storeOptions: {
            keyType: 'Int32'
        },
        expectedFieldTypes: { '5d46402c-7899-4ea9-bd81-8b73c47c7683': 'Int32' }
    }, {
        storeOptions: {
            keyType: 'Int32',
            fieldTypes: { name: 'String' }
        },
        expectedFieldTypes: { name: 'String', '5d46402c-7899-4ea9-bd81-8b73c47c7683': 'Int32' }
    }, {
        storeOptions: {
            keyType: { id1: 'Int32', id2: 'String' }
        },
        expectedFieldTypes: { id1: 'Int32', id2: 'String' }
    }, {
        storeOptions: {
            keyType: { id1: 'Int32', id2: 'String' },
            fieldTypes: { name: 'String' }
        },
        expectedFieldTypes: { id1: 'Int32', id2: 'String', name: 'String' }
    }, {
        storeOptions: {
            key: 'id',
            keyType: 'Int32'
        },
        expectedFieldTypes: { id: 'Int32' }
    }, {
        storeOptions: {
            key: 'id',
            keyType: 'Int32',
            fieldTypes: { name: 'String' }
        },
        expectedFieldTypes: { id: 'Int32', name: 'String' }
    }, {
        storeOptions: {
            key: [ 'id1', 'id2' ],
            keyType: { id1: 'Int32', id2: 'String' }
        },
        expectedFieldTypes: { id1: 'Int32', id2: 'String' }
    }, {
        storeOptions: {
            key: [ 'id1', 'id2' ],
            keyType: { id1: 'Int32', id2: 'String' },
            fieldTypes: { name: 'String' }
        },
        expectedFieldTypes: { id1: 'Int32', id2: 'String', name: 'String' }
    }, {
        storeOptions: {
            key: [ 'id1', 'id2' ],
            keyType: { id1: 'Int32', id2: 'String' },
            fieldTypes: { id1: 'String' }
        },
        expectedFieldTypes: { id1: 'String', id2: 'String' }
    }];

    params.map(function(param) {
        assert.deepEqual(new ODataStore(param.storeOptions)._fieldTypes, param.expectedFieldTypes);
    });

});

QUnit.test('options are not changed after the merger', function(assert) {
    const storeOptions = {
        key: [ 'id1', 'id2' ],
        keyType: { id1: 'Int32', id2: 'String' },
        fieldTypes: { id1: 'String' }
    };

    new ODataStore(storeOptions);

    assert.deepEqual(storeOptions.keyType, { id1: 'Int32', id2: 'String' });
    assert.deepEqual(storeOptions.fieldTypes, { id1: 'String' });
});

// TODO: Publish `url` method
QUnit.skip('strips trailing slash', function(assert) {
    assert.expect(1);
    assert.equal(new ODataStore({ url: 'odata.org/EntitySet/' }).url(), 'odata.org/EntitySet');
});

QUnit.module('load', moduleConfig);
QUnit.test('works', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        callback: function(bag) { this.responseText = { d: { results: [bag] } }; }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        callback: function(bag) { this.responseText = { value: [bag] }; }
    });

    const promises = [
        new ODataStore({ url: 'odata2.org' })
            .load()
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    'accepts': {
                        'json': 'application/json;odata=verbose,text/plain'
                    },
                    'async': true,
                    'contentType': false,
                    'data': {},
                    'dataType': 'json',
                    'headers': {},
                    'jsonp': undefined,
                    'timeout': 30000,
                    'method': 'get',
                    'url': 'odata2.org',
                    'xhrFields': {
                        'withCredentials': undefined
                    }
                }]);
            }),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .load()
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    'accepts': {
                        'json': 'application/json;odata=verbose,text/plain'
                    },
                    'async': true,
                    'contentType': false,
                    'data': {},
                    'dataType': 'json',
                    'headers': {},
                    'jsonp': undefined,
                    'timeout': 30000,
                    'method': 'get',
                    'url': 'odata2.org',
                    'xhrFields': {
                        'withCredentials': undefined
                    }
                }]);
            }),

        new ODataStore({ version: 4, url: 'odata4.org' })
            .load()
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    'accepts': {
                        'json': 'application/json;odata=verbose,text/plain'
                    },
                    'async': true,
                    'contentType': false,
                    'data': {},
                    'dataType': 'json',
                    'headers': {},
                    'jsonp': undefined,
                    'timeout': 30000,
                    'method': 'get',
                    'url': 'odata4.org',
                    'xhrFields': {
                        'withCredentials': undefined
                    }
                }]);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('with params', function(assert) {
    assert.expect(6);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        callback: function(bag) {
            this.responseText = { d: { results: [bag.data] } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org(e=4)',
        callback: function(bag) {
            this.responseText = { value: [bag.data] };
        }
    });

    const options = {
        sort: {
            field: 'a',
            desc: true
        },
        filter: ['b', 1],
        select: ['c', 'd'],
        customQueryParams: { e: 4 }
    };

    const promises = [
        new ODataStore({ version: 2, url: 'odata2.org' })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    '$orderby': 'a desc',
                    '$filter': 'b eq 1',
                    '$select': 'c,d',
                    e: '4'
                }]);
            }),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    '$orderby': 'a desc',
                    '$filter': 'b eq 1',
                    '$select': 'c,d',
                    e: '4'
                }]);
            }),

        new ODataStore({ url: 'odata4.org' })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    '$orderby': 'a desc',
                    '$filter': 'b eq 1',
                    '$select': 'c,d'
                }]);
            }),
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('with explicit expand', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            this.responseText = { d: { results: [bag.data['$expand']] } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        callback: function(bag) {
            this.responseText = { value: [bag.data['$expand']] };
        }
    });

    const options = { expand: ['a', 'b.c'] };

    const promises = [
        new ODataStore({ version: 2, url: 'odata.org' })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, ['a,b/c']);
            }),

        new ODataStore({ url: 'odata4.org' })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, ['a,b($expand=c)']);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('with requireTotalCount', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            this.responseText = { d: { results: [bag.data['$inlinecount']], '__count': 123 } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        callback: function(bag) {
            this.responseText = { value: [bag.data['$count']], '@odata.count': 123 };
        }
    });

    const promises = [
        new ODataStore({ version: 2, url: 'odata.org' })
            .load({ requireTotalCount: true })
            .done(function(r, extra) {
                assert.deepEqual(r, ['allpages']);
                assert.deepEqual(extra, {
                    totalCount: 123
                });
            }),

        new ODataStore({ url: 'odata4.org' })
            .load({ requireTotalCount: true })
            .done(function(r, extra) {
                assert.deepEqual(r, ['true']);
                assert.deepEqual(extra, {
                    totalCount: 123
                });
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module('totalCount', moduleConfig);
QUnit.test('works', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        responseText: { d: { '__count': 123 } }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        responseText: { '@odata.count': 123 }
    });

    const assertFunc = function(count) { assert.equal(count, 123); };
    const promises = [
        new ODataStore({ version: 2, url: 'odata2.org' })
            .totalCount()
            .done(assertFunc),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .totalCount()
            .done(assertFunc),

        new ODataStore({ url: 'odata4.org' })
            .totalCount()
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});
QUnit.test('respects customQueryParams (T413790)', function(assert) {
    const done = assert.async();
    let capturedAjaxSettings;

    ajaxMock.setup({
        url: 'example.com',
        callback: function(settings) {
            capturedAjaxSettings = settings;
            this.responseText = {
                d: { __count: 123 }
            };
        }
    });

    new ODataStore({ version: 2, url: 'example.com' })
        .totalCount({
            customQueryParams: {
                p1: 42
            }
        })
        .done(function(count) {
            assert.equal(count, 123);
            assert.equal(capturedAjaxSettings.data.p1, 42);
            done();
        });
});

QUnit.module('byKey', moduleConfig);
QUnit.test('works', function(assert) {
    assert.expect(3);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org(42)',
        responseText: { d: { foo: 'bar' } }
    });

    ajaxMock.setup({
        url: 'odata4.org(42)',
        responseText: { value: { foo: 'bar' } }
    });

    const assertFunc = function(r) { assert.deepEqual(r, { foo: 'bar' }); };
    const promises = [
        new ODataStore({ url: 'odata2.org' })
            .byKey(42)
            .done(assertFunc),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .byKey(42)
            .done(assertFunc),

        new ODataStore({ version: 4, url: 'odata4.org' })
            .byKey(42)
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('with expand', function(assert) {
    assert.expect(3);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org(42)',
        callback: function(bag) {
            this.responseText = { d: { expandClause: bag.data.$expand } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org(42)',
        callback: function(bag) {
            this.responseText = { value: { expandClause: bag.data.$expand } };
        }
    });

    const assertFunc = function(r) {
        assert.deepEqual(r, { expandClause: 'prop1/subprop,prop2' });
    };

    const promises = [
        new ODataStore({ url: 'odata2.org', version: 2 })
            .byKey(42, { expand: ['prop1.subprop', 'prop2'] })
            .done(assertFunc),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .byKey(42, { expand: ['prop1.subprop', 'prop2'] })
            .done(assertFunc),

        new ODataStore({ url: 'odata4.org' })
            .byKey(42, { expand: ['prop1.subprop', 'prop2'] })
            .done((value) => {
                assert.deepEqual(value, { expandClause: 'prop1($expand=subprop),prop2' });
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('expand should be undefined if it is not specified in the extraOptions', function(assert) {
    assert.expect(1);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org(42)',
        callback: function(bag) {
            assert.deepEqual(bag.data.$expand, undefined);
        }
    });


    new ODataStore({ url: 'odata2.org' })
        .byKey(42, { select: ['prop1'] })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);

});

QUnit.test('with select', function(assert) {
    assert.expect(3);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org(42)',
        callback: function(bag) {
            this.responseText = { d: { selectClause: bag.data.$select } };
        }
    });

    ajaxMock.setup({
        url: 'odata3.org(42)',
        callback: function(bag) {
            this.responseText = { d: { expandClause: bag.data.$expand, selectClause: bag.data.$select } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org(42)',
        callback: function(bag) {
            this.responseText = { value: { selectClause: bag.data.$select } };
        }
    });

    const promises = [
        new ODataStore({ url: 'odata2.org' })
            .byKey(42, { select: ['prop1', 'prop2'] })
            .done((value) => {
                assert.deepEqual(value, { selectClause: 'prop1,prop2' });
            }),

        new ODataStore({ version: 3, url: 'odata3.org' })
            .byKey(42, { expand: ['prop1'], select: ['prop1.subprop', 'prop2'] })
            .done((value) => {
                assert.deepEqual(value, { expandClause: 'prop1', selectClause: 'prop1/subprop,prop2' });
            }),

        new ODataStore({ version: 4, url: 'odata4.org' })
            .byKey(42, { select: ['prop1.subprop', 'prop2'] })
            .done((value) => {
                assert.deepEqual(value, { selectClause: 'prop2' });
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('compound key', function(assert) {
    assert.expect(3);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org*',
        callback: function(bag) {
            this.responseText = { d: { url: bag.url } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org*',
        callback: function(bag) {
            this.responseText = { value: { url: bag.url } };
        }
    });

    const assertFunc = function(r) {
        const url = decodeURIComponent(r.url);
        assert.equal(url.indexOf('(key1=42,key2=\'abc\')'), 10);
    };

    const promises = [
        new ODataStore({ version: 2, url: 'odata2.org' })
            .byKey({ key1: 42, key2: 'abc' })
            .done(assertFunc),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .byKey({ key1: 42, key2: 'abc' })
            .done(assertFunc),

        new ODataStore({ url: 'odata4.org' })
            .byKey({ key1: 42, key2: 'abc' })
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('original compound key value doesn\'t change', function(assert) {
    const done = assert.async();

    const key = { key1: 37, key2: 73 };

    ajaxMock.setup({
        url: '*',
        callback: function(bag) {
            this.responseText = { value: bag };
        }
    });

    new ODataStore({ version: 4, url: 'odata.org', keyType: { key1: 'Decimal', key2: 'Single' } })
        .byKey(key)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.deepEqual(key, { key1: 37, key2: 73 });
        })
        .always(done);
});

QUnit.test('unknown key type throws', function(assert) {
    assert.throws(function() {
        new ODataStore({ keyType: '?' }).byKey(1);
    });
});

QUnit.test('Guid as key', function(assert) {
    const done = assert.async();

    const guid = '3f17117f-63b1-ee7d-2b64-a7f717177773';

    ajaxMock.setup({
        url: 'odata2.org*',
        callback: function(bag) {
            this.responseText = { d: { url: bag.url } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org*',
        callback: function(bag) {
            this.responseText = { value: { url: bag.url } };
        }
    });

    const promises = [
        new ODataStore({ version: 2, url: 'odata2.org' })
            .byKey(new Guid(guid))
            .done(function(r) {
                assert.ok(r.url.indexOf('(guid\'' + guid + '\')') > -1);
            }),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .byKey(new Guid(guid))
            .done(function(r) {
                assert.ok(r.url.indexOf('(guid\'' + guid + '\')') > -1);
            }),

        new ODataStore({ url: 'odata4.org' })
            .byKey(new Guid(guid))
            .done(function(r) {
                assert.strictEqual(r.url.indexOf('(guid\'' + guid + '\')'), -1);
                assert.ok(r.url.indexOf(guid) > 1);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('string as key', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org*',
        callback: function(bag) {
            this.responseText = { d: { url: bag.url } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org*',
        callback: function(bag) {
            this.responseText = { value: { url: bag.url } };
        }
    });

    const assertFunc = function(r) {
        const url = decodeURIComponent(r.url);
        assert.equal(url.indexOf('(\'abc\')'), 10);
    };

    const promises = [
        new ODataStore({ url: 'odata2.org' })
            .byKey('abc')
            .done(assertFunc),

        new ODataStore({ version: 3, url: 'odata2.org' })
            .byKey('abc')
            .done(assertFunc),

        new ODataStore({ version: 4, url: 'odata4.org' })
            .byKey('abc')
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('key type conversions by keyType option', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org*',
        callback: function(bag) {
            this.responseText = { d: { url: bag.url } };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org*',
        callback: function(bag) {
            this.responseText = { url: bag.url };
        }
    });

    const promises = [
        // v2 and v3
        new ODataStore({ version: 2, url: 'odata.org', keyType: 'Int32' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(42)') > -1);
            }),

        new ODataStore({ version: 2, url: 'odata.org', keyType: 'Int64' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(42L)') > -1);
            }),

        new ODataStore({ version: 2, url: 'odata.org', keyType: 'Guid' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(guid\'42000000-0000-0000-0000-000000000000\')') > -1);
            }),

        new ODataStore({ version: 2, url: 'odata.org', keyType: 'String' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(\'42\')') > -1);
            }),

        // v4
        new ODataStore({ url: 'odata4.org', keyType: 'Int32' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(42)') > -1);
            }),

        new ODataStore({ url: 'odata4.org', keyType: 'Int64' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(42L)') > -1);
            }),

        new ODataStore({ url: 'odata4.org', keyType: 'Guid' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(42000000-0000-0000-0000-000000000000)') > -1);
            }),

        new ODataStore({ url: 'odata4.org', keyType: 'String' })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(\'42\')') > -1);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('Should show E4024 error when searching or filtering an Int32 field (T848126)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org'
    });

    const store = new ODataStore({
        url: 'odata.org',
        key: ['id1'],
        keyType: { id: 'Int32' }
    });

    function assertFunc(message, operation) {
        assert.equal(message.replace(/\d+_\d+/, '[VERSION]'),
            `E4024 - String function ${operation} cannot be used with the data field id of type Int32.\n\nFor additional information on this error message, see: https://js.devexpress.com/error/[VERSION]/E4024`);
    }

    const promises = [
        store
            .load({
                filter: ['id', 'contains', '123']
            })
            .fail(function(error) {
                assertFunc(error.message, 'contains');
            }),
        store
            .load({
                filter: ['id', 'startswith', '123']
            })
            .fail(function(error) {
                assertFunc(error.message, 'startswith');
            }),
        store
            .load({
                filter: ['id', 'endswith', '123']
            })
            .fail(function(error) {
                assertFunc(error.message, 'endswith');
            }),
        store
            .load({
                filter: ['id', 'notcontains', '123']
            })
            .fail(function(error) {
                assertFunc(error.message, 'notcontains');
            }),
    ];

    $.when.apply($, promises)
        .always(done);
});

QUnit.test('no double conversion for Int64', function(assert) {
    assert.expect(2);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org*',
        callback: function(bag) { this.responseText = { d: { url: bag.url } }; }
    });

    ajaxMock.setup({
        url: 'odata4.org*',
        callback: function(bag) { this.responseText = { url: bag.url }; }
    });


    const assertFunc = function(r) { assert.ok(r.url.indexOf('(123L)') > -1); };
    const promises = [
        new ODataStore({ url: 'odata2.org', keyType: 'Int64' })
            .byKey(new EdmLiteral('123L'))
            .done(assertFunc),

        new ODataStore({ version: 4, url: 'odata2.org', keyType: 'Int64' })
            .byKey(new EdmLiteral('123L'))
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('key type conversions by fieldTypes option', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata4.org*',
        callback: function(bag) {
            this.responseText = { url: bag.url };
        }
    });

    const promises = [
        new ODataStore({ url: 'odata4.org', key: 'id', fieldTypes: { id: 'Int64' } })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(42L)') > -1, 'String key');
            }),
        new ODataStore({ url: 'odata4.org', keyType: 'Int64', fieldTypes: { name: 'String' } })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(42L)') > -1, 'Without key with string keyType');
            }),
        new ODataStore({ url: 'odata4.org', key: ['id1', 'id2'], fieldTypes: { id1: 'Int64', id2: 'String', name: 'String' } })
            .byKey({ id1: 42, id2: 53 })
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(id1=42L,id2=\'53\')') > -1, 'Complex key');
            }),
        new ODataStore({ version: 4, url: 'odata4.org', key: ['id1', 'id2'], keyType: { id1: 'Int64' }, fieldTypes: { id2: 'String' } })
            .byKey({ id1: 42, id2: 53 })
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(id1=42L,id2=\'53\')') > -1, 'Complex key with keyType');
            }),
        new ODataStore({ version: 4, url: 'odata4.org', keyType: { id1: 'Int64', id2: 'String' }, fieldTypes: { name: 'String' } })
            .byKey({ id1: 42, id2: 53 })
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf('(id1=42L,id2=\'53\')') > -1, 'Complex key without key option');
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module('key type conversions', moduleConfig);
QUnit.test('the request with filter is correct if key type is Int64, Decimal or Single (T346008)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        callback: function(bag) {
            this.responseText = { filter: bag.data.$filter };
        }
    });

    const store = new ODataStore({
        url: 'odata.org',
        key: ['id1', 'id2', 'id3'],
        keyType: { id1: 'Int64', id2: 'Decimal', id3: 'Single' }
    });

    const promises = [
        store
            .load({
                filter: ['id1', '=', '123']
            })
            .done(function(r) {
                assert.equal(r.filter, 'id1 eq 123L');
            }),
        store
            .load({
                filter: ['id2', '=', '123']
            })
            .done(function(r) {
                assert.equal(r.filter, 'id2 eq 123m');
            }),
        store
            .load({
                filter: ['id3', '=', '123']
            })
            .done(function(r) {
                assert.equal(r.filter, 'id3 eq 123f');
            }),

        new ODataStore({
            url: 'odata.org',
            key: 'id',
            keyType: 'Int64'
        })
            .load({
                filter: ['id', '=', '123']
            })
            .done(function(r) {
                assert.equal(r.filter, 'id eq 123L');
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('Guid key processed as string if key type is String (T316902)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            result: [{
                id1: '01234567-89ab-cdef-0123-456789abcdef',
                id2: '11234567-89ab-cdef-0123-456789abcdef'
            }]
        }
    });

    const promises = [
        new ODataStore({
            url: 'odata.org',
            key: 'id1',
            keyType: 'String'
        })
            .load()
            .done(function(r) {
                assert.equal(typeof r.result[0].id1, 'string');
            }),

        new ODataStore({
            url: 'odata.org',
            key: ['id1', 'id2'],
            keyType: { id1: 'String', id2: 'Guid' }
        })
            .load()
            .done(function(r) {
                assert.equal(typeof r.result[0].id1, 'string');
                assert.equal(typeof r.result[0].id2, 'object');
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});


QUnit.module('insert', moduleConfig);
QUnit.test('requires key', function(assert) {
    assert.throws(function() {
        new ODataStore({ url: 'odata.org' }).insert({});
    });
});

QUnit.test('works', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        // NOTE:
        // A request returns 204 No Content if the requested resource has the null value, or if the service applies a return=minimal preference.
        // In this case, the response body MUST be empty.
        responseText: { id: 1, foo: 'bar' }
    });

    const logger = [];
    const store = new ODataStore({
        key: 'id',
        url: 'odata.org',

        beforeSend: function(request) {
            assert.equal(request.url, 'odata.org');
            assert.equal(request.method.toLowerCase(), 'post');
        },

        onInserting: function(data) { logger.push(['onInserting', data]); },
        onInserted: function(data, key) { logger.push(['onInserted', data, key]); }
    });

    store.on('inserting', function(data) { logger.push(['inserting', data]); });
    store.on('inserted', function(data, key) { logger.push(['inserted', data, key]); });

    store.insert({ id: 1, foo: 'bar' })
        .fail(function() { assert.fail(false, MUST_NOT_REACH_MESSAGE); })
        .done(function(data, key) { logger.push(['done', data, key]); })
        .done(function() {
            assert.deepEqual(logger, [
                ['onInserting', { id: 1, foo: 'bar' }],
                ['inserting', { id: 1, foo: 'bar' }],

                ['onInserted', { id: 1, foo: 'bar' }, 1],
                ['inserted', { id: 1, foo: 'bar' }, 1],

                ['done', { id: 1, foo: 'bar' }, 1]
            ]);
        })
        .always(done);
});

QUnit.test('works with useLegacyStoreResult', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        // NOTE:
        // A request returns 204 No Content if the requested resource has the null value, or if the service applies a return=minimal preference.
        // In this case, the response body MUST be empty.
        responseText: { id: 1, foo: 'bar' }
    });

    const oldUseLegacyStoreResult = config().useLegacyStoreResult;

    config({ useLegacyStoreResult: true });

    const logger = [];
    const store = new ODataStore({
        key: 'id',
        url: 'odata.org',

        beforeSend: function(request) {
            assert.equal(request.url, 'odata.org');
            assert.equal(request.method.toLowerCase(), 'post');
        },

        onInserting: function(data) { logger.push(['onInserting', data]); },
        onInserted: function(data, key) { logger.push(['onInserted', data, key]); }
    });

    store.on('inserting', function(data) { logger.push(['inserting', data]); });
    store.on('inserted', function(data, key) { logger.push(['inserted', data, key]); });

    store.insert({ id: 1, foo: 'bar' })
        .fail(function() { assert.fail(false, MUST_NOT_REACH_MESSAGE); })
        .done(function(data, key) { logger.push(['done', data, key]); })
        .done(function() {
            assert.deepEqual(logger, [
                ['onInserting', { id: 1, foo: 'bar' }],
                ['inserting', { id: 1, foo: 'bar' }],

                ['onInserted', { id: 1, foo: 'bar' }, 1],
                ['inserted', { id: 1, foo: 'bar' }, 1],

                ['done', { id: 1, foo: 'bar' }, 1]
            ]);
        })
        .always(function() {
            config({ useLegacyStoreResult: oldUseLegacyStoreResult });
        })
        .always(done);
});

QUnit.test('insert with compound key', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { id: { foo: 'bar', bar: 'foo' } }
    });

    const store = new ODataStore({
        url: 'odata.org',
        key: 'id'
    });

    store.insert({ id: { foo: 'bar', bar: 'foo' } })
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .done(function(data, key) {
            assert.deepEqual(key, { foo: 'bar', bar: 'foo' });
        })
        .always(done);
});

QUnit.test('with 201 status', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        status: 201,
        // NOTE: From OData protocol:
        // ...returns 201 Created. In this case, the response body MUST contain the resource created.
        responseText: { id: 1 }
    });

    const store = new ODataStore({
        url: 'odata.org',
        key: 'id'
    });

    store.insert({ id: 1 })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(data, key) {
            assert.equal(key, 1);
        })
        .always(done);
});

QUnit.module('update', moduleConfig);

QUnit.test('works', function(assert) {
    assert.expect(17);

    const done = assert.async();

    const log = [];
    const compileLoggerFor = function(eventName) {
        return function(key, values) {
            log.push([eventName, key, values]);
        };
    };

    ajaxMock.setup({
        url: 'odata.org/DataSet*',
        status: 204,
        responseText: { foo: 'bar' }
    });

    ajaxMock.setup({
        url: 'odata2.org/DataSet*',
        status: 204,
        responseText: 'OK'
    });

    const promises = [
        new ODataStore({
            version: 2,
            url: 'odata.org/DataSet',

            beforeSend: function(request) {
                assert.equal(request.url, 'odata.org/DataSet(1)');
                assert.equal(request.method.toLowerCase(), 'merge');

                assert.deepEqual(request.params, {});
                assert.deepEqual(request.payload, { foo: 'bar' });
            },

            onUpdating: compileLoggerFor('onUpdating'),
            onUpdated: compileLoggerFor('onUpdated')

        }).on('updating', compileLoggerFor('updating'))
            .on('updated', compileLoggerFor('updated'))
            .update(1, { foo: 'bar' })
            .done(compileLoggerFor('done')),

        new ODataStore({
            version: 3,
            url: 'odata.org/DataSet',

            beforeSend: function(request) {
                assert.equal(request.url, 'odata.org/DataSet(1)');
                assert.equal(request.method.toLowerCase(), 'patch');

                assert.deepEqual(request.params, {});
                assert.deepEqual(request.payload, { foo: 'bar' });
            },

            onUpdating: compileLoggerFor('onUpdating'),
            onUpdated: compileLoggerFor('onUpdated')

        }).on('updating', compileLoggerFor('updating'))
            .on('updated', compileLoggerFor('updated'))
            .update(1, { foo: 'bar' })
            .done(compileLoggerFor('done')),

        new ODataStore({
            url: 'odata.org/DataSet',

            beforeSend: function(request) {
                assert.equal(request.url, 'odata.org/DataSet(1)');
                assert.equal(request.method.toLowerCase(), 'patch');

                assert.deepEqual(request.params, {});
                assert.deepEqual(request.payload, { foo: 'bar' });
            },

            onUpdating: compileLoggerFor('onUpdating'),
            onUpdated: compileLoggerFor('onUpdated')

        }).on('updating', compileLoggerFor('updating'))
            .on('updated', compileLoggerFor('updated'))
            .update(1, { foo: 'bar' })
            .done(compileLoggerFor('done')),

        new ODataStore({
            url: 'odata2.org/DataSet',

            beforeSend: function(request) {
                assert.equal(request.url, 'odata2.org/DataSet(1)');
                assert.equal(request.method.toLowerCase(), 'patch');

                assert.deepEqual(request.params, {});
                assert.deepEqual(request.payload, { foo: 'bar' });
            },

            onUpdating: compileLoggerFor('onUpdating'),
            onUpdated: compileLoggerFor('onUpdated')

        }).on('updating', compileLoggerFor('updating'))
            .on('updated', compileLoggerFor('updated'))
            .update(1, { foo: 'bar' })
            .done(compileLoggerFor('done'))
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .done(function() {
            assert.deepEqual(log, [
                ['onUpdating', 1, { foo: 'bar' }],
                ['updating', 1, { foo: 'bar' }],

                ['onUpdating', 1, { foo: 'bar' }],
                ['updating', 1, { foo: 'bar' }],

                ['onUpdating', 1, { foo: 'bar' }],
                ['updating', 1, { foo: 'bar' }],

                ['onUpdating', 1, { foo: 'bar' }],
                ['updating', 1, { foo: 'bar' }],

                ['onUpdated', 1, { foo: 'bar' }],
                ['updated', 1, { foo: 'bar' }],
                ['done', { foo: 'bar' }, 1],

                ['onUpdated', 1, { foo: 'bar' }],
                ['updated', 1, { foo: 'bar' }],
                ['done', { foo: 'bar' }, 1],

                ['onUpdated', 1, { foo: 'bar' }],
                ['updated', 1, { foo: 'bar' }],
                ['done', { foo: 'bar' }, 1],

                ['onUpdated', 1, { foo: 'bar' }],
                ['updated', 1, { foo: 'bar' }],
                ['done', 'OK', 1]

            ]);
        })
        .always(done);
});

QUnit.test('works with useLegacyStoreResult', function(assert) {
    assert.expect(13);

    const done = assert.async();

    const log = [];
    const compileLoggerFor = function(eventName) {
        return function(key, values) {
            log.push([eventName, key, values]);
        };
    };

    ajaxMock.setup({
        url: 'odata.org/DataSet*',
        status: 204,
        responseText: 'OK'
    });

    const oldUseLegacyStoreResult = config().useLegacyStoreResult;

    config({ useLegacyStoreResult: true });

    const promises = [
        new ODataStore({
            version: 2,
            url: 'odata.org/DataSet',

            beforeSend: function(request) {
                assert.equal(request.url, 'odata.org/DataSet(1)');
                assert.equal(request.method.toLowerCase(), 'merge');

                assert.deepEqual(request.params, {});
                assert.deepEqual(request.payload, { foo: 'bar' });
            },

            onUpdating: compileLoggerFor('onUpdating'),
            onUpdated: compileLoggerFor('onUpdated')

        }).on('updating', compileLoggerFor('updating'))
            .on('updated', compileLoggerFor('updated'))
            .update(1, { foo: 'bar' })
            .done(compileLoggerFor('done')),

        new ODataStore({
            version: 3,
            url: 'odata.org/DataSet',

            beforeSend: function(request) {
                assert.equal(request.url, 'odata.org/DataSet(1)');
                assert.equal(request.method.toLowerCase(), 'patch');

                assert.deepEqual(request.params, {});
                assert.deepEqual(request.payload, { foo: 'bar' });
            },

            onUpdating: compileLoggerFor('onUpdating'),
            onUpdated: compileLoggerFor('onUpdated')

        }).on('updating', compileLoggerFor('updating'))
            .on('updated', compileLoggerFor('updated'))
            .update(1, { foo: 'bar' })
            .done(compileLoggerFor('done')),

        new ODataStore({
            url: 'odata.org/DataSet',

            beforeSend: function(request) {
                assert.equal(request.url, 'odata.org/DataSet(1)');
                assert.equal(request.method.toLowerCase(), 'patch');

                assert.deepEqual(request.params, {});
                assert.deepEqual(request.payload, { foo: 'bar' });
            },

            onUpdating: compileLoggerFor('onUpdating'),
            onUpdated: compileLoggerFor('onUpdated')

        }).on('updating', compileLoggerFor('updating'))
            .on('updated', compileLoggerFor('updated'))
            .update(1, { foo: 'bar' })
            .done(compileLoggerFor('done'))
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .done(function() {
            assert.deepEqual(log, [
                ['onUpdating', 1, { foo: 'bar' }],
                ['updating', 1, { foo: 'bar' }],

                ['onUpdating', 1, { foo: 'bar' }],
                ['updating', 1, { foo: 'bar' }],

                ['onUpdating', 1, { foo: 'bar' }],
                ['updating', 1, { foo: 'bar' }],

                ['onUpdated', 1, { foo: 'bar' }],
                ['updated', 1, { foo: 'bar' }],
                ['done', 1, { foo: 'bar' }],

                ['onUpdated', 1, { foo: 'bar' }],
                ['updated', 1, { foo: 'bar' }],
                ['done', 1, { foo: 'bar' }],

                ['onUpdated', 1, { foo: 'bar' }],
                ['updated', 1, { foo: 'bar' }],
                ['done', 1, { foo: 'bar' }]
            ]);
        })
        .always(function() {
            config({ useLegacyStoreResult: oldUseLegacyStoreResult });
        })
        .always(done);
});

QUnit.module('remove', moduleConfig);
QUnit.test('works', function(assert) {
    const done = assert.async();

    const log = [];
    const compileHandlerFor = function(eventName) {
        return function(key) {
            log.push([eventName, key]);
        };
    };

    ajaxMock.setup({
        url: 'odata2.org/DataSet(1)',
        responseText: {}
    });

    ajaxMock.setup({
        url: 'odata4.org/DataSet(1)',
        responseText: {}
    });

    const handleBeforeSend = function(request) {
        assert.strictEqual(request.url.indexOf('DataSet(1)'), 11);
        assert.equal(request.method.toLowerCase(), 'delete');
    };

    const promises = [
        new ODataStore({ url: 'odata2.org/DataSet', beforeSend: handleBeforeSend, onRemoving: compileHandlerFor('onRemoving'), onRemoved: compileHandlerFor('onRemoved') })
            .on('removing', compileHandlerFor('removing'))
            .on('removed', compileHandlerFor('removed'))
            .remove(1)
            .done(compileHandlerFor('done')),

        new ODataStore({ version: 3, url: 'odata2.org/DataSet', beforeSend: handleBeforeSend, onRemoving: compileHandlerFor('onRemoving'), onRemoved: compileHandlerFor('onRemoved') })
            .on('removing', compileHandlerFor('removing'))
            .on('removed', compileHandlerFor('removed'))
            .remove(1)
            .done(compileHandlerFor('done')),

        new ODataStore({ version: 4, url: 'odata4.org/DataSet', beforeSend: handleBeforeSend, onRemoving: compileHandlerFor('onRemoving'), onRemoved: compileHandlerFor('onRemoved') })
            .on('removing', compileHandlerFor('removing'))
            .on('removed', compileHandlerFor('removed'))
            .remove(1)
            .done(compileHandlerFor('done'))
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(function() {
            assert.deepEqual(log, [
                ['onRemoving', 1],
                ['removing', 1],

                ['onRemoving', 1],
                ['removing', 1],

                ['onRemoving', 1],
                ['removing', 1],

                ['onRemoved', 1],
                ['removed', 1],
                ['done', 1],

                ['onRemoved', 1],
                ['removed', 1],
                ['done', 1],

                ['onRemoved', 1],
                ['removed', 1],
                ['done', 1]
            ]);
        })
        .always(done);
});

QUnit.module('Serialization', moduleConfig);
QUnit.test('Dates, on loading', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        callback: function(bag) {
            assert.equal(bag.data.$filter, 'date eq datetime\'1945-05-09T14:25:01.001\'', 'timezoneless iso8601 for second version');
        }
    });

    ajaxMock.setup({
        url: 'odata2.org/methodToGet',
        responseText: {},
        callback: function(bag) {
            assert.equal(bag.data.date, 'datetime\'1945-05-09T14:25:01.001\'', 'timezoneless iso8601 for second version');
        }
    });

    ajaxMock.setup({
        url: 'odata2.org/methodToInvoke*',
        responseText: {},
        callback: function(bag) {
            assert.equal(decodeURIComponent(bag.url), 'odata2.org/methodToInvoke?date=datetime\'1945-05-09T14:25:01.001\'');
        }
    });

    // NOTE: OData 3 ABNF
    ajaxMock.setup({
        url: 'odata3.org',
        callback: function(bag) {
            assert.equal(bag.data.$filter, 'date eq datetime\'1945-05-09T14:25:01.001\'', 'timezoneless iso8601 for third version');
        }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        callback: function(bag) {
            assert.equal(bag.data.$filter, 'date eq 1945-05-09T14:25:01.001Z', 'timezoneful iso8601 for fourth version');
        }
    });

    ajaxMock.setup({
        url: 'odata4.org/function*',
        responseText: {},
        callback: function(bag) {
            assert.equal(bag.url, 'odata4.org/function(date=1945-05-09T14:25:01.001Z)', 'timezoneful iso8601 for fourth version');
        }
    });

    ajaxMock.setup({
        url: 'odata4.org/action',
        responseText: {},
        callback: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.001Z"}', 'timezoneful iso8601 for fourth version');
        }
    });

    const promises = [
        // v2
        new ODataStore({ version: 2, url: 'odata2.org', key: 'id' })
            .load({ filter: ['date', new Date(1945, 4, 9, 14, 25, 1, 1)] }),

        new ODataContext({ version: 2, url: 'odata2.org' })
            .get('methodToGet', { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataContext({ version: 2, url: 'odata2.org' })
            .invoke('methodToInvoke', { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        // v3
        new ODataStore({ version: 3, url: 'odata3.org', key: 'id' })
            .load({ filter: ['date', new Date(1945, 4, 9, 14, 25, 1, 1)] }),

        // v4
        new ODataStore({ url: 'odata4.org', key: 'id' })
            .load({ filter: ['date', new Date(1945, 4, 9, 14, 25, 1, 1)] }),

        new ODataContext({ url: 'odata4.org' })
            .get('function', { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataContext({ url: 'odata4.org' })
            .invoke('action', { date: new Date(1945, 4, 9, 14, 25, 1, 1) })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('Dates, on inserting', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org',
        callback: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.001"}', 'timezoneless iso8601 for second version');
        }
    });

    ajaxMock.setup({
        url: 'odata3.org',
        callback: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.001Z"}', 'timezoneful iso8601 for third version');
        }
    });

    ajaxMock.setup({
        url: 'odata4.org',
        callback: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.001Z"}', 'timezoneful iso8601 for fourth version');
        }
    });

    const promises = [
        new ODataStore({ version: 2, url: 'odata2.org', key: 'id' })
            .insert({ date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ version: 3, url: 'odata3.org', key: 'id' })
            .insert({ date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ url: 'odata4.org', key: 'id' })
            .insert({ date: new Date(1945, 4, 9, 14, 25, 1, 1) })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test('Dates, on updating', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata2.org(1)',
        callback: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.001"}', 'timezoneless iso8601 for second version');
        }
    });

    ajaxMock.setup({
        url: 'odata3.org(1)',
        callback: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.001Z"}', 'timezoneful iso8601 for third version');
        }
    });

    ajaxMock.setup({
        url: 'odata4.org(1)',
        callback: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.001Z"}', 'timezoneful iso8601 for fourth version');
        }
    });

    const promises = [
        new ODataStore({ version: 2, url: 'odata2.org', key: 'id' })
            .update(1, { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ version: 3, url: 'odata3.org', key: 'id' })
            .update(1, { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ url: 'odata4.org', key: 'id' })
            .update(1, { date: new Date(1945, 4, 9, 14, 25, 1, 1) })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module('Deserialization', moduleConfig);
QUnit.test('Dates, disableable, ODataStore', function(assert) {
    assert.expect(2);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { value: [{ dateProperty: '1945-05-09T14:25:12.1234567Z' }] }
    });

    ajaxMock.setup({
        url: 'odata.org(1)',
        responseText: { dateProperty: '1945-05-09T14:25:12.1234567Z' }
    });

    const store = new ODataStore({ version: 4, url: 'odata.org', deserializeDates: false });
    const promises = [
        store.load()
            .done(function(r) {
                assert.strictEqual(typeof r[0].dateProperty, 'string');
            }),

        store.byKey(1)
            .done(function(r) {
                assert.strictEqual(typeof r.dateProperty, 'string');
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test('Dates, disableable, ODataContext', function(assert) {
    assert.expect(4);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/name',
        responseText: { value: [{ dateProperty: '1945-05-09T14:25:12.1234567Z' }] }
    });

    ajaxMock.setup({
        url: 'odata.org/function()',
        responseText: { dateProperty: '1945-05-09T14:25:12.1234567Z' }
    });

    ajaxMock.setup({
        url: 'odata.org/action',
        responseText: { dateProperty: '1945-05-09T14:25:12.1234567Z' }
    });

    const ctx = new ODataContext({
        version: 4,
        url: 'odata.org',
        deserializeDates: false,
        entities: {
            'X': { name: 'name' },
            'Y': { name: 'name', deserializeDates: true }
        }
    });

    const promises = [
        ctx.get('function')
            .done(function(r) {
                assert.strictEqual(typeof r.dateProperty, 'string');
            }),

        ctx.invoke('action')
            .done(function(r) {
                assert.strictEqual(typeof r.dateProperty, 'string');
            }),

        ctx.X.load()
            .done(function(r) {
                assert.strictEqual(typeof r[0].dateProperty, 'string');
            }),

        ctx.Y.load()
            .done(function(r) {
                assert.strictEqual($.type(r[0].dateProperty), 'date');
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.module('JSONP support', moduleConfig);
QUnit.test('load()', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { results: [1, 2, 3] },
        callback: function(bag) {
            assert.equal(bag.jsonp, '$callback');
            assert.equal(bag.dataType, 'jsonp');
        }
    });

    new ODataStore({ url: 'odata.org', jsonp: true })
        .load()
        .done(function(r) {
            assert.deepEqual(r, [1, 2, 3]);
        })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('byKey()', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org(1)',
        responseText: { foo: 'bar' },
        callback: function(bag) {
            assert.equal(bag.jsonp, '$callback');
            assert.equal(bag.dataType, 'jsonp');
        }
    });

    new ODataStore({ url: 'odata.org', jsonp: true })
        .byKey(1)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .done(function(r) {
            assert.deepEqual(r, { foo: 'bar' });
        })
        .always(done);
});

QUnit.module('Error handling', moduleConfig);
QUnit.test('generic HTTP error', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org(\'http-error\')',
        status: 404,
        statusText: 'Not Found',
        responseText: 'Expected 404'
    });

    new ODataStore({ url: 'odata.org' })
        .byKey('http-error')
        .fail(function(error) {
            assert.equal(error.message, 'Not Found');
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('OData service error', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org(\'error\')',
        status: 500,
        responseText: {
            error: { message: 'test entity error' }
        }
    });

    new ODataStore({ url: 'odata.org' })
        .byKey('error')
        .fail(function(error) {
            assert.equal(error.message, 'test entity error');
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});


QUnit.test('unexpected server response with 200 status', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org(\'bad-response\')',
        jQueryTextStatus: 'parsererror',
        responseText: 'Server gone crazy'
    });

    new ODataStore({ url: 'odata.org' })
        .byKey('bad-response')
        .fail(function(error) {
            assert.ok(error.message.indexOf('Unexpected server response') > -1);
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('error handlers (check params)', function(assert) {
    const done = assert.async();

    const helper = new ErrorHandlingHelper();

    const store = new ODataStore({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.extraChecker = function(error) {
        assert.equal(error.requestOptions.url, 'odata.org');
        assert.equal(error.httpStatus, 404);
    };

    helper.run(function() {
        return store.load();
    }, done, assert);
});

QUnit.test('non HTTP failure', function(assert) {
    const done = assert.async();
    ajaxMock.setup({
        url: 'odata.org/get',
        status: 0
    });

    const store = new ODataStore({
        url: 'odata.org/get'
    });

    store.load()
        .fail((e) => {
            assert.equal(e.httpStatus, 0);
        })
        .done(() => {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('error handlers (query evaluation)', function(assert) {
    const done = assert.async();

    const helper = new ErrorHandlingHelper();

    const store = new ODataStore({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store
            .load({
                select: function(i) { throw Error('test'); }
            });
    }, done, assert);
});

QUnit.test('error handlers (byKey)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org(\'error\')',
        status: 500,
        responseText: {
            error: { message: 'test entity error' }
        }
    });

    const helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, 'test entity error');
    };

    helper.run(
        function() {
            return new ODataStore({
                url: 'odata.org',
                errorHandler: helper.optionalHandler
            }).byKey('error');
        },
        done,
        assert
    );
});

QUnit.test('error handlers (update)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org(\'error\')',
        jQueryTextStatus: 'parsererror'
    });

    const helper = new ErrorHandlingHelper();

    const store = new ODataStore({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.update('error', {});
    }, done, assert);
});

QUnit.test('error handlers (remove)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org(\'error\')',
        jQueryTextStatus: 'parsererror'
    });

    const helper = new ErrorHandlingHelper();

    const store = new ODataStore({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.remove('error');
    }, done, assert);
});

QUnit.test('error handlers (insert)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        jQueryTextStatus: 'parsererror'
    });

    const helper = new ErrorHandlingHelper();

    const store = new ODataStore({
        url: 'odata.org',
        key: 'id',
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.insert({});
    }, done, assert);
});

QUnit.test('error handlers (custom operation)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/TestOperationError',
        jQueryTextStatus: 'parsererror'
    });

    const helper = new ErrorHandlingHelper();

    const context = new ODataContext({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return context.invoke('TestOperationError');
    }, done, assert);
});

QUnit.test('Recursive inner exception (B232110)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            error: {
                'message': {
                    'value': 'An error occurred while processing this request.'
                },
                'innererror': {
                    'message': 'An error occurred while updating the entries.See the inner exception for details.',
                    'internalexception': {
                        'message': 'An error occurred while updating the entries.See the inner exception for details.',
                        'internalexception': {
                            'message': 'The DELETE statement conflicted with the REFERENCE constraint'
                        }
                    }
                }
            }
        }
    });

    const helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.ok(error.errorDetails);
        assert.deepEqual(error.errorDetails, {
            'message': {
                'value': 'An error occurred while processing this request.'
            },
            'innererror': {
                'message': 'An error occurred while updating the entries.See the inner exception for details.',
                'internalexception': {
                    'message': 'An error occurred while updating the entries.See the inner exception for details.',
                    'internalexception': {
                        'message': 'The DELETE statement conflicted with the REFERENCE constraint'
                    }
                }
            }
        });

        assert.equal(error.message, 'The DELETE statement conflicted with the REFERENCE constraint');
    };

    const store = new ODataStore({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.run($.proxy(store.load, store), done, assert);
});

QUnit.test('Recursive empty inner exception (T1081655) - primitive case', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            error: {
                'message': {
                    'value': 'The DELETE statement conflicted with the REFERENCE constraint'
                },
                'innererror': {}
            }
        }
    });

    const helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, 'The DELETE statement conflicted with the REFERENCE constraint');
    };

    const store = new ODataStore({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.run($.proxy(store.load, store), done, assert);
});

QUnit.test('No recursive inner exception (B232110) on validation error', function(assert) {
    const done = assert.async();
    ajaxMock.setup({
        url: 'odata.org',
        responseText: {
            error: {
                message: 'The Product Name field is required.'
            }
        }
    });

    const helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, 'The Product Name field is required.');
    };

    const store = new ODataStore({
        url: 'odata.org',
        errorHandler: helper.optionalHandler
    });

    helper.run($.proxy(store.load, store), done, assert);
});

QUnit.module('Addressing remote operations', moduleConfig);
QUnit.test('get', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org*',
        callback: function(bag) {
            this.responseText = {
                d: {
                    method: bag.method.toLowerCase(),
                    data: bag.data,
                    url: bag.url
                }
            };
        }
    });

    const promises = [
        // v2 and v3
        new ODataContext({ version: 2, url: 'odata.org' })
            .get('operation', {
                Int: -42,
                Null: null,
                True: true,
                False: false,
                String: 'value',
                Double: 3.141592,
                Date: new Date(2012, 11, 17, 14, 18, 23),
                Guid: new Guid('01234567-89ab-cdef-0123-456789abcdef')
            })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: 'get',
                    data: {
                        'Date': 'datetime\'2012-12-17T14:18:23\'',
                        'Double': '3.141592',
                        'False': 'false',
                        'Guid': 'guid\'01234567-89ab-cdef-0123-456789abcdef\'',
                        'Int': '-42',
                        'Null': 'null',
                        'String': '\'value\'',
                        'True': 'true'
                    },
                    url: 'odata.org/operation'
                });
            }),

        // v4
        new ODataContext({ url: 'odata.org' })
            .get('function', {
                Int: -42,
                Null: null,
                True: true,
                False: false,
                String: 'value',
                Double: 3.141592,
                Date: new Date(2012, 11, 17, 14, 18, 23),
                Guid: new Guid('01234567-89ab-cdef-0123-456789abcdef')
            })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: 'get',
                    data: {},
                    url: 'odata.org/function(Int=-42,Null=null,True=true,False=false,String=\'value\',Double=3.141592,Date=2012-12-17T14:18:23Z,Guid=01234567-89ab-cdef-0123-456789abcdef)'
                });
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('T213119: The ODataContext.get method crashes when return value is a boolean true', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/true',
        responseText: { value: true }
    });

    ajaxMock.setup({
        url: 'odata.org/false',
        responseText: { value: false }
    });

    const promises = [
        new ODataContext({ version: 2, url: 'odata.org' })
            .get('true')
            .done(function(r) {
                assert.strictEqual(r, true);
            }),

        new ODataContext({ version: 2, url: 'odata.org' })
            .get('false')
            .done(function(r) {
                assert.strictEqual(r, false);
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test('invoke for service operation', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/operation*',
        callback: function(bag) {
            this.responseText = {
                d: {
                    method: bag.method.toLowerCase(),
                    url: bag.url,
                    data: bag.data
                }
            };
        }
    });

    ajaxMock.setup({
        url: 'odata4.org/action',
        callback: function(bag) {
            this.responseText = {
                method: bag.method.toLowerCase(),
                url: bag.url,
                data: bag.data
            };
        }
    });

    const promises = [
        // v2 and 3
        new ODataContext({ version: 2, url: 'odata.org' })
            .invoke('operation', { n: 13 })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: 'post',
                    url: 'odata.org/operation?n=13',
                    data: 'null'
                });
            }),

        // v4
        new ODataContext({ url: 'odata4.org' })
            .invoke('action', { n: 13 })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: 'post',
                    url: 'odata4.org/action',
                    data: '{"n":13}'
                });
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test('invoke and get methods should understand scalar types in result', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/scalar',
        responseText: {
            d: { results: { scalar: 'scalar value' } }
        }
    });

    const promises = [
        new ODataContext({ version: 2, url: 'odata.org' })
            .get('scalar')
            .done(function(r) {
                assert.strictEqual(r, 'scalar value');
            }),

        new ODataContext({ version: 2, url: 'odata.org' })
            .invoke('scalar')
            .done(function(r) {
                assert.equal(r, 'scalar value');
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module('Custom query params', moduleConfig);
QUnit.test('works', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: {},
        callback: function(bag) {
            assert.equal(bag.data.customName, '\'customValue\'');
        }
    });

    ajaxMock.setup({
        url: 'odata4.org(customName=\'customValue\')',
        responseText: {},
        callback: function(bag) {
            assert.deepEqual(bag.data, {});
        }
    });

    const promises = [
        new ODataStore({ version: 2, url: 'odata.org' })
            .load({ customQueryParams: { customName: 'customValue' } }),

        new ODataStore({ version: 3, url: 'odata.org' })
            .load({ customQueryParams: { customName: 'customValue' } }),

        new ODataStore({ url: 'odata4.org' })
            .load({ customQueryParams: { customName: 'customValue' } })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('url is correct when customQueryParams is undefined (T382714)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata4.org/messages',
        responseText: {
            message: 'expected message'
        }
    });

    ajaxMock.setup({
        url: 'odata4.org/messages()',
        responseText: {
            message: 'unexpected message'
        }
    });

    new ODataStore({ version: 4, url: 'odata4.org/messages' })
        .load({ customQueryParams: undefined })
        .done(function(r) {
            assert.equal(r.message, 'expected message');
        })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('array value for odata 4', function(assert) {
    const done = assert.async();

    const guid = '3f17117f-63b1-ee7d-2b64-a7f717177773';

    const value = [1, '\'1', new Date(1945, 4, 9, 14, 25, 1, 1), new Guid(guid), new EdmLiteral('123L')];
    const expectedUrl = 'odata4.org(customName=[1,\'\'\'1\',1945-05-09T14:25:01.001Z,' + guid + ',123L])';

    ajaxMock.setup({
        url: expectedUrl,
        responseText: {},
        callback: function(bag) {
            assert.deepEqual(bag.data, {});
        }
    });

    new ODataStore({ version: 4, url: 'odata4.org' })
        .load({ customQueryParams: { customName: value } })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module('Misc', moduleConfig);
QUnit.test('T226529', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',

        // NOTE: It's a simulation of impossible response
        // where the one collection property (collectionProperty0) returns with "results" wrapper
        // and the other one (collectionProperty1) returns without it (OData v2 specific).
        responseText: {
            d: {
                results: [
                    {
                        keyProperty: 0,
                        collectionProperty1: {
                            results: [
                                { keyProperty: 0 },
                                { keyProperty: 1 }
                            ]
                        },
                        collectionProperty2: [
                            { keyProperty: 0 },
                            { keyProperty: 1 }
                        ]
                    }
                ]
            }
        }
    });

    new ODataStore({ url: 'odata.org' })
        .load()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.deepEqual(r, [
                {
                    keyProperty: 0,

                    collectionProperty1: [
                        { keyProperty: 0 },
                        { keyProperty: 1 }
                    ],

                    collectionProperty2: [
                        { keyProperty: 0 },
                        { keyProperty: 1 }
                    ]
                }
            ]);
        })
        .done(done);
});

QUnit.test('Sorting and grouping shouldn\'t add duplicate rules', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: function(bag) {
            assert.equal(bag.data['$orderby'], 'a');
        }
    });

    new ODataStore({ url: 'odata.org' })
        .load({ sort: 'a', group: 'a' })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('Sorting should be higher priority than grouping', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: function(bag) {
            assert.equal(bag.data['$orderby'], 'a desc');
        }
    });

    new ODataStore({ url: 'odata.org' })
        .load({ sort: { field: 'a', desc: true }, group: 'a' })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('Custom headers, query string params and timeout (beforeSend event)', function(assert) {
    assert.expect(6);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: assertFunc
    });

    ajaxMock.setup({
        url: 'odata.org(1)',
        responseText: { d: {} },
        callback: assertFunc
    });

    const PARAM_NAME = 'customParam';
    const HEADER_NAME = 'x-custom-header';

    function assertFunc(bag) {
        assert.equal(bag.timeout, 1122);
        assert.equal(bag.data[PARAM_NAME], 'p');
        assert.equal(bag.headers[HEADER_NAME], 'h');
    }

    function handleBeforeSend(requestOptions) {
        requestOptions.timeout = 1122;
        requestOptions.params[PARAM_NAME] = 'p';
        requestOptions.headers[HEADER_NAME] = 'h';
    }

    const promises = [
        new ODataStore({ url: 'odata.org', beforeSend: handleBeforeSend })
            .load(),

        new ODataStore({ url: 'odata.org', beforeSend: handleBeforeSend })
            .byKey(1)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('link creation helper method', function(assert) {
    const context = new ODataContext({
        url: 'http://devexpress.com',
        entities: {
            alias: { name: 'RealName' },
            'My Obj': { }
        }
    });

    assert.deepEqual(context.objectLink('My Obj', 'key 1'), {
        __metadata: {
            uri: 'http://devexpress.com/My%20Obj(\'key%201\')'
        }
    });

    assert.equal(
        context.objectLink('alias', 1).__metadata.uri,
        'http://devexpress.com/RealName(1)'
    );

    assert.equal(context.objectLink('alias', null), null, 'Should return null in case of not defined key value');
    assert.equal(context.objectLink('alias', undefined), null, 'Should return null in case of not defined key value');
});

QUnit.test('custom entity name in ODataContext', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/TestEntity1',
        responseText: { d: {} }
    });

    const context = new ODataContext({
        url: 'odata.org',
        entities: {
            'abc': { name: 'TestEntity1' }
        }
    });

    assert.expect(0);

    context['abc'].load()
        .always(done);
});

QUnit.test('withCredentials is set', function(assert) {
    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: function(request) {
            assert.strictEqual(request.xhrFields.withCredentials, true);
        }
    });

    new ODataStore({ url: 'odata.org', withCredentials: true })
        .load();
});

QUnit.test('filterToLower equal false', function(assert) {
    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: function(request) {
            assert.equal(request.data.$filter, 'substringof(\'O\',B)');
        }
    });

    new ODataStore({ version: 2, url: 'odata.org', filterToLower: false })
        .load({ filter: ['B', 'contains', 'O'] });
});

QUnit.test('filterToLower equal false for ODataContext', function(assert) {
    assert.expect(2);

    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/name',
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    const ctx = new ODataContext({
        version: 4,
        url: 'odata.org',
        filterToLower: false,
        entities: {
            'X': { name: 'name', filterToLower: true },
            'Y': { name: 'name' }
        }
    });

    const promises = [
        ctx.X.load({ filter: ['B', 'contains', 'O'] })
            .done(function(request) {
                assert.equal(request[0].data.$filter, 'contains(tolower(B),\'o\')');
            }),

        ctx.Y.load({ filter: ['B', 'contains', 'O'] })
            .done(function(request) {
                assert.equal(request[0].data.$filter, 'contains(B,\'O\')');
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test('oDataFilterToLower equal false for ODataContext', function(assert) {
    assert.expect(3);

    const done = assert.async();

    config({ oDataFilterToLower: false });

    ajaxMock.setup({
        url: 'odata.org/name',
        callback: function(bag) {
            this.responseText = { value: [bag] };
        }
    });

    const ctx = new ODataContext({
        version: 4,
        url: 'odata.org',
        filterToLower: true,
        entities: {
            'X': { name: 'name' },
            'Y': { name: 'name', filterToLower: false },
            'Z': { name: 'name', filterToLower: true }
        }
    });

    const promises = [
        ctx.X.load({ filter: ['B', 'contains', 'O'] })
            .done(function(request) {
                assert.equal(request[0].data.$filter, 'contains(tolower(B),\'o\')');
            }),

        ctx.Y.load({ filter: ['B', 'contains', 'O'] })
            .done(function(request) {
                assert.equal(request[0].data.$filter, 'contains(B,\'O\')');
            }),

        ctx.Z.load({ filter: ['B', 'contains', 'O'] })
            .done(function(request) {
                assert.equal(request[0].data.$filter, 'contains(tolower(B),\'o\')');
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test('verbose MIME specifier is used', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org',
        responseText: { d: { results: [] } },
        callback: function(bag) {
            assert.ok(bag.accepts.json.indexOf('odata=verbose') > -1);
            assert.ok(bag.accepts.json.indexOf('application/json') > -1);
            assert.ok(bag.accepts.json.indexOf('text/plain') > -1, 'need for count query');
        }
    });

    new ODataStore({ url: 'odata.org' })
        .load()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test('URL absolutation algorithm works incorrectly (see T305070 for details)', function(assert) {
    const done = assert.async();

    ajaxMock.setup({
        url: 'odata.org/DataSet',
        responseText: {
            value: [1],
            '@odata.nextLink': 'DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,\'o\')&$skiptoken=1'
        }
    });

    ajaxMock.setup({
        url: 'odata.org/DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,\'o\')&$skiptoken=1',
        responseText: {
            value: [2],
            '@odata.nextLink': 'DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,\'o\')&$skiptoken=2'
        }
    });

    ajaxMock.setup({
        url: 'odata.org/DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,\'o\')&$skiptoken=2',
        responseText: {
            value: [3]
        }
    });

    assert.expect(0);

    new ODataStore({ version: 4, url: 'odata.org/DataSet' })
        .load({ filter: ['prop.nested.prop', 'contains', 'o'], expand: ['prop($expand=nested)'] })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});
