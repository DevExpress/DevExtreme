import { Cache } from 'ui/scheduler/workspaces/cache';

const {
    test,
    module
} = QUnit;

module('Cache', () => {
    module('Initialization', () => {
        test('Cache should be empty', function(assert) {
            const cache = new Cache();

            assert.equal(cache.size, 0, 'Cache is empty');
        });
    });

    module('API', () => {
        test('get and set', function(assert) {
            const cache = new Cache();
            cache.set('test', 'value');

            assert.equal(cache.size, 1, 'Cache is not empty');
            assert.equal(cache.get('test'), 'value', 'Cache value is correct');
        });

        test('get with callback', function(assert) {
            const cache = new Cache();
            cache.get('test', () => 'callbackValue');

            assert.equal(cache.size, 1, 'Cache is not empty');
            assert.equal(cache.get('test'), 'callbackValue', 'Cache value is correct');
        });

        test('clear', function(assert) {
            const cache = new Cache();
            cache.set('test0', () => 'callbackValue');
            cache.set('test1', 'value');

            cache.clear();

            assert.equal(cache.size, 0, 'Cache is empty');
        });
    });
});
