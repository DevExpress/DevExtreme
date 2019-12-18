var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    errors = require('core/errors'),
    Action = require('core/action');

var noJquery = QUnit.urlParams['nojquery'];

QUnit.testStart(function() {
    var markup =
        '<div class="dx-state-disabled">\
            <div class="dx-click-target"></div>\
        </div>\
        \
        <div class="dx-state-readonly">\
            <div class="dx-click-target"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var actionExecutors = Action.executors,
    register = Action.registerExecutor,
    unregister = Action.unregisterExecutor;

var mockStringActionExecutor = {
    execute: function(e) {
        if(typeof e.action === 'string') {
            e.result = e.action;
            e.handled = true;
        }
    }
};

QUnit.module('Action Executors');

QUnit.test('registerActionExecutor/unregisterActionExecutor simple', function(assert) {
    var testExecutor = { execute: noop };

    register('test', testExecutor);
    assert.strictEqual(actionExecutors.test, testExecutor);

    unregister('test');
    assert.ok(!('test' in actionExecutors));
});

QUnit.test('registerActionExecutor/unregisterActionExecutor by object', function(assert) {
    var testExecutor1 = { execute: noop },
        testExecutor2 = { execute: noop };

    register({
        'test1': testExecutor1,
        'test2': testExecutor2
    });

    assert.strictEqual(actionExecutors.test1, testExecutor1);
    assert.strictEqual(actionExecutors.test2, testExecutor2);

    unregister('test1', 'test2');
    assert.ok(!('test1' in actionExecutors));
    assert.ok(!('test2' in actionExecutors));
});

QUnit.module('Action', {
    beforeEach: function() {
        this._originStringActionExecutor = actionExecutors['url'];
        register('url', mockStringActionExecutor);
    },
    afterEach: function() {
        register('url', this._originStringActionExecutor);
    }
});

QUnit.test('no action', function(assert) {
    var action = new Action();
    action.execute();
    assert.equal(action._action, null);
});

QUnit.test('action as a string', function(assert) {
    var action = new Action('new location');
    var result = action.execute();
    assert.equal(result, 'new location');
});

QUnit.test('action as a function', function(assert) {
    var executed = false,
        execArgs = [];

    var action = new Action(function() {
        executed = true;
        execArgs = arguments;
    });

    action.execute(false, 1, '2');

    assert.ok(executed);
    assert.equal(execArgs.length, 1, 'action handle only first argument');
    assert.strictEqual(execArgs[0], false, 'action handle only first argument');
    assert.strictEqual(execArgs[1], undefined, 'action handle only first argument');
    assert.strictEqual(execArgs[2], undefined, 'action handle only first argument');
});

QUnit.test('action as a function with context', function(assert) {
    var context = {},
        execContext = null;

    var action = new Action(
        function() {
            execContext = this;
        },
        {
            context: context
        }
    );

    action.execute();

    assert.deepEqual(execContext, context);
});

QUnit.test('canceled action is not executed', function(assert) {
    var action = new Action('new location');

    register('canceller', {
        validate: function(e) {
            e.cancel = true;
        }
    });

    var result = action.execute();
    assert.strictEqual(result, undefined);

    unregister('canceller');
});

QUnit.test('action is handled once', function(assert) {
    var CustomActionClass = function() { },
        action = new Action(new CustomActionClass()),
        handledTwice = false;

    register('test1', {
        execute: function(e) {
            if(e.action instanceof CustomActionClass) {
                e.handled = true;
            }
        }
    });

    register('test2', {
        execute: function(e) {
            if(e.action instanceof CustomActionClass) {
                handledTwice = true;
                e.handled = true;
            }
        }
    });

    action.execute();
    assert.ok(!handledTwice);

    unregister('test');
});

QUnit.test('action execute callbacks', function(assert) {
    var executed = false,
        args = [],
        result = 1;

    var actionFunc = function() {
        executed = true;
        return result;
    };

    var action = new Action(actionFunc,
        {
            beforeExecute: function(e) {
                assert.ok(!executed);
                assert.deepEqual(e, {
                    action: actionFunc,
                    args: args,
                    context: window,
                    component: undefined,
                    cancel: false,
                    handled: false,
                    validatingTargetName: undefined
                });
            },

            afterExecute: function(e) {
                assert.ok(executed);
                assert.deepEqual(e, {
                    action: actionFunc,
                    args: args,
                    context: window,
                    component: undefined,
                    cancel: false,
                    handled: true,
                    result: result,
                    validatingTargetName: undefined
                });
            }
        });

    action.execute.apply(action, args);
});

QUnit.test('beforeExecute callback can cancel action execution', function(assert) {
    var handlerSpy = sinon.spy(noop);

    var action = new Action(handlerSpy, {
        beforeExecute: function(e) {
            e.cancel = true;
        }
    });

    action.execute();
    assert.ok(!handlerSpy.called);
});

QUnit.test('afterExecute callback can be canceled at action execution', function(assert) {
    var handlerSpy = sinon.spy(noop);

    var action = new Action(function(e) {
        e.cancel = true;
    }, {
        afterExecute: handlerSpy
    });

    action.execute({});
    assert.ok(!handlerSpy.called);
});

QUnit.test('ui interaction validator should prevent all action handlers by validatingTargetName', function(assert) {
    var handlerSpy = sinon.spy(noop);

    var action = new Action(handlerSpy, {
        validatingTargetName: 'customElement'
    });

    action.execute({
        event: $.Event('click', { target: $('.dx-state-disabled .dx-click-target').get(0) }),
        customElement: $('.dx-state-disabled')
    });

    assert.ok(!handlerSpy.called);
});


QUnit.test('ui interaction validator should prevent all ui action handlers by \'dx-state-readonly\' class', function(assert) {
    var handlerSpy = sinon.spy(noop),
        $targetElement = $('.dx-state-readonly .dx-click-target');

    var action = new Action(handlerSpy);

    action.execute({
        event: $.Event('click', { target: $targetElement.get(0) }),
        element: $targetElement
    });

    assert.ok(!handlerSpy.called);
});

QUnit.test('Action argument should contain both Event and jQueryEvent field or none of them', function(assert) {
    var eventMock = {};

    new Action(function(e) {
        assert.notOk(e.event);
        assert.notOk(e.jQueryEvent);
    }).execute({});

    new Action(function(e) {
        assert.ok(e.event);
        assert.ok(noJquery || e.jQueryEvent);
    }).execute({ event: eventMock });

    assert.throws(function() {
        new Action(noop).execute({ jQueryEvent: eventMock });
    }, /The jQueryEvent field is deprecated\. Please, use the `event` field instead/);
});

QUnit.test('Working with jQueryEvent field should throw warning', function(assert) {
    var eventMock = {};
    var expectedWarning = ['W0003', 'Handler argument', 'jQueryEvent', '17.2', 'Use the \'event\' field instead'];
    var originalLog = errors.log;
    var log = [];

    errors.log = function() {
        log.push($.makeArray(arguments));
    };

    new Action(function(e) {
        e.jQueryEvent;
    }).execute({ event: eventMock });

    if(noJquery) {
        assert.equal(log.length, 0);
    } else {
        assert.equal(log.length, 1);
        assert.deepEqual(log[0], expectedWarning);
    }

    new Action(function(e) {
        e.jQueryEvent = {};
    }).execute({ event: eventMock });


    if(noJquery) {
        assert.equal(log.length, 0);
    } else {
        assert.equal(log.length, 2);
        assert.deepEqual(log[1], expectedWarning);
    }

    errors.log = originalLog;
});

QUnit.module('excludeValidators', {
    beforeEach: function() {
        this.originalActionExecutors = $.extend(true, {}, actionExecutors);

        $.each(actionExecutors, function(name, impl) {
            actionExecutors[name] = {};
        });
    },

    afterEach: function() {
        var executors = this.originalActionExecutors;
        $.each(actionExecutors, function(name, impl) {
            actionExecutors[name] = executors[name];
        });
    }
});

QUnit.test('not passed, all validators should be performed', function(assert) {
    var testExecutorWithValidateValidateCalled = 0,
        testExecutorWithExecuteCalled = 0,
        testExecutorWithValidateAndExecuteValidateCalled = 0,
        testExecutorWithValidateAndExecuteExecuteCalled = 0;

    register({
        'testExecutorWithValidate': {
            validate: function() {
                testExecutorWithValidateValidateCalled++;
            }
        },

        'testExecutorWithExecute': {
            execute: function() {
                testExecutorWithExecuteCalled++;
            }
        },

        'testExecutorWithValidateAndExecute': {
            validate: function() {
                testExecutorWithValidateAndExecuteValidateCalled++;
            },

            execute: function() {
                testExecutorWithValidateAndExecuteExecuteCalled++;
            }
        }
    });

    new Action(noop).execute();

    assert.equal(testExecutorWithValidateValidateCalled, 1);
    assert.equal(testExecutorWithExecuteCalled, 1);
    assert.equal(testExecutorWithValidateAndExecuteValidateCalled, 1);
    assert.equal(testExecutorWithValidateAndExecuteExecuteCalled, 1);
});

QUnit.test('passed, listed validators are skipped', function(assert) {
    var testExecutorWithValidateValidateCalled = 0,
        testExecutorWithExecuteCalled = 0,
        testExecutorWithValidateAndExecuteValidateCalled = 0,
        testExecutorWithValidateAndExecuteExecuteCalled = 0;

    register({
        'testExecutorWithValidate': {
            validate: function() {
                testExecutorWithValidateValidateCalled++;
            }
        },

        'testExecutorWithExecute': {
            execute: function() {
                testExecutorWithExecuteCalled++;
            }
        },

        'testExecutorWithValidateAndExecute': {
            validate: function() {
                testExecutorWithValidateAndExecuteValidateCalled++;
            },

            execute: function() {
                testExecutorWithValidateAndExecuteExecuteCalled++;
            }
        }
    });

    new Action(noop, { excludeValidators: ['testExecutorWithValidateAndExecute'] }).execute();

    assert.equal(testExecutorWithValidateValidateCalled, 1);
    assert.equal(testExecutorWithExecuteCalled, 1);
    assert.equal(testExecutorWithValidateAndExecuteValidateCalled, 0);
    assert.equal(testExecutorWithValidateAndExecuteExecuteCalled, 1);

    unregister('testExecutorWithValidate', 'testExecutorWithExecute', 'testExecutorWithValidateAndExecute');
});
