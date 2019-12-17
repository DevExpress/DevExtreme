var hideTopOverlay = require('mobile/hide_top_overlay'),
    hideTopOverlayCallback = hideTopOverlay.hideCallback;

QUnit.module('top overlay util');

QUnit.test('hideTopOverlayCallback', function(assert) {
    var navCallback = hideTopOverlayCallback;
    var res = '';
    navCallback.add(function() {
        res += '0';
    });
    assert.ok(navCallback.hasCallback());
    assert.ok(navCallback.fire());
    assert.ok(!navCallback.hasCallback());
    assert.equal(res, '0');

    navCallback.add(function() {
        res += '1';
    });
    navCallback.add(function() {
        res += '2';
    });
    navCallback.fire();
    navCallback.fire();
    assert.equal(res, '021');
    var callback = function() {
        res += '3';
    };
    navCallback.add(callback);
    navCallback.add(function() {
        res += '4';
    });
    navCallback.remove(callback);
    assert.ok(navCallback.fire());
    assert.ok(!navCallback.fire());
    assert.equal(res, '0214');
});

QUnit.test('hideTopOverlay', function(assert) {
    var callback = hideTopOverlayCallback,
        eventFiredCount = 0;

    callback.add(function() {
        eventFiredCount++;
    });
    assert.equal(eventFiredCount, 0);

    hideTopOverlay();
    assert.equal(eventFiredCount, 1);
});
