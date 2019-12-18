var $ = require('./renderer'),
    config = require('./config'),
    window = require('./utils/window').getWindow(),
    typeUtils = require('./utils/type'),
    each = require('./utils/iterator').each,
    Class = require('./class'),
    errors = require('./errors');

var Action = Class.inherit({

    ctor: function(action, config) {
        config = config || {};
        this._action = action;
        this._context = config.context || window;
        this._beforeExecute = config.beforeExecute;
        this._afterExecute = config.afterExecute;
        this._component = config.component;
        this._validatingTargetName = config.validatingTargetName;
        var excludeValidators = this._excludeValidators = {};

        if(config.excludeValidators) {
            for(var i = 0; i < config.excludeValidators.length; i++) {
                excludeValidators[config.excludeValidators[i]] = true;
            }
        }
    },

    execute: function() {
        var e = {
            action: this._action,
            args: Array.prototype.slice.call(arguments),
            context: this._context,
            component: this._component,
            validatingTargetName: this._validatingTargetName,
            cancel: false,
            handled: false
        };

        var beforeExecute = this._beforeExecute,
            afterExecute = this._afterExecute;

        var argsBag = e.args[0] || {};

        ///#DEBUG
        if('jQueryEvent' in argsBag && !argsBag.event) {
            throw 'The jQueryEvent field is deprecated. Please, use the `event` field instead';
        }
        ///#ENDDEBUG

        if(!('jQueryEvent' in argsBag) && argsBag.event && config().useJQuery) {
            Object.defineProperty(argsBag, 'jQueryEvent', {
                get: function() {
                    errors.log('W0003', 'Handler argument', 'jQueryEvent', '17.2', 'Use the \'event\' field instead');
                    return argsBag.event;
                },
                set: function(value) {
                    errors.log('W0003', 'Handler argument', 'jQueryEvent', '17.2', 'Use the \'event\' field instead');
                    argsBag.event = value;
                }
            });
        }

        if(!this._validateAction(e)) {
            return;
        }

        beforeExecute && beforeExecute.call(this._context, e);

        if(e.cancel) {
            return;
        }

        var result = this._executeAction(e);

        if(argsBag.cancel) {
            return;
        }

        afterExecute && afterExecute.call(this._context, e);

        return result;
    },

    _validateAction: function(e) {
        var excludeValidators = this._excludeValidators,
            executors = Action.executors;

        for(var name in executors) {
            if(!excludeValidators[name]) {
                var executor = executors[name];
                if(executor.validate) {
                    executor.validate(e);
                }

                if(e.cancel) {
                    return false;
                }
            }
        }

        return true;
    },

    _executeAction: function(e) {
        var result,
            executors = Action.executors;

        for(var name in executors) {
            var executor = executors[name];
            if(executor.execute) {
                executor.execute(e);
            }

            if(e.handled) {
                result = e.result;
                break;
            }
        }

        return result;
    }
});

Action.executors = {};

Action.registerExecutor = function(name, executor) {
    if(typeUtils.isPlainObject(name)) {
        each(name, Action.registerExecutor);
        return;
    }
    Action.executors[name] = executor;
};

Action.unregisterExecutor = function() {
    var args = [].slice.call(arguments);

    each(args, function() {
        delete Action.executors[this];
    });
};


Action.registerExecutor({
    'undefined': {
        execute: function(e) {
            if(!e.action) {
                e.result = undefined;
                e.handled = true;
            }
        }
    },
    'func': {
        execute: function(e) {
            if(typeUtils.isFunction(e.action)) {
                e.result = e.action.call(e.context, e.args[0]);
                e.handled = true;
            }
        }
    }
});


var createValidatorByTargetElement = function(condition) {
    return function(e) {
        if(!e.args.length) {
            return;
        }

        var args = e.args[0],
            element = args[e.validatingTargetName] || args.element;

        if(element && condition($(element))) {
            e.cancel = true;
        }
    };
};

Action.registerExecutor({
    'disabled': {
        validate: createValidatorByTargetElement(function($target) {
            return $target.is('.dx-state-disabled, .dx-state-disabled *');
        })
    },

    'readOnly': {
        validate: createValidatorByTargetElement(function($target) {
            return $target.is('.dx-state-readonly, .dx-state-readonly *');
        })
    }
});


module.exports = Action;
