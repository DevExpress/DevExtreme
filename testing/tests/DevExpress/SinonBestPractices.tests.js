QUnit.module('Fake timers', {
    beforeEach: function() {
        // this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        // this.clock.restore();
    }

});

// QUnit.test('setTimeout', function(assert) {
//     var done = assert.async();

//     setTimeout(function() {
//         assert.ok(true);
//         done();
//     });

//     this.clock.tick(1);
// });

QUnit.test('setTimeout1', function(assert) {
    var clock = sinon.useFakeTimers();

    var done = assert.async();

    setTimeout(function() {
        assert.ok(true);
        done();
    });

    clock.tick(1);

    clock.restore();
});

