var Config = require("./config"),
    extend = require("./utils/extend").extend,
    Options = require("./options/index").Options,
    convertRulesToOptions = require("./options/utils").convertRulesToOptions,
    Class = require("./class"),
    Action = require("./action"),
    errors = require("./errors"),
    commonUtils = require("./utils/common"),
    typeUtils = require("./utils/type"),
    Callbacks = require("./utils/callbacks"),
    EventsStrategy = require("./events_strategy").EventsStrategy,
    publicComponentUtils = require("./utils/public_component"),
    PostponedOperations = require("./postponed_operations").PostponedOperations,

    isFunction = typeUtils.isFunction,
    noop = commonUtils.noop;

/**
* @name Component
* @type object
* @module core/component
* @export default
* @namespace DevExpress
* @hidden
*/
var Component = Class.inherit({
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
        this._options.applyRules(rules);
    },

    _convertRulesToOptions(rules) {
        return convertRulesToOptions(rules);
    },

    _isInitialOptionValue(name) {
        return this._options.isInitial(name);
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

        this._eventsStrategy = EventsStrategy.setEventsStrategy(this, options.eventsStrategy);

        this._updateLockCount = 0;

        this._optionChangedCallbacks = options._optionChangedCallbacks || Callbacks();
        this._disposingCallbacks = options._disposingCallbacks || Callbacks();
        this.postponedOperations = new PostponedOperations();
        this._createOptions(options);
    },

    _createOptions(options) {
        this.beginUpdate();

        try {
            this._setOptionsByReference();
            this._setDeprecatedOptions();
            this._options = new Options(
                this._getDefaultOptions(),
                this._getDefaultOptions(),
                this._getOptionsByReference(),
                this._getDeprecatedOptions()
            );

            this._options.onChanging(
                (name, previousValue, value) => this._initialized && this._optionChanging(name, previousValue, value));
            this._options.onDeprecated(
                (option, info) => this._logDeprecatedWarning(option, info));
            this._options.onChanged(
                (name, value, previousValue) => this._notifyOptionChanged(name, value, previousValue));
            this._options.addRules(this._defaultOptionsRules());

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

        this.on("disposing", (args) => {
            this._disposingCallbacks.fireWith(this, [args]);
        });
    },

    _logDeprecatedWarning(option, info) {
        var message = info.message || ("Use the '" + info.alias + "' option instead");
        errors.log("W0001", this.NAME, option, info.since, message);
    },

    _createOptionChangedAction() {
        this._optionChangedAction = this._createActionByOption("onOptionChanged", { excludeValidators: ["disabled", "readOnly"] });
    },

    _createDisposingAction() {
        this._disposingAction = this._createActionByOption("onDisposing", { excludeValidators: ["disabled", "readOnly"] });
    },

    _optionChanged(args) {
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

    _dispose() {
        this._optionChangedCallbacks.empty();
        this._createDisposingAction();
        this._disposingAction();
        this._eventsStrategy.dispose();
        this._options.dispose();
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
                    this._createActionByOption("onInitialized", { excludeValidators: ["disabled", "readOnly"] })();
                    this._updateLockCount--;
                    this._initialized = true;
                }
            }
        }
    },

    _optionChanging: noop,

    _notifyOptionChanged(option, value, previousValue) {
        var that = this;

        if(this._initialized) {
            var optionNames = [option].concat(this._options.getAliasesByName(option));
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

    initialOption(name) {
        return this._options.initial(name);
    },

    _defaultActionConfig() {
        return {
            context: this,
            component: this
        };
    },

    _defaultActionArgs() {
        return {
            component: this
        };
    },

    _createAction(actionSource, config) {
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

    _createActionByOption(optionName, config) {
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

            if(!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !that._eventsStrategy.hasEvent(eventName)) {
                return;
            }

            if(!action) {
                var beforeExecute = config.beforeExecute;
                config.beforeExecute = function(args) {
                    beforeExecute && beforeExecute.apply(that, arguments);
                    that._eventsStrategy.fireEvent(eventName, args.args);
                };
                action = that._createAction(actionFunc, config);
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

    _getOptionByStealth(name) {
        return this._options.silent(name);
    },

    _setOptionByStealth(options, value) {
        this._options.silent(options, value);
    },

    _getEventName(actionName) {
        return actionName.charAt(2).toLowerCase() + actionName.substr(3);
    },

    /**
     * @name ComponentMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    /**
     * @name ComponentMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @return this
     */
    on(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this;
    },

    /**
     * @name ComponentMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     */
    /**
     * @name ComponentMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    off(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    },

    hasActionSubscription(actionName) {
        return !!this.option(actionName) ||
            this._eventsStrategy.hasEvent(this._getEventName(actionName));
    },

    isOptionDeprecated(name) {
        return this._options.isDeprecated(name);
    },

    _setOptionSilent(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false;
    },

    _getOptionValue(name, context) {
        var value = this.option(name);

        if(isFunction(value)) {
            return value.bind(context)();
        }

        return value;
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
        if(arguments.length < 2 && typeUtils.type(options) !== "object") {
            return this._options.option(options);
        } else {
            this.beginUpdate();

            try {
                this._options.option(options, value);
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
        this._options.reset(name);
        this.endUpdate();
    }
});

module.exports = Component;
