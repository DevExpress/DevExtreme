const CustomStore = require('common/data/custom_store').CustomStore;
const ErrorHandlingHelper = require('../../helpers/data.errorHandlingHelper.js');

const RAW = 'raw';

QUnit.module('load', function() {

    QUnit.test('only userData is passed to user func', function(assert) {
        const done = assert.async();
        const userData = { custom: 123 };

        new CustomStore({
            loadMode: RAW,
            load: function(options) {
                assert.deepEqual(options, { userData: userData });
                done();
            }
        }).load({
            sort: 'a',
            group: 'b',
            filter: function() { return true; },
            select: 'c',
            skip: 1,
            take: 2,
            userData: userData
        });
    });

    QUnit.test('data is processed locally', function(assert) {
        const done = assert.async();

        new CustomStore({
            loadMode: RAW,
            load: function() {
                return [
                    { g: 'g5', v: 'v5' },
                    { g: 'g4', v: 'v4' },
                    { g: 'g3', v: 'v3' },
                    { g: 'g2', v: 'v2' },
                    { g: 'g1', v: 'v1' }
                ];
            }
        }).load({
            group: 'g',
            sort: 'v',
            filter: [ 'v', '<>', 'v3' ],
            skip: 1,
            take: 2
        }).done(function(result) {
            assert.deepEqual(result, [
                {
                    key: 'g2',
                    items: [ { g: 'g2', v: 'v2' } ]
                },
                {
                    key: 'g4',
                    items: [ { g: 'g4', v: 'v4' } ]
                }
            ]);
            done();
        });
    });

    QUnit.test('requireTotalCount', function(assert) {
        const done = assert.async();

        new CustomStore({
            loadMode: RAW,
            load: function() { return [ 1, 2 ]; }
        }).load({
            take: 1,
            requireTotalCount: true
        }).done(function(result, extra) {
            assert.deepEqual(result, [ 1 ]);
            assert.deepEqual(extra, { totalCount: 2 });
            done();
        });
    });

    QUnit.test('error during local processing', function(assert) {
        const done = assert.async();
        const helper = new ErrorHandlingHelper();

        helper.extraChecker = function(error) {
            assert.equal(error.message, 'expected error');
        };

        helper.run(function() {
            return new CustomStore({
                loadMode: RAW,
                load: function() { return [ null ]; },
                errorHandler: helper.optionalHandler
            }).load({
                filter: function() { throw Error('expected error'); }
            });
        }, done, assert);
    });

    QUnit.test('call errorHandler if load throw error', function(assert) {
        const done = assert.async();
        let errorHandlerCallsCount = 0;
        let errorMessage = null;

        new CustomStore({
            loadMode: RAW,
            async load() {
                throw Error('expected error');
            },
            errorHandler() {
                ++errorHandlerCallsCount;
            }
        }).load().fail((error) => {
            errorMessage = error.message;
        }).always(() => {
            assert.equal(errorHandlerCallsCount, 1, 'errorHandler must be called 1 time');
            assert.equal(errorMessage, 'expected error', 'error is equal to expected');
            done();
        });
    });

});

QUnit.module('totalCount', function() {

    QUnit.test('user func takes precedence', function(assert) {
        const done = assert.async();

        new CustomStore({
            loadMode: RAW,
            totalCount: function() {
                return 123;
            }
        }).totalCount().done(function(count) {
            assert.equal(count, 123);
            done();
        });
    });

    QUnit.test('based on raw load', function(assert) {
        const done = assert.async();
        const userData = { custom: 123 };

        new CustomStore({
            loadMode: RAW,
            load: function(options) {
                assert.deepEqual(options, { userData: userData });
                return [1, 2, 3];
            }
        }).totalCount({
            userData: userData,
            filter: [ 'this', '<>', 2 ],
            sort: 'anything'
        }).done(function(count) {
            assert.equal(count, 2);
            done();
        });
    });

    QUnit.test('error during local processing', function(assert) {
        const done = assert.async();
        const helper = new ErrorHandlingHelper();

        helper.extraChecker = function(error) {
            assert.equal(error.message, 'expected error');
        };

        helper.run(function() {
            return new CustomStore({
                loadMode: RAW,
                load: function() { return [ null ]; },
                errorHandler: helper.optionalHandler
            }).totalCount({
                filter: function() { throw Error('expected error'); }
            });
        }, done, assert);
    });

});

QUnit.module('byKey', function() {

    QUnit.test('user func takes precedence', function(assert) {
        const done = assert.async();

        new CustomStore({
            loadMode: RAW,
            byKey: function() {
                return 123;
            }
        }).byKey('*').done(function(item) {
            assert.equal(item, 123);
            done();
        });
    });

    QUnit.test('success', function(assert) {
        const done = assert.async();
        const needle = { id: 123 };

        new CustomStore({
            loadMode: RAW,
            key: 'id',
            load: function() {
                return [ needle ];
            }
        }).byKey(123).done(function(item) {
            assert.strictEqual(item, needle);
            done();
        });
    });

    QUnit.test('not found', function(assert) {
        const done = assert.async();

        new CustomStore({
            loadMode: RAW,
            key: 'id',
            load: function() {
                return [ ];
            }
        }).byKey('anything').fail(function(x) {
            assert.ok(/^E4009 /.test(x.message));
            done();
        });
    });

    QUnit.test('key not specified', function(assert) {
        assert.throws(
            function() {
                new CustomStore({ loadMode: RAW }).byKey('anything');
            },
            function(x) {
                assert.ok(/^E4005 /.test(x.message));
                return true;
            }
        );
    });

});

QUnit.module('raw data caching', function() {

    QUnit.test('enabled by default', function(assert) {
        const done = assert.async();
        let loadCallCount = 0;

        const store = new CustomStore({
            key: 'this',
            loadMode: RAW,
            load: function() {
                loadCallCount++;
                return [ 1, 2 ];
            }
        });

        Promise.all([ store.load(), store.byKey(1), store.totalCount() ]).then(function() {
            assert.equal(loadCallCount, 1);
            done();
        });
    });

    QUnit.test('can be disabled', function(assert) {
        const done = assert.async();
        let loadCallCount = 0;

        const store = new CustomStore({
            loadMode: RAW,
            cacheRawData: false,
            load: function() {
                loadCallCount++;
                return [ ];
            }
        });

        Promise.all([ store.load(), store.totalCount(), store.load() ]).then(function() {
            assert.equal(loadCallCount, 3);
            done();
        });
    });

});

QUnit.test('ensure valid results regardless of presence of options (checks optimizations)', function(assert) {
    const done = assert.async();

    const store = new CustomStore({
        loadMode: RAW,
        load: function() { return [ 1, 2, 3 ]; }
    });

    store.load({ requireTotalCount: true }).done(function(result, extra) {
        assert.deepEqual(result, [ 1, 2, 3 ]);
        assert.equal(extra.totalCount, 3);

        store.load({ filter: [ 'this', '<>', 2 ], requireTotalCount: true }).done(function(result, extra) {
            assert.deepEqual(result, [ 1, 3 ]);
            assert.equal(extra.totalCount, 2);

            done();
        });
    });
});

QUnit.test('uses default search', function(assert) {
    assert.strictEqual(
        new CustomStore({ loadMode: RAW })._useDefaultSearch,
        true
    );
});

QUnit.test('async load', function(assert) {
    let loadCallCount = 0;
    const store = new CustomStore({
        loadMode: 'raw',
        key: 'ID',
        load: function() {
            loadCallCount++;
            return new Promise(function(resolve) {
                resolve([
                    { 'ID': 1 },
                    { 'ID': 2 }
                ]);
            });
        }
    });

    store.byKey(1);
    store.byKey(2);

    assert.strictEqual(loadCallCount, 1);
});
