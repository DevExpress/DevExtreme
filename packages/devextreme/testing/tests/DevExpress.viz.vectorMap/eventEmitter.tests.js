const eventEmitterModule = require('viz/vector_map/event_emitter');

QUnit.module('eventEmitterMethods', {
    beforeEach: function() {
        function F() { }
        this.emitter = new F();
        eventEmitterModule.makeEventEmitter(F);
        this.emitter._eventNames = ['event-1', 'event-2'];
        this.emitter._initEvents();
    },

    afterEach: function() {
        this.emitter._disposeEvents();
    }
});

QUnit.test('fire event with no callbacks', function(assert) {
    this.emitter._fire('event-1', 'arg');

    assert.ok(true, 'no errors');
});

QUnit.test('fire event with callback', function(assert) {
    const spy = sinon.spy();
    this.emitter.on({ 'event-1': spy });

    this.emitter._fire('event-1', 'arg');

    assert.deepEqual(spy.lastCall.args, ['arg'], 'called');
});

QUnit.test('fire event with several callbacks', function(assert) {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    this.emitter.on({ 'event-2': spy1 });
    this.emitter.on({ 'event-2': spy2 });

    this.emitter._fire('event-2', 'arg');

    assert.deepEqual(spy1.lastCall.args, ['arg'], 'called 1');
    assert.deepEqual(spy2.lastCall.args, ['arg'], 'called 2');
});

QUnit.test('fire event with removed callback', function(assert) {
    const spy = sinon.spy();
    const remove = this.emitter.on({ 'event-1': spy });
    remove();

    this.emitter._fire('event-1', 'arg');

    assert.strictEqual(spy.lastCall, null, 'not called');
});
