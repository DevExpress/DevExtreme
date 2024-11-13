const hideTopOverlay = require('common/core/environment/hide_top_overlay');
const hideTopOverlayCallback = require('common/core/environment/hide_callback').hideCallback;

QUnit.module('top overlay util');

QUnit.test('hideTopOverlayCallback', function(assert) {
    const navCallback = hideTopOverlayCallback;
    let res = '';
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
    const callback = function() {
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
    const callback = hideTopOverlayCallback;
    let eventFiredCount = 0;

    callback.add(function() {
        eventFiredCount++;
    });
    assert.equal(eventFiredCount, 0);

    hideTopOverlay();
    assert.equal(eventFiredCount, 1);
});
