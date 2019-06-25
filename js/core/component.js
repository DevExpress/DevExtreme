var Config = require("./config"),
    domAdapter = require("./dom_adapter"),
    extend = require("./utils/extend").extend,
    Class = require("./class"),
    Action = require("./action"),
    errors = require("./errors"),
    coreDataUtils = require("./utils/data"),
    commonUtils = require("./utils/common"),
    typeUtils = require("./utils/type"),
    deferredUtils = require("../core/utils/deferred"),
    Deferred = deferredUtils.Deferred,
    when = deferredUtils.when,
    Callbacks = require("./utils/callbacks"),
    EventsMixin = require("./events_mixin"),
    publicComponentUtils = require("./utils/public_component"),
    devices = require("./devices"),
    isFunction = typeUtils.isFunction,
    noop = commonUtils.noop;

var cachedGetters = {};
var cachedSetters = {};

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
            var completePromise = new Deferred();
            this._postponedOperations[key] = {
                fn: fn,
                completePromise: completePromise,
                promises: postponedPromise ? [postponedPromise] : []
            };
        }

        return this._postponedOperations[key].completePromise.promise();
    }

    callPostponedOperations() {
        for(var key in this._postponedOperations) {
            var operation = this._postponedOperations[key];

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

var Component = Class.inherit({

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
        var rules = this._defaultOptionsRules();

        if(Array.isArray(customRules)) {
            rules = rules.concat(customRules);
        }

        var rulesOptions = this._convertRulesToOptions(rules);

        extend(true, this._options, rulesOptions);

        for(var fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                this._options[fieldName] = rulesOptions[fieldName];
            }
        }
    },

    _convertRulesToOptions: function(rules) {
        var options = {};
        var currentDevice = devices.current();
        var deviceMatch = function(device, filter) {
            var filterArray = [];

            Array.prototype.push.call(filterArray, filter);

            return (filterArray.length === 1 && typeUtils.isEmptyObject(filterArray[0]))
                || commonUtils.findBestMatches(device, filterArray).length > 0;
        };

        for(var i = 0; i < rules.length; i++) {
            var rule = rules[i],
                deviceFilter = rule.device || { },
                match;

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
        var optionValue = this.option(name),
            initialOptionValue = this.initialOption(name),
            isInitialOption = isFunction(optionValue) && isFunction(initialOptionValue) ? optionValue.toString() === initialOptionValue.toString() : commonUtils.equalByValue(optionValue, initialOptionValue);

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

        var oldValueIsNaN = oldValue !== oldValue,
            newValueIsNaN = newValue !== newValue;
        if(oldValueIsNaN && newValueIsNaN) {
            return true;
        }

        if(oldValue === null || typeof oldValue !== "object" || domAdapter.isElementNode(oldValue)) {
            return oldValue === newValue;
        }

        return false;
    },

    _init: function() {
        this._createOptionChangedAction();

        this.on("disposing", function(args) {
            this._disposingCallbacks.fireWith(this, [args]);
        }.bind(this));
    },

    _createOptionChangedAction: function() {
        this._optionChangedAction = this._createActionByOption("onOptionChanged", { excludeValidators: ["disabled", "readOnly"] });
    },

    _createDisposingAction: function() {
        this._disposingAction = this._createActionByOption("onDisposing", { excludeValidators: ["disabled", "readOnly"] });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onDisposing":
            case "onInitialized":
                break;
            case "onOptionChanged":
                this._createOptionChangedAction();
                break;
            case "defaultOptionsRules":
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
                    this._createActionByOption("onInitialized", { excludeValidators: ["disabled", "readOnly"] })();
                    this._updateLockCount--;
                    this._initialized = true;
                }
            }
        }
    },

    _logWarningIfDeprecated: function(option) {
        var info = this._deprecatedOptions[option];
        if(info && !this._deprecatedOptionsSuppressed) {
            this._logDeprecatedWarning(option, info);
        }
    },

    _logDeprecatedWarningCount: 0,

    _logDeprecatedWarning: function(option, info) {
        var message = info.message || ("Use the '" + info.alias + "' option instead");
        errors.log("W0001", this.NAME, option, info.since, message);
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
        var that = this;

        if(this._initialized) {
            var optionNames = [option].concat(that._getOptionAliasesByName(option));
            for(var i = 0; i < optionNames.length; i++) {
                var name = optionNames[i],
                    args = {
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
        var currentOptions,
            currentInitialized = this._initialized;
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
        var that = this,
            action;

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
        var that = this,
            action,
            eventName,
            actionFunc;

        var result = function() {
            if(!eventName) {
                config = config || {};

                if(typeof optionName !== "string") {
                    throw errors.Error("E0008");
                }

                if(optionName.indexOf("on") === 0) {
                    eventName = that._getEventName(optionName);
                }
                ///#DEBUG
                if(optionName.indexOf("on") !== 0) {
                    throw Error("The '" + optionName + "' option name should start with 'on' prefix");
                }
                ///#ENDDEBUG

                actionFunc = that.option(optionName);
            }

            if(!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !that.hasEvent(eventName)) {
                return;
            }

            if(!action) {
                var beforeExecute = config.beforeExecute;
                config.beforeExecute = function(args) {
                    beforeExecute && beforeExecute.apply(that, arguments);
                    that.fireEvent(eventName, args.args);
                };
                that._suppressDeprecatedWarnings();
                action = that._createAction(actionFunc, config);
                that._resumeDeprecatedWarnings();
            }

            if(Config().wrapActionsBeforeExecute) {
                var beforeActionExecute = that.option("beforeActionExecute") || noop;
                var wrappedAction = beforeActionExecute(that, action, config) || action;
                return wrappedAction.apply(that, arguments);
            }

            return action.apply(that, arguments);
        };

        if(!Config().wrapActionsBeforeExecute) {
            var onActionCreated = that.option("onActionCreated") || noop;
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
        var deprecatedOptions = this._getDeprecatedOptions();
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
        var normalizeOptionName = function(that, name) {
            var deprecate;
            if(name) {
                if(!that._cachedDeprecateNames) {
                    that._cachedDeprecateNames = [];
                    for(var optionName in that._deprecatedOptions) {
                        that._cachedDeprecateNames.push(optionName);
                    }
                }
                for(var i = 0; i < that._cachedDeprecateNames.length; i++) {
                    if(that._cachedDeprecateNames[i] === name) {
                        deprecate = that._deprecatedOptions[name];
                        break;
                    }
                }
                if(deprecate) {
                    that._logWarningIfDeprecated(name);
                    var alias = deprecate.alias;

                    if(alias) {
                        name = alias;
                    }
                }
            }

            return name;
        };

        var getPreviousName = function(fullName) {
            var splitNames = fullName.split('.');
            splitNames.pop();
            return splitNames.join('.');
        };

        var getFieldName = function(fullName) {
            var splitNames = fullName.split('.');
            return splitNames[splitNames.length - 1];
        };

        var getOptionValue = function(options, name, unwrapObservables) {
            var getter = cachedGetters[name];
            if(!getter) {
                getter = cachedGetters[name] = coreDataUtils.compileGetter(name);
            }

            return getter(options, { functionsAsIs: true, unwrapObservables: unwrapObservables });
        };

        var clearOptionsField = function(options, name) {
            delete options[name];

            var previousFieldName = getPreviousName(name),
                fieldName = getFieldName(name),
                fieldObject = previousFieldName ? getOptionValue(options, previousFieldName, false) : options;

            if(fieldObject) {
                delete fieldObject[fieldName];
            }
        };

        var setOptionsField = function(options, fullName, value) {
            var fieldName = "",
                fieldObject;

            do {
                if(fieldName) {
                    fieldName = "." + fieldName;
                }

                fieldName = getFieldName(fullName) + fieldName;
                fullName = getPreviousName(fullName);
                fieldObject = fullName ? getOptionValue(options, fullName, false) : options;

            } while(!fieldObject);

            fieldObject[fieldName] = value;
        };

        var normalizeOptionValue = function(that, options, name, value) {
            if(name) {
                var alias = normalizeOptionName(that, name);

                if(alias && alias !== name) {
                    setOptionsField(options, alias, value);
                    clearOptionsField(options, name);
                }
            }
        };

        var prepareOption = function(that, options, name, value) {
            if(typeUtils.isPlainObject(value)) {
                for(var valueName in value) {
                    prepareOption(that, options, name + "." + valueName, value[valueName]);
                }
            }

            normalizeOptionValue(that, options, name, value);
        };

        var setOptionValue = function(that, name, value) {
            if(!cachedSetters[name]) {
                cachedSetters[name] = coreDataUtils.compileSetter(name);
            }

            var path = name.split(/[.[]/);

            cachedSetters[name](that._options, value, {
                functionsAsIs: true,
                merge: !that._getOptionsByReference()[name],
                unwrapObservables: path.length > 1 && !!that._getOptionsByReference()[path[0]]
            });
        };

        var setOption = function(that, name, value) {
            var previousValue = getOptionValue(that._options, name, false);

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
            var that = this,
                name = options;

            if(arguments.length < 2 && typeUtils.type(name) !== "object") {
                name = normalizeOptionName(that, name);
                return getOptionValue(that._options, name);
            }

            if(typeof name === "string") {
                options = {};
                options[name] = value;
            }

            that.beginUpdate();

            try {
                var optionName;
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
        var value = this.option(name);

        if(isFunction(value)) {
            return value.bind(context)();
        }

        return value;
    }
}).include(EventsMixin);

module.exports = Component;
module.exports.PostponedOperations = PostponedOperations;
