var $ = require('jquery'),
    animationFrame = require('animation/frame');

QUnit.module('animation frame');

QUnit.testInActiveWindow('request', function(assert) {
    var done = assert.async();
    var animationFrameID = animationFrame.requestAnimationFrame(function() {
        done();
    });
    assert.ok($.isNumeric(animationFrameID));
});

QUnit.testInActiveWindow('cancel', function(assert) {
    assert.expect(1);

    var done = assert.async(),
        callbackCalled = 0;

    var animationFrameID = animationFrame.requestAnimationFrame(function() {
        callbackCalled++;
    });

    if(callbackCalled) {
        assert.ok(true, 'animation frame callback can be triggered before animation frame canceled');
        done();
        return;
    }

    animationFrame.cancelAnimationFrame(animationFrameID);

    setTimeout(function() {
        assert.ok(!callbackCalled, 'animation frame callback is not triggered after animation frame canceled');
        done();
    });
});
