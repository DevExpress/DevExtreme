import Action from './action';
import Callbacks from './utils/callbacks';
import Config from './config';
import Class from './class';
import errors from './errors';
import EventsMixin from './events_mixin';
import OptionManager from './option_manager';
import publicComponentUtils from './utils/public_component';
import { Deferred, when } from '../core/utils/deferred';
import { extend } from './utils/extend';
import { isFunction, isDefined, isPlainObject, type } from './utils/type';
import { noop } from './utils/common';

/**
* @name Component
* @type object
* @inherits EventsMixin
* @module core/component
* @export default
* @namespace DevExpress
* @hidden
*/

class PostponedOperations {
    constructor() {
        this._postponedOperations = {};
    }

    add(key, fn, postponedPromise) {
        if(key in this._postponedOperations) {
            postponedPromise && this._postponedOperations[key].promises.push(postponedPromise);
        } else {
            this._postponedOperations[key] = {
                fn,
                completePromise: new Deferred(),
                promises: postponedPromise ? [postponedPromise] : []
            };
        }

        return this._postponedOperations[key].completePromise.promise();
    }

    callPostponedOperations() {
        for(let key in this._postponedOperations) {
            const operation = this._postponedOperations[key];

            if(isDefined(operation)) {
                const { promises, fn, completePromise } = operation;

                if(promises && promises.length) {
                    when(...operation.promises).done(fn).then(completePromise.resolve);
                } else {
                    operation.fn().done(completePromise.resolve);
                }
            }
        }

        this._postponedOperations = {};
    }
}

const getEventName = actionName => actionName.charAt(2).toLowerCase() + actionName.substr(3);
const actionOptions = { excludeValidators: ['disabled', 'readOnly'] };

const Component = Class.inherit({
    _setDeprecatedOptions() {
        this._deprecatedOptions = {};
    },

    _getDeprecatedOptions() {
        return this._deprecatedOptions;
    },

    _getDefaultOptions() {
        return {
            /**
            * @name ComponentOptions.onInitialized
            * @type function
            * @type_function_param1 e:object
            * @type_function_param1_field1 component:this
            * @type_function_param1_field2 element:dxElement
            * @default null
            * @action
            */
            onInitialized: null,
            /**
            * @name ComponentOptions.onOptionChanged
            * @type function
            * @type_function_param1 e:object
            * @type_function_param1_field1 component:this
            * @type_function_param1_field4 name:string
            * @type_function_param1_field5 fullName:string
            * @type_function_param1_field6 value:any
            * @default null
            * @action
            */
            onOptionChanged: null,
            /**
            * @name ComponentOptions.onDisposing
            * @type function
            * @type_function_param1 e:object
            * @type_function_param1_field1 component:this
            * @default null
            * @action
            */
            onDisposing: null,

            defaultOptionsRules: null
        };
    },

    _defaultOptionsRules() {
        return [];
    },

    _setOptionsByDevice(rules) {
        this._optionManager.applyRules(rules);
    },

    _isInitialOptionValue(name) {
        return this._optionManager.isInitial(name);
    },

    _setOptionsByReference() {
        this._optionsByReference = {};
    },

    _getOptionsByReference() {
        return this._optionsByReference;
    },
    /**
    * @name ComponentMethods.ctor
    * @publicName ctor(options)
    * @param1 options:ComponentOptions|undefined
    * @hidden
    */
    ctor(options = {}) {
        this.NAME = publicComponentUtils.name(this.constructor);

        if(options.eventsStrategy) {
            this.setEventsStrategy(options.eventsStrategy);
        }

        this._updateLockCount = 0;

        this._optionChangedCallbacks = options._optionChangedCallbacks || Callbacks();
        this._disposingCallbacks = options._disposingCallbacks || Callbacks();
        this.postponedOperations = new PostponedOperations();
        this._initOptionManager(options);
    },

    _initOptionManager(options) {
        this.beginUpdate();

        try {
            this._setOptionsByReference();
            this._setDeprecatedOptions();
            this._options = this._getDefaultOptions();
            this._optionManager = new OptionManager(
                this._options,
                this._getDefaultOptions(),
                this._getOptionsByReference(),
                this._getDeprecatedOptions()
            );

            this._optionManager.onChanging(
                (name, previousValue, value) => this._initialized && this._optionChanging(name, previousValue, value));
            this._optionManager.onDeprecated(
                (option, info) => this._logDeprecatedWarning(option, info));
            this._optionManager.onChanged(
                (name, value, previousValue) => this._notifyOptionChanged(name, value, previousValue));
            this._optionManager.addRules(this._defaultOptionsRules());

            if(options && options.onInitializing) {
                options.onInitializing.apply(this, [options]);
            }

            this._setOptionsByDevice(options.defaultOptionsRules);
            this._initOptions(options);
        } finally {
            this.endUpdate();
        }
    },

    _initOptions(options) {
        this.option(options);
    },

    _init() {
        this._createOptionChangedAction();
        this.on('disposing', args => this._disposingCallbacks.fireWith(this, [args]));
    },

    _logDeprecatedWarning(option, { message, alias, since }) {
        message = message || `Use the '${alias}' option instead`;
        errors.log('W0001', this.NAME, option, since, message);
    },

    _createOptionChangedAction() {
        this._optionChangedAction = this._createActionByOption('onOptionChanged', actionOptions);
    },

    _createDisposingAction() {
        this._disposingAction = this._createActionByOption('onDisposing', actionOptions);
    },

    _optionChanged({ name }) {
        switch(name) {
            case 'onDisposing':
            case 'onInitialized':
                break;
            case 'onOptionChanged':
                this._createOptionChangedAction();
                break;
            case 'defaultOptionsRules':
                break;
        }
    },

    _dispose() {
        this._optionChangedCallbacks.empty();
        this._createDisposingAction();
        this._disposingAction();
        this._disposeEvents();
        this._optionManager.dispose();
        this._disposed = true;
    },

    /**
     * @name componentmethods.instance
     * @publicName instance()
     * @return this
     */
    instance() {
        return this;
    },

    /**
     * @name componentmethods.beginupdate
     * @publicName beginUpdate()
     */
    beginUpdate() {
        this._updateLockCount++;
    },

    /**
     * @name componentmethods.endupdate
     * @publicName endUpdate()
     */
    endUpdate() {
        this._updateLockCount = Math.max(this._updateLockCount - 1, 0);

        if(!this._updateLockCount) {
            this.postponedOperations.callPostponedOperations();

            if(!this._initializing && !this._initialized) {
                this._initializing = true;
                try {
                    this._init();
                } finally {
                    this._initializing = false;
                    this._updateLockCount++;
                    this._createActionByOption('onInitialized', actionOptions)();
                    this._updateLockCount--;
                    this._initialized = true;
                }
            }
        }
    },

    _optionChanging: noop,

    _notifyOptionChanged(option, value, previousValue) {
        if(this._initialized) {
            const optionNames = [option].concat(this._optionManager.getAliasesByName(option));

            for(let optionName of optionNames) {
                const defaultActionArgs = this._defaultActionArgs();
                const args = {
                    name: optionName.split(/[.[]/)[0],
                    fullName: optionName,
                    value,
                    previousValue
                };

                this._optionChangedCallbacks.fireWith(this, [extend(defaultActionArgs, args)]);
                this._optionChangedAction(extend({}, args));

                if(!this._disposed && this._cancelOptionChange !== args.name) {
                    this._optionChanged(args);
                }
            }
        }
    },

    initialOption(name) {
        return this._optionManager.initial(name);
    },

    _defaultActionConfig() {
        return { context: this, component: this };
    },

    _defaultActionArgs() {
        return { component: this };
    },

    _createAction(actionSource, config) {
        let action = null;

        return (e = {}) => {
            const defaultActionConfig = this._defaultActionConfig();
            const defaultActionArgs = this._defaultActionArgs();

            e = !isPlainObject(e) ? { actionValue: e } : e;
            action = action || new Action(actionSource, extend(config, defaultActionConfig));

            return action.execute(extend(e, defaultActionArgs));
        };
    },

    _createActionByOption(optionName, config) {
        const result = (...args) => {
            let action = null;
            let eventName = '';
            let actionFunc = null;

            if(!eventName) {
                config = config || {};

                if(typeof optionName !== 'string') {
                    throw errors.Error('E0008');
                }

                if(optionName.indexOf('on') === 0) {
                    eventName = getEventName(optionName);
                }
                ///#DEBUG
                if(optionName.indexOf('on') !== 0) {
                    throw Error(`The '${optionName}' option name should start with 'on' prefix`);
                }
                ///#ENDDEBUG

                actionFunc = this.option(optionName);
            }

            if(!action) {
                if(!actionFunc && !config.beforeExecute && !config.afterExecute && !this.hasEvent(eventName)) {
                    return;
                }

                const { beforeExecute } = config;

                config.beforeExecute = (...args) => {
                    beforeExecute && beforeExecute.apply(this, args);
                    this.fireEvent(eventName, args.args);
                };
                action = this._createAction(actionFunc, config);
            }

            if(Config().wrapActionsBeforeExecute) {
                const beforeActionExecute = this.option('beforeActionExecute');
                const wrappedAction = beforeActionExecute && beforeActionExecute(this, action, config) || action;

                return wrappedAction.apply(this, args);
            }

            return action.apply(this, args);
        };

        if(!Config().wrapActionsBeforeExecute) {
            const onActionCreated = this.option('onActionCreated');

            return onActionCreated && onActionCreated(this, result, config) || result;
        }

        return result;
    },

    _getOptionByStealth(name) {
        return this._optionManager.silent(name);
    },

    _setOptionByStealth(options, value) {
        this._optionManager.silent(options, value);
    },

    hasActionSubscription(name) {
        return !!this.option(name) || this.hasEvent(getEventName(name));
    },

    isOptionDeprecated(name) {
        return this._optionManager.isDeprecated(name);
    },

    _setOptionSilent(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false;
    },

    _getOptionValue(name, context) {
        const value = this.option(name);

        return isFunction(value) ? value.bind(context)() : value;
    },

    /**
     * @name componentmethods.option
     * @publicName option()
     * @return object
     */
    /**
     * @name componentmethods.option
     * @publicName option(optionName)
     * @param1 optionName:string
     * @return any
     */
    /**
     * @name componentmethods.option
     * @publicName option(optionName, optionValue)
     * @param1 optionName:string
     * @param2 optionValue:any
     */
    /**
     * @name componentmethods.option
     * @publicName option(options)
     * @param1 options:object
     */
    option(options, value) {
        if(arguments.length < 2 && type(options) !== 'object') {
            return this._optionManager.option(options);
        } else {
            this.beginUpdate();

            try {
                this._optionManager.option(options, value);
            } finally {
                this.endUpdate();
            }
        }
    },

    /**
     * @name componentmethods.resetOption
     * @publicName resetOption(optionName)
     * @param1 optionName:string
     */
    resetOption(name) {
        this.beginUpdate();
        this._optionManager.reset(name);
        this.endUpdate();
    }
}).include(EventsMixin);

module.exports = Component;
module.exports.PostponedOperations = PostponedOperations;
