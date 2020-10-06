import { Cache } from 'ui/scheduler/workspaces/cache';

const {
    test,
    module
} = QUnit;

module('Cache', {
    beforeEach: function() {
        this.cache = new Cache();
    }
}, () => {
    module('Initialization', () => {
        test('Cache should be empty', function(assert) {
            assert.equal(this.cache.size, 0, 'Cache is empty');
        });
    });

    module('API', () => {
        test('get and set', function(assert) {
            this.cache.set('test', 'value');

            assert.equal(this.cache.size, 1, 'Cache is not empty');
            assert.equal(this.cache.get('test'), 'value', 'Cache value is correct');
        });

        test('get with callback', function(assert) {
            this.cache.get('test', () => 'callbackValue');

            assert.equal(this.cache.size, 1, 'Cache is not empty');
            assert.equal(this.cache.get('test'), 'callbackValue', 'Cache value is correct');
        });

        test('clear', function(assert) {
            this.cache.set('test0', () => 'callbackValue');
            this.cache.set('test1', 'value');

            this.cache.clear();

            assert.equal(this.cache.size, 0, 'Cache is empty');
        });
    });
});
