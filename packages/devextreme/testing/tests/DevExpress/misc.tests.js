QUnit.module('uncleared timers detection', {
    beforeEach: function() {
        this.window = {
            _id: 0,
            _clock: 0,
            _timeouts: { },
            _animationFrames: { },
            _intervals: { },

            setTimeout: function(callback) {
                const id = this._id++;
                this._timeouts[id] = callback;
                return id;
            },
            clearTimeout: function(id) {
                delete this._timeouts[id];
            },
            expireTimeout: function(id) {
                this._timeouts[id](this);
                delete this._timeouts[id];
            },

            setInterval: function(callback) {
                const id = this._id++;
                this._intervals[id] = callback;
                return id;
            },
            clearInterval: function(id) {
                delete this._intervals[id];
            },

            requestAnimationFrame: function(callback) {
                const id = this._id++;
                this._animationFrames[id] = callback;
                return id;
            },
            cancelAnimationFrame: function(id) {
                delete this._animationFrames[id];
            },
            expireAnimationFrame: function(id) {
                this._animationFrames[id]();
                delete this._animationFrames[id];
            }
        };
        this.log = QUnit.timersDetector.spyWindowMethods(this.window);
        this.log.start();
    },
    afterEach: function() {
        this.log.stop();
        this.log.clear();
    }
}, () => {

    QUnit.test('uncleared setTimeout', function(assert) {
        const callback = function() { /* callback code */ };

        (function codeThatSchedulesTimer(window) {
            window.setTimeout(callback, 123);
        })(this.window);

        const log = this.log.get();
        assert.strictEqual(Object.keys(log.timeouts).length, 1);

        const timerInfo = log.timeouts[0];
        assert.strictEqual(timerInfo.timerType, 'timeouts');
        assert.strictEqual(timerInfo.timerId, 0);
        assert.strictEqual(timerInfo.callback, callback.toString());
        assert.strictEqual(timerInfo.timeout, 123);
        assert.ok(timerInfo.stack.indexOf('codeThatSchedulesTimer') > -1);
    });

    QUnit.test('expired setTimeout', function(assert) {
        const id = this.window.setTimeout(function() { }, 123);

        this.window.expireTimeout(id);

        const log = this.log.get();
        assert.strictEqual(Object.keys(log.timeouts).length, 0);
    });

    QUnit.test('several sequential expired setTimeout', function(assert) {
        const id1 = this.window.setTimeout(function() { }, 10);
        const id2 = this.window.setTimeout(function() { }, 50);

        this.window.expireTimeout(id1);
        this.window.expireTimeout(id2);

        assert.strictEqual(Object.keys(this.log.get().timeouts).length, 0);
    });

    QUnit.test('uncleared setInterval', function(assert) {
        const callback = function() { /* callback code */ };

        (function codeThatSchedulesTimer(window) {
            window.setInterval(callback, 321);
        })(this.window);

        const log = this.log.get();
        assert.strictEqual(Object.keys(log.intervals).length, 1);

        const timerInfo = log.intervals[0];
        assert.strictEqual(timerInfo.timerType, 'intervals');
        assert.strictEqual(timerInfo.timerId, 0);
        assert.strictEqual(timerInfo.callback, callback.toString());
        assert.strictEqual(timerInfo.timeout, 321);
        assert.ok(timerInfo.stack.indexOf('codeThatSchedulesTimer') > -1);
    });

    QUnit.test('uncleared requestAnimationFrame', function(assert) {
        const callback = function() { /* callback code */ };

        (function codeThatSchedulesTimer(window) {
            window.requestAnimationFrame(callback);
        })(this.window);

        const log = this.log.get();
        assert.strictEqual(Object.keys(log.animationFrames).length, 1);

        const timerInfo = log.animationFrames[0];
        assert.strictEqual(timerInfo.timerType, 'animationFrames');
        assert.strictEqual(timerInfo.timerId, 0);
        assert.strictEqual(timerInfo.callback, callback.toString());
        assert.ok(timerInfo.stack.indexOf('codeThatSchedulesTimer') > -1);
    });

    QUnit.test('cleared setTimeout', function(assert) {
        this.window.clearTimeout(
            this.window.setTimeout(function() { }, 123)
        );

        const log = this.log.get();

        assert.strictEqual(Object.keys(log.timeouts).length, 0);
    });

    QUnit.test('cleared setInterval', function(assert) {
        this.window.clearInterval(
            this.window.setInterval(function() { }, 123)
        );

        const log = this.log.get();

        assert.strictEqual(Object.keys(log.intervals).length, 0);
    });

    QUnit.test('cleared animation frame', function(assert) {
        this.window.cancelAnimationFrame(
            this.window.requestAnimationFrame(function() { })
        );

        const log = this.log.get();

        assert.strictEqual(Object.keys(log.animationFrames).length, 0);
    });

    QUnit.test('expired animation frame', function(assert) {
        const id = this.window.requestAnimationFrame(function() { });

        this.window.expireAnimationFrame(id);

        const log = this.log.get();
        assert.strictEqual(Object.keys(log.timeouts).length, 0);
    });

    QUnit.test('several sequential expired requestAnimationFrame', function(assert) {
        const id1 = this.window.requestAnimationFrame(function() { });
        const id2 = this.window.requestAnimationFrame(function() { });

        this.window.expireAnimationFrame(id1);
        this.window.expireAnimationFrame(id2);

        const log = this.log.get();
        assert.strictEqual(Object.keys(log.animationFrames).length, 0);
    });

});
