const Config = require('./config');
const domAdapter = require('./dom_adapter');
const extend = require('./utils/extend').extend;
const Class = require('./class');
const Action = require('./action');
const errors = require('./errors');
const coreDataUtils = require('./utils/data');
const commonUtils = require('./utils/common');
const typeUtils = require('./utils/type');
const deferredUtils = require('../core/utils/deferred');
const Deferred = deferredUtils.Deferred;
const when = deferredUtils.when;
const Callbacks = require('./utils/callbacks');
const EventsMixin = require('./events_mixin');
const publicComponentUtils = require('./utils/public_component');
const devices = require('./devices');
const isFunction = typeUtils.isFunction;
const noop = commonUtils.noop;

const cachedGetters = {};
const cachedSetters = {};

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
            const completePromise = new Deferred();
            this._postponedOperations[key] = {
                fn: fn,
                completePromise: completePromise,
                promises: postponedPromise ? [postponedPromise] : []
            };
        }

        return this._postponedOperations[key].completePromise.promise();
    }

    callPostponedOperations() {
        for(const key in this._postponedOperations) {
            const operation = this._postponedOperations[key];

            if(typeUtils.isDefined(operation)) {
                if(operation.promises && operation.promises.length) {
                    when(...operation.promises).done(operation.fn).then(operation.completePromise.resolve);
                } else {
                    operation.fn().done(operation.completePromise.resolve);
                }
            }
        }
        this._postponedOperations = {};
    }
}

const Component = Class.inherit({

    _setDeprecatedOptions: function() {
        this._deprecatedOptions = {};
    },

    _getDeprecatedOptions: function() {
        return this._deprecatedOptions;
    },

    _getOptionAliasesByName: function(optionName) {
        return Object.keys(this._deprecatedOptions).filter(aliasName => {
            return optionName === this._deprecatedOptions[aliasName].alias;
        });
    },

    _getDefaultOptions: function() {
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

    _setDefaultOptions: function() {
        this._options = this._getDefaultOptions();
    },

    _defaultOptionsRules: function() {
        return [];
    },

    _setOptionsByDevice: function(customRules) {
        let rules = this._defaultOptionsRules();

        if(Array.isArray(customRules)) {
            rules = rules.concat(customRules);
        }

        const rulesOptions = this._convertRulesToOptions(rules);

        extend(true, this._options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                this._options[fieldName] = rulesOptions[fieldName];
            }
        }
    },

    _convertRulesToOptions: function(rules) {
        const options = {};
        const currentDevice = devices.current();
        const deviceMatch = function(device, filter) {
            const filterArray = [];

            Array.prototype.push.call(filterArray, filter);

            return (filterArray.length === 1 && typeUtils.isEmptyObject(filterArray[0]))
                || commonUtils.findBestMatches(device, filterArray).length > 0;
        };

        for(let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            const deviceFilter = rule.device || { };
            var match;

            if(isFunction(deviceFilter)) {
                match = deviceFilter(currentDevice);
            } else {
                match = deviceMatch(currentDevice, deviceFilter);
            }

            if(match) {
                extend(options, rule.options);
            }
        }
        return options;
    },

    _isInitialOptionValue: function(name) {
        const optionValue = this.option(name);
        const initialOptionValue = this.initialOption(name);
        const isInitialOption = isFunction(optionValue) && isFunction(initialOptionValue) ? optionValue.toString() === initialOptionValue.toString() : commonUtils.equalByValue(optionValue, initialOptionValue);

        return isInitialOption;
    },

    _setOptionsByReference: function() {
        this._optionsByReference = {};
    },

    _getOptionsByReference: function() {
        return this._optionsByReference;
    },
    /**
    * @name ComponentMethods.ctor
    * @publicName ctor(options)
    * @param1 options:ComponentOptions|undefined
    * @hidden
    */
    ctor: function(options) {
        this.NAME = publicComponentUtils.name(this.constructor);

        options = options || {};
        if(options.eventsStrategy) {
            this.setEventsStrategy(options.eventsStrategy);
        }
        this._options = {};

        this._updateLockCount = 0;

        this._optionChangedCallbacks = options._optionChangedCallbacks || Callbacks();
        this._disposingCallbacks = options._disposingCallbacks || Callbacks();
        this.postponedOperations = new PostponedOperations();

        this.beginUpdate();

        try {
            this._suppressDeprecatedWarnings();
            this._setOptionsByReference();
            this._setDeprecatedOptions();
            this._setDefaultOptions();
            if(options && options.onInitializing) {
                options.onInitializing.apply(this, [options]);
            }
            this._setOptionsByDevice(options.defaultOptionsRules);
            this._resumeDeprecatedWarnings();

            this._initOptions(options);
        } finally {
            this.endUpdate();
        }
    },

    _initOptions: function(options) {
        this.option(options);
    },

    _optionValuesEqual: function(name, oldValue, newValue) {
        oldValue = coreDataUtils.toComparable(oldValue, true);
        newValue = coreDataUtils.toComparable(newValue, true);

        if(oldValue && newValue && typeUtils.isRenderer(oldValue) && typeUtils.isRenderer(newValue)) {
            return newValue.is(oldValue);
        }

        const oldValueIsNaN = oldValue !== oldValue;
        const newValueIsNaN = newValue !== newValue;
        if(oldValueIsNaN && newValueIsNaN) {
            return true;
        }

        if(oldValue === null || typeof oldValue !== 'object' || domAdapter.isElementNode(oldValue)) {
            return oldValue === newValue;
        }

        return false;
    },

    _init: function() {
        this._createOptionChangedAction();

        this.on('disposing', function(args) {
            this._disposingCallbacks.fireWith(this, [args]);
        }.bind(this));
    },

    _createOptionChangedAction: function() {
        this._optionChangedAction = this._createActionByOption('onOptionChanged', { excludeValidators: ['disabled', 'readOnly'] });
    },

    _createDisposingAction: function() {
        this._disposingAction = this._createActionByOption('onDisposing', { excludeValidators: ['disabled', 'readOnly'] });
    },

    _optionChanged: function(args) {
        switch(args.name) {
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

    _dispose: function() {
        this._optionChangedCallbacks.empty();
        this._createDisposingAction();
        this._disposingAction();
        this._disposeEvents();
        this._disposed = true;
    },

    /**
     * @name componentmethods.instance
     * @publicName instance()
     * @return this
     */
    instance: function() {
        return this;
    },

    /**
     * @name componentmethods.beginupdate
     * @publicName beginUpdate()
     */
    beginUpdate: function() {
        this._updateLockCount++;
    },

    /**
     * @name componentmethods.endupdate
     * @publicName endUpdate()
     */
    endUpdate: function() {
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
                    this._createActionByOption('onInitialized', { excludeValidators: ['disabled', 'readOnly'] })();
                    this._updateLockCount--;
                    this._initialized = true;
                }
            }
        }
    },

    _logWarningIfDeprecated: function(option) {
        const info = this._deprecatedOptions[option];
        if(info && !this._deprecatedOptionsSuppressed) {
            this._logDeprecatedWarning(option, info);
        }
    },

    _logDeprecatedWarningCount: 0,

    _logDeprecatedWarning: function(option, info) {
        const message = info.message || ('Use the \'' + info.alias + '\' option instead');
        errors.log('W0001', this.NAME, option, info.since, message);
        ++this._logDeprecatedWarningCount;
    },

    _suppressDeprecatedWarnings: function() {
        this._deprecatedOptionsSuppressed = true;
    },

    _resumeDeprecatedWarnings: function() {
        this._deprecatedOptionsSuppressed = false;
    },

    _optionChanging: noop,

    _notifyOptionChanged: function(option, value, previousValue) {
        const that = this;

        if(this._initialized) {
            const optionNames = [option].concat(that._getOptionAliasesByName(option));
            for(let i = 0; i < optionNames.length; i++) {
                const name = optionNames[i];
                const args = {
                    name: name.split(/[.[]/)[0],
                    fullName: name,
                    value: value,
                    previousValue: previousValue
                };

                that._optionChangedCallbacks.fireWith(that, [extend(that._defaultActionArgs(), args)]);
                that._optionChangedAction(extend({}, args));

                if(!that._disposed && this._cancelOptionChange !== args.name) {
                    that._optionChanged(args);
                }
            }
        }
    },

    initialOption: function(optionName) {
        let currentOptions;
        const currentInitialized = this._initialized;
        if(!this._initialOptions) {
            currentOptions = this._options;
            this._options = {};
            this._initialized = false;
            this._setDefaultOptions();
            this._setOptionsByDevice(currentOptions.defaultOptionsRules);

            this._initialOptions = this._options;
            this._options = currentOptions;
            this._initialized = currentInitialized;
        }

        return this._initialOptions[optionName];
    },

    _defaultActionConfig: function() {
        return {
            context: this,
            component: this
        };
    },

    _defaultActionArgs: function() {
        return {
            component: this
        };
    },

    _createAction: function(actionSource, config) {
        const that = this;
        let action;

        return function(e) {
            if(!arguments.length) {
                e = {};
            }

            if(!typeUtils.isPlainObject(e)) {
                e = { actionValue: e };
            }

            action = action || new Action(actionSource, extend(config, that._defaultActionConfig()));

            return action.execute.call(action, extend(e, that._defaultActionArgs()));
        };
    },

    _createActionByOption: function(optionName, config) {
        const that = this;
        let action;
        let eventName;
        let actionFunc;

        let result = function() {
            if(!eventName) {
                config = config || {};

                if(typeof optionName !== 'string') {
                    throw errors.Error('E0008');
                }

                if(optionName.indexOf('on') === 0) {
                    eventName = that._getEventName(optionName);
                }
                ///#DEBUG
                if(optionName.indexOf('on') !== 0) {
                    throw Error('The \'' + optionName + '\' option name should start with \'on\' prefix');
                }
                ///#ENDDEBUG

                actionFunc = that.option(optionName);
            }

            if(!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !that.hasEvent(eventName)) {
                return;
            }

            if(!action) {
                const beforeExecute = config.beforeExecute;
                config.beforeExecute = function(args) {
                    beforeExecute && beforeExecute.apply(that, arguments);
                    that.fireEvent(eventName, args.args);
                };
                that._suppressDeprecatedWarnings();
                action = that._createAction(actionFunc, config);
                that._resumeDeprecatedWarnings();
            }

            if(Config().wrapActionsBeforeExecute) {
                const beforeActionExecute = that.option('beforeActionExecute') || noop;
                const wrappedAction = beforeActionExecute(that, action, config) || action;
                return wrappedAction.apply(that, arguments);
            }

            return action.apply(that, arguments);
        };

        if(!Config().wrapActionsBeforeExecute) {
            const onActionCreated = that.option('onActionCreated') || noop;
            result = onActionCreated(that, result, config) || result;
        }

        return result;
    },

    _getEventName: function(actionName) {
        return actionName.charAt(2).toLowerCase() + actionName.substr(3);
    },

    hasActionSubscription: function(actionName) {
        return !!this.option(actionName) ||
            this.hasEvent(this._getEventName(actionName));
    },

    isOptionDeprecated: function(name) {
        const deprecatedOptions = this._getDeprecatedOptions();
        return Object.prototype.hasOwnProperty.call(deprecatedOptions, name);
    },

    _setOptionSilent: function(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false;
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
    option: (function() {
        const normalizeOptionName = function(that, name) {
            let deprecate;
            if(name) {
                if(!that._cachedDeprecateNames) {
                    that._cachedDeprecateNames = [];
                    for(const optionName in that._deprecatedOptions) {
                        that._cachedDeprecateNames.push(optionName);
                    }
                }
                for(let i = 0; i < that._cachedDeprecateNames.length; i++) {
                    if(that._cachedDeprecateNames[i] === name) {
                        deprecate = that._deprecatedOptions[name];
                        break;
                    }
                }
                if(deprecate) {
                    that._logWarningIfDeprecated(name);
                    const alias = deprecate.alias;

                    if(alias) {
                        name = alias;
                    }
                }
            }

            return name;
        };

        const getPreviousName = function(fullName) {
            const splitNames = fullName.split('.');
            splitNames.pop();
            return splitNames.join('.');
        };

        const getFieldName = function(fullName) {
            const splitNames = fullName.split('.');
            return splitNames[splitNames.length - 1];
        };

        const getOptionValue = function(options, name, unwrapObservables) {
            let getter = cachedGetters[name];
            if(!getter) {
                getter = cachedGetters[name] = coreDataUtils.compileGetter(name);
            }

            return getter(options, { functionsAsIs: true, unwrapObservables: unwrapObservables });
        };

        const clearOptionsField = function(options, name) {
            delete options[name];

            const previousFieldName = getPreviousName(name);
            const fieldName = getFieldName(name);
            const fieldObject = previousFieldName ? getOptionValue(options, previousFieldName, false) : options;

            if(fieldObject) {
                delete fieldObject[fieldName];
            }
        };

        const setOptionsField = function(options, fullName, value) {
            let fieldName = '';
            let fieldObject;

            do {
                if(fieldName) {
                    fieldName = '.' + fieldName;
                }

                fieldName = getFieldName(fullName) + fieldName;
                fullName = getPreviousName(fullName);
                fieldObject = fullName ? getOptionValue(options, fullName, false) : options;

            } while(!fieldObject);

            fieldObject[fieldName] = value;
        };

        const normalizeOptionValue = function(that, options, name, value) {
            if(name) {
                const alias = normalizeOptionName(that, name);

                if(alias && alias !== name) {
                    setOptionsField(options, alias, value);
                    clearOptionsField(options, name);
                }
            }
        };

        var prepareOption = function(that, options, name, value) {
            if(typeUtils.isPlainObject(value)) {
                for(const valueName in value) {
                    prepareOption(that, options, name + '.' + valueName, value[valueName]);
                }
            }

            normalizeOptionValue(that, options, name, value);
        };

        const setOptionValue = function(that, name, value) {
            if(!cachedSetters[name]) {
                cachedSetters[name] = coreDataUtils.compileSetter(name);
            }

            const path = name.split(/[.[]/);

            cachedSetters[name](that._options, value, {
                functionsAsIs: true,
                merge: !that._getOptionsByReference()[name],
                unwrapObservables: path.length > 1 && !!that._getOptionsByReference()[path[0]]
            });
        };

        const setOption = function(that, name, value) {
            const previousValue = getOptionValue(that._options, name, false);

            if(that._optionValuesEqual(name, previousValue, value)) {
                return;
            }

            if(that._initialized) {
                that._optionChanging(name, previousValue, value);
            }

            setOptionValue(that, name, value);
            that._notifyOptionChanged(name, value, previousValue);
        };

        return function(options, value) {
            const that = this;
            let name = options;

            if(arguments.length < 2 && typeUtils.type(name) !== 'object') {
                name = normalizeOptionName(that, name);
                return getOptionValue(that._options, name);
            }

            if(typeof name === 'string') {
                options = {};
                options[name] = value;
            }

            that.beginUpdate();

            try {
                let optionName;
                for(optionName in options) {
                    prepareOption(that, options, optionName, options[optionName]);
                }
                for(optionName in options) {
                    setOption(that, optionName, options[optionName]);
                }
            } finally {
                that.endUpdate();
            }
        };
    })(),

    _getOptionValue: function(name, context) {
        const value = this.option(name);

        if(isFunction(value)) {
            return value.bind(context)();
        }

        return value;
    }
}).include(EventsMixin);

module.exports = Component;
module.exports.PostponedOperations = PostponedOperations;
