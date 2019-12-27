const $ = require('jquery');
const queueUtils = require('core/utils/queue');

QUnit.module('enqueue');

QUnit.test('enqueue continues when deferred is rejected', function(assert) {
    const done = assert.async();
    const deferredToReject = $.Deferred();
    const deferredToResolve = $.Deferred();

    queueUtils.enqueue(function() {
        return deferredToReject;
    });

    queueUtils.enqueue(function() {
        return deferredToResolve;
    });

    queueUtils.enqueue(done);

    deferredToReject.reject();
    deferredToResolve.resolve();
    assert.expect(0);
});


QUnit.module('create');

QUnit.test('default (discardPendingTasks = false)', function(assert) {
    const done = assert.async();
    const log = [];
    const d1 = $.Deferred();
    const d2 = $.Deferred();

    d1.done(function() { log.push(1); });
    d2.done(function() { log.push(2); });

    const queue = queueUtils.create();
    queue.add(function() { return d1.promise(); });
    queue.add(function() { return d2.promise(); });
    queue.add(function() {
        assert.deepEqual(log, [1, 2]);
        done();
    });
    d1.resolve();
    d2.resolve();
});

QUnit.test('discardPendingTasks = true', function(assert) {
    const done = assert.async();
    const log = [];
    const d1 = $.Deferred();
    const d2 = $.Deferred();
    const task1 = function() { return d1.promise(); };
    const task2 = function() { return d2.promise(); };
    const removeTaskCallback = function(task) { log.push(task); };

    d1.done(function() { log.push(1); });
    d2.done(function() { log.push(2); });

    const queue = queueUtils.create(true);
    queue.add(task1, removeTaskCallback);
    queue.add(task2, removeTaskCallback);
    queue.add(function() {
        assert.deepEqual(log, [task2, 1]);
        done();
    }, removeTaskCallback);

    d1.resolve();
    d2.resolve();
});

QUnit.test('add task during task execution', function(assert) {
    const queue = queueUtils.create(true);
    const d = $.Deferred();
    let nestedExecuted = false;
    const task = function() {
        queue.add(function() {
            nestedExecuted = true;
        });

        return d.promise();
    };

    queue.add(task);
    assert.ok(!nestedExecuted);

    d.resolve();
    assert.ok(nestedExecuted);
});
