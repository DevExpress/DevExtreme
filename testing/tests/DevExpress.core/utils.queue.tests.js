var $ = require('jquery'),
    queueUtils = require('core/utils/queue');

QUnit.module('enqueue');

QUnit.test('enqueue continues when deferred is rejected', function(assert) {
    var done = assert.async(),
        deferredToReject = $.Deferred(),
        deferredToResolve = $.Deferred();

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
    var done = assert.async(),
        log = [],
        d1 = $.Deferred(),
        d2 = $.Deferred();

    d1.done(function() { log.push(1); });
    d2.done(function() { log.push(2); });

    var queue = queueUtils.create();
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
    var done = assert.async(),
        log = [],
        d1 = $.Deferred(),
        d2 = $.Deferred(),
        task1 = function() { return d1.promise(); },
        task2 = function() { return d2.promise(); },
        removeTaskCallback = function(task) { log.push(task); };

    d1.done(function() { log.push(1); });
    d2.done(function() { log.push(2); });

    var queue = queueUtils.create(true);
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
    var queue = queueUtils.create(true),
        d = $.Deferred(),
        nestedExecuted = false,
        task = function() {
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
