var $ = require('jquery');
var deferredUtils = require('core/utils/deferred');
var useJQuery = require('core/config')().useJQuery;

require('integration/jquery');

QUnit.module('jQuery strategy');

QUnit.test('jQuery strategy should be used if useJQuery flag was set', function(assert) {
    if(!useJQuery) {
        assert.expect(0);
        return;
    }

    var d1 = new deferredUtils.Deferred();
    var d2 = new $.Deferred();

    assert.equal(d1.constructor, d2.constructor, 'deferred is jQuery.Deferred');
});

QUnit.module('when');

QUnit.test('when should be resolved synchronously', function(assert) {
    var log = [];

    var d1 = new $.Deferred();
    var d2 = new $.Deferred();

    deferredUtils.when().done(function() {
        assert.deepEqual(arguments.length, 0, 'correct args');
        log.push(1);
    });

    deferredUtils.when(d1).done(function(result) {
        assert.deepEqual(result, 1, 'correct args');
        log.push(2);
    });

    deferredUtils.when(d1, d2).done(function(result) {
        assert.deepEqual($.makeArray(arguments), [1, [2, 3]], 'correct args');
        log.push(3);
    });

    d1.resolve(1);
    d2.resolve(2, 3);

    assert.deepEqual(log, [1, 2, 3], 'resolved synchronous');
});
