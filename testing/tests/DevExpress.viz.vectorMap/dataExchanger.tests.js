var dataExchangerModule = require('viz/vector_map/data_exchanger');

QUnit.module('DataExchanger', {
    beforeEach: function() {
        this.dataExchanger = new dataExchangerModule.DataExchanger();
    },

    afterEach: function() {
        this.dataExchanger.dispose();
    }
});

QUnit.test('bind when no data', function(assert) {
    var callback = sinon.spy();
    this.dataExchanger.bind('test-category', 'test-data', callback);
    assert.strictEqual(callback.lastCall, null);
});

QUnit.test('unbind when not bound', function(assert) {
    this.dataExchanger.unbind('test-category', 'test-data');
    assert.ok(true);
});

QUnit.test('set then bind', function(assert) {
    var data = { tag: 'data' },
        callback = sinon.spy();
    this.dataExchanger.set('test-category', 'test-data', data);

    this.dataExchanger.bind('test-category', 'test-data', callback);

    assert.deepEqual(callback.lastCall.args, [data]);
});

QUnit.test('bind then set', function(assert) {
    var data = { tag: 'data' },
        callback = sinon.spy();
    this.dataExchanger.bind('test-category', 'test-data', callback);

    this.dataExchanger.set('test-category', 'test-data', data);

    assert.deepEqual(callback.lastCall.args, [data]);
});

QUnit.test('unbind', function(assert) {
    var data = { tag: 'data' },
        callback = sinon.spy();
    this.dataExchanger.bind('test-category', 'test-data', callback);
    this.dataExchanger.unbind('test-category', 'test-data', callback);

    this.dataExchanger.set('test-category', 'test-data', data);

    assert.strictEqual(callback.lastCall, null);
});
