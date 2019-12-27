const hideTopOverlay = require('mobile/hide_top_overlay');
const hideTopOverlayCallback = hideTopOverlay.hideCallback;

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
    assert.equal('0', res);

    navCallback.add(function() {
        res += '1';
    });
    navCallback.add(function() {
        res += '2';
    });
    navCallback.fire();
    navCallback.fire();
    assert.equal('021', res);
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
    assert.equal('0214', res);
});

QUnit.test('hideTopOverlay', function(assert) {
    const callback = hideTopOverlayCallback;
    let eventFiredCount = 0;

    callback.add(function() {
        eventFiredCount++;
    });
    assert.equal(0, eventFiredCount);

    hideTopOverlay();
    assert.equal(1, eventFiredCount);
});
