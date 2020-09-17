import $ from './renderer';
import { getWindow } from './utils/window';
import { isPlainObject, isFunction } from './utils/type';
import { each } from './utils/iterator';

export default class Action {
    constructor(action, config) {
        config = config || {};
        this._action = action;
        this._context = config.context || getWindow();
        this._beforeExecute = config.beforeExecute;
        this._afterExecute = config.afterExecute;
        this._component = config.component;
        this._validatingTargetName = config.validatingTargetName;
        const excludeValidators = this._excludeValidators = {};

        if(config.excludeValidators) {
            for(let i = 0; i < config.excludeValidators.length; i++) {
                excludeValidators[config.excludeValidators[i]] = true;
            }
        }
    }

    execute() {
        const e = {
            action: this._action,
            args: Array.prototype.slice.call(arguments),
            context: this._context,
            component: this._component,
            validatingTargetName: this._validatingTargetName,
            cancel: false,
            handled: false
        };

        const beforeExecute = this._beforeExecute;
        const afterExecute = this._afterExecute;

        const argsBag = e.args[0] || {};

        if(!this._validateAction(e)) {
            return;
        }

        beforeExecute?.call(this._context, e);

        if(e.cancel) {
            return;
        }

        const result = this._executeAction(e);

        if(argsBag.cancel) {
            return;
        }

        afterExecute?.call(this._context, e);

        return result;
    }

    _validateAction(e) {
        const excludeValidators = this._excludeValidators;
        const { executors } = Action;

        for(const name in executors) {
            if(!excludeValidators[name]) {
                const executor = executors[name];
                executor.validate?.(e);

                if(e.cancel) {
                    return false;
                }
            }
        }

        return true;
    }

    _executeAction(e) {
        let result;
        const { executors } = Action;

        for(const name in executors) {
            const executor = executors[name];
            executor.execute?.(e);

            if(e.handled) {
                result = e.result;
                break;
            }
        }

        return result;
    }

    static registerExecutor(name, executor) {
        if(isPlainObject(name)) {
            each(name, Action.registerExecutor);
            return;
        }
        Action.executors[name] = executor;
    }

    static unregisterExecutor(...args) {
        each(args, function() {
            delete Action.executors[this];
        });
    }
}

Action.executors = {};

const createValidatorByTargetElement = (condition) => (e) => {
    if(!e.args.length) {
        return;
    }

    const args = e.args[0];
    const element = args[e.validatingTargetName] || args.element;

    if(element && condition($(element))) {
        e.cancel = true;
    }
};

Action.registerExecutor({
    'disabled': {
        validate: createValidatorByTargetElement(($target) =>
            $target.is('.dx-state-disabled, .dx-state-disabled *')
        )
    },

    'readOnly': {
        validate: createValidatorByTargetElement(($target) =>
            $target.is('.dx-state-readonly, .dx-state-readonly *:not(.dx-state-independent)')
        )
    },
    'undefined': {
        execute: (e) => {
            if(!e.action) {
                e.result = undefined;
                e.handled = true;
            }
        }
    },
    'func': {
        execute: (e) => {
            if(isFunction(e.action)) {
                e.result = e.action.call(e.context, e.args[0]);
                e.handled = true;
            }
        }
    }
});
