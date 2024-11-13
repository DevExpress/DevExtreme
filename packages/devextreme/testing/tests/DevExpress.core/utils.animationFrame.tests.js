const $ = require('jquery');
const animationFrame = require('common/core/animation/frame');

QUnit.module('animation frame');

QUnit.testInActiveWindow('request', function(assert) {
    const done = assert.async();
    const animationFrameID = animationFrame.requestAnimationFrame(function() {
        done();
    });
    assert.ok($.isNumeric(animationFrameID));
});

QUnit.testInActiveWindow('cancel', function(assert) {
    assert.expect(1);

    const done = assert.async();
    let callbackCalled = 0;

    const animationFrameID = animationFrame.requestAnimationFrame(function() {
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
